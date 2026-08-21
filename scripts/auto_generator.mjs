import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = {};
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim();
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://lcmosfhqeevwcwsogpts.supabase.co';
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const groqApiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePromptsWithGroq() {
  if (!groqApiKey) {
    console.log('⚠️ GROQ_API_KEY not found. Set GROQ_API_KEY in .env.local or GitHub Secrets.');
    return;
  }

  console.log('⚡ Connecting to Groq API (Llama-3.3-70b) to generate production prompts...');

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

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: 'Generate 3 battle-tested prompt templates now.' }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6
      })
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from Groq: ' + JSON.stringify(data));

    const parsed = JSON.parse(content);
    const generatedList = Array.isArray(parsed) ? parsed : (parsed.prompts || Object.values(parsed)[0]);

    console.log(`✨ Generated ${generatedList.length} prompts. Ingesting into Supabase...`);

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
        console.error(`❌ Failed: ${item.title}`, error.message);
      } else {
        console.log(`✅ Ingested: ${item.title}`);
      }
    }

    console.log('🎉 Groq batch ingestion successfully completed!');
  } catch (err) {
    console.error('Groq Generation Error:', err);
  }
}

generatePromptsWithGroq();
