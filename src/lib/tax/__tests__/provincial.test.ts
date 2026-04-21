import { describe, it, expect } from 'vitest';
import { calculateProvincialTax, calculateOntarioHealthPremium, calculateOntarioSurtax } from '../provincial';

describe('calculateOntarioHealthPremium', () => {
  it('should return 0 for income <= $20,000', () => {
    expect(calculateOntarioHealthPremium(20000)).toBe(0);
    expect(calculateOntarioHealthPremium(15000)).toBe(0);
  });

  it('should calculate for income $20,001–$25,000', () => {
    // 6% of amount over $20,000, max $300
    expect(calculateOntarioHealthPremium(22000)).toBeCloseTo(120, 2);
    expect(calculateOntarioHealthPremium(25000)).toBeCloseTo(300, 2);
  });

  it('should return $300 for income $25,001–$36,000', () => {
    expect(calculateOntarioHealthPremium(30000)).toBe(300);
    expect(calculateOntarioHealthPremium(36000)).toBe(300);
  });

  it('should calculate for income $36,001–$38,500', () => {
    // $300 + 6% of amount over $36,000, max $450
    expect(calculateOntarioHealthPremium(37000)).toBeCloseTo(360, 2);
  });

  it('should return $450 for income $38,501–$48,000', () => {
    expect(calculateOntarioHealthPremium(45000)).toBe(450);
  });

  it('should return $600 for income $48,601–$72,000', () => {
    expect(calculateOntarioHealthPremium(60000)).toBe(600);
  });

  it('should return $750 for income $72,601–$200,000', () => {
    expect(calculateOntarioHealthPremium(100000)).toBe(750);
    expect(calculateOntarioHealthPremium(200000)).toBe(750);
  });

  it('should return $900 for income over $200,600', () => {
    expect(calculateOntarioHealthPremium(250000)).toBe(900);
  });
});

describe('calculateOntarioSurtax', () => {
  it('should return 0 for basic tax below threshold', () => {
    expect(calculateOntarioSurtax(5000)).toBe(0);
  });

  it('should apply 20% on basic tax over $5,315', () => {
    // Tax of $6,000 → surtax = (6000-5315)*0.20 = 137
    expect(calculateOntarioSurtax(6000)).toBeCloseTo(137, 2);
  });

  it('should apply both 20% and 36% for high basic tax', () => {
    // Tax of $10,000
    // 20% on (10000-5315) = 937
    // 36% on (10000-6802) = 1151.28
    // Total: 2088.28
    expect(calculateOntarioSurtax(10000)).toBeCloseTo(2088.28, 2);
  });
});

describe('calculateProvincialTax', () => {
  it('should return 0 for 0 income', () => {
    const result = calculateProvincialTax(0, 'AB', 2026);
    expect(result.tax).toBe(0);
  });

  it('should calculate Alberta tax for $40,000', () => {
    // All in first bracket: 40000 * 0.08 = 3200
    // BPA credit: 22769 * 0.08 = 1821.52
    // Net: 3200 - 1821.52 = 1378.48
    const result = calculateProvincialTax(40000, 'AB', 2026);
    expect(result.tax).toBeCloseTo(1378.48, 0);
  });

  it('should calculate Ontario tax for $60,000', () => {
    const result = calculateProvincialTax(60000, 'ON', 2026);
    // First bracket: 52886 * 0.0505 = 2670.74
    // Second bracket: (60000-52886) * 0.0915 = 7114 * 0.0915 = 650.93
    // Gross: 3321.67
    // BPA credit: 11865 * 0.0505 = 599.18
    // Net: ~2722.49
    expect(result.tax).toBeCloseTo(2722.49, 0);
  });

  it('should include Ontario Health Premium for $60,000 income', () => {
    const result = calculateProvincialTax(60000, 'ON', 2026);
    expect(result.ontarioHealthPremium).toBe(600);
  });

  it('should calculate Quebec tax', () => {
    const result = calculateProvincialTax(100000, 'QC', 2026);
    // First bracket: 53255 * 0.14 = 7455.70
    // Second bracket: (100000-53255) * 0.19 = 46745 * 0.19 = 8881.55
    // Gross: 16337.25
    // BPA credit: 18571 * 0.14 = 2599.94
    // Net: 13737.31
    expect(result.tax).toBeCloseTo(13737.31, 0);
  });

  it('should calculate BC tax with 7 brackets', () => {
    const result = calculateProvincialTax(80000, 'BC', 2026);
    // First bracket: 47937 * 0.0506 = 2425.61
    // Second bracket: (80000-47937) * 0.077 = 32063 * 0.077 = 2468.85
    // Gross: 4894.46
    // BPA credit: 12580 * 0.0506 = 636.55
    // Net: ~4257.91
    expect(result.tax).toBeCloseTo(4257.91, 0);
  });
});
