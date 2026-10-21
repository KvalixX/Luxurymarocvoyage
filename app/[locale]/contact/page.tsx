import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ContactTabsPanel from '@/components/contact/ContactTabsPanel';
import FaqSection from '@/components/home/FaqSection';
import { getTours } from '@/lib/queries/tours';
import { getPopularDestinations } from '@/lib/queries/destinations';
import { MapPin } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: 'Contactez Luxurymarocvoyage | Agence à Marrakech & Devis Gratuit',
    en: 'Contact Luxurymarocvoyage | Marrakech Agency & Tailor-Made Quotes',
    es: 'Contacto | Agencia en Marrakech y Presupuesto a Medida',
  };
  const descriptions: Record<string, string> = {
    fr: 'Contactez nos conseillers de voyage à Marrakech. Devis gratuit sous 24h pour votre circuit privé, excursion ou séjour sur-mesure au Maroc.',
    en: 'Get in touch with our private travel designers in Marrakech. Free custom itinerary and quote within 24 hours via form, phone or WhatsApp.',
    es: 'Contacte con nuestros diseñadores de viaje en Marrakech. Presupuesto gratuito en 24h para su circuito privado o viaje a medida por Marruecos.',
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/contact'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const [circuits, excursions, destinations] = await Promise.all([
    getTours(locale, { typeFilter: 'circuit' }),
    getTours(locale, { typeFilter: 'excursion' }),
    getPopularDestinations(locale, 6),
  ]);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212776715010';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent('Bonjour Luxurymarocvoyage, je souhaite concevoir un projet de voyage au Maroc.');
  const whatsappHref = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;
  const isFrench = locale === 'fr';
  const isSpanish = locale === 'es';
  const breadcrumbs = [{ label: isFrench ? 'Contact' : isSpanish ? 'Contacto' : 'Contact Us' }];
  const agencyAddress = 'Bureau N°5, 2ème étage, Lot, 359, Marrakech 40000, Maroc';
  const mapTitle = isFrench ? 'Situer notre agence à Marrakech' : isSpanish ? 'Encuentra nuestra agencia en Marrakech' : 'Find our Marrakech agency';
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(agencyAddress)}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(agencyAddress)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF8] via-white to-[#FDF8F2] pb-8 pt-24">
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <div className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 inline-flex items-center rounded-full bg-[#FCEEE8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B64F2E]">
            {isFrench ? 'Nous sommes là pour vous aider' : isSpanish ? 'Estamos aquí para ayudarte' : 'We are here to help you'}
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#181E4B] sm:text-5xl">
            {isFrench ? 'Nous sommes là pour vous aider à organiser votre voyage' : isSpanish ? 'Estamos aquí para ayudarte a planificar tu viaje' : 'We are here to help you plan your trip'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {isFrench
              ? 'Notre équipe d’experts est à votre disposition pour vous aider à organiser le voyage idéal au Maroc.'
              : isSpanish
                ? 'Nuestro equipo de expertos está disponible para ayudarte a planificar el viaje perfecto a Marruecos.'
                : 'Our team of experts is available to help you plan the perfect trip to Morocco.'}
          </p>
        </header>
        <ContactTabsPanel locale={locale} whatsappHref={whatsappHref} circuits={circuits} excursions={excursions} />

        <section className="mt-12 overflow-hidden rounded-3xl border border-[#E9DDCD] bg-white shadow-[0_12px_36px_-24px_rgba(24,30,75,0.3)]" aria-label={mapTitle}>
          <div className="flex flex-col gap-1.5 px-5 py-4 sm:px-7 sm:py-5">
            <div className="section-eyebrow mb-0 w-fit"><MapPin className="h-3.5 w-3.5" /><span>{isFrench ? 'Marrakech, Maroc' : isSpanish ? 'Marrakech, Marruecos' : 'Marrakech, Morocco'}</span></div>
            <h2 className="font-serif text-xl font-bold text-[#181E4B] sm:text-2xl">{mapTitle}</h2>
            <p className="text-sm text-slate-500">Bureau N°5, 2ème étage, Lot, 359, Marrakech 40000, Maroc</p>
          </div>
          <iframe title={mapTitle} src={mapUrl} className="h-[300px] w-full border-t border-[#E9DDCD] sm:h-[380px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block border-t border-slate-100 px-5 py-3 text-sm font-semibold text-[#B64F2E] hover:bg-orange-50">{isFrench ? 'Obtenir l’itinéraire' : isSpanish ? 'Cómo llegar' : 'Get directions'}</a>
        </section>
      </div>
      <FaqSection locale={locale} circuits={circuits} excursions={excursions} destinations={destinations} />
    </div>
  );
}
