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
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are the ultra-fast execution preview engine for Promptory.xyz. Execute the user prompt strictly according to its instructions. If a JSON schema or specific format is requested, output valid JSON only with zero conversational preamble, zero apologies, and no markdown wrapping.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
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
    const output = data.choices?.[0]?.message?.content || 'No output produced by the runtime.';

    return NextResponse.json({
      success: true,
      output,
      latency: `${latencyMs}ms`,
      latencyMs,
      model: 'Llama 3.1 8B Instant (Groq Runtime)'
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
