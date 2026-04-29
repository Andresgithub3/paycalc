import type { Province } from '../types';

/**
 * Provincial Dividend Tax Credit rates for 2026.
 * All rates are expressed as a percentage of the grossed-up (taxable) dividend amount.
 *
 * Sources: TaxTips.ca, CRA Form 428, provincial government publications.
 * Verified for 2026 tax year.
 */

/** Provincial DTC rates for ELIGIBLE dividends (% of taxable/grossed-up dividend) */
export const PROVINCIAL_ELIGIBLE_DTC_RATES: Record<Province, number> = {
  AB: 0.0812,   // 8.12% — reduced from 10% effective 2021 (AB 2019 Budget / June 2020 Recovery Plan)
  BC: 0.12,     // 12.00% — increased from 10% effective Jan 1, 2019 (Sept 2017 Budget)
  MB: 0.08,     // 8.00% — since 2012 Budget
  NB: 0.14,     // 14.00% — effective Jan 1, 2019 (NB Dept of Finance)
  NL: 0.063,    // 6.30% — increased from 5.4% in 2022
  NS: 0.0885,   // 8.85% — per Bill 27, Financial Measures 2011 Act
  NT: 0.115,    // 11.50% — since 2011
  NU: 0.0551,   // 5.51% — 20% of federal gross-up (0.20 x 0.38/1.38)
  ON: 0.10,     // 10.00% — legislatively 36.3158% of the gross-up
  PE: 0.105,    // 10.50%
  QC: 0.117,    // 11.70% — Revenu Quebec expresses as 16.146% of actual eligible dividend
  SK: 0.11,     // 11.00% — since 2018 (Bill 84)
  YT: 0.1202,   // 12.02%
};

/** Provincial DTC rates for INELIGIBLE (non-eligible) dividends (% of taxable/grossed-up dividend) */
export const PROVINCIAL_INELIGIBLE_DTC_RATES: Record<Province, number> = {
  AB: 0.0218,     // 2.18%
  BC: 0.0196,     // 1.96%
  MB: 0.007835,   // 0.7835%
  NB: 0.0275,     // 2.75% — effective Jan 1, 2019
  NL: 0.032,      // 3.20%
  NS: 0.015,      // 1.50% — reduced from 2.99% in 2025 Budget (Bill 68)
  NT: 0.06,       // 6.00%
  NU: 0.0261,     // 2.61% — 20% of federal gross-up (0.20 x 0.15/1.15)
  ON: 0.029863,   // 2.9863% — will decrease to 1.9863% effective Jan 1, 2027
  PE: 0.013,      // 1.30%
  QC: 0.0342,     // 3.42%
  SK: 0.02519,    // 2.519% — SK Affordability Act (Dec 2024) cancelled planned increases
  YT: 0.0067,     // 0.67% — YT small business rate is 0%
};
