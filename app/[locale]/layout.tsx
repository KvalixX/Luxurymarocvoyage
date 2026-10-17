import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import '@/app/globals.css';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';

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
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        'x-default': `${siteUrl}/fr`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: `${siteUrl}/${locale}`,
      siteName: 'Luxurymarocvoyage',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Voyage de luxe au Maroc',
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

  // Structured Data (Organization + TravelAgency Schema)
  const agencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Luxurymarocvoyage',
    url: 'https://www.luxurymarocvoyage.com',
    logo: 'https://www.luxurymarocvoyage.com/logo.png',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description:
      'Agence de voyage réceptive haut de gamme à Marrakech. Circuits privés au Maroc, bivouacs dans le Sahara et excursions exclusives.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Boulevard Mohammed V, Guéliz',
      addressLocality: 'Marrakech',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.6295',
      longitude: '-7.9811',
    },
    telephone: '+212600000000',
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
    ],
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
      </head>
      <body className="min-h-screen flex flex-col bg-morocco-cream text-morocco-dark antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
