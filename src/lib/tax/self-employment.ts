import type { Province } from './types';
import { calculateCPP, calculateCPP2 } from './cpp';
import { calculateEI } from './ei';
import { calculateQPIP } from './qpip';

export interface SelfEmploymentDeductions {
  /** Employee portion of CPP/QPP */
  cppEmployee: number;
  /** Employer portion of CPP/QPP (same as employee for self-employed) */
  cppEmployer: number;
  /** Total CPP (employee + employer) */
  cppTotal: number;

  /** Employee portion of CPP2 */
  cpp2Employee: number;
  /** Employer portion of CPP2 */
  cpp2Employer: number;
  /** Total CPP2 (employee + employer) */
  cpp2Total: number;

  /** The deductible portion — employer half of CPP + CPP2 */
  cppDeduction: number;

  /** EI premium (only if opted in) */
  eiPremium: number;

  /** QPIP premium (Quebec only) */
  qpipPremium: number;

  /** Net self-employment income after CPP employer-half deduction (used for taxable income) */
  taxableIncome: number;
}

/**
 * Calculate self-employment payroll deductions.
 *
 * Key differences from employment:
 * - Self-employed pay BOTH employee AND employer portions of CPP/QPP
 * - The employer half of CPP is deductible from income
 * - EI is optional (opted into EI Special Benefits)
 * - QPIP still applies for Quebec (employee rate)
 *
 * @param netSelfEmploymentIncome Net income after business expenses
 * @param taxYear Tax year
 * @param province Province of residence
 * @param optedIntoEI Whether the self-employed person opted into EI Special Benefits
 */
export function calculateSelfEmploymentDeductions(
  netSelfEmploymentIncome: number,
  taxYear: number,
  province: Province,
  optedIntoEI: boolean = false
): SelfEmploymentDeductions {
  if (netSelfEmploymentIncome <= 0) {
    return {
      cppEmployee: 0, cppEmployer: 0, cppTotal: 0,
      cpp2Employee: 0, cpp2Employer: 0, cpp2Total: 0,
      cppDeduction: 0, eiPremium: 0, qpipPremium: 0,
      taxableIncome: 0,
    };
  }

  // CPP: both employee and employer portions
  const cppEmployee = calculateCPP(netSelfEmploymentIncome, taxYear, province);
  const cppEmployer = cppEmployee; // same amount
  const cppTotal = round2(cppEmployee + cppEmployer);

  // CPP2: both portions
  const cpp2Employee = calculateCPP2(netSelfEmploymentIncome, taxYear);
  const cpp2Employer = cpp2Employee;
  const cpp2Total = round2(cpp2Employee + cpp2Employer);

  // Employer half is deductible from income
  const cppDeduction = round2(cppEmployer + cpp2Employer);

  // EI: only if opted in
  const eiPremium = optedIntoEI
    ? calculateEI(netSelfEmploymentIncome, taxYear, province)
    : 0;

  // QPIP: Quebec only, employee rate
  const qpipPremium = calculateQPIP(netSelfEmploymentIncome, taxYear, province);

  // Taxable income after CPP employer-half deduction
  const taxableIncome = round2(Math.max(0, netSelfEmploymentIncome - cppDeduction));

  return {
    cppEmployee,
    cppEmployer,
    cppTotal,
    cpp2Employee,
    cpp2Employer,
    cpp2Total,
    cppDeduction,
    eiPremium,
    qpipPremium,
    taxableIncome,
  };
}

/**
 * Calculate combined CPP for a person with both employment and self-employment income.
 * CPP caps are shared — total contributions cannot exceed the maximum.
 *
 * @param employmentIncome Employment income (gross annual)
 * @param selfEmploymentIncome Self-employment income (net)
 * @param taxYear Tax year
 * @param province Province of residence
 */
export function calculateCombinedCPP(
  employmentIncome: number,
  selfEmploymentIncome: number,
  taxYear: number,
  province: Province
): {
  employmentCPP: number;
  selfEmployedCPPEmployee: number;
  selfEmployedCPPEmployer: number;
  cpp2Total: number;
} {
  // Total pensionable earnings from both sources
  const totalPensionable = employmentIncome + selfEmploymentIncome;

  // Employment CPP (employee portion only, up to max)
  const employmentCPP = calculateCPP(employmentIncome, taxYear, province);

  // Self-employed CPP: calculated on combined earnings, minus employment portion already paid
  const totalCPPOnCombined = calculateCPP(totalPensionable, taxYear, province);
  const selfEmployedCPPEmployee = round2(Math.max(0, totalCPPOnCombined - employmentCPP));
  const selfEmployedCPPEmployer = selfEmployedCPPEmployee;

  // CPP2: on combined earnings above YMPE
  const cpp2OnCombined = calculateCPP2(totalPensionable, taxYear);
  const cpp2OnEmployment = calculateCPP2(employmentIncome, taxYear);
  const cpp2SelfEmployed = round2(Math.max(0, cpp2OnCombined - cpp2OnEmployment));
  // Self-employed pays both halves of CPP2 remainder
  const cpp2Total = round2(cpp2OnEmployment + cpp2SelfEmployed * 2);

  return {
    employmentCPP,
    selfEmployedCPPEmployee,
    selfEmployedCPPEmployer,
    cpp2Total,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
