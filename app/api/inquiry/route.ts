import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isIP } from 'node:net';
import pool from '@/lib/db';
import { sendInquiryEmail } from '@/lib/email/send-inquiry-email';

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(40),
  travelDate: z.string().max(100).optional(),
  travelers: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
  tourId: z.number().int().positive().optional(),
  tourTitle: z.string().max(255).optional(),
  tourSlug: z.string().max(255).optional(),
  locale: z.string().default('fr'),
  requestType: z.string().max(80).optional(),
  source: z.string().max(120).optional(),
  price: z.string().max(120).optional(),
  tripType: z.enum(['circuit', 'excursion', 'event', 'destination']).optional(),
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

    const ipCandidate = req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || '';
    const ipAddress = isIP(ipCandidate) ? ipCandidate : 'Non disponible';
    const userAgent = (req.headers.get('user-agent') || 'Non disponible')
      .replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 500);
    const pageHeader = req.headers.get('referer') || req.headers.get('origin') || '';
    let originPage = 'Non disponible';
    try {
      const pageUrl = new URL(pageHeader);
      if (pageUrl.protocol === 'http:' || pageUrl.protocol === 'https:') {
        originPage = `${pageUrl.origin}${pageUrl.pathname}`;
      }
    } catch {
      // Keep a neutral fallback when browser privacy settings omit the referrer.
    }

    await sendInquiryEmail(validated, { ipAddress, userAgent, originPage });

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
    console.error('Inquiry email delivery failed');
    return NextResponse.json(
      { success: false, message: 'The request could not be sent. Please try again or contact us directly.' },
      { status: 503 }
    );
  }
}
