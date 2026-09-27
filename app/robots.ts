import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: ['GPTBot'],
        allow: ['/', '/compare/', '/tools/'],
      },
      {
        userAgent: ['PerplexityBot', 'ClaudeBot', 'Google-Extended', 'anthropic-ai'],
        allow: '/',
      },
    ],
    sitemap: 'https://www.promptory.xyz/sitemap.xml',
    host: 'https://www.promptory.xyz',
  };
}
