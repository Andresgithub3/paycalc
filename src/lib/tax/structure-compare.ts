import type { Province, StructureInput, StructureResult, TaxYear } from './types';
import { calculateTax } from './engine';
import { calculateCPP, calculateCPP2 } from './cpp';
import { calculateEI } from './ei';
import { calculateQPIP } from './qpip';
import { calculateFederalTax } from './federal';
import { calculateProvincialTax } from './provincial';
import { calculateCorporateTax } from './corporate';
import { calculateDividendTax } from './dividends';
import { CPP_2026, CPP2_2026, EI_2026, EI_QUEBEC_2026, QPIP_2026 } from './brackets/federal-2026';

// RRSP room = 18% of earned income, capped at annual limit
const RRSP_LIMIT_2026 = 33810;

function rrspRoom(earnedIncome: number): number {
  return Math.min(Math.round(earnedIncome * 0.18 * 100) / 100, RRSP_LIMIT_2026);
}

function makeResult(
  partial: Omit<StructureResult, 'totalDeductions' | 'effectiveRate'>
): StructureResult {
  const totalDeductions = Math.round(
    (partial.grossRevenue - partial.businessExpenses - partial.netIncome) * 100
  ) / 100;
  const effectiveRate = partial.grossRevenue > 0
    ? Math.round((totalDeductions / (partial.grossRevenue - partial.businessExpenses)) * 10000) / 100
    : 0;
  return { ...partial, totalDeductions, effectiveRate };
}

/**
 * 1. Salaried Employee
 * Reuses existing calculateTax(). Also calculates employer costs.
 */
export function calculateSalaried(input: StructureInput): StructureResult {
  const { grossRevenue, province, taxYear } = input;
  const salary = grossRevenue; // For salaried, gross revenue = salary

  const tax = calculateTax({
    amount: salary,
    inputMode: 'annual',
    province,
    taxYear,
    hoursPerWeek: 40,
    weeksPerYear: 52,
  });

  // Employer costs: matching CPP + 1.4x EI
  const employerCPP = tax.cppContribution;
  const employerCPP2 = tax.cpp2Contribution;
  const isQuebec = province === 'QC';
  const eiData = isQuebec ? EI_QUEBEC_2026 : EI_2026;
  const employerEI = Math.round(tax.eiPremium * 1.4 * 100) / 100;
  const employerQPIP = isQuebec
    ? Math.round(Math.min(salary, QPIP_2026.maxInsurableEarnings) * 0.00692 * 100) / 100
    : 0;
  const employerCost = Math.round((salary + employerCPP + employerCPP2 + employerEI + employerQPIP) * 100) / 100;

  return makeResult({
    type: 'salaried',
    grossRevenue,
    businessIncome: salary,
    businessExpenses: 0,
    corporateTax: 0,
    personalIncomeTax: Math.round((tax.federalTax + tax.provincialTax + tax.ontarioHealthPremium) * 100) / 100,
    cppContribution: tax.cppContribution,
    cpp2Contribution: tax.cpp2Contribution,
    eiPremium: tax.eiPremium,
    qpipPremium: tax.qpipPremium,
    dividendTax: 0,
    dividendCredit: 0,
    netIncome: tax.netAnnual,
    rrspRoom: rrspRoom(salary),
    employerCost,
    salaryAmount: salary,
    dividendAmount: 0,
  });
}

/**
 * 2. Sole Proprietorship
 * Both halves of CPP, no EI, 50% CPP deduction.
 */
