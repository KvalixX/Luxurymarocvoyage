import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTourBySlug, getTourSlugs, getRelatedTours } from '@/lib/queries/tours';
import TourGallery from '@/components/tours/TourGallery';
import BookingForm from '@/components/tours/BookingForm';
import TourDetailTabs from '@/components/tours/TourDetailTabs';
import TourRouteMap from '@/components/tours/TourRouteMap';
import RelatedTours from '@/components/tours/RelatedTours';
import { TouristTripJsonLd } from '@/components/seo/JsonLd';
import { Star, Clock, Compass } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { localizedAlternates, localizedUrl } from '@/lib/seo/urls';
import { seoDescription } from '@/lib/seo/text';

// Tour content and galleries must be read from the hosting database at request time.
export const dynamic = 'force-dynamic';

interface CircuitDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getTourSlugs('circuit');
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
}: CircuitDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) return { title: 'Circuit Non Trouvé' };

  const canonicalUrl = localizedUrl(locale, '/circuits/[slug]', { slug });

  const cleanDescription = seoDescription(
    tour.presentation || tour.description,
    locale === 'en'
      ? `${tour.days}-day private Morocco tour with Luxury Maroc Voyage.`
      : locale === 'es'
        ? `Circuito privado de ${tour.days} días por Marruecos con Luxury Maroc Voyage.`
        : `Circuit privé de ${tour.days} jours au Maroc avec Luxury Maroc Voyage.`,
  );

  return {
    title: `${tour.title} | ${locale === 'en' ? 'Private Morocco Tour' : locale === 'es' ? 'Circuito privado por Marruecos' : 'Circuit priv\u00e9 au Maroc'}`,
    description: cleanDescription,
    alternates: localizedAlternates(locale, '/circuits/[slug]', { slug }),
    openGraph: {
      title: tour.title,
      description: cleanDescription,
      url: canonicalUrl,
      images: tour.image ? [{ url: tour.image }] : [],
      type: 'article',
    },
  };
}

export default async function CircuitDetailPage({ params }: CircuitDetailPageProps) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) {
    notFound();
  }

  const relatedTours = await getRelatedTours(tour.slug, locale, tour.destinationId, 3);

  return (
    <div className="min-h-screen bg-white">
      <TouristTripJsonLd tour={tour} locale={locale} tripType="circuit" />

      <div className="mx-auto max-w-7xl px-3 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT — Gallery + title area */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Gallery card */}
            <TourGallery
              slug={tour.slug}
              coverImage={tour.image}
              gallery={tour.gallery}
              title={tour.title}
            />
            <div className="-mt-1">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="transition-colors hover:text-terracotta-600">Home</Link>
                <span aria-hidden="true">›</span>
                <Link href="/circuits" className="transition-colors hover:text-terracotta-600">Circuits</Link>
                {tour.departure && <><span aria-hidden="true">›</span><span className="font-medium text-slate-700">{tour.departure}</span></>}
              </nav>
              <h1 className="mt-2 max-w-5xl font-serif text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {tour.title}
              </h1>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-stretch divide-x divide-slate-200 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              {/* Duration */}
              <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Duration
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {tour.days} day{tour.days > 1 ? 's' : ''}
                </span>
              </div>

              {/* Tour type */}
              <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Tour type
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {tour.type || 'Private tour'}
                </span>
              </div>

              {/* Reviews */}
              {tour.rating > 0 && (
                <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Reviews
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-900">
                      {tour.rating.toFixed(1)}/5
                      {tour.reviews > 0 && (
                        <span className="text-slate-400 font-normal ml-1 text-xs">
                          ({tour.reviews} reviews)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs: Overview / Included-Highlights / Itinerary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <TourDetailTabs
                presentation={tour.presentation || ''}
                description={tour.description || ''}
                includes={tour.includes}
                options={tour.options}
                highlights={tour.highlights}
                itinerary={tour.itinerary}
                locale={locale}
              />
            </div>
          </div>

          {/* RIGHT — Booking form and sharing */}
          <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 lg:sticky lg:top-24 lg:self-start">
            <BookingForm tour={tour} locale={locale} tripType="circuit" />
          </div>
        </div>

        {tour.itinerary.length > 0 && (
          <TourRouteMap itinerary={tour.itinerary} locale={locale} departure={tour.departure} />
        )}

        {/* ── You may also like ───────────────────────────── */}
        {relatedTours.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              You may also like...
            </h2>
            <RelatedTours tours={relatedTours} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}
