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
const isDryRun = process.argv.includes('--dry-run');

// Targeted Topic Queue with priority scores
const TOPIC_QUEUE = [
  {
    topic: 'PostgreSQL Connection Pooling and Max Clients Tuning',
    task_slug: 'database',
    model_slug: 'deepseek',
    role_slug: 'software-developer',
  },
  {
    topic: 'FastAPI Background Tasks and Celery Worker Concurrency',
    task_slug: 'performance',
    model_slug: 'chatgpt',
    role_slug: 'software-developer',
  },
  {
    topic: 'Next.js 14 App Router Dynamic Route Hydration Audit',
    task_slug: 'code-review',
    model_slug: 'claude',
    role_slug: 'software-developer',
  },
  {
    topic: 'Vitest Unit Testing for TypeScript Microservices',
    task_slug: 'testing',
    model_slug: 'claude',
    role_slug: 'software-developer',
  },
  {
    topic: 'NextAuth JWT Session Expiry and Cookie Tampering Audit',
    task_slug: 'security',
    model_slug: 'deepseek',
    role_slug: 'software-developer',
  },
];

const MODEL_ALIASES = {
  chatgpt: 'chatgpt',
  'gpt-4o': 'chatgpt',
  claude: 'claude',
  'claude-3.5-sonnet': 'claude',
  deepseek: 'deepseek',
  'deepseek-r1': 'deepseek',
  gemini: 'gemini',
};

const ROLE_ALIASES = {
  developer: 'software-developer',
  'software-developer': 'software-developer',
  founder: 'founder',
  marketer: 'marketer',
};

function createBaseSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function filterUnsupportedClaims(text) {
  if (!text) return '';
  return text
    .replace(/\bzero[- ]hallucination\b/gi, 'deterministic')
    .replace(/\b100%\s*accurate\b/gi, 'production-focused')
    .replace(/\bguaranteed ranking\b/gi, 'search-optimized')
    .trim();
}

async function runDailyGeneration() {
  console.log(`\n=== PROMPTORY QUALITY-GATED DAILY GENERATOR ===`);
  console.log(`Execution Mode: ${isDryRun ? 'DRY RUN (Validation only)' : 'PRODUCTION'}\n`);

  const { data: dbModels } = await supabase.from('models').select('id, slug');
  const { data: dbRoles } = await supabase.from('professions').select('id, slug');
  const { data: dbTasks } = await supabase.from('tasks').select('id, slug');

  const modelMap = new Map((dbModels || []).map((m) => [m.slug, m.id]));
  const roleMap = new Map((dbRoles || []).map((r) => [r.slug, r.id]));
  const taskMap = new Map((dbTasks || []).map((t) => [t.slug, t.id]));

  let insertedCount = 0;

  for (const item of TOPIC_QUEUE) {
    if (insertedCount >= 3) break;

    // 1. Check existing topic coverage
    const { data: existing } = await supabase
      .from('prompts')
      .select('id, title')
      .or(`title.ilike.%${item.topic}%,slug.ilike.%${createBaseSlug(item.topic)}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`[SKIP] Topic already covered in directory: "${item.topic}"`);
      continue;
    }

    console.log(`[EVALUATING] Candidate topic: "${item.topic}"`);

    const promptSystemInstruction = `
You are a software engineer building production AI system prompts.
Target Task: ${item.task_slug}
Target Model: ${item.model_slug}
Topic: ${item.topic}

Provide unescaped JSON matching:
{
  "title": "Natural search intent title (50-65 chars)",
  "description": "Pragmatic technical summary without hype (120-160 chars)",
  "prompt_template": "Complete structured prompt: ROLE, OBJECTIVE, INPUT CONTEXT, CONSTRAINTS, STEP-BY-STEP PROCESS, and OUTPUT FORMAT.",
  "variables": [{ "name": "VAR_NAME", "label": "Label", "placeholder": "Example" }],
  "use_cases": ["Specific use case 1", "Specific use case 2"],
  "limitations": ["Practical limitation 1", "Practical limitation 2"],
  "tags": ["tag1", "tag2", "tag3"],
  "faqs": [{ "question": "Technical question?", "answer": "Factual answer." }]
}
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
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
        console.error(`[GROQ API ERROR] Status ${response.status}`);
        continue;
      }

      const rawJson = await response.json();
      const generated = JSON.parse(rawJson.choices[0].message.content);

      // Quality Gate Checks
      if (!generated.title || !generated.description || !generated.prompt_template) {
        console.warn(`[REJECTED] Incomplete JSON structure.`);
        continue;
      }

      if (generated.prompt_template.length < 250) {
        console.warn(`[REJECTED] Prompt body too brief (${generated.prompt_template.length} characters).`);
        continue;
      }

      // Validate taxonomy slugs against DB
      const canonicalModelSlug = MODEL_ALIASES[item.model_slug] || item.model_slug;
      const canonicalRoleSlug = ROLE_ALIASES[item.role_slug] || item.role_slug;
      const modelId = modelMap.get(canonicalModelSlug);
      const professionId = roleMap.get(canonicalRoleSlug);
      const taskId = taskMap.get(item.task_slug);

      if (!modelId || !professionId || !taskId) {
        console.error(`[REJECTED] Unresolved foreign key for Model/Role/Task.`);
        continue;
      }

      const cleanTitle = filterUnsupportedClaims(generated.title.trim());
      const cleanDesc = filterUnsupportedClaims(generated.description.trim());
      const cleanBody = filterUnsupportedClaims(generated.prompt_template.trim());
      const baseSlug = createBaseSlug(cleanTitle);

      if (isDryRun) {
        console.log(`  [DRY RUN PASS] Validated: "${cleanTitle}" -> /prompts/${canonicalModelSlug}/${canonicalRoleSlug}/${baseSlug}`);
        insertedCount++;
        continue;
      }

      // Check collision
      const { data: slugCheck } = await supabase.from('prompts').select('id').eq('slug', baseSlug);
      const finalSlug = (slugCheck && slugCheck.length > 0) ? `${baseSlug}-2` : baseSlug;

      const { error: insertErr } = await supabase.from('prompts').insert({
        title: cleanTitle,
        slug: finalSlug,
        description: cleanDesc,
        prompt_template: cleanBody,
        model_id: modelId,
        profession_id: professionId,
        task_id: taskId,
        task_slug: item.task_slug,
        tags: generated.tags || [item.task_slug],
        variables: generated.variables || [],
        use_cases: generated.use_cases || [],
        limitations: generated.limitations || [],
        faqs: generated.faqs || [],
        quality_score: 92,
        status: 'published',
        updated_at: new Date().toISOString(),
      });

      if (insertErr) {
        console.error(`[INSERT ERROR] ${insertErr.message}`);
      } else {
        console.log(`[SUCCESS] Published: /prompts/${canonicalModelSlug}/${canonicalRoleSlug}/${finalSlug}`);
        insertedCount++;
      }
    } catch (err) {
      console.error('[ERROR] Generation exception:', err.message);
    }
  }

  console.log(`\nRun finished. Total prompts processed: ${insertedCount}`);
}

runDailyGeneration();
