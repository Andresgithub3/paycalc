import { use } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SalaryCalculator } from '@/components/calculator/salary-calculator';
import { ProvinceInfoCard } from '@/components/calculator/province-info';
import { ProvinceFAQ } from '@/components/calculator/province-faq';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/layout/json-ld';
import { PROVINCE_SLUGS, PROVINCE_DATA } from '@/lib/provinces';
import { getProvinceFAQ } from '@/lib/province-faq';
import { routing } from '@/i18n/routing';
import type { Province } from '@/lib/tax';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of Object.keys(PROVINCE_SLUGS)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const provinceCode = PROVINCE_SLUGS[slug];
  if (!provinceCode) return {};

  const t = await getTranslations({ locale, namespace: 'meta' });
  const tProv = await getTranslations({ locale, namespace: 'provinces' });
  const provinceName = tProv(provinceCode);

  const title = t('provinceTitle', { province: provinceName, year: '2026' });
  const description = t('provinceDescription', { province: provinceName, year: '2026' });

  const baseUrl = 'https://paycalc.ca';
  const path = `/province/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}${path}`,
      languages: {
        en: `${baseUrl}/en${path}`,
        fr: `${baseUrl}/fr${path}`,
      },
    },
  };
}

export default function ProvincePage({ params }: Props) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('income');

  const provinceCode = PROVINCE_SLUGS[slug] as Province | undefined;
  if (!provinceCode) notFound();

  const info = PROVINCE_DATA[provinceCode];
  const lang = locale as 'en' | 'fr';

  // Build FAQ schema
  const faqs = getProvinceFAQ(provinceCode);
  const faqItems = faqs.map((f) => ({
    question: f.q[lang],
    answer: f.a[lang],
  }));

  return (
    <>
      <Hreflang path={`/province/${slug}`} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: info.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), url: `/${locale}/province/${slug}` },
        ])}
      />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SalaryCalculator defaultProvince={provinceCode} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ProvinceInfoCard province={provinceCode} info={info} />
          <ProvinceFAQ province={provinceCode} />
        </div>

        {/* Income Calculator CTA */}
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-border bg-muted/50 p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {t('ctaTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('ctaDescription')}
          </p>
          <Link
            href="/income"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
