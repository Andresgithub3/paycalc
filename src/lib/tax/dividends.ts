import type { Province, DividendTaxResult } from './types';
import { DIVIDEND_TAX_2026 } from './brackets/federal-2026';
import { calculateProgressiveTax, calculateFederalBPA } from './federal';
import { FEDERAL_BRACKETS_2026 } from './brackets/federal-2026';
import { PROVINCIAL_TAX_DATA_2026 } from './brackets/provincial-2026';

function getDividendData(taxYear: number) {
  if (taxYear === 2026) return DIVIDEND_TAX_2026;
  return DIVIDEND_TAX_2026;
}

/**
 * Calculate personal tax on non-eligible dividends from a CCPC.
 * Non-eligible dividends use a 15% gross-up and corresponding DTC rates.
 */
export function calculateDividendTax(
  actualDividend: number,
  province: Province,
  taxYear: number
): DividendTaxResult {
  if (actualDividend <= 0) {
    return {
      actualDividend: 0, taxableDividend: 0, grossUpAmount: 0,
      federalTaxBeforeCredits: 0, federalDTC: 0,
      provincialTaxBeforeCredits: 0, provincialDTC: 0,
      totalTax: 0, netDividend: 0, effectiveRate: 0,
    };
  }

  const data = getDividendData(taxYear);

  // Gross-up: actual dividend * (1 + grossUpRate)
  const grossUpAmount = Math.round(actualDividend * data.grossUpRate * 100) / 100;
  const taxableDividend = Math.round((actualDividend + grossUpAmount) * 100) / 100;

  // Federal tax on the grossed-up amount
  const isQuebec = province === 'QC';
  const federalData = FEDERAL_BRACKETS_2026;
  const { total: grossFederalTax } = calculateProgressiveTax(taxableDividend, federalData.brackets);
  const bpa = calculateFederalBPA(taxableDividend, taxYear);
  const lowestRate = federalData.brackets[0].rate;
  const bpaCredit = bpa * lowestRate;
  const ceaCredit = 0; // No CEA for dividend income (employment credit only)
  let federalTaxBeforeCredits = Math.max(0, grossFederalTax - bpaCredit - ceaCredit);
  if (isQuebec) {
    federalTaxBeforeCredits = federalTaxBeforeCredits * (1 - 0.165);
  }
  federalTaxBeforeCredits = Math.round(federalTaxBeforeCredits * 100) / 100;

  // Federal DTC
  const federalDTC = Math.round(taxableDividend * data.federalDTC * 100) / 100;

  // Provincial tax on the grossed-up amount
  const provData = PROVINCIAL_TAX_DATA_2026[province];
  const { total: grossProvTax } = calculateProgressiveTax(taxableDividend, provData.brackets);
  const provBpaCredit = provData.bpa * provData.brackets[0].rate;
  const provincialTaxBeforeCredits = Math.round(Math.max(0, grossProvTax - provBpaCredit) * 100) / 100;

  // Provincial DTC
  const provincialDTC = Math.round(taxableDividend * data.provincialDTC[province] * 100) / 100;

  // Net tax (can't go below 0)
  const federalNet = Math.max(0, federalTaxBeforeCredits - federalDTC);
  const provincialNet = Math.max(0, provincialTaxBeforeCredits - provincialDTC);
  const totalTax = Math.round((federalNet + provincialNet) * 100) / 100;
  const netDividend = Math.round((actualDividend - totalTax) * 100) / 100;
  const effectiveRate = actualDividend > 0
    ? Math.round((totalTax / actualDividend) * 10000) / 100
    : 0;

  return {
    actualDividend,
    taxableDividend,
    grossUpAmount,
    federalTaxBeforeCredits,
    federalDTC,
    provincialTaxBeforeCredits,
    provincialDTC,
    totalTax,
    netDividend,
    effectiveRate,
  };
}
