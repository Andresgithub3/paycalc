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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown, TrendingUp, Building2, User, Briefcase } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/format';
import {
  calculateSalaried,
  calculateSoleProp,
  calculateCCPCSalary,
  calculateCCPCDividend,
  calculateCCPCOptimal,
} from '@/lib/tax';
import { ALL_PROVINCE_CODES } from '@/lib/provinces';
import type { Province, StructureInput, StructureResult } from '@/lib/tax';

function StructureCompareInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get('amount') || '100000');
  const [province, setProvince] = useState<Province>(
    (searchParams.get('province') as Province) || 'AB'
  );
  const [expenseRate, setExpenseRate] = useState(
    searchParams.get('expenses') || '0'
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const input: StructureInput | null = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return null;
    const numExpense = Math.min(50, Math.max(0, parseFloat(expenseRate) || 0));
    return {
      grossRevenue: numAmount,
      province,
      expenseRate: numExpense / 100,
      taxYear: 2026,
    };
  }, [amount, province, expenseRate]);

  const results = useMemo(() => {
    if (!input) return null;
    const salaried = calculateSalaried(input);
    const soleProp = calculateSoleProp(input);
    const ccpcSalary = calculateCCPCSalary(input);
    const ccpcDividend = calculateCCPCDividend(input);
    const ccpcOptimal = calculateCCPCOptimal(input);
    return { salaried, soleProp, ccpcSalary, ccpcDividend, ccpcOptimal };
  }, [input]);

  const bestResult = useMemo(() => {
    if (!results) return null;
    const all = [
      results.salaried,
      results.soleProp,
      results.ccpcSalary,
      results.ccpcDividend,
      results.ccpcOptimal,
    ];
    return all.reduce((best, curr) =>
      curr.netIncome > best.netIncome ? curr : best
    );
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="structure-amount" className="text-sm font-medium">
                {t('incomeStructure.amount')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                  $
                </span>
                <Input
                  id="structure-amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 h-12 text-lg font-mono"
                  placeholder={t('incomeStructure.amountPlaceholder')}
                />
              </div>
            </div>
            <div className="w-full sm:w-48 space-y-2">
              <Label className="text-sm font-medium">
                {t('incomeStructure.province')}
              </Label>
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
          </div>

          {/* Advanced: expense rate */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
              />
              {t('incomeStructure.advanced')}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-2">
                <Label htmlFor="expense-rate" className="text-sm font-medium">
                  {t('incomeStructure.expenseRate')}: {expenseRate}%
                </Label>
                <input
                  id="expense-rate"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={expenseRate}
                  onChange={(e) => setExpenseRate(e.target.value)}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">
                  {t('incomeStructure.expenseTooltip')}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Results */}
      {results && bestResult && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Salaried Employee Card */}
          <StructureCard
            result={results.salaried}
            isBest={bestResult.type === 'salaried'}
            icon={<User className="h-4 w-4" />}
            title={t('incomeStructure.salaried')}
            description={t('incomeStructure.salariedDesc')}
            t={t}
          >
            <BreakdownRows t={t} result={results.salaried} />
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{t('incomeStructure.employerCost')}</span>
              <span className="font-mono">{formatCurrency(results.salaried.employerCost)}</span>
            </div>
          </StructureCard>

          {/* Sole Proprietorship Card */}
          <StructureCard
            result={results.soleProp}
            isBest={bestResult.type === 'sole-prop'}
            icon={<Briefcase className="h-4 w-4" />}
            title={t('incomeStructure.soleProp')}
            description={t('incomeStructure.solePropDesc')}
            t={t}
          >
            <BreakdownRows t={t} result={results.soleProp} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {t('incomeStructure.doubleCpp')}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {t('incomeStructure.noEi')}
              </Badge>
            </div>
          </StructureCard>

          {/* CCPC Card with Tabs */}
          <CCPCCard
            results={results}
            bestType={bestResult.type}
            t={t}
          />
        </div>
      )}
    </div>
  );
}

