import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    const model = body.model || 'llama-3.3-70b-versatile';

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

    const response = await groq.chat.completions.create({
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
    });

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const msg = response.choices[0]?.message;
    const output = (msg?.content && msg.content.trim()) 
      ? msg.content 
      : 'Execution finished with no output returned.';

    return NextResponse.json({
      success: true,
      output: output,
      latency_ms: latencyMs,
      modelUsed: model,
      usage: response.usage,
    });

  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Runtime Failure' },
      { status: 500 }
    );
  }
}
