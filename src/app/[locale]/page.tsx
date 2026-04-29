import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
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

        {/* Income Calculator CTA */}
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-border bg-muted/50 p-6 text-center sm:mt-14">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('income.ctaTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('income.ctaDescription')}
          </p>
          <Link
            href="/income"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('income.ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </div>
    </>
  );
}
