import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function tokenize(text) {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return new Set(words);
}

function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

async function detectDuplicates() {
  console.log(`\n=== PROMPTORY DUPLICATE DETECTION ENGINE ===\n`);

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('id, slug, title, prompt_template, prompt, task_slug')
    .eq('status', 'published');

  if (error || !prompts) {
    console.error('Failed to load prompts:', error);
    process.exit(1);
  }

  console.log(`Auditing ${prompts.length} prompts for exact and near-duplicates...`);

  const exactSlugs = new Map();
  const duplicateSlugs = [];
  const nearDuplicatePairs = [];

  const tokenizedList = prompts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleTokens: tokenize(p.title),
    bodyTokens: tokenize((p.prompt_template || p.prompt || '').slice(0, 1200)),
  }));

  for (let i = 0; i < tokenizedList.length; i++) {
    const current = tokenizedList[i];

    if (exactSlugs.has(current.slug)) {
      duplicateSlugs.push({ slug: current.slug, idA: exactSlugs.get(current.slug), idB: current.id });
    } else {
      exactSlugs.set(current.slug, current.id);
    }

    for (let j = i + 1; j < tokenizedList.length; j++) {
      const compare = tokenizedList[j];

      const titleSim = calculateJaccardSimilarity(current.titleTokens, compare.titleTokens);
      const bodySim = calculateJaccardSimilarity(current.bodyTokens, compare.bodyTokens);

      if (titleSim > 0.82 || bodySim > 0.85) {
        nearDuplicatePairs.push({
          primary: { id: current.id, slug: current.slug, title: current.title },
          candidate: { id: compare.id, slug: compare.slug, title: compare.title },
          titleSimilarity: Number((titleSim * 100).toFixed(1)),
          bodySimilarity: Number((bodySim * 100).toFixed(1)),
          reason: titleSim > 0.82 ? 'Near-identical title' : 'Near-identical prompt body',
        });
      }
    }
  }

  console.log(`\nAudit Results:`);
  console.log(`- Exact Slug Collisions:      ${duplicateSlugs.length}`);
  console.log(`- Potential Duplicate Pairs:  ${nearDuplicatePairs.length}`);

  if (nearDuplicatePairs.length > 0) {
    fs.writeFileSync('duplicate_candidates_report.json', JSON.stringify(nearDuplicatePairs, null, 2));
    console.log(`[SAVED] Candidate duplicates saved to duplicate_candidates_report.json (NO ROWS DELETED)`);
    nearDuplicatePairs.slice(0, 5).forEach((d, idx) => {
      console.log(`  ${idx + 1}. [${d.titleSimilarity}% Title / ${d.bodySimilarity}% Body] "${d.primary.title.slice(0, 35)}" <-> "${d.candidate.title.slice(0, 35)}"`);
    });
  } else {
    console.log(`✅ Zero duplicate risks detected across all published prompt records.`);
  }
}

detectDuplicates();
