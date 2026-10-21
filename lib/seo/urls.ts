import { getPathname } from '@/lib/i18n/navigation';
import type { Locale } from '@/lib/i18n/routing';

const locales: Locale[] = ['fr', 'en', 'es'];

export function localizedUrl(locale: string, pathname: string, params?: Record<string, string>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxurymarocvoyage.com';
  const href = params ? { pathname, params } : pathname;
  const localizedPath = getPathname({ locale: locale as Locale, href: href as never });
  return new URL(localizedPath, siteUrl).toString().replace(/\/$/, localizedPath === '/' ? '/' : '');
}

export function localizedAlternates(locale: string, pathname: string, params?: Record<string, string>) {
  const languages = Object.fromEntries(
    locales.map((language) => [language, localizedUrl(language, pathname, params)])
  );

  return {
    canonical: localizedUrl(locale, pathname, params),
    languages: {
      ...languages,
      'x-default': localizedUrl('fr', pathname, params),
    },
  };
}
