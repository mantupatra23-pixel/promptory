import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://www.promptory.xyz';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    '',
    '/directory',
    '/workflows',
    '/saved',
    '/submit',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ];

  let dynamicUrls: string[] = [];

  try {
    const { data: prompts } = await supabase
      .from('prompts')
      .select('slug, model:models(slug), profession:professions(slug)')
      .eq('status', 'published')
      .limit(1000);

    if (prompts && prompts.length > 0) {
      dynamicUrls = prompts.map((p: any) => {
        const model = p.model?.slug || 'chatgpt';
        const role = p.profession?.slug || 'developer';
        return `/prompts/${model}/${role}/${p.slug}`;
      });
    }
  } catch (err) {}

  const allUrls = [...staticUrls, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${path === '' || path === '/directory' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : path.startsWith('/prompts') ? '0.8' : '0.6'}</priority>
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
