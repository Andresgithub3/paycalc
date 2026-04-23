import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/opengraph-image',
          '/*/twitter-image',
          '/*/icon',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://paycalc.ca/sitemap.xml',
  };
}
