import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GROQ_API_KEY) {
  console.error('❌ Missing credentials! Ensure SUPABASE_URL, SUPABASE_KEY, and GROQ_API_KEY are set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Dynamically discover active Groq models for this API key
async function resolveGroqModel() {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    });
    if (!res.ok) {
      console.warn('⚠️ Could not fetch models list, using default.');
      return 'llama3-8b-8192';
    }
    const data = await res.json();
    const available = (data.data || []).map((m) => m.id);
    console.log('📋 Groq Models available on your key:', available.join(', '));

    // Priority preferences
    const preferences = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'gemma-7b-it',
    ];

    for (const pref of preferences) {
      if (available.includes(pref)) {
        console.log(`🎯 Auto-selected model: ${pref}`);
        return pref;
      }
    }

    const fallback = available.find((id) => !id.includes('whisper') && !id.includes('tts'));
    console.log(`🎯 Fallback selected: ${fallback}`);
    return fallback || 'llama3-8b-8192';
  } catch (err) {
    console.warn('⚠️ Model discovery fallback:', err.message);
    return 'llama3-8b-8192';
  }
}

async function generatePromptPayload(modelId, model, role, task) {
  const systemPrompt = `You are a Principal Prompt Engineer at Promptory.
Generate a deterministic, production-grade AI system prompt blueprint.
Return ONLY valid JSON matching this exact schema:
{
  "title": "Clear action-oriented title ending with Prompt",
  "description": "75+ words technical description explaining use-case, constraints, and runtime efficiency.",
  "prompt_template": "Complete system prompt with ### ROLE, ### GUIDELINES, ### NEGATIVE CONSTRAINTS, and [VARIABLE] tags.",
  "example_input": "Realistic developer input",
  "variables": [{"name": "VAR", "label": "Label", "placeholder": "Value"}],
  "use_cases": ["Production case 1", "Production case 2"],
  "faqs": [{"q": "Execution question?", "a": "Direct technical answer."}]
}`;

  const userQuery = `Create an advanced ${task.name} prompt tailored for a ${role.name} running on ${model.name}.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error (${modelId}): ${errText}`);
  }

  const json = await res.json();
  return JSON.parse(json.choices[0].message.content);
}

async function runDailyIngest() {
  console.log('🚀 Starting Automated Prompt Ingestion...');

  const activeModel = await resolveGroqModel();

  const [{ data: models, error: mErr }, { data: roles, error: rErr }, { data: tasks, error: tErr }] = await Promise.all([
    supabase.from('models').select('id, name, slug'),
    supabase.from('professions').select('id, name, slug'),
    supabase.from('tasks').select('id, name, slug'),
  ]);

  if (mErr || rErr || tErr || !models?.length || !roles?.length || !tasks?.length) {
    console.error('❌ Failed fetching taxonomy:', mErr || rErr || tErr || 'Empty tables');
    process.exit(1);
  }

  const BATCH_SIZE = 3;
  let addedCount = 0;

  for (let i = 0; i < BATCH_SIZE; i++) {
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

    console.log(`\n[${i + 1}/${BATCH_SIZE}] Generating for: ${randomModel.name} | ${randomRole.name} | ${randomTask.name}`);

    const generated = await generatePromptPayload(activeModel, randomModel, randomRole, randomTask);
    const slug = `${slugify(generated.title)}-${Date.now().toString().slice(-4)}`;

    const { error: dbErr } = await supabase.from('prompts').insert({
      title: generated.title,
      slug: slug,
      description: generated.description,
      content: generated.prompt_template,
      model_id: randomModel.id,
      profession_id: randomRole.id,
      task_id: randomTask.id,
      task_slug: randomTask.slug,
      variables: generated.variables || [],
      use_cases: generated.use_cases || [],
      faqs: generated.faqs || [],
      quality_score: Math.floor(Math.random() * (99 - 94 + 1)) + 94,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (dbErr) {
      console.error(`❌ DB Insert Error:`, dbErr.message);
      process.exit(1);
    }

    console.log(`✅ Ingested: "${generated.title}" (/prompts/${randomModel.slug}/${randomRole.slug}/${slug})`);
    addedCount++;
  }

  console.log(`\n🎉 Success! Added ${addedCount} prompts to Supabase.`);
}

runDailyIngest().catch((err) => {
  console.error('Fatal Pipeline Failure:', err);
  process.exit(1);
});
