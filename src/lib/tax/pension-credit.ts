import type { Province } from './types';
import { PROVINCIAL_TAX_DATA_2026 } from './brackets/provincial-2026';
import { FEDERAL_BRACKETS_2026 } from './brackets/federal-2026';

/**
 * Provincial pension income eligible amounts for 2026.
 * Most provinces use $1,000 or $2,000. Ontario indexes its own amount.
 * Quebec uses a separate retirement income credit system (handled specially).
 */
const PROVINCIAL_PENSION_MAX: Record<Province, number> = {
  AB: 1000,
  BC: 1000,
  MB: 1000,
  NB: 1000,
  NL: 1000,
  NS: 2000,
  NT: 2000,
  NU: 2000,
  ON: 1796,
  PE: 1000,
  QC: 0,    // Quebec uses retirement income credit, not pension income credit
  SK: 1000,
  YT: 2000,
};

/**
 * Quebec retirement income credit parameters for 2026.
 * Quebec calculates this on Schedule B as a non-refundable credit.
 * For simplicity, we implement it as a deduction from QC taxable income
 * (up to $2,000), which approximates the credit's effect.
 */
const QUEBEC_RETIREMENT_INCOME_MAX = 2000;

export interface PensionCreditResult {
  /** Lesser of pension income or eligible maximum ($2,000 federal) */
  eligibleAmount: number;
  /** eligibleAmount × federal lowest rate (14% for 2026) */
  federalCredit: number;
  /** eligibleAmount × provincial lowest rate (0 for QC) */
  provincialCredit: number;
  /** Quebec retirement income deduction (QC only, deducted from taxable income) */
  quebecDeduction: number;
}

/**
 * Calculate the pension income tax credit (CRA Line 31400).
 *
 * A non-refundable credit on up to the eligible amount of pension income.
 * Federal: up to $2,000 × 14% = max $280.
 * Provincial: varies by province ($1,000–$2,000) × provincial lowest rate.
 * Quebec: retirement income deduction of up to $2,000 from taxable income.
 */
export function calculatePensionIncomeCredit(
  pensionIncome: number,
  province: Province,
): PensionCreditResult {
  if (pensionIncome <= 0) {
    return { eligibleAmount: 0, federalCredit: 0, provincialCredit: 0, quebecDeduction: 0 };
  }

  const federalLowestRate = FEDERAL_BRACKETS_2026.brackets[0].rate;
  const provincialLowestRate = PROVINCIAL_TAX_DATA_2026[province].brackets[0].rate;

  // Federal credit: up to $2,000
  const federalEligible = Math.min(pensionIncome, 2000);
  const federalCredit = round2(federalEligible * federalLowestRate);

  // Provincial credit (non-Quebec)
  const provincialMax = PROVINCIAL_PENSION_MAX[province];
  const provincialEligible = Math.min(pensionIncome, provincialMax);
  const provincialCredit = province === 'QC'
    ? 0
    : round2(provincialEligible * provincialLowestRate);

  // Quebec retirement income deduction
  const quebecDeduction = province === 'QC'
    ? Math.min(pensionIncome, QUEBEC_RETIREMENT_INCOME_MAX)
    : 0;

  return {
    eligibleAmount: federalEligible,
    federalCredit,
    provincialCredit,
    quebecDeduction,
  };
}

/**
 * Get the provincial pension income eligible maximum for a given province.
 */
export function getProvincialPensionMax(province: Province): number {
  return PROVINCIAL_PENSION_MAX[province];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
