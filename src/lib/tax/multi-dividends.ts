import type { Province } from './types';
import {
  ELIGIBLE_DIVIDEND_GROSS_UP_RATE,
  INELIGIBLE_DIVIDEND_GROSS_UP_RATE,
  FEDERAL_ELIGIBLE_DTC_RATE,
  FEDERAL_INELIGIBLE_DTC_RATE,
} from './dividend-credits/federal';
import {
  PROVINCIAL_ELIGIBLE_DTC_RATES,
  PROVINCIAL_INELIGIBLE_DTC_RATES,
} from './dividend-credits/provincial';

export interface DividendGrossUpResult {
  actualAmount: number;
  grossUpAmount: number;
  taxableAmount: number;
}

export interface DividendCreditsResult {
  federalDTC: number;
  provincialDTC: number;
  totalDTC: number;
}

/**
 * Gross up eligible dividends.
 * Eligible dividends (from public Canadian corporations) use a 38% gross-up.
 */
export function grossUpEligibleDividends(actualAmount: number): DividendGrossUpResult {
  if (actualAmount <= 0) {
    return { actualAmount: 0, grossUpAmount: 0, taxableAmount: 0 };
  }

  const grossUpAmount = round2(actualAmount * ELIGIBLE_DIVIDEND_GROSS_UP_RATE);
  const taxableAmount = round2(actualAmount + grossUpAmount);

  return { actualAmount, grossUpAmount, taxableAmount };
}

/**
 * Gross up ineligible (non-eligible) dividends.
 * Ineligible dividends (from CCPCs) use a 15% gross-up.
 */
export function grossUpIneligibleDividends(actualAmount: number): DividendGrossUpResult {
  if (actualAmount <= 0) {
    return { actualAmount: 0, grossUpAmount: 0, taxableAmount: 0 };
  }

  const grossUpAmount = round2(actualAmount * INELIGIBLE_DIVIDEND_GROSS_UP_RATE);
  const taxableAmount = round2(actualAmount + grossUpAmount);

  return { actualAmount, grossUpAmount, taxableAmount };
}

/**
 * Calculate federal and provincial dividend tax credits for eligible dividends.
 * Credits are based on the TAXABLE (grossed-up) dividend amount.
 */
export function calculateEligibleDividendCredits(
  taxableAmount: number,
  province: Province
): DividendCreditsResult {
  if (taxableAmount <= 0) {
    return { federalDTC: 0, provincialDTC: 0, totalDTC: 0 };
  }

  const federalDTC = round2(taxableAmount * FEDERAL_ELIGIBLE_DTC_RATE);
  const provincialDTC = round2(taxableAmount * PROVINCIAL_ELIGIBLE_DTC_RATES[province]);

  return {
    federalDTC,
    provincialDTC,
    totalDTC: round2(federalDTC + provincialDTC),
  };
}

/**
 * Calculate federal and provincial dividend tax credits for ineligible dividends.
 * Credits are based on the TAXABLE (grossed-up) dividend amount.
 */
export function calculateIneligibleDividendCredits(
  taxableAmount: number,
  province: Province
): DividendCreditsResult {
  if (taxableAmount <= 0) {
    return { federalDTC: 0, provincialDTC: 0, totalDTC: 0 };
  }

  const federalDTC = round2(taxableAmount * FEDERAL_INELIGIBLE_DTC_RATE);
  const provincialDTC = round2(taxableAmount * PROVINCIAL_INELIGIBLE_DTC_RATES[province]);

  return {
    federalDTC,
    provincialDTC,
    totalDTC: round2(federalDTC + provincialDTC),
  };
}

/**
 * Calculate the effective marginal rate on eligible dividends.
 * This accounts for the gross-up and dividend tax credit.
 *
 * Formula: marginalRate * (1 + grossUpRate) - federalDTCRate - provincialDTCRate
 * Where marginalRate is the combined federal + provincial marginal rate at the
 * taxpayer's current bracket.
 */
export function calculateEligibleDividendMarginalRate(
  federalMarginalRate: number,
  provincialMarginalRate: number,
  province: Province
): number {
  const grossUpFactor = 1 + ELIGIBLE_DIVIDEND_GROSS_UP_RATE;
  const federalDTCRate = FEDERAL_ELIGIBLE_DTC_RATE;
  const provincialDTCRate = PROVINCIAL_ELIGIBLE_DTC_RATES[province];

  // The marginal tax on $1 of eligible dividend:
  // Federal portion: fedMarginalRate * 1.38 - federalDTCRate * 1.38
  // Provincial portion: provMarginalRate * 1.38 - provincialDTCRate * 1.38
  // Simplified: (fedMarginal + provMarginal - fedDTC - provDTC) * grossUpFactor
  // But DTC rates are already expressed as % of grossed-up amount, so:
  // Federal tax on $1 dividend = fedMarginalRate * 1.38 - federalDTCRate * 1.38
  // = (fedMarginalRate - federalDTCRate) * 1.38
  const effectiveFederal = (federalMarginalRate - federalDTCRate) * grossUpFactor;
  const effectiveProvincial = (provincialMarginalRate - provincialDTCRate) * grossUpFactor;

  return Math.max(0, round4(effectiveFederal + effectiveProvincial));
}

/**
 * Calculate the effective marginal rate on ineligible dividends.
 */
export function calculateIneligibleDividendMarginalRate(
  federalMarginalRate: number,
  provincialMarginalRate: number,
  province: Province
): number {
  const grossUpFactor = 1 + INELIGIBLE_DIVIDEND_GROSS_UP_RATE;
  const federalDTCRate = FEDERAL_INELIGIBLE_DTC_RATE;
  const provincialDTCRate = PROVINCIAL_INELIGIBLE_DTC_RATES[province];

  const effectiveFederal = (federalMarginalRate - federalDTCRate) * grossUpFactor;
  const effectiveProvincial = (provincialMarginalRate - provincialDTCRate) * grossUpFactor;

  return Math.max(0, round4(effectiveFederal + effectiveProvincial));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
