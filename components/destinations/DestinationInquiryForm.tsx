'use client';

import { useState, type FormEvent } from 'react';
import type { Tour } from '@/lib/queries/tours';
import InquiryConfirmationModal from '@/components/forms/InquiryConfirmationModal';

interface DestinationInquiryFormProps {
  destinationName: string;
  locale: string;
  circuits: Tour[];
  excursions: Tour[];
}

export default function DestinationInquiryForm({ destinationName, locale, circuits, excursions }: DestinationInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTourId, setSelectedTourId] = useState('');

  const availableTours = selectedType === 'circuit'
    ? circuits
    : selectedType === 'excursion'
      ? excursions
      : selectedType === 'undecided'
        ? [...circuits, ...excursions]
        : [];

  const copy = locale === 'fr'
    ? {
        title: 'Demandez votre devis personnalisé', free: 'GRATUIT', name: 'Nom complet', namePlaceholder: 'Entrez votre nom complet...',
        email: 'E-mail', emailPlaceholder: 'Entrez votre e-mail...', phone: 'Téléphone', phonePlaceholder: 'Entrez votre numéro de téléphone...',
        travelers: 'Nombre de voyageurs', travelersPlaceholder: 'Entrez le nombre de voyageurs...', type: 'Type de circuit/excursion',
        typePlaceholder: 'Sélectionnez un type...', circuit: 'Circuit privé', excursion: 'Excursion', undecided: 'Je ne sais pas encore',
        trip: 'Choisissez un voyage', tripPlaceholder: 'Sélectionnez un circuit ou une excursion...', noTrips: 'Aucun voyage disponible pour ce type',
        message: 'Parlez-nous de votre projet', messagePlaceholder: 'Dates de voyage, âge des enfants, etc.', submit: 'Envoyer', sending: 'Envoi en cours…',
        success: 'Merci ! Votre demande a bien été envoyée.', error: 'Envoi impossible. Réessayez ou contactez-nous directement.',
      }
    : locale === 'es'
      ? {
          title: 'Solicita tu presupuesto personalizado', free: 'GRATIS', name: 'Nombre completo', namePlaceholder: 'Introduce tu nombre completo...',
          email: 'Correo electrónico', emailPlaceholder: 'Introduce tu correo electrónico...', phone: 'Teléfono', phonePlaceholder: 'Introduce tu número de teléfono...',
          travelers: 'Número de viajeros', travelersPlaceholder: 'Introduce el número de viajeros...', type: 'Tipo de circuito/excursión',
          typePlaceholder: 'Selecciona un tipo...', circuit: 'Circuito privado', excursion: 'Excursión', undecided: 'Aún no lo sé',
          trip: 'Elige un viaje', tripPlaceholder: 'Selecciona un circuito o una excursión...', noTrips: 'No hay viajes disponibles para este tipo',
          message: 'Cuéntanos tu proyecto', messagePlaceholder: 'Fechas del viaje, edad de los niños, etc.', submit: 'Enviar', sending: 'Enviando…',
          success: '¡Gracias! Hemos recibido tu solicitud.', error: 'No se pudo enviar. Inténtalo de nuevo o contáctanos.',
        }
      : {
          title: 'Request your personalised quote', free: 'FREE', name: 'Full Name', namePlaceholder: 'Enter your full name...',
          email: 'Email', emailPlaceholder: 'Enter your email...', phone: 'Phone', phonePlaceholder: 'Enter your phone number...',
          travelers: 'Number of travellers', travelersPlaceholder: 'Enter the number of travellers...', type: 'Type of tour/excursion',
          typePlaceholder: 'Select a type...', circuit: 'Private tour', excursion: 'Excursion', undecided: 'Not decided yet',
          trip: 'Choose a trip', tripPlaceholder: 'Select a tour or excursion...', noTrips: 'No trips available for this type',
          message: 'Tell us about your project', messagePlaceholder: 'Travel dates, children’s ages, etc.', submit: 'Send', sending: 'Sending…',
          success: 'Thank you! Your request has been sent.', error: 'Could not send your request. Please try again or contact us.',
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedTour = availableTours.find((tour) => String(tour.id) === selectedTourId);
    const tripKind = selectedType === 'circuit' || selectedType === 'excursion'
      ? selectedType
      : selectedTour && circuits.some((tour) => tour.id === selectedTour.id)
        ? 'circuit'
        : selectedTour && excursions.some((tour) => tour.id === selectedTour.id)
          ? 'excursion'
          : 'destination';
    const travelers = String(formData.get('travelers') || '');
    const notes = String(formData.get('notes') || '');
    const tourType = String(formData.get('tourType') || '');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          travelers,
          tourId: selectedTour?.id,
          tourTitle: selectedTour?.title,
          tourSlug: selectedTour?.slug,
          notes: [`Destination: ${destinationName}`, `Tour type: ${tourType}`, selectedTour ? `Selected trip: ${selectedTour.title}` : '', notes].filter(Boolean).join('\n'),
          locale,
          requestType: 'Quote request',
          source: 'Destination detail page',
          tripType: tripKind,
        }),
      });

      if (!response.ok) throw new Error('Inquiry submission failed');
      setStatus('success');
      form.reset();
      setSelectedType('');
      setSelectedTourId('');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#181E4B] outline-none transition placeholder:text-slate-400 focus:border-[#DF6951] focus:ring-2 focus:ring-[#DF6951]/15';

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_-20px_rgba(24,30,75,0.35)] sm:p-6">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h3 className="font-sans text-lg font-bold leading-7 text-[#181E4B]">{copy.title}</h3>
        <p className="mt-1 text-xs font-medium text-slate-500">{copy.free}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.name}
          <input className={inputClass} name="name" type="text" autoComplete="name" minLength={2} maxLength={120} placeholder={copy.namePlaceholder} required />
        </label>
        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.email}
          <input className={inputClass} name="email" type="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} required />
        </label>
        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.phone}
          <input className={inputClass} name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={40} placeholder={copy.phonePlaceholder} required />
        </label>
        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.travelers}
          <input className={inputClass} name="travelers" type="number" min="1" max="99" placeholder={copy.travelersPlaceholder} />
        </label>
        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.type}
          <select className={inputClass} name="tourType" value={selectedType} onChange={(event) => { setSelectedType(event.target.value); setSelectedTourId(''); }}>
            <option value="">{copy.typePlaceholder}</option>
            <option value="circuit">{copy.circuit}</option>
            <option value="excursion">{copy.excursion}</option>
            <option value="undecided">{copy.undecided}</option>
          </select>
        </label>

        {selectedType && (
          <label className="block text-[11px] font-semibold text-[#181E4B]">
            {copy.trip}
            <select className={inputClass} name="selectedTour" value={selectedTourId} onChange={(event) => setSelectedTourId(event.target.value)}>
              <option value="">{availableTours.length > 0 ? copy.tripPlaceholder : copy.noTrips}</option>
              {availableTours.map((tour) => <option key={tour.id} value={tour.id}>{tour.title}</option>)}
            </select>
          </label>
        )}

        <label className="block text-[11px] font-semibold text-[#181E4B]">
          {copy.message}
          <textarea className={`${inputClass} resize-y`} name="notes" rows={3} maxLength={4500} placeholder={copy.messagePlaceholder} />
        </label>

        {status === 'success' && <InquiryConfirmationModal locale={locale} onClose={() => setStatus('idle')} />}
        {status === 'error' && <p role="alert" className="text-xs leading-5 text-rose-600">{copy.error}</p>}
        <button type="submit" disabled={isSubmitting} className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#B64F2E] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#9F4227] disabled:cursor-wait disabled:opacity-70">
          {isSubmitting ? copy.sending : copy.submit}
        </button>
      </form>
    </aside>
  );
}




