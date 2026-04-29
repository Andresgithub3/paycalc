import { use, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { MultiStreamCalculator } from '@/components/income/MultiStreamCalculator';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/layout/json-ld';

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = 'https://paycalc.ca';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('incomeTitle', { year: '2026' }),
    description: t('incomeDescription', { year: '2026' }),
    alternates: {
      canonical: `${BASE_URL}/${locale}/income`,
      languages: {
        en: `${BASE_URL}/en/income`,
        fr: `${BASE_URL}/fr/income`,
      },
    },
  };
}

function IncomeFAQs(locale: string) {
  if (locale === 'fr') {
    return [
      {
        question: "Qu'est-ce que le taux d'inclusion des gains en capital au Canada?",
        answer: "Le taux d'inclusion des gains en capital est de 50 %. Seule la moitié de vos gains en capital est incluse dans votre revenu imposable. La proposition d'augmenter ce taux a été annulée.",
      },
      {
        question: "Quelle est la différence entre les dividendes déterminés et non déterminés?",
        answer: "Les dividendes déterminés proviennent de sociétés canadiennes publiques et bénéficient d'une majoration de 38 % avec un crédit d'impôt plus élevé. Les dividendes non déterminés proviennent de sociétés privées (SPCC) avec une majoration de 15 % et un crédit plus faible.",
      },
      {
        question: "Comment le RPC fonctionne-t-il pour les travailleurs autonomes?",
        answer: "Les travailleurs autonomes paient les deux parts du RPC — la part de l'employé ET la part de l'employeur. La part de l'employeur est déductible du revenu imposable.",
      },
      {
        question: "Qu'est-ce que le crédit d'impôt pour dividendes?",
        answer: "Le crédit d'impôt pour dividendes (CID) est un crédit non remboursable qui réduit l'impôt sur les dividendes canadiens. Il compense partiellement l'impôt des sociétés déjà payé sur les bénéfices distribués.",
      },
      {
        question: "L'impôt minimum de remplacement (IMR) est-il inclus?",
        answer: "Non, ce calculateur ne tient pas compte de l'IMR, qui peut s'appliquer si vous avez d'importants gains en capital ou dividendes. Consultez un professionnel de l'impôt pour les scénarios complexes.",
      },
    ];
  }

  return [
    {
      question: 'What is the capital gains inclusion rate in Canada?',
      answer: 'The capital gains inclusion rate is 50%. Only half of your capital gains are included in taxable income. The proposal to increase this rate was cancelled.',
    },
    {
      question: 'What is the difference between eligible and ineligible dividends?',
      answer: 'Eligible dividends are from public Canadian corporations and receive a 38% gross-up with a higher dividend tax credit. Ineligible dividends are from private corporations (CCPCs) with a 15% gross-up and a lower credit.',
    },
    {
      question: 'How does CPP work for self-employed individuals?',
      answer: 'Self-employed individuals pay both the employee AND employer portions of CPP. The employer half is deductible from taxable income.',
    },
    {
      question: 'What is the dividend tax credit?',
      answer: 'The dividend tax credit (DTC) is a non-refundable credit that reduces tax on Canadian dividends. It partially offsets the corporate tax already paid on distributed profits.',
    },
    {
      question: 'Is the Alternative Minimum Tax (AMT) included?',
      answer: 'No, this calculator does not account for AMT, which may apply if you have significant capital gains or dividends. Consult a tax professional for complex scenarios.',
    },
  ];
}

export default function IncomePage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <Hreflang path="/income" />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('income.pageTitle'), url: `/${locale}/income` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: locale === 'fr'
            ? "Calculateur d'impôt sur les revenus de placement Canada"
            : 'Canadian Investment Income Tax Calculator',
          url: `${BASE_URL}/${locale}/income`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
          inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
        }}
      />
      <JsonLd data={faqSchema(IncomeFAQs(locale))} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('income.pageTitle')}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            {t('income.pageDescription')}
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-16 text-muted-foreground">{t('common.loading')}</div>}>
          <MultiStreamCalculator />
        </Suspense>

        <div className="mt-8 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            {t('common.disclaimer', { year: '2026' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('income.disclaimer')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('footer.notTaxAdvice')}
          </p>
          <p className="mt-2 text-sm">
            <Link href="/" className="text-primary hover:underline">
              {t('income.backToSalary')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
