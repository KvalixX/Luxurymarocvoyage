import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'voyagemaroc',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export default pool;

/**
 * Helper: parse a multilingual JSON column and return the value for the given locale.
 * Falls back: requested locale → 'fr' → 'en' → raw string → empty string
 */
export function t(
  jsonField: string | null | undefined,
  locale: string
): string {
  if (!jsonField) return '';
  try {
    const parsed = typeof jsonField === 'string' ? JSON.parse(jsonField) : jsonField;
    return (
      parsed[locale] ||
      parsed['fr'] ||
      parsed['en'] ||
      parsed['es'] ||
      ''
    );
  } catch {
    return typeof jsonField === 'string' ? jsonField : '';
  }
}

/**
 * Helper: parse a JSON gallery field into an array of URLs
 */
export function parseGallery(jsonField: unknown): string[] {
  if (jsonField == null) return [];

  let parsed: unknown = jsonField;
  if (Buffer.isBuffer(parsed)) parsed = parsed.toString('utf8');

  // mysql2 can return native JSON as an array or LONGTEXT as a string.
  // Some imported rows are encoded twice, so accept either representation.
  for (let attempt = 0; attempt < 2 && typeof parsed === 'string'; attempt += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((image): image is string => typeof image === 'string')
    .map((image) => image.trim())
    .filter(Boolean);
}

/**
 * Helper: safely run a parameterized query and return typed rows
 */
export async function query<T>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
