'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, Clock3, FileText, Globe2, Headset, Info, Mail, MapPin, Phone, Send, Star, Building2, Tag } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import InquiryConfirmationModal from '@/components/forms/InquiryConfirmationModal';

interface ContactTabsPanelProps {
  locale: string;
  whatsappHref: string;
  circuits: Tour[];
  excursions: Tour[];
}

type ContactTab = 'quote' | 'information' | 'support';

export default function ContactTabsPanel({ locale, whatsappHref, circuits, excursions }: ContactTabsPanelProps) {
  const [activeTab, setActiveTab] = useState<ContactTab>('quote');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tripType, setTripType] = useState('');
  const [tourId, setTourId] = useState('');
  const fr = locale === 'fr';
  const es = locale === 'es';
  const c = fr
    ? { title: 'Nous sommes là pour vous aider', titleAccent: 'et vous accompagner', subtitle: 'Notre équipe est à votre disposition pour préparer le voyage idéal au Maroc.', information: 'Informations de contact', help: 'Nous sommes là pour vous aider à organiser votre voyage. Contactez-nous pour toute question ou demande personnalisée.', address: 'Notre adresse', phone: 'Téléphone', email: 'E-mail', hours: 'Horaires', schedule: <>Lun. – Sam. : 09h00 – 19h00<br />Dim. : 10h00 – 16h00</>, guarantee: 'Réponse sous 24h garantie', rating: 'Avis clients', experience: 'Années d’expérience', tabs: ['Devis', 'Information', 'Support'], quote: 'Demande de devis gratuit', informationTab: 'Demande d’information', support: 'Support client', quick: 'Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.', name: 'Nom complet', emailAddress: 'Adresse e-mail', phoneNumber: 'Numéro de téléphone', tripType: 'Type de voyage', people: 'Nombre de personnes', message: 'Votre message', subject: 'Sujet', select: 'Sélectionner', circuitPrivate: 'Circuit privé', circuitGroup: 'Circuit en groupe', excursionGroup: 'Excursion privée / groupe', excursionPrivate: 'Excursion privée', tour: 'Sélectionner un circuit / excursion', pickTour: 'Choisir un voyage (facultatif)', noTours: 'Aucun voyage trouvé pour ce type', quotePlaceholder: 'Décrivez votre voyage, vos intérêts, vos préférences d’hébergement et les activités souhaitées…', infoPlaceholder: 'Comment pouvons-nous vous aider ?', supportPlaceholder: 'Décrivez votre problème ou votre demande en détail…', submitQuote: 'Demander un devis gratuit', sendMessage: 'Envoyer le message', sendSupport: 'Contacter le support', sending: 'Envoi en cours…', success: 'Merci ! Votre demande a bien été envoyée.', error: 'Envoi impossible. Veuillez réessayer ou nous contacter directement.', multilingual: 'Réponse multilingue', supportDays: 'Support 7j/7', freeQuote: 'Devis gratuit' }
    : es
      ? { title: 'Estamos aquí para ayudarte', titleAccent: 'en cada paso', subtitle: 'Nuestro equipo está disponible para ayudarte a planificar el viaje perfecto a Marruecos.', information: 'Información de contacto', help: 'Estamos aquí para ayudarte a planificar tu viaje. Contáctanos si tienes preguntas o necesitas información personalizada.', address: 'Nuestra dirección', phone: 'Teléfono', email: 'Correo electrónico', hours: 'Horario', schedule: <>Lun. – Sáb.: 09:00 – 19:00<br />Dom.: 10:00 – 16:00</>, guarantee: 'Respuesta garantizada en 24 h', rating: 'Valoración', experience: 'Años de experiencia', tabs: ['Presupuesto', 'Información', 'Soporte'], quote: 'Solicitar presupuesto gratis', informationTab: 'Solicitud de información', support: 'Atención al cliente', quick: 'Completa el formulario y te responderemos pronto.', name: 'Nombre completo', emailAddress: 'Correo electrónico', phoneNumber: 'Teléfono', tripType: 'Tipo de viaje', people: 'Número de personas', message: 'Tu mensaje', subject: 'Asunto', select: 'Seleccionar', circuitPrivate: 'Circuito privado', circuitGroup: 'Circuito en grupo', excursionGroup: 'Excursión privada / en grupo', excursionPrivate: 'Excursión privada', tour: 'Seleccionar circuito / excursión', pickTour: 'Elige un viaje (opcional)', noTours: 'No hay viajes de este tipo', quotePlaceholder: 'Describe tu viaje, tus intereses, el alojamiento y las actividades que deseas…', infoPlaceholder: '¿Cómo podemos ayudarte?', supportPlaceholder: 'Describe tu problema o solicitud en detalle…', submitQuote: 'Solicitar presupuesto gratis', sendMessage: 'Enviar mensaje', sendSupport: 'Contactar con soporte', sending: 'Enviando…', success: '¡Gracias! Hemos recibido tu solicitud.', error: 'No se pudo enviar. Inténtalo de nuevo o contáctanos.', multilingual: 'Atención multilingüe', supportDays: 'Soporte 7 días', freeQuote: 'Presupuesto gratis' }
      : { title: 'We are here to help you', titleAccent: 'and support you', subtitle: 'Our team of experts is available to help you plan the perfect trip to Morocco.', information: 'Contact Information', help: 'We are here to help you plan your perfect trip. Feel free to contact us for any questions or personalized information requests.', address: 'Our Address', phone: 'Phone', email: 'Email', hours: 'Opening Hours', schedule: <>Mon. – Sat.: 09:00 – 19:00<br />Sun.: 10:00 – 16:00</>, guarantee: 'Response within 24h guaranteed', rating: 'Customer Rating', experience: 'Years of Experience', tabs: ['Quote', 'Information', 'Support'], quote: 'Request a Free Quote', informationTab: 'Information Request', support: 'Customer Support', quick: 'Fill out the form below and we will respond quickly.', name: 'Full Name', emailAddress: 'Email Address', phoneNumber: 'Phone Number', tripType: 'Trip Type', people: 'Number of People', message: 'Your Message', subject: 'Subject', select: 'Select', circuitPrivate: 'Private tour', circuitGroup: 'Group tour', excursionGroup: 'Private / group excursion', excursionPrivate: 'Private excursion', tour: 'Select a tour / excursion', pickTour: 'Choose a trip (optional)', noTours: 'No tours found for this type', quotePlaceholder: 'Describe your travel project, interests, accommodation preferences, and desired activities…', infoPlaceholder: 'How can we help you?', supportPlaceholder: 'Describe your issue or request in detail…', submitQuote: 'Request a Free Quote', sendMessage: 'Send Message', sendSupport: 'Contact Support', sending: 'Sending…', success: 'Thank you! Your request has been sent.', error: 'Could not send your request. Please try again or contact us.', multilingual: 'Multilingual Response', supportDays: '7/7 Support', freeQuote: 'Free Quote' };

  const selectedTours = tripType.startsWith('circuit') ? circuits : tripType.startsWith('excursion') ? excursions : [];
  const inputClass = 'mt-1.5 w-full rounded-[10px] border border-[#E8E8E8] bg-[#FAFAFA] px-3.5 py-3 text-sm text-[#181E4B] outline-none transition focus:border-[#DF6951] focus:ring-2 focus:ring-[#DF6951]/15';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    const form = event.currentTarget;
    const data = new FormData(form);
    const chosenTour = selectedTours.find((tour) => String(tour.id) === tourId);
    const selectedTripType = String(data.get('tripType') || '');
    const classifiedTripType = selectedTripType.startsWith('circuit') ? 'circuit'
      : selectedTripType.startsWith('excursion') ? 'excursion'
        : undefined;
    const notes = [
      `Request type: ${activeTab}`,
      `Trip type: ${String(data.get('tripType') || '')}`,
      `Subject: ${String(data.get('subject') || '')}`,
      chosenTour ? `Selected trip: ${chosenTour.title}` : '',
      `Travel date: ${String(data.get('travelDate') || '')}`,
      String(data.get('message') || ''),
    ].filter(Boolean).join('\n');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'), email: data.get('email'), phone: data.get('phone'),
          travelers: String(data.get('travelers') || ''), tourId: chosenTour?.id,
          tourTitle: chosenTour?.title, tourSlug: chosenTour?.slug, notes, locale,
          travelDate: String(data.get('travelDate') || '') || undefined,
          requestType: activeTab,
          source: 'Contact page',
          tripType: classifiedTripType,
        }),
      });
      if (!response.ok) throw new Error('Contact request failed');
      setStatus('success');
      form.reset();
      setTripType('');
      setTourId('');
    } catch {
      setStatus('error');
    }
  };

  const tabKeys: ContactTab[] = ['quote', 'information', 'support'];
  const tabIcons = [FileText, Info, Headset];
  const heading = activeTab === 'quote' ? c.quote : activeTab === 'information' ? c.informationTab : c.support;
  const submitLabel = activeTab === 'quote' ? c.submitQuote : activeTab === 'information' ? c.sendMessage : c.sendSupport;

  return (
    <div>
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-[#181E4B]">{c.information}</h2>
          <p className="mb-8 mt-2 text-sm leading-6 text-slate-600">{c.help}</p>
          <div className="flex flex-col gap-6">
            <ContactInfo icon={<MapPin />} title={c.address} detail={<>Bureau N°5, 2ème étage, Lot, 359<br />Marrakech 40000, Maroc</>} />
            <ContactInfo icon={<Phone />} title={c.phone} detail="+212 77 671 50 10" href="tel:+212776715010" />
            <ContactInfo icon={<Mail />} title={c.email} detail="contact@luxurymarocvoyage.com" href="mailto:contact@luxurymarocvoyage.com" />
            <ContactInfo icon={<Clock3 />} title={c.hours} detail={c.schedule} />
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm font-medium text-[#181E4B]">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600" />{c.guarantee}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Stat icon={<Star className="h-4 w-4 fill-current" />} value="4.9" label={c.rating} />
            <Stat icon={<Building2 className="h-4 w-4" />} value="15+" label={c.experience} />
          </div>
        </section>

        <section id="devis" className="scroll-mt-24 rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="mb-7 flex flex-wrap justify-center gap-2">
            {tabKeys.map((tab, index) => {
              const Icon = tabIcons[index];
              return <button key={tab} type="button" onClick={() => { setActiveTab(tab); setStatus('idle'); }} aria-pressed={activeTab === tab} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition ${activeTab === tab ? 'bg-[#B05030] font-semibold text-white shadow-[0_4px_15px_rgba(176,80,48,0.3)]' : 'bg-[#F5F5F5] font-medium text-slate-600 hover:bg-orange-50'}`}><Icon className="h-4 w-4" />{c.tabs[index]}</button>;
            })}
          </div>

          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#B05030] to-[#8F3F25] p-5 text-white">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">{activeTab === 'quote' ? <FileText className="h-6 w-6" /> : activeTab === 'information' ? <Send className="h-6 w-6" /> : <Headset className="h-6 w-6" />}</span>
            <div><h2 className="font-serif text-xl font-bold">{heading}</h2><p className="mt-1 text-xs text-white/90">{c.quick}</p></div>
          </div>

          {status === 'success' ? (<InquiryConfirmationModal locale={locale} onClose={() => setStatus('idle')} />) : (
            <form key={activeTab} onSubmit={handleSubmit} className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
              <input type="hidden" name="requestType" value={activeTab} />
              <label className="text-xs font-semibold text-[#181E4B]">{c.name} *<input className={inputClass} type="text" name="name" autoComplete="name" minLength={2} maxLength={120} placeholder={fr ? 'Votre nom complet' : es ? 'Tu nombre completo' : 'Your full name'} required /></label>
              <label className="text-xs font-semibold text-[#181E4B]">{c.emailAddress} *<input className={inputClass} type="email" name="email" autoComplete="email" maxLength={254} placeholder={fr ? 'vous@exemple.com' : es ? 'tu@ejemplo.com' : 'your.email@example.com'} required /></label>
              <label className="text-xs font-semibold text-[#181E4B] sm:col-span-2">{c.phoneNumber}<input className={inputClass} type="tel" name="phone" autoComplete="tel" minLength={6} maxLength={40} placeholder="+212 77 671 50 10" required /></label>

              {activeTab === 'quote' && <>
                <label className="text-xs font-semibold text-[#181E4B]">{c.tripType} *<select className={inputClass} name="tripType" value={tripType} onChange={(event) => { setTripType(event.target.value); setTourId(''); }} required><option value="">{c.select}</option><option value="circuit_prive">{c.circuitPrivate}</option><option value="circuit_groupe">{c.circuitGroup}</option><option value="excursion_prive_groupe">{c.excursionGroup}</option><option value="excursion_prive">{c.excursionPrivate}</option></select></label>
                <label className="text-xs font-semibold text-[#181E4B]">{c.people} *<input className={inputClass} name="travelers" type="number" min="1" max="99" defaultValue="2" required /></label>
                {tripType && <label className="text-xs font-semibold text-[#181E4B] sm:col-span-2">{c.tour}<select className={inputClass} name="tourId" value={tourId} onChange={(event) => setTourId(event.target.value)}><option value="">{selectedTours.length ? c.pickTour : c.noTours}</option>{selectedTours.map((tour) => <option key={tour.id} value={tour.id}>{tour.title}</option>)}</select></label>}
                <label className="text-xs font-semibold text-[#181E4B] sm:col-span-2">{fr ? 'Date de voyage' : es ? 'Fecha del viaje' : 'Travel Date'}<input className={inputClass} name="travelDate" type="date" /></label>
              </>}

              {activeTab === 'information' && <label className="text-xs font-semibold text-[#181E4B] sm:col-span-2">{c.subject} *<input className={inputClass} name="subject" type="text" minLength={2} placeholder={fr ? 'Le sujet de votre message' : es ? 'Asunto de tu mensaje' : 'Subject of your message'} required /></label>}
              <label className="text-xs font-semibold text-[#181E4B] sm:col-span-2">{activeTab === 'support' ? (fr ? 'Description du problème' : es ? 'Describe el problema' : 'Describe the issue') : c.message} *<textarea className={`${inputClass} resize-y`} name="message" rows={activeTab === 'quote' ? 4 : 5} maxLength={4500} placeholder={activeTab === 'quote' ? c.quotePlaceholder : activeTab === 'support' ? c.supportPlaceholder : c.infoPlaceholder} required /></label>
              {status === 'error' && <p role="alert" className="text-sm text-rose-600 sm:col-span-2">{c.error}</p>}
              <button type="submit" disabled={status === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B05030] px-5 py-4 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(176,80,48,0.3)] transition hover:bg-[#963F25] disabled:opacity-70 sm:col-span-2"><Send className="h-4 w-4" />{status === 'loading' ? c.sending : activeTab === 'quote' ? c.submitQuote : activeTab === 'information' ? c.sendMessage : c.sendSupport}</button>
            </form>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-[#DF6951]" />{c.multilingual}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#DF6951]" />{c.supportDays}</span>
            <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-[#DF6951]" />{c.freeQuote}</span>
          </div>
          {activeTab === 'support' && <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">{fr ? 'Écrire sur WhatsApp' : es ? 'Escribir por WhatsApp' : 'Contact us on WhatsApp'}</a>}
        </section>
      </div>
    </div>
  );
}

function ContactInfo({ icon, title, detail, href }: { icon: ReactNode; title: string; detail: ReactNode; href?: string }) {
  return <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DF6951]/10 text-[#DF6951]">{icon}</span><div><h3 className="mb-1 text-sm font-semibold text-[#181E4B]">{title}</h3>{href ? <a href={href} className="text-sm text-slate-600 hover:text-[#B64F2E]">{detail}</a> : <p className="text-sm leading-5 text-slate-600">{detail}</p>}</div></div>;
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <div className="rounded-xl border border-slate-100 bg-white p-4 text-center"><div className="mb-1.5 flex items-center justify-center gap-2 text-[#DF6951]">{icon}<strong className="text-2xl text-[#181E4B]">{value}</strong></div><p className="text-xs text-slate-500">{label}</p></div>;
}









