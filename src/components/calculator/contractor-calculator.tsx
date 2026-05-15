'use client';

import { Suspense, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatPercent } from '@/lib/format';
import { calculateContractorEquivalent } from '@/lib/tax';
import { ALL_PROVINCE_CODES } from '@/lib/provinces';
import type { Province, ContractorInput, ContractorResult } from '@/lib/tax';

function ContractorCalculatorInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [inputMode, setInputMode] = useState<'hourly' | 'annual'>(
    searchParams.get('mode') === 'annual' ? 'annual' : 'hourly'
  );
  const [hourlyRate, setHourlyRate] = useState(searchParams.get('rate') || '75');
  const [billableHours, setBillableHours] = useState(searchParams.get('hours') || '1500');
  const [annualRevenue, setAnnualRevenue] = useState(searchParams.get('revenue') || '100000');
  const [province, setProvince] = useState<Province>(
    (searchParams.get('province') as Province) || 'AB'
  );
  const [expenses, setExpenses] = useState(searchParams.get('expenses') || '10000');
  const [salaryPercent, setSalaryPercent] = useState(
    searchParams.get('split') || '50'
  );

  const computedAnnual = useMemo(() => {
    if (inputMode === 'annual') return parseFloat(annualRevenue) || 0;
    return (parseFloat(hourlyRate) || 0) * (parseFloat(billableHours) || 0);
  }, [inputMode, hourlyRate, billableHours, annualRevenue]);

  const result: ContractorResult | null = useMemo(() => {
    if (computedAnnual <= 0) return null;

    const input: ContractorInput = inputMode === 'hourly'
      ? {
          hourlyRate: parseFloat(hourlyRate) || 0,
          billableHours: parseFloat(billableHours) || 1500,
          province,
          expenses: Math.max(0, parseFloat(expenses) || 0),
          salaryPercent: Math.max(0, Math.min(100, parseFloat(salaryPercent) || 0)),
          taxYear: 2026,
        }
      : {
          annualRevenue: parseFloat(annualRevenue) || 0,
          province,
          expenses: Math.max(0, parseFloat(expenses) || 0),
          salaryPercent: Math.max(0, Math.min(100, parseFloat(salaryPercent) || 0)),
          taxYear: 2026,
        };

    return calculateContractorEquivalent(input);
  }, [inputMode, hourlyRate, billableHours, annualRevenue, province, expenses, salaryPercent]);

  const splitNum = Math.max(0, Math.min(100, parseFloat(salaryPercent) || 0));

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Revenue input mode toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('contractor.inputMode')}</Label>
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'hourly' | 'annual')}>
              <TabsList className="w-full">
                <TabsTrigger value="hourly" className="flex-1">
                  {t('contractor.hourlyMode')}
                </TabsTrigger>
                <TabsTrigger value="annual" className="flex-1">
                  {t('contractor.annualMode')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hourly">
                <div className="flex flex-col gap-4 sm:flex-row mt-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="hourly-rate" className="text-sm font-medium">
                      {t('contractor.hourlyRate')}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">$</span>
                      <Input
                        id="hourly-rate"
                        type="number"
                        min="0"
                        step="5"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="pl-7 h-12 text-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="billable-hours" className="text-sm font-medium">
                      {t('contractor.billableHours')}
                    </Label>
                    <Input
                      id="billable-hours"
                      type="number"
                      min="0"
                      step="100"
                      value={billableHours}
                      onChange={(e) => setBillableHours(e.target.value)}
                      className="h-12 text-lg font-mono"
                    />
                  </div>
                </div>
                {computedAnnual > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('contractor.computedAnnual')}: <span className="font-mono font-medium text-foreground">{formatCurrency(computedAnnual)}</span>
                  </p>
                )}
              </TabsContent>

              <TabsContent value="annual">
                <div className="mt-3 space-y-2">
                  <Label htmlFor="annual-revenue" className="text-sm font-medium">
                    {t('contractor.annualRevenue')}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">$</span>
                    <Input
                      id="annual-revenue"
                      type="number"
                      min="0"
                      step="5000"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(e.target.value)}
                      className="pl-7 h-12 text-lg font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Province + Expenses row */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-48 space-y-2">
              <Label className="text-sm font-medium">{t('contractor.province')}</Label>
              <Select value={province} onValueChange={(v) => setProvince(v as Province)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_PROVINCE_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {t(`provinces.${code}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="expenses" className="text-sm font-medium">
                {t('contractor.expenses')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">$</span>
                <Input
                  id="expenses"
                  type="number"
                  min="0"
                  step="1000"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="pl-7 h-12 text-lg font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('contractor.expensesHelp')}
              </p>
            </div>
          </div>

          {/* Salary/Dividend split slider */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('contractor.salaryDividendSplit')}</Label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={salaryPercent}
              onChange={(e) => setSalaryPercent(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('contractor.salaryPercent', { percent: splitNum })}</span>
              <span>{t('contractor.dividendPercent', { percent: 100 - splitNum })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && result.businessIncome > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Contractor (CCPC) side */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('contractor.contractorSide')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <Row label={t('contractor.grossRevenue')} value={formatCurrency(result.grossRevenue)} />
                  {result.expenses > 0 && (
                    <Row label={t('contractor.businessExpenses')} value={`-${formatCurrency(result.expenses)}`} />
                  )}
                  <Row label={t('contractor.businessIncome')} value={formatCurrency(result.businessIncome)} bold />
                </div>

                {/* Salary portion details */}
                {result.salary > 0 && (
                  <div className="space-y-1 text-sm border-t border-border pt-2">
                    <Row label={t('contractor.salaryPortion')} value={formatCurrency(result.salary)} bold />
                    <Row label={t('contractor.personalTax')} value={formatCurrency(result.salaryPersonalTax)} indent />
                    {result.salaryCPP > 0 && <Row label={t('deductions.cpp')} value={formatCurrency(result.salaryCPP)} indent />}
                    {result.salaryCPP2 > 0 && <Row label={t('deductions.cpp2')} value={formatCurrency(result.salaryCPP2)} indent />}
                    {result.salaryEI > 0 && <Row label={t('deductions.ei')} value={formatCurrency(result.salaryEI)} indent />}
                    {result.salaryQPIP > 0 && <Row label={t('deductions.qpip')} value={formatCurrency(result.salaryQPIP)} indent />}
                    {result.salaryOntarioHealth > 0 && <Row label={t('deductions.ontarioHealth')} value={formatCurrency(result.salaryOntarioHealth)} indent />}
                  </div>
                )}

                {/* Dividend portion details */}
                {result.dividendAmount > 0 && (
                  <div className="space-y-1 text-sm border-t border-border pt-2">
                    <Row label={t('contractor.dividendPortion')} value={formatCurrency(result.dividendAmount)} bold />
                    <Row label={t('contractor.corporateTax')} value={formatCurrency(result.corporateTax)} indent />
                    <Row label={t('contractor.dividendTax')} value={formatCurrency(result.dividendTax)} indent />
                    {result.dividendCredit > 0 && (
                      <Row label={t('contractor.dividendCredits')} value={`-${formatCurrency(result.dividendCredit)}`} indent success />
                    )}
                  </div>
                )}

                {/* Net take-home */}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">{t('contractor.netTakeHome')}</p>
                  <p className="text-2xl font-mono font-semibold text-success">
                    {formatCurrency(result.contractorNet)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t('contractor.effectiveRate')}: {formatPercent(result.contractorEffectiveRate)}
                  </Badge>
                  {result.contractorRRSP > 0 ? (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {t('contractor.rrspRoom')}: {formatCurrency(result.contractorRRSP)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs text-muted-foreground">
                      {t('contractor.rrspRoom')}: $0
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Equivalent Employee side */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('contractor.employeeSide')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Hero: equivalent salary */}
                <div>
                  <p className="text-xs text-muted-foreground">{t('contractor.equivalentSalary')}</p>
                  <p className="text-2xl font-mono font-semibold text-primary">
                    {formatCurrency(result.equivalentSalary)}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <Row label={t('deductions.federalTax')} value={formatCurrency(result.employeeFederalTax)} />
                  <Row label={t('deductions.provincialTax')} value={formatCurrency(result.employeeProvincialTax)} />
                  {result.employeeCPP > 0 && <Row label={t('deductions.cpp')} value={formatCurrency(result.employeeCPP)} />}
                  {result.employeeCPP2 > 0 && <Row label={t('deductions.cpp2')} value={formatCurrency(result.employeeCPP2)} />}
                  {result.employeeEI > 0 && <Row label={t('deductions.ei')} value={formatCurrency(result.employeeEI)} />}
                  {result.employeeQPIP > 0 && <Row label={t('deductions.qpip')} value={formatCurrency(result.employeeQPIP)} />}
                  {result.employeeOntarioHealth > 0 && <Row label={t('deductions.ontarioHealth')} value={formatCurrency(result.employeeOntarioHealth)} />}
                </div>

                {/* Net take-home (should match) */}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">{t('contractor.netTakeHome')}</p>
                  <p className="text-2xl font-mono font-semibold text-success">
                    {formatCurrency(result.employeeNet)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t('contractor.effectiveRate')}: {formatPercent(result.employeeEffectiveRate)}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t('contractor.rrspRoom')}: {formatCurrency(result.employeeRRSP)}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t('contractor.equivalentHourly')}: {formatCurrency(result.equivalentHourly)}/hr
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary line */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4 text-center">
              <p className="text-sm font-medium text-foreground">
                {inputMode === 'hourly'
                  ? t('contractor.summary', {
                      rate: formatCurrency(parseFloat(hourlyRate) || 0),
                      salary: formatCurrency(result.equivalentSalary),
                    })
                  : t('contractor.summaryAnnual', {
                      revenue: formatCurrency(parseFloat(annualRevenue) || 0),
                      salary: formatCurrency(result.equivalentSalary),
                    })}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
  indent = false,
  success = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  indent?: boolean;
  success?: boolean;
}) {
  return (
    <div className={`flex justify-between ${indent ? 'pl-3' : ''}`}>
      <span className={`text-muted-foreground ${bold ? 'font-medium' : ''}`}>{label}</span>
      <span className={`font-mono ${bold ? 'font-medium' : ''} ${success ? 'text-success' : ''}`}>
        {value}
      </span>
    </div>
  );
}

export function ContractorCalculator() {
  return (
    <Suspense>
      <ContractorCalculatorInner />
    </Suspense>
  );
}
