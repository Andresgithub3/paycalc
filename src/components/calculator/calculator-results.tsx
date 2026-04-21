'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { formatCurrency, formatPercent, formatRate } from '@/lib/format';
import type { TaxBreakdown, Province } from '@/lib/tax';

interface CalculatorResultsProps {
  result: TaxBreakdown;
  province: Province;
}

export function CalculatorResults({ result, province }: CalculatorResultsProps) {
  const t = useTranslations();
  const [bracketsOpen, setBracketsOpen] = useState(false);

  const isQuebec = province === 'QC';
  const isOntario = province === 'ON';

  // Deduction line items
  const deductions = [
    { label: t('deductions.federalTax'), value: result.federalTax, color: 'text-destructive' },
    { label: t('deductions.provincialTax'), value: result.provincialTax, color: 'text-destructive' },
    {
      label: isQuebec ? t('deductions.qpp') : t('deductions.cpp'),
      value: result.cppContribution,
      color: 'text-warning',
    },
    ...(result.cpp2Contribution > 0
      ? [{ label: t('deductions.cpp2'), value: result.cpp2Contribution, color: 'text-warning' }]
      : []),
    { label: t('deductions.ei'), value: result.eiPremium, color: 'text-warning' },
    ...(isQuebec && result.qpipPremium > 0
      ? [{ label: t('deductions.qpip'), value: result.qpipPremium, color: 'text-warning' }]
      : []),
    ...(isOntario && result.ontarioHealthPremium > 0
      ? [{ label: t('deductions.ontarioHealth'), value: result.ontarioHealthPremium, color: 'text-destructive' }]
      : []),
  ];

  // Period breakdowns
  const periods = [
    { label: t('periods.perYear'), gross: result.grossAnnual, net: result.netAnnual },
    { label: t('periods.perMonth'), gross: result.grossMonthly, net: result.netMonthly },
    { label: t('periods.perBiweek'), gross: result.grossBiweekly, net: result.netBiweekly },
    { label: t('periods.perWeek'), gross: result.grossWeekly, net: result.netWeekly },
    { label: t('periods.perHour'), gross: result.grossHourly, net: result.netHourly },
  ];

  return (
    <div className="space-y-4">
      {/* Primary Result */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('deductions.netIncome')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Large net annual */}
          <p className="text-4xl font-semibold font-mono text-success tracking-tight">
            {formatCurrency(result.netAnnual)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('periods.perYear')}
          </p>

          {/* Period breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {periods.slice(1).map((p) => (
              <div key={p.label} className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="font-mono font-semibold text-sm text-success">
                  {formatCurrency(p.net)}
                </p>
              </div>
            ))}
          </div>

          {/* Rate badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {t('deductions.effectiveRate')}: {formatPercent(result.effectiveTaxRate)}
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              {t('deductions.marginalRate')}: {formatPercent(result.marginalTaxRate)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tax Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('calculator.taxBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Gross income */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('deductions.grossIncome')}</span>
            <span className="font-mono font-semibold text-sm">
              {formatCurrency(result.grossAnnual)}
            </span>
          </div>

          <Separator />

          {/* Deduction line items */}
          {deductions.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <span className={`font-mono text-sm font-medium ${d.color}`}>
                -{formatCurrency(d.value)}
              </span>
            </div>
          ))}

          <Separator />

          {/* Total deductions */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t('deductions.totalDeductions')}</span>
            <span className="font-mono font-semibold text-sm text-destructive">
              -{formatCurrency(result.totalDeductions)}
            </span>
          </div>

          <Separator />

          {/* Net */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t('deductions.netIncome')}</span>
            <span className="font-mono font-semibold text-base text-success">
              {formatCurrency(result.netAnnual)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Bracket Details */}
      <Collapsible open={bracketsOpen} onOpenChange={setBracketsOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <CardTitle className="text-lg">{t('calculator.bracketDetails')}</CardTitle>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  bracketsOpen ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Federal brackets */}
              <div>
                <p className="text-sm font-semibold mb-2">
                  {t('calculator.federalBrackets')}
                </p>
                <div className="space-y-1">
                  {result.federalBrackets.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-1.5 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {formatCurrency(b.from)} — {b.to ? formatCurrency(b.to) : '∞'}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {formatRate(b.rate)}
                      </span>
                      <span className="font-mono font-medium text-destructive">
                        {formatCurrency(b.taxInBracket)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provincial brackets */}
              <div>
                <p className="text-sm font-semibold mb-2">
                  {t('calculator.provincialBrackets')}
                </p>
                <div className="space-y-1">
                  {result.provincialBrackets.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-1.5 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {formatCurrency(b.from)} — {b.to ? formatCurrency(b.to) : '∞'}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {formatRate(b.rate)}
                      </span>
                      <span className="font-mono font-medium text-destructive">
                        {formatCurrency(b.taxInBracket)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
