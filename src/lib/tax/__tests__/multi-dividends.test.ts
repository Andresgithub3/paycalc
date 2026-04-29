import { describe, it, expect } from 'vitest';
import {
  grossUpEligibleDividends,
  grossUpIneligibleDividends,
  calculateEligibleDividendCredits,
  calculateIneligibleDividendCredits,
  calculateEligibleDividendMarginalRate,
  calculateIneligibleDividendMarginalRate,
} from '../multi-dividends';

describe('grossUpEligibleDividends', () => {
  it('should return zeros for zero input', () => {
    const result = grossUpEligibleDividends(0);
    expect(result.actualAmount).toBe(0);
    expect(result.grossUpAmount).toBe(0);
    expect(result.taxableAmount).toBe(0);
  });

  it('should return zeros for negative input', () => {
    const result = grossUpEligibleDividends(-1000);
    expect(result.actualAmount).toBe(0);
    expect(result.taxableAmount).toBe(0);
  });

  it('should correctly gross up $10,000 eligible dividend by 38%', () => {
    const result = grossUpEligibleDividends(10000);
    expect(result.actualAmount).toBe(10000);
    expect(result.grossUpAmount).toBe(3800);
    expect(result.taxableAmount).toBe(13800);
  });

  it('should correctly gross up $50,000 eligible dividend', () => {
    const result = grossUpEligibleDividends(50000);
    expect(result.taxableAmount).toBe(69000); // 50000 * 1.38
  });

  it('should handle fractional amounts', () => {
    const result = grossUpEligibleDividends(1234.56);
    expect(result.grossUpAmount).toBe(469.13); // 1234.56 * 0.38 = 469.1328 → 469.13
    expect(result.taxableAmount).toBe(1703.69); // 1234.56 + 469.13
  });
});

describe('grossUpIneligibleDividends', () => {
  it('should return zeros for zero input', () => {
    const result = grossUpIneligibleDividends(0);
    expect(result.taxableAmount).toBe(0);
  });

  it('should correctly gross up $10,000 ineligible dividend by 15%', () => {
    const result = grossUpIneligibleDividends(10000);
    expect(result.actualAmount).toBe(10000);
    expect(result.grossUpAmount).toBe(1500);
    expect(result.taxableAmount).toBe(11500);
  });

  it('should correctly gross up $5,000 ineligible dividend', () => {
    const result = grossUpIneligibleDividends(5000);
    expect(result.grossUpAmount).toBe(750);
    expect(result.taxableAmount).toBe(5750);
  });
});

describe('calculateEligibleDividendCredits', () => {
  it('should return zeros for zero taxable amount', () => {
    const result = calculateEligibleDividendCredits(0, 'AB');
    expect(result.federalDTC).toBe(0);
    expect(result.provincialDTC).toBe(0);
    expect(result.totalDTC).toBe(0);
  });

  it('should calculate correct federal and Alberta DTC for $10,000 eligible dividend', () => {
    // $10,000 actual → $13,800 taxable (grossed up)
    const taxableAmount = 13800;
    const result = calculateEligibleDividendCredits(taxableAmount, 'AB');

    // Federal DTC: 13800 * 0.150198 = 2072.73
    expect(result.federalDTC).toBe(2072.73);

    // Alberta DTC: 13800 * 0.0812 = 1120.56
    expect(result.provincialDTC).toBe(1120.56);

    expect(result.totalDTC).toBe(3193.29);
  });

  it('should calculate correct Ontario DTC for eligible dividends', () => {
    const taxableAmount = 13800; // $10,000 actual
    const result = calculateEligibleDividendCredits(taxableAmount, 'ON');

    // Federal DTC: 13800 * 0.150198 = 2072.73
    expect(result.federalDTC).toBe(2072.73);

    // Ontario DTC: 13800 * 0.10 = 1380.00
    expect(result.provincialDTC).toBe(1380.00);
  });

  it('should calculate correct BC DTC for eligible dividends', () => {
    const taxableAmount = 69000; // $50,000 actual
    const result = calculateEligibleDividendCredits(taxableAmount, 'BC');

    // Federal DTC: 69000 * 0.150198 = 10363.66
    expect(result.federalDTC).toBe(10363.66);

    // BC DTC: 69000 * 0.12 = 8280
    expect(result.provincialDTC).toBe(8280.00);
  });

  it('should calculate correct Quebec DTC for eligible dividends', () => {
    const taxableAmount = 13800;
    const result = calculateEligibleDividendCredits(taxableAmount, 'QC');

    // Quebec DTC: 13800 * 0.117 = 1614.60
    expect(result.provincialDTC).toBe(1614.60);
  });
});

