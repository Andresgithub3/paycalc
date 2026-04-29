import { describe, it, expect } from 'vitest';
import {
  calculateSelfEmploymentDeductions,
  calculateCombinedCPP,
} from '../self-employment';

describe('calculateSelfEmploymentDeductions', () => {
  it('should return zeros for zero income', () => {
    const result = calculateSelfEmploymentDeductions(0, 2026, 'ON', false);
    expect(result.cppTotal).toBe(0);
    expect(result.eiPremium).toBe(0);
    expect(result.taxableIncome).toBe(0);
  });

  it('should return zeros for negative income', () => {
    const result = calculateSelfEmploymentDeductions(-5000, 2026, 'AB', false);
    expect(result.cppTotal).toBe(0);
    expect(result.taxableIncome).toBe(0);
  });

  it('should calculate double CPP for $100,000 self-employment income', () => {
    const result = calculateSelfEmploymentDeductions(100000, 2026, 'AB', false);

    // CPP on earnings between $3,500 and $74,600 = $71,100 * 5.95% = $4,230.45 (max)
    expect(result.cppEmployee).toBe(4230.45);
    expect(result.cppEmployer).toBe(4230.45);
    expect(result.cppTotal).toBe(8460.90);

    // CPP2 on earnings between $74,600 and $85,000 = $10,400 * 4% = $416
    // Both halves for self-employed = $416 * 2 = $832 total
    // But each half is capped at $416
    expect(result.cpp2Employee).toBe(416.00);
    expect(result.cpp2Employer).toBe(416.00);
    expect(result.cpp2Total).toBe(832.00);

    // Employer half is deductible: $4,230.45 + $416.00 = $4,646.45
    expect(result.cppDeduction).toBe(4646.45);

    // No EI (not opted in)
    expect(result.eiPremium).toBe(0);

    // Taxable income: $100,000 - $4,646.45 = $95,353.55
    expect(result.taxableIncome).toBe(95353.55);
  });

  it('should not include EI when not opted in', () => {
    const result = calculateSelfEmploymentDeductions(80000, 2026, 'ON', false);
    expect(result.eiPremium).toBe(0);
  });

  it('should include EI when opted in', () => {
    const result = calculateSelfEmploymentDeductions(80000, 2026, 'ON', true);
    // EI: min(80000, 68900) * 1.63% = 68900 * 0.0163 = 1123.07
    expect(result.eiPremium).toBe(1123.07);
  });

  it('should include EI at Quebec rate when opted in', () => {
    const result = calculateSelfEmploymentDeductions(80000, 2026, 'QC', true);
    // Quebec EI: min(80000, 68900) * 1.295% = 68900 * 0.01295 = 892.255 → 892.26
    expect(result.eiPremium).toBe(892.26);
  });

  it('should include QPIP for Quebec', () => {
    const result = calculateSelfEmploymentDeductions(80000, 2026, 'QC', false);
    // QPIP: min(80000, 98000) * 0.494% = 80000 * 0.00494 = 395.20
    expect(result.qpipPremium).toBe(395.20);
  });

  it('should not include QPIP for non-Quebec', () => {
    const result = calculateSelfEmploymentDeductions(80000, 2026, 'ON', false);
    expect(result.qpipPremium).toBe(0);
  });

  it('should handle income below CPP basic exemption', () => {
    const result = calculateSelfEmploymentDeductions(3000, 2026, 'ON', false);
    // Income ($3,000) < basic exemption ($3,500) → no CPP
    expect(result.cppEmployee).toBe(0);
    expect(result.cppTotal).toBe(0);
    expect(result.cppDeduction).toBe(0);
    expect(result.taxableIncome).toBe(3000);
  });

  it('should handle income between exemption and YMPE', () => {
    const result = calculateSelfEmploymentDeductions(50000, 2026, 'ON', false);
    // CPP: (50000 - 3500) * 5.95% = 46500 * 0.0595 = 2766.75
    expect(result.cppEmployee).toBe(2766.75);
    expect(result.cppEmployer).toBe(2766.75);
    expect(result.cppTotal).toBe(5533.50);

    // No CPP2 (below YMPE)
    expect(result.cpp2Total).toBe(0);

    // Deduction: employer half = $2,766.75
    expect(result.cppDeduction).toBe(2766.75);
  });
});

describe('calculateCombinedCPP', () => {
  it('should cap combined CPP when both employment and self-employment', () => {
    // $60,000 employment + $60,000 self-employment = $120,000 total
    const result = calculateCombinedCPP(60000, 60000, 2026, 'ON');

    // Employment CPP: (min(60000, 74600) - 3500) * 5.95% = 56500 * 0.0595 = 3361.75
    expect(result.employmentCPP).toBe(3361.75);

    // Total CPP on combined $120k: (74600 - 3500) * 5.95% = 4230.45 (max)
    // Self-employed employee portion: 4230.45 - 3361.75 = 868.70
    expect(result.selfEmployedCPPEmployee).toBe(868.70);
    expect(result.selfEmployedCPPEmployer).toBe(868.70);
  });

  it('should return zero self-employed CPP when employment already maxes out', () => {
    // $80,000 employment (above YMPE) + $50,000 self-employment
    const result = calculateCombinedCPP(80000, 50000, 2026, 'ON');

    // Employment CPP: (74600 - 3500) * 5.95% = 4230.45 (max)
    expect(result.employmentCPP).toBe(4230.45);

    // Self-employed CPP: already maxed from employment → 0
    expect(result.selfEmployedCPPEmployee).toBe(0);
    expect(result.selfEmployedCPPEmployer).toBe(0);
  });

  it('should handle CPP2 on combined earnings above YMPE', () => {
    // $70,000 employment + $20,000 self-employment = $90,000 combined
    const result = calculateCombinedCPP(70000, 20000, 2026, 'ON');

    // CPP2 on combined $90k: min(90000, 85000) - 74600 = 10400 * 4% = 416
    // CPP2 on employment $70k: below YMPE → 0
    // Self-employed CPP2: 416 * 2 (both halves) = 832
    // Total CPP2: 0 + 832 = 832
    expect(result.cpp2Total).toBe(832);
  });

  it('should handle zero employment income', () => {
    const result = calculateCombinedCPP(0, 80000, 2026, 'ON');
    expect(result.employmentCPP).toBe(0);

    // CPP on self-employment: (74600 - 3500) * 5.95% = 4230.45
    expect(result.selfEmployedCPPEmployee).toBe(4230.45);
    expect(result.selfEmployedCPPEmployer).toBe(4230.45);
  });

  it('should handle zero self-employment income', () => {
    const result = calculateCombinedCPP(80000, 0, 2026, 'ON');
    expect(result.employmentCPP).toBe(4230.45);
    expect(result.selfEmployedCPPEmployee).toBe(0);
    expect(result.selfEmployedCPPEmployer).toBe(0);
  });
});
