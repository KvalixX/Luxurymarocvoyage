import { TourDetail } from '@/lib/queries/tours';

interface TouristTripJsonLdProps {
  tour: TourDetail;
  locale: string;
}

export function TouristTripJsonLd({ tour, locale }: TouristTripJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';
  const url = `${siteUrl}/${locale}/circuits/${tour.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['TouristTrip', 'Product'],
    name: tour.title,
    description: tour.description || tour.presentation,
    image: tour.image ? [tour.image, ...tour.gallery] : tour.gallery,
    touristType: ['Luxury', 'Adventure', 'Cultural'],
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
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: tour.price ? tour.price.replace(/[^0-9]/g, '') || '450' : '450',
      availability: 'https://schema.org/InStock',
      url,
      validFrom: '2025-01-01',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Luxurymarocvoyage',
      url: siteUrl,
      telephone: '+212600000000',
      priceRange: '$$$',
    },
    ...(tour.rating > 0 && tour.reviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tour.rating.toString(),
            reviewCount: tour.reviews.toString(),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
