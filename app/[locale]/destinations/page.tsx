import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { getDestinations } from '@/lib/queries/destinations';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface DestinationsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: "Destinations d'Exception au Maroc | Villes, Sahara & Atlas",
    en: 'Top Morocco Destinations | Imperial Cities, Sahara Desert & Atlas',
    es: 'Destinos en Marruecos | Ciudades Imperiales, Sáhara y Atlas',
  };

  const descriptions: Record<string, string> = {
    fr: "Explorez les plus belles destinations du Maroc : Marrakech, Merzouga, Fès, Chefchaouen, Essaouira et les vallées de l'Atlas.",
    en: 'Explore the most captivating destinations of Morocco: Marrakech, Sahara Desert, Fes, Chefchaouen, Essaouira, and the Atlas Mountains.',
    es: 'Explore los destinos más fascinantes de Marruecos: Marrakech, Merzouga, Fez, Chaouen, Essaouira y el Atlas.',
  };


  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/destinations'),
  };
}

/* Fallback images keyed by slug */
const destinationImages: Record<string, string> = {
  marrakech:   'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
  merzouga:    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  fes:         'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  fez:         'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  chefchaouen: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=800&q=80',
  essaouira:   'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=800&q=80',
  agadir:      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  ouarzazate:  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
  casablanca:  'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
  rabat:       'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  tanger:      'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=800&q=80',
  tangier:     'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=800&q=80',
  tetouan:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  dades:       'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=800&q=80',
  zagora:      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  atlas:       'https://images.unsplash.com/photo-1551444555-d87d6c8b0d9b?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';

export default async function DestinationsPage({ params }: DestinationsPageProps) {
  const { locale } = await params;
  const destinations = await getDestinations(locale);

  const breadcrumbs = [
    { label: locale === 'fr' ? 'Accueil' : locale === 'es' ? 'Inicio' : 'Home', href: '/' },
    { label: 'Destinations' },
  ];

  const heading =
    locale === 'fr'
      ? "Explorez les Plus Belles Destinations du Maroc"
      : locale === 'es'
      ? 'Explore los Destinos más Bellos de Marruecos'
      : "Explore Morocco's Most Breathtaking Destinations";

  const subtitle =
    locale === 'fr'
      ? "Découvrez la magie du Maroc à travers nos destinations soigneusement sélectionnées. Des dunes dorées du Sahara aux ruelles bleues de Chefchaouen, chaque destination offre une expérience unique, un patrimoine culturel riche et des aventures inoubliables."
      : locale === 'es'
      ? 'Descubra la magia de Marruecos a través de nuestros destinos cuidadosamente seleccionados. Desde las dunas doradas del Sáhara hasta las callejuelas azules de Chefchaouen, cada destino ofrece una experiencia única y aventuras inolvidables.'
      : 'Discover the magic of Morocco through our carefully curated destinations. From the golden dunes of the Sahara to the vibrant souks of Marrakech, from the blue-washed streets of Chefchaouen to the ancient medinas of Fes. Each destination offers unique experiences, rich cultural heritage, and unforgettable adventures waiting to be explored.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDF8F2]">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="pt-28 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbs} locale={locale} />
        </div>
      </div>

      {/* ── Centered title section ───────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 text-center pt-4 pb-12">
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
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181E4B] leading-tight">
          {heading}
        </h1>
        <p className="mt-3 text-slate-500 text-xs sm:text-sm md:text-[14px] leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* ── Destinations Grid ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {destinations.map((dest) => {
            const fallback =
              destinationImages[dest.slug.toLowerCase()] || DEFAULT_IMAGE;
            const imageUrl =
              dest.image && dest.image.startsWith('http') ? dest.image : fallback;

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}` as any}
                className="group relative aspect-[4/3.3] sm:aspect-[4/3.4] rounded-2xl overflow-hidden bg-[#F7EBDD] ring-1 ring-inset ring-white/35 shadow-[0_8px_24px_rgba(80,48,31,0.12)] hover:shadow-[0_18px_40px_-8px_rgba(223,105,81,0.3)] hover:ring-white/70 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between p-3.5 sm:p-4 text-white"
              >
                {/* Photo */}
                <Image
                  src={imageUrl}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Dark gradient overlay — stronger at bottom */}
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

                {/* Destination name — bottom left */}
                <div className="relative z-10">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-300/90">
                    Destination
                  </span>
                  <h2 className="font-serif text-[15px] sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors drop-shadow-sm mt-0.5 line-clamp-1">
                    {dest.name}
                  </h2>
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

        {/* Empty state */}
        {destinations.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 text-sm">Aucune destination disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
