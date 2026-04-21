import { describe, it, expect } from 'vitest';
import {
  calculateSalaried,
  calculateSoleProp,
  calculateCCPCSalary,
  calculateCCPCDividend,
  calculateCCPCOptimal,
  compareAllStructures,
} from '../structure-compare';
import { calculateCorporateTax } from '../corporate';
import { calculateDividendTax } from '../dividends';
import type { StructureInput } from '../types';

const defaults: StructureInput = {
  grossRevenue: 100000,
  province: 'AB',
  expenseRate: 0,
  taxYear: 2026,
};

describe('calculateCorporateTax', () => {
  it('Alberta: 9% federal + 2% provincial = 11%', () => {
    const result = calculateCorporateTax(100000, 'AB', 2026);
    expect(result.federalTax).toBe(9000);
    expect(result.provincialTax).toBe(2000);
    expect(result.totalTax).toBe(11000);
    expect(result.afterTaxIncome).toBe(89000);
    expect(result.effectiveRate).toBe(11);
  });

  it('Manitoba: 9% federal + 0% provincial = 9%', () => {
    const result = calculateCorporateTax(100000, 'MB', 2026);
    expect(result.federalTax).toBe(9000);
    expect(result.provincialTax).toBe(0);
    expect(result.totalTax).toBe(9000);
  });

  it('Ontario: 9% federal + 3.2% provincial = 12.2%', () => {
    const result = calculateCorporateTax(100000, 'ON', 2026);
    expect(result.totalTax).toBe(12200);
  });

  it('handles zero income', () => {
    const result = calculateCorporateTax(0, 'AB', 2026);
    expect(result.totalTax).toBe(0);
    expect(result.afterTaxIncome).toBe(0);
  });
});

describe('calculateDividendTax', () => {
  it('applies 15% gross-up and DTC for Alberta', () => {
    const result = calculateDividendTax(50000, 'AB', 2026);
    expect(result.taxableDividend).toBe(57500); // 50000 * 1.15
    expect(result.grossUpAmount).toBe(7500);
    expect(result.federalDTC).toBeGreaterThan(0);
    expect(result.provincialDTC).toBeGreaterThan(0);
    expect(result.netDividend).toBeGreaterThan(0);
    expect(result.netDividend).toBeLessThan(50000);
  });

  it('handles zero dividend', () => {
    const result = calculateDividendTax(0, 'AB', 2026);
    expect(result.totalTax).toBe(0);
    expect(result.netDividend).toBe(0);
  });
});

describe('calculateSalaried', () => {
  it('$100K in Alberta matches existing calculator', () => {
    const result = calculateSalaried(defaults);
    expect(result.type).toBe('salaried');
    expect(result.grossRevenue).toBe(100000);
    expect(result.netIncome).toBeGreaterThan(60000);
    expect(result.netIncome).toBeLessThan(80000);
    expect(result.cppContribution).toBeGreaterThan(0);
    expect(result.eiPremium).toBeGreaterThan(0);
    expect(result.employerCost).toBeGreaterThan(100000);
    expect(result.rrspRoom).toBe(18000); // 18% of 100K
  });

  it('handles zero income', () => {
    const result = calculateSalaried({ ...defaults, grossRevenue: 0 });
    expect(result.netIncome).toBe(0);
  });
});

describe('calculateSoleProp', () => {
  it('$100K in Alberta: double CPP, no EI', () => {
    const result = calculateSoleProp(defaults);
    expect(result.type).toBe('sole-prop');
    expect(result.eiPremium).toBe(0); // No EI for self-employed
    // Double CPP: ~$8,461 (2 × ~$4,230)
    expect(result.cppContribution).toBeCloseTo(8460.90, -1);
    expect(result.netIncome).toBeGreaterThan(50000);
    expect(result.netIncome).toBeLessThan(80000);
  });

  it('respects expense rate', () => {
    const withExpenses = calculateSoleProp({ ...defaults, expenseRate: 0.2 });
    const withoutExpenses = calculateSoleProp(defaults);
    expect(withExpenses.businessExpenses).toBe(20000);
    expect(withExpenses.businessIncome).toBe(80000);
    // Lower income = lower taxes = not necessarily lower net (lower gross too)
    expect(withExpenses.netIncome).toBeLessThan(withoutExpenses.netIncome);
  });
});

describe('calculateCCPCSalary', () => {
  it('$100K in Alberta: all salary, no corporate tax', () => {
    const result = calculateCCPCSalary(defaults);
    expect(result.type).toBe('ccpc-salary');
    expect(result.corporateTax).toBe(0);
    expect(result.salaryAmount).toBeGreaterThan(0);
    expect(result.salaryAmount).toBeLessThan(100000); // Less than budget (employer costs)
    expect(result.dividendAmount).toBe(0);
    expect(result.netIncome).toBeGreaterThan(50000);
  });
});

describe('calculateCCPCDividend', () => {
  it('$100K in Alberta: corporate tax + dividend tax', () => {
    const result = calculateCCPCDividend(defaults);
    expect(result.type).toBe('ccpc-dividend');
    expect(result.corporateTax).toBe(11000); // 11% in AB
    expect(result.dividendAmount).toBe(89000);
    expect(result.cppContribution).toBe(0); // No CPP on dividends
    expect(result.eiPremium).toBe(0);
    expect(result.rrspRoom).toBe(0); // No RRSP room from dividends
    expect(result.netIncome).toBeGreaterThan(50000);
  });
});

describe('calculateCCPCOptimal', () => {
  it('$100K in Alberta: optimal mix between salary and dividends', () => {
    const result = calculateCCPCOptimal(defaults);
    expect(result.type).toBe('ccpc-optimal');
    // Optimal should be >= all-salary and >= all-dividends
    const allSalary = calculateCCPCSalary(defaults);
    const allDiv = calculateCCPCDividend(defaults);
    expect(result.netIncome).toBeGreaterThanOrEqual(allSalary.netIncome - 1);
    expect(result.netIncome).toBeGreaterThanOrEqual(allDiv.netIncome - 1);
  });

  it('handles zero income', () => {
    const result = calculateCCPCOptimal({ ...defaults, grossRevenue: 0 });
    expect(result.netIncome).toBe(0);
  });
});

describe('compareAllStructures', () => {
  it('returns 5 structures sorted by net income', () => {
    const results = compareAllStructures(defaults);
    expect(results).toHaveLength(5);
    // Sorted descending by netIncome
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].netIncome).toBeGreaterThanOrEqual(results[i].netIncome);
    }
  });

  it('all structures cover the 5 types', () => {
    const results = compareAllStructures(defaults);
    const types = results.map((r) => r.type).sort();
    expect(types).toEqual(['ccpc-dividend', 'ccpc-optimal', 'ccpc-salary', 'salaried', 'sole-prop']);
  });

  it('works with expenses', () => {
    const results = compareAllStructures({ ...defaults, expenseRate: 0.15 });
    expect(results).toHaveLength(5);
    // Salaried has no business expenses; self-employed/CCPC structures do
    const salaried = results.find((r) => r.type === 'salaried')!;
    expect(salaried.businessExpenses).toBe(0);
    const soleProp = results.find((r) => r.type === 'sole-prop')!;
    expect(soleProp.businessExpenses).toBe(15000);
    expect(soleProp.businessIncome).toBe(85000);
  });

  it('Quebec includes QPIP where applicable', () => {
    const results = compareAllStructures({ ...defaults, province: 'QC' });
    const salaried = results.find((r) => r.type === 'salaried')!;
    expect(salaried.qpipPremium).toBeGreaterThan(0);
  });
});
