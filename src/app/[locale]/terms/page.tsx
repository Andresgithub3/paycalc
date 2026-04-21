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
    title: locale === 'fr' ? "Conditions d'utilisation | PayCalc" : 'Terms of Use | PayCalc',
    description: locale === 'fr'
      ? "Conditions d'utilisation de PayCalc."
      : 'PayCalc terms of use.',
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: { en: `${baseUrl}/en/terms`, fr: `${baseUrl}/fr/terms` },
    },
  };
}

const enContent = `# Terms of Use

**Last updated:** January 2026

By using PayCalc (paycalc.ca), you agree to these terms.

## Disclaimer

**This calculator provides estimates based on 2026 CRA tax tables. Actual deductions may vary.**

PayCalc is provided for informational purposes only and does not constitute tax advice, financial advice, or any other type of professional advice. You should consult a qualified tax professional for advice specific to your situation.

## Accuracy

While we strive to maintain accurate and up-to-date tax calculations based on published CRA tax tables, we make no warranties or representations about the accuracy, completeness, or reliability of the calculations provided.

Tax rules are complex and may change. Special circumstances (self-employment, multiple income sources, tax credits, deductions beyond RRSP, etc.) are not fully accounted for in this calculator.

## Use of Service

You agree to use PayCalc only for lawful purposes and in accordance with these terms. You may not:

- Use the service in any way that violates applicable law
- Attempt to interfere with the proper functioning of the service
- Use automated systems to access the service in a manner that sends more requests than a human can reasonably produce

## Intellectual Property

All content, design, and code of PayCalc are the property of PayCalc. You may not reproduce, distribute, or create derivative works without permission.

## Limitation of Liability

In no event shall PayCalc be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the service or reliance on the calculations provided.

## Privacy

Your use of PayCalc is also governed by our [Privacy Policy](/en/privacy).

## Changes

We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any modified terms.

## Governing Law

These terms are governed by the laws of the Province of Alberta, Canada.`;

const frContent = `# Conditions d'utilisation

**Dernière mise à jour :** janvier 2026

En utilisant PayCalc (paycalc.ca), vous acceptez ces conditions.

## Avertissement

**Ce calculateur fournit des estimations basées sur les tables d'impôt de l'ARC 2026. Les déductions réelles peuvent varier.**

PayCalc est fourni à titre informatif seulement et ne constitue pas un conseil fiscal, un conseil financier ou tout autre type de conseil professionnel. Vous devriez consulter un professionnel de la fiscalité qualifié pour des conseils spécifiques à votre situation.

## Exactitude

Bien que nous nous efforcions de maintenir des calculs fiscaux précis et à jour basés sur les tables d'impôt publiées par l'ARC, nous ne faisons aucune garantie quant à l'exactitude, l'exhaustivité ou la fiabilité des calculs fournis.

Les règles fiscales sont complexes et peuvent changer. Les circonstances particulières (travail autonome, sources de revenus multiples, crédits d'impôt, déductions au-delà du REER, etc.) ne sont pas entièrement prises en compte dans ce calculateur.

## Utilisation du service

Vous acceptez d'utiliser PayCalc uniquement à des fins légales et conformément à ces conditions. Vous ne pouvez pas :

- Utiliser le service d'une manière qui viole la loi applicable
- Tenter d'interférer avec le bon fonctionnement du service
- Utiliser des systèmes automatisés pour accéder au service de manière excessive

## Propriété intellectuelle

Tout le contenu, le design et le code de PayCalc sont la propriété de PayCalc. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans permission.

## Limitation de responsabilité

En aucun cas PayCalc ne sera responsable de tout dommage direct, indirect, accessoire, spécial ou consécutif découlant de votre utilisation du service ou de votre confiance dans les calculs fournis.

## Confidentialité

Votre utilisation de PayCalc est également régie par notre [Politique de confidentialité](/fr/privacy).

## Modifications

Nous nous réservons le droit de modifier ces conditions à tout moment. L'utilisation continue du service constitue l'acceptation de toute condition modifiée.

## Droit applicable

Ces conditions sont régies par les lois de la Province de l'Alberta, Canada.`;

export default function TermsPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const content = locale === 'fr' ? frContent : enContent;

  return (
    <>
      <Hreflang path="/terms" />
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
