import type { Province } from './types';
import type { MultiStreamInput, MultiStreamResult, StreamAnalysis } from './income-types';

import { calculateProgressiveTax, calculateFederalBPA } from './federal';
import { calculateProvincialTax } from './provincial';
import { calculateOntarioHealthPremium } from './provincial';
import { calculateCPP, calculateCPP2 } from './cpp';
import { calculateEI } from './ei';
import { calculateQPIP } from './qpip';

import { FEDERAL_BRACKETS_2026 } from './brackets/federal-2026';
import { PROVINCIAL_TAX_DATA_2026 } from './brackets/provincial-2026';

import { grossUpEligibleDividends, grossUpIneligibleDividends } from './multi-dividends';
import {
  calculateEligibleDividendCredits,
  calculateIneligibleDividendCredits,
  calculateEligibleDividendMarginalRate,
  calculateIneligibleDividendMarginalRate,
} from './multi-dividends';
import { calculateTaxableCapitalGains, calculateCapitalGainsMarginalRate } from './capital-gains';

/**
 * Multi-stream income tax calculator.
 *
 * Combines employment, self-employment, capital gains, eligible dividends,
 * ineligible dividends, other income, and RRSP deductions into a single
 * comprehensive tax calculation.
 */
export function calculateMultiStreamTax(input: MultiStreamInput): MultiStreamResult {
  const {
    province, taxYear,
    employmentIncome, selfEmploymentIncome,
    capitalGains, eligibleDividends, ineligibleDividends,
    otherIncome, rrspDeduction,
    selfEmployedEIOpted,
  } = input;

  const isQuebec = province === 'QC';

  // ─── Step 1: Total actual income (cash received) ───
  const totalIncome = round2(
    employmentIncome + selfEmploymentIncome + capitalGains +
    eligibleDividends + ineligibleDividends + otherIncome
  );

  // ─── Step 2: Calculate gross-ups and inclusions ───
  const eligibleGrossUp = grossUpEligibleDividends(eligibleDividends);
  const ineligibleGrossUp = grossUpIneligibleDividends(ineligibleDividends);
  const capGains = calculateTaxableCapitalGains(capitalGains);

  // ─── Step 3: Self-employment CPP (both halves) ───
  // Combined pensionable earnings for CPP cap sharing
  const totalPensionable = employmentIncome + selfEmploymentIncome;

  // Employment CPP (employee portion)
  const employmentCPP = employmentIncome > 0
    ? calculateCPP(employmentIncome, taxYear, province)
    : 0;

  // Self-employed CPP: calculate on combined, subtract employment portion
  const totalCPPOnCombined = calculateCPP(totalPensionable, taxYear, province);
  const selfEmployedCPPEmployee = round2(Math.max(0, totalCPPOnCombined - employmentCPP));
  const selfEmployedCPPEmployer = selfEmployedCPPEmployee;
  const selfEmployedCPPTotal = round2(selfEmployedCPPEmployee + selfEmployedCPPEmployer);

  // CPP2: on combined earnings above YMPE
  const cpp2OnEmployment = employmentIncome > 0
    ? calculateCPP2(employmentIncome, taxYear)
    : 0;
  const cpp2OnCombined = calculateCPP2(totalPensionable, taxYear);
  const cpp2SelfEmployedHalf = round2(Math.max(0, cpp2OnCombined - cpp2OnEmployment));
  // Self-employed pays both halves of their CPP2 portion
  const cpp2SelfEmployedTotal = round2(cpp2SelfEmployedHalf * 2);
  const cpp2Total = round2(cpp2OnEmployment + cpp2SelfEmployedTotal);

  // Self-employment CPP deduction (employer half is deductible from income)
  const selfEmployedCPPDeduction = round2(selfEmployedCPPEmployer + cpp2SelfEmployedHalf);

  // ─── Step 4: EI ───
  // Employment EI
  const employmentEI = employmentIncome > 0
    ? calculateEI(employmentIncome, taxYear, province)
    : 0;

  // Self-employed EI (only if opted in)
  let selfEmployedEI = 0;
  if (selfEmployedEIOpted && selfEmploymentIncome > 0) {
    // Calculate on combined insurable earnings, subtract employment portion
    const totalEI = calculateEI(employmentIncome + selfEmploymentIncome, taxYear, province);
    selfEmployedEI = round2(Math.max(0, totalEI - employmentEI));
  }
  const totalEI = round2(employmentEI + selfEmployedEI);

  // ─── Step 5: QPIP (Quebec only) ───
  const qpipOnEmployment = calculateQPIP(employmentIncome, taxYear, province);
  const qpipOnSelfEmployment = selfEmploymentIncome > 0
    ? (() => {
        const totalQpip = calculateQPIP(employmentIncome + selfEmploymentIncome, taxYear, province);
        return round2(Math.max(0, totalQpip - qpipOnEmployment));
      })()
    : 0;
  const totalQPIP = round2(qpipOnEmployment + qpipOnSelfEmployment);

  // ─── Step 6: Total taxable income ───
  const taxableIncome = round2(Math.max(0,
    employmentIncome
    + (selfEmploymentIncome - selfEmployedCPPDeduction)
    + capGains.taxableAmount
    + eligibleGrossUp.taxableAmount
    + ineligibleGrossUp.taxableAmount
    + otherIncome
    - rrspDeduction
  ));

  // ─── Step 7: Federal tax ───
  const federalData = FEDERAL_BRACKETS_2026;
  const { total: grossFederalTax } = calculateProgressiveTax(taxableIncome, federalData.brackets);
  const bpa = calculateFederalBPA(taxableIncome, taxYear);
  const lowestFedRate = federalData.brackets[0].rate;
  const bpaCredit = bpa * lowestFedRate;

  // Canada Employment Amount credit — only on employment income
  const ceaCredit = employmentIncome > 0
    ? federalData.cea * lowestFedRate
    : 0;

  let federalTaxBeforeCredits = Math.max(0, grossFederalTax - bpaCredit - ceaCredit);

  // Quebec federal abatement: 16.5% reduction
  if (isQuebec) {
    federalTaxBeforeCredits = federalTaxBeforeCredits * (1 - 0.165);
  }

  // Federal dividend tax credits
  const eligibleDTCFedProv = calculateEligibleDividendCredits(eligibleGrossUp.taxableAmount, province);
  const ineligibleDTCFedProv = calculateIneligibleDividendCredits(ineligibleGrossUp.taxableAmount, province);

  // Apply federal DTCs (cannot reduce federal tax below zero)
  const federalTax = round2(Math.max(0,
    federalTaxBeforeCredits - eligibleDTCFedProv.federalDTC - ineligibleDTCFedProv.federalDTC
  ));

  // ─── Step 8: Provincial tax ───
  const provResult = calculateProvincialTax(taxableIncome, province, taxYear);
  // provResult.tax includes surtax (Ontario) but we need to subtract DTCs
  // We need the "before DTC" amount, which is provResult.tax (already includes BPA credit and surtax)

  const provincialTaxBeforeDTC = provResult.tax;

  // Apply provincial DTCs (cannot reduce provincial tax below zero)
  const provincialTax = round2(Math.max(0,
    provincialTaxBeforeDTC - eligibleDTCFedProv.provincialDTC - ineligibleDTCFedProv.provincialDTC
  ));

  const ontarioHealthPremium = provResult.ontarioHealthPremium;

  // ─── Step 9: Total deductions ───
  const totalDeductions = round2(
    federalTax + provincialTax + ontarioHealthPremium +
    employmentCPP + selfEmployedCPPTotal + cpp2Total +
    totalEI + totalQPIP
  );

  const netIncome = round2(totalIncome - totalDeductions);
  const effectiveTaxRate = totalIncome > 0
    ? round2((totalDeductions / totalIncome) * 100)
    : 0;

  // ─── Step 10: Marginal rates ───
  let federalMarginalRate = 0;
  let provincialMarginalRate = 0;
  let ordinaryMarginalRate = 0;

  if (taxableIncome > 0) {
    // Find the federal marginal rate at the current taxable income
    for (const bracket of federalData.brackets) {
      const bracketTop = bracket.to ?? Infinity;
      if (taxableIncome <= bracketTop) {
        federalMarginalRate = bracket.rate;
        break;
      }
    }
    if (isQuebec) {
      federalMarginalRate = federalMarginalRate * (1 - 0.165);
    }

    provincialMarginalRate = provResult.marginalRate;
    ordinaryMarginalRate = round4(federalMarginalRate + provincialMarginalRate);
  }

  const marginalRates = {
    ordinary: round4(ordinaryMarginalRate),
    capitalGains: calculateCapitalGainsMarginalRate(ordinaryMarginalRate),
    eligibleDividends: calculateEligibleDividendMarginalRate(
      federalMarginalRate, provincialMarginalRate, province
    ),
    ineligibleDividends: calculateIneligibleDividendMarginalRate(
      federalMarginalRate, provincialMarginalRate, province
    ),
  };

  // ─── Step 11: Per-stream analysis ───
  // Use income stacking order: employment → self-employment → other → capital gains → eligible dividends → ineligible dividends
  const streams = calculatePerStreamAnalysis(input, taxableIncome, province, taxYear, marginalRates);

  return {
    totalIncome,
    totalTaxableIncome: taxableIncome,
    totalTaxPayable: totalDeductions,
    netIncome,
    effectiveTaxRate,

    federalTax,
    provincialTax,
    ontarioHealthPremium,

    federalEligibleDTC: eligibleDTCFedProv.federalDTC,
    federalIneligibleDTC: ineligibleDTCFedProv.federalDTC,
    provincialEligibleDTC: eligibleDTCFedProv.provincialDTC,
    provincialIneligibleDTC: ineligibleDTCFedProv.provincialDTC,

    cppEmployee: employmentCPP,
    cppSelfEmployed: selfEmployedCPPTotal,
    cpp2Total,
    eiPremium: totalEI,
    qpipPremium: totalQPIP,

    totalDeductions,
    streams,
    marginalRates,
  };
}

