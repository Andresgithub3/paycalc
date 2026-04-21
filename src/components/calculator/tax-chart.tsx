'use client';

import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { TaxBreakdown, Province } from '@/lib/tax';

interface TaxChartProps {
  result: TaxBreakdown;
  province: Province;
}

const COLORS = {
  net: '#059669',        // success green
  federalTax: '#DC2626', // accent red
  provincialTax: '#B91C1C', // destructive
  cpp: '#D97706',        // warning amber
  ei: '#2563EB',         // blue
  other: '#7C3AED',      // purple
};

export function TaxChart({ result, province }: TaxChartProps) {
  const t = useTranslations('deductions');

  const isQuebec = province === 'QC';

  const data = [
    { name: t('netIncome'), value: result.netAnnual, color: COLORS.net },
    { name: t('federalTax'), value: result.federalTax, color: COLORS.federalTax },
    { name: t('provincialTax'), value: result.provincialTax, color: COLORS.provincialTax },
    {
      name: isQuebec ? t('qpp') : t('cpp'),
      value: result.cppContribution + result.cpp2Contribution,
      color: COLORS.cpp,
    },
    { name: t('ei'), value: result.eiPremium, color: COLORS.ei },
    ...(result.qpipPremium > 0
      ? [{ name: t('qpip'), value: result.qpipPremium, color: COLORS.other }]
      : []),
    ...(result.ontarioHealthPremium > 0
      ? [{ name: t('ontarioHealth'), value: result.ontarioHealthPremium, color: COLORS.other }]
      : []),
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('grossIncome').split('(')[0].trim()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  fontSize: '0.875rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground truncate">{entry.name}</span>
              <span className="ml-auto font-mono font-medium shrink-0">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
