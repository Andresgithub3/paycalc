interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE_URL = 'https://paycalc.ca';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PayCalc',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description: 'Free Canadian salary and income tax calculator.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Edmonton',
      addressRegion: 'AB',
      addressCountry: 'CA',
    },
  };
}

export function websiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PayCalc',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    description:
      locale === 'fr'
        ? 'Calculateur de salaire et d\'impôt canadien gratuit.'
        : 'Free Canadian salary and income tax calculator.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/${locale}?amount={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webApplicationSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'fr' ? 'PayCalc — Calculateur de salaire canadien' : 'PayCalc — Canadian Salary Calculator',
    url: `${BASE_URL}/${locale}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
    },
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    description:
      locale === 'fr'
        ? 'Convertissez salaire ↔ taux horaire, voyez votre ventilation d\'impôts fédéral et provincial.'
        : 'Convert salary ↔ hourly, see your federal + provincial tax breakdown.',
  };
}

export function breadcrumbSchema(
  locale: string,
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
