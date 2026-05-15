import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContractorCalculator } from '@/components/calculator/contractor-calculator';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema } from '@/components/layout/json-ld';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = 'https://paycalc.ca';

  return {
    title: t('contractorTitle', { year: '2026' }),
    description: t('contractorDescription', { year: '2026' }),
    alternates: {
      canonical: `${baseUrl}/${locale}/contractor`,
      languages: {
        en: `${baseUrl}/en/contractor`,
        fr: `${baseUrl}/fr/contractor`,
      },
    },
  };
}

export default function ContractorPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <Hreflang path="/contractor" />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('contractor.title'), url: `/${locale}/contractor` },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('contractor.title')}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {t('contractor.subtitle')}
          </p>
        </div>

        <ContractorCalculator />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('contractor.disclaimer')}
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </div>
    </>
  );
}
