'use client';

import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { useState, useTransition } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface CircuitSidebarFiltersProps {
  destinations: { id: number; name: string }[];
  locale: string;
  currentDuration?: string;
  currentDestination?: string;
  currentSearch?: string;
  currentType?: string;
  currentNights?: string;
  totalCount: number;
  durationOptions?: number[];
  nightOptions?: number[];
  excursionMode?: boolean;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-4 border-b border-slate-200 pb-4 last:mb-0 last:border-0 last:pb-0">
      <button type="button" onClick={() => setOpen((value) => !value)} className="mb-3 flex w-full items-center justify-between text-left">
        <span className="text-sm font-bold text-slate-800">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="flex flex-col gap-2">{children}</div>}
    </section>
  );
}

export default function CircuitSidebarFilters({
  destinations,
  locale,
  currentDuration = '',
  currentDestination = '',
  currentSearch = '',
  currentType = '',
  currentNights = '',
  totalCount,
  durationOptions: suppliedDurations,
  nightOptions: suppliedNights,
}: CircuitSidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(currentType ? currentType.split(',') : []));
  const [selectedDuration, setSelectedDuration] = useState(currentDuration);
  const [selectedNights, setSelectedNights] = useState(currentNights);
  const [selectedDestination, setSelectedDestination] = useState(currentDestination);

  const hasFilters = selectedTypes.size > 0 || selectedDuration || selectedNights || selectedDestination || currentSearch;
  const copy = locale === 'fr'
    ? { title: 'Filtres', reset: 'Réinitialiser', type: 'Type', private: 'Circuit privé', group: 'Circuit en groupe', duration: 'Durée', day: 'jour', days: 'jours', nights: 'Nuits', night: 'nuit', nightsPlural: 'nuits', destination: 'Destination', allDestinations: 'Toutes les destinations' }
    : locale === 'es'
      ? { title: 'Filtros', reset: 'Restablecer', type: 'Tipo', private: 'Circuito privado', group: 'Circuito en grupo', duration: 'Duración', day: 'día', days: 'días', nights: 'Noches', night: 'noche', nightsPlural: 'noches', destination: 'Destino', allDestinations: 'Todos los destinos' }
      : { title: 'Filters', reset: 'Reset', type: 'Type', private: 'Private tour', group: 'Group tour', duration: 'Duration', day: 'day', days: 'days', nights: 'Nights', night: 'night', nightsPlural: 'nights', destination: 'Destination', allDestinations: 'All destinations' };

  const pushFilters = (
    types = selectedTypes,
    duration = selectedDuration,
    nights = selectedNights,
    destination = selectedDestination,
  ) => {
    const params = new URLSearchParams();
    if (types.size) params.set('type', [...types].join(','));
    if (duration) params.set('duration', duration);
    if (nights) params.set('nights', nights);
    if (destination) params.set('destination', destination);
    if (currentSearch) params.set('q', currentSearch);
    const query = params.toString();
    startTransition(() => router.push(`${pathname}${query ? `?${query}` : ''}` as any));
  };

  const toggleType = (type: string) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
    pushFilters(next);
  };

  const toggleDuration = (duration: string) => {
    const next = selectedDuration === duration ? '' : duration;
    setSelectedDuration(next);
    pushFilters(selectedTypes, next);
  };

  const toggleNights = (nights: string) => {
    const next = selectedNights === nights ? '' : nights;
    setSelectedNights(next);
    pushFilters(selectedTypes, selectedDuration, next);
  };

  const updateDestination = (destination: string) => {
    setSelectedDestination(destination);
    pushFilters(selectedTypes, selectedDuration, selectedNights, destination);
  };

  const resetFilters = () => {
    setSelectedTypes(new Set());
    setSelectedDuration('');
    setSelectedNights('');
    setSelectedDestination('');
    startTransition(() => router.push(pathname as any));
  };

  const durations = [...new Set(suppliedDurations ?? [1, 4, 5, 6, 7, 8, 10, 14, 15])].sort((a, b) => a - b);
  const nights = [...new Set(suppliedNights ?? [1, 3, 4, 5, 6, 7, 9, 13, 14])].sort((a, b) => a - b);
  const options = (values: number[], selected: string, onSelect: (value: string) => void, singular: string, plural: string) => values.map((value) => {
    const normalized = String(value);
    return (
      <label key={normalized} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-600 hover:text-slate-900">
        <input type="checkbox" checked={selected === normalized} onChange={() => onSelect(normalized)} className="h-4 w-4 rounded border-slate-300 accent-[#DF6951]" />
        {normalized} {value === 1 ? singular : plural}
      </label>
    );
  });

  return (
    <aside className="w-full shrink-0 lg:w-[240px] xl:w-[260px]">
      <div className="rounded-2xl border border-[#F0E6D8]/80 bg-white p-5 shadow-[0_2px_12px_rgba(26,15,10,0.04)] sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#181E4B]">{copy.title}</h2>
          {!!hasFilters && <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"><RotateCcw className="h-3 w-3" />{copy.reset}</button>}
        </div>

        <FilterSection title={copy.type}>
          {[
            ['private', copy.private],
            ['group', copy.group],
          ].map(([type, label]) => (
            <label key={type} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-600 hover:text-slate-900">
              <input type="checkbox" checked={selectedTypes.has(type)} onChange={() => toggleType(type)} className="h-4 w-4 rounded border-slate-300 accent-[#DF6951]" />
              {label}
            </label>
          ))}
        </FilterSection>

        <FilterSection title={copy.duration}>
          {options(durations, selectedDuration, toggleDuration, copy.day, copy.days)}
        </FilterSection>

        <FilterSection title={copy.nights}>
          {options(nights, selectedNights, toggleNights, copy.night, copy.nightsPlural)}
        </FilterSection>

        <FilterSection title={copy.destination}>
          <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-600 hover:text-slate-900">
            <input type="radio" name="destination-filter" checked={!selectedDestination} onChange={() => updateDestination('')} className="h-4 w-4 border-slate-300 accent-[#DF6951]" />
            {copy.allDestinations}
          </label>
          {destinations.map((destination) => (
            <label key={destination.id} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-600 hover:text-slate-900">
              <input type="radio" name="destination-filter" value={destination.id} checked={selectedDestination === String(destination.id)} onChange={() => updateDestination(String(destination.id))} className="h-4 w-4 border-slate-300 accent-[#DF6951]" />
              {destination.name}
            </label>
          ))}
        </FilterSection>
        <p className="pt-3 text-xs text-slate-500">{totalCount} {locale === 'fr' ? 'résultats' : locale === 'es' ? 'resultados' : 'results'}</p>
      </div>
    </aside>
  );
}
