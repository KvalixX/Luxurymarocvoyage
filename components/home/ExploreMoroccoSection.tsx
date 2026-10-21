'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { Tour } from '@/lib/queries/tours';
import type { Destination } from '@/lib/queries/destinations';
import { Compass } from 'lucide-react';

interface ExploreMoroccoSectionProps {
  tours: Tour[];
  excursions?: Tour[];
  destinations: Destination[];
  locale: string;
}

const THEME_GROUPS = [
  { key: 'sahara', terms: ['sahara', 'desert', 'désert', 'sáhara', 'merzouga', 'erg chebbi', 'zagora'] },
  { key: 'imperial', terms: ['imperial', 'impérial', 'imperiales', 'ciudades imperiales', 'fes', 'fès', 'meknes', 'meknès', 'rabat'] },
  { key: 'atlas', terms: ['atlas', 'ourika', 'toubkal', 'ouzoud', 'ait ben haddou', 'ouarzazate'] },
  { key: 'coast', terms: ['essaouira', 'agadir', 'coast', 'côte', 'costa', 'atlantic', 'atlantique', 'atlántica'] },
  { key: 'adventure', terms: ['quad', 'buggy', 'balloon', 'montgolfière', 'globo', '4x4', 'trek', 'trekking'] },
];

export default function ExploreMoroccoSection({ tours, excursions = [], destinations, locale }: ExploreMoroccoSectionProps) {
  const t = useTranslations('sections');
  const [activeTab, setActiveTab] = useState<'circuits' | 'excursions' | 'destinations' | 'themes'>('destinations');
  const isEnglish = locale === 'en';
  const isSpanish = locale === 'es';

  const circuitItems = tours.slice(0, 8);
  const excursionItems = excursions.slice(0, 8);
  const destinationItems = destinations.slice(0, 8).map((destination) => {
    const presentation = destination.presentation.trim();
    const summary = presentation.length > 132 ? `${presentation.slice(0, 129).trimEnd()}…` : presentation;
    return {
      name: destination.name,
      summary: summary || (isEnglish ? `Explore private tours and excursions in ${destination.name}.` : isSpanish ? `Descubre circuitos y excursiones en ${destination.name}.` : `Découvrez les circuits et excursions à ${destination.name}.`),
      slug: destination.slug,
    };
  });

  const searchableTours = [...tours, ...excursions].map((tour) => ({ tour, searchable: `${tour.title} ${tour.departure} ${tour.type}`.toLocaleLowerCase(locale) }));
  const themes = THEME_GROUPS.flatMap((group) => {
    const match = searchableTours.find(({ searchable }) => group.terms.some((term) => searchable.includes(term)));
    if (!match) return [];
    const localized = {
      sahara: isEnglish ? 'Sahara Desert tours' : isSpanish ? 'Circuitos por el desierto del Sáhara' : 'Circuits dans le désert du Sahara',
      imperial: isEnglish ? 'Imperial cities of Morocco' : isSpanish ? 'Ciudades imperiales de Marruecos' : 'Villes impériales du Maroc',
      atlas: isEnglish ? 'Atlas Mountains and valley trips' : isSpanish ? 'Excursiones al Atlas y sus valles' : 'Excursions dans l’Atlas et ses vallées',
      coast: isEnglish ? 'Atlantic coast tours' : isSpanish ? 'Viajes por la costa atlántica' : 'Voyages sur la côte atlantique',
      adventure: isEnglish ? 'Morocco adventure excursions' : isSpanish ? 'Excursiones de aventura en Marruecos' : 'Excursions aventure au Maroc',
    }[group.key];
    return [{ title: localized, tour: match.tour }];
  });

  const seoIntro = isEnglish
    ? 'Explore private Morocco tours from Marrakech, Sahara Desert trips to Merzouga, day excursions to the High Atlas and Atlantic coast, and the destinations featured in our current itineraries.'
    : isSpanish
      ? 'Descubre circuitos privados desde Marrakech, viajes al desierto del Sáhara en Merzouga, excursiones al Alto Atlas y la costa atlántica, y destinos incluidos en nuestros itinerarios.'
      : 'Découvrez nos circuits privés au départ de Marrakech, nos voyages dans le désert du Sahara à Merzouga, nos excursions dans le Haut Atlas et sur la côte atlantique, ainsi que les destinations de nos itinéraires.';

  const tabs = [
    { id: 'destinations' as const, label: t('tabDestinations') },
    { id: 'themes' as const, label: t('tabThemes') },
    { id: 'circuits' as const, label: t('tabCircuits') },
    { id: 'excursions' as const, label: t('tabExcursions') },
  ];
  const emptyMessage = isEnglish ? 'Explore all available trips and destinations.' : isSpanish ? 'Descubre todos los viajes y destinos disponibles.' : 'Explorez les voyages et destinations disponibles.';

  return (
    <section className="overflow-hidden border-t border-[#F0E6D8]/60 bg-gradient-to-b from-white via-white to-[#FDF8F2] py-14 sm:py-18 lg:py-20" aria-labelledby="explore-morocco-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-eyebrow"><Compass className="h-3 w-3 text-[#DF6951]" /><span>{isEnglish ? 'Morocco travel ideas' : isSpanish ? 'Ideas para viajar por Marruecos' : 'Idées de voyage au Maroc'}</span></div>
        <h2 id="explore-morocco-title" className="mb-3 font-serif text-2xl font-bold tracking-tight text-[#181E4B] sm:text-3xl lg:text-[34px]">{t('exploreMoroccoTitle')}</h2>
        <p className="max-w-4xl text-sm leading-6 text-slate-600">{seoIntro}</p>

        <div role="tablist" aria-label={isEnglish ? 'Explore Morocco by topic' : isSpanish ? 'Explorar Marruecos por tema' : 'Explorer le Maroc par thème'} className="mt-7 mb-7 flex items-center gap-6 border-b border-slate-200/80 text-xs sm:gap-8 sm:text-sm">
          {tabs.map((tab) => <button key={tab.id} id={`explore-tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`explore-panel-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`relative cursor-pointer pb-3 font-semibold transition-colors ${activeTab === tab.id ? 'font-bold text-[#DF6951]' : 'text-slate-500 hover:text-slate-800'}`}>{tab.label}{activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#DF6951]" />}</button>)}
        </div>

        <div id="explore-panel-circuits" role="tabpanel" aria-labelledby="explore-tab-circuits" hidden={activeTab !== 'circuits'} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {circuitItems.length ? circuitItems.map((tour) => <article key={tour.id} className="rounded-xl p-3 transition-colors hover:bg-orange-50/50"><Link href={`/circuits/${tour.slug}` as any} title={tour.title} className="font-bold text-[13px] leading-snug text-[#181E4B] hover:text-[#DF6951]">{tour.title}</Link><p className="mt-1 text-xs text-slate-500">{tour.days} {isEnglish ? (tour.days === 1 ? 'day' : 'days') : isSpanish ? (tour.days === 1 ? 'día' : 'días') : (tour.days === 1 ? 'jour' : 'jours')} · {tour.nights} {isEnglish ? (tour.nights === 1 ? 'night' : 'nights') : isSpanish ? (tour.nights === 1 ? 'noche' : 'noches') : (tour.nights === 1 ? 'nuit' : 'nuits')}</p></article>) : <p className="col-span-full text-sm text-slate-500">{emptyMessage} <Link href="/circuits" className="font-semibold text-[#B64F2E] underline">{t('tabCircuits')}</Link></p>}
        </div>

        <div id="explore-panel-excursions" role="tabpanel" aria-labelledby="explore-tab-excursions" hidden={activeTab !== 'excursions'} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {excursionItems.length ? excursionItems.map((tour) => <article key={tour.id} className="rounded-xl p-3 transition-colors hover:bg-orange-50/50"><Link href={`/excursions/${tour.slug}` as any} title={tour.title} className="font-bold text-[13px] leading-snug text-[#181E4B] hover:text-[#DF6951]">{tour.title}</Link><p className="mt-1 text-xs text-slate-500">{tour.departure ? `${isEnglish ? 'From' : isSpanish ? 'Desde' : 'Départ de'} ${tour.departure} · ` : ''}{tour.days} {isEnglish ? (tour.days === 1 ? 'day' : 'days') : isSpanish ? (tour.days === 1 ? 'día' : 'días') : (tour.days === 1 ? 'jour' : 'jours')}</p></article>) : <p className="col-span-full text-sm text-slate-500">{emptyMessage} <Link href="/excursions" className="font-semibold text-[#B64F2E] underline">{t('tabExcursions')}</Link></p>}
        </div>

        <div id="explore-panel-destinations" role="tabpanel" aria-labelledby="explore-tab-destinations" hidden={activeTab !== 'destinations'} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinationItems.length ? destinationItems.map((destination) => <article key={destination.slug} className="rounded-xl p-3 transition-colors hover:bg-orange-50/50"><Link href={`/destinations/${destination.slug}` as any} title={destination.name} className="font-bold text-[13px] leading-snug text-[#181E4B] hover:text-[#DF6951]">{destination.name}</Link><p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{destination.summary}</p></article>) : <p className="col-span-full text-sm text-slate-500">{emptyMessage} <Link href="/destinations" className="font-semibold text-[#B64F2E] underline">{t('tabDestinations')}</Link></p>}
        </div>

        <div id="explore-panel-themes" role="tabpanel" aria-labelledby="explore-tab-themes" hidden={activeTab !== 'themes'} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {themes.length ? themes.map(({ title, tour }) => <article key={title} className="rounded-xl p-3 transition-colors hover:bg-orange-50/50"><Link href={`${tour.type.toLowerCase().includes('excursion') ? '/excursions' : '/circuits'}/${tour.slug}` as any} className="font-bold text-[13px] leading-snug text-[#181E4B] hover:text-[#DF6951]">{title}</Link><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{tour.title}{tour.departure ? ` · ${isEnglish ? 'from' : isSpanish ? 'desde' : 'au départ de'} ${tour.departure}` : ''}</p></article>) : <p className="col-span-full text-sm text-slate-500">{emptyMessage} <Link href="/circuits" className="font-semibold text-[#B64F2E] underline">{t('tabCircuits')}</Link></p>}
        </div>
      </div>
    </section>
  );
}