function StructureCard({
  result,
  isBest,
  icon,
  title,
  description,
  t,
  children,
}: {
  result: StructureResult;
  isBest: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  t: ReturnType<typeof useTranslations>;
  children: React.ReactNode;
}) {
  return (
    <Card className={isBest ? 'ring-2 ring-success' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          {isBest && (
            <Badge className="bg-success/10 text-success gap-1">
              <TrendingUp className="h-3 w-3" />
              {t('incomeStructure.bestOption')}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Hero number */}
        <div>
          <p className="text-xs text-muted-foreground">{t('incomeStructure.netTakeHome')}</p>
          <p className="text-2xl font-mono font-semibold text-success">
            {formatCurrency(result.netIncome)}
          </p>
        </div>

        {children}

        {/* Footer badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-mono text-xs">
            {t('incomeStructure.effectiveRate')}: {formatPercent(result.effectiveRate)}
          </Badge>
          {result.rrspRoom > 0 && (
            <Badge variant="secondary" className="font-mono text-xs">
              {t('incomeStructure.rrspRoom')}: {formatCurrency(result.rrspRoom)}
            </Badge>
          )}
          {result.rrspRoom === 0 && result.type !== 'salaried' && (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              {t('incomeStructure.noRrsp')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownRows({
  t,
  result,
}: {
  t: ReturnType<typeof useTranslations>;
  result: StructureResult;
}) {
  return (
    <div className="space-y-1 text-sm">
      {result.businessExpenses > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('incomeStructure.businessExpenses')}</span>
          <span className="font-mono">-{formatCurrency(result.businessExpenses)}</span>
        </div>
      )}
      {result.corporateTax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('incomeStructure.corporateTax')}</span>
          <span className="font-mono">{formatCurrency(result.corporateTax)}</span>
        </div>
      )}
      {result.personalIncomeTax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('incomeStructure.personalTax')}</span>
          <span className="font-mono">{formatCurrency(result.personalIncomeTax)}</span>
        </div>
      )}
      {result.cppContribution > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('deductions.cpp')}</span>
          <span className="font-mono">{formatCurrency(result.cppContribution)}</span>
        </div>
      )}
      {result.eiPremium > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('deductions.ei')}</span>
          <span className="font-mono">{formatCurrency(result.eiPremium)}</span>
        </div>
      )}
      {result.qpipPremium > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('deductions.qpip')}</span>
          <span className="font-mono">{formatCurrency(result.qpipPremium)}</span>
        </div>
      )}
      {result.dividendTax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('incomeStructure.dividendTax')}</span>
          <span className="font-mono">{formatCurrency(result.dividendTax)}</span>
        </div>
      )}
      {result.dividendCredit > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('incomeStructure.dividendCredits')}</span>
          <span className="font-mono text-success">-{formatCurrency(result.dividendCredit)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-border pt-1">
        <span className="text-muted-foreground font-medium">{t('deductions.totalDeductions')}</span>
        <span className="font-mono font-medium">{formatCurrency(result.totalDeductions)}</span>
      </div>
    </div>
  );
}

function CCPCCard({
  results,
  bestType,
  t,
}: {
  results: {
    ccpcSalary: StructureResult;
    ccpcDividend: StructureResult;
    ccpcOptimal: StructureResult;
  };
  bestType: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const ccpcBest = bestType.startsWith('ccpc-');

  return (
    <Card className={ccpcBest ? 'ring-2 ring-success' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            {t('incomeStructure.ccpc')}
          </CardTitle>
          {ccpcBest && (
            <Badge className="bg-success/10 text-success gap-1">
              <TrendingUp className="h-3 w-3" />
              {t('incomeStructure.bestOption')}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t('incomeStructure.ccpcDesc')}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={0}>
          <TabsList className="w-full">
            <TabsTrigger value={0} className="flex-1 text-xs">
              {t('incomeStructure.allSalary')}
            </TabsTrigger>
            <TabsTrigger value={1} className="flex-1 text-xs">
              {t('incomeStructure.allDividends')}
            </TabsTrigger>
            <TabsTrigger value={2} className="flex-1 text-xs">
              {t('incomeStructure.optimalMix')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={0}>
            <CCPCTabContent result={results.ccpcSalary} t={t} />
          </TabsContent>
          <TabsContent value={1}>
            <CCPCTabContent result={results.ccpcDividend} t={t} />
          </TabsContent>
          <TabsContent value={2}>
            <CCPCTabContent result={results.ccpcOptimal} t={t} showSplit />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function CCPCTabContent({
  result,
  t,
  showSplit = false,
}: {
  result: StructureResult;
  t: ReturnType<typeof useTranslations>;
  showSplit?: boolean;
}) {
  return (
    <div className="mt-3 space-y-3">
      <div>
        <p className="text-xs text-muted-foreground">{t('incomeStructure.netTakeHome')}</p>
        <p className="text-2xl font-mono font-semibold text-success">
          {formatCurrency(result.netIncome)}
        </p>
      </div>

      {showSplit && result.salaryAmount > 0 && (
        <div className="flex gap-2 text-xs">
          <Badge variant="secondary" className="font-mono">
            {t('incomeStructure.salaryPortion')}: {formatCurrency(result.salaryAmount)}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {t('incomeStructure.dividendPortion')}: {formatCurrency(result.dividendAmount)}
          </Badge>
        </div>
      )}

      <BreakdownRows t={t} result={result} />

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="font-mono text-xs">
          {t('incomeStructure.effectiveRate')}: {formatPercent(result.effectiveRate)}
        </Badge>
        {result.rrspRoom > 0 ? (
          <Badge variant="secondary" className="font-mono text-xs">
            {t('incomeStructure.rrspRoom')}: {formatCurrency(result.rrspRoom)}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs text-muted-foreground">
            {t('incomeStructure.noRrsp')}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function StructureCompare() {
  return (
    <Suspense>
      <StructureCompareInner />
    </Suspense>
  );
}
