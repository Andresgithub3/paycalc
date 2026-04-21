import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { SalaryCalculator } from '@/components/calculator/salary-calculator';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, organizationSchema, websiteSchema, webApplicationSchema } from '@/components/layout/json-ld';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const baseUrl = 'https://paycalc.ca';

  return {
    title: t('homeTitle', { year: '2026' }),
    description: t('homeDescription', { year: '2026' }),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
      },
    },
  };
}

export default function HomePage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <Hreflang path="/" />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema(locale)} />
      <JsonLd data={webApplicationSchema(locale)} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t('calculator.title')}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {t('calculator.subtitle')}
          </p>
        </div>

        {/* Calculator */}
        <SalaryCalculator />

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </div>
    </>
  );
}
