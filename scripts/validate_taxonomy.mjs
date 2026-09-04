import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runTaxonomyValidation() {
  console.log(`\n🔍 AUDITING PROMPTORY TAXONOMY INTEGRITY...\n`);
  let issues = 0;

  // 1. Check Tasks Table
  const { data: tasks, error: tErr } = await supabase.from('tasks').select('*');
  if (tErr || !tasks) {
    console.error('❌ Failed to fetch tasks:', tErr);
    process.exit(1);
  }

  const slugSet = new Set();
  for (const t of tasks) {
    if (slugSet.has(t.slug)) {
      console.error(`❌ DUPLICATE TASK SLUG FOUND: "${t.slug}"`);
      issues++;
    }
    slugSet.add(t.slug);
  }

  // 2. Audit Published Prompts
  const { data: prompts, error: pErr } = await supabase
    .from('prompts')
    .select('id, title, task_id, task_slug, status')
    .eq('status', 'published');

  if (pErr || !prompts) {
    console.error('❌ Failed to fetch prompts:', pErr);
    process.exit(1);
  }

  const taskCountMap = new Map();
  let orphanedCount = 0;

  for (const p of prompts) {
    if (!p.task_id) {
      orphanedCount++;
      issues++;
    } else {
      taskCountMap.set(p.task_id, (taskCountMap.get(p.task_id) || 0) + 1);
    }
  }

  if (orphanedCount > 0) {
    console.error(`❌ FOUND ${orphanedCount} PUBLISHED PROMPTS MISSING task_id.`);
  } else {
    console.log(`✅ All ${prompts.length} published prompts have a canonical task_id.`);
  }

  // 3. Verify Counts & Thin-Page Protections
  console.log(`\nTask Inventory Distribution:`);
  for (const t of tasks) {
    const count = taskCountMap.get(t.id) || 0;
    const statusLabel = count >= 3 ? 'INDEXABLE' : count > 0 ? 'NOINDEX (1-2 Prompts)' : '404 (Empty)';
    console.log(`  - /tasks/${t.slug.padEnd(16)} | Count: ${String(count).padStart(3)} | Status: [${statusLabel}]`);
  }

  console.log(`\n========================================`);
  if (issues === 0) {
    console.log(`✅ TAXONOMY AUDIT PASSED: ZERO INTEGRITY ISSUES DETECTED.`);
  } else {
    console.log(`❌ TAXONOMY AUDIT FAILED: ${issues} ISSUES FOUND.`);
    process.exit(1);
  }
}

runTaxonomyValidation();
