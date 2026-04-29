/**
 * Capital gains inclusion for Canadian tax purposes.
 *
 * The capital gains inclusion rate is 50% — only half of the actual capital gain
 * is included in taxable income. The proposal to increase to 66.67% was cancelled.
 */

export const CAPITAL_GAINS_INCLUSION_RATE = 0.50;

export interface CapitalGainsResult {
  actualAmount: number;
  taxableAmount: number;
  inclusionRate: number;
}

/**
 * Calculate the taxable portion of capital gains.
 *
 * @param actualCapitalGain The total capital gain realized (what the user enters)
 * @returns The taxable capital gain (50% of actual)
 */
export function calculateTaxableCapitalGains(actualCapitalGain: number): CapitalGainsResult {
  if (actualCapitalGain <= 0) {
    return { actualAmount: 0, taxableAmount: 0, inclusionRate: CAPITAL_GAINS_INCLUSION_RATE };
  }

  const taxableAmount = Math.round(actualCapitalGain * CAPITAL_GAINS_INCLUSION_RATE * 100) / 100;

  return {
    actualAmount: actualCapitalGain,
    taxableAmount,
    inclusionRate: CAPITAL_GAINS_INCLUSION_RATE,
  };
}

/**
 * Calculate the effective marginal rate on capital gains.
 * Since only 50% of the capital gain is included in taxable income,
 * the effective marginal rate is half the ordinary marginal rate.
 *
 * @param ordinaryMarginalRate The combined federal + provincial marginal rate on ordinary income
 */
export function calculateCapitalGainsMarginalRate(ordinaryMarginalRate: number): number {
  return Math.round(ordinaryMarginalRate * CAPITAL_GAINS_INCLUSION_RATE * 10000) / 10000;
}
