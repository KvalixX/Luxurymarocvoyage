'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';

interface ItineraryItem {
  id: number;
  day: string;
  title: string;
  text: string;
}

interface TourItineraryProps {
  itinerary: ItineraryItem[];
  locale: string;
}

export default function TourItinerary({
  itinerary,
  locale,
}: TourItineraryProps) {
  // All open by default or track open states
  const [openItems, setOpenItems] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    itinerary.forEach((item, index) => {
      // First 2 open by default
      initial[item.id] = index < 2;
    });
    return initial;
  });

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    itinerary.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-2 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-terracotta-500" />
          <h2 className="font-serif text-2xl font-bold text-morocco-dark">
            Programme Détaillé Jour par Jour
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-600">
          <button
            onClick={expandAll}
            className="hover:underline focus:outline-none"
          >
            Tout déplier
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="hover:underline focus:outline-none"
          >
            Tout replier
          </button>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-sand-300 flex flex-col gap-6">
        {itinerary.map((item, index) => {
          const isOpen = openItems[item.id] ?? false;

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isOpen
                    ? 'bg-terracotta-500 text-white shadow-md scale-110'
                    : 'bg-morocco-warm text-sand-800 border-2 border-sand-400 group-hover:border-terracotta-500'
                }`}
              >
                {index + 1}
              </div>

              {/* Day Accordion Container */}
              <div className="rounded-2xl bg-white border border-sand-200/80 shadow-sm overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-sand-50/50 transition-colors focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 shrink-0">
                      {item.day || `Jour ${index + 1}`}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-morocco-dark">
                      {item.title}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-terracotta-50 text-terracotta-600 rotate-180'
                        : 'bg-sand-100 text-sand-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-sm text-sand-800 leading-relaxed border-t border-sand-100 animate-in fade-in duration-200">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.text.replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
