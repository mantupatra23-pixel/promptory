import { MetadataRoute } from 'next';
import { getPrompts, getWorkflows } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptory.xyz';

  const [prompts, workflows] = await Promise.all([
    getPrompts(),
    getWorkflows(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/workflows`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const promptRoutes: MetadataRoute.Sitemap = (prompts || []).map((p: any) => ({
    url: `${baseUrl}/prompts/${p.model?.slug || 'all'}/${p.profession?.slug || 'general'}/${p.task?.slug || p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const workflowRoutes: MetadataRoute.Sitemap = (workflows || []).map((wf: any) => ({
    url: `${baseUrl}/workflows/${wf.slug}`,
    lastModified: new Date(wf.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...promptRoutes, ...workflowRoutes];
}
