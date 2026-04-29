'use client';

import { useTranslations } from 'next-intl';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { MultiStreamResult } from '@/lib/tax/income-types';
import type { Province } from '@/lib/tax';

interface StreamBreakdownChartProps {
  result: MultiStreamResult;
  province: Province;
}

const STREAM_COLORS: Record<string, string> = {
  employment: '#2563EB',          // blue
  selfEmployment: '#7C3AED',     // purple
  capitalGains: '#059669',        // green
  eligibleDividends: '#D97706',   // amber
  ineligibleDividends: '#DC2626', // red
  other: '#6B7280',               // gray
};

const DEDUCTION_COLORS = {
  net: '#059669',
  federalTax: '#DC2626',
  provincialTax: '#B91C1C',
  cpp: '#D97706',
  ei: '#2563EB',
  dtc: '#10B981',
  other: '#7C3AED',
};

const tooltipStyle = {
  borderRadius: '0.5rem',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
  fontSize: '0.875rem',
};

export function StreamBreakdownChart({ result, province }: StreamBreakdownChartProps) {
  const t = useTranslations();
  const isQuebec = province === 'QC';

  // Donut chart: tax breakdown
  const taxData = [
    { name: t('income.netIncome'), value: Math.max(0, result.netIncome), color: DEDUCTION_COLORS.net },
    { name: t('deductions.federalTax'), value: result.federalTax, color: DEDUCTION_COLORS.federalTax },
    { name: t('deductions.provincialTax'), value: result.provincialTax, color: DEDUCTION_COLORS.provincialTax },
    {
      name: isQuebec ? t('deductions.qpp') : t('deductions.cpp'),
      value: result.cppEmployee + result.cppSelfEmployed + result.cpp2Total,
      color: DEDUCTION_COLORS.cpp,
    },
    { name: t('deductions.ei'), value: result.eiPremium, color: DEDUCTION_COLORS.ei },
    ...(result.qpipPremium > 0
      ? [{ name: t('deductions.qpip'), value: result.qpipPremium, color: DEDUCTION_COLORS.other }]
      : []),
    ...(result.ontarioHealthPremium > 0
      ? [{ name: t('deductions.ontarioHealth'), value: result.ontarioHealthPremium, color: DEDUCTION_COLORS.other }]
      : []),
  ].filter((d) => d.value > 0);

  // Stacked bar: income by type
  const streamLabels: Record<string, string> = {
    employment: t('income.employmentIncome'),
    selfEmployment: t('income.selfEmploymentIncome'),
    capitalGains: t('income.capitalGains'),
    eligibleDividends: t('income.eligibleDividends'),
    ineligibleDividends: t('income.ineligibleDividends'),
    other: t('income.otherIncome'),
  };

  const incomeBarData = [{
    name: t('income.totalIncome'),
    ...Object.fromEntries(
      result.streams.map((s) => [s.type, s.actualAmount])
    ),
  }];

  const activeStreams = result.streams.filter((s) => s.actualAmount > 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Donut: Tax breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('income.taxBreakdownChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {taxData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {taxData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stacked bar: Income by type */}
      {activeStreams.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('income.incomeBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeBarData} layout="vertical" barSize={40}>
                  <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), streamLabels[name as string] || name]}
                    contentStyle={tooltipStyle}
                  />
                  {activeStreams.map((s) => (
                    <Bar
                      key={s.type}
                      dataKey={s.type}
                      stackId="income"
                      fill={STREAM_COLORS[s.type] || '#6B7280'}
                      name={s.type}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {activeStreams.map((s) => (
                <div key={s.type} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: STREAM_COLORS[s.type] || '#6B7280' }}
                  />
                  <span className="text-muted-foreground truncate">{streamLabels[s.type]}</span>
                  <span className="ml-auto font-mono shrink-0">
                    {formatCurrency(s.actualAmount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
