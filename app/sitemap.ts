import { MetadataRoute } from 'next';
import { getTourSlugs } from '@/lib/queries/tours';
import { getEventSlugs } from '@/lib/queries/events';
import { getArticleSlugs } from '@/lib/queries/articles';
import { getDestinationSlugs } from '@/lib/queries/destinations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';
  const locales = ['fr', 'en', 'es'];

  // Static routes
  const staticRoutes = [
    '',
    '/circuits',
    '/excursions',
    '/events',
    '/blog',
    '/about',
    '/contact',
    '/faq',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static routes with alternates
  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            fr: `${siteUrl}/fr${route}`,
            en: `${siteUrl}/en${route}`,
            es: `${siteUrl}/es${route}`,
          },
        },
      });
    }
  }

  // Dynamic tours (circuits and excursions)
  const [tours, events, articles, destinations] = await Promise.all([
    getTourSlugs().catch(() => []),
    getEventSlugs().catch(() => []),
    getArticleSlugs().catch(() => []),
    getDestinationSlugs().catch(() => []),
  ]);

  for (const tour of tours) {
    if (!tour.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/circuits/${tour.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            fr: `${siteUrl}/fr/circuits/${tour.slug}`,
            en: `${siteUrl}/en/circuits/${tour.slug}`,
            es: `${siteUrl}/es/circuitos/${tour.slug}`,
          },
        },
      });
    }
  }

  for (const event of events) {
    if (!event.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/events/${event.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  for (const article of articles) {
    if (!article.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  for (const dest of destinations) {
    if (!dest.slug) continue;
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/destinations/${dest.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
