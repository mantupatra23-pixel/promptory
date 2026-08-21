import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = {};
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim();
  });
}

const url = env.NEXT_PUBLIC_SUPABASE_URL || 'https://lcmosfhqeevwcwsogpts.supabase.co';
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

const batchPrompts = [
  {
    title: 'High-Converting SaaS Landing Page Copy Audit',
    slug: 'saas-landing-page-audit',
    modelSlug: 'claude',
    profSlug: 'founder',
    taskSlug: 'content-outline',
    description: 'Audit above-the-fold hero copy, value proposition clarity, and social proof placement for SaaS landing pages.',
    prompt_template: 'You are a Conversion Rate Optimization (CRO) expert. Review this SaaS hero copy:\n\nHero Headline: [HERO_HEADLINE]\nSubheadline: [SUBHEADLINE]\nTarget Customer: [TARGET_CUSTOMER]\nPrimary CTA: [PRIMARY_CTA]\n\nDeliverables:\n1. Critique on clarity and friction points\n2. 3 high-converting headline variations\n3. Value proposition rewrite with objection handling',
    example_input: 'Hero Headline: The AI tool for prompt engineers\nSubheadline: Generate prompts faster\nTarget Customer: Solo SaaS builders\nPrimary CTA: Get Started Free',
    example_output: 'Headline Rewrite 1: Ship Production AI Prompts 10x Faster Without the Guesswork.\nHeadline Rewrite 2: The Curated Prompt Engineering Engine for Next.js and FastAPI Developers.',
    quality_score: 96,
  },
  {
    title: 'FastAPI REST Endpoint Performance Optimizer',
    slug: 'fastapi-performance-optimizer',
    modelSlug: 'claude',
    profSlug: 'developer',
    taskSlug: 'code-review',
    description: 'Pinpoint async event-loop bottlenecks, DB connection pooling issues, and slow JSON serialization.',
    prompt_template: 'Act as a Senior Python Backend Architect. Review this FastAPI route:\n\nEndpoint Code:\n[INSERT_CODE]\n\nExpected Load: [REQUESTS_PER_SECOND] req/sec\nDatabase Engine: [DATABASE_ENGINE]\n\nAnalyze:\n1. Async / Await blocking calls\n2. Query optimizations (N+1 problems)\n3. Pydantic serialization overhead\nProvide refactored code with benchmarks.',
    example_input: 'Expected Load: 500 req/sec\nDatabase Engine: PostgreSQL',
    example_output: 'Refactor complete: Replaced synchronous session calls with AsyncSession, added orjson custom response serializer for 3x throughput.',
    quality_score: 97,
  },
  {
    title: 'Programmatic Long-Tail SEO Article Generator',
    slug: 'programmatic-seo-generator',
    modelSlug: 'gemini',
    profSlug: 'seo-specialist',
    taskSlug: 'content-outline',
    description: 'Generate comprehensive long-form articles targeting commercial investigation search intent with FAQ schema.',
    prompt_template: 'You are an elite programmatic SEO specialist. Write a comprehensive guide for:\n\nKeyword: [PRIMARY_KEYWORD]\nSearch Intent: [COMMERCIAL / TRANSACTIONAL / INFORMATIONAL]\nTarget Audience: [TARGET_AUDIENCE]\nWord Count Target: [WORD_COUNT]\n\nStructure:\n- Hook Introduction\n- Key Evaluation Criteria\n- Step-by-Step Practical Implementation\n- Common Pitfalls to Avoid\n- 4 FAQs with schema formatting',
    example_input: 'Keyword: top ai prompt libraries for developers\nSearch Intent: Commercial\nTarget Audience: AI developers and software engineers\nWord Count Target: 1500 words',
    example_output: 'Generated 1,500 word comprehensive guide with comparative benchmark tables and clean FAQ schema markup.',
    quality_score: 94,
  },
  {
    title: 'Cold Outreach Hook for Technical B2B Buyers',
    slug: 'technical-b2b-outreach',
    modelSlug: 'chatgpt',
    profSlug: 'marketer',
    taskSlug: 'cold-email',
    description: 'Write concise, no-fluff cold emails tailored to VP of Engineering and CTO personas.',
    prompt_template: 'Act as a B2B SaaS Sales Director. Write an outbound email to:\n\nProspect: [PROSPECT_NAME], [PROSPECT_TITLE] at [COMPANY_NAME]\nPain Point: [PAIN_POINT]\nValue Prop: [ONE_SENTENCE_VALUE]\nTone: [DIRECT / PEER_TO_PEER]\n\nRules: Keep body under 70 words, zero fake compliments, low-friction ask.',
    example_input: 'Prospect: Sarah Chen, CTO at FinScale\nPain Point: High Supabase egress latency\nValue Prop: Caching layer reducing database latency by 65%\nTone: Direct and technical',
    example_output: 'Hi Sarah,\n\nNoticed FinScale scaling database clusters across regions. Most teams hit latency spikes at this stage.\n\nWe built an automated Edge caching layer that cuts Postgres read latency by 65% with zero schema changes.\n\nOpen to checking a 2-minute benchmark report?\n\nBest,\nMantu',
    quality_score: 95,
  }
];

async function runBatchSeed() {
  console.log('🚀 Starting batch ingestion into Supabase...');

  const { data: models } = await supabase.from('models').select('id, slug');
  const { data: professions } = await supabase.from('professions').select('id, slug');
  const { data: tasks } = await supabase.from('tasks').select('id, slug');

  const modelMap = Object.fromEntries((models || []).map(m => [m.slug, m.id]));
  const profMap = Object.fromEntries((professions || []).map(p => [p.slug, p.id]));
  const taskMap = Object.fromEntries((tasks || []).map(t => [t.slug, t.id]));

  for (const item of batchPrompts) {
    const modelId = modelMap[item.modelSlug] || Object.values(modelMap)[0];
    const profId = profMap[item.profSlug] || Object.values(profMap)[0];
    const taskId = taskMap[item.taskSlug] || Object.values(taskMap)[0];

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
      use_cases: ['Enterprise workflows', 'Developer automation', 'Production pipelines'],
      common_mistakes: ['Generic inputs without context', 'Skipping constraints'],
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Failed: ${item.title}`, error.message);
    } else {
      console.log(`✅ Ingested: ${item.title}`);
    }
  }

  console.log('\n🎉 Batch ingestion complete!');
}

runBatchSeed();
