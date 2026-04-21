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
