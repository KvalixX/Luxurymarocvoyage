import { query, t } from '@/lib/db';

export interface DestinationRaw {
  id: number;
  name: string;
  presentation: string | null;
  image: string | null;
  slug: string;
  is_popular: number;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  name: string;
  presentation: string;
  image: string | null;
  slug: string;
  isPopular: boolean;
}

function mapDestination(raw: DestinationRaw, locale: string): Destination {
  return {
    id: raw.id,
    name: t(raw.name, locale),
    presentation: t(raw.presentation, locale),
    image: raw.image,
    slug: raw.slug,
    isPopular: Boolean(raw.is_popular),
  };
}

export async function getDestinations(locale: string): Promise<Destination[]> {
  const rows = await query<DestinationRaw>(
    `SELECT * FROM destinations ORDER BY is_popular DESC, id ASC`
  );
  return rows.map((r) => mapDestination(r, locale));
}

export async function getPopularDestinations(locale: string, limit = 8): Promise<Destination[]> {
  const rows = await query<DestinationRaw>(
    `SELECT * FROM destinations WHERE is_popular = 1 ORDER BY id ASC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => mapDestination(r, locale));
}

export async function getDestinationBySlug(
  slug: string,
  locale: string
): Promise<Destination | null> {
  const rows = await query<DestinationRaw>(
    `SELECT * FROM destinations WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (!rows.length) return null;
  return mapDestination(rows[0], locale);
}

export async function getDestinationSlugs(): Promise<{ slug: string }[]> {
  return query<{ slug: string }>(`SELECT slug FROM destinations`);
}
