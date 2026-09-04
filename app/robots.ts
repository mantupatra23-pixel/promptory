// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/saved',
          '/submit',
          '/admin',
          '/*?*q=', // Disallow crawling infinite search query strings
        ],
      },
    ],
    sitemap: 'https://www.promptory.xyz/sitemap.xml',
    host: 'https://www.promptory.xyz',
  };
}
