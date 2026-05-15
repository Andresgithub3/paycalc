import { describe, it, expect } from 'vitest';
import { calculateContractorEquivalent } from '../contractor';
import type { ContractorInput } from '../types';

const defaults: ContractorInput = {
  hourlyRate: 75,
  billableHours: 1500,
  province: 'AB',
  expenses: 10000,
  salaryPercent: 50,
  taxYear: 2026,
};

describe('calculateContractorEquivalent', () => {
  it('basic hourly input: computes revenue correctly', () => {
    const result = calculateContractorEquivalent(defaults);
    expect(result.grossRevenue).toBe(112500); // 75 * 1500
    expect(result.expenses).toBe(10000);
    expect(result.businessIncome).toBe(102500);
  });

  it('annual revenue input overrides hourly', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      annualRevenue: 150000,
      hourlyRate: undefined,
      billableHours: undefined,
    });
    expect(result.grossRevenue).toBe(150000);
    expect(result.businessIncome).toBe(140000);
  });

  it('100% salary split: no corporate or dividend tax', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 100,
    });
    expect(result.corporateTax).toBe(0);
    expect(result.dividendTax).toBe(0);
    expect(result.dividendAmount).toBe(0);
    expect(result.dividendNet).toBe(0);
    expect(result.salary).toBeGreaterThan(0);
    expect(result.salaryNet).toBeGreaterThan(0);
    expect(result.contractorNet).toBe(result.salaryNet);
  });

  it('0% salary split (all dividends): no salary, has corporate + dividend tax', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 0,
    });
    expect(result.salary).toBe(0);
    expect(result.salaryNet).toBe(0);
    expect(result.corporateTax).toBeGreaterThan(0);
    expect(result.dividendAmount).toBeGreaterThan(0);
    expect(result.dividendNet).toBeGreaterThan(0);
    expect(result.contractorNet).toBe(result.dividendNet);
    expect(result.contractorRRSP).toBe(0); // No RRSP from dividends
  });

  it('50/50 split: both salary and dividend components', () => {
    const result = calculateContractorEquivalent(defaults);
    expect(result.salary).toBeGreaterThan(0);
    expect(result.dividendAmount).toBeGreaterThan(0);
    expect(result.salaryNet).toBeGreaterThan(0);
    expect(result.dividendNet).toBeGreaterThan(0);
    expect(result.contractorNet).toBeCloseTo(result.salaryNet + result.dividendNet, 0);
  });

  it('zero revenue returns zero result', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      annualRevenue: 0,
      hourlyRate: undefined,
    });
    expect(result.businessIncome).toBe(0);
    expect(result.contractorNet).toBe(0);
    expect(result.equivalentSalary).toBe(0);
    expect(result.employeeNet).toBe(0);
  });

  it('expenses exceeding revenue returns zero result', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      annualRevenue: 5000,
      hourlyRate: undefined,
      expenses: 10000,
    });
    expect(result.businessIncome).toBe(0);
    expect(result.contractorNet).toBe(0);
  });

  it('Quebec includes QPIP on salary portion', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      province: 'QC',
      salaryPercent: 100,
    });
    expect(result.salaryQPIP).toBeGreaterThan(0);
    expect(result.employeeQPIP).toBeGreaterThan(0);
  });

  it('Ontario includes Ontario Health Premium', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      province: 'ON',
      salaryPercent: 100,
    });
    expect(result.salaryOntarioHealth).toBeGreaterThan(0);
    expect(result.employeeOntarioHealth).toBeGreaterThan(0);
  });

  it('equivalent salary produces net within $1 of contractor net', () => {
    const result = calculateContractorEquivalent(defaults);
    // The employee net should match the contractor net within $1
    expect(Math.abs(result.employeeNet - result.contractorNet)).toBeLessThan(1);
  });

  it('equivalent salary matches for all-salary split', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 100,
    });
    expect(Math.abs(result.employeeNet - result.contractorNet)).toBeLessThan(1);
  });

  it('equivalent salary matches for all-dividends split', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 0,
    });
    expect(Math.abs(result.employeeNet - result.contractorNet)).toBeLessThan(1);
  });

  it('equivalent salary matches for Quebec 50/50', () => {
    const result = calculateContractorEquivalent({
      ...defaults,
      province: 'QC',
    });
    expect(Math.abs(result.employeeNet - result.contractorNet)).toBeLessThan(1);
  });

  it('RRSP room based on salary portion only', () => {
    const allSalary = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 100,
    });
    const allDividends = calculateContractorEquivalent({
      ...defaults,
      salaryPercent: 0,
    });
    expect(allSalary.contractorRRSP).toBeGreaterThan(0);
    expect(allDividends.contractorRRSP).toBe(0);
  });

  it('equivalent hourly rate is based on 2080 hours', () => {
    const result = calculateContractorEquivalent(defaults);
    expect(result.equivalentHourly).toBeCloseTo(result.equivalentSalary / 2080, 1);
  });

  it('effective rates are reasonable', () => {
    const result = calculateContractorEquivalent(defaults);
    expect(result.contractorEffectiveRate).toBeGreaterThan(0);
    expect(result.contractorEffectiveRate).toBeLessThan(60);
    expect(result.employeeEffectiveRate).toBeGreaterThan(0);
    expect(result.employeeEffectiveRate).toBeLessThan(60);
  });
});
