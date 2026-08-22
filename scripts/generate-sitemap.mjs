import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
let env = {};
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[match[1]] = val;
      }
    }
  }
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials missing in .env or .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BASE_URL = 'https://www.promptory.xyz';
const TODAY = new Date().toISOString().split('T')[0];

const staticPaths = [
  { path: '', priority: '1.0', freq: 'daily' },
  { path: '/directory', priority: '0.9', freq: 'daily' },
  { path: '/workflows', priority: '0.8', freq: 'weekly' },
  { path: '/saved', priority: '0.6', freq: 'monthly' },
  { path: '/submit', priority: '0.7', freq: 'monthly' },
  { path: '/about', priority: '0.5', freq: 'monthly' },
  { path: '/privacy', priority: '0.4', freq: 'monthly' },
  { path: '/terms', priority: '0.4', freq: 'monthly' },
  { path: '/contact', priority: '0.5', freq: 'monthly' },
];

async function generate() {
  console.log('🔄 Connecting to Supabase...');

  // 1. Fetch Models Map
  const { data: modelsData } = await supabase.from('models').select('id, slug');
  const modelMap = {};
  (modelsData || []).forEach(m => { modelMap[m.id] = m.slug; });

  // 2. Fetch Professions Map
  const { data: profData } = await supabase.from('professions').select('id, slug');
  const profMap = {};
  (profData || []).forEach(p => { profMap[p.id] = p.slug; });

  // 3. Fetch All Prompts
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('slug, model_id, profession_id, updated_at, created_at')
    .limit(5000);

  if (error) {
    console.error('❌ Error fetching prompts:', error.message);
    return;
  }

  console.log(`📦 Found ${prompts?.length || 0} prompts in database.`);

  const dynamicUrls = [];
  (prompts || []).forEach(p => {
    if (p.slug) {
      const modelSlug = modelMap[p.model_id] || 'chatgpt';
      const roleSlug = profMap[p.profession_id] || 'developer';
      const date = (p.updated_at || p.created_at || TODAY).split('T')[0];

      dynamicUrls.push({
        loc: `${BASE_URL}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
        lastmod: date,
        freq: 'weekly',
        priority: '0.8',
      });
    }
  });

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  staticPaths.forEach(s => {
    xmlLines.push(`  <url>
    <loc>${BASE_URL}${s.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${s.freq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`);
  });

  dynamicUrls.forEach(d => {
    xmlLines.push(`  <url>
    <loc>${d.loc}</loc>
    <lastmod>${d.lastmod}</lastmod>
    <changefreq>${d.freq}</changefreq>
    <priority>${d.priority}</priority>
  </url>`);
  });

  xmlLines.push('</urlset>');

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  fs.writeFileSync('public/sitemap.xml', xmlLines.join('\n'), 'utf8');
  console.log(`✅ Success! Generated public/sitemap.xml with ${staticPaths.length + dynamicUrls.length} indexable URLs!`);
}

generate();
