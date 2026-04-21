'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRate } from '@/lib/format';
import { PROVINCIAL_TAX_DATA_2026 } from '@/lib/tax/brackets/provincial-2026';
import type { Province } from '@/lib/tax';
import type { ProvinceInfo } from '@/lib/provinces';

interface ProvinceInfoCardProps {
  province: Province;
  info: ProvinceInfo;
}

export function ProvinceInfoCard({ province, info }: ProvinceInfoCardProps) {
  const t = useTranslations();
  const taxData = PROVINCIAL_TAX_DATA_2026[province];

  return (
    <div className="space-y-4">
      {/* Key Facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('provinces.' + province)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('deductions.minimumWage')}
              </p>
              <p className="mt-1 font-mono font-semibold text-foreground">
                {formatCurrency(info.minimumWage)}/hr
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('deductions.basicPersonal')}
              </p>
              <p className="mt-1 font-mono font-semibold text-foreground">
                {formatCurrency(taxData.bpa)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('deductions.taxBrackets')}
              </p>
              <p className="mt-1 font-mono font-semibold text-foreground">
                {taxData.brackets.length}
              </p>
            </div>
          </div>

          {/* Special badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {province === 'QC' && (
              <>
                <Badge variant="secondary">{t('deductions.qpp')}</Badge>
                <Badge variant="secondary">{t('deductions.qpip')}</Badge>
              </>
            )}
            {province === 'ON' && (
              <Badge variant="secondary">{t('deductions.ontarioHealth')}</Badge>
            )}
            {province === 'AB' && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                {/* No PST */}
                No PST
              </Badge>
            )}
          </div>

          {taxData.notes && (
            <p className="mt-3 text-sm text-muted-foreground">{taxData.notes}</p>
          )}
        </CardContent>
      </Card>

      {/* Provincial Tax Brackets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('calculator.provincialBrackets')} — {t('provinces.' + province)}
          </CardTitle>
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
                {taxData.brackets.map((bracket, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 font-mono text-sm">
                      {formatCurrency(bracket.from)}
                    </td>
                    <td className="py-2 font-mono text-sm">
                      {bracket.to
                        ? formatCurrency(bracket.to)
                        : t('taxBracketsPage.andAbove')}
                    </td>
                    <td className="py-2 text-right font-mono font-semibold text-sm">
                      {formatRate(bracket.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
