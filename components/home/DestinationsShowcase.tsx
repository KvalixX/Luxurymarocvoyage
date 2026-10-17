import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { Destination } from '@/lib/queries/destinations';
import { getTranslations } from 'next-intl/server';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface DestinationsShowcaseProps {
  destinations: Destination[];
  locale: string;
}

export default async function DestinationsShowcase({
  destinations,
  locale,
}: DestinationsShowcaseProps) {
  const t = await getTranslations({ locale, namespace: 'sections' });
  const tCard = await getTranslations({ locale, namespace: 'card' });

  if (!destinations || destinations.length === 0) return null;

  // Curated imagery for destinations if DB images are missing or placeholder
  const destinationImages: Record<string, string> = {
    marrakech: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
    merzouga: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    fes: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    chefchaouen: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=800&q=80',
    essaouira: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=800&q=80',
    agadir: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ouarzazate: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    casablanca: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
    rabat: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    tanger: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=800&q=80',
    tangier: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=800&q=80',
    dades: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=800&q=80',
    zagora: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  };

  // Limit to exactly 8 destinations as requested
  const displayedDestinations = destinations.slice(0, 8);

  const fallbackGeneral =
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="relative py-14 sm:py-18 lg:py-22 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-white to-white border-t border-[#F0E6D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="section-eyebrow">
            <MapPin className="w-3 h-3 text-[#DF6951]" />
            <span>
              {locale === 'fr'
                ? 'Régions & Villes Mythiques'
                : locale === 'es'
                ? 'Regiones y Ciudades Míticas'
                : 'Legendary Regions & Cities'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#181E4B] tracking-tight leading-tight">
            {t('destinationsTitle')}
          </h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-[14px] leading-relaxed max-w-xl mx-auto">
            {t('destinationsSub')}
          </p>
        </div>

        {/* Grid of 8 Destinations (Compact, balanced proportions) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 max-w-6xl mx-auto">
          {displayedDestinations.map((dest) => {
            const fallbackImage =
              destinationImages[dest.slug.toLowerCase()] || fallbackGeneral;
            const imageUrl =
              dest.image && dest.image.startsWith('http') ? dest.image : fallbackImage;

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}` as any}
                className="group relative aspect-[4/3.3] sm:aspect-[4/3.4] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-[0_4px_16px_rgba(26,15,10,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(223,105,81,0.22)] hover:border-terracotta-400/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between p-3.5 sm:p-4 text-white"
              >
                {/* Background Cover Image */}
                <Image
                  src={imageUrl}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Multi-layered dark gradient for rich readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-all duration-300" />

                {/* Top Row: Pill Tag + Floating Arrow */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    Maroc
                  </span>

                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#DF6951] group-hover:border-[#DF6951] group-hover:scale-110 shadow-xs">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Content: Destination Title & Presentation */}
                <div className="relative z-10">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-300/90">
                    Destination
                  </span>
                  <h3 className="font-serif text-[15px] sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors drop-shadow-sm mt-0.5 line-clamp-1">
                    {dest.name}
                  </h3>
                  {dest.presentation && (
                    <p className="text-[10.5px] text-slate-200/80 line-clamp-1 mt-0.5 leading-snug font-normal">
                      {dest.presentation}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Centered Button: [See More Destinations] */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            href="/destinations"
            className="btn-primary"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{tCard('seeMoreDestinations')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
