import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/workflows`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/saved`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const { data: prompts } = await supabase
      .from('prompts')
      .select('slug, updated_at, model:models(slug), profession:professions(slug)')
      .eq('status', 'published')
      .limit(2000);

    if (!prompts || prompts.length === 0) {
      return staticRoutes;
    }

    const dynamicRoutes: MetadataRoute.Sitemap = prompts.map((p: any) => {
      const modelSlug = p.model?.slug || 'chatgpt';
      const roleSlug = p.profession?.slug || 'developer';
      return {
        url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