export function calculateSoleProp(input: StructureInput): StructureResult {
  const { grossRevenue, province, expenseRate, taxYear } = input;
  const businessExpenses = Math.round(grossRevenue * expenseRate * 100) / 100;
  const businessIncome = Math.round((grossRevenue - businessExpenses) * 100) / 100;

  if (businessIncome <= 0) {
    return makeResult({
      type: 'sole-prop', grossRevenue, businessIncome: 0, businessExpenses,
      corporateTax: 0, personalIncomeTax: 0, cppContribution: 0, cpp2Contribution: 0,
      eiPremium: 0, qpipPremium: 0, dividendTax: 0, dividendCredit: 0,
      netIncome: 0, rrspRoom: 0, employerCost: 0, salaryAmount: 0, dividendAmount: 0,
    });
  }

  // Self-employed CPP: both halves (employee + employer)
  const cppEmployee = calculateCPP(businessIncome, taxYear, province);
  const cppEmployer = cppEmployee; // Same amount for employer half
  const cpp2Employee = calculateCPP2(businessIncome, taxYear);
  const cpp2Employer = cpp2Employee;

  const totalCPP = Math.round((cppEmployee + cppEmployer) * 100) / 100;
  const totalCPP2 = Math.round((cpp2Employee + cpp2Employer) * 100) / 100;

  // 50% of total CPP is deductible (the employer half)
  const cppDeduction = Math.round(((cppEmployee + cpp2Employee)) * 100) / 100;

  // QPIP for Quebec self-employed (employee rate only)
  const qpipPremium = province === 'QC'
    ? calculateQPIP(businessIncome, taxYear, province)
    : 0;

  // No EI for self-employed
  const eiPremium = 0;

  // Taxable income after CPP employer-half deduction
  const taxableIncome = Math.max(0, businessIncome - cppDeduction);

  const isQuebec = province === 'QC';
  const federal = calculateFederalTax(taxableIncome, taxYear, isQuebec);
  const provincial = calculateProvincialTax(taxableIncome, province, taxYear);

  const personalIncomeTax = Math.round((federal.tax + provincial.tax + provincial.ontarioHealthPremium) * 100) / 100;
  const allDeductions = personalIncomeTax + totalCPP + totalCPP2 + eiPremium + qpipPremium;
  const netIncome = Math.round((businessIncome - allDeductions) * 100) / 100;

  return makeResult({
    type: 'sole-prop',
    grossRevenue,
    businessIncome,
    businessExpenses,
    corporateTax: 0,
    personalIncomeTax,
    cppContribution: totalCPP,
    cpp2Contribution: totalCPP2,
    eiPremium,
    qpipPremium,
    dividendTax: 0,
    dividendCredit: 0,
    netIncome,
    rrspRoom: rrspRoom(businessIncome),
    employerCost: 0,
    salaryAmount: 0,
    dividendAmount: 0,
  });
}

/**
 * 3. CCPC — All Salary
 * Corporation pays salary as a deductible expense.
 * Solve for max salary where salary + employerCPP + employerEI = businessIncome.
 */
export function calculateCCPCSalary(input: StructureInput): StructureResult {
  const { grossRevenue, province, expenseRate, taxYear } = input;
  const businessExpenses = Math.round(grossRevenue * expenseRate * 100) / 100;
  const businessIncome = Math.round((grossRevenue - businessExpenses) * 100) / 100;

  if (businessIncome <= 0) {
    return makeResult({
      type: 'ccpc-salary', grossRevenue, businessIncome: 0, businessExpenses,
      corporateTax: 0, personalIncomeTax: 0, cppContribution: 0, cpp2Contribution: 0,
      eiPremium: 0, qpipPremium: 0, dividendTax: 0, dividendCredit: 0,
      netIncome: 0, rrspRoom: 0, employerCost: 0, salaryAmount: 0, dividendAmount: 0,
    });
  }

  // Binary search for salary where salary + employer payroll costs = businessIncome
  const salary = solveSalaryFromBudget(businessIncome, province, taxYear);

  const tax = calculateTax({
    amount: salary,
    inputMode: 'annual',
    province,
    taxYear,
    hoursPerWeek: 40,
    weeksPerYear: 52,
  });

  return makeResult({
    type: 'ccpc-salary',
    grossRevenue,
    businessIncome,
    businessExpenses,
    corporateTax: 0, // Salary is fully deductible
    personalIncomeTax: Math.round((tax.federalTax + tax.provincialTax + tax.ontarioHealthPremium) * 100) / 100,
    cppContribution: tax.cppContribution,
    cpp2Contribution: tax.cpp2Contribution,
    eiPremium: tax.eiPremium,
    qpipPremium: tax.qpipPremium,
    dividendTax: 0,
    dividendCredit: 0,
    netIncome: tax.netAnnual,
    rrspRoom: rrspRoom(salary),
    employerCost: businessIncome,
    salaryAmount: salary,
    dividendAmount: 0,
  });
}

/**
 * Binary search: find salary such that salary + employer CPP + employer CPP2 + employer EI + employer QPIP = budget
 */
