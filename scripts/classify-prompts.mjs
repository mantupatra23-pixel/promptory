import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

const isApplyMode = process.argv.includes('--apply');

const CONTROLLED_SIGNALS = {
  database: ['postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sql query', 'explain analyze', 'indexes', 'database migration', 'connection pool'],
  'code-review': ['code review', 'review code', 'pull request', 'pr review', 'clean architecture', 'refactoring', 'code smell', 'anti-pattern'],
  debugging: ['stack trace', 'root cause analysis', 'runtime error', 'debug bug', 'null pointer', 'unhandled exception', 'troubleshoot crash'],
  testing: ['pytest', 'playwright', 'jest', 'vitest', 'unit test', 'integration test', 'end-to-end testing', 'e2e', 'test assertion'],
  performance: ['latency', 'throughput', 'caching bottleneck', 'asyncio concurrency', 'memory leak', 'profiling cpu', 'load balancing'],
  security: ['vulnerability', 'owasp', 'authentication jwt', 'rbac authorization', 'xss prevention', 'csrf', 'sql injection', 'sanitize input'],
  seo: ['search engine optimization', 'google search', 'keyword research', 'schema markup', 'meta description', 'canonical link', 'sitemap'],
  'content-writing': ['blog post', 'technical documentation', 'readme guide', 'article outline', 'tutorial copy', 'instructional guide'],
  'email-outreach': ['cold email', 'b2b outreach', 'investor update email', 'sales sequence', 'email subject line', 'follow-up email'],
  marketing: ['meta ads', 'facebook ads', 'google ads campaign', 'conversion rate', 'cro landing page', 'marketing hook', 'ctr copy'],
  automation: ['bash script automation', 'cron job workflow', 'ci/cd pipeline', 'github actions workflow', 'webhook handler'],
  coding: ['scaffold api', 'implement microservice', 'typescript function', 'fastapi route', 'next.js component', 'react hook'],
};

async function runClassification() {
  console.log(`Starting Taxonomy Reclassification Engine (${isApplyMode ? 'APPLY' : 'DRY RUN'})...`);

  const { data: dbTasks } = await supabase.from('tasks').select('id, slug, name');
  const taskMap = new Map((dbTasks || []).map((t) => [t.slug, t.id]));

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, slug, title, description, prompt_template, prompt, task_id, task_slug')
    .eq('status', 'published');

  const previews = [];
  let highConfidenceCount = 0;
  let reviewCount = 0;

  for (const p of (prompts || [])) {
    const text = `${p.title} ${p.description || ''} ${(p.prompt_template || p.prompt || '').slice(0, 800)}`.toLowerCase();

    let bestTask = null;
    let highestHits = 0;
    let runnerUpHits = 0;

    for (const [taskKey, signals] of Object.entries(CONTROLLED_SIGNALS)) {
      let hits = 0;
      for (const sig of signals) {
        if (text.includes(sig)) hits += sig.includes(' ') ? 3 : 1;
      }
      if (hits > highestHits) {
        runnerUpHits = highestHits;
        highestHits = hits;
        bestTask = taskKey;
      } else if (hits > runnerUpHits) {
        runnerUpHits = hits;
      }
    }

    const ratio = runnerUpHits === 0 ? 1.0 : (highestHits - runnerUpHits) / highestHits;
    const confidence = highestHits >= 4 && ratio >= 0.4 ? Math.min(0.98, 0.85 + ratio * 0.15) : 0.65;

    if (confidence >= 0.90 && bestTask && bestTask !== p.task_slug) {
      highConfidenceCount++;
      previews.push({
        prompt_id: p.id,
        title: p.title,
        old_task: p.task_slug || 'unclassified',
        new_task: bestTask,
        confidence: Number(confidence.toFixed(2)),
        reason: `Matched ${highestHits} specific ${bestTask} signals`,
        action: 'UPDATE',
      });
    } else if (confidence < 0.90 && bestTask && bestTask !== p.task_slug) {
      reviewCount++;
      previews.push({
        prompt_id: p.id,
        title: p.title,
        old_task: p.task_slug || 'unclassified',
        suggested_task: bestTask,
        confidence: Number(confidence.toFixed(2)),
        reason: 'Ambiguous signal balance - requires review',
        action: 'NEEDS_REVIEW',
      });
    }
  }

  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/classification-preview.json', JSON.stringify(previews, null, 2));

  console.log(`High-Confidence Updates (>= 0.90): ${highConfidenceCount}`);
  console.log(`Needs Review: ${reviewCount}`);
  console.log('Saved reports/classification-preview.json');

  if (isApplyMode) {
    const applyQueue = previews.filter((r) => r.action === 'UPDATE');
    let applied = 0;
    for (const item of applyQueue) {
      const newTaskId = taskMap.get(item.new_task);
      if (newTaskId) {
        await supabase
          .from('prompts')
          .update({
            task_id: newTaskId,
            task_slug: item.new_task,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.prompt_id);
        applied++;
      }
    }
    console.log(`Applied ${applied} task updates to database.`);
  }
}

runClassification();
