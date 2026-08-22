import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/workflows`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Fetch all Prompts from Supabase
  const { data: prompts } = await supabase
    .from('prompts')
    .select('slug, updated_at, created_at, model:models(slug), profession:professions(slug)')
    .limit(1000);

  const promptRoutes: MetadataRoute.Sitemap = (prompts || []).map((p: any) => {
    const modelSlug = (p.model?.slug || 'chatgpt').toLowerCase();
    const profSlug = (p.profession?.slug || 'developer').toLowerCase();
    const taskSlug = p.slug;

    return {
      url: `${baseUrl}/prompts/${modelSlug}/${profSlug}/${taskSlug}`,
      lastModified: p.updated_at || p.created_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...promptRoutes];
}
