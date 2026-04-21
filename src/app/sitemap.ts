import type { MetadataRoute } from 'next';
import { PROVINCE_SLUGS } from '@/lib/provinces';
import { GUIDES } from '@/lib/guides';

const BASE_URL = 'https://paycalc.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'fr'] as const;
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = ['', '/compare', '/tax-brackets', '/minimum-wage', '/guides', '/privacy', '/terms'];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            fr: `${BASE_URL}/fr${page}`,
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
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/province/${slug}`,
            fr: `${BASE_URL}/fr/province/${slug}`,
          },
        },
      });
    }
  }

  // Guide pages
  for (const guide of GUIDES) {
    entries.push({
      url: `${BASE_URL}/${guide.locale}/guides/${guide.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
