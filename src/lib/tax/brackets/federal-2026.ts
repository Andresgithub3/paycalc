import type { FederalTaxData, CPPData, CPP2Data, EIData, QPIPData } from '../types';

export const FEDERAL_BRACKETS_2026: FederalTaxData = {
  brackets: [
    { from: 0,       to: 58523,   rate: 0.14 },
    { from: 58523,   to: 117045,  rate: 0.205 },
    { from: 117045,  to: 181440,  rate: 0.26 },
    { from: 181440,  to: 258482,  rate: 0.29 },
    { from: 258482,  to: null,    rate: 0.33 },
  ],
  bpa: {
    max: 16452,
    min: 14829,
    phaseOutStart: 181440,
    phaseOutEnd: 258482,
  },
  cea: 1501,
};

export const CPP_2026: CPPData = {
  basicExemption: 3500,
  ympe: 74600,
  rate: 0.0595,
  maxContribution: 4230.45,
};

export const CPP2_2026: CPP2Data = {
  yampe: 85000,
  rate: 0.04,
  maxContribution: 416.00,
};

export const EI_2026: EIData = {
  maxInsurableEarnings: 68900,
  rate: 0.0163,
  maxPremium: 1123.07,
};

export const EI_QUEBEC_2026: EIData = {
  maxInsurableEarnings: 68900,
  rate: 0.01295,
  maxPremium: 892.46,
};

export const QPIP_2026: QPIPData = {
  maxInsurableEarnings: 98000,
  rate: 0.00494,
  maxPremium: 484.12,
};