describe('calculateIneligibleDividendCredits', () => {
  it('should calculate correct federal and Ontario DTC for $10,000 ineligible dividend', () => {
    // $10,000 actual → $11,500 taxable
    const taxableAmount = 11500;
    const result = calculateIneligibleDividendCredits(taxableAmount, 'ON');

    // Federal DTC: 11500 * 0.090301 = 1038.46
    expect(result.federalDTC).toBe(1038.46);

    // Ontario DTC: 11500 * 0.029863 = 343.42
    expect(result.provincialDTC).toBe(343.42);
  });

  it('should calculate correct Nova Scotia DTC (post-2025 budget change)', () => {
    const taxableAmount = 11500;
    const result = calculateIneligibleDividendCredits(taxableAmount, 'NS');

    // NS DTC: 11500 * 0.015 = 172.50 (reduced from 2.99%)
    expect(result.provincialDTC).toBe(172.50);
  });

  it('should calculate correct Saskatchewan DTC (cancelled increase)', () => {
    const taxableAmount = 11500;
    const result = calculateIneligibleDividendCredits(taxableAmount, 'SK');

    // SK DTC: 11500 * 0.02519 = 289.69
    expect(result.provincialDTC).toBe(289.69);
  });

  it('should calculate correct Yukon DTC', () => {
    const taxableAmount = 11500;
    const result = calculateIneligibleDividendCredits(taxableAmount, 'YT');

    // YT DTC: 11500 * 0.0067 = 77.05
    expect(result.provincialDTC).toBe(77.05);
  });
});

describe('calculateEligibleDividendMarginalRate', () => {
  it('should calculate marginal rate considering gross-up and DTC', () => {
    // At lowest federal bracket (14%) + Alberta lowest (10%)
    // Federal effective: (0.14 - 0.150198) * 1.38 = negative → clamped at 0 overall
    // Provincial effective: (0.10 - 0.0812) * 1.38 = 0.025944
    // But combined check: (0.14 + 0.10 - 0.150198 - 0.0812) * 1.38
    // = (0.2400 - 0.231398) * 1.38 = 0.008602 * 1.38 = 0.01187
    const rate = calculateEligibleDividendMarginalRate(0.14, 0.10, 'AB');
    // Individual components:
    // Federal: (0.14 - 0.150198) * 1.38 = -0.01028 * 1.38 = -0.01419
    // Provincial: (0.10 - 0.0812) * 1.38 = 0.0188 * 1.38 = 0.02594
    // Total: -0.01419 + 0.02594 = 0.01176 → clamped at max(0, ...)
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThan(0.05); // Should be very low at lowest brackets
  });

  it('should return higher rate at higher brackets', () => {
    // At higher brackets (33% fed + 21% prov)
    const rate = calculateEligibleDividendMarginalRate(0.33, 0.21, 'AB');
    // Federal: (0.33 - 0.150198) * 1.38 = 0.248
    // Provincial: (0.21 - 0.0812) * 1.38 = 0.1777
    // Total ≈ 0.4260
    expect(rate).toBeGreaterThan(0.30);
    expect(rate).toBeLessThan(0.50);
  });
});

describe('calculateIneligibleDividendMarginalRate', () => {
  it('should calculate marginal rate for ineligible dividends', () => {
    // At 14% federal + 10% Alberta provincial
    const rate = calculateIneligibleDividendMarginalRate(0.14, 0.10, 'AB');
    // Federal: (0.14 - 0.090301) * 1.15 = 0.049699 * 1.15 = 0.0572
    // Provincial: (0.10 - 0.0218) * 1.15 = 0.0782 * 1.15 = 0.0899
    // Total ≈ 0.1471
    expect(rate).toBeGreaterThan(0.10);
    expect(rate).toBeLessThan(0.20);
  });

  it('should produce higher rate than eligible dividends at same bracket', () => {
    const eligibleRate = calculateEligibleDividendMarginalRate(0.205, 0.12, 'ON');
    const ineligibleRate = calculateIneligibleDividendMarginalRate(0.205, 0.12, 'ON');

    // Ineligible dividends should generally have a higher effective marginal rate
    // than eligible dividends at the same bracket
    expect(ineligibleRate).toBeGreaterThan(eligibleRate);
  });
});
