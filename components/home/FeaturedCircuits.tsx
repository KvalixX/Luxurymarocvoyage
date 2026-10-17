'use client';

import { useRef, useState, useEffect } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { Tour } from '@/lib/queries/tours';
import { useTranslations } from 'next-intl';
import TourCard from '@/components/tours/TourCard';
import { ChevronLeft, ChevronRight, LayoutGrid, Sparkles, Route, CarFront, SlidersHorizontal } from 'lucide-react';

interface FeaturedCircuitsProps {
  tours: Tour[];
  locale: string;
}

export default function FeaturedCircuits({ tours, locale }: FeaturedCircuitsProps) {
  const t = useTranslations('card');
  const tSections = useTranslations('sections');
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, [tours]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector('article');
    const scrollAmount = (card ? card.clientWidth : 320) + 24; // card width + gap
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!tours) return null;


  return (
    <section className="relative py-8 sm:py-10 lg:py-12 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7] to-white">
      {/* Decorative Warm Dashed Travel Track Background Lines (matching design) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M -60,180 C 180,60 380,260 700,120 C 1020,-20 1280,240 1600,140"
          stroke="#E5B26E"
          strokeWidth="1.8"
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d="M 40,380 C 320,440 680,290 1050,370 C 1320,430 1550,310 1800,360"
          stroke="#DF6951"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          fill="none"
          opacity="0.3"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right navigation buttons */}
        <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-2xl">
            <div className="section-eyebrow">
              <Sparkles className="w-3 h-3 text-[#DF6951]" />
              <span>
                {locale === 'fr'
                  ? 'Circuits d’Exception'
                  : locale === 'es'
                  ? 'Circuitos Exclusivos'
                  : 'Signature Journeys'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#181E4B] tracking-tight leading-tight">
              {tSections('featuredCircuitsTitle')}
            </h2>
            <p className="mt-1.5 text-slate-500 text-xs sm:text-[14px] leading-relaxed">
              {tSections('featuredCircuitsSub')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><Route className="h-3 w-3 text-[#DF6951]" />{tSections('circuitFeatureRoute')}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><CarFront className="h-3 w-3 text-[#DF6951]" />{tSections('circuitFeaturePrivate')}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><SlidersHorizontal className="h-3 w-3 text-[#DF6951]" />{tSections('circuitFeatureFlexible')}</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6951] ${
                canScrollLeft
                  ? 'bg-white border border-slate-200/80 hover:border-terracotta-400 hover:text-[#DF6951] text-slate-700 shadow-xs hover:shadow active:scale-95 cursor-pointer'
                  : 'bg-white/60 border border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6951] ${
                canScrollRight
                  ? 'bg-white border border-slate-200/80 hover:border-terracotta-400 hover:text-[#DF6951] text-slate-700 shadow-xs hover:shadow active:scale-95 cursor-pointer'
                  : 'bg-white/60 border border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Row */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-pl-6 sm:scroll-pl-8 pt-1 pb-4 no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div aria-hidden="true" className="w-6 shrink-0 sm:w-8" />
          {tours.length === 0 ? (
            <div className="flex min-h-44 w-full shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7D9C8] bg-white/80 px-6 py-8 text-center">
              <p className="font-serif text-lg font-semibold text-[#181E4B]">{tSections('circuitsEmptyTitle')}</p>
              <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-slate-500">{tSections('circuitsEmptyText')}</p>
              <Link href="/contact" className="mt-4 inline-flex items-center rounded-lg bg-terracotta-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-terracotta-600">{tSections('planWithUs')}</Link>
            </div>
          ) : tours.map((tour, index) => (
            <TourCard key={tour.id} tour={tour} locale={locale} index={index} compact />
          ))}
        </div>

        {/* Bottom Center "See More Tours" Button */}
        <div className="flex justify-center mt-4 sm:mt-5">
          <Link
            href="/circuits"
            className="btn-primary"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t('seeMoreTours')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
