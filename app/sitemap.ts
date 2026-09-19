import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tasks`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/workflows`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const [modelsRes, professionsRes, tasksRes, promptsRes] = await Promise.all([
      supabase.from('models').select('slug, updated_at'),
      supabase.from('professions').select('slug, updated_at'),
      supabase.from('tasks').select('id, slug, updated_at'),
      supabase.from('prompts').select('slug, updated_at, created_at, model:model_id(slug), profession:profession_id(slug)').not('status', 'eq', 'rejected').limit(5000)
    ]);

    const modelUrls: MetadataRoute.Sitemap = (modelsRes.data || []).map((m) => ({
      url: `${baseUrl}/models/${m.slug}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    const roleUrls: MetadataRoute.Sitemap = (professionsRes.data || []).map((p) => ({
      url: `${baseUrl}/roles/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    const taskUrls: MetadataRoute.Sitemap = (tasksRes.data || []).map((t) => ({
      url: `${baseUrl}/tasks/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    const promptUrls: MetadataRoute.Sitemap = (promptsRes.data || []).map((p: any) => {
      const modelSlug = p.model?.slug || 'chatgpt';
      const roleSlug = p.profession?.slug || 'software-developer';
      const timestamp = p.updated_at || p.created_at || new Date();
      return {
        url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
        lastModified: new Date(timestamp),
        changeFrequency: 'weekly',
        priority: 0.75,
      };
    });

    return [...staticPages, ...taskUrls, ...modelUrls, ...roleUrls, ...promptUrls];
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return staticPages;
  }
}