/**
 * Calculate per-stream tax analysis using income stacking.
 *
 * Stacking order (per spec):
 * employment → self-employment → other → capital gains → eligible dividends → ineligible dividends
 *
 * For each stream, we calculate the incremental tax caused by adding that stream
 * to the stack, giving an approximate "effective rate" per stream.
 */
function calculatePerStreamAnalysis(
  input: MultiStreamInput,
  _totalTaxableIncome: number,
  province: Province,
  taxYear: number,
  marginalRates: MultiStreamResult['marginalRates']
): StreamAnalysis[] {
  const {
    employmentIncome, selfEmploymentIncome,
    capitalGains, eligibleDividends, ineligibleDividends,
    otherIncome, rrspDeduction, selfEmployedEIOpted,
  } = input;

  const isQuebec = province === 'QC';
  const streams: StreamAnalysis[] = [];

  // Build the stacking order with taxable amounts for each stream
  const stackItems: {
    type: StreamAnalysis['type'];
    actualAmount: number;
    taxableAmount: number;
  }[] = [];

  // Self-employment CPP deduction (calculated same as in main function)
  const totalPensionable = employmentIncome + selfEmploymentIncome;
  const empCPP = employmentIncome > 0 ? calculateCPP(employmentIncome, taxYear, province) : 0;
  const totalCPPCombined = calculateCPP(totalPensionable, taxYear, province);
  const seCPPEmployee = round2(Math.max(0, totalCPPCombined - empCPP));
  const cpp2OnEmp = employmentIncome > 0 ? calculateCPP2(employmentIncome, taxYear) : 0;
  const cpp2Combined = calculateCPP2(totalPensionable, taxYear);
  const cpp2SeHalf = round2(Math.max(0, cpp2Combined - cpp2OnEmp));
  const seDeduction = round2(seCPPEmployee + cpp2SeHalf);

  if (employmentIncome > 0) {
    stackItems.push({ type: 'employment', actualAmount: employmentIncome, taxableAmount: employmentIncome });
  }
  if (selfEmploymentIncome > 0) {
    stackItems.push({ type: 'selfEmployment', actualAmount: selfEmploymentIncome, taxableAmount: round2(selfEmploymentIncome - seDeduction) });
  }
  if (otherIncome > 0) {
    stackItems.push({ type: 'other', actualAmount: otherIncome, taxableAmount: otherIncome });
  }
  if (capitalGains > 0) {
    stackItems.push({ type: 'capitalGains', actualAmount: capitalGains, taxableAmount: calculateTaxableCapitalGains(capitalGains).taxableAmount });
  }
  if (eligibleDividends > 0) {
    stackItems.push({ type: 'eligibleDividends', actualAmount: eligibleDividends, taxableAmount: grossUpEligibleDividends(eligibleDividends).taxableAmount });
  }
  if (ineligibleDividends > 0) {
    stackItems.push({ type: 'ineligibleDividends', actualAmount: ineligibleDividends, taxableAmount: grossUpIneligibleDividends(ineligibleDividends).taxableAmount });
  }

  // Apply RRSP deduction proportionally to reduce the first streams
  // For simplicity, subtract RRSP from the cumulative taxable income calculation
  let rrspRemaining = rrspDeduction;

  // Calculate incremental tax for each stream in stacking order
  let cumulativeTaxable = 0;
  let previousTax = 0;

  for (const item of stackItems) {
    let streamTaxable = item.taxableAmount;

    // Apply remaining RRSP deduction to this stream
    if (rrspRemaining > 0) {
      const deductFromStream = Math.min(rrspRemaining, streamTaxable);
      streamTaxable = round2(streamTaxable - deductFromStream);
      rrspRemaining = round2(rrspRemaining - deductFromStream);
    }

    cumulativeTaxable = round2(cumulativeTaxable + streamTaxable);

    // Calculate total income tax at current cumulative level
    const currentTax = calculateIncomeTaxOnly(cumulativeTaxable, province, taxYear, isQuebec, item.type, cumulativeTaxable, input);
    const incrementalTax = round2(Math.max(0, currentTax - previousTax));

    const effectiveRate = item.actualAmount > 0
      ? round2((incrementalTax / item.actualAmount) * 100)
      : 0;

    // Marginal rate for this stream type
    let streamMarginalRate = 0;
    switch (item.type) {
      case 'employment':
      case 'selfEmployment':
      case 'other':
        streamMarginalRate = round4(marginalRates.ordinary * 100);
        break;
      case 'capitalGains':
        streamMarginalRate = round4(marginalRates.capitalGains * 100);
        break;
      case 'eligibleDividends':
        streamMarginalRate = round4(marginalRates.eligibleDividends * 100);
        break;
      case 'ineligibleDividends':
        streamMarginalRate = round4(marginalRates.ineligibleDividends * 100);
        break;
    }

    streams.push({
      type: item.type,
      actualAmount: item.actualAmount,
      taxableAmount: item.taxableAmount,
      effectiveRate,
      marginalRate: streamMarginalRate,
    });

    previousTax = currentTax;
  }

  return streams;
}

