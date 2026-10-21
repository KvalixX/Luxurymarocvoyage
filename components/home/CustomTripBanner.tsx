import { Link } from '@/lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface CustomTripBannerProps {
  locale: string;
}

export default async function CustomTripBanner({ locale }: CustomTripBannerProps) {
  const t = await getTranslations({ locale, namespace: 'sections' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212776715010';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const defaultMessage = encodeURIComponent(
    'Bonjour Luxurymarocvoyage, je souhaite concevoir un itinéraire sur-mesure pour mon voyage au Maroc.'
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-terracotta-600 via-terracotta-700 to-morocco-charcoal p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sand-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-majorelle-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-sand-200 text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-sand-300" />
            <span>Voyage 100% Personnalisé</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t('customBannerTitle')}
          </h2>

          <p className="text-sand-100 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-light">
            {t('customBannerSub')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-sand-400 hover:bg-sand-300 text-morocco-dark font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            >
              <span>{t('customBannerBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm uppercase tracking-wider border border-white/25 transition-all text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>{tCommon('whatsappUs')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