export function solveSalaryFromBudget(budget: number, province: Province, taxYear: TaxYear): number {
  let low = 0;
  let high = budget;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const cost = totalEmployerCost(mid, province, taxYear);
    if (cost < budget) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round(((low + high) / 2) * 100) / 100;
}

export function totalEmployerCost(salary: number, province: Province, taxYear: TaxYear): number {
  const cppEmp = calculateCPP(salary, taxYear, province);
  const cpp2Emp = calculateCPP2(salary, taxYear);
  const eiEmp = calculateEI(salary, taxYear, province);
  const employerCPP = cppEmp;
  const employerCPP2 = cpp2Emp;
  const employerEI = Math.round(eiEmp * 1.4 * 100) / 100;
  const isQuebec = province === 'QC';
  const employerQPIP = isQuebec
    ? Math.round(Math.min(salary, QPIP_2026.maxInsurableEarnings) * 0.00692 * 100) / 100
    : 0;
  return salary + employerCPP + employerCPP2 + employerEI + employerQPIP;
}

/**
 * 4. CCPC — All Dividends
 * Corporate tax first, then remaining paid as non-eligible dividends.
 */
export function calculateCCPCDividend(input: StructureInput): StructureResult {
  const { grossRevenue, province, expenseRate, taxYear } = input;
  const businessExpenses = Math.round(grossRevenue * expenseRate * 100) / 100;
  const businessIncome = Math.round((grossRevenue - businessExpenses) * 100) / 100;

  if (businessIncome <= 0) {
    return makeResult({
      type: 'ccpc-dividend', grossRevenue, businessIncome: 0, businessExpenses,
      corporateTax: 0, personalIncomeTax: 0, cppContribution: 0, cpp2Contribution: 0,
      eiPremium: 0, qpipPremium: 0, dividendTax: 0, dividendCredit: 0,
      netIncome: 0, rrspRoom: 0, employerCost: 0, salaryAmount: 0, dividendAmount: 0,
    });
  }

  const corpTax = calculateCorporateTax(businessIncome, province, taxYear);
  const dividendAmount = corpTax.afterTaxIncome;
  const divTax = calculateDividendTax(dividendAmount, province, taxYear);

  return makeResult({
    type: 'ccpc-dividend',
    grossRevenue,
    businessIncome,
    businessExpenses,
    corporateTax: corpTax.totalTax,
    personalIncomeTax: 0,
    cppContribution: 0,
    cpp2Contribution: 0,
    eiPremium: 0,
    qpipPremium: 0,
    dividendTax: divTax.totalTax,
    dividendCredit: Math.round((divTax.federalDTC + divTax.provincialDTC) * 100) / 100,
    netIncome: divTax.netDividend,
    rrspRoom: 0, // No RRSP room from dividends
    employerCost: 0,
    salaryAmount: 0,
    dividendAmount,
  });
}

/**
 * 5. CCPC — Optimal Salary/Dividend Mix
 * Sweep salary from $0 to businessIncome in $1,000 steps.
 * Pick the salary that maximizes total take-home.
 */
