import { routing } from '@/i18n/routing';

interface HreflangProps {
  path: string; // path without locale prefix, e.g. "/" or "/province/alberta"
}

const BASE_URL = 'https://paycalc.ca';

export function Hreflang({ path }: HreflangProps) {
  return (
    <>
      {routing.locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${BASE_URL}/${locale}${path === '/' ? '' : path}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE_URL}/en${path === '/' ? '' : path}`}
      />
    </>
  );
}
