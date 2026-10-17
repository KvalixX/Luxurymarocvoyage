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
  includes: string[];
  options: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
  locale: string;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'included', label: 'Included/Highlights' },
  { id: 'itinerary', label: 'Itinerary' },
];

export default function TourDetailTabs({
  presentation,
  description,
  includes,
  options,
  highlights,
  itinerary,
  locale,
}: TourDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
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
          {!presentation && !description && (
            <p className="text-sm text-slate-500 italic">No description available.</p>
          )}
        </div>
      )}

      {activeTab === 'included' && (
        <TourInclusions
          includes={includes}
          options={options}
          highlights={highlights}
          locale={locale}
        />
      )}

      {activeTab === 'itinerary' && (
        itinerary && itinerary.length > 0 ? (
          <TourItinerary itinerary={itinerary} locale={locale} />
        ) : (
          <p className="text-sm text-slate-500 italic">No itinerary details available.</p>
        )
      )}
    </div>
  );
}
