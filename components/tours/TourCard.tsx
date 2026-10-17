'use client';

import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import type { Tour } from '@/lib/queries/tours';
import { MapPin, Route, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TourCardProps {
  tour: Tour;
  locale: string;
  isExcursion?: boolean;
  index?: number;
  compact?: boolean;
}

export default function TourCard({ tour, isExcursion = false, index = 0, compact = false }: TourCardProps) {
  const t = useTranslations('card');
  const tSections = useTranslations('sections');

  const href = isExcursion ? `/excursions/${tour.slug}` : `/circuits/${tour.slug}`;
  const quoteHref = `/contact?${isExcursion ? 'excursion' : 'tour'}=${tour.slug}`;
  const defaultImage =
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80';
  const imageUrl = tour.image && tour.image.startsWith('http') ? tour.image : defaultImage;
  const days = isExcursion ? (tour.days || 1) : tour.days;
  const durationLabel = `${days} ${days > 1 ? t('days') : t('day')} · ${
    isExcursion ? t('dayTrip') : t('privateTour')
  }`;
  const rating = tour.rating > 0 ? tour.rating : 4.95;
  const reviews = tour.reviews > 0 ? tour.reviews : 276;
  const hasPromo = tour.promotion || index % 3 === 0;

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#F0E6D8]/80 bg-white shadow-[0_2px_10px_rgba(26,15,10,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-terracotta-300/70 hover:shadow-[0_16px_32px_-8px_rgba(223,105,81,0.16)] ${compact ? 'w-[235px] shrink-0 snap-start sm:w-[255px] md:w-[275px]' : ''}`}>
      <div className="relative aspect-[16/10.5] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={tour.title || (isExcursion ? 'Excursion Maroc' : 'Circuit Maroc')}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {hasPromo && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <span className="rounded-full border border-slate-200/50 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-800 shadow-xs backdrop-blur-xs">
              {t('promoBadge')}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <h3 className="min-h-[38px] line-clamp-2 font-sans text-[13.5px] font-bold leading-snug text-[#181E4B] transition-colors group-hover:text-[#DF6951] sm:text-[14.5px]">
            <Link href={href as any}>{tour.title}</Link>
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-tight text-white shadow-xs">
              <Star className="h-2.5 w-2.5 fill-white" />
              {rating.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-slate-800">{t('exceptional')}</span>
            <span className="text-[10px] font-normal text-slate-400">({reviews})</span>
          </div>

          <p className="mb-3.5 mt-1 text-[11.5px] font-normal text-slate-500">{durationLabel}</p>
          {tour.departure && (
            <p className="mb-2 flex items-center gap-1.5 text-[10px] text-slate-500">
              {isExcursion ? (
                <MapPin className="h-3 w-3 shrink-0 text-[#DF6951]" />
              ) : (
                <Route className="h-3 w-3 shrink-0 text-[#DF6951]" />
              )}
              <span className="truncate">{tSections('departureFrom')} {tour.departure}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={quoteHref as any}
            className="rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-2.5 py-2 text-center text-[11px] font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:from-terracotta-600 hover:to-terracotta-700 hover:shadow"
          >
            {t('quote')}
          </Link>
          <Link
            href={href as any}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center text-[11px] font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta-400 hover:bg-orange-50/20 hover:text-terracotta-600"
          >
            {t('viewDetailsBtn')}
          </Link>
        </div>
      </div>
    </article>
  );
}
