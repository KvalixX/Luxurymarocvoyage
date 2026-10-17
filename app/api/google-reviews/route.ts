import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600;

interface GoogleReview {
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface GooglePlaceResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ configured: false, reviews: [] }, { status: 200 });
  }

  const requestedLocale = request.nextUrl.searchParams.get('locale') || 'fr';
  const languageCode = ['fr', 'en', 'es'].includes(requestedLocale) ? requestedLocale : 'fr';
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
  url.searchParams.set('languageCode', languageCode);

  try {
    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
      },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error('Google Places request failed:', response.status, await response.text());
      return NextResponse.json({ configured: true, reviews: [] }, { status: 502 });
    }

    const place = (await response.json()) as GooglePlaceResponse;
    return NextResponse.json({
      configured: true,
      businessName: place.displayName?.text || 'Luxurymarocvoyage',
      rating: place.rating ?? null,
      reviewCount: place.userRatingCount ?? null,
      mapsUrl: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`,
      reviews: (place.reviews || []).map((review, index) => ({
        id: `${review.publishTime || 'google-review'}-${index}`,
        rating: review.rating ?? 0,
        text: review.text?.text || '',
        author: review.authorAttribution?.displayName || 'Google user',
        authorUrl: review.authorAttribution?.uri || null,
        published: review.relativePublishTimeDescription || '',
      })).filter((review) => review.text),
    });
  } catch (error) {
    console.error('Could not load Google reviews:', error);
    return NextResponse.json({ configured: true, reviews: [] }, { status: 502 });
  }
}
