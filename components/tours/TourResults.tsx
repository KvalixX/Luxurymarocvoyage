'use client';

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import TourCard from '@/components/tours/TourCard';

interface TourResultsProps {
  tours: Tour[];
  locale: string;
  isExcursion?: boolean;
}

export default function TourResults({ tours, locale, isExcursion = false }: TourResultsProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const labels = locale === 'fr'
    ? { grid: 'Vue en grille', list: 'Vue en liste' }
    : locale === 'es'
      ? { grid: 'Vista de cuadrícula', list: 'Vista de lista' }
      : { grid: 'Grid view', list: 'List view' };

  return (
    <div>
      <div className="mb-3 flex justify-end gap-1">
        <button type="button" onClick={() => setLayout('grid')} aria-label={labels.grid} aria-pressed={layout === 'grid'} className={`rounded-lg p-2 transition-colors ${layout === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setLayout('list')} aria-label={labels.list} aria-pressed={layout === 'list'} className={`rounded-lg p-2 transition-colors ${layout === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
          <List className="h-4 w-4" />
        </button>
      </div>
      <div className={layout === 'grid' ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}>
        {tours.map((tour, index) => (
          <TourCard key={tour.id} tour={tour} locale={locale} index={index} isExcursion={isExcursion} layout={layout} />
        ))}
      </div>
    </div>
  );
}
