import { query, t, parseGallery } from '@/lib/db';

export interface EventRaw {
  id: number;
  title: string;
  description: string;
  details: string | null;
  image: string | null;
  location: string;
  price: string | null;
  category: string | null;
  gallery: string | null;
  highlights: string | null;
  clicks: number;
  rating: number;
  reviews: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  details: string;
  image: string | null;
  location: string;
  price: string | null;
  category: string;
  gallery: string[];
  highlights: string[];
  rating: number;
  reviews: number;
  clicks: number;
  slug: string;
  updatedAt: string;
}

function mapEvent(raw: EventRaw, locale: string): Event {
  let highlights: string[] = [];
  try {
    const parsed = JSON.parse(raw.highlights || '[]');
    if (Array.isArray(parsed)) {
      highlights = parsed.map((h: string) => t(h, locale));
    } else if (typeof parsed === 'object') {
      highlights = [t(raw.highlights, locale)];
    }
  } catch {
    highlights = [];
  }

  return {
    id: raw.id,
    title: t(raw.title, locale),
    description: t(raw.description, locale),
    details: t(raw.details, locale),
    image: raw.image,
    location: t(raw.location, locale),
    price: raw.price,
    category: t(raw.category, locale),
    gallery: parseGallery(raw.gallery),
    highlights,
    rating: Number(raw.rating),
    reviews: raw.reviews,
    clicks: raw.clicks,
    slug: raw.slug,
    updatedAt: raw.updated_at,
  };
}

export async function getEvents(
  locale: string,
  limit = 50,
  offset = 0
): Promise<Event[]> {
  const rows = await query<EventRaw>(
    `SELECT * FROM events ORDER BY clicks DESC, rating DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows.map((r) => mapEvent(r, locale));
}

export async function getUpcomingEvents(locale: string, limit = 3): Promise<Event[]> {
  const rows = await query<EventRaw>(
    `SELECT * FROM events ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => mapEvent(r, locale));
}

export async function getEventBySlug(
  slug: string,
  locale: string
): Promise<Event | null> {
  const rows = await query<EventRaw>(
    `SELECT * FROM events WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (!rows.length) return null;
  return mapEvent(rows[0], locale);
}

export async function getEventSlugs(): Promise<{ slug: string }[]> {
  return query<{ slug: string }>(`SELECT slug FROM events`);
}
