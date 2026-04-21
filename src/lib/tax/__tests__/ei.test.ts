import { describe, it, expect } from 'vitest';
import { calculateEI } from '../ei';

describe('calculateEI', () => {
  it('should return 0 for 0 income', () => {
    const result = calculateEI(0, 2026, 'AB');
    expect(result).toBe(0);
  });

  it('should calculate correctly for income below max insurable earnings', () => {
    // $50,000 income
    // Premium: 50000 * 0.0163 = 815
    const result = calculateEI(50000, 2026, 'AB');
    expect(result).toBeCloseTo(815, 2);
  });

  it('should cap at maximum premium for high income', () => {
    // $100,000 income → capped at max insurable earnings of $68,900
    // Premium: 68900 * 0.0163 = 1123.07 (max)
    const result = calculateEI(100000, 2026, 'AB');
    expect(result).toBe(1123.07);
  });

  it('should use reduced Quebec rate', () => {
    // $50,000 income in Quebec
    // Premium: 50000 * 0.01295 = 647.5
    const result = calculateEI(50000, 2026, 'QC');
    expect(result).toBeCloseTo(647.5, 2);
  });

  it('should cap at Quebec maximum for high income', () => {
    const result = calculateEI(100000, 2026, 'QC');
    // 68900 * 0.01295 = 892.255, rounds to 892.26
    expect(result).toBeCloseTo(892.26, 2);
  });
});
