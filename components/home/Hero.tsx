'use client';

import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface HeroProps {
  destinations?: { id: number; name: string; slug: string }[];
}

export default function Hero({ destinations: _destinations = [] }: HeroProps) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState([0, 0, 0]);

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;
    let frame = 0;
    let start = 0;
    const targets = [5000, 5, 15];
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (!entry.isIntersecting) return;
      start = 0;
      const animate = (time: number) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / 1600, 1);
        const eased = 1 - (1 - progress) ** 3;
        setStats(targets.map((target) => Math.round(target * eased)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section ref={heroRef} className="hero-morocco relative flex min-h-0 items-center overflow-hidden bg-[#F9F2E8] pt-[80px] pb-8 sm:pt-20 sm:pb-10 lg:h-[min(68svh,650px)] lg:min-h-[580px] lg:py-8">
      <div aria-hidden="true" className="hero-zellige pointer-events-none absolute -bottom-8 -left-10 z-0 h-44 w-44 opacity-50 sm:h-60 sm:w-60" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-5 sm:px-8 lg:grid-cols-12 lg:gap-0 lg:px-8">
        <div className="relative z-10 flex flex-col items-center text-center lg:col-span-6 lg:max-w-[590px] lg:items-start lg:text-left xl:col-span-6">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#DF6951] sm:mb-3 sm:text-[11px]">{t('tagline')}</p>
          <h1 className="mb-3 font-serif text-[clamp(1.9rem,6.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#181E4B] sm:mb-4 lg:text-[clamp(2.6rem,2.75vw,3.2rem)]">
            {t('titlePrefix')}<span className="relative inline-block whitespace-nowrap"><span className="relative z-10">{t('titleHighlight')}</span><svg className="pointer-events-none absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 240 14" fill="none" aria-hidden="true"><path d="M3 11C60 3 175 2.5 237 8.5" stroke="#DF6951" strokeWidth="4.5" strokeLinecap="round" /></svg></span>{t('titleMid')}<br />{t('titleLine2')}<br />{t('titleLine3')}
          </h1>
          <p className="mb-4 max-w-xl text-[12px] font-normal leading-[1.7] text-[#52657C] sm:mb-5 sm:text-[14px]">{t('subtitle')}</p>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3 sm:mb-6 sm:gap-5 lg:justify-start">
            <Link href="/circuits" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#F1A501] px-5 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-500/25 transition hover:-translate-y-0.5 hover:bg-[#d89300] hover:shadow-lg">{t('findOutMore')}<span aria-hidden="true">→</span></Link>
            <a href="https://www.instagram.com/luxurymarocvoyage/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DF6951] text-white shadow-md transition group-hover:scale-105"><InstagramIcon className="h-4 w-4" /></span>
              <span className="text-[13px] font-medium text-slate-700 transition-colors group-hover:text-[#DF6951]">{t('followUs')}</span>
            </a>
          </div>
          <div ref={statsRef} className="grid w-full max-w-[490px] grid-cols-3 divide-x divide-[#E4C58F] text-left">
            <div className="pr-3 sm:pr-5"><div className="text-xl font-extrabold tracking-tight text-[#DF6951] sm:text-2xl">+ {new Intl.NumberFormat(locale).format(stats[0])}</div><div className="mt-0.5 text-[10px] font-medium leading-snug text-[#52657C] sm:text-[11px]">{t('statTravelersLabel')}</div></div>
            <div className="px-3 sm:px-5"><div className="text-xl font-extrabold tracking-tight text-[#DF6951] sm:text-2xl">{stats[1]}</div><div className="mt-0.5 text-[10px] font-medium leading-snug text-[#52657C] sm:text-[11px]">{t('statRatingLabel')}</div></div>
            <div className="pl-3 sm:pl-5"><div className="text-xl font-extrabold tracking-tight text-[#DF6951] sm:text-2xl">{stats[2]}</div><div className="mt-0.5 text-[10px] font-medium leading-snug text-[#52657C] sm:text-[11px]">{t('statExpLabel')}</div></div>
          </div>
        </div>

        <div className="relative z-0 hidden items-center justify-center lg:col-span-6 lg:col-start-7 lg:flex">
          <div aria-hidden="true" className="absolute h-[270px] w-[270px] rounded-full bg-gradient-to-tr from-amber-100/70 via-orange-50/50 to-transparent blur-3xl sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]" />
          <Image
            src="/images/hero-traveler.webp"
            alt="Traveler ready to explore Morocco"
            width={704}
            height={704}
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1023px) 60vw, 42vw"
            className="relative h-[230px] w-full max-w-[280px] object-contain sm:h-[340px] sm:max-w-[390px] lg:h-[400px] lg:max-w-[450px]"
          />
        </div>
      </div>
      <button
        type="button"
        aria-label="Scroll to the next section"
        onClick={() => {
          const nextSection = heroRef.current?.nextElementSibling;
          if (nextSection instanceof HTMLElement) {
            nextSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          }
        }}
        className="hero-scroll-cue absolute bottom-2 left-1/2 z-20 hidden -translate-x-1/2 items-center justify-center rounded-full p-2 text-[#52657C]/70 transition-colors hover:text-[#DF6951] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DF6951] lg:flex"
      >
        <svg aria-hidden="true" width="22" height="34" viewBox="0 0 22 34" fill="none">
          <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" stroke="currentColor" strokeWidth="1.5" />
          <path className="hero-scroll-wheel" d="M11 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
}
