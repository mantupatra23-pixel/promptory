import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/saved/',
          '/submit',
          '/*?*q=',
          '/*?*model=',
          '/*?*role=',
        ],
      },
    ],
    sitemap: 'https://www.promptory.xyz/sitemap.xml',
    host: 'https://www.promptory.xyz',
  };
}
