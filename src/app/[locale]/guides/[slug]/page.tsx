import { use } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hreflang } from '@/components/layout/hreflang';
import { JsonLd, breadcrumbSchema } from '@/components/layout/json-ld';
import { Markdown } from '@/components/markdown';
import { Link } from '@/i18n/navigation';
import { getGuide, getAllGuideSlugs } from '@/lib/guides';
import { ArrowLeft, Clock } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllGuideSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug, locale);
  if (!guide) return {};

  const baseUrl = 'https://paycalc.ca';

  return {
    title: `${guide.title} | PayCalc`,
    description: guide.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/guides/${slug}`,
    },
  };
}

export default function GuidePage({ params }: Props) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();
  const guide = getGuide(slug, locale);

  if (!guide) notFound();

  return (
    <>
      <Hreflang path={`/guides/${slug}`} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'PayCalc', url: `/${locale}` },
          { name: t('nav.guides'), url: `/${locale}/guides` },
          { name: guide.title, url: `/${locale}/guides/${slug}` },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Back link */}
        <Link
          href="/guides"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.backToHome')}
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {guide.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            {guide.readTime}
          </Badge>
          <span className="text-xs text-muted-foreground">{guide.date}</span>
        </div>

        {/* Content */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <Markdown content={guide.content} />
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('common.disclaimer', { year: '2026' })}
        </p>
      </article>
    </>
  );
}
