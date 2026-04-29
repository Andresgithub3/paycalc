'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { StreamAnalysis } from '@/lib/tax/income-types';

interface PerStreamTableProps {
  streams: StreamAnalysis[];
}

export function PerStreamTable({ streams }: PerStreamTableProps) {
  const t = useTranslations('income');

  if (streams.length === 0) return null;

  const streamLabels: Record<string, string> = {
    employment: t('employmentIncome'),
    selfEmployment: t('selfEmploymentIncome'),
    pension: t('pensionIncome'),
    capitalGains: t('capitalGains'),
    eligibleDividends: t('eligibleDividends'),
    ineligibleDividends: t('ineligibleDividends'),
    other: t('otherIncome'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('perStreamAnalysis')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium">{t('incomeType')}</th>
                <th className="text-right py-2 px-2 font-medium">{t('actualAmount')}</th>
                <th className="text-right py-2 px-2 font-medium">{t('taxableAmount')}</th>
                <th className="text-right py-2 px-2 font-medium">{t('effectiveRate')}</th>
                <th className="text-right py-2 pl-2 font-medium">{t('marginalRate')}</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((s) => (
                <tr key={s.type} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 font-medium">
                    {streamLabels[s.type] || s.type}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {formatCurrency(s.actualAmount)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {formatCurrency(s.taxableAmount)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {formatPercent(s.effectiveRate)}
                  </td>
                  <td className="py-2.5 pl-2 text-right font-mono">
                    {formatPercent(s.marginalRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
