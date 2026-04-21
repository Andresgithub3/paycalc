import type { Province } from './types';
import { EI_2026, EI_QUEBEC_2026 } from './brackets/federal-2026';

function getEIData(taxYear: number, isQuebec: boolean) {
  if (taxYear === 2026) return isQuebec ? EI_QUEBEC_2026 : EI_2026;
  // TODO: Add 2025 data
  return isQuebec ? EI_QUEBEC_2026 : EI_2026;
}

/**
 * Calculate EI (Employment Insurance) employee premium.
 * Quebec residents pay a reduced EI rate because QPIP covers parental benefits.
 */
export function calculateEI(
  grossAnnual: number,
  taxYear: number,
  province: Province
): number {
  const isQuebec = province === 'QC';
  const data = getEIData(taxYear, isQuebec);

  const insurableEarnings = Math.min(grossAnnual, data.maxInsurableEarnings);
  if (insurableEarnings <= 0) return 0;

  const premium = insurableEarnings * data.rate;
  return Math.round(Math.min(premium, data.maxPremium) * 100) / 100;
}
