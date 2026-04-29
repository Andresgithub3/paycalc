import { describe, it, expect } from 'vitest';
import {
  calculateTaxableCapitalGains,
  calculateCapitalGainsMarginalRate,
  CAPITAL_GAINS_INCLUSION_RATE,
} from '../capital-gains';

describe('CAPITAL_GAINS_INCLUSION_RATE', () => {
  it('should be 50%', () => {
    expect(CAPITAL_GAINS_INCLUSION_RATE).toBe(0.50);
  });
});

describe('calculateTaxableCapitalGains', () => {
  it('should return zeros for zero input', () => {
    const result = calculateTaxableCapitalGains(0);
    expect(result.actualAmount).toBe(0);
    expect(result.taxableAmount).toBe(0);
    expect(result.inclusionRate).toBe(0.50);
  });

  it('should return zeros for negative input', () => {
    const result = calculateTaxableCapitalGains(-5000);
    expect(result.actualAmount).toBe(0);
    expect(result.taxableAmount).toBe(0);
  });

  it('should include only 50% of $100,000 capital gain', () => {
    const result = calculateTaxableCapitalGains(100000);
    expect(result.actualAmount).toBe(100000);
    expect(result.taxableAmount).toBe(50000);
    expect(result.inclusionRate).toBe(0.50);
  });

  it('should include only 50% of $20,000 capital gain', () => {
    const result = calculateTaxableCapitalGains(20000);
    expect(result.taxableAmount).toBe(10000);
  });

  it('should handle odd amounts correctly', () => {
    const result = calculateTaxableCapitalGains(33333);
    expect(result.taxableAmount).toBe(16666.50);
  });

  it('should handle fractional amounts', () => {
    const result = calculateTaxableCapitalGains(1234.57);
    expect(result.taxableAmount).toBe(617.29); // 1234.57 * 0.50 = 617.285 → 617.29
  });

  it('should handle $1 capital gain', () => {
    const result = calculateTaxableCapitalGains(1);
    expect(result.taxableAmount).toBe(0.50);
  });
});

describe('calculateCapitalGainsMarginalRate', () => {
  it('should return half the ordinary marginal rate', () => {
    expect(calculateCapitalGainsMarginalRate(0.30)).toBe(0.15);
    expect(calculateCapitalGainsMarginalRate(0.40)).toBe(0.20);
    expect(calculateCapitalGainsMarginalRate(0.50)).toBe(0.25);
  });

  it('should return 0 for 0% marginal rate', () => {
    expect(calculateCapitalGainsMarginalRate(0)).toBe(0);
  });

  it('should handle the highest combined marginal rate', () => {
    // ~53.53% in Nova Scotia at highest bracket
    const result = calculateCapitalGainsMarginalRate(0.5353);
    expect(result).toBeCloseTo(0.2677, 4);
  });
});
