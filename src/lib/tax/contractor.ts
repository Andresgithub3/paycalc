import type { ContractorInput, ContractorResult, Province, TaxYear } from './types';
import { calculateTax } from './engine';
import { calculateCorporateTax } from './corporate';
import { calculateDividendTax } from './dividends';
import { solveSalaryFromBudget, totalEmployerCost } from './structure-compare';

const RRSP_LIMIT_2026 = 33810;

function rrspRoom(earnedIncome: number): number {
  return Math.min(Math.round(earnedIncome * 0.18 * 100) / 100, RRSP_LIMIT_2026);
}

export function calculateContractorEquivalent(input: ContractorInput): ContractorResult {
  const { province, expenses, salaryPercent, taxYear } = input;

  // 1. Resolve gross revenue
  const grossRevenue = input.annualRevenue != null
    ? input.annualRevenue
    : (input.hourlyRate ?? 0) * (input.billableHours ?? 1500);

  // 2. Business income after expenses
  const businessIncome = Math.max(0, Math.round((grossRevenue - expenses) * 100) / 100);

  if (businessIncome <= 0) {
    return zeroResult(grossRevenue, expenses);
  }

  // 3. Split into salary budget and dividend budget
  const salaryFraction = Math.max(0, Math.min(100, salaryPercent)) / 100;
  const salaryBudget = Math.round(businessIncome * salaryFraction * 100) / 100;
  const dividendBudget = Math.round((businessIncome - salaryBudget) * 100) / 100;

  // 4. Salary side: find salary where salary + employer costs = salaryBudget
  let salary = 0;
  let salaryTax = { federalTax: 0, provincialTax: 0, ontarioHealthPremium: 0, cppContribution: 0, cpp2Contribution: 0, eiPremium: 0, qpipPremium: 0, netAnnual: 0 };
  let salaryNet = 0;

  if (salaryBudget > 0) {
    salary = solveSalaryFromBudget(salaryBudget, province, taxYear);
    const t = calculateTax({
      amount: salary,
      inputMode: 'annual',
      province,
      taxYear,
      hoursPerWeek: 40,
      weeksPerYear: 52,
    });
    salaryTax = t;
    salaryNet = t.netAnnual;
  }

  // 5. Dividend side: corporate tax then dividend tax
  let corporateTaxAmount = 0;
  let dividendAmount = 0;
  let dividendTaxAmount = 0;
  let dividendCredit = 0;
  let dividendNet = 0;

  if (dividendBudget > 0) {
    const corpTax = calculateCorporateTax(dividendBudget, province, taxYear);
    corporateTaxAmount = corpTax.totalTax;
    dividendAmount = corpTax.afterTaxIncome;
    const divTax = calculateDividendTax(dividendAmount, province, taxYear);
    dividendTaxAmount = divTax.totalTax;
    dividendCredit = Math.round((divTax.federalDTC + divTax.provincialDTC) * 100) / 100;
    dividendNet = divTax.netDividend;
  }

  // 6. Contractor total take-home
  const contractorNet = Math.round((salaryNet + dividendNet) * 100) / 100;
  const contractorEffectiveRate = businessIncome > 0
    ? Math.round(((businessIncome - contractorNet) / businessIncome) * 10000) / 100
    : 0;

  // 7. Binary search for equivalent employee salary
  const equivalentSalary = solveEquivalentSalary(contractorNet, province, taxYear);

  const empTax = calculateTax({
    amount: equivalentSalary,
    inputMode: 'annual',
    province,
    taxYear,
    hoursPerWeek: 40,
    weeksPerYear: 52,
  });

  const employeeEffectiveRate = equivalentSalary > 0
    ? Math.round(((equivalentSalary - empTax.netAnnual) / equivalentSalary) * 10000) / 100
    : 0;

  return {
    grossRevenue,
    expenses,
    businessIncome,

    salaryBudget,
    salary,
    salaryPersonalTax: Math.round((salaryTax.federalTax + salaryTax.provincialTax + salaryTax.ontarioHealthPremium) * 100) / 100,
    salaryCPP: salaryTax.cppContribution,
    salaryCPP2: salaryTax.cpp2Contribution,
    salaryEI: salaryTax.eiPremium,
    salaryQPIP: salaryTax.qpipPremium,
    salaryOntarioHealth: salaryTax.ontarioHealthPremium,
    salaryNet,

    dividendBudget,
    corporateTax: corporateTaxAmount,
    dividendAmount,
    dividendTax: dividendTaxAmount,
    dividendCredit,
    dividendNet,

    contractorNet,
    contractorEffectiveRate,
    contractorRRSP: rrspRoom(salary),

    equivalentSalary,
    employeeFederalTax: empTax.federalTax,
    employeeProvincialTax: empTax.provincialTax,
    employeeCPP: empTax.cppContribution,
    employeeCPP2: empTax.cpp2Contribution,
    employeeEI: empTax.eiPremium,
    employeeQPIP: empTax.qpipPremium,
    employeeOntarioHealth: empTax.ontarioHealthPremium,
    employeeNet: empTax.netAnnual,
    employeeEffectiveRate,
    employeeRRSP: rrspRoom(equivalentSalary),
    equivalentHourly: Math.round((equivalentSalary / 2080) * 100) / 100,
  };
}

/**
 * Binary search for employee salary S where calculateTax(S).netAnnual ≈ targetNet
 */
function solveEquivalentSalary(targetNet: number, province: Province, taxYear: TaxYear): number {
  if (targetNet <= 0) return 0;

  let low = 0;
  let high = targetNet * 3; // Upper bound: salary can't be more than ~3x the net

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const t = calculateTax({
      amount: mid,
      inputMode: 'annual',
      province,
      taxYear,
      hoursPerWeek: 40,
      weeksPerYear: 52,
    });

    if (t.netAnnual < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round(((low + high) / 2) * 100) / 100;
}

function zeroResult(grossRevenue: number, expenses: number): ContractorResult {
  return {
    grossRevenue,
    expenses,
    businessIncome: 0,
    salaryBudget: 0,
    salary: 0,
    salaryPersonalTax: 0,
    salaryCPP: 0,
    salaryCPP2: 0,
    salaryEI: 0,
    salaryQPIP: 0,
    salaryOntarioHealth: 0,
    salaryNet: 0,
    dividendBudget: 0,
    corporateTax: 0,
    dividendAmount: 0,
    dividendTax: 0,
    dividendCredit: 0,
    dividendNet: 0,
    contractorNet: 0,
    contractorEffectiveRate: 0,
    contractorRRSP: 0,
    equivalentSalary: 0,
    employeeFederalTax: 0,
    employeeProvincialTax: 0,
    employeeCPP: 0,
    employeeCPP2: 0,
    employeeEI: 0,
    employeeQPIP: 0,
    employeeOntarioHealth: 0,
    employeeNet: 0,
    employeeEffectiveRate: 0,
    employeeRRSP: 0,
    equivalentHourly: 0,
  };
}
