import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { analyzeDuplicateCorpus } from '../lib/content/duplicateDetection.js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

async function runDuplicateAudit() {
  console.log('Auditing database for prompt duplicates...');

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('id, slug, title, prompt_template, prompt, content')
    .eq('status', 'published');

  if (error || !prompts) {
    console.error('Failed to fetch prompts:', error);
    process.exit(1);
  }

  const formatted = prompts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    body: (p.prompt_template || p.prompt || p.content || '').slice(0, 1500),
  }));

  const duplicateResults = analyzeDuplicateCorpus(formatted);
  const duplicatesOnly = duplicateResults.filter((d) => d.duplicateStatus !== 'unique');

  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/prompt-duplicates.json', JSON.stringify(duplicatesOnly, null, 2));

  console.log(`Audited ${prompts.length} prompts.`);
  console.log(`Found ${duplicatesOnly.length} duplicate candidate entries.`);
  console.log('Saved report to reports/prompt-duplicates.json');
}

runDuplicateAudit();
