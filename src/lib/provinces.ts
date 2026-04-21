import type { Province } from './tax/types';

export interface ProvinceInfo {
  code: Province;
  slug: string;
  minimumWage: number;
  minimumWageEffective: string;
  population: string;
  capital: string;
}

export const PROVINCE_SLUGS: Record<string, Province> = {
  'alberta': 'AB',
  'british-columbia': 'BC',
  'manitoba': 'MB',
  'new-brunswick': 'NB',
  'newfoundland-and-labrador': 'NL',
  'nova-scotia': 'NS',
  'northwest-territories': 'NT',
  'nunavut': 'NU',
  'ontario': 'ON',
  'prince-edward-island': 'PE',
  'quebec': 'QC',
  'saskatchewan': 'SK',
  'yukon': 'YT',
};

export const PROVINCE_TO_SLUG: Record<Province, string> = Object.fromEntries(
  Object.entries(PROVINCE_SLUGS).map(([slug, code]) => [code, slug])
) as Record<Province, string>;

export const PROVINCE_DATA: Record<Province, ProvinceInfo> = {
  AB: {
    code: 'AB',
    slug: 'alberta',
    minimumWage: 15.00,
    minimumWageEffective: '2019-10-01',
    population: '4.8M',
    capital: 'Edmonton',
  },
  BC: {
    code: 'BC',
    slug: 'british-columbia',
    minimumWage: 17.85,
    minimumWageEffective: '2024-06-01',
    population: '5.4M',
    capital: 'Victoria',
  },
  MB: {
    code: 'MB',
    slug: 'manitoba',
    minimumWage: 15.80,
    minimumWageEffective: '2024-10-01',
    population: '1.4M',
    capital: 'Winnipeg',
  },
  NB: {
    code: 'NB',
    slug: 'new-brunswick',
    minimumWage: 15.30,
    minimumWageEffective: '2024-04-01',
    population: '0.8M',
    capital: 'Fredericton',
  },
  NL: {
    code: 'NL',
    slug: 'newfoundland-and-labrador',
    minimumWage: 15.60,
    minimumWageEffective: '2024-04-01',
    population: '0.5M',
    capital: "St. John's",
  },
  NS: {
    code: 'NS',
    slug: 'nova-scotia',
    minimumWage: 15.20,
    minimumWageEffective: '2024-04-01',
    population: '1.0M',
    capital: 'Halifax',
  },
  NT: {
    code: 'NT',
    slug: 'northwest-territories',
    minimumWage: 16.70,
    minimumWageEffective: '2024-09-01',
    population: '0.04M',
    capital: 'Yellowknife',
  },
  NU: {
    code: 'NU',
    slug: 'nunavut',
    minimumWage: 19.00,
    minimumWageEffective: '2024-01-01',
    population: '0.04M',
    capital: 'Iqaluit',
  },
  ON: {
    code: 'ON',
    slug: 'ontario',
    minimumWage: 17.20,
    minimumWageEffective: '2024-10-01',
    population: '15.4M',
    capital: 'Toronto',
  },
  PE: {
    code: 'PE',
    slug: 'prince-edward-island',
    minimumWage: 15.40,
    minimumWageEffective: '2024-04-01',
    population: '0.17M',
    capital: 'Charlottetown',
  },
  QC: {
    code: 'QC',
    slug: 'quebec',
    minimumWage: 15.75,
    minimumWageEffective: '2024-05-01',
    population: '8.8M',
    capital: 'Quebec City',
  },
  SK: {
    code: 'SK',
    slug: 'saskatchewan',
    minimumWage: 15.00,
    minimumWageEffective: '2024-10-01',
    population: '1.2M',
    capital: 'Regina',
  },
  YT: {
    code: 'YT',
    slug: 'yukon',
    minimumWage: 17.59,
    minimumWageEffective: '2024-04-01',
    population: '0.04M',
    capital: 'Whitehorse',
  },
};

export const ALL_PROVINCE_CODES: Province[] = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];
