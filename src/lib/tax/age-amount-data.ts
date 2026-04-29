import type { Province } from './types';

/**
 * 2026 Federal Age Amount (CRA Line 30100).
 *
 * A non-refundable credit for individuals aged 65+ at December 31.
 * The amount is clawed back at 15% of net income above the threshold.
 *
 * Sources:
 * - CRA TD1 2026 Federal Personal Tax Credits Return
 * - TaxTips.ca — Age Amount Tax Credit
 * - KPMG 2026 Federal and Provincial Tax Credits
 */
export const FEDERAL_AGE_AMOUNT_2026 = {
  maxAmount: 9208,
  clawbackThreshold: 46432,
  clawbackRate: 0.15,
};

/**
 * 2026 Provincial/Territorial Age Amounts.
 *
 * Each province has its own age amount, clawback threshold, and clawback rate.
 * All provinces use 15% clawback except Quebec (18.75%).
 *
 * Quebec's age amount is calculated on Schedule B (Annexe B) together with
 * the retirement income amount and amount for a person living alone. The
 * clawback is based on net family income — for simplicity, we use individual
 * net income as an approximation.
 *
 * Sources:
 * - CRA TD1 forms for each province (2026 editions)
 * - Quebec Parameters of Personal Income Tax System 2026
 * - TaxTips.ca — 2026 Non-Refundable Tax Credits
 * - KPMG 2026 Provincial Tax Credit Rates and Amounts
 */
export const PROVINCIAL_AGE_AMOUNTS_2026: Record<Province, {
  maxAmount: number;
  clawbackThreshold: number;
  clawbackRate: number;
}> = {
  AB: { maxAmount: 6345,  clawbackThreshold: 47234, clawbackRate: 0.15 },
  BC: { maxAmount: 5927,  clawbackThreshold: 44119, clawbackRate: 0.15 },
  MB: { maxAmount: 3728,  clawbackThreshold: 27749, clawbackRate: 0.15 },
  NB: { maxAmount: 6158,  clawbackThreshold: 45844, clawbackRate: 0.15 },
  NL: { maxAmount: 7142,  clawbackThreshold: 39138, clawbackRate: 0.15 },
  NS: { maxAmount: 5826,  clawbackThreshold: 30828, clawbackRate: 0.15 },
  NT: { maxAmount: 9208,  clawbackThreshold: 46432, clawbackRate: 0.15 },
  NU: { maxAmount: 9208,  clawbackThreshold: 46432, clawbackRate: 0.15 },
  ON: { maxAmount: 6342,  clawbackThreshold: 47210, clawbackRate: 0.15 },
  PE: { maxAmount: 6510,  clawbackThreshold: 36600, clawbackRate: 0.15 },
  QC: { maxAmount: 3986,  clawbackThreshold: 42955, clawbackRate: 0.1875 },
  SK: { maxAmount: 5901,  clawbackThreshold: 43927, clawbackRate: 0.15 },
  YT: { maxAmount: 9208,  clawbackThreshold: 46432, clawbackRate: 0.15 },
};
