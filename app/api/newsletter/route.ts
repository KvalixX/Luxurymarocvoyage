import { NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';

const newsletterSchema = z.object({
  email: z.string().email(),
  locale: z.string().default('fr'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = newsletterSchema.parse(body);

    try {
      await pool.execute(
        `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          locale VARCHAR(10) DEFAULT 'fr',
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );

      await pool.execute(
        `INSERT IGNORE INTO newsletter_subscribers (email, locale) VALUES (?, ?)`,
        [validated.email, validated.locale]
      );
    } catch (dbError) {
      console.warn('Newsletter DB error:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
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
