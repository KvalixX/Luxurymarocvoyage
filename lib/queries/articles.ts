import { query, t } from '@/lib/db';

export interface ArticleRaw {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string | null;
  image_URL: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
  imageUrl: string | null;
  slug: string;
  updatedAt: string;
}

function mapArticle(raw: ArticleRaw, locale: string): Article {
  return {
    id: raw.id,
    title: t(raw.title, locale),
    date: raw.date,
    description: t(raw.description, locale),
    category: t(raw.category, locale),
    imageUrl: raw.image_URL,
    slug: raw.slug,
    updatedAt: raw.updated_at,
  };
}

export async function getArticles(
  locale: string,
  limit = 50,
  offset = 0
): Promise<Article[]> {
  const rows = await query<ArticleRaw>(
    `SELECT * FROM articles ORDER BY date DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows.map((r) => mapArticle(r, locale));
}

export async function getLatestArticles(locale: string, limit = 3): Promise<Article[]> {
  return getArticles(locale, limit, 0);
}

export async function getArticleBySlug(
  slug: string,
  locale: string
): Promise<Article | null> {
  const rows = await query<ArticleRaw>(
    `SELECT * FROM articles WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (!rows.length) return null;
  return mapArticle(rows[0], locale);
}

export async function getArticleSlugs(): Promise<{ slug: string }[]> {
  return query<{ slug: string }>(`SELECT slug FROM articles`);
}

export async function getArticlesByCategory(
  locale: string,
  limit = 50
): Promise<Article[]> {
  return getArticles(locale, limit);
}
