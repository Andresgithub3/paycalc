export interface Guide {
  slug: string;
  locale: 'en' | 'fr';
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string; // markdown content
}

export const GUIDES: Guide[] = [
  // === ENGLISH GUIDES ===
  {
    slug: 'rrsp-tax-savings',
    locale: 'en',
    title: 'How RRSP Contributions Lower Your Tax Bill',
    description: 'Learn how contributing to an RRSP reduces your taxable income and saves you money on taxes in Canada.',
    date: '2026-01-15',
    readTime: '5 min',
    content: `
## What is an RRSP?

A **Registered Retirement Savings Plan (RRSP)** is one of the most powerful tax-saving tools available to Canadians. When you contribute to an RRSP, you **reduce your taxable income** dollar-for-dollar — meaning you pay less tax this year while saving for retirement.

## How the Tax Deduction Works

Your RRSP contribution is subtracted from your gross income before tax is calculated. For example:

- **Gross income:** $80,000
- **RRSP contribution:** $10,000
- **Taxable income:** $70,000

You only pay tax on $70,000, not $80,000. The tax savings depend on your **marginal tax rate** — the tax rate on your last dollar of income.

## How Much Can You Save?

| Income | RRSP Contribution | Approximate Tax Savings |
|--------|-------------------|------------------------|
| $50,000 | $5,000 | $1,500 – $1,800 |
| $75,000 | $10,000 | $3,000 – $3,500 |
| $100,000 | $15,000 | $4,500 – $5,500 |
| $150,000 | $20,000 | $7,000 – $9,000 |

The higher your income, the more you save per dollar contributed, because higher income pushes you into higher tax brackets.

## RRSP Contribution Limits for 2026

- **Maximum contribution:** 18% of your previous year's earned income, up to $32,490 for 2026
- **Unused room carries forward** — check your CRA Notice of Assessment for your exact limit
- **Deadline:** March 1, 2027 (for the 2026 tax year)

## Key Strategies

1. **Contribute at higher-income years.** If your income varies, contribute more in years when your marginal rate is highest.
2. **Spousal RRSP.** Contribute to your spouse's RRSP to split income in retirement and potentially pay less tax overall.
3. **Don't over-contribute.** The CRA charges a 1% per month penalty on contributions exceeding your limit by more than $2,000.

## Try It Yourself

Use the [PayCalc calculator](/) to see exactly how an RRSP contribution affects your take-home pay. Enter your salary, then add an RRSP amount in the Advanced section to see the difference.
`,
  },
  {
    slug: 'alberta-vs-ontario-take-home',
    locale: 'en',
    title: 'Alberta vs Ontario: Where Do You Keep More?',
    description: 'A detailed comparison of take-home pay between Alberta and Ontario for various salary levels.',
    date: '2026-01-20',
    readTime: '6 min',
    content: `
## The Big Picture

Alberta and Ontario are Canada's two largest economies, but they have very different tax structures. Alberta is consistently ranked as the **lowest-tax province** for most income levels, while Ontario adds layers like the **Ontario Health Premium** and a **surtax** on higher earners.

## Key Differences

| Factor | Alberta | Ontario |
|--------|---------|---------|
| Lowest provincial rate | 8.0% | 5.05% |
| Highest provincial rate | 15.0% | 13.16% |
| Basic Personal Amount | $22,769 | $11,865 |
| Provincial Sales Tax | None | 8% (HST) |
| Health Premium | None | Up to $900/year |
| Surtax | None | Yes (20% + 36%) |

## Take-Home Pay Comparison

Here's how much more you keep in Alberta at various salary levels:

| Salary | Alberta Net | Ontario Net | Alberta Advantage |
|--------|-----------|-----------|-------------------|
| $50,000 | ~$41,200 | ~$39,800 | ~$1,400 more |
| $75,000 | ~$58,900 | ~$56,500 | ~$2,400 more |
| $100,000 | ~$75,800 | ~$72,200 | ~$3,600 more |
| $150,000 | ~$107,700 | ~$102,100 | ~$5,600 more |

## Why Alberta Wins

1. **No provincial sales tax.** You save 8% on virtually everything you buy.
2. **Higher BPA.** Alberta's $22,769 basic personal amount is nearly double Ontario's $11,865 — meaning more income is completely tax-free.
3. **Flat 8% rate up to $151,234.** Most Albertans only ever pay the lowest provincial rate.
4. **No health premium or surtax.** Ontario layers additional charges on top of income tax.

## But Consider Cost of Living

While Alberta's tax advantage is clear, Ontario — especially Toronto — often has higher salaries for the same role. Housing costs vary dramatically by city. Use the [PayCalc comparison tool](/compare) to run your specific numbers.
`,
  },
  {
    slug: 'understanding-cpp-deductions',
    locale: 'en',
    title: "CPP and CPP2 Explained: What's Coming Off Your Paycheque in 2026",
    description: 'Understand CPP and CPP2 contributions, how they affect your pay, and what the 2026 rates mean for you.',
    date: '2026-02-01',
    readTime: '5 min',
    content: `
## What is CPP?

The **Canada Pension Plan (CPP)** is a mandatory retirement pension. Both you and your employer contribute. As an employee, your share is deducted automatically from each paycheque.

## 2026 CPP Rates

| | Amount |
|--|--------|
| **Basic Exemption** | $3,500 |
| **Maximum Pensionable Earnings (YMPE)** | $74,600 |
| **Employee Rate** | 5.95% |
| **Maximum Employee Contribution** | $4,230.45 |

You pay CPP on earnings between $3,500 and $74,600. Once you've contributed the maximum ($4,230.45), no more CPP is deducted for the rest of the year.

## What is CPP2?

Starting in 2024, the government introduced **CPP2** — an enhanced contribution on higher earnings.

| | Amount |
|--|--------|
| **Year's Additional Maximum (YAMPE)** | $85,000 |
| **CPP2 Rate** | 4.0% |
| **Maximum CPP2 Contribution** | $416.00 |

CPP2 applies only on earnings between $74,600 (YMPE) and $85,000 (YAMPE). If you earn less than $74,600, you won't pay any CPP2.

## How CPP Affects Your Pay

For a $80,000 salary:
- **CPP:** ($74,600 - $3,500) × 5.95% = **$4,230.45** (maximum)
- **CPP2:** ($80,000 - $74,600) × 4.0% = **$216.00**
- **Total:** $4,446.45/year or about $171/paycheque (bi-weekly)

## Quebec: QPP Instead of CPP

If you work in Quebec, you pay into the **Quebec Pension Plan (QPP)** instead. The QPP has similar thresholds but is administered by Revenu Québec. The employee rate is the same at 5.95% for 2026.

## Will You Get It Back?

Yes — CPP contributions fund your retirement pension. The amount you receive depends on how much and how long you contributed. You can start receiving CPP as early as age 60 (reduced) or as late as 70 (enhanced).
`,
  },
  {
    slug: 'how-marginal-tax-rates-work',
    locale: 'en',
    title: "Why Your Tax Rate Isn't What You Think",
    description: 'Understand the difference between marginal and effective tax rates, and why earning more never means taking home less.',
    date: '2026-02-15',
    readTime: '4 min',
    content: `
## The Most Common Tax Myth

Many Canadians believe that if they earn enough to enter a higher tax bracket, **all** their income gets taxed at the higher rate. This is wrong. Canada uses a **progressive** tax system — only the income *within* each bracket is taxed at that bracket's rate.

## Marginal vs. Effective Tax Rate

- **Marginal rate:** The tax rate on your **next** dollar of income. This is the rate of the bracket you're currently in.
- **Effective rate:** The **average** rate across all your income — your total tax divided by total income.

## Example: $100,000 Salary (Federal Only, 2026)

| Bracket | Income in Bracket | Rate | Tax |
|---------|------------------|------|-----|
| $0 – $58,523 | $58,523 | 14.0% | $8,193 |
| $58,523 – $100,000 | $41,477 | 20.5% | $8,503 |
| **Total** | **$100,000** | | **$16,696** |

After the Basic Personal Amount credit (~$2,303) and Canada Employment credit (~$210), your net federal tax is approximately **$14,183**.

- **Marginal rate:** 20.5% (the bracket your income falls in)
- **Effective rate:** 14.2% ($14,183 ÷ $100,000)

## Why Earning More Never Hurts

If you get a $5,000 raise from $100,000 to $105,000:
- Only the additional $5,000 is taxed at 20.5%
- Extra tax: ~$1,025
- You still take home ~$3,975 of the raise

**You always keep a majority of any raise.** There is no scenario where earning more results in less take-home pay.

## Combined Rates

Remember, you pay both federal and provincial tax. Your combined marginal rate is the sum of both. For example, in Ontario at $100,000:
- Federal marginal: 20.5%
- Ontario marginal: 9.15%
- **Combined marginal: 29.65%**

Use the [PayCalc calculator](/) to see your exact marginal and effective rates for any salary and province.
`,
  },
  {
    slug: 'canada-minimum-wage-2026',
    locale: 'en',
    title: 'Minimum Wage Across Canada in 2026',
    description: 'A complete guide to minimum wage rates in all 13 Canadian provinces and territories for 2026.',
    date: '2026-03-01',
    readTime: '4 min',
    content: `
## Minimum Wage in Canada

There is no single minimum wage in Canada. Each province and territory sets its own rate. The federal minimum wage ($17.30/hour for 2024) applies only to federally regulated industries like banking, telecommunications, and inter-provincial transportation.

## 2026 Minimum Wage Rates

| Province/Territory | Rate | Annual Gross (40h/week) |
|-------------------|------|------------------------|
| Nunavut | $19.00 | $39,520 |
| British Columbia | $17.85 | $37,128 |
| Yukon | $17.59 | $36,587 |
| Ontario | $17.20 | $35,776 |
| Northwest Territories | $16.70 | $34,736 |
| Manitoba | $15.80 | $32,864 |
| Quebec | $15.75 | $32,760 |
| Newfoundland & Labrador | $15.60 | $32,448 |
| Prince Edward Island | $15.40 | $32,032 |
| New Brunswick | $15.30 | $31,824 |
| Nova Scotia | $15.20 | $31,616 |
| Alberta | $15.00 | $31,200 |
| Saskatchewan | $15.00 | $31,200 |

## Key Takeaways

1. **Nunavut has the highest minimum wage** at $19.00/hr — reflecting the extremely high cost of living in Canada's northernmost territory.
2. **Alberta and Saskatchewan are tied for the lowest** at $15.00/hr. Alberta's rate hasn't changed since 2019.
3. **Most provinces index their minimum wage** to inflation annually. Ontario, BC, and several others adjust each year.
4. **After taxes, minimum wage is significantly lower.** At $15.00/hr in Alberta, your take-home is approximately $27,800/year after CPP, EI, and income tax.

## Calculate Your Take-Home

Use our [minimum wage reference page](/minimum-wage) to see all rates, or enter any hourly rate in the [calculator](/) to see your exact take-home pay after all deductions.
`,
  },

  {
    slug: 'how-to-read-your-pay-stub',
    locale: 'en',
    title: 'How to Read Your Pay Stub in Canada',
    description: 'A line-by-line breakdown of every deduction on your Canadian pay stub, from CPP to EI to income tax.',
    date: '2026-03-15',
    readTime: '6 min',
    content: `
## Why Your Pay Stub Matters

Your pay stub is more than a receipt — it's a detailed record of how your gross pay becomes your net (take-home) pay. Understanding each line helps you catch errors, plan your finances, and know exactly where your money goes.

## Gross Pay

This is your total earnings before any deductions. It may include:

- **Regular pay** — your salary or hourly wages for the pay period
- **Overtime** — hours worked beyond the standard (usually 1.5× your hourly rate)
- **Bonuses or commissions** — additional compensation
- **Vacation pay** — if paid out rather than banked

If you're salaried at $75,000/year, your gross pay on a bi-weekly stub is $75,000 ÷ 26 = **$2,884.62**.

## Statutory Deductions

These are mandatory. Your employer withholds them and remits to the government on your behalf.

### 1. Federal Income Tax

Calculated using Canada's progressive brackets. Your employer estimates your annual tax and divides it across pay periods. At $75,000, expect roughly **$400–$500 per bi-weekly pay** withheld for federal tax, depending on your TD1 personal tax credits.

### 2. Provincial Income Tax

Same concept as federal, but using your province's brackets. This varies significantly — Alberta withholds less than Ontario or Quebec for the same salary.

### 3. CPP (Canada Pension Plan)

- **Rate:** 5.95% on earnings between $3,500 and $74,600
- **Maximum annual contribution:** $4,230.45
- At $75,000, you'll hit the max partway through the year. Early paycheques deduct more; late-year ones deduct less or nothing.

### 4. CPP2 (Enhanced CPP)

- **Rate:** 4.0% on earnings between $74,600 and $85,000
- **Maximum:** $416.00/year
- Only applies if you earn above $74,600. At $75,000, your CPP2 for the year is just $16.00.

### 5. EI (Employment Insurance)

- **Rate:** 1.63% (or 1.295% in Quebec)
- **Maximum insurable earnings:** $68,900
- **Maximum annual premium:** $1,123.07 (or $892.46 in Quebec)

### 6. QPIP (Quebec Only)

If you work in Quebec, you also pay into the **Quebec Parental Insurance Plan** at 0.494% on earnings up to $98,000 (max $484.12/year). This is why Quebec's EI rate is lower — QPIP covers parental benefits instead.

## Voluntary Deductions

These are amounts you've opted into:

- **RRSP contributions** — reduces your taxable income
- **Pension plan** — employer-sponsored RPP contributions
- **Union dues** — if applicable
- **Extended health/dental** — group benefit premiums
- **Life or disability insurance** — employer group plans

## Year-to-Date (YTD) Totals

Most stubs show cumulative totals for the calendar year. Check these against your T4 slip at tax time — they should match.

## Net Pay

This is what lands in your bank account: **Gross Pay − All Deductions = Net Pay**.

For a $75,000 salary in Ontario, a typical bi-weekly net pay is approximately **$2,170** after all deductions.

## Common Stub Errors to Watch For

1. **Wrong province** — if you moved, your employer may still be using old provincial rates
2. **Missing TD1 credits** — if you didn't file a TD1 form, your employer may withhold too much tax
3. **CPP still deducting in December** — if you've already hit the annual max, no more should be deducted
4. **Incorrect hours** — for hourly workers, verify hours match your records

## Calculate Your Own

Use the [PayCalc calculator](/) to see a full breakdown of deductions for any salary, province, and pay frequency. Compare the numbers to your actual pay stub to make sure everything lines up.
`,
  },
  {
    slug: 'ontario-surtax-explained',
    locale: 'en',
    title: 'Ontario Surtax Explained: The Hidden Provincial Tax',
    description: 'Understand how Ontario\'s surtax adds 20% and 36% on top of provincial income tax, and at what income levels it kicks in.',
    date: '2026-04-01',
    readTime: '5 min',
    content: `
## What Is the Ontario Surtax?

Ontario is the only province that charges a **surtax** — an additional tax calculated on top of your basic provincial income tax. It effectively multiplies your provincial tax rate at higher income levels, making Ontario one of the highest-taxed provinces for top earners.

## How It Works

The surtax has two tiers, both based on your **basic provincial tax** (not your income):

| Tier | Threshold | Rate |
|------|-----------|------|
| First surtax | Provincial tax exceeds $5,315 | 20% of amount over $5,315 |
| Second surtax | Provincial tax exceeds $6,802 | 36% of amount over $6,802 |

Both tiers can apply at the same time. If your provincial tax is high enough, you pay both the 20% and the 36% surtax.

## When Does It Kick In?

The surtax thresholds are based on provincial tax, not income. But here's roughly when each tier starts:

- **20% surtax** begins around **$88,000–$92,000** in employment income
- **36% surtax** begins around **$112,000–$118,000** in employment income

The exact income depends on your credits and deductions.

## Example: $120,000 Salary

Here's how the surtax adds up at $120,000:

1. **Basic Ontario tax:** approximately $7,350 (after applying brackets and BPA credit)
2. **20% surtax:** ($7,350 − $5,315) × 20% = **$407**
3. **36% surtax:** ($7,350 − $6,802) × 36% = **$197**
4. **Total surtax:** $407 + $197 = **$604**
5. **Total Ontario tax:** $7,350 + $604 = **$7,954**

The surtax adds about 8% to your provincial tax bill at this income level.

## Impact on Marginal Rates

The surtax doesn't just add a flat charge — it multiplies your marginal provincial rate:

| Income Range | Base ON Rate | With Surtax | Combined (Fed + Prov) |
|---|---|---|---|
| Under ~$88K | 5.05%–9.15% | No surtax | 19.05%–29.65% |
| ~$88K–$112K | 9.15% | × 1.20 = 10.98% | 31.48% |
| ~$112K–$150K | 11.16% | × 1.56 = 17.41% | 37.91% |
| $150K–$220K | 12.16% | × 1.56 = 18.97% | 39.47% |
| Over $220K | 13.16% | × 1.56 = 20.53% | 53.53% |

At the highest bracket, the surtax pushes Ontario's effective provincial rate from 13.16% to over 20%.

## Ontario Health Premium Too

On top of the surtax, Ontario also charges a **Health Premium** — a separate levy based on income:

| Income | Health Premium |
|---|---|
| Under $20,000 | $0 |
| $20,001–$36,000 | Up to $300 |
| $36,001–$48,000 | Up to $450 |
| $48,001–$72,000 | Up to $600 |
| $72,001–$200,000 | Up to $750 |
| Over $200,000 | $900 (maximum) |

Combined with the surtax, these extras can add **$1,500+** to an Ontario taxpayer's bill compared to the same income in a province like Alberta.

## Why Does Ontario Have a Surtax?

The surtax was introduced in the 1990s as a temporary measure to reduce the provincial deficit. It was never repealed. Rather than raising bracket rates directly, the surtax achieves higher effective rates while keeping the base bracket rates looking modest.

## See Your Numbers

Use the [PayCalc calculator](/) with Ontario selected to see exactly how the surtax affects your take-home pay. Compare it to other provinces using the [comparison tool](/compare).
`,
  },
  {
    slug: 'quebec-tax-differences',
    locale: 'en',
    title: 'Quebec Tax Differences: QPIP, QPP, and the Federal Abatement',
    description: 'Why Quebec pay stubs look different from the rest of Canada — QPP, QPIP, reduced EI, and the 16.5% federal abatement explained.',
    date: '2026-04-15',
    readTime: '6 min',
    content: `
## Quebec Runs Its Own Tax System

Quebec is unique in Canada: it administers its own income tax through **Revenu Québec** rather than the CRA. This means Quebec residents file two separate tax returns — one federal, one provincial — and their pay stubs have deductions you won't see in any other province.

## Key Differences at a Glance

| Item | Rest of Canada | Quebec |
|------|---------------|--------|
| Provincial tax filing | Through CRA | Separate Revenu Québec return |
| Pension plan | CPP | QPP (Régime de rentes du Québec) |
| Parental insurance | Included in EI | QPIP (separate premium) |
| EI rate | 1.63% | 1.295% (reduced) |
| Federal tax abatement | None | 16.5% reduction |
| Provincial BPA | Varies | $18,571 |

## QPP: Quebec Pension Plan

Quebec residents contribute to the **QPP** instead of CPP. The rates and thresholds are the same for 2026:

- **Employee rate:** 5.95%
- **YMPE:** $74,600
- **Maximum contribution:** $4,230.45
- **QPP2 rate:** 4.0% on earnings between $74,600 and $85,000

The QPP is administered by Retraite Québec. Your contributions appear as "RRQ" on Quebec pay stubs rather than "CPP."

## QPIP: Quebec Parental Insurance Plan

The rest of Canada funds parental leave benefits through EI. Quebec opted out and created its own program — the **Régime québécois d'assurance parentale (RQAP/QPIP)**.

| | Amount |
|--|--------|
| **Max insurable earnings** | $98,000 |
| **Employee rate** | 0.494% |
| **Maximum premium** | $484.12/year |

QPIP generally offers more generous parental leave benefits than the federal EI program — higher replacement rates and coverage for self-employed workers.

## Reduced EI Rate

Because QPIP covers parental benefits separately, Quebec workers pay a **reduced EI rate**:

| | Federal EI | Quebec EI |
|--|-----------|-----------|
| Rate | 1.63% | 1.295% |
| Max premium | $1,123.07 | $892.46 |

The difference ($230.61/year at max earnings) partially offsets the cost of QPIP.

## The 16.5% Federal Abatement

This is the most misunderstood part of Quebec taxation. Because Quebec collects its own income tax, the federal government provides a **16.5% abatement** — a reduction on federal tax payable.

**How it works:**
1. Calculate your federal tax normally (same brackets as everyone else)
2. Subtract all federal credits (BPA, CEA, etc.)
3. Reduce the result by 16.5%

For example, if your net federal tax would be $10,000:
- **Abatement:** $10,000 × 16.5% = $1,650
- **Federal tax payable:** $10,000 − $1,650 = **$8,350**

This abatement exists because Quebec funds programs (like QPIP and its own tax administration) that the federal government funds in other provinces through federal taxes.

## Quebec's Provincial Tax Brackets (2026)

Quebec has its own bracket structure, independent of federal brackets:

| Bracket | Rate |
|---------|------|
| $0 – $53,255 | 14% |
| $53,255 – $106,510 | 19% |
| $106,510 – $129,590 | 24% |
| $129,590+ | 25.75% |

Quebec's lowest rate (14%) is significantly higher than most provinces (Ontario starts at 5.05%, Alberta at 8%). However, the federal abatement and higher BPA ($18,571 vs Ontario's $11,865) offset some of this.

## Net Effect: Is Quebec More Expensive?

At most income levels, Quebec residents pay **more total income tax** than residents of lower-tax provinces like Alberta or BC. However, they receive more services — subsidized daycare, more generous parental leave, lower university tuition, and public drug insurance.

Here's a rough comparison at $80,000:

| Province | Approximate Total Tax + Deductions |
|----------|----------------------------------|
| Alberta | ~$19,400 |
| Ontario | ~$20,800 |
| British Columbia | ~$20,200 |
| Quebec | ~$22,100 |

The gap narrows when you factor in the services Quebec provides at no additional cost.

## See the Full Breakdown

Use the [PayCalc calculator](/) and select Quebec to see exactly how QPP, QPIP, reduced EI, and the federal abatement affect your take-home pay.
`,
  },
  {
    slug: 'working-in-one-province-living-in-another',
    locale: 'en',
    title: 'Working in One Province, Living in Another: Tax Implications',
    description: 'Which province\'s tax rates apply when you live and work in different provinces? A guide to cross-border provincial taxation in Canada.',
    date: '2026-04-30',
    readTime: '5 min',
    content: `
## The Basic Rule

In Canada, you pay provincial income tax based on **where you live on December 31**, not where you work. This is the single most important rule for cross-province taxation.

If you live in Alberta but commute to Saskatchewan for work, you pay **Alberta's** provincial tax rates. If you live in Ontario but work remotely for a BC company, you pay **Ontario's** rates.

## Why This Matters

Provincial tax rates vary dramatically. The difference in take-home pay between provinces can be thousands of dollars per year:

| Province of Residence | Provincial Tax on $100,000 |
|---|---|
| Alberta | ~$6,000 |
| British Columbia | ~$5,100 |
| Ontario | ~$6,400 (+ surtax + health premium) |
| Quebec | ~$11,800 (but with 16.5% federal abatement) |

Living in a lower-tax province while earning income from a higher-tax one can be a significant financial advantage.

## Common Scenarios

### 1. Living in Gatineau, Working in Ottawa

This is one of Canada's most common cross-province arrangements. You live in Quebec but work in Ontario.

- You pay **Quebec** provincial tax (higher rates)
- You pay federal tax with the **16.5% Quebec abatement**
- You pay **QPP** instead of CPP, and **QPIP** instead of regular EI parental
- Your employer should withhold Quebec rates, but some employers mistakenly withhold Ontario rates — check your pay stub

### 2. Living in Alberta, Working Remotely for a Toronto Company

- You pay **Alberta** provincial tax (lower rates)
- Your employer should set up payroll for Alberta
- You benefit from Alberta's higher BPA ($22,769 vs Ontario's $11,865) and no surtax or health premium
- No HST on your purchases either (Alberta has no provincial sales tax)

### 3. Moving Mid-Year

If you move from Ontario to BC on July 1, which province's rates apply? **BC's** — because you're a BC resident on December 31. You file one federal return and one BC provincial return for the entire year.

This can work in your favour if you move from a high-tax to a low-tax province before year-end.

## Payroll Withholding

Your employer is supposed to withhold provincial tax based on your province of residence, not your province of employment. In practice:

- **Correct:** Your employer uses your home address to determine provincial withholding
- **Common error:** Employer withholds based on office location instead of your address
- **What to do:** File a TD1 provincial form with your employer to ensure correct withholding

If too much tax was withheld (e.g., Ontario rates instead of Alberta), you'll get a refund when you file your tax return — but it means less cash flow throughout the year.

## Exceptions and Special Cases

### Quebec Employment

If you **work** in Quebec (physically present) but live elsewhere, your employer must still withhold Quebec source deductions (QPP, QPIP). You'll then claim credits on your home province's return to avoid double taxation. This is more complex than other cross-province situations.

### Northern Residents

If you live in a prescribed northern zone (parts of Yukon, NWT, Nunavut, or northern areas of several provinces), you may also claim the **Northern Residents Deduction** on your federal return — a deduction of up to $22/day for living in qualifying areas.

### Self-Employment

Self-employed individuals pay CPP based on their province of residence. There's no cross-province complication — your home province determines everything.

## Key Takeaway

Your December 31 address determines your provincial tax. If you have flexibility in where you live, the tax savings between provinces can be substantial. Use the [PayCalc comparison tool](/compare) to see the exact difference for your salary level.
`,
  },

  // === FRENCH GUIDES ===
  {
    slug: 'epargne-impot-reer',
    locale: 'fr',
    title: "Comment les cotisations au REER réduisent votre facture d'impôts",
    description: "Découvrez comment cotiser à un REER réduit votre revenu imposable et vous fait économiser sur les impôts au Canada.",
    date: '2026-01-15',
    readTime: '5 min',
    content: `
## Qu'est-ce qu'un REER?

Un **Régime enregistré d'épargne-retraite (REER)** est l'un des outils d'épargne fiscale les plus puissants offerts aux Canadiens. Quand vous cotisez à un REER, vous **réduisez votre revenu imposable** dollar pour dollar — ce qui signifie que vous payez moins d'impôts cette année tout en épargnant pour la retraite.

## Comment fonctionne la déduction fiscale

Votre cotisation au REER est soustraite de votre revenu brut avant le calcul de l'impôt. Par exemple :

- **Revenu brut :** 80 000 $
- **Cotisation au REER :** 10 000 $
- **Revenu imposable :** 70 000 $

Vous ne payez de l'impôt que sur 70 000 $, pas sur 80 000 $. Les économies d'impôt dépendent de votre **taux marginal d'imposition** — le taux d'imposition sur votre dernier dollar de revenu.

## Combien pouvez-vous économiser?

| Revenu | Cotisation REER | Économies d'impôt approximatives |
|--------|----------------|--------------------------------|
| 50 000 $ | 5 000 $ | 1 500 $ – 1 800 $ |
| 75 000 $ | 10 000 $ | 3 000 $ – 3 500 $ |
| 100 000 $ | 15 000 $ | 4 500 $ – 5 500 $ |
| 150 000 $ | 20 000 $ | 7 000 $ – 9 000 $ |

Plus votre revenu est élevé, plus vous économisez par dollar cotisé, car un revenu plus élevé vous place dans des tranches d'imposition plus hautes.

## Limites de cotisation au REER pour 2026

- **Cotisation maximale :** 18 % de votre revenu gagné l'année précédente, jusqu'à 32 490 $ pour 2026
- **Les droits inutilisés sont reportés** — vérifiez votre avis de cotisation de l'ARC pour votre limite exacte
- **Date limite :** 1er mars 2027 (pour l'année d'imposition 2026)

## Stratégies clés

1. **Cotisez dans les années à revenu élevé.** Si votre revenu varie, cotisez davantage dans les années où votre taux marginal est le plus élevé.
2. **REER de conjoint.** Cotisez au REER de votre conjoint pour fractionner le revenu à la retraite et potentiellement payer moins d'impôt globalement.
3. **Ne cotisez pas trop.** L'ARC impose une pénalité de 1 % par mois sur les cotisations dépassant votre limite de plus de 2 000 $.

## Essayez-le vous-même

Utilisez le [calculateur PayCalc](/) pour voir exactement comment une cotisation au REER affecte votre salaire net. Entrez votre salaire, puis ajoutez un montant de REER dans la section Options avancées pour voir la différence.
`,
  },
  {
    slug: 'comprendre-deductions-rpc',
    locale: 'fr',
    title: "RPC et RPC2 expliqués : Ce qui est déduit de votre paie en 2026",
    description: "Comprenez les cotisations au RPC et au RPC2, comment elles affectent votre paie, et ce que les taux 2026 signifient pour vous.",
    date: '2026-02-01',
    readTime: '5 min',
    content: `
## Qu'est-ce que le RPC?

Le **Régime de pensions du Canada (RPC)** est une pension de retraite obligatoire. Vous et votre employeur cotisez tous les deux. En tant qu'employé, votre part est déduite automatiquement de chaque paie.

## Taux du RPC pour 2026

| | Montant |
|--|---------|
| **Exemption de base** | 3 500 $ |
| **Maximum des gains ouvrant droit à pension (MGAP)** | 74 600 $ |
| **Taux de l'employé** | 5,95 % |
| **Cotisation maximale de l'employé** | 4 230,45 $ |

Vous cotisez au RPC sur les revenus entre 3 500 $ et 74 600 $. Une fois que vous avez atteint le maximum (4 230,45 $), plus aucun RPC n'est déduit pour le reste de l'année.

## Qu'est-ce que le RPC2?

À partir de 2024, le gouvernement a introduit le **RPC2** — une cotisation bonifiée sur les revenus plus élevés.

| | Montant |
|--|---------|
| **Maximum supplémentaire annuel (MSA)** | 85 000 $ |
| **Taux du RPC2** | 4,0 % |
| **Cotisation maximale au RPC2** | 416,00 $ |

Le RPC2 s'applique uniquement sur les revenus entre 74 600 $ (MGAP) et 85 000 $ (MSA). Si vous gagnez moins de 74 600 $, vous ne paierez aucun RPC2.

## Comment le RPC affecte votre paie

Pour un salaire de 80 000 $ :
- **RPC :** (74 600 $ - 3 500 $) × 5,95 % = **4 230,45 $** (maximum)
- **RPC2 :** (80 000 $ - 74 600 $) × 4,0 % = **216,00 $**
- **Total :** 4 446,45 $/an ou environ 171 $/paie (aux deux semaines)

## Québec : RRQ au lieu du RPC

Si vous travaillez au Québec, vous cotisez au **Régime de rentes du Québec (RRQ)** plutôt qu'au RPC. Le RRQ a des seuils similaires mais est administré par Revenu Québec. Le taux de l'employé est le même à 5,95 % pour 2026.

## Allez-vous récupérer votre argent?

Oui — les cotisations au RPC financent votre pension de retraite. Le montant que vous recevrez dépend de combien et combien de temps vous avez cotisé. Vous pouvez commencer à recevoir le RPC dès l'âge de 60 ans (réduit) ou jusqu'à 70 ans (bonifié).
`,
  },
  {
    slug: 'alberta-vs-ontario-salaire-net',
    locale: 'fr',
    title: 'Alberta vs Ontario : Où gardez-vous le plus?',
    description: 'Une comparaison détaillée du salaire net entre l\'Alberta et l\'Ontario pour différents niveaux de salaire.',
    date: '2026-03-15',
    readTime: '6 min',
    content: `
## Le portrait global

L'Alberta et l'Ontario sont les deux plus grandes économies du Canada, mais leurs structures fiscales sont très différentes. L'Alberta est régulièrement classée comme la **province la moins imposée** pour la plupart des niveaux de revenu, tandis que l'Ontario ajoute des couches supplémentaires comme la **contribution-santé de l'Ontario** et une **surtaxe** sur les hauts revenus.

## Différences clés

| Facteur | Alberta | Ontario |
|---------|---------|---------|
| Taux provincial le plus bas | 8,0 % | 5,05 % |
| Taux provincial le plus élevé | 15,0 % | 13,16 % |
| Montant personnel de base | 22 769 $ | 11 865 $ |
| Taxe de vente provinciale | Aucune | 8 % (TVH) |
| Contribution-santé | Aucune | Jusqu'à 900 $/an |
| Surtaxe | Aucune | Oui (20 % + 36 %) |

## Comparaison du salaire net

Voici combien de plus vous gardez en Alberta à différents niveaux de salaire :

| Salaire | Net en Alberta | Net en Ontario | Avantage Alberta |
|---------|---------------|---------------|-----------------|
| 50 000 $ | ~41 200 $ | ~39 800 $ | ~1 400 $ de plus |
| 75 000 $ | ~58 900 $ | ~56 500 $ | ~2 400 $ de plus |
| 100 000 $ | ~75 800 $ | ~72 200 $ | ~3 600 $ de plus |
| 150 000 $ | ~107 700 $ | ~102 100 $ | ~5 600 $ de plus |

## Pourquoi l'Alberta gagne

1. **Aucune taxe de vente provinciale.** Vous économisez 8 % sur pratiquement tout ce que vous achetez.
2. **Montant personnel de base plus élevé.** Le montant de 22 769 $ de l'Alberta est presque le double de celui de l'Ontario (11 865 $) — ce qui signifie que plus de revenu est complètement exempt d'impôt.
3. **Taux fixe de 8 % jusqu'à 151 234 $.** La plupart des Albertains ne paient que le taux provincial le plus bas.
4. **Pas de contribution-santé ni de surtaxe.** L'Ontario ajoute des charges supplémentaires en plus de l'impôt sur le revenu.

## Mais considérez le coût de la vie

Bien que l'avantage fiscal de l'Alberta soit clair, l'Ontario — surtout Toronto — offre souvent des salaires plus élevés pour le même poste. Les coûts de logement varient considérablement selon la ville. Utilisez l'[outil de comparaison PayCalc](/compare) pour calculer vos propres chiffres.
`,
  },
  {
    slug: 'pourquoi-taux-imposition-different',
    locale: 'fr',
    title: "Pourquoi votre taux d'imposition n'est pas ce que vous pensez",
    description: "Comprenez la différence entre le taux marginal et le taux effectif d'imposition, et pourquoi gagner plus ne signifie jamais gagner moins.",
    date: '2026-04-30',
    readTime: '4 min',
    content: `
## Le mythe fiscal le plus répandu

Beaucoup de Canadiens croient que s'ils gagnent assez pour entrer dans une tranche d'imposition supérieure, **tout** leur revenu est imposé au taux plus élevé. C'est faux. Le Canada utilise un système d'imposition **progressif** — seul le revenu *à l'intérieur* de chaque tranche est imposé au taux de cette tranche.

## Taux marginal vs taux effectif

- **Taux marginal :** Le taux d'imposition sur votre **prochain** dollar de revenu. C'est le taux de la tranche dans laquelle vous vous trouvez.
- **Taux effectif :** Le taux **moyen** sur l'ensemble de votre revenu — votre impôt total divisé par votre revenu total.

## Exemple : Salaire de 100 000 $ (fédéral seulement, 2026)

| Tranche | Revenu dans la tranche | Taux | Impôt |
|---------|----------------------|------|-------|
| 0 $ – 58 523 $ | 58 523 $ | 14,0 % | 8 193 $ |
| 58 523 $ – 100 000 $ | 41 477 $ | 20,5 % | 8 503 $ |
| **Total** | **100 000 $** | | **16 696 $** |

Après le crédit pour montant personnel de base (~2 303 $) et le crédit canadien pour emploi (~210 $), votre impôt fédéral net est d'environ **14 183 $**.

- **Taux marginal :** 20,5 % (la tranche dans laquelle tombe votre revenu)
- **Taux effectif :** 14,2 % (14 183 $ ÷ 100 000 $)

## Pourquoi gagner plus ne fait jamais mal

Si vous obtenez une augmentation de 5 000 $, passant de 100 000 $ à 105 000 $ :
- Seuls les 5 000 $ supplémentaires sont imposés à 20,5 %
- Impôt additionnel : ~1 025 $
- Vous conservez encore ~3 975 $ de l'augmentation

**Vous gardez toujours la majorité de toute augmentation.** Il n'existe aucun scénario où gagner plus entraîne un salaire net inférieur.

## Taux combinés

N'oubliez pas que vous payez à la fois l'impôt fédéral et provincial. Votre taux marginal combiné est la somme des deux. Par exemple, en Ontario à 100 000 $ :
- Taux marginal fédéral : 20,5 %
- Taux marginal Ontario : 9,15 %
- **Taux marginal combiné : 29,65 %**

Au Québec, le calcul est légèrement différent grâce à l'abattement fédéral de 16,5 %, qui réduit votre impôt fédéral. Votre taux marginal fédéral effectif au Québec serait environ 17,1 % (20,5 % × 0,835), mais le taux provincial québécois est plus élevé (19 % dans la tranche de 100 000 $).

Utilisez le [calculateur PayCalc](/) pour voir vos taux marginaux et effectifs exacts pour tout salaire et toute province.
`,
  },
];

export function getGuidesByLocale(locale: string): Guide[] {
  return GUIDES.filter((g) => g.locale === locale);
}

export function getGuide(slug: string, locale: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug && g.locale === locale);
}

export function getAllGuideSlugs(): { locale: string; slug: string }[] {
  return GUIDES.map((g) => ({ locale: g.locale, slug: g.slug }));
}
