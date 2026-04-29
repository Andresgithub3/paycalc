'use client';

import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import type { PensionSplittingResult } from '@/lib/tax/pension-splitting';

interface PensionSplittingCardProps {
  result: PensionSplittingResult;
}

const tooltipStyle = {
  borderRadius: '0.5rem',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
  fontSize: '0.875rem',
};

export function PensionSplittingCard({ result }: PensionSplittingCardProps) {
  const t = useTranslations('pension');

  const rows = [
    {
      label: t('yourFederalTax'),
      without: result.yourFederalTaxWithout,
      with: result.yourFederalTaxWith,
    },
    {
      label: t('yourProvincialTax'),
      without: result.yourProvincialTaxWithout,
      with: result.yourProvincialTaxWith,
    },
    {
      label: t('spouseFederalTax'),
      without: result.spouseFederalTaxWithout,
      with: result.spouseFederalTaxWith,
    },
    {
      label: t('spouseProvincialTax'),
      without: result.spouseProvincialTaxWithout,
      with: result.spouseProvincialTaxWith,
    },
  ];

  const chartData = [
    {
      name: t('withoutSplitting'),
      tax: result.combinedTaxWithout,
      fill: '#DC2626',
    },
    {
      name: t('withSplitting'),
      tax: result.combinedTaxWith,
      fill: '#059669',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('splittingAnalysis')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium" />
                <th className="text-right py-2 px-2 font-medium">{t('withoutSplitting')}</th>
                <th className="text-right py-2 px-2 font-medium">{t('withSplitting')}</th>
                <th className="text-right py-2 pl-2 font-medium">{t('difference')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const diff = row.with - row.without;
                return (
                  <tr key={row.label} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 text-muted-foreground">{row.label}</td>
                    <td className="py-2.5 px-2 text-right font-mono">
                      {formatCurrency(row.without)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono">
                      {formatCurrency(row.with)}
                    </td>
                    <td className={`py-2.5 pl-2 text-right font-mono ${
                      diff < 0 ? 'text-success' : diff > 0 ? 'text-destructive' : ''
                    }`}>
                      {diff <= 0 ? '' : '+'}{formatCurrency(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Separator />

        {/* Combined household total */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t('combinedHouseholdTax')}</span>
          <div className="text-right">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground line-through">
                {formatCurrency(result.combinedTaxWithout)}
              </span>
              <span className="font-mono text-sm font-semibold">
                {formatCurrency(result.combinedTaxWith)}
              </span>
            </div>
            {result.netHouseholdSavings > 0 && (
              <Badge variant="secondary" className="mt-1 text-success font-mono text-xs">
                -{formatCurrency(result.netHouseholdSavings)} {t('householdSavings')}
              </Badge>
            )}
          </div>
        </div>

        {/* Spouse pension credit note */}
        {result.spouseGainsPensionCredit && (
          <p className="text-xs text-success">
            {t('spousePensionCredit')}: {formatCurrency(result.spousePensionCreditValue)}
          </p>
        )}

        {/* Bar chart comparison */}
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barSize={28} margin={{ left: 10, right: 50 }}>
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="tax" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="tax"
                  position="right"
                  formatter={(v) => formatCurrency(Number(v))}
                  style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground">
          {t('splittingDisclaimer')}
        </p>
      </CardContent>
    </Card>
  );
}
