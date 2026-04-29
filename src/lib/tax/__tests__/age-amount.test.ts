import { describe, it, expect } from 'vitest';
import { calculateAgeAmount } from '../age-amount';

describe('calculateAgeAmount', () => {
  // Federal: max $9,208, threshold $46,432, clawback 15%, lowest rate 14%

  it('returns zero for non-65+ individuals', () => {
    const result = calculateAgeAmount(false, 30000, 'ON');
    expect(result.isEligible).toBe(false);
    expect(result.federalCredit).toBe(0);
    expect(result.provincialCredit).toBe(0);
  });

  it('gives full federal credit when income is below threshold', () => {
    // Income $30,000 < threshold $46,432 → no clawback
    // Federal credit = $9,208 × 0.14 = $1,289.12
    const result = calculateAgeAmount(true, 30000, 'AB');
    expect(result.isEligible).toBe(true);
    expect(result.federalFullAmount).toBe(9208);
    expect(result.federalClawback).toBe(0);
    expect(result.federalClaimable).toBe(9208);
    expect(result.federalCredit).toBe(1289.12);
  });

  it('gives full provincial credit for Alberta when income below threshold', () => {
    // AB: max $6,345, threshold $47,234, rate 0.08
    // Income $30,000 < $47,234 → no clawback
    // Provincial credit = $6,345 × 0.08 = $507.60
    const result = calculateAgeAmount(true, 30000, 'AB');
    expect(result.provincialFullAmount).toBe(6345);
    expect(result.provincialClawback).toBe(0);
    expect(result.provincialClaimable).toBe(6345);
    expect(result.provincialCredit).toBe(507.60);
  });

  it('calculates partial clawback at $55,000 income', () => {
    // Federal: excess = $55,000 - $46,432 = $8,568
    // Clawback = $8,568 × 0.15 = $1,285.20
    // Claimable = $9,208 - $1,285.20 = $7,922.80
    // Credit = $7,922.80 × 0.14 = $1,109.19
    const result = calculateAgeAmount(true, 55000, 'AB');
    expect(result.federalClawback).toBe(1285.20);
    expect(result.federalClaimable).toBe(7922.80);
    expect(result.federalCredit).toBeCloseTo(1109.19, 1);
  });

  it('fully claws back federal age amount at high income', () => {
    // Full clawback at: $46,432 + ($9,208 / 0.15) = $46,432 + $61,386.67 = $107,818.67
    // At $110,000 income → federal age amount = $0
    const result = calculateAgeAmount(true, 110000, 'AB');
    expect(result.federalClaimable).toBe(0);
    expect(result.federalCredit).toBe(0);
  });

  it('returns zero clawback when income is exactly at threshold', () => {
    // Income = $46,432 = threshold → excess = 0 → no clawback
    const result = calculateAgeAmount(true, 46432, 'ON');
    expect(result.federalClawback).toBe(0);
    expect(result.federalClaimable).toBe(9208);
  });

  it('calculates Ontario provincial age amount correctly', () => {
    // ON: max $6,342, threshold $47,210, clawback 15%, rate 0.0505
    // Income $50,000: excess = $50,000 - $47,210 = $2,790
    // Clawback = $2,790 × 0.15 = $418.50
    // Claimable = $6,342 - $418.50 = $5,923.50
    // Credit = $5,923.50 × 0.0505 = $299.14
    const result = calculateAgeAmount(true, 50000, 'ON');
    expect(result.provincialClawback).toBe(418.50);
    expect(result.provincialClaimable).toBe(5923.50);
    expect(result.provincialCredit).toBeCloseTo(299.14, 1);
  });

  it('calculates Quebec age amount with 18.75% clawback', () => {
    // QC: max $3,986, threshold $42,955, clawback 18.75%, rate 0.14
    // Income $50,000: excess = $50,000 - $42,955 = $7,045
    // Clawback = $7,045 × 0.1875 = $1,320.94
    // Claimable = $3,986 - $1,320.94 = $2,665.06
    // Credit = $2,665.06 × 0.14 = $373.11
    const result = calculateAgeAmount(true, 50000, 'QC');
    expect(result.provincialClawback).toBeCloseTo(1320.94, 1);
    expect(result.provincialClaimable).toBeCloseTo(2665.06, 1);
    expect(result.provincialCredit).toBeCloseTo(373.11, 0);
  });

  it('fully claws back Quebec age amount at high income', () => {
    // QC: full clawback at $42,955 + ($3,986 / 0.1875) = $42,955 + $21,253.33 = $64,208.33
    // At $70,000 → fully clawed back
    const result = calculateAgeAmount(true, 70000, 'QC');
    expect(result.provincialClaimable).toBe(0);
    expect(result.provincialCredit).toBe(0);
  });

  it('gives full credit for zero income', () => {
    const result = calculateAgeAmount(true, 0, 'AB');
    expect(result.federalClaimable).toBe(9208);
    expect(result.federalCredit).toBe(1289.12);
    expect(result.provincialClaimable).toBe(6345);
  });

  it('gives full credit for Manitoba with low income', () => {
    // MB: max $3,728, threshold $27,749, rate 0.108
    // Income $20,000 → below threshold
    // Credit = $3,728 × 0.108 = $402.62
    const result = calculateAgeAmount(true, 20000, 'MB');
    expect(result.provincialClaimable).toBe(3728);
    expect(result.provincialCredit).toBeCloseTo(402.62, 1);
  });

  it('handles territories that mirror federal amounts (NT)', () => {
    // NT: max $9,208 (same as federal), threshold $46,432, rate 0.059
    const result = calculateAgeAmount(true, 30000, 'NT');
    expect(result.provincialFullAmount).toBe(9208);
    expect(result.provincialCredit).toBeCloseTo(543.27, 1);
  });

  it('handles Nunavut with low 4% rate', () => {
    // NU: max $9,208, threshold $46,432, rate 0.04
    // Full credit = $9,208 × 0.04 = $368.32
    const result = calculateAgeAmount(true, 30000, 'NU');
    expect(result.provincialCredit).toBe(368.32);
  });

  it('claws back PEI age amount starting at $36,600 threshold', () => {
    // PE: max $6,510, threshold $36,600, rate 0.095 (actually 0.095 is the lowest bracket)
    // Wait — PE lowest bracket is 0.095. Let me check...
    // PE brackets: { from: 0, to: 33328, rate: 0.095 }
    // Income $40,000: excess = $40,000 - $36,600 = $3,400
    // Clawback = $3,400 × 0.15 = $510
    // Claimable = $6,510 - $510 = $6,000
    // Credit = $6,000 × 0.095 = $570
    const result = calculateAgeAmount(true, 40000, 'PE');
    expect(result.provincialClawback).toBe(510);
    expect(result.provincialClaimable).toBe(6000);
    expect(result.provincialCredit).toBe(570);
  });

  it('handles Nova Scotia with low threshold', () => {
    // NS: max $5,826, threshold $30,828, rate 0.0879
    // Income $35,000: excess = $35,000 - $30,828 = $4,172
    // Clawback = $4,172 × 0.15 = $625.80
    // Claimable = $5,826 - $625.80 = $5,200.20
    // Credit = $5,200.20 × 0.0879 = $457.10
    const result = calculateAgeAmount(true, 35000, 'NS');
    expect(result.provincialClawback).toBe(625.80);
    expect(result.provincialClaimable).toBe(5200.20);
    expect(result.provincialCredit).toBeCloseTo(457.10, 0);
  });
});
