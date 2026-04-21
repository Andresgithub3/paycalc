import type { CalculatorInput, TaxBreakdown } from './types';
import { calculateFederalTax } from './federal';
import { calculateProvincialTax } from './provincial';
import { calculateCPP, calculateCPP2 } from './cpp';
import { calculateEI } from './ei';
import { calculateQPIP } from './qpip';

/**
 * Normalize input amount to gross annual salary.
 */
function normalizeToAnnual(input: CalculatorInput): number {
  const { amount, inputMode, hoursPerWeek, weeksPerYear } = input;

  switch (inputMode) {
    case 'annual':
      return amount;
    case 'hourly':
      return amount * hoursPerWeek * weeksPerYear;
    case 'monthly':
      return amount * 12;
    case 'biweekly':
      return amount * 26;
    case 'weekly':
      return amount * 52;
    default:
      return amount;
  }
}

/**
 * Main tax calculation engine.
 * Takes calculator input and returns a full tax breakdown.
 * All calculations are client-side — no server calls.
 */
export function calculateTax(input: CalculatorInput): TaxBreakdown {
  const grossAnnual = normalizeToAnnual(input);
  const { province, taxYear, rrspDeduction = 0, hoursPerWeek, weeksPerYear } = input;

  // Calculate taxable income after RRSP
  const taxableIncome = Math.max(0, grossAnnual - rrspDeduction);

  // Federal tax
  const isQuebec = province === 'QC';
  const federal = calculateFederalTax(taxableIncome, taxYear, isQuebec);

  // Provincial tax
  const provincial = calculateProvincialTax(taxableIncome, province, taxYear);

  // Payroll deductions (based on gross, not taxable income)
  const cppContribution = calculateCPP(grossAnnual, taxYear, province);
  const cpp2Contribution = calculateCPP2(grossAnnual, taxYear);
  const eiPremium = calculateEI(grossAnnual, taxYear, province);
  const qpipPremium = calculateQPIP(grossAnnual, taxYear, province);

  // Total deductions
  const totalDeductions =
    federal.tax +
    provincial.tax +
    provincial.ontarioHealthPremium +
    cppContribution +
    cpp2Contribution +
    eiPremium +
    qpipPremium;

  // Net amounts
  const netAnnual = Math.round((grossAnnual - totalDeductions) * 100) / 100;

  // Period conversions
  const grossMonthly = Math.round((grossAnnual / 12) * 100) / 100;
  const grossBiweekly = Math.round((grossAnnual / 26) * 100) / 100;
  const grossWeekly = Math.round((grossAnnual / 52) * 100) / 100;
  const grossHourly = Math.round((grossAnnual / (hoursPerWeek * weeksPerYear)) * 100) / 100;

  const netMonthly = Math.round((netAnnual / 12) * 100) / 100;
  const netBiweekly = Math.round((netAnnual / 26) * 100) / 100;
  const netWeekly = Math.round((netAnnual / 52) * 100) / 100;
  const netHourly = Math.round((netAnnual / (hoursPerWeek * weeksPerYear)) * 100) / 100;

  // Tax rates
  const effectiveTaxRate =
    grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 10000) / 100
      : 0;

  const marginalTaxRate =
    Math.round((federal.marginalRate + provincial.marginalRate) * 10000) / 100;

  return {
    grossAnnual,
    grossMonthly,
    grossBiweekly,
    grossWeekly,
    grossHourly,

    federalTax: federal.tax,
    provincialTax: provincial.tax,
    cppContribution,
    cpp2Contribution,
    eiPremium,
    qpipPremium,
    ontarioHealthPremium: provincial.ontarioHealthPremium,

    totalDeductions: Math.round(totalDeductions * 100) / 100,

    netAnnual,
    netMonthly,
    netBiweekly,
    netWeekly,
    netHourly,

    effectiveTaxRate,
    marginalTaxRate,

    federalBrackets: federal.brackets,
    provincialBrackets: provincial.brackets,
  };
}
