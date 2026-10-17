'use client';

import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface HeroProps {
  destinations?: { id: number; name: string; slug: string }[];
}

export default function Hero({ destinations = [] }: HeroProps) {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-gradient-to-b from-white via-white to-[#FDFBF7] pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-26 lg:pb-16 min-h-0 lg:min-h-[80vh] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Eyebrow Tagline */}
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#DF6951] mb-2 sm:mb-2.5">
              {t('tagline')}
            </p>

            {/* Main Headline with decorative brush underline */}
            <h1 className="font-serif text-2xl sm:text-3.5xl md:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#181E4B] leading-[1.18] tracking-tight mb-3 sm:mb-4">
              {t('titlePrefix')}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{t('titleHighlight')}</span>
                {/* Hand-drawn brush underline curve */}
                <svg
                  className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full overflow-visible pointer-events-none"
                  height="10"
                  viewBox="0 0 240 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 11C60 3 175 2.5 237 8.5"
                    stroke="#DF6951"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {t('titleMid')}
              <br />
              {t('titleLine2')}
              <br />
              {t('titleLine3')}
            </h1>

            {/* Subtitle description */}
            <p className="text-slate-500 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-lg mb-5 sm:mb-6 font-normal">
              {t('subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Link
                href="/circuits"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-[#F1A501] hover:bg-[#d89300] text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-400/25 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                {t('findOutMore')}
              </Link>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group cursor-pointer"
              >
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#DF6951] hover:bg-[#c94e38] text-white flex items-center justify-center shadow-md shadow-terracotta-500/25 group-hover:scale-105 group-hover:shadow-terracotta-500/40 transition-all duration-300">
                  <InstagramIcon className="w-4 h-4 text-white" />
                </span>
                <span className="text-slate-600 font-medium text-xs sm:text-sm group-hover:text-[#DF6951] transition-colors">
                  {t('followUs')}
                </span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-5 sm:gap-8 w-full max-w-md">
              <div>
                <div className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#DF6951] tracking-tight">
                  {t('statTravelersCount')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                  {t('statTravelersLabel')}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#DF6951] tracking-tight">
                  {t('statRatingCount')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                  {t('statRatingLabel')}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#DF6951] tracking-tight">
                  {t('statExpCount')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                  {t('statExpLabel')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Traveler Illustration & Visual Art */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Background Warm Glow */}
            <div className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-amber-100/70 via-orange-50/50 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* Decorative Golden Arc Lines */}
            <svg
              className="absolute -top-8 -right-4 sm:-top-6 sm:-right-2 w-[300px] sm:w-[380px] lg:w-[420px] h-auto pointer-events-none -z-10"
              viewBox="0 0 500 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 60,390 C 130,120 380,60 480,240"
                stroke="#F1A501"
                strokeWidth="2.5"
                opacity="0.45"
              />
              <path
                d="M 30,360 C 110,70 390,40 460,200"
                stroke="#DF6951"
                strokeWidth="1.8"
                opacity="0.3"
              />
            </svg>

            {/* 3D Traveler Girl Visual */}
            <div className="relative w-full max-w-[320px] sm:max-w-[390px] lg:max-w-[420px] aspect-square transition-transform duration-700 ease-out hover:scale-[1.02]">
              <Image
                src="/images/hero-traveler.jpg"
                alt="Travel and experience the best of Morocco"
                priority
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
