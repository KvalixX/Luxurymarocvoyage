import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { getDestinationBySlug, getDestinationSlugs } from '@/lib/queries/destinations';
import { getTours } from '@/lib/queries/tours';
import { getTranslations } from 'next-intl/server';
import DestinationTourCarousel from '@/components/destinations/DestinationTourCarousel';
import DestinationInquiryForm from '@/components/destinations/DestinationInquiryForm';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { MapPin, Sparkles } from 'lucide-react';
import { localizedAlternates, localizedUrl } from '@/lib/seo/urls';
import { seoDescription } from '@/lib/seo/text';

interface DestinationDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  const locales = ['fr', 'en', 'es'];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const item of slugs) {
      if (item.slug) {
        params.push({ locale, slug: item.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const destination = await getDestinationBySlug(slug, locale);

  if (!destination) return { title: 'Destination Non Trouvée' };

  const canonicalUrl = localizedUrl(locale, '/destinations/[slug]', { slug });

  const cleanDesc = seoDescription(
    destination.presentation,
    locale === 'en'
      ? `Travel guide to ${destination.name}, Morocco. Discover places to visit and experiences with Luxury Maroc Voyage.`
      : locale === 'es'
        ? `Guía de viaje de ${destination.name}, Marruecos. Descubre lugares y experiencias con Luxury Maroc Voyage.`
        : `Guide de voyage de ${destination.name}, au Maroc. Découvrez les lieux et expériences avec Luxury Maroc Voyage.`,
  );

  return {
    title: locale === 'en' ? `Morocco Travel Guide: ${destination.name}` : locale === 'es' ? `Gu\u00eda de viaje de Marruecos: ${destination.name}` : `Voyage au Maroc : ${destination.name}`,
    description: cleanDesc,
    alternates: localizedAlternates(locale, '/destinations/[slug]', { slug }),
    openGraph: {
      title: `Voyage à ${destination.name}`,
      description: cleanDesc,
      url: canonicalUrl,
      images: destination.image ? [{ url: destination.image }] : [],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { locale, slug } = await params;
  const destination = await getDestinationBySlug(slug, locale);

  if (!destination) {
    notFound();
  }

  const [circuits, excursions] = await Promise.all([
    getTours(locale, { typeFilter: 'circuit', destinationId: destination.id, limit: 6 }),
    getTours(locale, { typeFilter: 'excursion', destinationId: destination.id, limit: 6 }),
  ]);
  const tSections = await getTranslations({ locale, namespace: 'sections' });

  const breadcrumbs = [
    { label: 'Destinations', href: '/destinations' },
    { label: destination.name },
  ];

  const defaultImage =
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85';
  const imageUrl =
    destination.image && destination.image.startsWith('http')
      ? destination.image
      : defaultImage;
  const mapTitle = locale === 'fr'
    ? `Situer ${destination.name}`
    : locale === 'es'
      ? `${destination.name} en el mapa`
      : `Find ${destination.name} on the map`;
  const mapDescription = locale === 'fr'
    ? `Explorez ${destination.name} et ses environs sur la carte.`
    : locale === 'es'
      ? `Explora ${destination.name} y sus alrededores en el mapa.`
      : `Explore ${destination.name} and the surrounding area on the map.`;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${destination.name}, Morocco`)}&z=11&output=embed`;

  // TouristDestination Schema.org structured data
  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.presentation,
    image: imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
    },
  };

  return (
    <div className="pt-20 pb-14 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDF8F2] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />

      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
        {/* Destination Hero Banner */}
        <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-[#F0E6D8]/50 bg-morocco-charcoal shadow-lg sm:aspect-[2.1/1]">
          <Image
            src={imageUrl}
            alt={destination.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-morocco-dark/75 via-morocco-dark/15 to-transparent" />

          <div className="absolute inset-0 flex max-w-3xl flex-col justify-end p-6 text-white sm:p-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sand-200 text-xs font-bold uppercase tracking-wider mb-3 w-fit border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#DF6951]" />
              <span>Destination Maroc</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {destination.name}
            </h1>
          </div>
        </div>

        {destination.presentation && (
          <section className="mb-6" aria-labelledby="destination-about-title">
            <h2 id="destination-about-title" className="mb-4 font-serif text-2xl font-bold text-[#181E4B]">
              {locale === 'fr' ? `À propos de ${destination.name}` : locale === 'es' ? `Sobre ${destination.name}` : `About ${destination.name}`}
            </h2>
            <p className="text-sm leading-7 text-slate-600 sm:text-base">{destination.presentation}</p>
          </section>
        )}

        <section aria-label={mapTitle} className="mb-8 overflow-hidden rounded-2xl border border-[#E9DDCD] bg-white shadow-[0_12px_36px_-24px_rgba(24,30,75,0.3)]">
          <div className="flex flex-col gap-1.5 px-5 py-4 sm:px-6 sm:py-5">
            <div className="section-eyebrow mb-0 w-fit"><MapPin className="h-3.5 w-3.5" /><span>{destination.name}</span></div>
            <h2 className="font-serif text-xl font-bold text-[#181E4B] sm:text-2xl">{mapTitle}</h2>
            <p className="text-sm text-slate-500">{mapDescription}</p>
          </div>
          <div className="h-[260px] w-full border-t border-[#E9DDCD] bg-[#F7F1E8] sm:h-[300px]">
            <iframe
              title={mapTitle}
              src={mapUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
          </main>

          <div className="lg:sticky lg:top-24">
            <DestinationInquiryForm destinationName={destination.name} locale={locale} circuits={circuits} excursions={excursions} />
          </div>
        </div>

        <div className="mb-8 space-y-8">
          {circuits.length > 0 && (
            <section aria-labelledby="destination-circuits-title">
              <div className="mb-4 max-w-2xl">
                <div className="section-eyebrow"><Sparkles className="h-3 w-3 text-[#DF6951]" /><span>{destination.name}</span></div>
                <h2 id="destination-circuits-title" className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{tSections('featuredCircuitsTitle')}</h2>
              </div>
              <DestinationTourCarousel tours={circuits} locale={locale} />
            </section>
          )}

          {excursions.length > 0 && (
            <section aria-labelledby="destination-excursions-title">
              <div className="mb-4 max-w-2xl">
                <div className="section-eyebrow"><Sparkles className="h-3 w-3 text-[#DF6951]" /><span>{destination.name}</span></div>
                <h2 id="destination-excursions-title" className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{tSections('popularExcursionsTitle')}</h2>
              </div>
              <DestinationTourCarousel tours={excursions} locale={locale} isExcursion />
            </section>
          )}

          {circuits.length === 0 && excursions.length === 0 && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#F0E6D8]/80 bg-white p-10 text-center shadow-[0_2px_12px_rgba(26,15,10,0.04)] sm:p-14">
              <p className="mb-2 font-serif text-lg font-bold text-[#181E4B]">
                Nos circuits pour {destination.name} sont en cours de mise à jour.
              </p>
              <p className="mb-6 text-xs text-slate-500">
                Contactez notre concierge de voyage pour un itinéraire personnalisé incluant cette étape.
              </p>
              <Link href="/contact" className="btn-primary">Demander un devis sur-mesure</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
