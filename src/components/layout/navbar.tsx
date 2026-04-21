'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Calculator, Menu, X } from 'lucide-react';

function NavbarInner() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLocale = locale === 'en' ? 'fr' : 'en';
  const localeLabel = locale === 'en' ? 'FR' : 'EN';

  function switchLanguage() {
    const params = searchParams.toString();
    const fullPath = params ? `${pathname}?${params}` : pathname;
    router.replace(fullPath, { locale: otherLocale });
  }

  const navLinks = [
    { href: '/' as const, label: t('calculator') },
    { href: '/compare' as const, label: t('compare') },
    { href: '/tax-brackets' as const, label: t('taxBrackets') },
    { href: '/minimum-wage' as const, label: t('minimumWage') },
    { href: '/income-structure' as const, label: t('incomeStructure') },
    { href: '/guides' as const, label: t('guides') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="text-foreground">Pay</span>
          <span className="text-primary -ml-1.5">Calc</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language toggle + mobile menu button */}
        <div className="flex items-center gap-2">
          <button
            onClick={switchLanguage}
            aria-label={locale === 'en' ? 'Passer au français' : 'Switch to English'}
            className="rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {localeLabel}
          </button>

          <button
            className="md:hidden rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense>
      <NavbarInner />
    </Suspense>
  );
}
