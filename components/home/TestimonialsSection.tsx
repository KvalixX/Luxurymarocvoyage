'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface GoogleReview {
  id: string;
  rating: number;
  text: string;
  author: string;
  authorUrl: string | null;
  published: string;
}

interface ReviewsResponse {
  configured: boolean;
  businessName?: string;
  rating?: number | null;
  reviewCount?: number | null;
  mapsUrl?: string;
  reviews: GoogleReview[];
}

interface TestimonialsSectionProps {
  locale: string;
}

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const t = useTranslations('sections');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/google-reviews?locale=${encodeURIComponent(locale)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((result: ReviewsResponse) => setData(result))
      .catch(() => undefined);
    return () => controller.abort();
  }, [locale]);

  const checkScrollability = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    setCanScrollLeft(slider.scrollLeft > 10);
    setCanScrollRight(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const slider = sliderRef.current;
    if (!slider) return;
    slider.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);
    return () => {
      slider.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [data?.reviews.length]);

  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector('article');
    slider.scrollBy({
      left: (direction === 'left' ? -1 : 1) * ((card?.clientWidth || 320) + 20),
      behavior: 'smooth',
    });
  };

  const mapsUrl = data?.mapsUrl || (process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID
    ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID)}`
    : null);

  return (
    <section className="overflow-hidden border-b border-[#F0E6D8]/60 bg-gradient-to-b from-[#FAF5EE] via-[#FAF5EE] to-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="section-eyebrow">
            <Star className="h-3 w-3 fill-[#DF6951] text-[#DF6951]" />
            <span>{locale === 'fr' ? 'Avis Google' : locale === 'es' ? 'Opiniones de Google' : 'Google Reviews'}</span>
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight tracking-tight text-[#181E4B] sm:text-3xl lg:text-[34px]">
            {t('reviewsTitlePrefix')}<span className="text-[#DF6951]">{t('reviewsTitleHighlight')}</span>
          </h2>
          <p className="mt-1.5 text-xs font-normal text-slate-500 sm:text-sm">{t('reviewsSub')}</p>
        </div>

        <div className="relative flex flex-col items-stretch gap-6 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col justify-between rounded-2xl border border-[#F0E6D8]/80 bg-white p-6 shadow-[0_2px_12px_rgba(26,15,10,0.04)] sm:p-7 lg:w-[270px] xl:w-[290px]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl font-black leading-none text-[#181E4B] sm:text-[46px]">
                  {typeof data?.rating === 'number' ? data.rating.toFixed(1).replace('.', ',') : '—'}
                </span>
                <span className="text-lg font-semibold text-slate-400">/5</span>
              </div>
              <div className="my-2.5 flex items-center gap-1" aria-label={`${data?.rating ?? 0} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${star <= Math.round(data?.rating || 0) ? 'fill-[#F1A501] text-[#F1A501]' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="mb-6 text-[11px] font-medium text-slate-500">
                {data?.reviewCount != null
                  ? t('googleReviewsCount', { count: data.reviewCount })
                  : t('googleReviewsLoading')}
              </p>
            </div>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-[#4285F4] hover:underline">
                <span aria-hidden="true" className="font-bold">G</span>
                {t('readGoogleReviews')}
              </a>
            )}
          </div>

          <div className="relative min-w-0 flex-1">
            {data?.reviews.length ? (
              <div ref={sliderRef} className="no-scrollbar flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-1 sm:gap-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {data.reviews.map((review) => (
                  <article key={review.id} className="group flex w-[285px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-[#F0E6D8]/80 bg-white p-6 shadow-[0_2px_12px_rgba(26,15,10,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-terracotta-300/60 hover:shadow-[0_12px_28px_-6px_rgba(223,105,81,0.12)] sm:w-[325px] md:w-[345px]">
                    <div>
                      <div className="mb-3 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-[#F1A501] text-[#F1A501]' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="whitespace-pre-line text-xs font-normal leading-relaxed text-slate-600 sm:text-[13px]">{review.text}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="min-w-0">
                        {review.authorUrl ? (
                          <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-xs font-bold leading-tight text-slate-800 hover:underline sm:text-[13px]">{review.author}</a>
                        ) : (
                          <p className="truncate text-xs font-bold leading-tight text-slate-800 sm:text-[13px]">{review.author}</p>
                        )}
                        {review.published && <p className="mt-1 text-[11px] text-slate-400">{review.published}</p>}
                      </div>
                      <a href={mapsUrl || 'https://www.google.com/maps'} target="_blank" rel="noopener noreferrer" aria-label={t('googleAttribution')} className="shrink-0 text-sm font-bold text-[#4285F4]">Google</a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#F0E6D8] bg-white/70 p-6 text-center">
                <p className="text-sm text-slate-600">{data?.configured ? t('googleReviewsUnavailable') : t('googleReviewsSetup')}</p>
                {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-[#4285F4] hover:underline">{t('readGoogleReviews')}</a>}
              </div>
            )}

            {canScrollRight && <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-md transition-all hover:scale-105 hover:border-terracotta-400 hover:text-[#DF6951]" aria-label={t('nextReviews')}><ChevronRight className="h-5 w-5" /></button>}
            {canScrollLeft && <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-md transition-all hover:scale-105 hover:border-terracotta-400 hover:text-[#DF6951]" aria-label={t('previousReviews')}><ChevronLeft className="h-5 w-5" /></button>}
          </div>
        </div>
      </div>
    </section>
  );
}
