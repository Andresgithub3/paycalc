/**
 * Format a number as Canadian currency.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage.
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a rate as a percentage (input is decimal, e.g. 0.14 → "14.0%").
 */
export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
