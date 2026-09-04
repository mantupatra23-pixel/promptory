import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[FATAL] Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const isApplyMode = process.argv.includes('--apply');

// Controlled Taxonomy Signal Dictionary
const TASK_SIGNALS = {
  database: [
    'postgresql', 'mysql', 'mongodb', 'redis', 'sql', 'query optimization',
    'explain analyze', 'indexes', 'schema design', 'database migration', 'ddl',
    'prisma', 'foreign key', 'slow query', 'partitioning', 'connection pooling'
  ],
  'code-review': [
    'code review', 'review code', 'pull request', 'pr review', 'static analysis',
    'linting', 'refactoring', 'code smell', 'anti-pattern', 'clean architecture',
    'dry principles', 'cyclomatic complexity'
  ],
  debugging: [
    'debug', 'debugging', 'stack trace', 'root cause', 'runtime error',
    'exception', 'troubleshoot', 'fix bug', 'memory leak', 'null pointer',
    'segfault', 'unhandled rejection'
  ],
  testing: [
    'pytest', 'playwright', 'jest', 'vitest', 'unit test', 'integration test',
    'e2e', 'end-to-end', 'test coverage', 'mocking', 'assertion', 'smoke test',
    'load testing', 'cypress'
  ],
  performance: [
    'latency', 'throughput', 'caching', 'concurrency', 'asyncio', 'bottleneck',
    'profiling', 'memory footprint', 'load balancing', 'gzip', 'cdn optimization'
  ],
  security: [
    'security', 'vulnerability', 'authentication', 'authorization', 'jwt',
    'rbac', 'owasp', 'xss', 'csrf', 'sql injection', 'sanitization',
    'cve', 'audit auth', 'cryptography', 'rate limiting', 'secrets'
  ],
  seo: [
    'seo', 'search engine', 'google search', 'keyword research', 'serp',
    'schema markup', 'structured data', 'canonical', 'sitemap', 'meta tag',
    'internal linking', 'programmatic seo', 'indexing', 'search console'
  ],
  marketing: [
    'ads', 'advertising', 'meta ads', 'facebook ads', 'google ads',
    'conversion rate', 'cro', 'landing page', 'hook generator', 'ad copy',
    'ctr', 'growth marketing', 'retargeting'
  ],
  email: [
    'cold email', 'email sequence', 'outreach', 'subject line', 'newsletter',
    'email campaign', 'follow up email', 'inbox delivery', 'b2b outreach'
  ],
  'content-writing': [
    'blog post', 'article', 'technical writing', 'documentation', 'copywriting',
    'tutorial', 'content brief', 'readme', 'long-form content', 'ghostwriting'
  ],
  coding: [
    'code generation', 'implement', 'scaffold', 'boilerplate', 'api implementation',
    'fastapi', 'next.js', 'react', 'typescript', 'rust', 'golang', 'python script'
  ],
};

function scoreTaskSignals(text, taskKey) {
  const lower = text.toLowerCase();
  let score = 0;
  const signals = TASK_SIGNALS[taskKey] || [];
  for (const sig of signals) {
    if (lower.includes(sig)) {
      score += sig.includes(' ') ? 3 : 1; // Prioritize multi-word phrases
    }
  }
  return score;
}

function classifyPrompt(prompt) {
  const title = prompt.title || '';
  const desc = prompt.description || '';
  const body = prompt.prompt_template || prompt.prompt || '';
  const tags = Array.isArray(prompt.tags) ? prompt.tags.join(' ') : '';

  const scores = {};
  for (const taskKey of Object.keys(TASK_SIGNALS)) {
    const titleScore = scoreTaskSignals(title, taskKey) * 4;
    const descScore = scoreTaskSignals(desc, taskKey) * 2;
    const tagScore = scoreTaskSignals(tags, taskKey) * 2;
    const bodyScore = scoreTaskSignals(body.slice(0, 1000), taskKey) * 1;
    scores[taskKey] = titleScore + descScore + tagScore + bodyScore;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topTask, topScore] = sorted[0];
  const [runnerUpTask, runnerUpScore] = sorted[1];

  let confidence = 'LOW';
  if (topScore >= 6 && topScore >= runnerUpScore * 1.6) {
    confidence = 'HIGH';
  } else if (topScore >= 4) {
    confidence = 'MEDIUM';
  }

  return {
    suggestedTask: topTask,
    confidence,
    topScore,
    runnerUpTask,
    runnerUpScore,
  };
}

