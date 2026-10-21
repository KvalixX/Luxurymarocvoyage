'use client';

import { useState } from 'react';
import TourItinerary from './TourItinerary';
import TourInclusions from './TourInclusions';

interface ItineraryItem {
  id: number;
  day: string;
  title: string;
  text: string;
}

interface TourDetailTabsProps {
  presentation: string;
  description: string;
  programme?: string;
  includes: string[];
  options: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
  locale: string;
  separateOptions?: boolean;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'included', label: 'Included/Highlights' },
  { id: 'itinerary', label: 'Itinerary' },
];

export default function TourDetailTabs({
  presentation,
  description,
  programme = '',
  includes,
  options,
  highlights,
  itinerary,
  locale,
  separateOptions = false,
}: TourDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = separateOptions
    ? [...TABS.slice(0, 2), { id: 'options', label: 'Options' }, TABS[2]]
    : TABS;
  const availableTabs = tabs.filter((tab) => {
    if (tab.id === 'overview') return Boolean(presentation.trim() || description.trim() || programme.trim());
    if (tab.id === 'included') return includes.some((item) => item.trim()) || highlights.some((item) => item.trim()) || (!separateOptions && options.some((item) => item.trim()));
    if (tab.id === 'options') return options.some((item) => item.trim());
    return itinerary.length > 0;
  });
  const visibleActiveTab = availableTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : availableTabs[0]?.id;

  if (availableTabs.length === 0) return null;

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex min-w-0 gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
              visibleActiveTab === tab.id
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {visibleActiveTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {visibleActiveTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {programme.trim() && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Programme</h2>
              <div
                className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: programme.replace(/\n/g, '<br />') }}
              />
            </div>
          )}
          {presentation && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Presentation</h2>
              <div
                className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: presentation.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          )}
          {description && description !== presentation && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
              <div
                className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: description.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          )}
        </div>
      )}

      {visibleActiveTab === 'included' && (
        <TourInclusions
          includes={includes}
          options={separateOptions ? [] : options}
          highlights={highlights}
          locale={locale}
          view={separateOptions ? 'included' : 'all'}
        />
      )}

      {visibleActiveTab === 'options' && (
        <TourInclusions includes={[]} options={options} highlights={[]} locale={locale} view="options" />
      )}

      {visibleActiveTab === 'itinerary' && <TourItinerary itinerary={itinerary} locale={locale} />}
    </div>
  );
}
