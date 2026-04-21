import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema } from '@/components/layout/json-ld';
import { Link } from '@/i18n/navigation';
import { getGuidesByLocale } from '@/lib/guides';
import { BookOpen, Clock } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://paycalc.ca';

  return {
    title: locale === 'fr' ? 'Guides fiscaux | PayCalc' : 'Tax Guides | PayCalc',
    description: locale === 'fr'
      ? "Guides et articles sur les impôts canadiens, le RPC, le REER et plus encore."
      : 'Guides and articles about Canadian taxes, CPP, RRSP, and more.',
    alternates: {
      canonical: `${baseUrl}/${locale}/guides`,
      languages: { en: `${baseUrl}/en/guides`, fr: `${baseUrl}/fr/guides` },
    },
  };
}

export default function GuidesPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();
  const guides = getGuidesByLocale(locale);

  return (
    <>
      <Hreflang path="/guides" />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('nav.guides'), url: `/${locale}/guides` },
        ])}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('nav.guides')}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {locale === 'fr'
              ? "Apprenez-en plus sur les impôts canadiens et comment maximiser votre salaire net."
              : 'Learn more about Canadian taxes and how to maximize your take-home pay.'}
          </p>
        </div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card className="transition-colors hover:bg-muted/30 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {guide.description}
                      </CardDescription>
                    </div>
                    <BookOpen className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {guide.readTime}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{guide.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {guides.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {locale === 'fr'
                ? 'Aucun guide disponible dans cette langue pour le moment.'
                : 'No guides available in this language yet.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
