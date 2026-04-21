import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Hreflang } from '@/components/layout/hreflang';
import { Markdown } from '@/components/markdown';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://paycalc.ca';

  return {
    title: locale === 'fr' ? 'Politique de confidentialité | PayCalc' : 'Privacy Policy | PayCalc',
    description: locale === 'fr'
      ? 'Politique de confidentialité de PayCalc.'
      : 'PayCalc privacy policy.',
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: { en: `${baseUrl}/en/privacy`, fr: `${baseUrl}/fr/privacy` },
    },
  };
}

const enContent = `# Privacy Policy

**Last updated:** January 2026

PayCalc operates the paycalc.ca website. This page informs you of our policies regarding the collection, use, and disclosure of information when you use our service.

## Calculator Data

All salary calculations are performed entirely in your browser. **We do not collect, store, or transmit any salary or income data to our servers.**

## Analytics

We use Google Analytics 4 (GA4) to understand how visitors interact with our site. GA4 may collect:

- Pages visited and time spent
- Browser type and device information
- Approximate geographic location (country/region level)
- Referral source

IP addresses are anonymized. We do not collect personally identifiable information (PII) through analytics.

We also use Vercel Analytics and Speed Insights for performance monitoring.

## Cookies

We use cookies for:

- **Analytics cookies** (Google Analytics) — to understand site usage
- **Advertising cookies** (Google AdSense) — to display relevant advertisements
- **Preference cookies** — to remember your language preference

You can manage cookie preferences through our cookie consent banner or your browser settings.

## Advertising

We use Google AdSense to display advertisements. AdSense may use cookies to serve ads based on your prior visits to our site or other websites. You can opt out of personalized advertising at [Google Ad Settings](https://adssettings.google.com/).

## Data Retention

We do not store personal data. Analytics data is retained according to Google Analytics' standard retention policies.

## Your Rights

You have the right to:

- Decline cookies via our consent banner
- Use browser tools to block cookies
- Request information about data collected through analytics

## Children's Privacy

Our service is not directed at anyone under the age of 13. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

## Contact

For questions about this privacy policy, please visit our website at paycalc.ca.`;

const frContent = `# Politique de confidentialité

**Dernière mise à jour :** janvier 2026

PayCalc exploite le site Web paycalc.ca. Cette page vous informe de nos politiques concernant la collecte, l'utilisation et la divulgation d'informations lorsque vous utilisez notre service.

## Données du calculateur

Tous les calculs de salaire sont effectués entièrement dans votre navigateur. **Nous ne collectons, ne stockons et ne transmettons aucune donnée de salaire ou de revenu à nos serveurs.**

## Analytique

Nous utilisons Google Analytics 4 (GA4) pour comprendre comment les visiteurs interagissent avec notre site. GA4 peut collecter :

- Les pages visitées et le temps passé
- Le type de navigateur et les informations sur l'appareil
- La localisation géographique approximative (niveau pays/région)
- La source de référence

Les adresses IP sont anonymisées. Nous ne collectons pas d'informations personnellement identifiables via l'analytique.

Nous utilisons également Vercel Analytics et Speed Insights pour la surveillance des performances.

## Cookies

Nous utilisons des cookies pour :

- **Cookies d'analytique** (Google Analytics) — pour comprendre l'utilisation du site
- **Cookies publicitaires** (Google AdSense) — pour afficher des publicités pertinentes
- **Cookies de préférence** — pour mémoriser votre préférence linguistique

Vous pouvez gérer vos préférences de cookies via notre bannière de consentement ou les paramètres de votre navigateur.

## Publicité

Nous utilisons Google AdSense pour afficher des publicités. AdSense peut utiliser des cookies pour diffuser des annonces basées sur vos visites antérieures. Vous pouvez refuser la publicité personnalisée dans les [Paramètres des annonces Google](https://adssettings.google.com/).

## Conservation des données

Nous ne stockons pas de données personnelles. Les données analytiques sont conservées conformément aux politiques de conservation standard de Google Analytics.

## Vos droits

Vous avez le droit de :

- Refuser les cookies via notre bannière de consentement
- Utiliser les outils de votre navigateur pour bloquer les cookies
- Demander des informations sur les données collectées via l'analytique

## Confidentialité des enfants

Notre service ne s'adresse pas aux personnes de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants.

## Modifications de cette politique

Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page.

## Contact

Pour toute question concernant cette politique de confidentialité, veuillez visiter notre site Web à paycalc.ca.`;

export default function PrivacyPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const content = locale === 'fr' ? frContent : enContent;

  return (
    <>
      <Hreflang path="/privacy" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <Markdown content={content} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
