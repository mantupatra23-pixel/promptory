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
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Amazonbot'
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://www.promptory.xyz/sitemap.xml',
    host: 'https://www.promptory.xyz',
  };
}
