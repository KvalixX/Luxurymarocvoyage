'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import InquiryConfirmationModal from '@/components/forms/InquiryConfirmationModal';

interface TourQuoteModalProps {
  tour: Tour;
  locale: string;
  isExcursion: boolean;
  onClose: () => void;
}

export default function TourQuoteModal({ tour, locale, isExcursion, onClose }: TourQuoteModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);
  const copy = locale === 'fr'
    ? { title: 'Demandez votre devis personnalisé', free: 'GRATUIT', name: 'Nom complet', email: 'E-mail', phone: 'Téléphone', travelers: 'Nombre de voyageurs', notes: 'Parlez-nous de votre projet', submit: 'Envoyer ma demande', sending: 'Envoi en cours…', success: 'Merci ! Votre demande a bien été envoyée.', error: 'Envoi impossible. Réessayez.', close: 'Fermer', namePlaceholder: 'Votre nom complet', emailPlaceholder: 'vous@exemple.com', phonePlaceholder: 'Votre numéro de téléphone', travelersPlaceholder: 'Nombre de voyageurs', notesPlaceholder: 'Dates, demandes particulières…' }
    : locale === 'es'
      ? { title: 'Solicita tu presupuesto personalizado', free: 'GRATIS', name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', travelers: 'Número de viajeros', notes: 'Cuéntanos tu proyecto', submit: 'Enviar solicitud', sending: 'Enviando…', success: '¡Gracias! Hemos recibido tu solicitud.', error: 'No se pudo enviar. Inténtalo de nuevo.', close: 'Cerrar', namePlaceholder: 'Tu nombre completo', emailPlaceholder: 'tu@ejemplo.com', phonePlaceholder: 'Tu número de teléfono', travelersPlaceholder: 'Número de viajeros', notesPlaceholder: 'Fechas, peticiones especiales…' }
      : { title: 'Request your personalised quote', free: 'FREE', name: 'Full name', email: 'Email', phone: 'Phone', travelers: 'Number of travellers', notes: 'Tell us about your trip', submit: 'Send my request', sending: 'Sending…', success: 'Thank you! Your request has been sent.', error: 'Could not send your request. Please try again.', close: 'Close', namePlaceholder: 'Your full name', emailPlaceholder: 'you@example.com', phonePlaceholder: 'Your phone number', travelersPlaceholder: 'Number of travellers', notesPlaceholder: 'Travel dates, special requests…' };

  useEffect(() => {
    setMounted(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          travelers: formData.get('travelers'),
          notes: formData.get('notes'),
          tourId: tour.id,
          tourTitle: tour.title,
          tourSlug: tour.slug,
          locale,
          requestType: 'Quote request',
          source: `Tour card quote modal (${isExcursion ? 'excursion' : 'circuit'})`,
          tripType: isExcursion ? 'excursion' : 'circuit',
        }),
      });
      if (!response.ok) throw new Error('Inquiry failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const fieldClass = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#DF6951] focus:ring-2 focus:ring-[#DF6951]/15';

  if (!mounted) return null;
  if (status === 'success') {
    return <InquiryConfirmationModal locale={locale} lockScroll={false} onClose={() => { setStatus('idle'); onClose(); }} />;
  }

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="tour-quote-title" className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="tour-quote-title" className="text-xl font-bold text-[#B64F2E]">{copy.title}</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{copy.free}</p>
            <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-700">{tour.title} · {isExcursion ? 'Excursion' : 'Circuit'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={copy.close} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <X className="h-5 w-5" />
          </button>
        </header>

          <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">{copy.name}<input className={`${fieldClass} mt-1.5`} name="name" type="text" autoComplete="name" minLength={2} maxLength={120} placeholder={copy.namePlaceholder} required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.email}<input className={`${fieldClass} mt-1.5`} name="email" type="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.phone}<input className={`${fieldClass} mt-1.5`} name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={40} placeholder={copy.phonePlaceholder} required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.travelers}<input className={`${fieldClass} mt-1.5`} name="travelers" type="number" min="1" max="99" placeholder={copy.travelersPlaceholder} /></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">{copy.notes}<textarea className={`${fieldClass} mt-1.5 resize-y`} name="notes" rows={3} maxLength={4500} placeholder={copy.notesPlaceholder} /></label>
            {status === 'error' && <p role="alert" className="text-sm text-rose-600 sm:col-span-2">{copy.error}</p>}
            <button type="submit" disabled={status === 'loading'} className="rounded-lg bg-[#B64F2E] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9F4227] disabled:cursor-wait disabled:opacity-70 sm:col-span-2">
              {status === 'loading' ? copy.sending : copy.submit}
            </button>
          </form>
      </section>
    </div>
  ), document.body);
}
