import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GROQ_API_KEY) {
  console.error('❌ Missing environment variables (SUPABASE or GROQ).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SEO_TRENDING_NICHES = [
  'Programmatic SEO & Backlink Building Automation',
  'Next.js Fullstack SaaS Architecture & Performance Optimization',
  'High-Converting Cold Email Copywriting for B2B Founders',
  'Autonomous AI Agent System Prompts with Tool Calling',
  'Prompt Chaining for Complex Financial Risk Analysis',
  'Conversion Rate Optimization (CRO) Landing Page Auditor',
  'FastAPI Microservices Async Optimization',
  'AI-Powered Code Refactoring & Security Vulnerability Auditor',
];

async function generatePrompts() {
  console.log('🚀 Starting daily SEO prompt generation pipeline...');

  // 1. Fetch available models and professions from Supabase
  const [{ data: models }, { data: professions }] = await Promise.all([
    supabase.from('models').select('id, slug, name'),
    supabase.from('professions').select('id, slug, name'),
  ]);

  if (!models?.length || !professions?.length) {
    console.error('❌ Models or Professions table is empty.');
    return;
  }

  // Pick random trending topics
  const shuffledNiches = [...SEO_TRENDING_NICHES].sort(() => 0.5 - Math.random()).slice(0, 3);

  const promptPayload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an elite prompt engineer and SEO content specialist. Generate EXACTLY 3 high-demand, production-grade system prompts based on current 2026 search trends.
Return ONLY valid raw JSON array containing exactly 3 objects. Do not include markdown codeblocks or intro text.

JSON Schema for each object:
{
  "title": "Clear SEO Title (50-60 chars)",
  "slug": "kebab-case-seo-slug",
  "description": "Crisp 1-2 sentence meta description explaining what the prompt does.",
  "content": "Detailed, robust multi-step system prompt with variable placeholders like [INSERT_DATA].",
  "tags": ["tag1", "tag2", "tag3"],
  "model_slug": "chatgpt" | "claude" | "gemini" | "deepseek",
  "profession_slug": "developer" | "marketing" | "founder" | "writer" | "designer"
}`,
      },
      {
        role: 'user',
        content: `Generate 3 production-grade system prompts targeting these 3 SEO topics:\n1. ${shuffledNiches[0]}\n2. ${shuffledNiches[1]}\n3. ${shuffledNiches[2]}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(promptPayload),
  });

  if (!response.ok) {
    throw new Error(`Groq API failed with status ${response.status}`);
  }

  const rawData = await response.json();
  const rawText = rawData.choices[0].message.content.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
  
  let generatedList = [];
  try {
    generatedList = JSON.parse(rawText);
  } catch (err) {
    console.error('❌ Failed to parse JSON from AI response:', rawText);
    return;
  }

  const modelMap = {};
  models.forEach((m) => { modelMap[m.slug.toLowerCase()] = m.id; });
  const defaultModelId = models[0].id;

  const profMap = {};
  professions.forEach((p) => { profMap[p.slug.toLowerCase()] = p.id; });
  const defaultProfId = professions[0].id;

  for (const item of generatedList) {
    const modelId = modelMap[item.model_slug?.toLowerCase()] || defaultModelId;
    const profId = profMap[item.profession_slug?.toLowerCase()] || defaultProfId;
    const uniqueSlug = `${item.slug}-${Date.now().toString().slice(-4)}`;

    const { error: insertError } = await supabase.from('prompts').insert({
      title: item.title,
      slug: uniqueSlug,
      description: item.description,
      content: item.content,
      model_id: modelId,
      profession_id: profId,
      tags: item.tags || ['ai', 'seo'],
      status: 'published',
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error(`⚠️ Failed to insert prompt: ${item.title}`, insertError.message);
    } else {
      console.log(`✅ Ingested: ${item.title} -> /prompts/${item.model_slug || 'chatgpt'}/${item.profession_slug || 'developer'}/${uniqueSlug}`);
    }
  }

  console.log('🎉 Daily 3 SEO prompts ingestion completed successfully!');
}

generatePrompts().catch((e) => {
  console.error('Fatal Pipeline Error:', e);
  process.exit(1);
});
