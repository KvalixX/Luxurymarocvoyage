'use client';

import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface TourFiltersProps {
  destinations: { id: number; name: string }[];
  currentDuration?: string;
  currentDestination?: string;
  currentSearch?: string;
  isExcursion?: boolean;
}

export default function TourFilters({
  destinations,
  currentDuration = '',
  currentDestination = '',
  currentSearch = '',
  isExcursion = false,
}: TourFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(currentSearch);
  const [destination, setDestination] = useState(currentDestination);
  const [duration, setDuration] = useState(currentDuration);

  const applyFilters = (
    newSearch = search,
    newDest = destination,
    newDur = duration
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newDest) params.set('destination', newDest);
    if (newDur) params.set('duration', newDur);

    const qs = params.toString() ? `?${params.toString()}` : '';
    router.push(`${pathname}${qs}` as any);
  };

  const handleReset = () => {
    setSearch('');
    setDestination('');
    setDuration('');
    router.push(pathname as any);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sand-200/80 shadow-sm mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search input */}
        <div className="relative">
          <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
            Recherche par mot-clé
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ex: Sahara, Merzouga, Atlas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters(search)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-sand-50/60 border border-sand-200 rounded-xl text-morocco-dark placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            />
          </div>
        </div>

        {/* Destination selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              applyFilters(search, e.target.value, duration);
            }}
            className="w-full text-xs px-3 py-2.5 bg-sand-50/60 border border-sand-200 rounded-xl text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          >
            <option value="">Toutes les destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
            Durée du séjour
          </label>
          <select
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              applyFilters(search, destination, e.target.value);
            }}
            className="w-full text-xs px-3 py-2.5 bg-sand-50/60 border border-sand-200 rounded-xl text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          >
            <option value="">Toutes les durées</option>
            {isExcursion ? (
              <option value="1">1 Jour (Excursion)</option>
            ) : (
              <>
                <option value="2-4">2 à 4 Jours (Court séjour)</option>
                <option value="5-8">5 à 8 Jours (Classique découverte)</option>
                <option value="9+">9 Jours et plus (Grand Tour)</option>
              </>
            )}
          </select>
        </div>

        {/* Filter / Reset Buttons */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => applyFilters()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrer</span>
          </button>

          {(search || destination || duration) && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-800 transition-colors"
              title="Réinitialiser les filtres"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
