'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Settings2 } from 'lucide-react';
import type { Province, InputMode, TaxYear } from '@/lib/tax';

interface CalculatorInputProps {
  amount: string;
  setAmount: (v: string) => void;
  inputMode: InputMode;
  setInputMode: (v: InputMode) => void;
  province: Province;
  setProvince: (v: Province) => void;
  taxYear: TaxYear;
  setTaxYear: (v: TaxYear) => void;
  hoursPerWeek: number;
  setHoursPerWeek: (v: number) => void;
  weeksPerYear: number;
  setWeeksPerYear: (v: number) => void;
  rrspDeduction: string;
  setRrspDeduction: (v: string) => void;
  provinces: Province[];
  inputModes: InputMode[];
}

export function CalculatorInput({
  amount,
  setAmount,
  inputMode,
  setInputMode,
  province,
  setProvince,
  taxYear,
  setTaxYear,
  hoursPerWeek,
  setHoursPerWeek,
  weeksPerYear,
  setWeeksPerYear,
  rrspDeduction,
  setRrspDeduction,
  provinces,
  inputModes,
}: CalculatorInputProps) {
  const t = useTranslations();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('calculator.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            {t('calculator.amount')}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
              $
            </span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="100"
              placeholder={t('calculator.amountPlaceholder')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 h-12 text-lg font-mono"
              autoFocus
            />
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('calculator.inputMode')}</Label>
          <div className="flex flex-wrap gap-1">
            {inputModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  inputMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t(`inputModes.${mode}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Province Select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('calculator.province')}</Label>
          <Select value={province} onValueChange={(v) => setProvince(v as Province)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p} value={p}>
                  {t(`provinces.${p}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tax Year */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('calculator.taxYear')}</Label>
          <Select value={String(taxYear)} onValueChange={(v) => setTaxYear(Number(v) as TaxYear)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Settings2 className="h-4 w-4" />
            {t('common.advanced')}
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                advancedOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4">
            {/* Hours per week */}
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-sm font-medium">
                {t('calculator.hoursPerWeek')}
              </Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="168"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value) || 40)}
                className="h-10"
              />
            </div>

            {/* Weeks per year */}
            <div className="space-y-2">
              <Label htmlFor="weeks" className="text-sm font-medium">
                {t('calculator.weeksPerYear')}
              </Label>
              <Input
                id="weeks"
                type="number"
                min="1"
                max="52"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Number(e.target.value) || 52)}
                className="h-10"
              />
            </div>

            {/* RRSP Deduction */}
            <div className="space-y-2">
              <Label htmlFor="rrsp" className="text-sm font-medium">
                {t('calculator.rrspContribution')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                  $
                </span>
                <Input
                  id="rrsp"
                  type="number"
                  min="0"
                  placeholder={t('calculator.rrspPlaceholder')}
                  value={rrspDeduction}
                  onChange={(e) => setRrspDeduction(e.target.value)}
                  className="pl-7 h-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('calculator.rrspTooltip')}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