async function runClassification() {
  console.log(`\n=== PROMPTORY TAXONOMY CLASSIFICATION ENGINE ===`);
  console.log(`Execution Mode: ${isApplyMode ? 'APPLY (Live DB Mutation)' : 'DRY RUN (Read Only)'}\n`);

  // 1. Fetch reference tasks
  const { data: dbTasks, error: taskErr } = await supabase.from('tasks').select('id, slug, name');
  if (taskErr || !dbTasks) {
    console.error('Failed to load tasks:', taskErr);
    process.exit(1);
  }

  const taskMapBySlug = new Map(dbTasks.map((t) => [t.slug, t]));
  const taskMapById = new Map(dbTasks.map((t) => [t.id, t]));

  // 2. Fetch published prompts
  const { data: prompts, error: promptErr } = await supabase
    .from('prompts')
    .select('id, slug, title, description, prompt_template, prompt, tags, task_id, task_slug, status')
    .eq('status', 'published');

  if (promptErr || !prompts) {
    console.error('Failed to load prompts:', promptErr);
    process.exit(1);
  }

  console.log(`Loaded ${prompts.length} published prompts for evaluation.`);

  let stats = {
    total: prompts.length,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
    willUpdate: 0,
    unchanged: 0,
  };

  const updateQueue = [];
  const lowConfidenceReview = [];
  const sampleChanges = [];

  for (const p of prompts) {
    const currentTaskObj = p.task_id ? taskMapById.get(p.task_id) : null;
    const currentSlug = currentTaskObj ? currentTaskObj.slug : p.task_slug || 'unclassified';

    const classification = classifyPrompt(p);

    if (classification.confidence === 'HIGH') {
      stats.highConfidence++;
      if (currentSlug !== classification.suggestedTask) {
        stats.willUpdate++;
        const targetTaskObj = taskMapBySlug.get(classification.suggestedTask);
        if (targetTaskObj) {
          updateQueue.push({
            id: p.id,
            title: p.title,
            slug: p.slug,
            old_task_id: p.task_id,
            old_task_slug: currentSlug,
            new_task_id: targetTaskObj.id,
            new_task_slug: targetTaskObj.slug,
          });

          if (sampleChanges.length < 12) {
            sampleChanges.push({
              title: p.title,
              from: currentSlug,
              to: classification.suggestedTask,
              score: classification.topScore,
            });
          }
        }
      } else {
        stats.unchanged++;
      }
    } else if (classification.confidence === 'MEDIUM') {
      stats.mediumConfidence++;
      stats.unchanged++;
    } else {
      stats.lowConfidence++;
      stats.unchanged++;
      lowConfidenceReview.push({
        id: p.id,
        title: p.title,
        currentTask: currentSlug,
        topGuess: classification.suggestedTask,
        runnerUp: classification.runnerUpTask,
      });
    }
  }

  console.log(`\nAudit Statistics:`);
  console.log(`- Total Prompts Audited: ${stats.total}`);
  console.log(`- High Confidence:       ${stats.highConfidence}`);
  console.log(`- Medium Confidence:     ${stats.mediumConfidence} (Preserved current)`);
  console.log(`- Low Confidence:        ${stats.lowConfidence} (Preserved for review)`);
  console.log(`- Prompts to Reclassify: ${stats.willUpdate}`);
  console.log(`- Prompts Unchanged:     ${stats.unchanged}\n`);

  if (sampleChanges.length > 0) {
    console.log(`Representative Reclassification Samples (OLD -> NEW):`);
    sampleChanges.forEach((s, idx) => {
      console.log(`  ${idx + 1}. "${s.title.slice(0, 48)}" | [${s.from}] -> [${s.to}] (Signal Score: ${s.score})`);
    });
    console.log('');
  }

  // 3. Apply updates safely if flag is present
  if (isApplyMode) {
    if (updateQueue.length === 0) {
      console.log('No database updates required.');
      return;
    }

    const backupFilename = `taxonomy_backup_${Date.now()}.json`;
    fs.writeFileSync(backupFilename, JSON.stringify(updateQueue, null, 2));
    console.log(`[BACKUP CREATED] Reversible rollback saved to ${backupFilename}`);

    console.log(`Applying updates to ${updateQueue.length} records...`);
    let successCount = 0;

    for (const item of updateQueue) {
      const { error: updErr } = await supabase
        .from('prompts')
        .update({
          task_id: item.new_task_id,
          task_slug: item.new_task_slug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (updErr) {
        console.error(`Error updating prompt ${item.id}:`, updErr.message);
      } else {
        successCount++;
      }
    }

    console.log(`\n[SUCCESS] Successfully reclassified ${successCount} prompts in database.`);
  } else {
    console.log('DRY RUN COMPLETE. No database rows were modified.');
    console.log('Run with `node scripts/classify_existing_prompts.mjs --apply` to execute.');
  }

  if (lowConfidenceReview.length > 0) {
    fs.writeFileSync('low_confidence_review.json', JSON.stringify(lowConfidenceReview, null, 2));
    console.log(`[REPORT] Flagged ${lowConfidenceReview.length} low-confidence items saved to low_confidence_review.json`);
  }
}

runClassification();
