import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema } from '@/components/layout/json-ld';
import { formatCurrency, formatRate } from '@/lib/format';
import { FEDERAL_BRACKETS_2026 } from '@/lib/tax/brackets/federal-2026';
import { PROVINCIAL_TAX_DATA_2026 } from '@/lib/tax/brackets/provincial-2026';
import { ALL_PROVINCE_CODES } from '@/lib/provinces';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = 'https://paycalc.ca';

  return {
    title: t('taxBracketsTitle', { year: '2026' }),
    description: t('taxBracketsDescription', { year: '2026' }),
    alternates: {
      canonical: `${baseUrl}/${locale}/tax-brackets`,
      languages: { en: `${baseUrl}/en/tax-brackets`, fr: `${baseUrl}/fr/tax-brackets` },
    },
  };
}

export default function TaxBracketsPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <Hreflang path="/tax-brackets" />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('taxBracketsPage.title', { year: '2026' }), url: `/${locale}/tax-brackets` },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('taxBracketsPage.title', { year: '2026' })}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {t('taxBracketsPage.subtitle')}
          </p>
        </div>

        {/* Federal Brackets */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('taxBracketsPage.federalTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      {t('taxBracketsPage.bracketFrom')}
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      {t('taxBracketsPage.bracketTo')}
                    </th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">
                      {t('taxBracketsPage.rate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEDERAL_BRACKETS_2026.brackets.map((b, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2.5 font-mono">{formatCurrency(b.from)}</td>
                      <td className="py-2.5 font-mono">
                        {b.to ? formatCurrency(b.to) : t('taxBracketsPage.andAbove')}
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold">
                        {formatRate(b.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t('deductions.basicPersonal')}: {formatCurrency(FEDERAL_BRACKETS_2026.bpa.max)}
            </p>
          </CardContent>
        </Card>

        {/* Provincial Brackets */}
        <h2 className="mb-4 text-2xl font-bold">{t('taxBracketsPage.provincialTitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ALL_PROVINCE_CODES.map((code) => {
            const data = PROVINCIAL_TAX_DATA_2026[code];
            return (
              <Card key={code}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t(`provinces.${code}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-1.5 text-left text-xs font-medium text-muted-foreground">
                            {t('taxBracketsPage.bracketFrom')}
                          </th>
                          <th className="pb-1.5 text-left text-xs font-medium text-muted-foreground">
                            {t('taxBracketsPage.bracketTo')}
                          </th>
                          <th className="pb-1.5 text-right text-xs font-medium text-muted-foreground">
                            {t('taxBracketsPage.rate')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.brackets.map((b, i) => (
                          <tr key={i} className="border-b border-border/30">
                            <td className="py-1.5 font-mono text-xs">{formatCurrency(b.from)}</td>
                            <td className="py-1.5 font-mono text-xs">
                              {b.to ? formatCurrency(b.to) : t('taxBracketsPage.andAbove')}
                            </td>
                            <td className="py-1.5 text-right font-mono font-semibold text-xs">
                              {formatRate(b.rate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t('deductions.basicPersonal')}: {formatCurrency(data.bpa)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </div>
    </>
  );
}
