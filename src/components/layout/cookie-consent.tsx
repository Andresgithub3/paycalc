'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

const CONSENT_KEY = 'paycalc-cookie-consent';

const text = {
  en: {
    message: 'We use cookies for analytics to improve your experience.',
    accept: 'Accept',
    decline: 'Decline',
    learnMore: 'Privacy Policy',
  },
  fr: {
    message: "Nous utilisons des cookies d'analyse pour améliorer votre expérience.",
    accept: 'Accepter',
    decline: 'Refuser',
    learnMore: 'Politique de confidentialité',
  },
};

export function CookieConsent() {
  const locale = useLocale() as 'en' | 'fr';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setVisible(false);
    // Enable GA4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
  }

  if (!visible) return null;

  const t = text[locale];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t.message}{' '}
          <a
            href={`/${locale}/privacy`}
            className="underline hover:text-primary"
          >
            {t.learnMore}
          </a>
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
