import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/workflows`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/saved`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 2. Programmatic Models
  const models = ['chatgpt', 'claude', 'deepseek', 'gemini', 'midjourney', 'perplexity'];
  const modelRoutes: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${baseUrl}/models/${m}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. Programmatic Roles
  const roles = ['developer', 'digital-marketer', 'founder', 'seo-specialist', 'real-estate-agent'];
  const roleRoutes: MetadataRoute.Sitemap = roles.map((r) => ({
    url: `${baseUrl}/roles/${r}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 4. Dynamic Prompts Detail Pages from Supabase
  let promptRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: prompts } = await supabase
      .from('prompts')
      .select('title, slug, model, profession, updated_at, created_at')
      .limit(500);

    if (prompts && prompts.length > 0) {
      promptRoutes = prompts.map((p) => {
        const m = (typeof p.model === 'object' ? p.model?.slug : p.model || 'chatgpt').toLowerCase();
        const r = (typeof p.profession === 'object' ? p.profession?.slug : p.profession || 'developer').toLowerCase().replace(/\s+/g, '-');
        const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return {
          url: `${baseUrl}/prompts/${m}/${r}/${slug}`,
          lastModified: new Date(p.updated_at || p.created_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        };
      });
    }
  } catch {}

  return [...staticRoutes, ...modelRoutes, ...roleRoutes, ...promptRoutes];
}
