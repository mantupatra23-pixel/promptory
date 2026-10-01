import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = (body.compiledPrompt || body.promptText || '').trim();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt content is required for simulation.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GROQ_API_KEY is not configured on the server environment.' 
        },
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
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024,
      }),
    });

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (!groqResponse.ok) {
      const errPayload = await groqResponse.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `Groq Gateway Error (${groqResponse.status}): ${errPayload}` 
        },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const msg = data.choices?.[0]?.message;
    const output = (msg?.content && msg.content.trim()) 
      ? msg.content 
      : (msg?.reasoning && msg.reasoning.trim()) 
        ? msg.reasoning 
        : 'No output produced by the runtime.';

    return NextResponse.json({
      success: true,
      output,
      latency: `${latencyMs}ms`,
      latencyMs,
      model: 'GPT-OSS 20B (Groq Runtime)'
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal Runtime Simulation Failure' 
      },
      { status: 500 }
    );
  }
}
