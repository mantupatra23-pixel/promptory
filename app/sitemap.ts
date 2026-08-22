import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  // 1. Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic 220+ Prompt Landing Pages
  try {
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('slug, updated_at, created_at, model:models(slug), profession:professions(slug)')
      .eq('status', 'published')
      .limit(2500);

    if (error || !prompts || prompts.length === 0) {
      return staticPages;
    }

    const promptPages: MetadataRoute.Sitemap = prompts.map((p: any) => {
      const modelSlug = p.model?.slug || 'chatgpt';
      const roleSlug = p.profession?.slug || 'developer';
      return {
        url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.created_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    return [...staticPages, ...promptPages];
  } catch (err) {
    return staticPages;
  }
}
