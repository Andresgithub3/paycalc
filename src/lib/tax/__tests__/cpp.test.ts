import { describe, it, expect } from 'vitest';
import { calculateCPP, calculateCPP2 } from '../cpp';

describe('calculateCPP', () => {
  it('should return 0 for income below basic exemption', () => {
    const result = calculateCPP(3500, 2026, 'AB');
    expect(result).toBe(0);
  });

  it('should return 0 for 0 income', () => {
    const result = calculateCPP(0, 2026, 'AB');
    expect(result).toBe(0);
  });

  it('should calculate correctly for income below YMPE', () => {
    // $40,000 income
    // Pensionable earnings: 40000 - 3500 = 36500
    // Contribution: 36500 * 0.0595 = 2171.75
    const result = calculateCPP(40000, 2026, 'AB');
    expect(result).toBeCloseTo(2171.75, 2);
  });

  it('should cap at maximum contribution for income above YMPE', () => {
    // $100,000 income → capped at YMPE of $74,600
    // Pensionable: 74600 - 3500 = 71100
    // Contribution: 71100 * 0.0595 = 4230.45 (max)
    const result = calculateCPP(100000, 2026, 'AB');
    expect(result).toBe(4230.45);
  });

  it('should cap at maximum for very high income', () => {
    const result = calculateCPP(500000, 2026, 'ON');
    expect(result).toBe(4230.45);
  });
});

describe('calculateCPP2', () => {
  it('should return 0 for income at or below YMPE', () => {
    const result = calculateCPP2(74600, 2026);
    expect(result).toBe(0);
  });

  it('should return 0 for income below YMPE', () => {
    const result = calculateCPP2(50000, 2026);
    expect(result).toBe(0);
  });

  it('should calculate for income between YMPE and YAMPE', () => {
    // $80,000 income
    // CPP2 earnings: 80000 - 74600 = 5400
    // Contribution: 5400 * 0.04 = 216
    const result = calculateCPP2(80000, 2026);
    expect(result).toBe(216);
  });

  it('should cap at maximum for income above YAMPE', () => {
    // $100,000 income → capped at YAMPE of $85,000
    // CPP2 earnings: 85000 - 74600 = 10400
    // Contribution: 10400 * 0.04 = 416 (max)
    const result = calculateCPP2(100000, 2026);
    expect(result).toBe(416);
  });

  it('should cap at maximum for very high income', () => {
    const result = calculateCPP2(500000, 2026);
    expect(result).toBe(416);
  });
});
