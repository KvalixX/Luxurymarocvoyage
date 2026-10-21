import { CheckCircle2, Sparkles, PlusCircle } from 'lucide-react';

interface TourInclusionsProps {
  includes: string[];
  options: string[];
  highlights: string[];
  locale: string;
  view?: 'all' | 'included' | 'options';
}

export default function TourInclusions({ includes, options, highlights, view = 'all' }: TourInclusionsProps) {
  const visibleIncludes = view !== 'options' ? includes.filter((item) => item.trim().length > 0) : [];
  const visibleOptions = view !== 'included' ? options.filter((option) => option.trim().length > 0) : [];
  const visibleHighlights = view !== 'options' ? highlights.filter((highlight) => highlight.trim().length > 0) : [];

  if (visibleIncludes.length === 0 && visibleOptions.length === 0 && visibleHighlights.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {visibleHighlights.length > 0 && (
        <div className="rounded-3xl border border-sand-200 bg-sand-50/80 p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sand-600" />
            <h3 className="font-serif text-xl font-bold text-morocco-dark">Points Forts du Circuit</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleHighlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-sand-900 sm:text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sand-500" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(visibleIncludes.length > 0 || visibleOptions.length > 0) && (
        <div className={`grid grid-cols-1 gap-6 ${visibleIncludes.length > 0 && visibleOptions.length > 0 ? 'md:grid-cols-2' : ''}`}>
          {visibleIncludes.length > 0 && (
            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center gap-2 border-b border-sand-100 pb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-morocco-dark">Ce qui est Inclus</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {visibleIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-sand-900 sm:text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {visibleOptions.length > 0 && (
            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center gap-2 border-b border-sand-100 pb-3">
                <PlusCircle className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-serif text-lg font-bold text-morocco-dark">Options &amp; Services Disponibles</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {visibleOptions.map((option, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-sand-900 sm:text-sm">
                    <PlusCircle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-400" />
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
