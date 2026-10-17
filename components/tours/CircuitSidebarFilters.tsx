'use client';

import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { useState, useTransition } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface CircuitSidebarFiltersProps {
  destinations: { id: number; name: string }[];
  currentDuration?: string;
  currentDestination?: string;
  currentSearch?: string;
  currentType?: string;
  currentNights?: string;
  totalCount: number;
  excursionMode?: boolean;
}

/* ── Checkbox component ─────────────────────────────────────── */
function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <span
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked
            ? 'bg-terracotta-500 border-terracotta-500'
            : 'border-slate-300 bg-white group-hover:border-terracotta-400'
        }`}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        onClick={onChange}
        className={`text-sm transition-colors ${
          checked ? 'text-terracotta-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'
        }`}
      >
        {label}
      </span>
    </label>
  );
}

/* ── Collapsible section ────────────────────────────────────── */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3"
      >
        <span className="text-sm font-bold text-slate-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {open && <div className="flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}

/* ── Main sidebar component ─────────────────────────────────── */
export default function CircuitSidebarFilters({
  currentDuration = '',
  currentType = '',
  currentNights = '',
  totalCount,
  excursionMode = false,
}: CircuitSidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Type state (multi-select via set)
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    currentType ? new Set(currentType.split(',')) : new Set()
  );

  // Duration state (single select)
  const [selectedDuration, setSelectedDuration] = useState(currentDuration);

  // Nights state (single select)
  const [selectedNights, setSelectedNights] = useState(currentNights);

  const hasFilters = selectedTypes.size > 0 || selectedDuration || selectedNights;

  const pushFilters = (
    types: Set<string> = selectedTypes,
    dur: string = selectedDuration,
    nights: string = selectedNights
  ) => {
    const params = new URLSearchParams();
    if (types.size > 0) params.set('type', [...types].join(','));
    if (dur) params.set('duration', dur);
    if (nights) params.set('nights', nights);
    const qs = params.toString() ? `?${params.toString()}` : '';
    startTransition(() => router.push(`${pathname}${qs}` as any));
  };

  const toggleType = (val: string) => {
    const next = new Set(selectedTypes);
    next.has(val) ? next.delete(val) : next.add(val);
    setSelectedTypes(next);
    pushFilters(next, selectedDuration, selectedNights);
  };

  const toggleDuration = (val: string) => {
    const next = selectedDuration === val ? '' : val;
    setSelectedDuration(next);
    pushFilters(selectedTypes, next, selectedNights);
  };

  const toggleNights = (val: string) => {
    const next = selectedNights === val ? '' : val;
    setSelectedNights(next);
    pushFilters(selectedTypes, selectedDuration, next);
  };

  const handleReset = () => {
    setSelectedTypes(new Set());
    setSelectedDuration('');
    setSelectedNights('');
    startTransition(() => router.push(pathname as any));
  };

  const durationOptions = ['1', '4', '5', '6', '7', '8', '10', '14', '15'];
  const nightOptions = ['1', '3', '4', '5', '6', '7', '9', '13', '14'];

  return (
    <aside className="w-full lg:w-[240px] xl:w-[260px] shrink-0">
      <div className="bg-white rounded-2xl border border-[#F0E6D8]/80 shadow-[0_2px_12px_rgba(26,15,10,0.04)] p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#181E4B]">Filtres</h2>
          {hasFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Type */}
        <FilterSection title="Type">
          {['group', 'private'].map((val) => (
            <FilterCheckbox
              key={val}
              label={val === 'group' ? 'Circuit en groupe' : 'Circuit privé'}
              checked={selectedTypes.has(val)}
              onChange={() => toggleType(val)}
            />
          ))}
        </FilterSection>

        {/* Duration (days) — hidden for excursions */}
        {!excursionMode && (
          <FilterSection title="Durée">
            {durationOptions.map((d) => (
              <FilterCheckbox
                key={d}
                label={`${d} jour${parseInt(d) > 1 ? 's' : ''}`}
                checked={selectedDuration === d}
                onChange={() => toggleDuration(d)}
              />
            ))}
          </FilterSection>
        )}

        {/* Nights — hidden for excursions */}
        {!excursionMode && (
          <FilterSection title="Nuits">
            {nightOptions.map((n) => (
              <FilterCheckbox
                key={n}
                label={`${n} nuit${parseInt(n) > 1 ? 's' : ''}`}
                checked={selectedNights === n}
                onChange={() => toggleNights(n)}
              />
            ))}
          </FilterSection>
        )}
      </div>
    </aside>
  );
}
