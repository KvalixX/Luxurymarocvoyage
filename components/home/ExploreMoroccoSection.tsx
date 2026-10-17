'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Tour } from '@/lib/queries/tours';
import { Destination } from '@/lib/queries/destinations';
import { Compass } from 'lucide-react';

interface ExploreMoroccoSectionProps {
  tours: Tour[];
  destinations: Destination[];
  locale: string;
}

export default function ExploreMoroccoSection({
  tours,
  destinations,
  locale,
}: ExploreMoroccoSectionProps) {
  const t = useTranslations('sections');
  const [activeTab, setActiveTab] = useState<'circuits' | 'destinations' | 'themes'>('circuits');

  // Circuits (fallback to sample high-reputation circuits if database list is short)
  const defaultCircuits = [
    {
      title: 'Marrakech & désert du Sahara : de l’Atlas aux dunes dorées',
      duration: '7 jours / 6 nuits',
      slug: 'marrakech-desert-merzouga',
    },
    {
      title: 'Marrakech, désert du Sahara & Fès : grand voyage impérial',
      duration: '9 jours / 8 nuits',
      slug: 'marrakech-fes-desert',
    },
    {
      title: 'Marrakech & désert du Sahara : l’Atlas et les gorges du Dadès',
      duration: '8 jours / 7 nuits',
      slug: 'marrakech-atlas-dades',
    },
    {
      title: 'Marrakech & villes impériales : un voyage au cœur de l’histoire',
      duration: '9 jours / 8 nuits',
      slug: 'villes-imperiales-maroc',
    },
    {
      title: 'Marrakech, villes impériales & Sahara : le grand tour complet',
      duration: '12 jours / 11 nuits',
      slug: 'grand-tour-maroc-12-jours',
    },
    {
      title: 'Marrakech, Sahara & nord du Maroc : Chefchaouen & Tanger',
      duration: '13 jours / 12 nuits',
      slug: 'maroc-nord-sud-complet',
    },
    {
      title: 'Marrakech, Agafay, Agadir & Essaouira : de l’océan au désert',
      duration: '9 jours / 8 nuits',
      slug: 'marrakech-agadir-essaouira',
    },
    {
      title: 'Marrakech, Agafay, Atlas & Essaouira : désert, montagne & océan',
      duration: '8 jours / 7 nuits',
      slug: 'agafay-atlas-essaouira',
    },
  ];

  const circuitsList =
    tours && tours.length >= 8
      ? tours.slice(0, 8).map((t) => ({
          title: t.title,
          duration: `${t.days} ${locale === 'es' ? 'días' : locale === 'en' ? 'days' : 'jours'} / ${t.nights || t.days - 1} ${locale === 'es' ? 'noches' : locale === 'en' ? 'nights' : 'nuits'}`,
          slug: t.slug,
        }))
      : defaultCircuits;

  // Destinations list
  const defaultDestinations = [
    { name: 'Marrakech', desc: 'Médina historique & Palais de la Bahia', slug: 'marrakech' },
    { name: 'Merzouga (Sahara)', desc: 'Dunes dorées de l’Erg Chebbi & bivouac VIP', slug: 'merzouga' },
    { name: 'Fès', desc: 'Capitale spirituelle & artisanat millénaire', slug: 'fes' },
    { name: 'Chefchaouen', desc: 'La cité bleue féérique du Rif marocain', slug: 'chefchaouen' },
    { name: 'Essaouira', desc: 'Port fortifié, remparts & alizés atlantiques', slug: 'essaouira' },
    { name: 'Ouarzazate & Aït Benhaddou', desc: 'Porte du désert & kasbahs de terre UNESCO', slug: 'ouarzazate' },
    { name: 'Désert d’Agafay', desc: 'Canyon minéral & tentes de luxe aux portes de Marrakech', slug: 'agafay' },
    { name: 'Haut Atlas & Vallée de l’Ourika', desc: 'Villages berbères authentiques & cimes enneigées', slug: 'haut-atlas' },
  ];

  const destinationsList =
    destinations && destinations.length >= 8
      ? destinations.slice(0, 8).map((d) => ({
          name: d.name,
          desc: d.presentation ? d.presentation.slice(0, 48) + '...' : 'Destination incontournable du Maroc',
          slug: d.slug,
        }))
      : defaultDestinations;

  // Themes list
  const themesList = [
    {
      title: locale === 'en' ? 'Sahara Desert & Royal Camp' : locale === 'es' ? 'Desierto del Sáhara y Bivouac Real' : 'Désert du Sahara & Bivouac Royal',
      desc: locale === 'en' ? 'Erg Chebbi dunes, camel trek & stargazing' : 'Dunes de Merzouga, dromadaires & tentes royales',
      link: '/circuits',
    },
    {
      title: locale === 'en' ? 'Imperial Cities & Heritage' : locale === 'es' ? 'Ciudades Imperiales y Patrimonio' : 'Villes Impériales & Médinas UNESCO',
      desc: locale === 'en' ? 'Fes, Meknes, Rabat & Marrakech palaces' : 'Fès, Meknès, Rabat & Marrakech historique',
      link: '/circuits',
    },
    {
      title: locale === 'en' ? 'Atlas Mountains & Berber Valleys' : locale === 'es' ? 'Montañas del Atlas y Valles' : 'Haut Atlas & Vallées Berbères',
      desc: locale === 'en' ? 'Toubkal peaks, Ourika valley & waterfalls' : 'Sommets du Toubkal, Ourika & traditions berbères',
      link: '/excursions',
    },
    {
      title: locale === 'en' ? 'Atlantic Coast & Essaouira' : locale === 'es' ? 'Costa Atlántica y Essaouira' : 'Côte Atlantique & Alizés',
      desc: locale === 'en' ? 'Mogador port, ramparts & fresh seafood' : 'Essaouira Mogador, remparts & brise marine',
      link: '/excursions',
    },
    {
      title: locale === 'en' ? 'Wellness, Spas & Historic Riads' : locale === 'es' ? 'Bienestar, Spas y Riads' : 'Bien-être, Spas & Riads de Charme',
      desc: locale === 'en' ? 'Traditional hammams & bespoke massages' : 'Hammams traditionnels & massages aux huiles pures',
      link: '/circuits',
    },
    {
      title: locale === 'en' ? 'Moroccan Culinary Journey' : locale === 'es' ? 'Gastronomía Marroquí y Sabores' : 'Gastronomie & Terroir Marocain',
      desc: locale === 'en' ? 'Market walks, spices & masterclasses' : 'Marchés aux épices, cours de cuisine & dégustations',
      link: '/excursions',
    },
    {
      title: locale === 'en' ? '4x4 Adventure & Desert Tracks' : locale === 'es' ? 'Aventura 4x4 y Pistas del Sur' : 'Aventure 4x4 & Pistes du Grand Sud',
      desc: locale === 'en' ? 'Dades Gorges, Draa Valley & Dakar trails' : 'Gorges du Dadès, Vallée du Drâa & oasis',
      link: '/circuits',
    },
    {
      title: locale === 'en' ? 'Honeymoon & Romantic Escapes' : locale === 'es' ? 'Luna de Miel y Escapadas Románticas' : 'Voyage de Noces & Romantisme',
      desc: locale === 'en' ? 'Candlelight dinners & confidential riads' : 'Dîners aux chandelles dans les dunes & riads secrets',
      link: '/contact',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-white to-[#FDF8F2] border-t border-[#F0E6D8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="section-eyebrow">
          <Compass className="w-3 h-3 text-[#DF6951]" />
          <span>
            {locale === 'fr'
              ? 'Inspiration & Découverte'
              : locale === 'es'
              ? 'Inspiración y Descubrimiento'
              : 'Inspiration & Discovery'}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#181E4B] tracking-tight mb-8">
          {t('exploreMoroccoTitle')}
        </h2>

        {/* Tabs Row */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-200/80 mb-8 sm:mb-10 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`pb-3 font-semibold transition-all relative cursor-pointer ${
              activeTab === 'destinations'
                ? 'text-[#DF6951] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('tabDestinations')}
            {activeTab === 'destinations' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#DF6951] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`pb-3 font-semibold transition-all relative cursor-pointer ${
              activeTab === 'themes'
                ? 'text-[#DF6951] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('tabThemes')}
            {activeTab === 'themes' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#DF6951] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('circuits')}
            className={`pb-3 font-semibold transition-all relative cursor-pointer ${
              activeTab === 'circuits'
                ? 'text-[#DF6951] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('tabCircuits')}
            {activeTab === 'circuits' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#DF6951] rounded-full" />
            )}
          </button>
        </div>

        {/* 4-Columns Grid with smooth interactive states */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 sm:gap-y-6">
          {/* Tab 1: Circuits */}
          {activeTab === 'circuits' &&
            circuitsList.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col p-3 rounded-xl hover:bg-orange-50/40 transition-colors -mx-3"
              >
                <Link
                  href={`/circuits/${item.slug}` as any}
                  className="font-bold text-[13px] sm:text-[13.5px] text-[#181E4B] hover:text-[#DF6951] transition-colors leading-snug line-clamp-2"
                  title={item.title}
                >
                  {item.title}
                </Link>
                <span className="text-[11.5px] text-slate-400 font-normal mt-1">
                  {item.duration}
                </span>
              </div>
            ))}

          {/* Tab 2: Destinations */}
          {activeTab === 'destinations' &&
            destinationsList.map((dest, idx) => (
              <div
                key={idx}
                className="flex flex-col p-3 rounded-xl hover:bg-orange-50/40 transition-colors -mx-3"
              >
                <Link
                  href={`/destinations/${dest.slug}` as any}
                  className="font-bold text-[13px] sm:text-[13.5px] text-[#181E4B] hover:text-[#DF6951] transition-colors leading-snug line-clamp-1"
                  title={dest.name}
                >
                  {dest.name}
                </Link>
                <span className="text-[11.5px] text-slate-400 font-normal mt-1 line-clamp-1">
                  {dest.desc}
                </span>
              </div>
            ))}

          {/* Tab 3: Themes */}
          {activeTab === 'themes' &&
            themesList.map((theme, idx) => (
              <div
                key={idx}
                className="flex flex-col p-3 rounded-xl hover:bg-orange-50/40 transition-colors -mx-3"
              >
                <Link
                  href={theme.link as any}
                  className="font-bold text-[13px] sm:text-[13.5px] text-[#181E4B] hover:text-[#DF6951] transition-colors leading-snug line-clamp-1"
                  title={theme.title}
                >
                  {theme.title}
                </Link>
                <span className="text-[11.5px] text-slate-400 font-normal mt-1 line-clamp-1">
                  {theme.desc}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
