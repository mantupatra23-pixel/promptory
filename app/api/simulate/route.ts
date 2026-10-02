import { NextResponse } from 'next/server';

const VALID_MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b'
];

async function callGeminiFallback(prompt: string, apiKey: string) {
  const startTime = performance.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'You are an elite production AI execution engine. Provide deterministic, high-density, directly actionable technical output without introductory filler or sign-offs.' }]
        },
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
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

    // 1. Try Groq if key exists
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
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.2,
            max_tokens: 4096,
          }),
        });

        const endTime = performance.now();
        const latencyMs = Math.round(endTime - startTime);

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const msg = data.choices?.[0]?.message;
          const output = (msg?.content && msg.content.trim()) 
            ? msg.content 
            : (msg?.reasoning && msg.reasoning.trim()) 
              ? msg.reasoning 
              : 'Execution finished with no output returned.';

          return NextResponse.json({
            success: true,
            output,
            latency_ms: latencyMs,
            modelUsed: model,
          });
        }

        console.warn(`Groq API returned ${groqResponse.status}. Triggering Gemini fallback...`);
      } catch (groqErr) {
        console.warn('Groq fetch error. Triggering Gemini fallback...', groqErr);
      }
    }

    // 2. Fallback to Gemini if Groq hit 429/failed or not configured
    if (geminiApiKey) {
      const geminiResult = await callGeminiFallback(prompt, geminiApiKey);
      return NextResponse.json({
        success: true,
        output: geminiResult.output,
        latency_ms: geminiResult.latencyMs,
        modelUsed: 'gemini-1.5-flash (Smart Fallback)',
      });
    }

    return NextResponse.json(
      { error: 'AI provider rate-limited and no Gemini fallback key is configured.' },
      { status: 429 }
    );

  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Runtime Failure' },
      { status: 500 }
    );
  }
}
