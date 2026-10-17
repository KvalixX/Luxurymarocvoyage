import { NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  travelDate: z.string().optional(),
  travelers: z.string().optional(),
  notes: z.string().optional(),
  tourId: z.number().optional(),
  tourTitle: z.string().optional(),
  tourSlug: z.string().optional(),
  locale: z.string().default('fr'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = inquirySchema.parse(body);

    // Try saving to DB if inquiries table exists
    try {
      await pool.execute(
        `CREATE TABLE IF NOT EXISTS inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          travel_date VARCHAR(100),
          travelers VARCHAR(50),
          notes TEXT,
          tour_id BIGINT,
          tour_title VARCHAR(255),
          tour_slug VARCHAR(255),
          locale VARCHAR(10),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );

      await pool.execute(
        `INSERT INTO inquiries (name, email, phone, travel_date, travelers, notes, tour_id, tour_title, tour_slug, locale)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          validated.name,
          validated.email,
          validated.phone,
          validated.travelDate || null,
          validated.travelers || null,
          validated.notes || null,
          validated.tourId || null,
          validated.tourTitle || null,
          validated.tourSlug || null,
          validated.locale,
        ]
      );
    } catch (dbError) {
      console.warn('Inquiry DB log error:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry recorded successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
