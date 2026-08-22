import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://www.promptory.xyz';
  const today = new Date().toISOString().split('T')[0];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const staticRoutes = [
    { loc: `${baseUrl}`, freq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/directory`, freq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/workflows`, freq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/saved`, freq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/submit`, freq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/about`, freq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/privacy`, freq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/terms`, freq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/contact`, freq: 'monthly', priority: '0.5' },
  ];

  let dynamicRoutes: { loc: string; freq: string; priority: string; lastmod: string }[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const [{ data: models }, { data: professions }, { data: prompts }] = await Promise.all([
        supabase.from('models').select('id, slug'),
        supabase.from('professions').select('id, slug'),
        supabase.from('prompts').select('slug, model_id, profession_id, updated_at, created_at').limit(3000),
      ]);

      const modelMap: Record<string, string> = {};
      (models || []).forEach((m: any) => { modelMap[m.id] = m.slug; });

      const profMap: Record<string, string> = {};
      (professions || []).forEach((p: any) => { profMap[p.id] = p.slug; });

      (prompts || []).forEach((p: any) => {
        if (p.slug) {
          const mSlug = modelMap[p.model_id] || 'chatgpt';
          const rSlug = profMap[p.profession_id] || 'developer';
          const date = (p.updated_at || p.created_at || today).split('T')[0];

          dynamicRoutes.push({
            loc: `${baseUrl}/prompts/${mSlug}/${rSlug}/${p.slug}`,
            freq: 'weekly',
            priority: '0.8',
            lastmod: date,
          });
        }
      });
    } catch (e) {
      console.error('Sitemap DB query error:', e);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (s) => `  <url>
    <loc>${s.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${s.freq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`
  )
  .join('\n')}
${dynamicRoutes
  .map(
    (d) => `  <url>
    <loc>${d.loc}</loc>
    <lastmod>${d.lastmod}</lastmod>
    <changefreq>${d.freq}</changefreq>
    <priority>${d.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
