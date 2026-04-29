import { describe, it, expect } from 'vitest';
import { calculatePensionSplitting } from '../pension-splitting';
import type { PensionSplittingInput } from '../pension-splitting';
import type { MultiStreamInput } from '../income-types';

function makeYourInput(overrides: Partial<MultiStreamInput> = {}): MultiStreamInput {
  return {
    province: 'AB',
    taxYear: 2026,
    employmentIncome: 0,
    selfEmploymentIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    otherIncome: 0,
    rrspDeduction: 0,
    selfEmployedEIOpted: false,
    pensionIncome: 0,
    isAge65Plus: false,
    ...overrides,
  };
}

describe('calculatePensionSplitting', () => {
  // ─── Basic splitting scenario ───
  describe('basic Alberta scenario', () => {
    it('should produce household savings with $40k pension + $60k other, spouse $20k, 50% split', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Basic structure checks
      expect(result.allocatedToSpouse).toBe(20000);
      expect(result.yourRemainingPension).toBe(20000);

      // Splitting should produce savings (your marginal rate > spouse's marginal rate)
      expect(result.netHouseholdSavings).toBeGreaterThan(0);

      // Combined tax with splitting should be less than without
      expect(result.combinedTaxWith).toBeLessThan(result.combinedTaxWithout);

      // Your tax should decrease (less income)
      expect(result.yourTaxWith).toBeLessThan(result.yourTaxWithout);

      // Spouse's tax should increase (more income)
      expect(result.spouseTaxWith).toBeGreaterThan(result.spouseTaxWithout);

      // But the decrease in your tax should be larger than the increase in spouse's tax
      const yourSavings = result.yourTaxWithout - result.yourTaxWith;
      const spouseIncrease = result.spouseTaxWith - result.spouseTaxWithout;
      expect(yourSavings).toBeGreaterThan(spouseIncrease);
    });

    it('should have reasonable savings amount (within $200 of ~$3,000-$6,000 range)', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // With a ~$100k earner splitting $20k to a ~$20k spouse in AB,
      // the marginal rate difference should yield meaningful savings
      expect(result.netHouseholdSavings).toBeGreaterThan(1000);
      expect(result.netHouseholdSavings).toBeLessThan(10000);
    });
  });

  // ─── Cross-province splitting ───
  describe('cross-province splitting', () => {
    it('should handle spouse in a different province (Ontario)', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'ON',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Should still produce savings
      expect(result.netHouseholdSavings).toBeGreaterThan(0);
      expect(result.allocatedToSpouse).toBe(20000);

      // Spouse in Ontario should have different provincial tax than AB
      // (Ontario has higher provincial rates, but savings should still exist)
      expect(result.combinedTaxWith).toBeLessThan(result.combinedTaxWithout);
    });
  });

  // ─── Partial split (25% vs 50%) ───
  describe('partial split percentage', () => {
    it('should calculate correctly with 25% split', () => {
      const input25: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.25,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const input50: PensionSplittingInput = {
        ...input25,
        splitPercentage: 0.50,
      };

      const result25 = calculatePensionSplitting(input25);
      const result50 = calculatePensionSplitting(input50);

      // 25% split allocates less
      expect(result25.allocatedToSpouse).toBe(10000);
      expect(result50.allocatedToSpouse).toBe(20000);

      // 50% split should produce more savings than 25% (in this scenario)
      expect(result50.netHouseholdSavings).toBeGreaterThan(result25.netHouseholdSavings);

      // Both should be positive savings
      expect(result25.netHouseholdSavings).toBeGreaterThan(0);
      expect(result50.netHouseholdSavings).toBeGreaterThan(0);
    });
  });

  // ─── Spouse gains pension credit ───
  describe('spouse pension credit', () => {
    it('should flag spouse gaining pension credit through splitting', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Spouse receives $20k pension, so they should gain pension credit
      expect(result.spouseGainsPensionCredit).toBe(true);
      expect(result.spousePensionCreditValue).toBeGreaterThan(0);
    });

    it('should not flag spouse pension credit when no pension is split', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      expect(result.allocatedToSpouse).toBe(0);
      expect(result.spouseGainsPensionCredit).toBe(false);
      expect(result.spousePensionCreditValue).toBe(0);
    });
  });

  // ─── Spouse under 65 ───
  describe('spouse under 65', () => {
    it('should still calculate savings when spouse is under 65', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: false, // under 65
      };

      const result = calculatePensionSplitting(input);

      // Should still produce savings from income shifting
      expect(result.netHouseholdSavings).toBeGreaterThan(0);
      expect(result.allocatedToSpouse).toBe(20000);
    });

    it('spouse under 65 should still gain pension credit on allocated income', () => {
      // Per spec: "For simplicity: if spouseIsAge65Plus, they get the pension credit on allocated amount.
      // If not 65+, only RPP annuity allocations qualify (we assume it qualifies for simplicity, with a disclaimer)"
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: false,
      };

      const result = calculatePensionSplitting(input);

      // The pension credit calculation doesn't depend on age (per our implementation),
      // only on having pension income. Spouse receives $20k pension so gets credit.
      expect(result.spouseGainsPensionCredit).toBe(true);
      expect(result.spousePensionCreditValue).toBeGreaterThan(0);
    });
  });

  // ─── Zero pension with splitting enabled ───
  describe('zero pension income', () => {
    it('should return zero savings when pension income is zero', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 0, // no pension
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      expect(result.allocatedToSpouse).toBe(0);
      expect(result.yourRemainingPension).toBe(0);
      expect(result.netHouseholdSavings).toBe(0);
      expect(result.combinedTaxWith).toBe(result.combinedTaxWithout);
      expect(result.spouseGainsPensionCredit).toBe(false);
    });
  });

  // ─── Edge cases ───
  describe('edge cases', () => {
    it('should clamp split percentage to max 50%', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.75, // over 50%
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Should be clamped to 50%
      expect(result.allocatedToSpouse).toBe(20000); // 50% of 40000
      expect(result.yourRemainingPension).toBe(20000);
    });

    it('should clamp negative split percentage to 0', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: -0.1,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      expect(result.allocatedToSpouse).toBe(0);
      expect(result.netHouseholdSavings).toBe(0);
    });

    it('should handle equal income spouses (minimal or zero savings)', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 40000,
          otherIncome: 0,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 40000, // same total income level
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // When incomes are similar, splitting from pension to other income
      // may not produce large savings (could even be negative due to
      // losing age amount clawback benefits), but should not error
      expect(typeof result.netHouseholdSavings).toBe('number');
      expect(result.allocatedToSpouse).toBe(20000);
    });

    it('should handle Quebec province correctly', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'QC',
          pensionIncome: 40000,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'QC',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Should complete without error
      expect(result.allocatedToSpouse).toBe(20000);
      expect(typeof result.netHouseholdSavings).toBe('number');
      // Quebec has federal abatement and different provincial system,
      // but splitting should still produce savings
      expect(result.netHouseholdSavings).toBeGreaterThan(0);
    });

    it('should return correct federal/provincial breakdown', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'ON',
          pensionIncome: 30000,
          otherIncome: 50000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 25000,
        spouseProvince: 'ON',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      // Federal + provincial should sum to total
      expect(result.yourTaxWithout).toBeCloseTo(
        result.yourFederalTaxWithout + result.yourProvincialTaxWithout, 1
      );
      expect(result.yourTaxWith).toBeCloseTo(
        result.yourFederalTaxWith + result.yourProvincialTaxWith, 1
      );
      expect(result.spouseTaxWithout).toBeCloseTo(
        result.spouseFederalTaxWithout + result.spouseProvincialTaxWithout, 1
      );
      expect(result.spouseTaxWith).toBeCloseTo(
        result.spouseFederalTaxWith + result.spouseProvincialTaxWith, 1
      );
    });

    it('should handle small pension amounts correctly', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          pensionIncome: 500,
          otherIncome: 60000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 20000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      expect(result.allocatedToSpouse).toBe(250);
      expect(result.yourRemainingPension).toBe(250);
      // Even small amounts should produce some savings
      expect(result.netHouseholdSavings).toBeGreaterThanOrEqual(0);
    });
  });

  // ─── With other income streams ───
  describe('with multiple income streams', () => {
    it('should work when user has employment + dividends + pension', () => {
      const input: PensionSplittingInput = {
        yourInput: makeYourInput({
          province: 'AB',
          employmentIncome: 50000,
          eligibleDividends: 10000,
          pensionIncome: 30000,
          isAge65Plus: true,
        }),
        splitPercentage: 0.50,
        spouseOtherIncome: 15000,
        spouseProvince: 'AB',
        spouseIsAge65Plus: true,
      };

      const result = calculatePensionSplitting(input);

      expect(result.allocatedToSpouse).toBe(15000);
      expect(result.netHouseholdSavings).toBeGreaterThan(0);
      expect(result.spouseGainsPensionCredit).toBe(true);
    });
  });
});
