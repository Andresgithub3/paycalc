'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-bold text-foreground">PayCalc</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('common.tagline')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('footer.builtBy')}
            </p>
          </div>

          {/* Calculator links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('nav.calculator')}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/province/alberta" className="text-sm text-muted-foreground hover:text-primary">
                {t('provinces.AB')}
              </Link>
              <Link href="/province/ontario" className="text-sm text-muted-foreground hover:text-primary">
                {t('provinces.ON')}
              </Link>
              <Link href="/province/british-columbia" className="text-sm text-muted-foreground hover:text-primary">
                {t('provinces.BC')}
              </Link>
              <Link href="/province/quebec" className="text-sm text-muted-foreground hover:text-primary">
                {t('provinces.QC')}
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('nav.guides')}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/compare" className="text-sm text-muted-foreground hover:text-primary">
                {t('nav.compare')}
              </Link>
              <Link href="/tax-brackets" className="text-sm text-muted-foreground hover:text-primary">
                {t('nav.taxBrackets')}
              </Link>
              <Link href="/minimum-wage" className="text-sm text-muted-foreground hover:text-primary">
                {t('nav.minimumWage')}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('footer.legal')}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>{t('footer.copyright', { year })}</p>
          <p>{t('footer.notTaxAdvice')}</p>
        </div>
      </div>
    </footer>
  );
}
