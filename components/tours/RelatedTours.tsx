import { Tour } from '@/lib/queries/tours';
import TourCard from '@/components/tours/TourCard';

interface RelatedToursProps {
  tours: Tour[];
  locale: string;
  isExcursion?: boolean;
}

export default function RelatedTours({ tours, locale, isExcursion = false }: RelatedToursProps) {
  if (!tours || tours.length === 0) return null;

  return (
    <div className="flex flex-wrap items-stretch gap-5">
      {tours.map((tour, index) => (
        <TourCard key={tour.id} tour={tour} locale={locale} isExcursion={isExcursion} index={index} compact />
      ))}
    </div>
  );
}
