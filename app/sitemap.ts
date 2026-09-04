import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 7200;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

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
      url: `${baseUrl}/tasks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
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
  ];

  // 1. Fetch Models
  const { data: models } = await supabase.from('models').select('slug, updated_at');
  const modelUrls: MetadataRoute.Sitemap = (models || []).map((m) => ({
    url: `${baseUrl}/models/${m.slug}`,
    lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 2. Fetch Professions/Roles
  const { data: professions } = await supabase.from('professions').select('slug, updated_at');
  const roleUrls: MetadataRoute.Sitemap = (professions || []).map((p) => ({
    url: `${baseUrl}/roles/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Fetch Tasks with Thin-Page Protection (Only >= 3 published prompts)
  const { data: tasks } = await supabase.from('tasks').select('id, slug, updated_at');
  const { data: promptTasks } = await supabase
    .from('prompts')
    .select('task_id')
    .eq('status', 'published');

  const taskCountMap = new Map<string, number>();
  (promptTasks || []).forEach((p) => {
    if (p.task_id) taskCountMap.set(p.task_id, (taskCountMap.get(p.task_id) || 0) + 1);
  });

  const taskUrls: MetadataRoute.Sitemap = (tasks || [])
    .filter((t) => (taskCountMap.get(t.id) || 0) >= 3)
    .map((t) => ({
      url: `${baseUrl}/tasks/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

  // 4. Fetch All Canonical Prompts
  const { data: prompts } = await supabase
    .from('prompts')
    .select(`
      slug,
      updated_at,
      models:model_id(slug),
      professions:profession_id(slug)
    `)
    .eq('status', 'published')
    .limit(45000);

  const promptUrls: MetadataRoute.Sitemap = (prompts || []).map((p: any) => {
    const modelSlug = p.models?.slug || 'chatgpt';
    const roleSlug = p.professions?.slug || 'software-developer';
    return {
      url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    };
  });

  return [...staticPages, ...taskUrls, ...modelUrls, ...roleUrls, ...promptUrls];
}
