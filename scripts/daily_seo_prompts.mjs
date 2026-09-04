import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { sanitizeClaims, calculateContentQualityScore } from '../lib/prompts/normalizePrompt.js';
import { computeJaccardSimilarity, tokenizeText } from '../lib/content/duplicateDetection.js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const isDryRun = process.argv.includes('--dry-run');

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

function createCleanSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 55);
}

async function runGenerator() {
  console.log(`\n=== PROMPTORY QUALITY-GATED TOPIC GENERATOR ===`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'PRODUCTION'}\n`);

  const topicQueuePath = 'data/seo-topic-queue.json';
  if (!fs.existsSync(topicQueuePath)) {
    console.error('Topic queue data/seo-topic-queue.json not found.');
    process.exit(1);
  }

  const queue = JSON.parse(fs.readFileSync(topicQueuePath, 'utf8'));

  const { data: dbModels } = await supabase.from('models').select('id, slug');
  const { data: dbRoles } = await supabase.from('professions').select('id, slug');
  const { data: dbTasks } = await supabase.from('tasks').select('id, slug');
  const { data: existingPrompts } = await supabase.from('prompts').select('id, slug, title, prompt_template, prompt');

  const modelMap = new Map((dbModels || []).map((m) => [m.slug, m.id]));
  const roleMap = new Map((dbRoles || []).map((r) => [r.slug, r.id]));
  const taskMap = new Map((dbTasks || []).map((t) => [t.slug, t.id]));

  let published = 0;

  for (const item of queue) {
    if (published >= 3) break;

    const baseSlug = createCleanSlug(item.topic);

    // 1. Topic Collision Check
    const exists = (existingPrompts || []).some(
      (p) => p.slug === baseSlug || p.title.toLowerCase().includes(item.topic.toLowerCase())
    );

    if (exists) {
      console.log(`[SKIP] Topic exists in directory: "${item.topic}"`);
      continue;
    }

    console.log(`[GENERATING] Processing queue topic: "${item.topic}"`);

    const instruction = `
You are a software engineer creating an AI system prompt.
Topic: ${item.topic}
Task: ${item.task}
Technology: ${item.technology}

Provide unescaped JSON matching:
{
  "title": "${item.topic} Prompt",
  "description": "Factual description without marketing hype (120-160 chars)",
  "prompt_template": "Complete structured prompt: ROLE, OBJECTIVE, CONTEXT, CONSTRAINTS, PROCESS, OUTPUT FORMAT.",
  "variables": [{ "name": "VAR_NAME", "label": "Label", "placeholder": "Example" }],
  "use_cases": ["Practical use case 1", "Practical use case 2"],
  "limitations": ["Clear limitation 1", "Clear limitation 2"],
  "tags": ["${item.technology.toLowerCase()}", "${item.task}"],
  "faqs": [{ "question": "Question 1?", "answer": "Factual technical answer without claims." }]
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
          messages: [{ role: 'system', content: instruction }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) continue;

      const rawJson = await response.json();
      const generated = JSON.parse(rawJson.choices[0].message.content);

      const title = sanitizeClaims(generated.title);
      const description = sanitizeClaims(generated.description);
      const promptBody = sanitizeClaims(generated.prompt_template);

      // 2. Duplicate Body Check
      const newTokens = tokenizeText(promptBody.slice(0, 1200));
      let isNearDuplicate = false;

      for (const ep of (existingPrompts || [])) {
        const epBody = ep.prompt_template || ep.prompt || '';
        const epTokens = tokenizeText(epBody.slice(0, 1200));
        if (computeJaccardSimilarity(newTokens, epTokens) >= 0.85) {
          isNearDuplicate = true;
          break;
        }
      }

      if (isNearDuplicate) {
        console.warn(`[REJECTED] Generated prompt is near-duplicate of existing prompt.`);
        continue;
      }

      // 3. Quality Gate
      const score = calculateContentQualityScore(generated, promptBody);
      if (score < 70) {
        console.warn(`[REJECTED] Quality score ${score}/100 below gate threshold.`);
        continue;
      }

      const modelId = modelMap.get('deepseek');
      const professionId = roleMap.get(ROLE_ALIASES[item.audience] || 'software-developer');
      const taskId = taskMap.get(item.task);

      if (!modelId || !professionId || !taskId) {
        console.error(`[REJECTED] Unresolved foreign key.`);
        continue;
      }

      if (isDryRun) {
        console.log(`  [DRY RUN PASS] Score: ${score}/100 | Slug: ${baseSlug} | Task: ${item.task}`);
        published++;
        continue;
      }

      const { error: insertErr } = await supabase.from('prompts').insert({
        title,
        slug: baseSlug,
        description,
        prompt_template: promptBody,
        model_id: modelId,
        profession_id: professionId,
        task_id: taskId,
        task_slug: item.task,
        tags: generated.tags || [item.task],
        variables: generated.variables || [],
        use_cases: generated.use_cases || [],
        limitations: generated.limitations || [],
        faqs: generated.faqs || [],
        quality_score: 92,
        status: 'published',
        updated_at: new Date().toISOString(),
      });

      if (!insertErr) {
        console.log(`[PUBLISHED] /prompts/deepseek/${item.audience}/${baseSlug}`);
        published++;
      }
    } catch (err) {
      console.error('Exception during generation:', err.message);
    }
  }

  console.log(`Run complete. Published: ${published}`);
}

runGenerator();
