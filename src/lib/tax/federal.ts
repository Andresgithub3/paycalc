import type { BracketDetail, TaxBracket, FederalTaxData } from './types';
import { FEDERAL_BRACKETS_2026 } from './brackets/federal-2026';

function getFederalData(taxYear: number): FederalTaxData {
  if (taxYear === 2026) return FEDERAL_BRACKETS_2026;
  // TODO: Add 2025 data
  return FEDERAL_BRACKETS_2026;
}

/**
 * Calculate tax from progressive brackets.
 * Returns the total tax and a breakdown per bracket.
 */
export function calculateProgressiveTax(
  taxableIncome: number,
  brackets: TaxBracket[]
): { total: number; details: BracketDetail[] } {
  let totalTax = 0;
  const details: BracketDetail[] = [];

  for (const bracket of brackets) {
    const bracketTop = bracket.to ?? Infinity;
    const taxableInBracket = Math.max(
      0,
      Math.min(taxableIncome, bracketTop) - bracket.from
    );
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    details.push({
      from: bracket.from,
      to: bracket.to,
      rate: bracket.rate,
      taxInBracket: Math.round(taxInBracket * 100) / 100,
    });
  }

  return { total: Math.round(totalTax * 100) / 100, details };
}

/**
 * Calculate the federal Basic Personal Amount, accounting for clawback at higher incomes.
 */
export function calculateFederalBPA(taxableIncome: number, taxYear: number): number {
  const data = getFederalData(taxYear);
  const { max, min, phaseOutStart, phaseOutEnd } = data.bpa;

  if (taxableIncome <= phaseOutStart) return max;
  if (taxableIncome >= phaseOutEnd) return min;

  // Linear phase-out between phaseOutStart and phaseOutEnd
  const ratio = (taxableIncome - phaseOutStart) / (phaseOutEnd - phaseOutStart);
  return max - ratio * (max - min);
}

/**
 * Calculate federal income tax.
 * Returns the net federal tax after credits, and bracket details.
 */
export function calculateFederalTax(
  taxableIncome: number,
  taxYear: number,
  isQuebec: boolean = false
): { tax: number; brackets: BracketDetail[]; marginalRate: number } {
  if (taxableIncome <= 0) {
    return { tax: 0, brackets: [], marginalRate: 0 };
  }

  const data = getFederalData(taxYear);

  // Calculate gross federal tax from brackets
  const { total: grossTax, details } = calculateProgressiveTax(taxableIncome, data.brackets);

  // Calculate non-refundable credits
  const bpa = calculateFederalBPA(taxableIncome, taxYear);
  const lowestRate = data.brackets[0].rate;
  const bpaCredit = bpa * lowestRate;
  const ceaCredit = data.cea * lowestRate;
  const totalCredits = bpaCredit + ceaCredit;

  let netTax = Math.max(0, grossTax - totalCredits);

  // Quebec federal abatement: 16.5% reduction
  if (isQuebec) {
    netTax = netTax * (1 - 0.165);
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

  // Quebec abatement affects marginal rate too
  if (isQuebec) {
    marginalRate = marginalRate * (1 - 0.165);
  }

  return { tax: netTax, brackets: details, marginalRate };
}
