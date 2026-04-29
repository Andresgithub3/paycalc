'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { Province, TaxYear } from '@/lib/tax';
import type { MultiStreamInput } from '@/lib/tax/income-types';
import { calculateMultiStreamTax } from '@/lib/tax/multi-stream-engine';

import { IncomeInputCard } from './IncomeInputCard';
import { StreamBreakdownTable } from './StreamBreakdownTable';
import { StreamBreakdownChart } from './StreamBreakdownChart';
import { PerStreamTable } from './PerStreamTable';
import { MarginalRateComparison } from './MarginalRateComparison';

const PROVINCES: Province[] = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

export function MultiStreamCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  // ─── State from URL params ───
  const [province, setProvinceRaw] = useState<Province>(
    (searchParams.get('province') as Province) || 'AB'
  );
  const [taxYear, setTaxYearRaw] = useState<TaxYear>(
    (Number(searchParams.get('year')) as TaxYear) || 2026
  );
  const [employment, setEmploymentRaw] = useState(searchParams.get('employment') || '');
  const [selfEmployment, setSelfEmploymentRaw] = useState(searchParams.get('self_emp') || '');
  const [capitalGains, setCapitalGainsRaw] = useState(searchParams.get('capital_gains') || '');
  const [eligibleDiv, setEligibleDivRaw] = useState(searchParams.get('eligible_div') || '');
  const [ineligibleDiv, setIneligibleDivRaw] = useState(searchParams.get('ineligible_div') || '');
  const [otherIncome, setOtherIncomeRaw] = useState(searchParams.get('other') || '');
  const [rrsp, setRrspRaw] = useState(searchParams.get('rrsp') || '');
  const [eiOpted, setEiOptedRaw] = useState(searchParams.get('ei_opted') === '1');

  // ─── URL sync ───
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== '0') {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      const paramString = newParams.toString();
      router.replace(`${pathname}${paramString ? `?${paramString}` : ''}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const setProvince = (v: Province) => { setProvinceRaw(v); updateURL({ province: v }); };
  const setTaxYear = (v: TaxYear) => { setTaxYearRaw(v); updateURL({ year: String(v) }); };
  const setEmployment = (v: string) => { setEmploymentRaw(v); updateURL({ employment: v }); };
  const setSelfEmployment = (v: string) => { setSelfEmploymentRaw(v); updateURL({ self_emp: v }); };
  const setCapitalGains = (v: string) => { setCapitalGainsRaw(v); updateURL({ capital_gains: v }); };
  const setEligibleDiv = (v: string) => { setEligibleDivRaw(v); updateURL({ eligible_div: v }); };
  const setIneligibleDiv = (v: string) => { setIneligibleDivRaw(v); updateURL({ ineligible_div: v }); };
  const setOtherIncome = (v: string) => { setOtherIncomeRaw(v); updateURL({ other: v }); };
  const setRrsp = (v: string) => { setRrspRaw(v); updateURL({ rrsp: v }); };
  const setEiOpted = (v: boolean) => { setEiOptedRaw(v); updateURL({ ei_opted: v ? '1' : '' }); };

  // ─── Calculate result ───
  const result = useMemo(() => {
    const input: MultiStreamInput = {
      province,
      taxYear,
      employmentIncome: parseFloat(employment) || 0,
      selfEmploymentIncome: parseFloat(selfEmployment) || 0,
      capitalGains: parseFloat(capitalGains) || 0,
      eligibleDividends: parseFloat(eligibleDiv) || 0,
      ineligibleDividends: parseFloat(ineligibleDiv) || 0,
      otherIncome: parseFloat(otherIncome) || 0,
      rrspDeduction: parseFloat(rrsp) || 0,
      selfEmployedEIOpted: eiOpted,
      pensionIncome: 0,
      isAge65Plus: false,
    };

    if (input.employmentIncome + input.selfEmploymentIncome + input.capitalGains +
        input.eligibleDividends + input.ineligibleDividends + input.otherIncome + input.pensionIncome <= 0) {
      return null;
    }

    return calculateMultiStreamTax(input);
  }, [province, taxYear, employment, selfEmployment, capitalGains, eligibleDiv, ineligibleDiv, otherIncome, rrsp, eiOpted]);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
      {/* ─── Left: Input Panel ─── */}
      <div className="space-y-4">
        {/* Province + Year */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('calculator.province')}</Label>
              <Select value={province} onValueChange={(v) => setProvince(v as Province)}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>{t(`provinces.${p}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('calculator.taxYear')}</Label>
              <Select value={String(taxYear)} onValueChange={(v) => setTaxYear(Number(v) as TaxYear)}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Income type cards */}
        <div className="space-y-2">
          <IncomeInputCard
            labelKey="employmentIncome"
            noteKey="employmentIncomeNote"
            value={employment}
            onChange={setEmployment}
            defaultOpen
          />

          <IncomeInputCard
            labelKey="selfEmploymentIncome"
            noteKey="selfEmploymentIncomeNote"
            value={selfEmployment}
            onChange={setSelfEmployment}
          >
            <div className="flex items-center gap-3 pt-1">
              <Label htmlFor="ei-opted" className="text-xs text-muted-foreground">
                {t('income.optedIntoEI')}
              </Label>
              <div className="flex gap-1">
                <button
                  onClick={() => setEiOpted(false)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    !eiOpted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {t('income.no')}
                </button>
                <button
                  onClick={() => setEiOpted(true)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    eiOpted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {t('income.yes')}
                </button>
              </div>
            </div>
          </IncomeInputCard>

          <IncomeInputCard
            labelKey="capitalGains"
            noteKey="capitalGainsNote"
            value={capitalGains}
            onChange={setCapitalGains}
          />

          <IncomeInputCard
            labelKey="eligibleDividends"
            noteKey="eligibleDividendsNote"
            value={eligibleDiv}
            onChange={setEligibleDiv}
          />

          <IncomeInputCard
            labelKey="ineligibleDividends"
            noteKey="ineligibleDividendsNote"
            value={ineligibleDiv}
            onChange={setIneligibleDiv}
          />

          <IncomeInputCard
            labelKey="otherIncome"
            noteKey="otherIncomeNote"
            value={otherIncome}
            onChange={setOtherIncome}
            defaultOpen
          />
        </div>

        {/* RRSP */}
        <IncomeInputCard
          labelKey="rrspDeduction"
          value={rrsp}
          onChange={setRrsp}
        />

        {/* Back to salary calculator link */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" />
            {t('income.backToSalary')}
          </Link>
        </p>
      </div>

      {/* ─── Right: Results ─── */}
      <div className="space-y-4">
        {result ? (
          <>
            {/* Summary card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('income.summaryTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold font-mono text-success tracking-tight">
                  {formatCurrency(result.netIncome)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('income.netIncome')}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-xs text-muted-foreground">{t('income.totalIncome')}</p>
                    <p className="font-mono font-semibold text-sm">
                      {formatCurrency(result.totalIncome)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-xs text-muted-foreground">{t('income.totalTaxableIncome')}</p>
                    <p className="font-mono font-semibold text-sm">
                      {formatCurrency(result.totalTaxableIncome)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-xs text-muted-foreground">{t('income.totalTaxPayable')}</p>
                    <p className="font-mono font-semibold text-sm text-destructive">
                      {formatCurrency(result.totalDeductions)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-xs text-muted-foreground">{t('income.effectiveTaxRate')}</p>
                    <p className="font-mono font-semibold text-sm">
                      {formatPercent(result.effectiveTaxRate)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t('income.marginalRate')}: {formatPercent(result.marginalRates.ordinary * 100)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Detailed breakdown */}
            <StreamBreakdownTable result={result} province={province} />

            {/* Per-stream analysis */}
            {result.streams.length > 0 && (
              <PerStreamTable streams={result.streams} />
            )}

            {/* Charts */}
            <StreamBreakdownChart result={result} province={province} />

            {/* Marginal rate comparison */}
            <MarginalRateComparison marginalRates={result.marginalRates} />
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">{t('income.noResults')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
