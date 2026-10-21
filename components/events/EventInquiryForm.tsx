'use client';

import { useState, type FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import InquiryConfirmationModal from '@/components/forms/InquiryConfirmationModal';

interface EventInquiryFormProps {
  title: string;
  slug: string;
  price: string;
  locale: string;
  whatsappHref: string;
}

export default function EventInquiryForm({ title, slug, price, locale, whatsappHref }: EventInquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fr = locale === 'fr';
  const es = locale === 'es';
  const copy = fr
    ? { heading: 'Demander des informations', price: 'Tarif par personne', name: 'Nom complet', email: 'Adresse e-mail', phone: 'Téléphone', travelers: 'Nombre de personnes', message: 'Votre message', placeholder: 'Dates souhaitées ou question sur cet événement…', submit: 'Envoyer ma demande', sending: 'Envoi en cours…', success: 'Merci, votre demande a bien été envoyée.', error: 'Envoi impossible. Réessayez ou contactez-nous sur WhatsApp.', whatsapp: 'Écrire sur WhatsApp' }
    : es
      ? { heading: 'Solicitar información', price: 'Precio por persona', name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', travelers: 'Número de personas', message: 'Tu mensaje', placeholder: 'Fechas deseadas o pregunta sobre este evento…', submit: 'Enviar solicitud', sending: 'Enviando…', success: 'Gracias, hemos recibido tu solicitud.', error: 'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.', whatsapp: 'Escribir por WhatsApp' }
      : { heading: 'Request event information', price: 'Price per person', name: 'Full name', email: 'Email address', phone: 'Phone number', travelers: 'Number of people', message: 'Your message', placeholder: 'Preferred dates or a question about this event…', submit: 'Send my request', sending: 'Sending…', success: 'Thank you, your request has been sent.', error: 'Could not send your request. Please try again or contact us on WhatsApp.', whatsapp: 'Message us on WhatsApp' };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          travelers: String(data.get('travelers') || ''),
          notes: `Event: ${title}\n${String(data.get('message') || '')}`,
          tourTitle: `Event: ${title}`,
          tourSlug: slug,
          locale,
          requestType: 'Event information request',
          source: 'Event detail page',
          price,
          tripType: 'event',
        }),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const inputClass = 'mt-1.5 w-full rounded-xl border border-sand-200 bg-[#FCFAF7] px-3.5 py-3 text-sm text-morocco-dark outline-none transition placeholder:text-slate-400 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/15';

  return (
    <section className="rounded-3xl border border-sand-200 bg-white p-5 shadow-lg sm:p-6" aria-labelledby="event-inquiry-title">
      <div className="mb-5 border-b border-sand-100 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-sand-700">{copy.price}</span>
        <p className="mt-1 font-serif text-2xl font-bold text-morocco-dark">{price || (fr ? 'Sur devis' : es ? 'Consultar precio' : 'On request')}</p>
      </div>
      <h2 id="event-inquiry-title" className="font-serif text-xl font-bold text-morocco-dark">{copy.heading}</h2>

      {status === 'success' ? (<InquiryConfirmationModal locale={locale} onClose={() => setStatus('idle')} />) : (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="text-xs font-semibold text-slate-700">{copy.name}<input name="name" required minLength={2} maxLength={120} autoComplete="name" className={inputClass} /></label>
          <label className="text-xs font-semibold text-slate-700">{copy.email}<input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></label>
          <label className="text-xs font-semibold text-slate-700">{copy.phone}<input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" className={inputClass} /></label>
          <label className="text-xs font-semibold text-slate-700">{copy.travelers}<input name="travelers" type="number" min="1" max="99" className={inputClass} /></label>
          <label className="text-xs font-semibold text-slate-700">{copy.message}<textarea name="message" maxLength={4500} rows={3} placeholder={copy.placeholder} className={`${inputClass} resize-y`} /></label>
          {status === 'error' && <p role="alert" className="text-sm text-rose-700">{copy.error}</p>}
          <button type="submit" disabled={status === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-terracotta-700 disabled:cursor-wait disabled:opacity-70">
            <Send className="h-4 w-4" />{status === 'loading' ? copy.sending : copy.submit}
          </button>
        </form>
      )}

      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">
        <MessageCircle className="h-4 w-4" />{copy.whatsapp}
      </a>
    </section>
  );
}
