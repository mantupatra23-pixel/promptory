import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { compiledPrompt, targetModel } = await req.json();

    if (!compiledPrompt || compiledPrompt.trim() === '') {
      return NextResponse.json(
        { error: 'Compiled prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is not configured on server' },
        { status: 500 }
      );
    }

    // Call Groq with ultra-fast Llama-3.1-8b-instant (800+ tokens/sec)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            content: 'You are an ultra-fast runtime preview engine for Promptory. Strictly execute the prompt instructions provided. If the prompt specifies a JSON format, output valid JSON only without preamble or markdown commentary.'
          },
          {
            role: 'user',
            content: compiledPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      return NextResponse.json(
        { error: `Groq error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || 'No output generated.';

    return NextResponse.json({
      success: true,
      output: resultText,
      modelUsed: 'Llama 3.1 8B Instant (Groq Runtime)',
      latencyMs: data.usage?.total_time ? Math.round(data.usage.total_time * 1000) : null
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Simulation Error' },
      { status: 500 }
    );
  }
}
