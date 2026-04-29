import type { MetadataRoute } from 'next';
import { PROVINCE_SLUGS } from '@/lib/provinces';
import { GUIDES } from '@/lib/guides';

const BASE_URL = 'https://paycalc.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'fr'] as const;
  const lastContentUpdate = '2026-04-01';

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = ['', '/income', '/compare', '/tax-brackets', '/minimum-wage', '/income-structure', '/guides', '/privacy', '/terms'];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: lastContentUpdate,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            fr: `${BASE_URL}/fr${page}`,
            'x-default': `${BASE_URL}/en${page}`,
          },
        },
      });
    }
  }

  // Province pages
  const provinceSlugs = Object.keys(PROVINCE_SLUGS);
  for (const locale of locales) {
    for (const slug of provinceSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/province/${slug}`,
        lastModified: lastContentUpdate,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/province/${slug}`,
            fr: `${BASE_URL}/fr/province/${slug}`,
            'x-default': `${BASE_URL}/en/province/${slug}`,
          },
        },
      });
    }
  }

  // Guide pages
  for (const guide of GUIDES) {
    entries.push({
      url: `${BASE_URL}/${guide.locale}/guides/${guide.slug}`,
      lastModified: guide.date,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
