import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTourBySlug, getTourSlugs, getRelatedTours } from '@/lib/queries/tours';
import TourGallery from '@/components/tours/TourGallery';
import BookingForm from '@/components/tours/BookingForm';
import TourDetailTabs from '@/components/tours/TourDetailTabs';
import RelatedTours from '@/components/tours/RelatedTours';
import { TouristTripJsonLd } from '@/components/seo/JsonLd';
import { Star, Clock, Compass, MapPin } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface ExcursionDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
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
}: ExcursionDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) return { title: 'Excursion Non Trouvée' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';
  const canonicalUrl = `${siteUrl}/${locale}/excursions/${slug}`;

  const cleanDescription =
    tour.presentation ||
    tour.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) ||
    `Excursion privée d'une journée au Maroc avec Luxurymarocvoyage.`;

  return {
    title: `${tour.title} | Excursion Privée Maroc`,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/fr/excursions/${slug}`,
        en: `${siteUrl}/en/excursions/${slug}`,
        es: `${siteUrl}/es/excursiones/${slug}`,
      },
    },
    openGraph: {
      title: tour.title,
      description: cleanDescription,
      url: canonicalUrl,
      images: tour.image ? [{ url: tour.image }] : [],
      type: 'article',
    },
  };
}

export default async function ExcursionDetailPage({
  params,
}: ExcursionDetailPageProps) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) {
    notFound();
  }

  const relatedTours = await getRelatedTours(tour.slug, locale, tour.destinationId, 3);

  return (
    <div className="min-h-screen bg-white">
      <TouristTripJsonLd tour={tour} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* ─────────────────────────────────────────────────────
            TOP ROW: Gallery (left) + Form (right) — both aligned
            at the same vertical position from the top
        ───────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT — Gallery + content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Gallery card */}
            <TourGallery
              coverImage={tour.image}
              gallery={tour.gallery}
              title={tour.title}
            />

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-terracotta-600 transition-colors">
                Home
              </Link>
              <span>›</span>
              <Link href="/excursions" className="hover:text-terracotta-600 transition-colors">
                Excursions
              </Link>
              {tour.departure && (
                <>
                  <span>›</span>
                  <span className="text-slate-700 font-medium">{tour.departure}</span>
                </>
              )}
            </nav>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {tour.title}
            </h1>

            {/* Stats row */}
            <div className="flex flex-wrap items-stretch divide-x divide-slate-200 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              {/* Duration */}
              <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Duration
                </span>
                <span className="text-sm font-bold text-slate-900">
                  1 day (full day)
                </span>
              </div>

              {/* Tour type */}
              <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Tour type
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {tour.type || 'Private excursion'}
                </span>
              </div>

              {/* Departure */}
              {tour.departure && (
                <div className="flex flex-col px-4 py-3 gap-0.5 flex-1 min-w-[100px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Departure
                  </span>
                  <span className="text-sm font-bold text-slate-900 line-clamp-1">
                    {tour.departure}
                  </span>
                </div>
              )}

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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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

          {/* RIGHT — Sticky booking form */}
          <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 lg:sticky lg:top-24">
            <BookingForm tour={tour} locale={locale} />
          </div>
        </div>

        {/* ── You may also like ───────────────────────────── */}
        {relatedTours.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              You may also like...
            </h2>
            <RelatedTours tours={relatedTours} locale={locale} isExcursion />
          </div>
        )}
      </div>
    </div>
  );
}
