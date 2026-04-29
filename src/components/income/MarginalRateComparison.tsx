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
import type { MultiStreamResult } from '@/lib/tax/income-types';

interface MarginalRateComparisonProps {
  marginalRates: MultiStreamResult['marginalRates'];
}

const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626'];

export function MarginalRateComparison({ marginalRates }: MarginalRateComparisonProps) {
  const t = useTranslations('income');

  const data = [
    {
      name: t('ordinaryIncome'),
      rate: +(marginalRates.ordinary * 100).toFixed(1),
      color: COLORS[0],
    },
    {
      name: t('capitalGains'),
      rate: +(marginalRates.capitalGains * 100).toFixed(1),
      color: COLORS[1],
    },
    {
      name: t('eligibleDividends'),
      rate: +(marginalRates.eligibleDividends * 100).toFixed(1),
      color: COLORS[2],
    },
    {
      name: t('ineligibleDividends'),
      rate: +(marginalRates.ineligibleDividends * 100).toFixed(1),
      color: COLORS[3],
    },
  ];

  // Don't render if all rates are zero
  if (data.every((d) => d.rate === 0)) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('marginalRateComparison')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barSize={28} margin={{ left: 10, right: 40 }}>
              <XAxis
                type="number"
                domain={[0, 'auto']}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, t('marginalRate')]}
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  fontSize: '0.875rem',
                }}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="rate"
                  position="right"
                  formatter={(v) => `${v}%`}
                  style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
