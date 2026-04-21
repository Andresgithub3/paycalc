import type { Province } from './types';
import { CPP_2026, CPP2_2026 } from './brackets/federal-2026';

function getCPPData(taxYear: number) {
  if (taxYear === 2026) return { cpp: CPP_2026, cpp2: CPP2_2026 };
  // TODO: Add 2025 data
  return { cpp: CPP_2026, cpp2: CPP2_2026 };
}

/**
 * Calculate CPP (Canada Pension Plan) employee contribution.
 * Quebec uses QPP at the same rate structure for federal payroll deduction purposes.
 * Note: QPP rate is slightly different but we use the same rate as specified in the spec.
 */
export function calculateCPP(
  grossAnnual: number,
  taxYear: number,
  _province: Province
): number {
  const { cpp } = getCPPData(taxYear);

  // CPP applies on pensionable earnings between basic exemption and YMPE
  const pensionableEarnings = Math.min(grossAnnual, cpp.ympe) - cpp.basicExemption;
  if (pensionableEarnings <= 0) return 0;

  const contribution = pensionableEarnings * cpp.rate;
  return Math.round(Math.min(contribution, cpp.maxContribution) * 100) / 100;
}

/**
 * Calculate CPP2 (enhanced CPP) employee contribution.
 * Applies on earnings between YMPE ($74,600) and YAMPE ($85,000).
 */
export function calculateCPP2(
  grossAnnual: number,
  taxYear: number
): number {
  const { cpp, cpp2 } = getCPPData(taxYear);

  // CPP2 applies on earnings between YMPE and YAMPE
  if (grossAnnual <= cpp.ympe) return 0;

  const cpp2Earnings = Math.min(grossAnnual, cpp2.yampe) - cpp.ympe;
  if (cpp2Earnings <= 0) return 0;

  const contribution = cpp2Earnings * cpp2.rate;
  return Math.round(Math.min(contribution, cpp2.maxContribution) * 100) / 100;
}
