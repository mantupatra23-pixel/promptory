import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const VALID_MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b'
];

async function callGeminiFallback(prompt: string, apiKey: string) {
  const startTime = performance.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'You are an elite production AI execution engine. Provide deterministic, high-density, directly actionable technical output without introductory filler or sign-offs.' }]
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096
        }
      })
    }
  );

  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from Gemini.';
  return { output, latencyMs };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED', message: 'Please sign in to execute AI simulations.' },
        { status: 401 }
      );
    }

    // 1. Check if user is active PRO member
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_email', email)
      .eq('status', 'active')
      .maybeSingle();

    const isPro = sub?.status === 'active';

    // 2. If NOT Pro, enforce strict 1-simulation limit per email
    if (!isPro) {
      const { data: usage } = await supabase
        .from('user_simulations')
        .select('count')
        .eq('user_email', email)
        .maybeSingle();

      if (usage && usage.count >= 3) {
        return NextResponse.json(
          {
            error: 'LIMIT_EXCEEDED',
            message: 'Your account has used all 3 free simulations. Upgrade to Pro for unlimited benchmarks.'
          },
          { status: 403 }
        );
      }
    }

    const prompt = (
      body.prompt || 
      body.promptText || 
      body.compiledPrompt || 
      body.compiled_prompt || 
      ''
    ).trim();

    const requestedModel = body.model;
    const model = VALID_MODELS.includes(requestedModel) 
      ? requestedModel 
      : 'openai/gpt-oss-20b';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt content is required for simulation.' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let finalOutput = '';
    let finalLatency = 0;
    let modelNameUsed = model;

    // Execute with Groq or Fallback to Gemini
    if (groqApiKey) {
      try {
        const startTime = performance.now();
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an elite production AI execution engine. Provide deterministic, high-density, directly actionable technical output without introductory filler or sign-offs.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 4096,
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const msg = data.choices?.[0]?.message;
          finalOutput = msg?.content || msg?.reasoning || 'Execution completed.';
          finalLatency = Math.round(performance.now() - startTime);
        }
      } catch (err) {
        console.warn('Groq failed, trying Gemini...');
      }
    }

    if (!finalOutput && geminiApiKey) {
      const geminiResult = await callGeminiFallback(prompt, geminiApiKey);
      finalOutput = geminiResult.output;
      finalLatency = geminiResult.latencyMs;
      modelNameUsed = 'gemini-2.5-flash (Smart Fallback)';
    }

    if (!finalOutput) {
      return NextResponse.json(
        { error: 'AI execution engines are currently busy. Try again in a few moments.' },
        { status: 503 }
      );
    }

    // 3. Mark free run as used for non-pro user
    if (!isPro) {
      const { data: existingUsage } = await supabase
        .from('user_simulations')
        .select('count')
        .eq('user_email', email)
        .maybeSingle();

      const newCount = (existingUsage?.count || 0) + 1;

      await supabase
        .from('user_simulations')
        .upsert(
          { user_email: email, count: newCount, updated_at: new Date().toISOString() },
          { onConflict: 'user_email' }
        );
    }

    return NextResponse.json({
      success: true,
      output: finalOutput,
      latency_ms: finalLatency,
      modelUsed: modelNameUsed,
    });

  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Runtime Failure' },
      { status: 500 }
    );
  }
}