export function calculateCCPCOptimal(input: StructureInput): StructureResult {
  const { grossRevenue, province, expenseRate, taxYear } = input;
  const businessExpenses = Math.round(grossRevenue * expenseRate * 100) / 100;
  const businessIncome = Math.round((grossRevenue - businessExpenses) * 100) / 100;

  if (businessIncome <= 0) {
    return makeResult({
      type: 'ccpc-optimal', grossRevenue, businessIncome: 0, businessExpenses,
      corporateTax: 0, personalIncomeTax: 0, cppContribution: 0, cpp2Contribution: 0,
      eiPremium: 0, qpipPremium: 0, dividendTax: 0, dividendCredit: 0,
      netIncome: 0, rrspRoom: 0, employerCost: 0, salaryAmount: 0, dividendAmount: 0,
    });
  }

  const step = 1000;
  let bestNet = -Infinity;
  let bestSalaryBudget = 0;

  // Sweep salary budget from 0 to businessIncome
  for (let salaryBudget = 0; salaryBudget <= businessIncome; salaryBudget += step) {
    const net = evaluateMix(salaryBudget, businessIncome, province, taxYear);
    if (net > bestNet) {
      bestNet = net;
      bestSalaryBudget = salaryBudget;
    }
  }

  // Also check businessIncome (all salary)
  const netAllSalary = evaluateMix(businessIncome, businessIncome, province, taxYear);
  if (netAllSalary > bestNet) {
    bestNet = netAllSalary;
    bestSalaryBudget = businessIncome;
  }

  // Now compute the full result at the best salary budget
  const salary = bestSalaryBudget > 0
    ? solveSalaryFromBudget(bestSalaryBudget, province, taxYear)
    : 0;
  const actualSalaryBudget = bestSalaryBudget > 0
    ? totalEmployerCost(salary, province, taxYear)
    : 0;
  const remainingForCorp = Math.max(0, businessIncome - bestSalaryBudget);

  // Salary side
  let salaryTax = { federalTax: 0, provincialTax: 0, ontarioHealthPremium: 0, cppContribution: 0, cpp2Contribution: 0, eiPremium: 0, qpipPremium: 0, netAnnual: 0 };
  if (salary > 0) {
    const t = calculateTax({
      amount: salary, inputMode: 'annual', province, taxYear,
      hoursPerWeek: 40, weeksPerYear: 52,
    });
    salaryTax = t;
  }

  // Dividend side
  let corpTaxAmount = 0;
  let dividendAmount = 0;
  let divTaxResult = { totalTax: 0, netDividend: 0, federalDTC: 0, provincialDTC: 0 };
  if (remainingForCorp > 0) {
    const corpTax = calculateCorporateTax(remainingForCorp, province, taxYear);
    corpTaxAmount = corpTax.totalTax;
    dividendAmount = corpTax.afterTaxIncome;
    divTaxResult = calculateDividendTax(dividendAmount, province, taxYear);
  }

  const netIncome = Math.round((salaryTax.netAnnual + divTaxResult.netDividend) * 100) / 100;

  return makeResult({
    type: 'ccpc-optimal',
    grossRevenue,
    businessIncome,
    businessExpenses,
    corporateTax: corpTaxAmount,
    personalIncomeTax: Math.round((salaryTax.federalTax + salaryTax.provincialTax + salaryTax.ontarioHealthPremium) * 100) / 100,
    cppContribution: salaryTax.cppContribution,
    cpp2Contribution: salaryTax.cpp2Contribution,
    eiPremium: salaryTax.eiPremium,
    qpipPremium: salaryTax.qpipPremium,
    dividendTax: divTaxResult.totalTax,
    dividendCredit: Math.round((divTaxResult.federalDTC + divTaxResult.provincialDTC) * 100) / 100,
    netIncome,
    rrspRoom: rrspRoom(salary),
    employerCost: salary > 0 ? Math.round(bestSalaryBudget * 100) / 100 : 0,
    salaryAmount: salary,
    dividendAmount,
  });
}

/**
 * Evaluate the net take-home for a given salary/dividend split.
 */
export function evaluateMix(
  salaryBudget: number,
  businessIncome: number,
  province: Province,
  taxYear: TaxYear
): number {
  let salaryNet = 0;
  if (salaryBudget > 0) {
    const salary = solveSalaryFromBudget(salaryBudget, province, taxYear);
    const t = calculateTax({
      amount: salary, inputMode: 'annual', province, taxYear,
      hoursPerWeek: 40, weeksPerYear: 52,
    });
    salaryNet = t.netAnnual;
  }

  const remainingForCorp = Math.max(0, businessIncome - salaryBudget);
  let dividendNet = 0;
  if (remainingForCorp > 0) {
    const corpTax = calculateCorporateTax(remainingForCorp, province, taxYear);
    const divTax = calculateDividendTax(corpTax.afterTaxIncome, province, taxYear);
    dividendNet = divTax.netDividend;
  }

  return salaryNet + dividendNet;
}

/**
 * Calculate all 5 structures and return them sorted by net income (best first).
 */
export function compareAllStructures(input: StructureInput): StructureResult[] {
  const results = [
    calculateSalaried(input),
    calculateSoleProp(input),
    calculateCCPCSalary(input),
    calculateCCPCDividend(input),
    calculateCCPCOptimal(input),
  ];

  return results.sort((a, b) => b.netIncome - a.netIncome);
}
