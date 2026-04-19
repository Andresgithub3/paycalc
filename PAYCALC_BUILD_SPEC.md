# PayCalc.ca Build Spec — for Claude Code

You are helping me (Andres) build and ship **PayCalc.ca**, a fast, modern, bilingual (English/French) Canadian salary and income tax calculator with full tax breakdowns across all 13 provinces and territories. This document is your single source of truth for the build. Read it fully before writing any code.

---

## 0. How You Should Operate

- **Use TodoWrite** to break this spec into tracked tasks. Update status as you go.
- **Use available skills proactively.** Before writing UI code, read the `frontend-design` skill. Before deployment or product questions, check the `product-self-knowledge` skill.
- **Use MCPs I have configured.** If Google Stitch MCP, shadcn, Vercel, GitHub, or other MCPs are available, use them for component generation, deployment, and repo management.
- **Pause for manual steps.** When I need to do something outside the codebase (register a domain, create an account, paste an API key, configure DNS, sign up for AdSense, etc.), STOP, output a clearly-labeled `MANUAL STEP REQUIRED` block with exact instructions (URL to visit, fields to fill, what to paste back), and wait for me to confirm before continuing.
- **Do not invent secrets.** Never hardcode API keys, AdSense publisher IDs, or analytics IDs. Use `.env.local` and provide a `.env.example` with placeholders.
- **Test the math.** The tax calculation engine is the core of this product. Every bracket, rate, and formula must have unit tests verified against known CRA examples. Run them before declaring features complete.
- **Commit logically.** Conventional commit messages (`feat:`, `chore:`, `docs:`, `test:`).

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | PayCalc |
| **Domain** | `paycalc.ca` (primary). Fallback: `takehomepay.ca`, `netpaycalc.ca`, `mysalarycalc.ca` |
| **Tagline (EN)** | "What's your real take-home pay?" |
| **Tagline (FR)** | "Quel est votre vrai salaire net?" |
| **One-liner (EN)** | "Convert salary ↔ hourly, see your federal + provincial tax breakdown, and compare take-home pay across all 13 Canadian provinces — instantly." |
| **One-liner (FR)** | "Convertissez salaire ↔ taux horaire, voyez votre ventilation d'impôts fédéral et provincial, et comparez le salaire net dans les 13 provinces canadiennes — instantanément." |
| **Voice** | Clear, trustworthy, empowering. Like a good accountant who explains things in plain language. Not corporate, not overly casual. Confident and precise. |
| **Audience** | Canadian employees, job seekers comparing offers, freelancers estimating net income, HR professionals, newcomers to Canada. Mobile-first — people check salary during job hunts on their phones. Both English and French-speaking Canadians. |
| **Reference site** | TurboTax Canada income tax calculator (https://turbotax.intuit.ca/tax-resources/canada-income-tax-calculator). Also: wowa.ca/salary-calculator, salarycalculator.ca, ca.talent.com/tax-calculator. |

### 1.1 Why "Pay" and not "Wage"

Research shows Canadians overwhelmingly use **"salary"**, **"take-home pay"**, **"income"**, and **"paycheque"** when referring to their compensation — not "wage." The CRA uses "salary" and "pay" in official documents. The most-searched terms in Canada are "salary calculator", "take home pay calculator", "income tax calculator", and "paycheque calculator." The word "wage" is primarily used in the context of "minimum wage" only. **PayCalc** is short, bilingual-neutral (works in both English and French contexts), and contains the high-value keyword "pay."

---

## 2. Strategic Context

PayCalc.ca is the fourth build in a portfolio of utility websites (CrispCalc, SlabCalc, DevFmt) monetized through display ads.

**Why a Canadian salary calculator?**
- Finance niche commands the highest ad CPM/RPM of any utility tool vertical ($15–$50 RPM on premium ad networks)
- Existing competitors (ca.talent.com, wowa.ca, salarycalculator.ca) are decent but none dominate the Canada-specific SEO space — and none offer bilingual French support alongside salary ↔ hourly conversion
- Provincial long-tail keywords ("salary calculator Alberta", "take home pay Ontario", "calculateur salaire Québec") have low competition
- 13 provinces/territories × multiple salary levels × 2 languages = hundreds of indexable pages
- I (Andres) am based in Edmonton, Alberta — genuine local authority for Alberta-specific content (E-E-A-T signal)
- Evergreen traffic: salary conversions searched year-round with spikes during job-hunting seasons (January, September) and tax season (February–April)
- The 2026 tax year brought significant changes (14% lowest bracket, new CPP2 ceilings) creating fresh search demand
- **Bilingual advantage:** ~22% of Canadians speak French as their first language. Almost no independent salary calculator serves them in French. This is a massive SEO gap.

**Targets:**
1. Launch with core converter + all 13 provincial calculators + comparison tool, in both EN and FR
2. Reach 15K monthly visits within 6 months via provincial long-tail SEO in both languages
3. Qualify for Raptive (25K pageviews threshold) within 9 months
4. Monetize with Google AdSense from day one

**Competitive edge over TurboTax calculator:**
- TurboTax doesn't offer salary ↔ hourly conversion — PayCalc does
- TurboTax is a lead-gen tool for their paid product — PayCalc is 100% free, no upsell
- TurboTax doesn't show a visual tax breakdown chart — PayCalc does
- TurboTax doesn't offer province-to-province comparison — PayCalc does
- TurboTax is English-only for the calculator — PayCalc is fully bilingual
- PayCalc loads faster (no TurboTax marketing bloat)

---

## 3. Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components by default, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (install with `npx shadcn@latest init`)
- **Icons:** lucide-react
- **Fonts:** Geist Sans + Geist Mono (via `next/font/google`)
- **Charts:** Recharts (for tax breakdown donut/bar charts)
- **i18n:** `next-intl` for internationalization (English + French)
- **Analytics:** Google Analytics 4 + Vercel Analytics
- **Search:** Google Search Console
- **Ads:** Google AdSense (Auto Ads + manually placed slots)
- **Hosting:** Vercel (production) — connect GitHub repo for CI/CD
- **Domain DNS:** Cloudflare (proxied) or Vercel DNS
- **Repo:** GitHub
- **Package manager:** pnpm

---

## 4. Design System

### 4.1 Brand Tokens

```
COLORS (light mode)
- background:        #FAFBFC
- foreground:        #111827
- primary:           #0D6E3F (PayCalc green — money, growth, trust)
- primary-foreground:#FFFFFF
- accent:            #DC2626 (Canadian red — maple leaf accent, used sparingly)
- muted:             #F3F4F6
- muted-foreground:  #6B7280
- border:            #E5E7EB
- success:           #059669 (for positive numbers / net income)
- warning:           #D97706 (for deduction highlights)
- destructive:       #B91C1C (for tax amounts / negative deltas)

COLORS (dark mode)
- background:        #0B0F14
- foreground:        #F9FAFB
- primary:           #10B981
- accent:            #EF4444
- muted:             #1F2937
- muted-foreground:  #9CA3AF
- border:            #2D3748

TYPOGRAPHY
- Display/H1:        Geist Sans, 700, tight tracking, 2.5–3.5rem
- Headings H2-H4:    Geist Sans, 600
- Body:              Geist Sans, 400, 1rem, 1.65 line-height
- Money/results:     Geist Mono, 600 (for all dollar amounts and percentages)
- Small labels:      Geist Sans, 500, 0.75rem, uppercase, tracking-wide

SPACING
- Tailwind defaults. Generous whitespace. 1.5rem section padding mobile, 4rem desktop.

RADIUS
- Calculator card: lg (1rem)
- Input fields: md (0.5rem)
- Badges/pills: full (9999px)

SHADOWS
- shadow-sm for cards, shadow-md on hover-elevated CTAs only
```

### 4.2 Visual Direction

- **Professional financial app vibe.** Think Wealthsimple's design language meets Stripe's clarity.
- **Results feel authoritative:** Large monospace numbers, clear currency formatting ($XX,XXX.XX), green for take-home pay, warm tones for deductions.
- **Tax breakdown visualization:** Stacked horizontal bar OR donut chart showing: Gross → Federal Tax → Provincial Tax → CPP → EI → Net Pay. Use Recharts.
- **Province selector:** Clean dropdown with province abbreviation badges. Province names display in the user's selected language.
- **No stock photos.** Clean, data-forward UI. The calculator IS the hero.
- **Canadian-flag red accent used sparingly** — only for the logo mark or a single accent stripe.
- **Consult the `frontend-design` skill** before building any UI.

---

## 5. Bilingual (EN/FR) Implementation

### 5.1 Architecture

Use `next-intl` with the App Router. The default locale is English. French is opt-in via a language toggle.

**URL structure:**
```
/en/...                English pages (default, canonical)
/fr/...                French pages
```

**Language toggle:** A button in the top-right of the navbar. Shows "FR" when viewing English (click to switch to French) and "EN" when viewing French (click to switch to English). Styled as a pill/badge, not a full dropdown. Uses the country flag or just the two-letter code.

**Middleware:** Use `next-intl` middleware to handle locale detection and routing. Default to English. Do NOT auto-redirect based on browser language — let the user choose explicitly via the toggle. Store preference in a cookie so it persists across visits.

### 5.2 Translation Files

```
/messages/
  en.json              — all English UI strings
  fr.json              — all French UI strings
```

Every single UI string must be in the translation files. No hardcoded English text in components.

**Key translation categories:**
- `common` — nav, footer, buttons, labels (Calculate, Copy, Share, etc.)
- `calculator` — input labels, result labels, tooltips, disclaimers
- `provinces` — full province names in both languages (e.g., "British Columbia" / "Colombie-Britannique")
- `deductions` — "Federal Tax" / "Impôt fédéral", "Provincial Tax" / "Impôt provincial", "CPP" / "RPC", "EI" / "AE", etc.
- `guides` — guide titles and content (MDX files per language)
- `meta` — page titles and descriptions for SEO in both languages

### 5.3 Province Names (Bilingual)

```typescript
const PROVINCE_NAMES = {
  AB: { en: 'Alberta', fr: 'Alberta' },
  BC: { en: 'British Columbia', fr: 'Colombie-Britannique' },
  MB: { en: 'Manitoba', fr: 'Manitoba' },
  NB: { en: 'New Brunswick', fr: 'Nouveau-Brunswick' },
  NL: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' },
  NS: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse' },
  NT: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' },
  NU: { en: 'Nunavut', fr: 'Nunavut' },
  ON: { en: 'Ontario', fr: 'Ontario' },
  PE: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' },
  QC: { en: 'Quebec', fr: 'Québec' },
  SK: { en: 'Saskatchewan', fr: 'Saskatchewan' },
  YT: { en: 'Yukon', fr: 'Yukon' },
};
```

### 5.4 Tax Term Translations

```typescript
const TAX_TERMS = {
  federalTax:       { en: 'Federal Tax', fr: 'Impôt fédéral' },
  provincialTax:    { en: 'Provincial Tax', fr: 'Impôt provincial' },
  cpp:              { en: 'CPP (Canada Pension Plan)', fr: 'RPC (Régime de pensions du Canada)' },
  cpp2:             { en: 'CPP2 (Enhanced)', fr: 'RPC2 (Bonification)' },
  qpp:              { en: 'QPP (Quebec Pension Plan)', fr: 'RRQ (Régime de rentes du Québec)' },
  ei:               { en: 'EI (Employment Insurance)', fr: 'AE (Assurance-emploi)' },
  qpip:             { en: 'QPIP (Quebec Parental Insurance)', fr: 'RQAP (Régime québécois d\'assurance parentale)' },
  grossIncome:      { en: 'Gross Income', fr: 'Revenu brut' },
  netIncome:        { en: 'Net Income (Take-Home Pay)', fr: 'Revenu net (Salaire net)' },
  totalDeductions:  { en: 'Total Deductions', fr: 'Déductions totales' },
  effectiveRate:    { en: 'Effective Tax Rate', fr: 'Taux d\'imposition effectif' },
  marginalRate:     { en: 'Marginal Tax Rate', fr: 'Taux d\'imposition marginal' },
  annual:           { en: 'Annual', fr: 'Annuel' },
  monthly:          { en: 'Monthly', fr: 'Mensuel' },
  biweekly:         { en: 'Bi-weekly', fr: 'Aux deux semaines' },
  weekly:           { en: 'Weekly', fr: 'Hebdomadaire' },
  hourly:           { en: 'Hourly', fr: 'Horaire' },
  salary:           { en: 'Salary', fr: 'Salaire' },
  taxBrackets:      { en: 'Tax Brackets', fr: 'Tranches d\'imposition' },
  minimumWage:      { en: 'Minimum Wage', fr: 'Salaire minimum' },
  basicPersonal:    { en: 'Basic Personal Amount', fr: 'Montant personnel de base' },
  ontarioHealth:    { en: 'Ontario Health Premium', fr: 'Cotisation-santé de l\'Ontario' },
  rrspDeduction:    { en: 'RRSP Contribution', fr: 'Cotisation au REER' },
};
```

### 5.5 SEO for Bilingual Pages

- Each page has both `/en/...` and `/fr/...` versions
- Use `<link rel="alternate" hreflang="en" href="..." />` and `<link rel="alternate" hreflang="fr" href="..." />` on every page
- `generateMetadata` returns language-specific titles and descriptions
- OG images render text in the user's language
- Sitemap includes both language versions of every URL
- French pages target French keywords: "calculateur de salaire Canada", "salaire net Québec", "impôt sur le revenu 2026", "calculatrice d'impôt Canada"

### 5.6 Content Translation Strategy

- **Calculator UI:** Fully translated from day one (all labels, tooltips, results, disclaimers)
- **Province pages:** Full French versions for Quebec, New Brunswick, and Ontario (largest French-speaking populations). Other provinces: translated calculator + basic translated meta/headings, with English content body marked as "Content available in English only" with a link
- **Guides:** Launch with 2 guides in French (RRSP and CPP explainers). Remaining guides in English only at launch, with French versions added post-launch
- **Legal pages (Privacy, Terms):** Both languages from day one (required for Canadian compliance)

---

## 6. Information Architecture & Routes

```
/[locale]/                                          Landing — main calculator
/[locale]/province/alberta                           Alberta-specific calculator
/[locale]/province/british-columbia                  BC-specific
/[locale]/province/ontario                           Ontario-specific
/[locale]/province/quebec                            Quebec-specific (QPP/QPIP)
/[locale]/province/manitoba                          Manitoba-specific
/[locale]/province/saskatchewan                      Saskatchewan-specific
/[locale]/province/nova-scotia                       Nova Scotia-specific
/[locale]/province/new-brunswick                     New Brunswick-specific
/[locale]/province/newfoundland-and-labrador         Newfoundland-specific
/[locale]/province/prince-edward-island              PEI-specific
/[locale]/province/northwest-territories             NWT-specific
/[locale]/province/nunavut                           Nunavut-specific
/[locale]/province/yukon                             Yukon-specific
/[locale]/compare                                    Side-by-side province comparison
/[locale]/tax-brackets                               Federal + all provincial brackets
/[locale]/minimum-wage                               Minimum wage by province
/[locale]/guides                                     Index of guides
/[locale]/guides/[slug]                              Individual guide
/[locale]/about                                      About + E-E-A-T
/[locale]/contact                                    Contact form
/[locale]/privacy                                    Privacy policy
/[locale]/terms                                      Terms of use
/sitemap.xml                                         Auto-generated (both locales)
/robots.txt                                          Standard
/llms.txt                                            AI crawler guidance
```

Where `[locale]` is `en` or `fr`. Default (`/`) redirects to `/en/`.

---

## 7. The Tax Calculation Engine

### 7.1 Architecture

All tax logic lives in `/lib/tax/` as pure TypeScript functions with comprehensive unit tests. **The tax engine is language-agnostic** — it takes numbers in, returns numbers out. Translation happens only in the UI layer.

```
/lib/tax/
  types.ts              — shared types and interfaces
  federal.ts            — federal tax calculation
  provincial.ts         — provincial tax calculation (all 13)
  cpp.ts                — CPP + CPP2 calculation
  ei.ts                 — EI calculation (federal + Quebec variant)
  qpip.ts               — Quebec QPIP calculation
  engine.ts             — main orchestrator combining all of the above
  brackets/
    federal-2026.ts     — 2026 federal brackets and rates
    federal-2025.ts     — 2025 federal brackets and rates
    provincial-2026.ts  — all 13 provincial brackets for 2026
    provincial-2025.ts  — all 13 provincial brackets for 2025
  __tests__/
    engine.test.ts      — integration tests against known CRA examples
    federal.test.ts
    provincial.test.ts
    cpp.test.ts
    ei.test.ts
```

### 7.2 Types

```typescript
type Province =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT'
  | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

type InputMode = 'annual' | 'hourly' | 'monthly' | 'biweekly' | 'weekly';
type TaxYear = 2025 | 2026;

interface CalculatorInput {
  amount: number;
  inputMode: InputMode;
  province: Province;
  taxYear: TaxYear;
  hoursPerWeek: number;         // default 40
  weeksPerYear: number;         // default 52
  rrspDeduction?: number;       // optional RRSP contribution (reduces taxable income)
}

interface TaxBreakdown {
  grossAnnual: number;
  grossMonthly: number;
  grossBiweekly: number;
  grossWeekly: number;
  grossHourly: number;

  federalTax: number;
  provincialTax: number;
  cppContribution: number;
  cpp2Contribution: number;
  eiPremium: number;
  qpipPremium: number;          // Quebec only, 0 for others
  ontarioHealthPremium: number; // Ontario only, 0 for others

  totalDeductions: number;

  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  netWeekly: number;
  netHourly: number;

  effectiveTaxRate: number;     // percentage
  marginalTaxRate: number;      // combined federal + provincial marginal

  federalBrackets: BracketDetail[];
  provincialBrackets: BracketDetail[];
}

interface BracketDetail {
  from: number;
  to: number | null;
  rate: number;                 // decimal (0.14, not 14)
  taxInBracket: number;
}
```

### 7.3 2026 Federal Tax Data (Verified from CRA / CBC / CRA T4032)

```typescript
const FEDERAL_BRACKETS_2026 = [
  { from: 0,       to: 58523,   rate: 0.14 },
  { from: 58523,   to: 117045,  rate: 0.205 },
  { from: 117045,  to: 181440,  rate: 0.26 },
  { from: 181440,  to: 258482,  rate: 0.29 },
  { from: 258482,  to: null,    rate: 0.33 },
];

const FEDERAL_BPA_2026 = {
  max: 16452,
  min: 14829,
  phaseOutStart: 181440,
  phaseOutEnd: 258482,
};

const FEDERAL_CEA_2026 = 1501;

const CPP_2026 = {
  basicExemption: 3500,
  ympe: 74600,
  rate: 0.0595,
  maxContribution: 4230.45,
};

const CPP2_2026 = {
  yampe: 85000,
  rate: 0.04,
  maxContribution: 416.00,
};

const EI_2026 = {
  maxInsurableEarnings: 68900,
  rate: 0.0163,
  maxPremium: 1123.07,
};

const EI_QUEBEC_2026 = {
  maxInsurableEarnings: 68900,
  rate: 0.01295,
  maxPremium: 892.46,
};

const QPIP_2026 = {
  maxInsurableEarnings: 98000,
  rate: 0.00494,
  maxPremium: 484.12,
};
```

### 7.4 Provincial Tax Data (2026)

Store in `/lib/tax/brackets/provincial-2026.ts`.

**Verified starting points:**

```typescript
// ALBERTA
const AB_2026 = {
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

// ONTARIO — also has Ontario Health Premium and surtax
const ON_2026 = {
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

// BRITISH COLUMBIA
const BC_2026 = {
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

// QUEBEC — uses QPP instead of CPP, QPIP, federal abatement
const QC_2026 = {
  brackets: [
    { from: 0,       to: 53255,   rate: 0.14 },
    { from: 53255,   to: 106510,  rate: 0.19 },
    { from: 106510,  to: 129590,  rate: 0.24 },
    { from: 129590,  to: null,    rate: 0.2575 },
  ],
  bpa: 18571,
  usesQPP: true,
  usesQPIP: true,
  federalAbatement: 0.165, // 16.5% federal tax reduction for Quebec residents
  notes: 'Quebec has its own pension plan (QPP) and parental insurance (QPIP). Residents receive a 16.5% federal tax abatement.',
};

// AGENT: Research and populate the remaining 9 provinces/territories using web search.
// Required for each: brackets array, bpa, and any province-specific notes.
// Manitoba (MB), Saskatchewan (SK), Nova Scotia (NS), New Brunswick (NB),
// Newfoundland & Labrador (NL), Prince Edward Island (PE),
// Northwest Territories (NT), Nunavut (NU), Yukon (YT)
// Use CRA T4032 payroll deduction tables or provincial government sources.
```

### 7.5 Ontario Health Premium (Special Calculation)

```typescript
// Ontario Health Premium is NOT a tax bracket — it's a separate graduated levy
function calculateOntarioHealthPremium(taxableIncome: number): number {
  if (taxableIncome <= 20000) return 0;
  if (taxableIncome <= 25000) return 0.06 * (taxableIncome - 20000);
  if (taxableIncome <= 36000) return 300;
  if (taxableIncome <= 38500) return 300 + 0.06 * (taxableIncome - 36000);
  if (taxableIncome <= 48000) return 450;
  if (taxableIncome <= 48600) return 450 + 0.25 * (taxableIncome - 48000);
  if (taxableIncome <= 72000) return 600;
  if (taxableIncome <= 72600) return 600 + 0.25 * (taxableIncome - 72000);
  if (taxableIncome <= 200000) return 750;
  if (taxableIncome <= 200600) return 750 + 0.25 * (taxableIncome - 200000);
  return 900; // max $900/year
}
```

### 7.6 Calculation Flow

```
1. Normalize input to gross annual salary
   - hourly: amount × hoursPerWeek × weeksPerYear
   - monthly: amount × 12
   - biweekly: amount × 26
   - weekly: amount × 52
   - annual: amount (as-is)

2. Calculate taxable income
   - taxableIncome = grossAnnual - rrspDeduction (if provided)

3. Calculate federal tax
   - Apply progressive brackets to taxableIncome
   - Subtract federal BPA credit (BPA × lowest bracket rate of 0.14)
   - Subtract CEA credit (CEA × 0.14)
   - For Quebec residents: apply 16.5% federal tax abatement (multiply federal tax by 0.835)

4. Calculate provincial tax
   - Apply provincial progressive brackets to taxableIncome
   - Subtract provincial BPA credit (provincialBPA × lowest provincial rate)
   - For Ontario: add Ontario Health Premium + surtax
   - For Quebec: use Quebec-specific brackets

5. Calculate CPP/QPP contribution
   - For non-Quebec: CPP on earnings between $3,500 and $74,600 at 5.95%
   - For Quebec: QPP at slightly different rate (verify via CRA/Revenu Québec)
   - Cap at max contribution

6. Calculate CPP2/QPP2 contribution
   - On earnings between $74,600 (YMPE) and $85,000 (YAMPE) at 4%
   - Cap at max $416

7. Calculate EI premium
   - Non-Quebec: 1.63% up to $68,900, max $1,123.07
   - Quebec: reduced rate of 1.295% (QPIP covers parental benefits separately)

8. Calculate QPIP (Quebec only)
   - 0.494% up to $98,000, max ~$484

9. Calculate Ontario Health Premium (Ontario only)
   - Use graduated table from §7.5

10. Sum total deductions

11. Calculate net amounts (annual, monthly, biweekly, weekly, hourly)

12. Calculate effective and marginal tax rates
```

### 7.7 Unit Tests Required

Test against CRA payroll examples. Minimum test cases:

| Salary | Province | Verify within $200 of CRA tables |
|---|---|---|
| $40,000 | AB | Federal tax, provincial tax, CPP, EI, net |
| $60,000 | ON | Including Ontario Health Premium |
| $80,000 | BC | 7-bracket provincial calculation |
| $100,000 | QC | QPP + QPIP + federal abatement |
| $150,000 | AB | CPP2 kicks in above $74,600 |
| $250,000 | ON | Top bracket + surtax |
| $18,150 (federal min wage) | AB | Near-zero tax |
| $0 RRSP | ON | Baseline, then with $10K RRSP deduction |

---

## 8. Calculator UX

### 8.1 Main Calculator (Homepage)

**Inputs:**
- Amount field (large, prominent, auto-focused)
- Input mode toggle: Annual / Hourly / Monthly / Bi-weekly / Weekly (pill-style toggles, translated)
- Province dropdown (default: Alberta, names in user's language)
- Tax year: 2026 (default), 2025
- Collapsible "Advanced" section: hours/week, weeks/year, RRSP contribution

**Results (live-updating, debounced 200ms, no Calculate button):**
- Primary result card: Large green net annual, with monthly/biweekly/weekly/hourly below
- Tax breakdown card: line items for each deduction
- Visual chart: Recharts donut or stacked bar (gross → deductions → net)
- Effective + marginal tax rate badges
- Expandable bracket detail
- URL query params for sharing: `?amount=75000&mode=annual&province=AB&year=2026`

### 8.2 Navbar

- Logo (PayCalc) — left
- Links: Calculator, Compare, Tax Brackets, Minimum Wage, Guides — center or left-aligned
- **Language toggle — right side:** Pill button showing "FR" (when on English) or "EN" (when on French). Clicking swaps the entire page to the other language, preserving all calculator state via URL params.
- Mobile: hamburger menu with language toggle always visible (not hidden in menu)

### 8.3 Province Pages, Compare, Reference Pages

Same structure as described in the earlier spec iteration. All text rendered via `next-intl` translation keys. Province names, tax terms, and UI labels all respond to language toggle.

---

## 9. Content System

```
/messages/
  en.json                 — English UI strings
  fr.json                 — French UI strings
/content/
  provinces/
    alberta.en.mdx        — English content for Alberta page
    alberta.fr.mdx        — French content for Alberta page
    ontario.en.mdx
    ontario.fr.mdx
    quebec.en.mdx
    quebec.fr.mdx
    ... (all 13, both languages)
  guides/
    en/
      rrsp-tax-savings.mdx
      alberta-vs-ontario-take-home.mdx
      understanding-cpp-deductions.mdx
      how-marginal-tax-rates-work.mdx
      canada-minimum-wage-2026.mdx
    fr/
      epargne-impot-reer.mdx
      comprendre-deductions-rpc.mdx
      ... (French versions of priority guides)
  minimum-wage.json       — all province minimum wages (data, language-neutral)
```

**Initial guides (5 EN, 2 FR at launch):**

English:
1. "How RRSP Contributions Lower Your Tax Bill"
2. "Alberta vs Ontario: Where Do You Keep More?"
3. "CPP and CPP2 Explained: What's Coming Off Your Paycheque in 2026"
4. "Why Your Tax Rate Isn't What You Think"
5. "Minimum Wage Across Canada in 2026"

French:
1. "Comment les cotisations au REER réduisent votre facture d'impôts"
2. "RPC et RPC2 expliqués : Ce qui est déduit de votre paie en 2026"

---

## 10. SEO Requirements

- `generateMetadata` returns language-specific titles/descriptions
- **hreflang tags** on every page: `<link rel="alternate" hreflang="en" />` and `<link rel="alternate" hreflang="fr" />`
- Dynamic OG images rendering text in the user's language
- **Schema markup (JSON-LD):** `Organization`, `WebSite`, `WebApplication`, `FAQPage`, `BreadcrumbList` — language-appropriate
- Sitemap includes both `/en/` and `/fr/` versions of every URL
- Canonical URLs per language version
- **Target keywords:**
  - EN: "canadian salary calculator", "take home pay canada", "income tax calculator canada 2026", "[province] salary calculator"
  - FR: "calculateur de salaire Canada", "salaire net Québec", "impôt sur le revenu Canada 2026", "calculatrice d'impôt provincial"
- Lighthouse mobile ≥95

---

## 11. Monetization (AdSense)

- AdSense publisher ID in `.env.local` as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- Auto Ads + manual slots: `<AdSlotInArticle />`, `<AdSlotSidebar />`, `<AdSlotFooter />`
- Lazy-load AdSense script. Gate with production env check.
- Never place ads inside or above the calculator.
- "Why we show ads" / "Pourquoi nous affichons des publicités" in footer (translated)

---

## 12. Analytics & Tracking

- GA4 via `@next/third-parties/google`. Track custom events:
  - `salary_calculated` (amount, mode, province, year, locale)
  - `language_switched` (from, to)
  - `province_changed`
  - `comparison_created`
  - `result_copied`
  - `guide_clicked`
- Vercel Analytics + Speed Insights
- No PII. Anonymize IPs.

---

## 13. Legal/Compliance

- **Privacy policy** in both EN and FR. Mention AdSense, GA4, cookies, no salary data stored.
- **Terms of use** in both EN and FR. Include: "For informational purposes only — not tax advice." / "À titre informatif seulement — ne constitue pas un conseil fiscal."
- **Cookie consent banner** in both languages. Respect user's language preference.
- **Disclaimer on every calculator page** (both languages): "This calculator provides estimates based on 2026 CRA tax tables. Actual deductions may vary." / "Ce calculateur fournit des estimations basées sur les tables d'impôt de l'ARC 2026. Les déductions réelles peuvent varier."

---

## 14. Build Order & Milestones

### Milestone 1: Scaffold + Tax Engine + i18n Setup
- Scaffold Next.js 15, configure shadcn, design tokens, install recharts
- Install and configure `next-intl` with EN/FR locale routing and middleware
- Create `/messages/en.json` and `/messages/fr.json` with all calculator UI strings
- Implement complete tax engine in `/lib/tax/` (federal, all 13 provincial, CPP/CPP2, EI, QPIP, Ontario Health Premium)
- Agent: **web search all 13 provincial brackets** from CRA T4032 tables
- Write comprehensive unit tests
- **Checkpoint:** all tests pass, show me results

### Milestone 2: Core Calculator + Homepage (EN)
- Build `<SalaryCalculator>` with live results, all labels from translation files
- Build results card + Recharts tax breakdown chart
- Build homepage layout with language toggle in navbar
- Mobile-responsive
- **Checkpoint:** review English calculator

### Milestone 3: French Translation + Language Toggle
- Complete FR translation of all calculator UI strings
- Implement language toggle (navbar pill button)
- Cookie-based language persistence
- Verify all calculator labels, results, tooltips render correctly in French
- **Checkpoint:** review French calculator side-by-side with English

### Milestone 4: Province Pages (EN + FR)
- Build dynamic `/[locale]/province/[slug]` route
- Create content for all 13 provinces (EN for all, FR for QC, NB, ON at minimum)
- Each page pre-fills calculator, shows brackets, min wage, FAQ
- hreflang tags on every page
- **Checkpoint:** review Alberta (EN), Quebec (FR), Ontario (EN+FR)

### Milestone 5: Compare + Reference + Guides
- Build `/compare` side-by-side tool
- Build `/tax-brackets` and `/minimum-wage` reference pages (both languages)
- Write 5 EN guides + 2 FR guides
- **Checkpoint:** review comparison and reference pages

### Milestone 6: SEO + Schema
- All metadata (bilingual), JSON-LD schema, sitemap (both locales), robots, llms.txt
- Dynamic OG images (language-aware)
- Lighthouse audit ≥95
- **Checkpoint:** Lighthouse report

### Milestone 7: Analytics + Ads + Deploy
- GA4, Vercel Analytics, AdSense (placeholder ID)
- Cookie consent (bilingual)
- MANUAL STEP: GitHub repo, Vercel, DNS, Search Console, AdSense
- **Checkpoint:** site live at paycalc.ca

### Milestone 8: Post-Launch
- Create `/docs/CONTENT_BACKLOG.md` (expansion tools + remaining FR translations)
- 6-month SEO content calendar
- Plan: RRSP calculator, TFSA calculator, bonus tax calculator, self-employment calculator

---

## 15. Manual Steps

PAUSE and guide me through each:

1. **Check domain availability:** `paycalc.ca` at Cloudflare or Namecheap. Fallbacks: `takehomepay.ca`, `netpaycalc.ca`
2. **Register domain**
3. **Create GitHub repo** and push
4. **Create Vercel project** and link repo
5. **Configure DNS**
6. **Create GA4 property** → paste Measurement ID
7. **Create Google Search Console property** → verify, submit sitemap
8. **Apply for Google AdSense** (need live site + privacy policy first)
9. **Set up Vercel Analytics** (1-click)
10. **Add env vars** in Vercel dashboard

---

## 16. Quality Gates

Feature is not done until:
- [ ] TypeScript compiles (strict mode, no errors)
- [ ] No ESLint warnings
- [ ] Unit tests pass for all tax logic
- [ ] Tax calculations within $200 of CRA tables
- [ ] Both EN and FR render correctly (no untranslated strings)
- [ ] hreflang tags present on every page
- [ ] Mobile (375px), tablet (768px), desktop (1440px) correct
- [ ] Lighthouse mobile ≥95
- [ ] No console errors
- [ ] Build succeeds (`pnpm build`)
- [ ] Committed with conventional message

---

## 17. What NOT to Do

- Do NOT store user salary data server-side. All calculations client-side.
- Do NOT add user accounts or login.
- Do NOT add a database. Content is static (JSON/MDX).
- Do NOT auto-redirect users to French based on browser language. Let them choose via the toggle. Store choice in cookie.
- Do NOT use Google Translate or machine translation for the FR version. All French text must be manually written or professionally translated. Bad French is worse than no French for Quebec users.
- Do NOT use `localStorage` or `sessionStorage` — use URL params + cookies.
- Do NOT present calculations as tax advice. Always include disclaimers in both languages.
- Do NOT hardcode province default — default to Alberta but allow URL params and geolocation override.
- Do NOT build a backend API. All math runs in the browser.
- Do NOT plagiarize content from TurboTax or competitors.
- Do NOT mix English and French on the same page. When a user is on `/fr/`, everything visible must be in French.

---

## 18. Post-Launch Expansion Backlog

**Additional calculator tools:**
- RRSP tax savings calculator / Calculateur d'épargne REER
- TFSA contribution room tracker / Suivi des droits de cotisation au CELI
- Bonus tax calculator / Calculateur d'impôt sur les primes
- Self-employment tax calculator / Calculateur d'impôt travail autonome
- Overtime pay calculator / Calculateur de paie des heures supplémentaires
- Parental leave benefit estimator / Estimateur de prestations parentales
- Capital gains tax calculator / Calculateur d'impôt sur les gains en capital

**Additional guide topics (EN + FR over time):**
- Self-Employed Taxes in Canada
- How to Read Your Pay Stub
- RRSP vs TFSA: Which Should You Contribute To?
- Tax Credits Every Canadian Should Know
- How Moving Provinces Affects Your Taxes
- Understanding the Ontario Health Premium
- Quebec Tax System: How It Differs
- Canadian Tax Deadlines 2026
- First-Time Home Buyer Tax Credits

**French content expansion:** Translate all 13 province pages and all guides into French within 3 months post-launch. Prioritize Quebec, New Brunswick, and Ontario French content first.

---

## Acknowledgement

Before you start building, confirm:
1. You've read this entire spec.
2. You've checked which skills are available and which are relevant.
3. You've checked which MCPs I have configured and which are relevant.
4. You will use TodoWrite to track milestones.
5. You will pause for manual steps and not assume.
6. You understand that the tax engine accuracy is the #1 priority.
7. You understand that NO untranslated English strings should appear on French pages.

Then proceed with **Milestone 1: Scaffold + Tax Engine + i18n Setup**.
