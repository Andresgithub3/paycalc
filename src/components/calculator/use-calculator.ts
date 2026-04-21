'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { calculateTax } from '@/lib/tax';
import type { CalculatorInput, TaxBreakdown, Province, InputMode, TaxYear } from '@/lib/tax';

const PROVINCES: Province[] = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

const INPUT_MODES: InputMode[] = ['annual', 'monthly', 'biweekly', 'weekly', 'hourly'];

interface UseCalculatorReturn {
  // Input state
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

  // Computed
  result: TaxBreakdown | null;

  // Constants
  provinces: Province[];
  inputModes: InputMode[];
}

export function useCalculator(defaultProvince?: Province): UseCalculatorReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from URL params
  const [amount, setAmountRaw] = useState(
    searchParams.get('amount') || ''
  );
  const [inputMode, setInputModeRaw] = useState<InputMode>(
    (searchParams.get('mode') as InputMode) || 'annual'
  );
  const [province, setProvinceRaw] = useState<Province>(
    (searchParams.get('province') as Province) || defaultProvince || 'AB'
  );
  const [taxYear, setTaxYearRaw] = useState<TaxYear>(
    (Number(searchParams.get('year')) as TaxYear) || 2026
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [rrspDeduction, setRrspDeductionRaw] = useState(
    searchParams.get('rrsp') || ''
  );

  // Update URL params when inputs change
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
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

  const setAmount = useCallback(
    (v: string) => {
      setAmountRaw(v);
      updateURL({ amount: v });
    },
    [updateURL]
  );

  const setInputMode = useCallback(
    (v: InputMode) => {
      setInputModeRaw(v);
      updateURL({ mode: v });
    },
    [updateURL]
  );

  const setProvince = useCallback(
    (v: Province) => {
      setProvinceRaw(v);
      updateURL({ province: v });
    },
    [updateURL]
  );

  const setTaxYear = useCallback(
    (v: TaxYear) => {
      setTaxYearRaw(v);
      updateURL({ year: String(v) });
    },
    [updateURL]
  );

  const setRrspDeduction = useCallback(
    (v: string) => {
      setRrspDeductionRaw(v);
      updateURL({ rrsp: v });
    },
    [updateURL]
  );

  // Calculate result
  const result = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return null;

    const input: CalculatorInput = {
      amount: numAmount,
      inputMode,
      province,
      taxYear,
      hoursPerWeek,
      weeksPerYear,
      rrspDeduction: parseFloat(rrspDeduction) || 0,
    };

    return calculateTax(input);
  }, [amount, inputMode, province, taxYear, hoursPerWeek, weeksPerYear, rrspDeduction]);

  return {
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
    result,
    provinces: PROVINCES,
    inputModes: INPUT_MODES,
  };
}
