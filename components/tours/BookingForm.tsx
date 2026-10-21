'use client';

import { useState } from 'react';
import { TourDetail } from '@/lib/queries/tours';
import { MessageCircle } from 'lucide-react';
import InquiryConfirmationModal from '@/components/forms/InquiryConfirmationModal';

interface BookingFormProps {
  tour: TourDetail;
  locale: string;
  tripType: 'circuit' | 'excursion';
}

export default function BookingForm({ tour, locale, tripType }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212776715010';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Bonjour Luxurymarocvoyage, je souhaite un devis pour le circuit : "${tour.title}".`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tourId: tour.id,
          tourTitle: tour.title,
          tourSlug: tour.slug,
          locale,
          requestType: 'Quote request',
          source: 'Circuit / excursion detail page',
          tripType,
        }),
      });
      if (!res.ok) throw new Error('Inquiry failed');
      setFormData({ name: '', email: '', phone: '', travelers: '', notes: '' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const field =
    'w-full text-sm bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400/60 focus:border-terracotta-400 transition';

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-terracotta-600 leading-snug">
          Request your<br />personalised quote
        </h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">FREE</p>
      </div>

      {status === 'success' ? (<InquiryConfirmationModal locale={locale} onClose={() => setStatus('idle')} />) : (
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="Enter your first name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={field}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              maxLength={254}
              placeholder="Enter your email (example@gmail.com)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={field}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              required
              maxLength={40}
              placeholder="Enter your phone number..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={field}
            />
          </div>

          {/* Number of travellers */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Number of travellers
            </label>
            <input
              type="text"
              maxLength={50}
              placeholder="Enter the number of travellers..."
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
              className={field}
            />
          </div>

          {/* Tell us about your project */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tell us about your project
            </label>
            <textarea
              rows={4}
              maxLength={4500}
              placeholder="Describe your ideal trip, dates, special requests..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`${field} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wide transition-colors shadow-md"
          >
            {status === 'loading' ? 'Sending...' : 'Send my request'}
          </button>

          {status === 'error' && <p role="alert" className="text-sm text-rose-600">We could not send your request. Please try again or contact us on WhatsApp.</p>}

          {/* WhatsApp alt */}
          <a
            href={`https://wa.me/${cleanNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </form>
      )}
    </aside>
  );
}
