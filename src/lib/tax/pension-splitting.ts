import type { Province, TaxYear } from './types';
import type { MultiStreamInput, MultiStreamResult } from './income-types';
import { calculateMultiStreamTax } from './multi-stream-engine';
import { calculatePensionIncomeCredit } from './pension-credit';

/**
 * Input for the pension income splitting analysis.
 */
export interface PensionSplittingInput {
  /** Your full multi-stream input (all income streams including pensionIncome) */
  yourInput: MultiStreamInput;
  /** Percentage to allocate to spouse (0 to 0.50) */
  splitPercentage: number;
  /** Spouse's other taxable income (employment, pensions, investments, etc.) */
  spouseOtherIncome: number;
  /** Spouse's province of residence */
  spouseProvince: Province;
  /** Whether the spouse is 65+ at December 31 */
  spouseIsAge65Plus: boolean;
}

/**
 * Result of the pension income splitting analysis.
 * Compares household taxes with and without splitting.
 */
export interface PensionSplittingResult {
  /** Dollar amount of pension allocated to spouse */
  allocatedToSpouse: number;
  /** Pension income retained by the transferring spouse */
  yourRemainingPension: number;

  // WITHOUT splitting
  yourTaxWithout: number;
  yourFederalTaxWithout: number;
  yourProvincialTaxWithout: number;
  spouseTaxWithout: number;
  spouseFederalTaxWithout: number;
  spouseProvincialTaxWithout: number;
  combinedTaxWithout: number;

  // WITH splitting
  yourTaxWith: number;
  yourFederalTaxWith: number;
  yourProvincialTaxWith: number;
  spouseTaxWith: number;
  spouseFederalTaxWith: number;
  spouseProvincialTaxWith: number;
  combinedTaxWith: number;

  // Savings
  /** Positive = money saved by splitting */
  netHouseholdSavings: number;

  /** Whether the spouse gains a pension income credit through splitting */
  spouseGainsPensionCredit: boolean;
  /** Value of the spouse's pension income credit (federal + provincial) */
  spousePensionCreditValue: number;
}

/**
 * Calculate the tax impact of pension income splitting.
 *
 * Runs the full multi-stream engine FOUR times:
 * 1. Your tax WITHOUT splitting (full pension)
 * 2. Spouse's tax WITHOUT splitting (no pension from you)
 * 3. Your tax WITH splitting (reduced pension)
 * 4. Spouse's tax WITH splitting (receives allocated pension)
 *
 * @returns Comparison of household taxes with and without splitting
 */
export function calculatePensionSplitting(
  input: PensionSplittingInput,
): PensionSplittingResult {
  const {
    yourInput,
    splitPercentage,
    spouseOtherIncome,
    spouseProvince,
    spouseIsAge65Plus,
  } = input;

  const pensionIncome = yourInput.pensionIncome;
  const clampedSplit = Math.max(0, Math.min(0.5, splitPercentage));
  const allocatedToSpouse = round2(pensionIncome * clampedSplit);
  const yourRemainingPension = round2(pensionIncome - allocatedToSpouse);

  // ─── Scenario 1: Your tax WITHOUT splitting ───
  const yourResultWithout = calculateMultiStreamTax(yourInput);

  // ─── Scenario 2: Spouse's tax WITHOUT splitting ───
  const spouseInputWithout = makeSpouseInput(
    spouseOtherIncome,
    0, // no pension from splitting
    spouseProvince,
    yourInput.taxYear,
    spouseIsAge65Plus,
  );
  const spouseResultWithout = calculateMultiStreamTax(spouseInputWithout);

  // ─── Scenario 3: Your tax WITH splitting ───
  const yourInputWith: MultiStreamInput = {
    ...yourInput,
    pensionIncome: yourRemainingPension,
  };
  const yourResultWith = calculateMultiStreamTax(yourInputWith);

  // ─── Scenario 4: Spouse's tax WITH splitting ───
  const spouseInputWith = makeSpouseInput(
    spouseOtherIncome,
    allocatedToSpouse,
    spouseProvince,
    yourInput.taxYear,
    spouseIsAge65Plus,
  );
  const spouseResultWith = calculateMultiStreamTax(spouseInputWith);

  // ─── Extract tax components ───
  const yourFederalTaxWithout = yourResultWithout.federalTax;
  const yourProvincialTaxWithout = yourResultWithout.provincialTax;
  const yourTaxWithout = round2(yourFederalTaxWithout + yourProvincialTaxWithout);

  const spouseFederalTaxWithout = spouseResultWithout.federalTax;
  const spouseProvincialTaxWithout = spouseResultWithout.provincialTax;
  const spouseTaxWithout = round2(spouseFederalTaxWithout + spouseProvincialTaxWithout);

  const combinedTaxWithout = round2(yourTaxWithout + spouseTaxWithout);

  const yourFederalTaxWith = yourResultWith.federalTax;
  const yourProvincialTaxWith = yourResultWith.provincialTax;
  const yourTaxWith = round2(yourFederalTaxWith + yourProvincialTaxWith);

  const spouseFederalTaxWith = spouseResultWith.federalTax;
  const spouseProvincialTaxWith = spouseResultWith.provincialTax;
  const spouseTaxWith = round2(spouseFederalTaxWith + spouseProvincialTaxWith);

  const combinedTaxWith = round2(yourTaxWith + spouseTaxWith);

  const netHouseholdSavings = round2(combinedTaxWithout - combinedTaxWith);

  // ─── Spouse pension credit analysis ───
  // The spouse gains a pension credit if they receive allocated pension
  // and their pension credit "with" is greater than "without"
  const spousePensionCreditWith = spouseResultWith.pensionCreditFederal + spouseResultWith.pensionCreditProvincial;
  const spousePensionCreditWithout = spouseResultWithout.pensionCreditFederal + spouseResultWithout.pensionCreditProvincial;
  const spouseGainsPensionCredit = allocatedToSpouse > 0 && spousePensionCreditWith > spousePensionCreditWithout;
  const spousePensionCreditValue = round2(Math.max(0, spousePensionCreditWith - spousePensionCreditWithout));

  return {
    allocatedToSpouse,
    yourRemainingPension,

    yourTaxWithout,
    yourFederalTaxWithout,
    yourProvincialTaxWithout,
    spouseTaxWithout,
    spouseFederalTaxWithout,
    spouseProvincialTaxWithout,
    combinedTaxWithout,

    yourTaxWith,
    yourFederalTaxWith,
    yourProvincialTaxWith,
    spouseTaxWith,
    spouseFederalTaxWith,
    spouseProvincialTaxWith,
    combinedTaxWith,

    netHouseholdSavings,
    spouseGainsPensionCredit,
    spousePensionCreditValue,
  };
}

/**
 * Create a minimal MultiStreamInput for the spouse.
 * Spouse's "other income" is treated as otherIncome (interest, rental, etc.).
 * Allocated pension (if any) goes into pensionIncome.
 */
function makeSpouseInput(
  otherIncome: number,
  pensionIncome: number,
  province: Province,
  taxYear: TaxYear,
  isAge65Plus: boolean,
): MultiStreamInput {
  return {
    province,
    taxYear,
    employmentIncome: 0,
    selfEmploymentIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    otherIncome,
    rrspDeduction: 0,
    selfEmployedEIOpted: false,
    pensionIncome,
    isAge65Plus,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
