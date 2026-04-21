import { describe, it, expect } from 'vitest';
import { calculateTax } from '../engine';
import type { CalculatorInput } from '../types';

const defaults = {
  taxYear: 2026 as const,
  inputMode: 'annual' as const,
  hoursPerWeek: 40,
  weeksPerYear: 52,
};

describe('calculateTax — integration tests against CRA tables', () => {
  it('$40,000 salary in Alberta', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 40000,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(40000);

    // Federal tax: ~$3,087
    expect(result.federalTax).toBeCloseTo(3087, -2);

    // Alberta provincial: ~$1,378
    expect(result.provincialTax).toBeCloseTo(1378, -2);

    // CPP: (40000-3500)*0.0595 = $2,171.75
    expect(result.cppContribution).toBeCloseTo(2172, -2);

    // CPP2: 0 (below YMPE)
    expect(result.cpp2Contribution).toBe(0);

    // EI: 40000 * 0.0163 = $652
    expect(result.eiPremium).toBeCloseTo(652, -2);

    // Net should be gross minus total deductions
    expect(result.netAnnual).toBeCloseTo(
      40000 - result.totalDeductions,
      2
    );

    // Effective rate sanity check
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(50);
  });

  it('$60,000 salary in Ontario (including Ontario Health Premium)', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 60000,
      province: 'ON',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(60000);

    // Ontario Health Premium should be $600 for $60K income
    expect(result.ontarioHealthPremium).toBe(600);

    // Federal tax: ~$5,983
    // 58523*0.14 + (60000-58523)*0.205 = 8496.01
    // Credits: (16452+1501)*0.14 = 2513.42
    // Net: ~5982.59
    expect(result.federalTax).toBeCloseTo(5983, -2);

    // Total deductions within reasonable range
    expect(result.totalDeductions).toBeGreaterThan(10000);
    expect(result.totalDeductions).toBeLessThan(20000);
  });

  it('$80,000 salary in BC (7 brackets)', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 80000,
      province: 'BC',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(80000);

    // Should have 7 provincial bracket details
    expect(result.provincialBrackets.length).toBe(7);

    // Provincial tax for BC at $80K should be reasonable
    expect(result.provincialTax).toBeGreaterThan(3000);
    expect(result.provincialTax).toBeLessThan(6000);

    // CPP: (74600-3500)*0.0595 = $4,230.45 (capped because 80K > YMPE? No: earnings 80K > 74600 YMPE)
    // Actually at 80K, pensionable earnings = min(80000, 74600) - 3500 = 71100
    // 71100 * 0.0595 = 4230.45
    expect(result.cppContribution).toBe(4230.45);

    // CPP2: (80000 - 74600) * 0.04 = 5400 * 0.04 = 216
    expect(result.cpp2Contribution).toBe(216);
  });

  it('$100,000 salary in Quebec (QPP + QPIP + federal abatement)', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 100000,
      province: 'QC',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(100000);

    // QPIP should be non-zero for Quebec
    expect(result.qpipPremium).toBeGreaterThan(0);
    expect(result.qpipPremium).toBeCloseTo(494, -2); // 100000 * 0.00494

    // Federal tax should be reduced by Quebec abatement (16.5%)
    // Without abatement, federal on $100K ≈ $14,183
    // With abatement: 14183 * 0.835 ≈ $11,843
    expect(result.federalTax).toBeCloseTo(11843, -2);

    // EI should use Quebec reduced rate
    // 68900 * 0.01295 = $892.26 (capped because 100K > 68900)
    expect(result.eiPremium).toBeCloseTo(892, -2);
  });

  it('$150,000 salary in Alberta (CPP2 kicks in)', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 150000,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(150000);

    // CPP should be at max
    expect(result.cppContribution).toBe(4230.45);

    // CPP2 should be at max: (85000-74600)*0.04 = 416
    expect(result.cpp2Contribution).toBe(416);

    // EI should be at max: $1,123.07
    expect(result.eiPremium).toBe(1123.07);

    // Federal tax for $150K
    // 58523*0.14 + (117045-58523)*0.205 + (150000-117045)*0.26
    // = 8193.22 + 11997.01 + 8568.30 = 28758.53
    // Credits: (16452+1501)*0.14 = 2513.42
    // Net: 28758.53 - 2513.42 = 26245.11
    expect(result.federalTax).toBeCloseTo(26245, -2);

    // Alberta provincial: all in first bracket (0-151234 at 8%)
    // 150000 * 0.08 = 12000, BPA credit: 22769 * 0.08 = 1821.52
    // Net: 10178.48
    expect(result.provincialTax).toBeCloseTo(10178, -2);
  });

  it('$250,000 salary in Ontario (top bracket + surtax)', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 250000,
      province: 'ON',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(250000);

    // Ontario Health Premium should be $900 (max) for $250K
    expect(result.ontarioHealthPremium).toBe(900);

    // Federal: top bracket applies ($258,482+ at 33%)
    // Should be in the 29% bracket (181440-258482)
    expect(result.federalTax).toBeGreaterThan(40000);

    // Ontario provincial tax should include surtax
    expect(result.provincialTax).toBeGreaterThan(15000);

    // Total deductions substantial
    expect(result.totalDeductions).toBeGreaterThan(70000);
  });

  it('$18,150 (near federal minimum wage) in Alberta — near-zero tax', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 18150,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(18150);

    // Federal tax should be 0 or near 0
    // BPA ($16,452) + CEA ($1,501) credits at 14% = $2,513.42
    // Gross tax: 18150 * 0.14 = $2,541
    // Net: ~$27.58
    expect(result.federalTax).toBeLessThan(100);

    // Alberta: 18150 * 0.08 = 1452, BPA credit = 22769 * 0.08 = 1821.52
    // Net provincial: 0 (credit exceeds tax)
    expect(result.provincialTax).toBe(0);
  });

  it('$60,000 in Ontario with $10,000 RRSP deduction', () => {
    const withoutRRSP: CalculatorInput = {
      ...defaults,
      amount: 60000,
      province: 'ON',
    };
    const withRRSP: CalculatorInput = {
      ...defaults,
      amount: 60000,
      province: 'ON',
      rrspDeduction: 10000,
    };

    const resultWithout = calculateTax(withoutRRSP);
    const resultWith = calculateTax(withRRSP);

    // Gross should be the same
    expect(resultWith.grossAnnual).toBe(resultWithout.grossAnnual);

    // Both federal and provincial tax should be lower with RRSP
    expect(resultWith.federalTax).toBeLessThan(resultWithout.federalTax);
    expect(resultWith.provincialTax).toBeLessThan(resultWithout.provincialTax);

    // CPP, EI should be the same (based on gross, not taxable)
    expect(resultWith.cppContribution).toBe(resultWithout.cppContribution);
    expect(resultWith.eiPremium).toBe(resultWithout.eiPremium);

    // Net should be higher with RRSP
    expect(resultWith.netAnnual).toBeGreaterThan(resultWithout.netAnnual);
  });

  it('should convert hourly input correctly', () => {
    const hourlyInput: CalculatorInput = {
      ...defaults,
      amount: 25, // $25/hr
      inputMode: 'hourly',
      province: 'AB',
    };
    const annualInput: CalculatorInput = {
      ...defaults,
      amount: 25 * 40 * 52, // $52,000
      inputMode: 'annual',
      province: 'AB',
    };

    const hourlyResult = calculateTax(hourlyInput);
    const annualResult = calculateTax(annualInput);

    expect(hourlyResult.grossAnnual).toBe(annualResult.grossAnnual);
    expect(hourlyResult.federalTax).toBe(annualResult.federalTax);
    expect(hourlyResult.netAnnual).toBe(annualResult.netAnnual);
  });

  it('should convert monthly input correctly', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 5000, // $5,000/month
      inputMode: 'monthly',
      province: 'AB',
    };
    const result = calculateTax(input);
    expect(result.grossAnnual).toBe(60000);
  });

  it('should convert biweekly input correctly', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 2000, // $2,000 bi-weekly
      inputMode: 'biweekly',
      province: 'AB',
    };
    const result = calculateTax(input);
    expect(result.grossAnnual).toBe(52000);
  });

  it('should convert weekly input correctly', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 1000, // $1,000/week
      inputMode: 'weekly',
      province: 'AB',
    };
    const result = calculateTax(input);
    expect(result.grossAnnual).toBe(52000);
  });

  it('should handle 0 income gracefully', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 0,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.grossAnnual).toBe(0);
    expect(result.federalTax).toBe(0);
    expect(result.provincialTax).toBe(0);
    expect(result.cppContribution).toBe(0);
    expect(result.eiPremium).toBe(0);
    expect(result.totalDeductions).toBe(0);
    expect(result.netAnnual).toBe(0);
    expect(result.effectiveTaxRate).toBe(0);
  });

  it('net amounts should be consistent with annual', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 75000,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.netMonthly).toBeCloseTo(result.netAnnual / 12, 2);
    expect(result.netBiweekly).toBeCloseTo(result.netAnnual / 26, 2);
    expect(result.netWeekly).toBeCloseTo(result.netAnnual / 52, 2);
    expect(result.netHourly).toBeCloseTo(result.netAnnual / (40 * 52), 2);
  });

  it('gross amounts should be consistent with annual', () => {
    const input: CalculatorInput = {
      ...defaults,
      amount: 75000,
      province: 'AB',
    };
    const result = calculateTax(input);

    expect(result.grossMonthly).toBeCloseTo(75000 / 12, 2);
    expect(result.grossBiweekly).toBeCloseTo(75000 / 26, 2);
    expect(result.grossWeekly).toBeCloseTo(75000 / 52, 2);
    expect(result.grossHourly).toBeCloseTo(75000 / (40 * 52), 2);
  });
});
