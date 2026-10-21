import { query, t, parseGallery } from '@/lib/db';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface TourRaw {
  id: number;
  image: string | null;
  titre: string;
  nbr_jours: number;
  nbr_nuits: number;
  type: string | null;
  debutV: string | null;
  rating: number;
  reviews: number;
  clicks: number;
  exceptional: number;
  promotion: number;
  link: string | null;
  slug: string;
  gallery: string | null;
  destination_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface TourDetailsRaw {
  presentation: string | null;
  description: string | null;
  trajet: string | null;
  prix: string | null;
  programme: string | null;
}

export interface TourItineraireRaw {
  id: number;
  day: string | null;
  title: string | null;
  text: string | null;
}

export interface TourComprend {
  id: number;
  texte: string;
}

export interface TourOption {
  id: number;
  option_service: string;
}

export interface TourHighlight {
  id: number;
  point_fort: string;
}

export interface Tour {
  id: number;
  image: string | null;
  title: string;
  days: number;
  nights: number;
  type: string;
  departure: string;
  rating: number;
  reviews: number;
  clicks: number;
  exceptional: boolean;
  promotion: boolean;
  slug: string;
  gallery: string[];
  destinationId: number | null;
  updatedAt: string;
}

export interface TourDetail extends Tour {
  presentation: string;
  description: string;
  route: string;
  price: string;
  programme: string;
  itinerary: { id: number; day: string; title: string; text: string }[];
  includes: string[];
  options: string[];
  highlights: string[];
}

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function mapTour(raw: TourRaw, locale: string): Tour {
  return {
    id: raw.id,
    image: raw.image,
    title: t(raw.titre, locale),
    days: raw.nbr_jours,
    nights: raw.nbr_nuits,
    type: t(raw.type, locale),
    departure: t(raw.debutV, locale),
    rating: Number(raw.rating),
    reviews: raw.reviews,
    clicks: raw.clicks,
    exceptional: Boolean(raw.exceptional),
    promotion: Boolean(raw.promotion),
    slug: raw.slug,
    gallery: parseGallery(raw.gallery),
    destinationId: raw.destination_id,
    updatedAt: raw.updated_at,
  };
}

// â”€â”€â”€ Queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Get all tours of a given category type (circuits or excursions).
 * The `type` JSON field contains patterns like "Circuit" / "Excursion".
 */
export async function getTours(
  locale: string,
  options: {
    typeFilter?: 'circuit' | 'excursion';
    limit?: number;
    offset?: number;
    exceptional?: boolean;
    destinationId?: number;
  } = {}
): Promise<Tour[]> {
  const { typeFilter, limit = 100, offset = 0, exceptional, destinationId } = options;

  let sql = `SELECT * FROM tours WHERE 1=1`;
  const params: (string | number | boolean | null)[] = [];

  if (typeFilter === 'circuit') {
    sql += ` AND (LOWER(type) LIKE '%circuit%')`;
  } else if (typeFilter === 'excursion') {
    sql += ` AND (LOWER(type) LIKE '%excursion%' OR LOWER(type) LIKE '%journée%' OR LOWER(type) LIKE '%day%')`;
  }

  if (exceptional !== undefined) {
    sql += ` AND exceptional = ?`;
    params.push(exceptional ? 1 : 0);
  }

  if (destinationId !== undefined) {
    sql += ` AND id IN (SELECT tour_id FROM destination_tour WHERE destination_id = ?)`;
    params.push(destinationId);
  }

  sql += ` ORDER BY exceptional DESC, clicks DESC, rating DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const rows = await query<TourRaw>(sql, params);
  return rows.map((r) => mapTour(r, locale));
}

export async function getTourBySlug(
  slug: string,
  locale: string
): Promise<TourDetail | null> {
  const rows = await query<TourRaw>(`SELECT * FROM tours WHERE slug = ? LIMIT 1`, [slug]);
  if (!rows.length) return null;

  const raw = rows[0];

  const [detailsRows, itineraryRows, includesRows, optionsRows, highlightsRows] =
    await Promise.all([
      query<TourDetailsRaw>(
        `SELECT presentation, description, trajet, prix, programme FROM tours_details WHERE tour_id = ?`,
        [raw.id]
      ),
      query<TourItineraireRaw>(
        `SELECT id, day, title, text FROM tours_itineraire WHERE tour_id = ? ORDER BY id ASC`,
        [raw.id]
      ),
      query<TourComprend>(
        `SELECT id, texte FROM tours_comprend WHERE tour_id = ? ORDER BY id ASC`,
        [raw.id]
      ),
      query<TourOption>(
        `SELECT id, option_service FROM tours_options WHERE tour_id = ? ORDER BY id ASC`,
        [raw.id]
      ),
      query<TourHighlight>(
        `SELECT id, point_fort FROM tours_points_forts WHERE tour_id = ? ORDER BY id ASC`,
        [raw.id]
      ),
    ]);

  const details = detailsRows[0] || {};

  return {
    ...mapTour(raw, locale),
    presentation: t(details.presentation, locale),
    description: t(details.description, locale),
    route: t(details.trajet, locale),
    price: t(details.prix, locale),
    programme: t(details.programme, locale),
    itinerary: itineraryRows.map((r) => ({
      id: r.id,
      day: r.day || '',
      title: t(r.title, locale),
      text: t(r.text, locale),
    })),
    includes: includesRows.map((r) => t(r.texte, locale)),
    options: optionsRows.map((r) => t(r.option_service, locale)),
    highlights: highlightsRows.map((r) => t(r.point_fort, locale)),
  };
}

export async function getTourSlugs(typeFilter?: 'circuit' | 'excursion'): Promise<{ slug: string }[]> {
  if (typeFilter === 'circuit') {
    return query<{ slug: string }>(`SELECT slug FROM tours WHERE LOWER(type) LIKE '%circuit%'`);
  }
  if (typeFilter === 'excursion') {
    return query<{ slug: string }>(`SELECT slug FROM tours WHERE (LOWER(type) LIKE '%excursion%' OR LOWER(type) LIKE '%journée%' OR LOWER(type) LIKE '%day%')`);
  }
  return query<{ slug: string }>(`SELECT slug FROM tours`);
}

export async function getFeaturedTours(locale: string, limit = 6): Promise<Tour[]> {
  return getTours(locale, { exceptional: true, limit });
}

export async function getPopularExcursions(locale: string, limit = 6): Promise<Tour[]> {
  return getTours(locale, { typeFilter: 'excursion', limit });
}

export async function getRelatedTours(
  currentSlug: string,
  locale: string,
  destinationId: number | null,
  limit = 3
): Promise<Tour[]> {
  let sql = `SELECT * FROM tours WHERE slug != ? `;
  const params: (string | number | null)[] = [currentSlug];

  if (destinationId) {
    sql += `AND (destination_id = ? OR id IN (SELECT tour_id FROM destination_tour WHERE destination_id = ?)) `;
    params.push(destinationId, destinationId);
  }

  sql += `ORDER BY rating DESC, clicks DESC LIMIT ?`;
  params.push(limit);

  const rows = await query<TourRaw>(sql, params);
  return rows.map((r) => mapTour(r, locale));
}




