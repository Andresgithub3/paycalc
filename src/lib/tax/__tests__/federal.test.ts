import { describe, it, expect } from 'vitest';
import { calculateFederalTax, calculateProgressiveTax, calculateFederalBPA } from '../federal';
import { FEDERAL_BRACKETS_2026 } from '../brackets/federal-2026';

describe('calculateProgressiveTax', () => {
  it('should return 0 tax for 0 income', () => {
    const result = calculateProgressiveTax(0, FEDERAL_BRACKETS_2026.brackets);
    expect(result.total).toBe(0);
  });

  it('should calculate correctly for income in first bracket only', () => {
    // $50,000 income, all in first bracket at 14%
    const result = calculateProgressiveTax(50000, FEDERAL_BRACKETS_2026.brackets);
    expect(result.total).toBe(7000); // 50000 * 0.14
  });

  it('should calculate correctly for income spanning multiple brackets', () => {
    // $100,000 income
    // First bracket: 58523 * 0.14 = 8193.22
    // Second bracket: (100000 - 58523) * 0.205 = 41477 * 0.205 = 8502.785
    // Total: 16696.005 → rounded to 16696.01
    const result = calculateProgressiveTax(100000, FEDERAL_BRACKETS_2026.brackets);
    expect(result.total).toBeCloseTo(16696.01, 0);
  });
});

describe('calculateFederalBPA', () => {
  it('should return max BPA for income below phase-out start', () => {
    const bpa = calculateFederalBPA(100000, 2026);
    expect(bpa).toBe(16452);
  });

  it('should return min BPA for income at or above phase-out end', () => {
    const bpa = calculateFederalBPA(258482, 2026);
    expect(bpa).toBe(14829);
  });

  it('should return min BPA for income above phase-out end', () => {
    const bpa = calculateFederalBPA(300000, 2026);
    expect(bpa).toBe(14829);
  });

  it('should phase out BPA linearly between thresholds', () => {
    // Midpoint of phase-out range
    const midpoint = (181440 + 258482) / 2;
    const bpa = calculateFederalBPA(midpoint, 2026);
    const expectedBPA = 16452 - 0.5 * (16452 - 14829);
    expect(bpa).toBeCloseTo(expectedBPA, 0);
  });
});

describe('calculateFederalTax', () => {
  it('should return 0 tax for 0 income', () => {
    const result = calculateFederalTax(0, 2026);
    expect(result.tax).toBe(0);
  });

  it('should return 0 for income below BPA + CEA', () => {
    // BPA is $16,452, CEA is $1,501 → total non-taxable amount via credits
    // Tax on $16,452 = 16452 * 0.14 = 2303.28 (credit)
    // CEA credit = 1501 * 0.14 = 210.14
    // Total credits = 2513.42
    // For income of ~16,000, gross tax = 16000 * 0.14 = 2240 < 2513.42
    const result = calculateFederalTax(16000, 2026);
    expect(result.tax).toBe(0);
  });

  it('should calculate federal tax for $40,000 income', () => {
    // Gross tax: 40000 * 0.14 = 5600
    // BPA credit: 16452 * 0.14 = 2303.28
    // CEA credit: 1501 * 0.14 = 210.14
    // Net tax: 5600 - 2303.28 - 210.14 = 3086.58
    const result = calculateFederalTax(40000, 2026);
    expect(result.tax).toBeCloseTo(3086.58, 0);
  });

  it('should calculate federal tax for $100,000 income', () => {
    const result = calculateFederalTax(100000, 2026);
    // Gross: 58523*0.14 + (100000-58523)*0.205 = 8193.22 + 8502.785 = 16696.005
    // BPA credit: 16452*0.14 = 2303.28
    // CEA credit: 1501*0.14 = 210.14
    // Net: 16696.005 - 2303.28 - 210.14 = 14182.585 → ~14182.59
    expect(result.tax).toBeCloseTo(14182.59, 0);
  });

  it('should apply Quebec federal abatement', () => {
    const regularTax = calculateFederalTax(100000, 2026, false);
    const quebecTax = calculateFederalTax(100000, 2026, true);
    // Quebec should be 16.5% less
    expect(quebecTax.tax).toBeCloseTo(regularTax.tax * 0.835, 0);
  });

  it('should return correct marginal rate for income in top bracket', () => {
    const result = calculateFederalTax(300000, 2026);
    expect(result.marginalRate).toBe(0.33);
  });

  it('should return correct marginal rate for income in second bracket', () => {
    const result = calculateFederalTax(80000, 2026);
    expect(result.marginalRate).toBe(0.205);
  });
});
