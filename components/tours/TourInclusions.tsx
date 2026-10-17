import { CheckCircle2, Sparkles, PlusCircle } from 'lucide-react';

interface TourInclusionsProps {
  includes: string[];
  options: string[];
  highlights: string[];
  locale: string;
}

export default function TourInclusions({
  includes,
  options,
  highlights,
  locale,
}: TourInclusionsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <div className="rounded-3xl bg-sand-50/80 border border-sand-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-sand-600" />
            <h3 className="font-serif text-xl font-bold text-morocco-dark">
              Points Forts du Circuit
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-900">
                <span className="w-2 h-2 rounded-full bg-sand-500 mt-1.5 shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Inclusions vs Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included */}
        <div className="rounded-3xl bg-white border border-sand-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sand-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif text-lg font-bold text-morocco-dark">
              Ce qui est Inclus
            </h3>
          </div>
          <ul className="flex flex-col gap-3">
            {includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            {includes.length === 0 && (
              <li className="text-xs text-sand-600 italic">
                Véhicule privé climatisé, chauffeur-guide dédié, hébergements en riads et bivouac de luxe.
              </li>
            )}
          </ul>
        </div>

        {/* Options / Extra services */}
        <div className="rounded-3xl bg-white border border-sand-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sand-100">
            <PlusCircle className="w-5 h-5 text-terracotta-500" />
            <h3 className="font-serif text-lg font-bold text-morocco-dark">
              Options & Services Disponibles
            </h3>
          </div>
          <ul className="flex flex-col gap-3">
            {options.map((option, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-900">
                <PlusCircle className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span>{option}</span>
              </li>
            ))}
            {options.length === 0 && (
              <li className="text-xs text-sand-600 italic">
                Survol en montgolfière à Marrakech, quad/buggy dans les dunes de Merzouga, pourboires et dépenses personnelles.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
