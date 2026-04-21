import type { Province } from './tax/types';

interface FAQ {
  q: { en: string; fr: string };
  a: { en: string; fr: string };
}

const COMMON_FAQ: FAQ[] = [
  {
    q: {
      en: 'How is income tax calculated in Canada?',
      fr: "Comment l'impôt sur le revenu est-il calculé au Canada?",
    },
    a: {
      en: 'Canada uses a progressive tax system. You pay federal tax plus provincial/territorial tax. Each has its own brackets — you only pay the higher rate on income above each threshold, not on your entire income.',
      fr: "Le Canada utilise un système d'imposition progressif. Vous payez l'impôt fédéral plus l'impôt provincial/territorial. Chacun a ses propres tranches — vous ne payez le taux plus élevé que sur le revenu dépassant chaque seuil, pas sur la totalité de votre revenu.",
    },
  },
  {
    q: {
      en: 'What is the Basic Personal Amount (BPA)?',
      fr: "Qu'est-ce que le montant personnel de base (MPB)?",
    },
    a: {
      en: "The BPA is the amount of income you can earn before paying any tax. For 2026, the federal BPA is up to $16,452. Each province also has its own BPA. It's applied as a non-refundable tax credit.",
      fr: "Le MPB est le montant de revenu que vous pouvez gagner avant de payer de l'impôt. Pour 2026, le MPB fédéral est jusqu'à 16 452 $. Chaque province a aussi son propre MPB. Il est appliqué comme crédit d'impôt non remboursable.",
    },
  },
];

const PROVINCE_FAQ: Partial<Record<Province, FAQ[]>> = {
  AB: [
    {
      q: {
        en: 'Why is Alberta considered a low-tax province?',
        fr: "Pourquoi l'Alberta est-elle considérée comme une province à faible imposition?",
      },
      a: {
        en: 'Alberta has no provincial sales tax (PST), a flat 8% rate on the first $151,234 of income, and the highest basic personal amount among provinces at $22,769. Combined with no health premium or surtax, most Albertans keep more of their pay.',
        fr: "L'Alberta n'a pas de taxe de vente provinciale (TVP), un taux uniforme de 8 % sur les premiers 151 234 $ de revenu, et le montant personnel de base le plus élevé parmi les provinces à 22 769 $. Sans prime de santé ni surtaxe, la plupart des Albertains conservent davantage de leur salaire.",
      },
    },
  ],
  ON: [
    {
      q: {
        en: 'What is the Ontario Health Premium?',
        fr: "Qu'est-ce que la cotisation-santé de l'Ontario?",
      },
      a: {
        en: "The Ontario Health Premium is a graduated levy on taxable income over $20,000. It ranges from $0 to a maximum of $900/year. It's separate from income tax and helps fund Ontario's health care system.",
        fr: "La cotisation-santé de l'Ontario est un prélèvement progressif sur le revenu imposable supérieur à 20 000 $. Elle varie de 0 $ à un maximum de 900 $/an. Elle est distincte de l'impôt sur le revenu et contribue au financement du système de santé de l'Ontario.",
      },
    },
    {
      q: {
        en: 'Does Ontario have a surtax?',
        fr: "L'Ontario a-t-elle une surtaxe?",
      },
      a: {
        en: 'Yes. Ontario adds a surtax of 20% on basic provincial tax over $5,315 plus 36% on basic provincial tax over $6,802. This effectively increases the marginal rate for higher earners.',
        fr: "Oui. L'Ontario ajoute une surtaxe de 20 % sur l'impôt provincial de base supérieur à 5 315 $ plus 36 % sur l'impôt provincial de base supérieur à 6 802 $. Cela augmente effectivement le taux marginal pour les contribuables à revenu élevé.",
      },
    },
  ],
  QC: [
    {
      q: {
        en: 'How is Quebec different from other provinces for taxes?',
        fr: "En quoi le Québec est-il différent des autres provinces en matière d'impôts?",
      },
      a: {
        en: 'Quebec administers its own income tax system through Revenu Québec. It uses the Quebec Pension Plan (QPP) instead of CPP, has QPIP for parental insurance, and Quebec residents receive a 16.5% federal tax abatement. Quebec also files a separate provincial tax return.',
        fr: "Le Québec administre son propre régime d'impôt sur le revenu par l'intermédiaire de Revenu Québec. Il utilise le Régime de rentes du Québec (RRQ) au lieu du RPC, a le RQAP pour l'assurance parentale, et les résidents du Québec reçoivent un abattement fiscal fédéral de 16,5 %. Le Québec produit aussi une déclaration de revenus provinciale distincte.",
      },
    },
    {
      q: {
        en: 'What is the Quebec federal tax abatement?',
        fr: "Qu'est-ce que l'abattement fiscal fédéral du Québec?",
      },
      a: {
        en: "Quebec residents receive a 16.5% reduction on their federal tax. This is because Quebec administers its own programs (like QPP and QPIP) that are federally administered in other provinces. The abatement compensates for this — it's applied automatically.",
        fr: "Les résidents du Québec bénéficient d'une réduction de 16,5 % de leur impôt fédéral. C'est parce que le Québec administre ses propres programmes (comme le RRQ et le RQAP) qui sont administrés par le fédéral dans les autres provinces. L'abattement compense cela — il est appliqué automatiquement.",
      },
    },
  ],
  BC: [
    {
      q: {
        en: 'Why does BC have 7 tax brackets?',
        fr: 'Pourquoi la C.-B. a-t-elle 7 tranches d\'imposition?',
      },
      a: {
        en: 'British Columbia has the most tax brackets of any province (7), creating a highly progressive system. Rates range from 5.06% on the first $47,937 up to 20.5% on income over $259,073. This means higher earners pay proportionally more.',
        fr: "La Colombie-Britannique a le plus grand nombre de tranches d'imposition parmi les provinces (7), créant un système hautement progressif. Les taux vont de 5,06 % sur les premiers 47 937 $ à 20,5 % sur le revenu supérieur à 259 073 $.",
      },
    },
  ],
  NB: [
    {
      q: {
        en: 'Is New Brunswick a bilingual province?',
        fr: 'Le Nouveau-Brunswick est-il une province bilingue?',
      },
      a: {
        en: "Yes, New Brunswick is Canada's only officially bilingual province. Government services, including tax information, are available in both English and French. The province has 4 tax brackets with rates from 9.4% to 19.5%.",
        fr: "Oui, le Nouveau-Brunswick est la seule province officiellement bilingue du Canada. Les services gouvernementaux, y compris les renseignements fiscaux, sont disponibles en anglais et en français. La province a 4 tranches d'imposition avec des taux de 9,4 % à 19,5 %.",
      },
    },
  ],
};

export function getProvinceFAQ(province: Province): FAQ[] {
  return [...COMMON_FAQ, ...(PROVINCE_FAQ[province] || [])];
}
