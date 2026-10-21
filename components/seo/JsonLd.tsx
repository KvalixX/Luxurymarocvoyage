import { TourDetail } from '@/lib/queries/tours';
import { localizedUrl } from '@/lib/seo/urls';

interface TouristTripJsonLdProps {
  tour: TourDetail;
  locale: string;
  tripType?: 'circuit' | 'excursion';
}

export function TouristTripJsonLd({ tour, locale, tripType = 'circuit' }: TouristTripJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxurymarocvoyage.com';
  const url = localizedUrl(locale, `/${tripType === 'excursion' ? 'excursions' : 'circuits'}/[slug]`, { slug: tour.slug });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    url,
    description: tour.description || tour.presentation,
    image: tour.image ? [tour.image, ...tour.gallery] : tour.gallery,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.itinerary?.length || 0,
      itemListElement: tour.itinerary?.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'TouristAttraction',
          name: `${item.day}: ${item.title}`,
          description: item.text,
        },
      })),
    },
    provider: {
      '@type': 'TravelAgency',
      '@id': `${siteUrl}/#travel-agency`,
      name: 'Luxurymarocvoyage',
      url: siteUrl,
      telephone: '+212776715010',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '10:00',
          closes: '16:00',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
