import type { Province } from './types';
import { FEDERAL_AGE_AMOUNT_2026, PROVINCIAL_AGE_AMOUNTS_2026 } from './age-amount-data';
import { FEDERAL_BRACKETS_2026 } from './brackets/federal-2026';
import { PROVINCIAL_TAX_DATA_2026 } from './brackets/provincial-2026';

export interface AgeAmountResult {
  isEligible: boolean;
  /** Federal age amount before clawback */
  federalFullAmount: number;
  /** Federal amount clawed back */
  federalClawback: number;
  /** Federal age amount after clawback */
  federalClaimable: number;
  /** Federal non-refundable credit (claimable × lowest federal rate) */
  federalCredit: number;
  /** Provincial age amount before clawback */
  provincialFullAmount: number;
  /** Provincial amount clawed back */
  provincialClawback: number;
  /** Provincial age amount after clawback */
  provincialClaimable: number;
  /** Provincial non-refundable credit (claimable × lowest provincial rate) */
  provincialCredit: number;
}

/**
 * Calculate the Age Amount Tax Credit (CRA Line 30100).
 *
 * Available to individuals aged 65+ at December 31 of the tax year.
 * The credit is based on a maximum "age amount" that is reduced (clawed back)
 * as net income exceeds a threshold.
 *
 * Federal: $9,208 max, reduced by 15% of income over $46,432.
 * Provincial: varies by province (see age-amount-data.ts).
 * Quebec: 18.75% clawback rate; all others use 15%.
 *
 * @param isAge65Plus Whether the individual is 65+ at Dec 31
 * @param netIncome Total net income (used for clawback calculation)
 * @param province Province of residence
 */
export function calculateAgeAmount(
  isAge65Plus: boolean,
  netIncome: number,
  province: Province,
): AgeAmountResult {
  const zero: AgeAmountResult = {
    isEligible: false,
    federalFullAmount: 0, federalClawback: 0, federalClaimable: 0, federalCredit: 0,
    provincialFullAmount: 0, provincialClawback: 0, provincialClaimable: 0, provincialCredit: 0,
  };

  if (!isAge65Plus) return zero;

  const fedData = FEDERAL_AGE_AMOUNT_2026;
  const provData = PROVINCIAL_AGE_AMOUNTS_2026[province];
  const federalLowestRate = FEDERAL_BRACKETS_2026.brackets[0].rate;
  const provincialLowestRate = PROVINCIAL_TAX_DATA_2026[province].brackets[0].rate;

  // Federal age amount
  const fedClawback = round2(
    Math.max(0, (netIncome - fedData.clawbackThreshold) * fedData.clawbackRate)
  );
  const fedClaimable = round2(Math.max(0, fedData.maxAmount - fedClawback));
  const fedCredit = round2(fedClaimable * federalLowestRate);

  // Provincial age amount
  const provClawback = round2(
    Math.max(0, (netIncome - provData.clawbackThreshold) * provData.clawbackRate)
  );
  const provClaimable = round2(Math.max(0, provData.maxAmount - provClawback));
  const provCredit = round2(provClaimable * provincialLowestRate);

  return {
    isEligible: true,
    federalFullAmount: fedData.maxAmount,
    federalClawback: fedClawback,
    federalClaimable: fedClaimable,
    federalCredit: fedCredit,
    provincialFullAmount: provData.maxAmount,
    provincialClawback: provClawback,
    provincialClaimable: provClaimable,
    provincialCredit: provCredit,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
