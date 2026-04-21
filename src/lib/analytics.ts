type EventParams = Record<string, string | number>;

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', name, params);
  }
}

export function trackSalaryCalculated(params: {
  amount: number;
  mode: string;
  province: string;
  year: number;
  locale: string;
}) {
  trackEvent('salary_calculated', params);
}

export function trackLanguageSwitched(from: string, to: string) {
  trackEvent('language_switched', { from, to });
}

export function trackProvinceChanged(province: string) {
  trackEvent('province_changed', { province });
}

export function trackComparisonCreated(provinces: string) {
  trackEvent('comparison_created', { provinces });
}

export function trackResultCopied() {
  trackEvent('result_copied');
}

export function trackGuideClicked(slug: string) {
  trackEvent('guide_clicked', { slug });
}
