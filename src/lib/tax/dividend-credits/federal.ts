/**
 * Federal Dividend Tax Credit rates for Canadian dividends.
 *
 * Eligible dividends: from public Canadian corporations (T5 Box 24)
 *   - Gross-up: 38% (taxable = actual x 1.38)
 *   - Federal DTC: 15.0198% of the grossed-up (taxable) amount
 *
 * Non-eligible (ineligible) dividends: from CCPCs (T5 Box 10)
 *   - Gross-up: 15% (taxable = actual x 1.15)
 *   - Federal DTC: 9.0301% of the grossed-up (taxable) amount
 */

export const ELIGIBLE_DIVIDEND_GROSS_UP_RATE = 0.38;
export const INELIGIBLE_DIVIDEND_GROSS_UP_RATE = 0.15;

export const FEDERAL_ELIGIBLE_DTC_RATE = 0.150198;
export const FEDERAL_INELIGIBLE_DTC_RATE = 0.090301;
