'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import TourCard from '@/components/tours/TourCard';

interface RelatedToursProps {
  tours: Tour[];
  locale: string;
  isExcursion?: boolean;
}

export default function RelatedTours({ tours, locale, isExcursion = false }: RelatedToursProps) {
  const railRef = useRef<HTMLDivElement>(null);
  if (!tours || tours.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * Math.max(260, railRef.current.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label={locale === 'fr' ? 'Faire défiler vers la gauche' : 'Scroll left'} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-terracotta-400 hover:text-terracotta-600">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={locale === 'fr' ? 'Faire défiler vers la droite' : 'Scroll right'} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-terracotta-400 hover:text-terracotta-600">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div ref={railRef} className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-4 sm:mx-0 sm:gap-5 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tours.map((tour, index) => (
          <TourCard key={tour.id} tour={tour} locale={locale} isExcursion={isExcursion} index={index} compact />
        ))}
      </div>
    </div>
  );
}
