import type { Province, ProvincialTaxData } from '../types';

const AB_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 151234,  rate: 0.08 },
    { from: 151234,  to: 181169,  rate: 0.12 },
    { from: 181169,  to: 241225,  rate: 0.13 },
    { from: 241225,  to: 362834,  rate: 0.14 },
    { from: 362834,  to: null,    rate: 0.15 },
  ],
  bpa: 22769,
  notes: 'No provincial sales tax. Lowest overall tax burden for most income levels.',
};

const BC_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 47937,   rate: 0.0506 },
    { from: 47937,   to: 95875,   rate: 0.077 },
    { from: 95875,   to: 110076,  rate: 0.105 },
    { from: 110076,  to: 137849,  rate: 0.1229 },
    { from: 137849,  to: 190610,  rate: 0.147 },
    { from: 190610,  to: 259073,  rate: 0.168 },
    { from: 259073,  to: null,    rate: 0.205 },
  ],
  bpa: 12580,
  notes: '7 tax brackets — the most of any province.',
};

const MB_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 47564,   rate: 0.108 },
    { from: 47564,   to: 101200,  rate: 0.1275 },
    { from: 101200,  to: null,    rate: 0.174 },
  ],
  bpa: 15969,
  notes: 'Three tax brackets. Manitoba has a provincial sales tax of 7%.',
};

const NB_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 49958,   rate: 0.094 },
    { from: 49958,   to: 99916,   rate: 0.14 },
    { from: 99916,   to: 185064,  rate: 0.16 },
    { from: 185064,  to: null,    rate: 0.195 },
  ],
  bpa: 13044,
  notes: 'Bilingual province with four tax brackets.',
};

const NL_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 44192,   rate: 0.087 },
    { from: 44192,   to: 88382,   rate: 0.145 },
    { from: 88382,   to: 157792,  rate: 0.158 },
    { from: 157792,  to: 220910,  rate: 0.178 },
    { from: 220910,  to: 282214,  rate: 0.198 },
    { from: 282214,  to: 564429,  rate: 0.208 },
    { from: 564429,  to: 1128858, rate: 0.213 },
    { from: 1128858, to: null,    rate: 0.218 },
  ],
  bpa: 10818,
  notes: 'Eight tax brackets with a temporary deficit reduction levy baked into rates.',
};

const NS_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 29590,   rate: 0.0879 },
    { from: 29590,   to: 59180,   rate: 0.1495 },
    { from: 59180,   to: 93000,   rate: 0.1667 },
    { from: 93000,   to: 150000,  rate: 0.175 },
    { from: 150000,  to: null,    rate: 0.21 },
  ],
  bpa: 8481,
  notes: 'Five tax brackets. Nova Scotia has relatively high provincial tax rates.',
};

const NT_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 50597,   rate: 0.059 },
    { from: 50597,   to: 101198,  rate: 0.086 },
    { from: 101198,  to: 164525,  rate: 0.122 },
    { from: 164525,  to: null,    rate: 0.1405 },
  ],
  bpa: 17373,
  notes: 'Four tax brackets. Northern residents receive additional deductions.',
};

const NU_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 53268,   rate: 0.04 },
    { from: 53268,   to: 106537,  rate: 0.07 },
    { from: 106537,  to: 173205,  rate: 0.09 },
    { from: 173205,  to: null,    rate: 0.115 },
  ],
  bpa: 18767,
  notes: 'Four tax brackets. Lowest provincial rates in Canada. Northern residents deduction applies.',
};

const ON_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 52886,   rate: 0.0505 },
    { from: 52886,   to: 105775,  rate: 0.0915 },
    { from: 105775,  to: 150000,  rate: 0.1116 },
    { from: 150000,  to: 220000,  rate: 0.1216 },
    { from: 220000,  to: null,    rate: 0.1316 },
  ],
  bpa: 11865,
  hasHealthPremium: true,
  hasSurtax: true,
  notes: 'Ontario Health Premium applies on income over $20K. Surtax applies to higher earners.',
};

const PE_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 33328,   rate: 0.095 },
    { from: 33328,   to: 64656,   rate: 0.1347 },
    { from: 64656,   to: 105000,  rate: 0.166 },
    { from: 105000,  to: 140000,  rate: 0.178 },
    { from: 140000,  to: null,    rate: 0.19 },
  ],
  bpa: 13500,
  notes: 'Five tax brackets. PEI has a surtax on provincial tax over $12,500.',
};

const QC_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 53255,   rate: 0.14 },
    { from: 53255,   to: 106510,  rate: 0.19 },
    { from: 106510,  to: 129590,  rate: 0.24 },
    { from: 129590,  to: null,    rate: 0.2575 },
  ],
  bpa: 18571,
  usesQPP: true,
  usesQPIP: true,
  federalAbatement: 0.165,
  notes: 'Quebec has its own pension plan (QPP) and parental insurance (QPIP). Residents receive a 16.5% federal tax abatement.',
};

const SK_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 53463,   rate: 0.105 },
    { from: 53463,   to: 152750,  rate: 0.125 },
    { from: 152750,  to: null,    rate: 0.145 },
  ],
  bpa: 18491,
  notes: 'Three tax brackets. Saskatchewan has a provincial sales tax of 6%.',
};

const YT_2026: ProvincialTaxData = {
  brackets: [
    { from: 0,       to: 58523,   rate: 0.064 },
    { from: 58523,   to: 117045,  rate: 0.09 },
    { from: 117045,  to: 181440,  rate: 0.109 },
    { from: 181440,  to: 500000,  rate: 0.128 },
    { from: 500000,  to: null,    rate: 0.15 },
  ],
  bpa: 16452,
  notes: 'Five tax brackets mirroring federal thresholds. Northern residents deduction applies.',
};

export const PROVINCIAL_TAX_DATA_2026: Record<Province, ProvincialTaxData> = {
  AB: AB_2026,
  BC: BC_2026,
  MB: MB_2026,
  NB: NB_2026,
  NL: NL_2026,
  NS: NS_2026,
  NT: NT_2026,
  NU: NU_2026,
  ON: ON_2026,
  PE: PE_2026,
  QC: QC_2026,
  SK: SK_2026,
  YT: YT_2026,
};
