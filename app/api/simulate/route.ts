import { NextResponse } from 'next/server';

const VALID_MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b'
];

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const startTime = performance.now();

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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

    if (!groqResponse.ok) {
      const errPayload = await groqResponse.text();
      return NextResponse.json(
        { error: `Groq Gateway Error (${groqResponse.status}): ${errPayload}` },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const msg = data.choices?.[0]?.message;
    const output = (msg?.content && msg.content.trim()) 
      ? msg.content 
      : (msg?.reasoning && msg.reasoning.trim()) 
        ? msg.reasoning 
        : 'Execution finished with no output returned.';

    return NextResponse.json({
      success: true,
      output: output,
      latency_ms: latencyMs,
      modelUsed: model,
      usage: data.usage,
    });

  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Runtime Failure' },
      { status: 500 }
    );
  }
}
