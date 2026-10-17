import { getTranslations } from 'next-intl/server';

interface WhyChooseUsProps {
  locale: string;
}

export default async function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const t = await getTranslations({ locale, namespace: 'sections' });

  const pillars = [
    {
      title: t('whyUsPillar1Title'),
      description: t('whyUsPillar1Desc'),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      ),
    },
    {
      title: t('whyUsPillar2Title'),
      description: t('whyUsPillar2Desc'),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="6" cy="19" r="2.5" />
          <circle cx="18" cy="5" r="2.5" />
          <path d="M8.5 19h7a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7" />
        </svg>
      ),
    },
    {
      title: t('whyUsPillar3Title'),
      description: t('whyUsPillar3Desc'),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: t('whyUsPillar4Title'),
      description: t('whyUsPillar4Desc'),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FAF5EE] to-[#FAF5EE] border-y border-[#F0E6D8]/70">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="section-eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-[#DF6951]"
            >
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            <span>
              {locale === 'fr'
                ? 'Notre Engagement'
                : locale === 'es'
                ? 'Nuestro Compromiso'
                : 'Our Excellence'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#181E4B] tracking-tight leading-tight">
            {t('whyUsTitlePrefix')}
            <span className="text-[#DF6951]">{t('whyUsTitleHighlight')}</span>
            {t('whyUsTitleSuffix')}
          </h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm md:text-[14px] leading-relaxed font-normal">
            {t('whyUsSub')}
          </p>
        </div>

        {/* 4 Pillars Grid (Elevated card styling) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-6 sm:p-7 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#EFE5D7] hover:border-terracotta-300/60 shadow-[0_2px_12px_rgba(26,15,10,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(223,105,81,0.12)] transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* White Squircle Icon Container */}
              <div className="w-13 h-13 rounded-2xl bg-[#FAF5EE] border border-[#EFE5D7] flex items-center justify-center text-[#DF6951] mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#DF6951] group-hover:text-white group-hover:shadow-md">
                {pillar.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-[15px] sm:text-base text-[#181E4B] mb-2 sm:mb-2.5 leading-snug group-hover:text-[#DF6951] transition-colors">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
