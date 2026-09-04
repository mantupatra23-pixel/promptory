// scripts/daily_seo_prompts.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GROQ_API_KEY) {
  console.error('[FATAL] Missing required credentials in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Structured High-Intent Engineering Topic Queue
const TOPIC_QUEUE = [
  {
    topic: 'PostgreSQL EXPLAIN ANALYZE Query Bottleneck Diagnosis',
    task_slug: 'database',
    model_slug: 'deepseek',
    role_slug: 'software-developer',
    priority: 10,
  },
  {
    topic: 'FastAPI Concurrency and Async Connection Pooling Optimizer',
    task_slug: 'performance',
    model_slug: 'chatgpt',
    role_slug: 'software-developer',
    priority: 9,
  },
  {
    topic: 'React 19 Server Components SSR Waterfall Reviewer',
    task_slug: 'code-review',
    model_slug: 'claude',
    role_slug: 'software-developer',
    priority: 9,
  },
  {
    topic: 'Playwright Flaky Integration Test Diagnosis',
    task_slug: 'testing',
    model_slug: 'claude',
    role_slug: 'software-developer',
    priority: 8,
  },
  {
    topic: 'Supabase Row Level Security RLS Rule Leakage Auditor',
    task_slug: 'security',
    model_slug: 'deepseek',
    role_slug: 'software-developer',
    priority: 10,
  },
  {
    topic: 'Programmatic Internal Linking Semantic Clustering Planner',
    task_slug: 'seo',
    model_slug: 'gemini',
    role_slug: 'marketer',
    priority: 8,
  },
  {
    topic: 'B2B Founder Technical Cold Outreach Engine',
    task_slug: 'email',
    model_slug: 'chatgpt',
    role_slug: 'founder',
    priority: 8,
  },
];

// Explicit Model and Role Aliases Registry
const MODEL_ALIASES = {
  'chatgpt': 'chatgpt',
  'gpt-4o': 'chatgpt',
  'openai': 'chatgpt',
  'claude': 'claude',
  'claude-3.5-sonnet': 'claude',
  'anthropic': 'claude',
  'deepseek': 'deepseek',
  'deepseek-r1': 'deepseek',
  'gemini': 'gemini',
  'gemini-1.5-pro': 'gemini',
};

const ROLE_ALIASES = {
  'developer': 'software-developer',
  'software-developer': 'software-developer',
  'engineer': 'software-developer',
  'founder': 'founder',
  'marketer': 'marketer',
  'devops': 'devops',
};

function createBaseSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

async function getCollisionSafeSlug(baseSlug) {
  const { data } = await supabase
    .from('prompts')
    .select('slug')
    .like('slug', `${baseSlug}%`);

  if (!data || data.length === 0) {
    return baseSlug;
  }

  const existingSlugs = new Set(data.map((d) => d.slug));
  if (!existingSlugs.has(baseSlug)) return baseSlug;

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}

async function runDailyGeneration() {
  console.log('[START] Starting deterministic prompt generation run...');

  // Fetch active DB models and professions
  const { data: dbModels } = await supabase.from('models').select('id, slug');
  const { data: dbRoles } = await supabase.from('professions').select('id, slug');

  const modelMap = new Map((dbModels || []).map((m) => [m.slug, m.id]));
  const roleMap = new Map((dbRoles || []).map((r) => [r.slug, r.id]));

  let insertedCount = 0;

  for (const item of TOPIC_QUEUE) {
    if (insertedCount >= 3) break; // Strict batch limit of 3 prompts per run

    // Pre-check for duplicate topic/title in DB
    const { data: existing } = await supabase
      .from('prompts')
      .select('id')
      .ilike('title', `%${item.topic}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`[SKIP] Topic already covered in database: ${item.topic}`);
      continue;
    }

    console.log(`[GENERATING] Processing queue topic: "${item.topic}"`);

    const promptSystemInstruction = `
You are an expert prompt engineer generating a deterministic, battle-tested system prompt for Promptory.xyz.
Target Topic: ${item.topic}
Task Category: ${item.task_slug}
Target AI Model: ${item.model_slug}

Respond ONLY with valid, unescaped JSON matching this schema:
{
  "title": "Clear search-intent title without buzzwords (50-70 chars)",
  "description": "Precise summary of the problem this prompt solves and technical inputs (120-160 chars)",
  "prompt_template": "Complete structured prompt containing: ROLE, OBJECTIVE, INPUT CONTEXT, CONSTRAINTS, STEP-BY-STEP PROCESS, and OUTPUT FORMAT.",
  "variables": [
    { "name": "VARIABLE_NAME", "label": "Variable Label", "placeholder": "Example Input" }
  ],
  "use_cases": ["Specific use case 1", "Specific use case 2", "Specific use case 3"],
  "limitations": ["Clear boundary/limitation 1", "Clear boundary/limitation 2"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "faqs": [
    { "question": "Relevant question?", "answer": "Practical, accurate technical answer." },
    { "question": "Relevant question 2?", "answer": "Practical answer 2." }
  ]
}
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: promptSystemInstruction }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        console.error(`[GROQ ERROR] Status ${response.status}`);
        continue;
      }

      const rawJson = await response.json();
      const generated = JSON.parse(rawJson.choices[0].message.content);

      // Validation Gate
      if (!generated.title || !generated.description || !generated.prompt_template) {
        console.warn(`[REJECTED] Incomplete JSON structure for topic: ${item.topic}`);
        continue;
      }

      if (generated.prompt_template.length < 250) {
        console.warn(`[REJECTED] Prompt body too thin (${generated.prompt_template.length} chars).`);
        continue;
      }

      // Resolve Model & Role IDs with Aliases
      const canonicalModelSlug = MODEL_ALIASES[item.model_slug] || item.model_slug;
      const canonicalRoleSlug = ROLE_ALIASES[item.role_slug] || item.role_slug;

      const modelId = modelMap.get(canonicalModelSlug);
      const professionId = roleMap.get(canonicalRoleSlug);

      if (!modelId || !professionId) {
        console.error(`[REJECTED] Invalid Model (${canonicalModelSlug}) or Role (${canonicalRoleSlug}) not found in DB.`);
        continue;
      }

      const cleanSlug = await getCollisionSafeSlug(createBaseSlug(generated.title));

      // Canonical Database Insertion
      const { error: insertError } = await supabase.from('prompts').insert({
        title: generated.title.trim(),
        slug: cleanSlug,
        description: generated.description.trim(),
        prompt_template: generated.prompt_template.trim(),
        model_id: modelId,
        profession_id: professionId,
        task_slug: item.task_slug,
        tags: generated.tags || [item.task_slug],
        variables: generated.variables || [],
        use_cases: generated.use_cases || [],
        limitations: generated.limitations || [],
        faqs: generated.faqs || [],
        quality_score: 98,
        status: 'published',
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error(`[DB ERROR] Failed inserting prompt ${cleanSlug}:`, insertError.message);
      } else {
        console.log(`[SUCCESS] Published prompt: /prompts/${canonicalModelSlug}/${canonicalRoleSlug}/${cleanSlug}`);
        insertedCount++;
      }
    } catch (err) {
      console.error(`[ERROR] Generation exception:`, err.message);
    }
  }

  console.log(`[FINISH] Completed run. Successfully added ${insertedCount} new prompts.`);
}

runDailyGeneration();
