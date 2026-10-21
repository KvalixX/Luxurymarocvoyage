'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import TourCard from '@/components/tours/TourCard';

interface DestinationTourCarouselProps {
  tours: Tour[];
  locale: string;
  isExcursion?: boolean;
}

export default function DestinationTourCarousel({ tours, locale, isExcursion = false }: DestinationTourCarouselProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector('article');
    const amount = (card?.getBoundingClientRect().width ?? 275) + 20;
    slider.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="relative pt-4">
      <div className="absolute right-0 top-0 flex gap-2">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll tours left"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#E9DDCD] bg-white text-[#181E4B] shadow-sm transition hover:border-[#DF6951] hover:text-[#DF6951]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Scroll tours right"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#E9DDCD] bg-white text-[#181E4B] shadow-sm transition hover:border-[#DF6951] hover:text-[#DF6951]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tours.map((tour, index) => (
          <TourCard key={tour.id} tour={tour} locale={locale} index={index} isExcursion={isExcursion} compact />
        ))}
      </div>
    </div>
  );
}
