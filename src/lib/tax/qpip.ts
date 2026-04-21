import type { Province } from './types';
import { QPIP_2026 } from './brackets/federal-2026';

function getQPIPData(taxYear: number) {
  if (taxYear === 2026) return QPIP_2026;
  // TODO: Add 2025 data
  return QPIP_2026;
}

/**
 * Calculate QPIP (Quebec Parental Insurance Plan) employee premium.
 * Only applies to Quebec residents.
 */
export function calculateQPIP(
  grossAnnual: number,
  taxYear: number,
  province: Province
): number {
  if (province !== 'QC') return 0;

  const data = getQPIPData(taxYear);

  const insurableEarnings = Math.min(grossAnnual, data.maxInsurableEarnings);
  if (insurableEarnings <= 0) return 0;

  const premium = insurableEarnings * data.rate;
  return Math.round(Math.min(premium, data.maxPremium) * 100) / 100;
}
