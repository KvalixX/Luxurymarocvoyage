import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import FreeQuoteButton from '@/components/layout/FreeQuoteButton';
import { getTours } from '@/lib/queries/tours';
import { getPopularDestinations } from '@/lib/queries/destinations';
import { getUpcomingEvents } from '@/lib/queries/events';
import { getLatestArticles } from '@/lib/queries/articles';
import '@/app/globals.css';
import { WishlistProvider } from '@/components/wishlist/WishlistProvider';
import { localizedAlternates, localizedUrl } from '@/lib/seo/urls';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Luxurymarocvoyage | Circuits Privés & Voyages Sur-Mesure au Maroc',
    en: 'Luxurymarocvoyage | Private Tours & Tailor-Made Luxury Travel in Morocco',
    es: 'Luxurymarocvoyage | Circuitos Privados y Viajes de Lujo a Medida en Marruecos',
  };

  const descriptions: Record<string, string> = {
    fr: 'Agence réceptive de prestige à Marrakech. Découvrez nos circuits privés dans le Sahara, excursions exclusives, riads de charme et hébergements d’exception au Maroc.',
    en: 'Premier destination travel agency in Marrakech. Experience private Sahara desert tours, luxury riads, handpicked day excursions, and bespoke Moroccan holidays.',
    es: 'Agencia receptiva de élite en Marrakech. Especialistas en circuitos privados por el desierto del Sáhara, excursiones exclusivas y viajes a medida por Marruecos.',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxurymarocvoyage.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titles[locale] || titles.fr,
      template: '%s | Luxurymarocvoyage',
    },
    description: descriptions[locale] || descriptions.fr,
    keywords: [
      'voyage maroc',
      'circuit privé maroc',
      'morocco luxury tours',
      'desert tour merzouga',
      'excursion marrakech',
      'agence voyage marrakech',
      'morocco travel agency',
      'viajes a marruecos',
      'circuitos privados marruecos',
    ],
    authors: [{ name: 'Luxurymarocvoyage' }],
    icons: {
      icon: [
        { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/logos/apple-touch-icon.png',
    },
    alternates: localizedAlternates(locale, '/'),
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: localizedUrl(locale, '/'),
      siteName: 'Luxurymarocvoyage',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/logos/logo2-Photoroom.png`,
          width: 743,
          height: 439,
          alt: 'Luxury Maroc Voyage',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const [circuits, excursions, destinations, events, articles] = await Promise.all([
    getTours(locale, { typeFilter: 'circuit', limit: 5 }).catch(() => []),
    getTours(locale, { typeFilter: 'excursion', limit: 5 }).catch(() => []),
    getPopularDestinations(locale, 6).catch(() => []),
    getUpcomingEvents(locale, 4).catch(() => []),
    getLatestArticles(locale, 4).catch(() => []),
  ]);

  // Structured Data (Organization + TravelAgency Schema)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxurymarocvoyage.com';
  const agencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl}/#travel-agency`,
    name: 'Luxury Maroc Voyage',
    url: siteUrl,
    logo: `${siteUrl}/logos/android-chrome-512x512.png`,
    image: `${siteUrl}/logos/android-chrome-512x512.png`,
    email: 'contact@luxurymarocvoyage.com',
    telephone: '+212776715010',
    description: locale === 'fr'
      ? 'Agence de voyage à Marrakech spécialisée dans les circuits privés, excursions et voyages sur mesure au Maroc.'
      : locale === 'es'
        ? 'Agencia de viajes en Marrakech especializada en circuitos privados, excursiones y viajes a medida por Marruecos.'
        : 'Marrakech travel agency specializing in private tours, excursions, and tailor-made trips in Morocco.',
    sameAs: [
      'https://www.instagram.com/luxurymarocvoyage/',
      'https://www.tripadvisor.fr/Attraction_Review-g293734-d32981818-Reviews-Luxury_Maroc_Voyage-Marrakech_Marrakech_Safi.html',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bureau N°5, 2ème étage, Lot, 359',
      addressLocality: 'Marrakech',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Luxury Maroc Voyage',
    alternateName: 'Luxurymarocvoyage',
    url: siteUrl,
    publisher: { '@id': `${siteUrl}/#travel-agency` },
    inLanguage: locale,
  };

  return (
    <html
      lang={locale}
      className="scroll-smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agencySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-morocco-cream text-morocco-dark antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WishlistProvider>
            <Header circuits={circuits} excursions={excursions} destinations={destinations} events={events} articles={articles} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} circuits={circuits} excursions={excursions} destinations={destinations} events={events} articles={articles} />
            <WhatsAppButton />
            <FreeQuoteButton />
          </WishlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}




