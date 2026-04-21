import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema } from '@/components/layout/json-ld';
import { formatCurrency } from '@/lib/format';
import { ALL_PROVINCE_CODES, PROVINCE_DATA } from '@/lib/provinces';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = 'https://paycalc.ca';

  return {
    title: t('minimumWageTitle', { year: '2026' }),
    description: t('minimumWageDescription', { year: '2026' }),
    alternates: {
      canonical: `${baseUrl}/${locale}/minimum-wage`,
      languages: { en: `${baseUrl}/en/minimum-wage`, fr: `${baseUrl}/fr/minimum-wage` },
    },
  };
}

export default function MinimumWagePage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  const sorted = [...ALL_PROVINCE_CODES].sort((a, b) =>
    PROVINCE_DATA[b].minimumWage - PROVINCE_DATA[a].minimumWage
  );

  return (
    <>
      <Hreflang path="/minimum-wage" />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('minimumWagePage.title', { year: '2026' }), url: `/${locale}/minimum-wage` },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('minimumWagePage.title', { year: '2026' })}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {t('minimumWagePage.subtitle')}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      {t('minimumWagePage.province')}
                    </th>
                    <th className="pb-3 text-right font-medium text-muted-foreground">
                      {t('minimumWagePage.rate')}
                    </th>
                    <th className="pb-3 text-right font-medium text-muted-foreground hidden sm:table-cell">
                      {t('minimumWagePage.annualGross')}
                    </th>
                    <th className="pb-3 text-right font-medium text-muted-foreground hidden md:table-cell">
                      {t('minimumWagePage.effectiveDate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((code, i) => {
                    const info = PROVINCE_DATA[code];
                    const annualGross = info.minimumWage * 40 * 52;
                    return (
                      <tr
                        key={code}
                        className={`border-b border-border/50 ${i === 0 ? 'bg-success/5' : ''}`}
                      >
                        <td className="py-3">
                          <Link
                            href={`/province/${info.slug}`}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {t(`provinces.${code}`)}
                          </Link>
                        </td>
                        <td className="py-3 text-right font-mono font-semibold">
                          {formatCurrency(info.minimumWage)}
                        </td>
                        <td className="py-3 text-right font-mono hidden sm:table-cell">
                          {formatCurrency(annualGross)}
                        </td>
                        <td className="py-3 text-right text-muted-foreground hidden md:table-cell">
                          {info.minimumWageEffective}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </div>
    </>
  );
}
