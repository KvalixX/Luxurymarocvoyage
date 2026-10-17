import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/circuits': {
      fr: '/circuits',
      en: '/circuits',
      es: '/circuitos',
    },
    '/circuits/[slug]': {
      fr: '/circuits/[slug]',
      en: '/circuits/[slug]',
      es: '/circuitos/[slug]',
    },
    '/excursions': {
      fr: '/excursions',
      en: '/excursions',
      es: '/excursiones',
    },
    '/excursions/[slug]': {
      fr: '/excursions/[slug]',
      en: '/excursions/[slug]',
      es: '/excursiones/[slug]',
    },
    '/events': {
      fr: '/evenements',
      en: '/events',
      es: '/eventos',
    },
    '/events/[slug]': {
      fr: '/evenements/[slug]',
      en: '/events/[slug]',
      es: '/eventos/[slug]',
    },
    '/blog': {
      fr: '/blog',
      en: '/blog',
      es: '/blog',
    },
    '/blog/[slug]': {
      fr: '/blog/[slug]',
      en: '/blog/[slug]',
      es: '/blog/[slug]',
    },
    '/destinations': {
      fr: '/destinations',
      en: '/destinations',
      es: '/destinos',
    },
    '/destinations/[slug]': {
      fr: '/destinations/[slug]',
      en: '/destinations/[slug]',
      es: '/destinos/[slug]',
    },
    '/about': {
      fr: '/a-propos',
      en: '/about',
      es: '/sobre-nosotros',
    },
    '/contact': {
      fr: '/contact',
      en: '/contact',
      es: '/contacto',
    },
    '/faq': {
      fr: '/faq',
      en: '/faq',
      es: '/faq',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
