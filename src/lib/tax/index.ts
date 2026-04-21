export { calculateTax } from './engine';
export { calculateCorporateTax } from './corporate';
export { calculateDividendTax } from './dividends';
export {
  calculateSalaried,
  calculateSoleProp,
  calculateCCPCSalary,
  calculateCCPCDividend,
  calculateCCPCOptimal,
  compareAllStructures,
} from './structure-compare';
export type {
  CalculatorInput,
  TaxBreakdown,
  BracketDetail,
  Province,
  InputMode,
  TaxYear,
  StructureInput,
  StructureResult,
  CorporateTaxResult,
  DividendTaxResult,
} from './types';
