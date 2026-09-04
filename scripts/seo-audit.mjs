// scripts/seo-audit.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const BASE_URL = process.env.SITE_URL || 'https://www.promptory.xyz';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runAudit() {
  console.log(`\n🔍 STARTING COMPREHENSIVE SEO AUDIT FOR: ${BASE_URL}\n`);
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  // 1. Audit Database Prompt Canonical Fields
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('id, slug, title, description, prompt_template, task_slug, model_id, profession_id, models:model_id(slug), professions:profession_id(slug)')
    .limit(20);

  if (error || !prompts) {
    console.error('❌ Failed querying Supabase prompts:', error);
    process.exit(1);
  }

  console.log(`[CHECK 1] Inspecting Canonical Data Fields for sample prompts...`);
  for (const p of prompts) {
    const hasBody = Boolean(p.prompt_template && p.prompt_template.length > 50);
    const hasModel = Boolean(p.models?.slug);
    const hasRole = Boolean(p.professions?.slug);
    const hasTask = Boolean(p.task_slug);

    if (hasBody && hasModel && hasRole && hasTask) {
      console.log(`  [PASS] /prompts/${p.models.slug}/${p.professions.slug}/${p.slug}`);
      passCount++;
    } else {
      console.log(`  [FAIL] Incomplete prompt record ID ${p.id} (Body: ${hasBody}, Task: ${hasTask})`);
      failCount++;
    }
  }

  // 2. Audit Tasks Hubs Coverage
  console.log(`\n[CHECK 2] Auditing Task Hub Inventory...`);
  const { data: tasks } = await supabase.from('tasks').select('slug, name');
  for (const t of (tasks || [])) {
    const { count } = await supabase
      .from('prompts')
      .select('id', { count: 'exact', head: true })
      .eq('task_slug', t.slug);

    if ((count || 0) >= 3) {
      console.log(`  [PASS] /tasks/${t.slug} has ${count} prompts (Indexable)`);
      passCount++;
    } else {
      console.log(`  [WARN] /tasks/${t.slug} has only ${count} prompts (Thin Page - verify noindex guard)`);
      warnCount++;
    }
  }

  // 3. Audit Duplicate Slugs
  console.log(`\n[CHECK 3] Checking For Slug Collisions...`);
  const { data: allSlugs } = await supabase.from('prompts').select('slug');
  const slugCounts = new Map();
  for (const row of (allSlugs || [])) {
    slugCounts.set(row.slug, (slugCounts.get(row.slug) || 0) + 1);
  }

  let collisions = 0;
  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) {
      console.log(`  [FAIL] Duplicate slug detected: "${slug}" (${count} instances)`);
      collisions++;
      failCount++;
    }
  }
  if (collisions === 0) {
    console.log(`  [PASS] All ${allSlugs.length} prompts have unique slugs.`);
    passCount++;
  }

  console.log(`\n========================================`);
  console.log(`AUDIT COMPLETE: ${passCount} PASS | ${warnCount} WARN | ${failCount} FAIL`);
  console.log(`========================================\n`);

  if (failCount > 0) process.exit(1);
}

runAudit();
