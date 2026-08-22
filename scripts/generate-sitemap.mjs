import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
let env = {};
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] && parts[1]) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
} catch (e) {}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function run() {
  console.log('🔍 Generating sitemap...');
  let dynamicUrls = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data: prompts } = await supabase
        .from('prompts')
        .select('slug, model:models(slug), profession:professions(slug)')
        .eq('status', 'published')
        .limit(2000);

      if (prompts && prompts.length > 0) {
        dynamicUrls = prompts.map(p => {
          const modelSlug = p.model?.slug || 'chatgpt';
          const roleSlug = p.profession?.slug || 'developer';
          return `/prompts/${modelSlug}/${roleSlug}/${p.slug}`;
        });
      }
    } catch (err) {
      console.error('Supabase fetch error:', err.message);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths
  .map(
    s => `  <url>
    <loc>${BASE_URL}${s.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${s.freq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`
  )
  .join('\n')}
${dynamicUrls
  .map(
    url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log(`✅ Success: public/sitemap.xml generated with ${staticPaths.length + dynamicUrls.length} total URLs!`);
}

run();
