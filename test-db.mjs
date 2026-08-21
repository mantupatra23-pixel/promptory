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

if (!key || key.includes('placeholder')) {
  console.log('⚠️ Warning: .env.local me valid ANON key check karein');
}

const supabase = createClient(url, key);

async function testConnection() {
  console.log('🔍 Connecting to Supabase...\n');
  
  const { data: models, error: mErr } = await supabase.from('models').select('name, slug');
  const { data: prompts, error: pErr } = await supabase.from('prompts').select('title, quality_score');

  if (mErr || pErr) {
    console.error('❌ Supabase Query Error:', mErr || pErr);
    return;
  }

  console.log('✅ Supabase Connected Successfully!\n');
  console.log(`📦 Models (${models.length}):`, models.map(m => m.name).join(', '));
  console.log(`📝 Prompts (${prompts.length}):`);
  prompts.forEach((p, idx) => console.log(`   ${idx + 1}. ${p.title} [Score: ${p.quality_score}/100]`));
}

testConnection();
