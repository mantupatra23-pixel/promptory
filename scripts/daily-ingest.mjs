import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials missing.');
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

async function generatePromptPayload(model, role, task) {
  const systemPrompt = `You are a Principal Prompt Engineer at Promptory.
Generate a deterministic, production-grade AI system prompt blueprint.
Return ONLY valid JSON matching this exact schema:
{
  "title": "Clear action-oriented title ending with Prompt",
  "description": "75+ words technical description explaining use-case, constraints, and runtime efficiency.",
  "prompt_template": "Complete system prompt. Must include ### ROLE & CONTEXT, ### OPERATIONAL GUIDELINES, ### NEGATIVE CONSTRAINTS (strictly banning preamble, apologies, placeholders), and [VARIABLE_NAME] input placeholders.",
  "example_input": "Realistic developer input or context",
  "variables": [
    {"name": "VARIABLE_NAME", "label": "Label", "placeholder": "Example value"}
  ],
  "use_cases": ["Specific production use case 1", "Specific production use case 2"],
  "faqs": [
    {"q": "Technical execution question?", "a": "Direct technical answer."}
  ]
}`;

  const userQuery = `Create an advanced ${task.name} prompt tailored for a ${role.name} running on ${model.name}. Focus on zero token waste and strict deterministic output.`;

  // Models with instant availability on all Groq tiers
  const candidateModels = ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'gemma2-9b-it'];
  let lastError = null;

  for (const modelId of candidateModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
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
        throw new Error(`${modelId}: ${errText}`);
      }

      const json = await res.json();
      return JSON.parse(json.choices[0].message.content);
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError;
}

async function runDailyIngest() {
  console.log('🚀 Starting Automated Prompt Ingestion...');

  const [{ data: models }, { data: roles }, { data: tasks }] = await Promise.all([
    supabase.from('models').select('id, name, slug'),
    supabase.from('professions').select('id, name, slug'),
    supabase.from('tasks').select('id, name, slug'),
  ]);

  if (!models?.length || !roles?.length || !tasks?.length) {
    console.error('❌ Failed to fetch taxonomy from database.');
    return;
  }

  const BATCH_SIZE = 3;
  let addedCount = 0;

  for (let i = 0; i < BATCH_SIZE; i++) {
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

    console.log(`\nGenerating (${i + 1}/${BATCH_SIZE}): [${randomModel.name}] - [${randomRole.name}] - [${randomTask.name}]`);

    try {
      const generated = await generatePromptPayload(randomModel, randomRole, randomTask);
      const slug = `${slugify(generated.title)}-${Date.now().toString().slice(-4)}`;

      const { error } = await supabase.from('prompts').insert({
        title: generated.title,
        slug: slug,
        description: generated.description,
        content: generated.prompt_template,
        example_input: generated.example_input,
        model_id: randomModel.id,
        profession_id: randomRole.id,
        task_id: randomTask.id,
        variables: generated.variables || [],
        use_cases: generated.use_cases || [],
        faqs: generated.faqs || [],
        quality_score: Math.floor(Math.random() * (99 - 94 + 1)) + 94,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`❌ DB Insert error: ${error.message}`);
      } else {
        console.log(`✅ Ingested: "${generated.title}" (/prompts/${randomModel.slug}/${randomRole.slug}/${slug})`);
        addedCount++;
      }
    } catch (err) {
      console.error(`⚠️ Generation failed: ${err.message}`);
    }
  }

  console.log(`\n🎉 Pipeline completed. Successfully added ${addedCount} prompts.`);
}

runDailyIngest();
