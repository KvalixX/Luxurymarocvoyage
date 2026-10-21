import { NextResponse } from 'next/server';
import { parseGallery, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface GalleryRow {
  image: string | null;
  gallery: unknown;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const rows = await query<GalleryRow>(
      'SELECT image, gallery FROM tours WHERE slug = ? LIMIT 1',
      [slug],
    );

    if (!rows.length) {
      return NextResponse.json({ images: [] }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    const row = rows[0];
    const images = [row.image, ...parseGallery(row.gallery)]
      .filter((image): image is string => typeof image === 'string' && /^https?:\/\//i.test(image.trim()))
      .map((image) => image.trim())
      .filter((image, index, all) => all.indexOf(image) === index);

    return NextResponse.json({ images }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    console.error('Tour gallery could not be loaded');
    return NextResponse.json({ images: [] }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
