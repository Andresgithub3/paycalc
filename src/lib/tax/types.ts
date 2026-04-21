export type Province =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT'
  | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export type InputMode = 'annual' | 'hourly' | 'monthly' | 'biweekly' | 'weekly';
export type TaxYear = 2025 | 2026;

export interface CalculatorInput {
  amount: number;
  inputMode: InputMode;
  province: Province;
  taxYear: TaxYear;
  hoursPerWeek: number;       // default 40
  weeksPerYear: number;       // default 52
  rrspDeduction?: number;     // optional RRSP contribution (reduces taxable income)
}

export interface TaxBreakdown {
  grossAnnual: number;
  grossMonthly: number;
  grossBiweekly: number;
  grossWeekly: number;
  grossHourly: number;

  federalTax: number;
  provincialTax: number;
  cppContribution: number;
  cpp2Contribution: number;
  eiPremium: number;
  qpipPremium: number;          // Quebec only, 0 for others
  ontarioHealthPremium: number; // Ontario only, 0 for others

  totalDeductions: number;

  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  netWeekly: number;
  netHourly: number;

  effectiveTaxRate: number;     // percentage
  marginalTaxRate: number;      // combined federal + provincial marginal

  federalBrackets: BracketDetail[];
  provincialBrackets: BracketDetail[];
}

export interface BracketDetail {
  from: number;
  to: number | null;
  rate: number;                 // decimal (0.14, not 14)
  taxInBracket: number;
}

export interface TaxBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface FederalTaxData {
  brackets: TaxBracket[];
  bpa: {
    max: number;
    min: number;
    phaseOutStart: number;
    phaseOutEnd: number;
  };
  cea: number;
}

export interface ProvincialTaxData {
  brackets: TaxBracket[];
  bpa: number;
  usesQPP?: boolean;
  usesQPIP?: boolean;
  federalAbatement?: number;
  hasHealthPremium?: boolean;
  hasSurtax?: boolean;
  notes?: string;
}

export interface CPPData {
  basicExemption: number;
  ympe: number;
  rate: number;
  maxContribution: number;
}

export interface CPP2Data {
  yampe: number;
  rate: number;
  maxContribution: number;
}

export interface EIData {
  maxInsurableEarnings: number;
  rate: number;
  maxPremium: number;
}

export interface QPIPData {
  maxInsurableEarnings: number;
  rate: number;
  maxPremium: number;
}
