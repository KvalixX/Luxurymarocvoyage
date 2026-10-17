import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { getDestinationBySlug, getDestinationSlugs } from '@/lib/queries/destinations';
import { getTours } from '@/lib/queries/tours';
import TourCard from '@/components/tours/TourCard';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { MapPin, Sparkles } from 'lucide-react';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';
  const canonicalUrl = `${siteUrl}/${locale}/destinations/${slug}`;

  const cleanDesc =
    destination.presentation ||
    `Découvrez ${destination.name} avec Luxurymarocvoyage. Circuits privés, excursions et visites exclusives.`;

  return {
    title: `Voyage & Circuits à ${destination.name} | Maroc`,
    description: cleanDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/destinations/${slug}`,
        en: `${siteUrl}/en/destinations/${slug}`,
        es: `${siteUrl}/es/destinos/${slug}`,
      },
    },
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

  // Get all tours visiting this destination
  const tours = await getTours(locale, {
    destinationId: destination.id,
    limit: 12,
  });

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
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDF8F2] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />

      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Destination Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-14 aspect-[21/9] sm:aspect-[21/8] bg-morocco-charcoal shadow-lg border border-[#F0E6D8]/50">
          <Image
            src={imageUrl}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-morocco-dark/90 via-morocco-dark/40 to-transparent" />

          <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end text-white max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sand-200 text-xs font-bold uppercase tracking-wider mb-3 w-fit border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#DF6951]" />
              <span>Destination Maroc</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {destination.name}
            </h1>
            {destination.presentation && (
              <p className="mt-3 text-sand-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-light">
                {destination.presentation}
              </p>
            )}
          </div>
        </div>

        {/* Section of Circuits & Excursions for this Destination */}
        <div className="mb-12">
          <div className="max-w-2xl mb-8">
            <div className="section-eyebrow">
              <Sparkles className="w-3 h-3 text-[#DF6951]" />
              <span>Itinéraires Recommandés</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181E4B]">
              Circuits & Excursions incluant {destination.name}
            </h2>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {tours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} locale={locale} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 sm:p-14 text-center border border-[#F0E6D8]/80 shadow-[0_2px_12px_rgba(26,15,10,0.04)] max-w-2xl mx-auto">
              <p className="text-[#181E4B] font-serif text-lg font-bold mb-2">
                Nos circuits pour {destination.name} sont en cours de mise à jour.
              </p>
              <p className="text-xs text-slate-500 mb-6">
                Contactez notre concierge de voyage pour un itinéraire personnalisé incluant cette étape.
              </p>
              <Link
                href="/contact"
                className="btn-primary"
              >
                Demander un devis sur-mesure
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
