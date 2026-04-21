import type { Province, CorporateTaxResult } from './types';
import { CORPORATE_TAX_2026 } from './brackets/federal-2026';

function getCorporateData(taxYear: number) {
  if (taxYear === 2026) return CORPORATE_TAX_2026;
  return CORPORATE_TAX_2026;
}

/**
 * Calculate corporate tax for a CCPC (small business deduction eligible).
 * Assumes all income is under the $500K small business limit.
 */
export function calculateCorporateTax(
  businessIncome: number,
  province: Province,
  taxYear: number
): CorporateTaxResult {
  if (businessIncome <= 0) {
    return { federalTax: 0, provincialTax: 0, totalTax: 0, afterTaxIncome: 0, effectiveRate: 0 };
  }

  const data = getCorporateData(taxYear);
  const taxableIncome = Math.min(businessIncome, data.smallBusinessLimit);

  const federalTax = Math.round(taxableIncome * data.federalSmallBusinessRate * 100) / 100;
  const provincialTax = Math.round(taxableIncome * data.provincialRates[province] * 100) / 100;
  const totalTax = Math.round((federalTax + provincialTax) * 100) / 100;
  const afterTaxIncome = Math.round((businessIncome - totalTax) * 100) / 100;
  const effectiveRate = businessIncome > 0
    ? Math.round((totalTax / businessIncome) * 10000) / 100
    : 0;

  return { federalTax, provincialTax, totalTax, afterTaxIncome, effectiveRate };
}
