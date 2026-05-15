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
  solveSalaryFromBudget,
  totalEmployerCost,
  evaluateMix,
} from './structure-compare';
export { calculateContractorEquivalent } from './contractor';
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
  ContractorInput,
  ContractorResult,
} from './types';
