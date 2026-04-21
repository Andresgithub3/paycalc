import type { Province, BracketDetail } from './types';
import { calculateProgressiveTax } from './federal';
import { PROVINCIAL_TAX_DATA_2026 } from './brackets/provincial-2026';

function getProvincialData(province: Province, taxYear: number) {
  if (taxYear === 2026) return PROVINCIAL_TAX_DATA_2026[province];
  // TODO: Add 2025 data
  return PROVINCIAL_TAX_DATA_2026[province];
}

/**
 * Ontario Health Premium — a separate graduated levy (not a tax bracket).
 */
export function calculateOntarioHealthPremium(taxableIncome: number): number {
  if (taxableIncome <= 20000) return 0;
  if (taxableIncome <= 25000) return Math.min(300, 0.06 * (taxableIncome - 20000));
  if (taxableIncome <= 36000) return 300;
  if (taxableIncome <= 38500) return Math.min(450, 300 + 0.06 * (taxableIncome - 36000));
  if (taxableIncome <= 48000) return 450;
  if (taxableIncome <= 48600) return Math.min(600, 450 + 0.25 * (taxableIncome - 48000));
  if (taxableIncome <= 72000) return 600;
  if (taxableIncome <= 72600) return Math.min(750, 600 + 0.25 * (taxableIncome - 72000));
  if (taxableIncome <= 200000) return 750;
  if (taxableIncome <= 200600) return Math.min(900, 750 + 0.25 * (taxableIncome - 200000));
  return 900;
}

/**
 * Ontario surtax — additional tax on provincial tax above certain thresholds.
 * 20% on basic provincial tax over $5,315 + 36% on basic provincial tax over $6,802
 */
export function calculateOntarioSurtax(basicProvincialTax: number): number {
  let surtax = 0;
  if (basicProvincialTax > 5315) {
    surtax += (basicProvincialTax - 5315) * 0.20;
  }
  if (basicProvincialTax > 6802) {
    surtax += (basicProvincialTax - 6802) * 0.36;
  }
  return Math.round(surtax * 100) / 100;
}

/**
 * Calculate provincial income tax.
 */
export function calculateProvincialTax(
  taxableIncome: number,
  province: Province,
  taxYear: number
): {
  tax: number;
  brackets: BracketDetail[];
  marginalRate: number;
  ontarioHealthPremium: number;
} {
  if (taxableIncome <= 0) {
    return { tax: 0, brackets: [], marginalRate: 0, ontarioHealthPremium: 0 };
  }

  const data = getProvincialData(province, taxYear);

  // Calculate gross provincial tax from brackets
  const { total: grossTax, details } = calculateProgressiveTax(taxableIncome, data.brackets);

  // Calculate BPA credit
  const lowestRate = data.brackets[0].rate;
  const bpaCredit = data.bpa * lowestRate;

  let netTax = Math.max(0, grossTax - bpaCredit);

  // Ontario surtax
  let ontarioHealthPremium = 0;
  if (province === 'ON' && data.hasSurtax) {
    const surtax = calculateOntarioSurtax(netTax);
    netTax += surtax;
  }

  // Ontario Health Premium (separate from income tax)
  if (province === 'ON' && data.hasHealthPremium) {
    ontarioHealthPremium = calculateOntarioHealthPremium(taxableIncome);
  }

  netTax = Math.round(netTax * 100) / 100;

  // Find marginal rate
  let marginalRate = 0;
  for (const bracket of data.brackets) {
    const bracketTop = bracket.to ?? Infinity;
    if (taxableIncome <= bracketTop) {
      marginalRate = bracket.rate;
      break;
    }
  }

  // Ontario surtax affects marginal rate
  if (province === 'ON' && data.hasSurtax) {
    const basicTaxAtIncome = netTax;
    if (basicTaxAtIncome > 6802) {
      marginalRate *= 1.56; // 1 + 0.20 + 0.36
    } else if (basicTaxAtIncome > 5315) {
      marginalRate *= 1.20; // 1 + 0.20
    }
  }

  return { tax: netTax, brackets: details, marginalRate, ontarioHealthPremium };
}
