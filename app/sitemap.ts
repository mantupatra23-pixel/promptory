import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400; // 24-hour cache for high performance & Googlebot stability

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';
  const now = new Date();

  // Core Static & Hub Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tasks`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/workflows`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare/promptory-vs-promptbase`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compare/promptory-vs-flowgpt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    // Parallel fetch using direct tables (prevents slow relational joins)
    const [modelsRes, rolesRes, tasksRes, promptsRes] = await Promise.all([
      supabase.from('models').select('id, slug, updated_at'),
      supabase.from('professions').select('id, slug, updated_at'),
      supabase.from('tasks').select('id, slug, updated_at'),
      supabase
        .from('prompts')
        .select('slug, model_id, profession_id, task_id, updated_at, created_at, status')
        .not('status', 'eq', 'rejected')
        .limit(5000),
    ]);

    const modelMap = new Map<string, string>();
    const modelRoutes: MetadataRoute.Sitemap = (modelsRes.data || []).map((m: any) => {
      modelMap.set(m.id, m.slug);
      return {
        url: `${baseUrl}/models/${m.slug}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : now,
        changeFrequency: 'daily',
        priority: 0.85,
      };
    });

    const roleMap = new Map<string, string>();
    const roleRoutes: MetadataRoute.Sitemap = (rolesRes.data || []).map((r: any) => {
      roleMap.set(r.id, r.slug);
      return {
        url: `${baseUrl}/roles/${r.slug}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : now,
        changeFrequency: 'daily',
        priority: 0.85,
      };
    });

    const taskRoutes: MetadataRoute.Sitemap = (tasksRes.data || []).map((t: any) => ({
      url: `${baseUrl}/tasks/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : now,
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    // Generate individual prompt canonical URLs using indexed maps
    const promptRoutes: MetadataRoute.Sitemap = (promptsRes.data || []).map((p: any) => {
      const modelSlug = modelMap.get(p.model_id) || 'chatgpt';
      const roleSlug = roleMap.get(p.profession_id) || 'software-developer';
      const timestamp = p.updated_at || p.created_at || now;

      return {
        url: `${baseUrl}/prompts/${modelSlug}/${roleSlug}/${p.slug}`,
        lastModified: new Date(timestamp),
        changeFrequency: 'weekly',
        priority: 0.75,
      };
    });

    return [...staticRoutes, ...taskRoutes, ...modelRoutes, ...roleRoutes, ...promptRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
