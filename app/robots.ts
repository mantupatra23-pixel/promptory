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
        // AI Search Engines & Grounding Bots (ChatGPT Search, Perplexity, Claude, Google AI)
        userAgent: [
          'OAI-SearchBot',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://www.promptory.xyz/sitemap.xml',
    host: 'https://www.promptory.xyz',
  };
}
