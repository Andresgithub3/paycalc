import type { Province, TaxYear } from './types';

/**
 * Input for the multi-income stream calculator.
 * Each field represents the ACTUAL amount received (before any gross-ups).
 */
export interface MultiStreamInput {
  province: Province;
  taxYear: TaxYear;

  employmentIncome: number;
  selfEmploymentIncome: number;
  capitalGains: number;
  eligibleDividends: number;
  ineligibleDividends: number;
  otherIncome: number;
  rrspDeduction: number;

  /** Whether self-employed person opted into EI Special Benefits (default: false) */
  selfEmployedEIOpted: boolean;

  /** Pension income from RPP, RRIF, annuity (not CPP/OAS/GIS) */
  pensionIncome: number;
  /** Whether the individual is 65+ at December 31 */
  isAge65Plus: boolean;
}

/**
 * Detailed result from the multi-income stream calculation.
 */
export interface MultiStreamResult {
  // Summary
  totalIncome: number;           // actual cash received (sum of all actual amounts)
  totalTaxableIncome: number;    // after gross-ups, inclusions, deductions
  totalTaxPayable: number;       // federal + provincial + CPP + EI
  netIncome: number;             // take-home
  effectiveTaxRate: number;      // percentage

  // Tax breakdown
  federalTax: number;            // after credits, before abatement
  provincialTax: number;         // after credits
  ontarioHealthPremium: number;

  // Dividend tax credits (shown as reductions)
  federalEligibleDTC: number;
  federalIneligibleDTC: number;
  provincialEligibleDTC: number;
  provincialIneligibleDTC: number;

  // Pension & age credits
  pensionCreditFederal: number;   // pension income tax credit (federal)
  pensionCreditProvincial: number; // pension income tax credit (provincial)
  ageAmountCreditFederal: number;  // age amount credit (federal)
  ageAmountCreditProvincial: number; // age amount credit (provincial)
  ageAmountClawback: number;       // federal clawback amount (for display)

  // Payroll deductions
  cppEmployee: number;           // employment CPP (employee portion)
  cppSelfEmployed: number;       // self-employment CPP (both portions)
  cpp2Total: number;             // CPP2 on combined pensionable earnings
  eiPremium: number;             // employment EI + optional self-employed EI
  qpipPremium: number;           // Quebec only

  totalDeductions: number;

  // Per-stream analysis
  streams: StreamAnalysis[];

  // Marginal rates by income type
  marginalRates: {
    ordinary: number;            // employment, self-employment, interest, other
    capitalGains: number;        // = ordinary * 0.50
    eligibleDividends: number;   // complex: bracket + gross-up + DTC
    ineligibleDividends: number; // complex: bracket + gross-up + DTC
  };
}

export interface StreamAnalysis {
  type: 'employment' | 'selfEmployment' | 'pension' | 'capitalGains' | 'eligibleDividends' | 'ineligibleDividends' | 'other';
  actualAmount: number;
  taxableAmount: number;
  effectiveRate: number;         // percentage
  marginalRate: number;          // percentage
}
