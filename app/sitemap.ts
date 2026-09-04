// app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 7200; // Cache for 2 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  // 1. Static Canonical Core Pages
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
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Fetch Models (Indexable Hubs)
  const { data: models } = await supabase.from('models').select('slug, updated_at');
  const modelUrls: MetadataRoute.Sitemap = (models || []).map((m) => ({
    url: `${baseUrl}/models/${m.slug}`,
    lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Fetch Roles / Professions (Indexable Hubs)
  const { data: professions } = await supabase.from('professions').select('slug, updated_at');
  const roleUrls: MetadataRoute.Sitemap = (professions || []).map((p) => ({
    url: `${baseUrl}/roles/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 4. Fetch Task Hubs
  const { data: tasks } = await supabase.from('tasks').select('slug, updated_at');
  const taskUrls: MetadataRoute.Sitemap = (tasks || []).map((t) => ({
    url: `${baseUrl}/tasks/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 5. Fetch Canonical Prompts (Streamlined Columns to Prevent Memory Overhead)
  const { data: prompts } = await supabase
    .from('prompts')
    .select(`
      slug,
      updated_at,
      models:model_id(slug),
      professions:profession_id(slug)
    `)
    .eq('status', 'published')
    .limit(45000); // Respect single sitemap limits

  const promptUrls: MetadataRoute.Sitemap = (prompts || []).map((p: any) => {
    const modelSlug = p.models?.slug || 'chatgpt';
    const roleSlug = p.professions?.slug || 'developer';
    return {
      url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    };
  });

  return [...staticPages, ...taskUrls, ...modelUrls, ...roleUrls, ...promptUrls];
}
