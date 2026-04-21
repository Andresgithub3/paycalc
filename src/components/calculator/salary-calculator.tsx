'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useCalculator } from './use-calculator';
import { CalculatorInput } from './calculator-input';
import { CalculatorResults } from './calculator-results';
import { TaxChart } from './tax-chart';
import type { Province } from '@/lib/tax';

interface SalaryCalculatorProps {
  defaultProvince?: Province;
}

function SalaryCalculatorInner({ defaultProvince }: SalaryCalculatorProps) {
  const t = useTranslations();
  const calc = useCalculator(defaultProvince);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {/* Left: Input */}
      <div>
        <CalculatorInput {...calc} />
      </div>

      {/* Right: Results */}
      <div className="space-y-4">
        {calc.result ? (
          <>
            <CalculatorResults result={calc.result} province={calc.province} />
            <TaxChart result={calc.result} province={calc.province} />
          </>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              {t('calculator.noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SalaryCalculator({ defaultProvince }: SalaryCalculatorProps) {
  return (
    <Suspense>
      <SalaryCalculatorInner defaultProvince={defaultProvince} />
    </Suspense>
  );
}
