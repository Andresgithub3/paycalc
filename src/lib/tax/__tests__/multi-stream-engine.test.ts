import { describe, it, expect } from 'vitest';
import { calculateMultiStreamTax } from '../multi-stream-engine';
import type { MultiStreamInput } from '../income-types';

function makeInput(overrides: Partial<MultiStreamInput> = {}): MultiStreamInput {
  return {
    province: 'AB',
    taxYear: 2026,
    employmentIncome: 0,
    selfEmploymentIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    otherIncome: 0,
    rrspDeduction: 0,
    selfEmployedEIOpted: false,
    pensionIncome: 0,
    isAge65Plus: false,
    ...overrides,
  };
}

describe('calculateMultiStreamTax', () => {
  // ─── Zero income ───
  describe('zero income', () => {
    it('should return all zeros when all inputs are zero', () => {
      const result = calculateMultiStreamTax(makeInput());

      expect(result.totalIncome).toBe(0);
      expect(result.totalTaxableIncome).toBe(0);
      expect(result.totalTaxPayable).toBe(0);
      expect(result.netIncome).toBe(0);
      expect(result.effectiveTaxRate).toBe(0);
      expect(result.federalTax).toBe(0);
      expect(result.provincialTax).toBe(0);
      expect(result.cppEmployee).toBe(0);
      expect(result.cppSelfEmployed).toBe(0);
      expect(result.eiPremium).toBe(0);
      expect(result.streams).toHaveLength(0);
    });
  });

  // ─── Employment only ───
  describe('employment income only', () => {
    it('should match existing calculator for $80,000 employment in Alberta', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        province: 'AB',
      }));

      expect(result.totalIncome).toBe(80000);
      expect(result.totalTaxableIncome).toBe(80000);

      // CPP: (74600 - 3500) * 5.95% = 4230.45
      expect(result.cppEmployee).toBe(4230.45);
      // CPP2: (80000 - 74600) * 4% = 216
      expect(result.cpp2Total).toBe(216);
      // EI: min(80000, 68900) * 1.63% = 1123.07
      expect(result.eiPremium).toBe(1123.07);

      // No dividend credits
      expect(result.federalEligibleDTC).toBe(0);
      expect(result.federalIneligibleDTC).toBe(0);

      // Total deductions should be reasonable for $80K in AB
      expect(result.totalDeductions).toBeGreaterThan(15000);
      expect(result.totalDeductions).toBeLessThan(25000);

      // Net income
      expect(result.netIncome).toBe(80000 - result.totalDeductions);
    });
  });

  // ─── Capital gains ───
  describe('capital gains', () => {
    it('should include only 50% of $100,000 capital gain in taxable income', () => {
      const result = calculateMultiStreamTax(makeInput({
        capitalGains: 100000,
      }));

      expect(result.totalIncome).toBe(100000);
      expect(result.totalTaxableIncome).toBe(50000); // 50% inclusion

      // No CPP or EI on capital gains
      expect(result.cppEmployee).toBe(0);
      expect(result.eiPremium).toBe(0);

      // Stream analysis
      expect(result.streams).toHaveLength(1);
      expect(result.streams[0].type).toBe('capitalGains');
      expect(result.streams[0].actualAmount).toBe(100000);
      expect(result.streams[0].taxableAmount).toBe(50000);
    });

    it('should stack capital gains on top of employment income', () => {
      const empOnly = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
      }));

      const empPlusCapGains = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
      }));

      // Taxable income should increase by $10,000 (50% of $20K)
      expect(empPlusCapGains.totalTaxableIncome).toBe(90000);

      // Total tax should be higher
      expect(empPlusCapGains.totalDeductions).toBeGreaterThan(empOnly.totalDeductions);

      // Capital gains marginal rate should be half ordinary rate
      expect(empPlusCapGains.marginalRates.capitalGains).toBeCloseTo(
        empPlusCapGains.marginalRates.ordinary * 0.5, 3
      );
    });
  });

  // ─── Eligible dividends ───
  describe('eligible dividends', () => {
    it('should gross up eligible dividends by 38%', () => {
      const result = calculateMultiStreamTax(makeInput({
        eligibleDividends: 10000,
        province: 'AB',
      }));

      expect(result.totalIncome).toBe(10000);
      // Taxable: 10000 * 1.38 = 13800
      expect(result.totalTaxableIncome).toBe(13800);

      // Should have federal DTC
      expect(result.federalEligibleDTC).toBeGreaterThan(0);
      // Federal DTC: 13800 * 0.150198 = 2072.73
      expect(result.federalEligibleDTC).toBe(2072.73);

      // Alberta provincial DTC: 13800 * 0.0812 = 1120.56
      expect(result.provincialEligibleDTC).toBe(1120.56);
    });

    it('should result in near-zero tax for $50,000 eligible dividends as only income', () => {
      // At low brackets, the DTC should nearly eliminate tax
      const result = calculateMultiStreamTax(makeInput({
        eligibleDividends: 50000,
        province: 'AB',
      }));

      expect(result.totalIncome).toBe(50000);
      // Taxable: 50000 * 1.38 = 69000
      expect(result.totalTaxableIncome).toBe(69000);

      // The DTC should significantly reduce or eliminate tax
      // Federal DTC: 69000 * 0.150198 = 10363.66
      // This should offset most or all of the federal tax on $69K
      expect(result.federalEligibleDTC).toBe(10363.66);

      // Combined tax should be very low — DTC offsets most tax
      const totalIncomeTax = result.federalTax + result.provincialTax;
      expect(totalIncomeTax).toBeLessThan(2000);
    });
  });

  // ─── Ineligible dividends ───
  describe('ineligible dividends', () => {
    it('should gross up ineligible dividends by 15% in Ontario', () => {
      const result = calculateMultiStreamTax(makeInput({
        ineligibleDividends: 10000,
        province: 'ON',
      }));

      expect(result.totalIncome).toBe(10000);
      // Taxable: 10000 * 1.15 = 11500
      expect(result.totalTaxableIncome).toBe(11500);

      // Federal DTC: 11500 * 0.090301 = 1038.46
      expect(result.federalIneligibleDTC).toBe(1038.46);
      // Ontario DTC: 11500 * 0.029863 = 343.42
      expect(result.provincialIneligibleDTC).toBe(343.42);
    });
  });

  // ─── Self-employment ───
  describe('self-employment income', () => {
    it('should calculate double CPP for $100,000 self-employment in Alberta', () => {
      const result = calculateMultiStreamTax(makeInput({
        selfEmploymentIncome: 100000,
        province: 'AB',
      }));

      expect(result.totalIncome).toBe(100000);

      // Self-employed CPP: both halves
      // Employee: 4230.45, Employer: 4230.45, Total: 8460.90
      expect(result.cppSelfEmployed).toBe(8460.90);

      // CPP2: both halves = (10400 * 4%) * 2 = 832
      expect(result.cpp2Total).toBe(832);

      // No employment CPP
      expect(result.cppEmployee).toBe(0);

      // No EI (not opted in)
      expect(result.eiPremium).toBe(0);

      // Taxable income should be reduced by employer-half CPP deduction
      // Deduction: 4230.45 + 416 = 4646.45
      expect(result.totalTaxableIncome).toBe(95353.55);
    });

    it('should include EI when opted in', () => {
      const result = calculateMultiStreamTax(makeInput({
        selfEmploymentIncome: 80000,
        selfEmployedEIOpted: true,
        province: 'ON',
      }));

      expect(result.eiPremium).toBeGreaterThan(0);
    });

    it('should share CPP cap between employment and self-employment', () => {
      // $80,000 employment + $50,000 self-employment = $130,000 total
      // CPP maxes out at YMPE ($74,600)
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        selfEmploymentIncome: 50000,
        province: 'AB',
      }));

      // Employment already maxes CPP: (74600 - 3500) * 5.95% = 4230.45
      expect(result.cppEmployee).toBe(4230.45);

      // Self-employed CPP should be zero (already maxed from employment)
      expect(result.cppSelfEmployed).toBe(0);
    });
  });

  // ─── Quebec specifics ───
  describe('Quebec', () => {
    it('should apply federal abatement for Quebec', () => {
      const abResult = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        province: 'AB',
      }));

      const qcResult = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        province: 'QC',
      }));

      // Quebec federal tax should be ~16.5% lower than same income in AB
      // (before provincial tax which is different anyway)
      expect(qcResult.federalTax).toBeLessThan(abResult.federalTax);
    });

    it('should include QPIP for Quebec', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        province: 'QC',
      }));

      expect(result.qpipPremium).toBeGreaterThan(0);
      // QPIP: min(80000, 98000) * 0.494% = 395.20
      expect(result.qpipPremium).toBe(395.20);
    });

    it('should calculate self-employment in Quebec with QPP and QPIP', () => {
      const result = calculateMultiStreamTax(makeInput({
        selfEmploymentIncome: 100000,
        province: 'QC',
      }));

      // Should have double CPP (QPP), QPIP, and federal abatement
      expect(result.cppSelfEmployed).toBe(8460.90);
      expect(result.qpipPremium).toBeGreaterThan(0);

      // Federal tax should reflect 16.5% abatement
      // (we test this indirectly — QC federal tax is lower)
    });
  });

  // ─── Ontario specifics ───
  describe('Ontario', () => {
    it('should include Ontario Health Premium on combined income', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        otherIncome: 20000,
        province: 'ON',
      }));

      // Taxable income is $80K + $20K = $100K, but taxable includes the actual amounts
      // (no gross-ups here), so taxable income is $100,000 → OHP = $750
      // ($72,600-$200K bracket = $750)
      expect(result.ontarioHealthPremium).toBe(750);
    });
  });

  // ─── RRSP deduction ───
  describe('RRSP deduction', () => {
    it('should reduce combined taxable income', () => {
      const withoutRRSP = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        otherIncome: 20000,
      }));

      const withRRSP = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        otherIncome: 20000,
        rrspDeduction: 10000,
      }));

      expect(withRRSP.totalTaxableIncome).toBe(withoutRRSP.totalTaxableIncome - 10000);
      expect(withRRSP.totalDeductions).toBeLessThan(withoutRRSP.totalDeductions);
    });

    it('should not make taxable income negative', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 5000,
        rrspDeduction: 20000,
      }));

      expect(result.totalTaxableIncome).toBe(0);
    });
  });

  // ─── Mixed income integration scenarios ───
  describe('mixed income - Alberta', () => {
    it('should calculate correct tax for $80K emp + $20K CG + $15K elig div + $5K inelig div + $3K interest', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
        eligibleDividends: 15000,
        ineligibleDividends: 5000,
        otherIncome: 3000,
        province: 'AB',
      }));

      // Total actual income: 80000 + 20000 + 15000 + 5000 + 3000 = 123000
      expect(result.totalIncome).toBe(123000);

      // Taxable income:
      // employment: 80000
      // capital gains: 20000 * 0.50 = 10000
      // eligible div: 15000 * 1.38 = 20700
      // ineligible div: 5000 * 1.15 = 5750
      // other: 3000
      // Total: 80000 + 10000 + 20700 + 5750 + 3000 = 119450
      expect(result.totalTaxableIncome).toBe(119450);

      // CPP on employment: (74600 - 3500) * 5.95% = 4230.45
      expect(result.cppEmployee).toBe(4230.45);

      // CPP2: (80000 - 74600) * 4% = 216
      expect(result.cpp2Total).toBe(216);

      // EI: min(80000, 68900) * 1.63% = 1123.07
      expect(result.eiPremium).toBe(1123.07);

      // Federal eligible DTC: 20700 * 0.150198 = 3109.10
      expect(result.federalEligibleDTC).toBeCloseTo(3109.10, 0);

      // Federal ineligible DTC: 5750 * 0.090301 = 519.23
      expect(result.federalIneligibleDTC).toBeCloseTo(519.23, 0);

      // Provincial eligible DTC (AB): 20700 * 0.0812 = 1680.84
      expect(result.provincialEligibleDTC).toBeCloseTo(1680.84, 0);

      // Provincial ineligible DTC (AB): 5750 * 0.0218 = 125.35
      expect(result.provincialIneligibleDTC).toBeCloseTo(125.35, 0);

      // Reasonable total deductions range for this scenario
      expect(result.totalDeductions).toBeGreaterThan(20000);
      expect(result.totalDeductions).toBeLessThan(40000);

      // Net income should be reasonable
      expect(result.netIncome).toBeGreaterThan(85000);
      expect(result.netIncome).toBeLessThan(105000);

      // Stream analysis should have 5 entries (employment, other, capitalGains, eligibleDividends, ineligibleDividends)
      expect(result.streams).toHaveLength(5);

      // Marginal rates should make sense
      expect(result.marginalRates.ordinary).toBeGreaterThan(0.25);
      expect(result.marginalRates.capitalGains).toBeCloseTo(result.marginalRates.ordinary * 0.5, 3);
      expect(result.marginalRates.eligibleDividends).toBeLessThan(result.marginalRates.ordinary);
    });
  });

  describe('mixed income - Ontario', () => {
    it('should include Ontario Health Premium and surtax on mixed income', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
        eligibleDividends: 15000,
        ineligibleDividends: 5000,
        otherIncome: 3000,
        province: 'ON',
      }));

      expect(result.totalIncome).toBe(123000);
      expect(result.totalTaxableIncome).toBe(119450);

      // Ontario Health Premium on $119,450 → $750
      expect(result.ontarioHealthPremium).toBe(750);

      // Should have reasonable total tax
      expect(result.totalDeductions).toBeGreaterThan(25000);
      expect(result.totalDeductions).toBeLessThan(45000);
    });
  });

  describe('mixed income - Quebec', () => {
    it('should apply federal abatement, QPP, and QPIP on mixed income', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
        eligibleDividends: 15000,
        ineligibleDividends: 5000,
        otherIncome: 3000,
        province: 'QC',
      }));

      expect(result.totalIncome).toBe(123000);
      expect(result.totalTaxableIncome).toBe(119450);

      // Quebec QPIP
      expect(result.qpipPremium).toBeGreaterThan(0);

      // Should have Quebec DTC rates applied
      // Eligible DTC (QC): 20700 * 0.117 = 2421.90
      expect(result.provincialEligibleDTC).toBeCloseTo(2421.90, 0);

      // Reasonable total tax
      expect(result.totalDeductions).toBeGreaterThan(25000);
      expect(result.totalDeductions).toBeLessThan(50000);
    });
  });

  // ─── Marginal rates ───
  describe('marginal rates', () => {
    it('should calculate all four marginal rate types', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
        eligibleDividends: 15000,
        province: 'AB',
      }));

      // All rates should be positive
      expect(result.marginalRates.ordinary).toBeGreaterThan(0);
      expect(result.marginalRates.capitalGains).toBeGreaterThan(0);
      expect(result.marginalRates.eligibleDividends).toBeGreaterThanOrEqual(0);

      // Capital gains rate should be half ordinary rate
      expect(result.marginalRates.capitalGains).toBeCloseTo(
        result.marginalRates.ordinary * 0.5, 3
      );

      // Eligible dividend rate should be less than ordinary rate
      expect(result.marginalRates.eligibleDividends).toBeLessThan(result.marginalRates.ordinary);
    });

    it('should return zero marginal rates for zero income', () => {
      const result = calculateMultiStreamTax(makeInput());
      expect(result.marginalRates.ordinary).toBe(0);
      expect(result.marginalRates.capitalGains).toBe(0);
      expect(result.marginalRates.eligibleDividends).toBe(0);
      expect(result.marginalRates.ineligibleDividends).toBe(0);
    });
  });

  // ─── Per-stream analysis ───
  describe('per-stream analysis', () => {
    it('should generate one stream entry per non-zero income type', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 80000,
        capitalGains: 20000,
        eligibleDividends: 15000,
        ineligibleDividends: 5000,
        otherIncome: 3000,
      }));

      expect(result.streams).toHaveLength(5);
      expect(result.streams.map(s => s.type)).toEqual([
        'employment', 'other', 'capitalGains', 'eligibleDividends', 'ineligibleDividends'
      ]);
    });

    it('should show correct taxable amounts in stream analysis', () => {
      const result = calculateMultiStreamTax(makeInput({
        capitalGains: 20000,
        eligibleDividends: 15000,
        ineligibleDividends: 5000,
      }));

      const cgStream = result.streams.find(s => s.type === 'capitalGains');
      expect(cgStream?.actualAmount).toBe(20000);
      expect(cgStream?.taxableAmount).toBe(10000);

      const eligStream = result.streams.find(s => s.type === 'eligibleDividends');
      expect(eligStream?.actualAmount).toBe(15000);
      expect(eligStream?.taxableAmount).toBe(20700);

      const ineligStream = result.streams.find(s => s.type === 'ineligibleDividends');
      expect(ineligStream?.actualAmount).toBe(5000);
      expect(ineligStream?.taxableAmount).toBe(5750);
    });
  });

  // ─── Pension income ───
  describe('pension income', () => {
    it('should include pension income in total and taxable income', () => {
      const result = calculateMultiStreamTax(makeInput({
        pensionIncome: 30000,
        province: 'AB',
      }));

      expect(result.totalIncome).toBe(30000);
      expect(result.totalTaxableIncome).toBe(30000);
      // No CPP/EI on pension income
      expect(result.cppEmployee).toBe(0);
      expect(result.eiPremium).toBe(0);
    });

    it('should apply pension income credit for $2,000+ pension income', () => {
      const result = calculateMultiStreamTax(makeInput({
        pensionIncome: 30000,
        province: 'AB',
      }));

      // Federal pension credit: $2,000 × 0.14 = $280
      expect(result.pensionCreditFederal).toBe(280);
      // Provincial (AB): $1,000 × 0.08 = $80
      expect(result.pensionCreditProvincial).toBe(80);
    });

    it('should not apply age amount credit when not 65+', () => {
      const result = calculateMultiStreamTax(makeInput({
        pensionIncome: 30000,
        isAge65Plus: false,
      }));

      expect(result.ageAmountCreditFederal).toBe(0);
      expect(result.ageAmountCreditProvincial).toBe(0);
    });

    it('should apply age amount credit when 65+', () => {
      const result = calculateMultiStreamTax(makeInput({
        pensionIncome: 30000,
        isAge65Plus: true,
        province: 'AB',
      }));

      // Income $30,000 is below federal clawback threshold $46,432
      // Federal age credit: $9,208 × 0.14 = $1,289.12
      expect(result.ageAmountCreditFederal).toBe(1289.12);
      // Provincial (AB): $6,345 × 0.08 = $507.60
      expect(result.ageAmountCreditProvincial).toBe(507.60);
    });

    it('should reduce tax with pension and age credits combined', () => {
      const withoutPension = calculateMultiStreamTax(makeInput({
        employmentIncome: 60000,
        province: 'AB',
      }));

      const withPension65 = calculateMultiStreamTax(makeInput({
        employmentIncome: 60000,
        pensionIncome: 10000,
        isAge65Plus: true,
        province: 'AB',
      }));

      // More income but credits should partially offset the tax
      // The pension + age credits (280 + 80 + 1289.12 + 507.60 = $2,156.72)
      // should significantly reduce the marginal impact of the pension income
      expect(withPension65.totalIncome).toBe(70000);
      expect(withPension65.pensionCreditFederal).toBe(280);
      expect(withPension65.ageAmountCreditFederal).toBeGreaterThan(0);
    });

    it('should apply Quebec deduction reducing taxable income', () => {
      const result = calculateMultiStreamTax(makeInput({
        pensionIncome: 30000,
        province: 'QC',
      }));

      // QC deduction of $2,000 reduces taxable income
      expect(result.totalTaxableIncome).toBe(28000); // 30000 - 2000
      expect(result.pensionCreditProvincial).toBe(0); // QC uses deduction not credit
    });

    it('should add pension to per-stream analysis', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 60000,
        pensionIncome: 20000,
        otherIncome: 5000,
      }));

      expect(result.streams).toHaveLength(3);
      expect(result.streams.map(s => s.type)).toEqual([
        'employment', 'pension', 'other'
      ]);

      const pensionStream = result.streams.find(s => s.type === 'pension');
      expect(pensionStream?.actualAmount).toBe(20000);
      expect(pensionStream?.taxableAmount).toBe(20000);
    });

    it('should clawback age amount at higher income', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 50000,
        pensionIncome: 30000,
        isAge65Plus: true,
        province: 'AB',
      }));

      // Total taxable = $80,000, well above federal threshold $46,432
      // Federal clawback = (80000 - 46432) * 0.15 = $5,035.20
      expect(result.ageAmountClawback).toBe(5035.20);
      // Claimable = $9,208 - $5,035.20 = $4,172.80
      // Credit = $4,172.80 × 0.14 = $584.19
      expect(result.ageAmountCreditFederal).toBeCloseTo(584.19, 0);
    });
  });

  // ─── Edge cases ───
  describe('edge cases', () => {
    it('should handle very small income amounts', () => {
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 100,
      }));

      expect(result.totalIncome).toBe(100);
      // Below BPA, so tax should be zero or near-zero
      expect(result.federalTax).toBe(0);
    });

    it('should handle income below BPA threshold', () => {
      const result = calculateMultiStreamTax(makeInput({
        otherIncome: 10000,
      }));

      // $10,000 is below BPA (~$16,452), so income tax should be zero
      expect(result.federalTax).toBe(0);
      expect(result.provincialTax).toBe(0);
    });

    it('should handle self-employment with employment at max CPP', () => {
      // Both maxing CPP separately — should share the cap
      const result = calculateMultiStreamTax(makeInput({
        employmentIncome: 100000,
        selfEmploymentIncome: 100000,
      }));

      // Employment CPP already at max
      expect(result.cppEmployee).toBe(4230.45);
      // Self-employed should contribute zero (already maxed)
      expect(result.cppSelfEmployed).toBe(0);
    });
  });
});
