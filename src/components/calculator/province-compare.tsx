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
import { Button } from '@/components/ui/button';
import { X, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/format';
import { calculateTax } from '@/lib/tax';
import { ALL_PROVINCE_CODES } from '@/lib/provinces';
import type { Province } from '@/lib/tax';

function ProvinceCompareInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get('amount') || '75000');
  const [provinces, setProvinces] = useState<Province[]>(() => {
    const p = searchParams.get('provinces');
    if (p) return p.split(',') as Province[];
    return ['AB', 'ON', 'BC', 'QC'];
  });

  const results = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return [];

    return provinces.map((province) => {
      const result = calculateTax({
        amount: numAmount,
        inputMode: 'annual',
        province,
        taxYear: 2026,
        hoursPerWeek: 40,
        weeksPerYear: 52,
      });
      return { province, result };
    });
  }, [amount, provinces]);

  const bestProvince = results.length > 0
    ? results.reduce((best, curr) =>
        curr.result.netAnnual > best.result.netAnnual ? curr : best
      )
    : null;

  const worstProvince = results.length > 0
    ? results.reduce((worst, curr) =>
        curr.result.netAnnual < worst.result.netAnnual ? curr : worst
      )
    : null;

  function addProvince() {
    const available = ALL_PROVINCE_CODES.filter((p) => !provinces.includes(p));
    if (available.length > 0 && provinces.length < 6) {
      setProvinces([...provinces, available[0]]);
    }
  }

  function removeProvince(index: number) {
    if (provinces.length > 2) {
      setProvinces(provinces.filter((_, i) => i !== index));
    }
  }

  function changeProvince(index: number, value: Province) {
    const updated = [...provinces];
    updated[index] = value;
    setProvinces(updated);
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="compare-amount" className="text-sm font-medium">
                {t('deductions.salary')} ({t('periods.perYear')})
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">$</span>
                <Input
                  id="compare-amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 h-12 text-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Province selectors */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">
              {t('compare.selectProvinces')}
            </Label>
            <div className="flex flex-wrap gap-2">
              {provinces.map((p, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Select value={p} onValueChange={(v) => changeProvince(i, v as Province)}>
                    <SelectTrigger className="w-[180px] h-9">
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
                  {provinces.length > 2 && (
                    <button
                      onClick={() => removeProvince(i)}
                      className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                      aria-label={t('compare.removeProvince')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {provinces.length < 6 && (
                <Button variant="outline" size="sm" onClick={addProvince} className="h-9">
                  <Plus className="h-4 w-4 mr-1" />
                  {t('compare.addProvince')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Best / Worst badges */}
          {bestProvince && worstProvince && bestProvince.province !== worstProvince.province && (
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-success/10 text-success gap-1.5 py-1.5 px-3">
                <TrendingUp className="h-3.5 w-3.5" />
                {t('compare.bestProvince')}: {t(`provinces.${bestProvince.province}`)}
                ({formatCurrency(bestProvince.result.netAnnual)})
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <TrendingDown className="h-3.5 w-3.5" />
                {t('compare.worstProvince')}: {t(`provinces.${worstProvince.province}`)}
                ({formatCurrency(worstProvince.result.netAnnual)})
              </Badge>
            </div>
          )}

          {/* Comparison cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ province, result }) => {
              const isBest = bestProvince?.province === province;
              const diff = bestProvince
                ? result.netAnnual - bestProvince.result.netAnnual
                : 0;

              return (
                <Card
                  key={province}
                  className={isBest ? 'ring-2 ring-success' : ''}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{t(`provinces.${province}`)}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {province}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Net income */}
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('deductions.netIncome')}
                      </p>
                      <p className="text-2xl font-mono font-semibold text-success">
                        {formatCurrency(result.netAnnual)}
                      </p>
                      {!isBest && diff !== 0 && (
                        <p className="text-xs font-mono text-destructive">
                          {formatCurrency(diff)} {t('compare.difference')}
                        </p>
                      )}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('deductions.federalTax')}</span>
                        <span className="font-mono">{formatCurrency(result.federalTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('deductions.provincialTax')}</span>
                        <span className="font-mono">{formatCurrency(result.provincialTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('deductions.totalDeductions')}</span>
                        <span className="font-mono font-medium">{formatCurrency(result.totalDeductions)}</span>
                      </div>
                    </div>

                    {/* Rates */}
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {t('deductions.effectiveRate')}: {formatPercent(result.effectiveTaxRate)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function ProvinceCompare() {
  return (
    <Suspense>
      <ProvinceCompareInner />
    </Suspense>
  );
}
