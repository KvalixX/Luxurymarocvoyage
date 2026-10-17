'use client';

import { useRef, useState, useEffect } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { Tour } from '@/lib/queries/tours';
import { useTranslations } from 'next-intl';
import TourCard from '@/components/tours/TourCard';
import { ChevronLeft, ChevronRight, LayoutGrid, Compass, Clock3, CarFront, MapPin } from 'lucide-react';

interface PopularExcursionsProps {
  excursions: Tour[];
  locale: string;
}

export default function PopularExcursions({ excursions, locale }: PopularExcursionsProps) {
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
  }, [excursions]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector('article');
    const scrollAmount = (card ? card.clientWidth : 275) + 20;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!excursions) return null;


  return (
    <section className="relative py-8 sm:py-10 lg:py-12 overflow-hidden bg-gradient-to-b from-white via-[#FAF7F2]/50 to-[#FAF7F2] border-t border-[#F0E6D8]/60">
      {/* Decorative Warm Dashed Travel Track Background Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M -40,160 C 220,280 500,80 850,220 C 1200,360 1480,100 1800,200"
          stroke="#DF6951"
          strokeWidth="1.6"
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d="M 60,340 C 380,240 720,400 1100,280 C 1400,180 1620,320 1850,260"
          stroke="#E5B26E"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          fill="none"
          opacity="0.4"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right navigation buttons */}
        <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-2xl">
            <div className="section-eyebrow">
              <Compass className="w-3 h-3 text-[#DF6951]" />
              <span>
                {locale === 'fr'
                  ? 'Évasions d’une Journée'
                  : locale === 'es'
                  ? 'Excursiones de un Día'
                  : 'Day Trips & Escapes'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#181E4B] tracking-tight leading-tight">
              {tSections('popularExcursionsTitle')}
            </h2>
            <p className="mt-1.5 text-slate-500 text-xs sm:text-[14px] leading-relaxed">
              {tSections('popularExcursionsSub')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><Clock3 className="h-3 w-3 text-[#DF6951]" />{tSections('excursionFeatureDay')}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><CarFront className="h-3 w-3 text-[#DF6951]" />{tSections('excursionFeaturePrivate')}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6D8] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600"><MapPin className="h-3 w-3 text-[#DF6951]" />{tSections('excursionFeatureExplore')}</span>
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
          {excursions.length === 0 ? (
            <div className="flex min-h-44 w-full shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7D9C8] bg-white/80 px-6 py-8 text-center">
              <p className="font-serif text-lg font-semibold text-[#181E4B]">{tSections('excursionsEmptyTitle')}</p>
              <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-slate-500">{tSections('excursionsEmptyText')}</p>
              <Link href="/contact" className="mt-4 inline-flex items-center rounded-lg bg-terracotta-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-terracotta-600">{tSections('planWithUs')}</Link>
            </div>
          ) : excursions.map((excursion, index) => (
            <TourCard key={excursion.id} tour={excursion} locale={locale} isExcursion index={index} compact />
          ))}
        </div>

        {/* Bottom Center "See More Excursions" Button */}
        <div className="flex justify-center mt-4 sm:mt-5">
          <Link
            href="/excursions"
            className="btn-primary"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t('seeMoreExcursions')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