/**
 * Calculate income tax only (federal + provincial, with DTCs) for a given taxable income.
 * Used for per-stream incremental tax calculation.
 */
function calculateIncomeTaxOnly(
  taxableIncome: number,
  province: Province,
  taxYear: number,
  isQuebec: boolean,
  currentStreamType: StreamAnalysis['type'],
  cumulativeTaxable: number,
  input: MultiStreamInput
): number {
  if (taxableIncome <= 0) return 0;

  const federalData = FEDERAL_BRACKETS_2026;

  // Federal tax
  const { total: grossFederal } = calculateProgressiveTax(taxableIncome, federalData.brackets);
  const bpa = calculateFederalBPA(taxableIncome, taxYear);
  const lowestRate = federalData.brackets[0].rate;
  const bpaCredit = bpa * lowestRate;
  const ceaCredit = input.employmentIncome > 0 ? federalData.cea * lowestRate : 0;

  let federalTax = Math.max(0, grossFederal - bpaCredit - ceaCredit);
  if (isQuebec) {
    federalTax = federalTax * (1 - 0.165);
  }

  // Apply DTCs based on which dividend streams are included up to this point
  // We need to figure out how much DTC applies at this point in the stack
  const stackOrder: StreamAnalysis['type'][] = ['employment', 'selfEmployment', 'other', 'capitalGains', 'eligibleDividends', 'ineligibleDividends'];
  const currentIndex = stackOrder.indexOf(currentStreamType);

  let fedDTC = 0;
  let provDTC = 0;

  // If eligible dividends are in the stack (at or before current position)
  if (currentIndex >= stackOrder.indexOf('eligibleDividends') && input.eligibleDividends > 0) {
    const eligGrossUp = grossUpEligibleDividends(input.eligibleDividends);
    const credits = calculateEligibleDividendCredits(eligGrossUp.taxableAmount, province);
    fedDTC += credits.federalDTC;
    provDTC += credits.provincialDTC;
  }

  // If ineligible dividends are in the stack
  if (currentIndex >= stackOrder.indexOf('ineligibleDividends') && input.ineligibleDividends > 0) {
    const ineligGrossUp = grossUpIneligibleDividends(input.ineligibleDividends);
    const credits = calculateIneligibleDividendCredits(ineligGrossUp.taxableAmount, province);
    fedDTC += credits.federalDTC;
    provDTC += credits.provincialDTC;
  }

  federalTax = Math.max(0, federalTax - fedDTC);

  // Provincial tax
  const provResult = calculateProvincialTax(taxableIncome, province, taxYear);
  let provincialTax = Math.max(0, provResult.tax - provDTC);

  return round2(federalTax + provincialTax + provResult.ontarioHealthPremium);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
