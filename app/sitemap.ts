import { MetadataRoute } from 'next';
import { getTourSlugs } from '@/lib/queries/tours';
import { getEventSlugs } from '@/lib/queries/events';
import { getArticleSlugs } from '@/lib/queries/articles';
import { getDestinationSlugs } from '@/lib/queries/destinations';
import { localizedUrl } from '@/lib/seo/urls';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['fr', 'en', 'es'];

  // Static routes
  const staticRoutes = [
    '',
    '/circuits',
    '/excursions',
    '/events',
    '/blog',
    '/destinations',
    '/about',
    '/contact',
    '/faq',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static routes with alternates
  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, route || '/'),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            fr: localizedUrl('fr', route || '/'),
            en: localizedUrl('en', route || '/'),
            es: localizedUrl('es', route || '/'),
            'x-default': localizedUrl('fr', route || '/'),
          },
        },
      });
    }
  }

  // Dynamic tours (circuits and excursions)
  const [circuits, excursions, events, articles, destinations] = await Promise.all([
    getTourSlugs('circuit').catch(() => []),
    getTourSlugs('excursion').catch(() => []),
    getEventSlugs().catch(() => []),
    getArticleSlugs().catch(() => []),
    getDestinationSlugs().catch(() => []),
  ]);

  for (const [trips, route] of [[circuits, '/circuits/[slug]'], [excursions, '/excursions/[slug]']] as const) {
    for (const tour of trips) {
      if (!tour.slug) continue;
      for (const locale of locales) {
        entries.push({
          url: localizedUrl(locale, route, { slug: tour.slug }),
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: {
            languages: {
              fr: localizedUrl('fr', route, { slug: tour.slug }),
              en: localizedUrl('en', route, { slug: tour.slug }),
              es: localizedUrl('es', route, { slug: tour.slug }),
              'x-default': localizedUrl('fr', route, { slug: tour.slug }),
            },
          },
        });
      }
    }
  }

  for (const event of events) {
    if (!event.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, '/events/[slug]', { slug: event.slug }),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            fr: localizedUrl('fr', '/events/[slug]', { slug: event.slug }),
            en: localizedUrl('en', '/events/[slug]', { slug: event.slug }),
            es: localizedUrl('es', '/events/[slug]', { slug: event.slug }),
            'x-default': localizedUrl('fr', '/events/[slug]', { slug: event.slug }),
          },
        },
      });
    }
  }

  for (const article of articles) {
    if (!article.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, '/blog/[slug]', { slug: article.slug }),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            fr: localizedUrl('fr', '/blog/[slug]', { slug: article.slug }),
            en: localizedUrl('en', '/blog/[slug]', { slug: article.slug }),
            es: localizedUrl('es', '/blog/[slug]', { slug: article.slug }),
            'x-default': localizedUrl('fr', '/blog/[slug]', { slug: article.slug }),
          },
        },
      });
    }
  }

  for (const dest of destinations) {
    if (!dest.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, '/destinations/[slug]', { slug: dest.slug }),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            fr: localizedUrl('fr', '/destinations/[slug]', { slug: dest.slug }),
            en: localizedUrl('en', '/destinations/[slug]', { slug: dest.slug }),
            es: localizedUrl('es', '/destinations/[slug]', { slug: dest.slug }),
            'x-default': localizedUrl('fr', '/destinations/[slug]', { slug: dest.slug }),
          },
        },
      });
    }
  }

  return entries;
}
