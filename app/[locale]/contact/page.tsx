import type { Metadata } from 'next';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `${siteUrl}/${locale}/contact`,
      languages: {
        fr: `${siteUrl}/fr/contact`,
        en: `${siteUrl}/en/contact`,
        es: `${siteUrl}/es/contacto`,
      },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    'Bonjour Luxurymarocvoyage, je souhaite concevoir un projet de voyage au Maroc.'
  );

  const breadcrumbs = [
    {
      label:
        locale === 'en'
          ? 'Contact Us'
          : locale === 'es'
          ? 'Contacto'
          : 'Contact',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-sand-600" />
            <span>À Votre Écoute 7j/7</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight">
            Concevons Ensemble Votre Voyage de Rêve
          </h1>
          <p className="mt-3 text-sand-800 text-sm sm:text-base leading-relaxed">
            Une question sur un circuit ? Une envie particulière pour un séjour privatif ? Échangez directement avec un expert local basé à Marrakech.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left 2 Cols: Interactive Contact & Quote Form */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-sand-200 p-8 sm:p-12 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-morocco-dark mb-2">
              Demande de Devis Personnalisé
            </h2>
            <p className="text-xs text-sand-700 mb-8">
              Remplissez le formulaire ci-dessous. Un conseiller dédié vous répondra sous 24h avec une proposition sur-mesure.
            </p>

            <form action="/api/inquiry" method="POST" className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Sophie Martin"
                    className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl px-4 py-3 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sophie.martin@email.com"
                    className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl px-4 py-3 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+33 6 00 00 00 00"
                    className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl px-4 py-3 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                    Date Envisagée
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl px-4 py-3 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                    Nombre de Voyageurs
                  </label>
                  <select
                    name="travelers"
                    className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl px-4 py-3 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                  >
                    <option value="2">2 Personnes (Couple)</option>
                    <option value="1">1 Voyageur Solo</option>
                    <option value="3-4">3 - 4 Personnes (Famille)</option>
                    <option value="5-8">5 - 8 Personnes (Amis)</option>
                    <option value="9+">9+ Personnes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-sand-800 block mb-1">
                  Décrivez Votre Projet de Voyage
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Quelles villes souhaitez-vous explorer ? Souhaitez-vous une nuit dans le désert ? Avez-vous un budget indicatif ?"
                  className="w-full text-xs bg-sand-50/60 border border-sand-200 rounded-xl p-4 text-morocco-dark focus:outline-none focus:ring-2 focus:ring-terracotta-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto self-start py-4 px-8 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer ma Demande de Devis</span>
              </button>
            </form>
          </div>

          {/* Right Col: Agency Information & Instant WhatsApp */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white border border-sand-200 p-8 shadow-sm flex flex-col gap-6">
              <h3 className="font-serif text-xl font-bold text-morocco-dark">
                Coordonnées de l&apos;Agence
              </h3>

              <div className="flex flex-col gap-4 text-xs text-sand-900">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-terracotta-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-morocco-dark">Adresse Siège :</span>
                    <span className="text-sand-700">Boulevard Mohammed V, Guéliz, Marrakech 40000, Maroc</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-sand-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-morocco-dark">Téléphone :</span>
                    <a href="tel:+212600000000" className="hover:text-terracotta-600">
                      +212 600 000 000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-sand-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-morocco-dark">Email :</span>
                    <a href="mailto:contact@luxurymarocvoyage.com" className="hover:text-terracotta-600">
                      contact@luxurymarocvoyage.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-sand-700 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-morocco-dark">Horaires de Conciergerie :</span>
                    <span className="text-sand-700">Du Lundi au Dimanche : 08h00 - 20h00 (Assistance VIP 24/7 en voyage)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="rounded-3xl bg-emerald-700 text-white p-8 shadow-lg flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-serif text-xl font-bold">
                Besoin d&apos;une Réponse Immédiate ?
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Discutez directement avec notre équipe locale sur WhatsApp pour une réponse rapide et des conseils en temps réel.
              </p>
              <a
                href={`https://wa.me/${cleanNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-md"
              >
                Ouvrir la Conversation WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
