import { describe, it, expect } from 'vitest';
import { calculatePensionIncomeCredit, getProvincialPensionMax } from '../pension-credit';

describe('calculatePensionIncomeCredit', () => {
  // Federal lowest rate = 0.14 for 2026

  it('returns zero credit for zero pension income', () => {
    const result = calculatePensionIncomeCredit(0, 'AB');
    expect(result.eligibleAmount).toBe(0);
    expect(result.federalCredit).toBe(0);
    expect(result.provincialCredit).toBe(0);
    expect(result.quebecDeduction).toBe(0);
  });

  it('calculates credit on $2,000 pension income in Alberta', () => {
    // Federal: $2,000 × 0.14 = $280
    // Provincial: AB max = $1,000, rate = 0.08 → $80
    const result = calculatePensionIncomeCredit(2000, 'AB');
    expect(result.eligibleAmount).toBe(2000);
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(80);
    expect(result.quebecDeduction).toBe(0);
  });

  it('calculates credit on $500 pension income (below max)', () => {
    // Federal: $500 × 0.14 = $70
    // Provincial (AB): $500 × 0.08 = $40 (below $1,000 max)
    const result = calculatePensionIncomeCredit(500, 'AB');
    expect(result.eligibleAmount).toBe(500);
    expect(result.federalCredit).toBe(70);
    expect(result.provincialCredit).toBe(40);
  });

  it('caps federal credit at $2,000 for high pension income', () => {
    // $10,000 pension: federal eligible still capped at $2,000
    const result = calculatePensionIncomeCredit(10000, 'AB');
    expect(result.eligibleAmount).toBe(2000);
    expect(result.federalCredit).toBe(280);
    // Provincial (AB): capped at $1,000 × 0.08 = $80
    expect(result.provincialCredit).toBe(80);
  });

  it('uses $2,000 provincial max for Nova Scotia', () => {
    // NS lowest rate = 0.0879
    // NS pension max = $2,000
    const result = calculatePensionIncomeCredit(5000, 'NS');
    expect(result.eligibleAmount).toBe(2000);
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(175.80); // $2,000 × 0.0879
  });

  it('uses $1,796 provincial max for Ontario', () => {
    // ON lowest rate = 0.0505
    // ON pension max = $1,796
    const result = calculatePensionIncomeCredit(3000, 'ON');
    expect(result.eligibleAmount).toBe(2000);
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(90.70); // $1,796 × 0.0505
  });

  it('caps Ontario provincial credit at $1,796 for lower pension income', () => {
    // $1,000 pension < $1,796 max, so provincial uses $1,000
    const result = calculatePensionIncomeCredit(1000, 'ON');
    expect(result.provincialCredit).toBe(50.50); // $1,000 × 0.0505
  });

  it('returns Quebec deduction instead of provincial credit', () => {
    const result = calculatePensionIncomeCredit(5000, 'QC');
    expect(result.federalCredit).toBe(280); // federal credit still applies
    expect(result.provincialCredit).toBe(0); // no provincial credit for QC
    expect(result.quebecDeduction).toBe(2000); // deduction capped at $2,000
  });

  it('Quebec deduction is lesser of pension income and $2,000', () => {
    const result = calculatePensionIncomeCredit(1500, 'QC');
    expect(result.quebecDeduction).toBe(1500);
  });

  it('calculates BC credit correctly', () => {
    // BC lowest rate from existing brackets = 0.0506
    // BC pension max = $1,000
    const result = calculatePensionIncomeCredit(2000, 'BC');
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(50.60); // $1,000 × 0.0506
  });

  it('calculates Yukon credit with $2,000 provincial max', () => {
    // YT lowest rate = 0.064
    // YT pension max = $2,000
    const result = calculatePensionIncomeCredit(3000, 'YT');
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(128); // $2,000 × 0.064
  });

  it('calculates Nunavut credit with $2,000 max and 4% rate', () => {
    // NU lowest rate = 0.04
    // NU pension max = $2,000
    const result = calculatePensionIncomeCredit(2000, 'NU');
    expect(result.federalCredit).toBe(280);
    expect(result.provincialCredit).toBe(80); // $2,000 × 0.04
  });

  it('returns negative-safe results for negative pension income', () => {
    const result = calculatePensionIncomeCredit(-100, 'AB');
    expect(result.eligibleAmount).toBe(0);
    expect(result.federalCredit).toBe(0);
    expect(result.provincialCredit).toBe(0);
  });
});

describe('getProvincialPensionMax', () => {
  it('returns $1,000 for Alberta', () => {
    expect(getProvincialPensionMax('AB')).toBe(1000);
  });

  it('returns $2,000 for Nova Scotia', () => {
    expect(getProvincialPensionMax('NS')).toBe(2000);
  });

  it('returns $1,796 for Ontario', () => {
    expect(getProvincialPensionMax('ON')).toBe(1796);
  });

  it('returns 0 for Quebec', () => {
    expect(getProvincialPensionMax('QC')).toBe(0);
  });
});
