import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = {};
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim();
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://lcmosfhqeevwcwsogpts.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const groqApiKey = process.env.GROQ_API_KEY || env.GROQ_API_KEY;

if (!supabaseKey) {
  console.error('❌ Supabase Anon Key missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePromptsWithGroq() {
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY is missing from environment/secrets.');
    process.exit(1);
  }

  console.log('⚡ Connecting to Groq API...');

  const systemInstruction = `You are a Principal Prompt Engineer. Generate 3 highly specific, battle-tested system prompts in JSON format for technical operators.
Return ONLY a valid JSON object with a "prompts" key containing an array of objects.
Each object must have:
- title: string
- slug: string (unique-kebab-case)
- model_slug: "chatgpt" | "claude" | "gemini" | "deepseek"
- profession_slug: "developer" | "seo-specialist" | "founder" | "marketer"
- task_slug: "code-review" | "client-follow-up" | "content-outline" | "cold-email"
- description: string (under 120 chars)
- prompt_template: string (must include uppercase bracketed variables like [CODE_SNIPPET], [TARGET_GOAL])
- example_input: string
- example_output: string
- quality_score: number between 92 and 99`;

  const modelsToTry = [
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'gemma2-9b-it'
  ];

  let parsed = null;

  for (const model of modelsToTry) {
    try {
      console.log(`\nTesting Groq model: ${model}...`);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey.trim()}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: 'Generate 3 high-converting AI prompt templates in JSON format now.' }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.5
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(`❌ Groq Error (${res.status}) on ${model}:`, JSON.stringify(data));
        continue;
      }

      const content = data.choices?.[0]?.message?.content;
      if (content) {
        parsed = JSON.parse(content);
        console.log(`✅ Success with model: ${model}!`);
        break;
      }
    } catch (err) {
      console.error(`Fetch exception on model ${model}:`, err.message);
    }
  }

  if (!parsed) {
    console.error('❌ All Groq models failed. Check the error logs above.');
    process.exit(1);
  }

  const generatedList = Array.isArray(parsed) ? parsed : (parsed.prompts || Object.values(parsed)[0]);

  console.log(`\n✨ Ingesting ${generatedList.length} prompts into Supabase...`);

  const { data: models } = await supabase.from('models').select('id, slug');
  const { data: professions } = await supabase.from('professions').select('id, slug');
  const { data: tasks } = await supabase.from('tasks').select('id, slug');

  const modelMap = Object.fromEntries((models || []).map(m => [m.slug, m.id]));
  const profMap = Object.fromEntries((professions || []).map(p => [p.slug, p.id]));
  const taskMap = Object.fromEntries((tasks || []).map(t => [t.slug, t.id]));

  for (const item of generatedList) {
    const modelId = modelMap[item.model_slug] || Object.values(modelMap)[0];
    const profId = profMap[item.profession_slug] || Object.values(profMap)[0];
    const taskId = taskMap[item.task_slug] || Object.values(taskMap)[0];

    const { error } = await supabase.from('prompts').upsert({
      title: item.title,
      slug: item.slug,
      model_id: modelId,
      profession_id: profId,
      task_id: taskId,
      description: item.description,
      prompt_template: item.prompt_template,
      example_input: item.example_input,
      example_output: item.example_output,
      quality_score: item.quality_score,
      status: 'published',
      is_featured: true,
      use_cases: ['Autonomous AI pipelines', 'Production development'],
      common_mistakes: ['Lack of explicit constraints', 'Skipping input variables'],
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Ingestion failed for: ${item.title}`, error.message);
    } else {
      console.log(`✅ Ingested: ${item.title}`);
    }
  }

  console.log('\n🎉 Batch ingestion successfully finished!');
}

generatePromptsWithGroq();
