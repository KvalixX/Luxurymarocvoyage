'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqsFr: FaqItem[] = [
  {
    question: 'Quelle est la meilleure période pour voyager au Maroc ?',
    answer:
      'Le printemps (mars à mai) et l’automne (septembre à novembre) sont idéaux avec des températures très douces tant dans les villes impériales que dans le désert. Pour le Sahara (Merzouga), les nuits sont fraîches et les journées parfaites entre octobre et avril.',
  },
  {
    question: 'Comment se déroule une nuit en bivouac dans le désert du Sahara ?',
    answer:
      'Après une traversée mémorable en 4x4 ou à dos de dromadaire au coucher du soleil, vous rejoignez un campement nomade de luxe tout confort : tentes privées avec véritables lits king-size, salle de bain attenante avec douche chaude, dîner gastronomique marocain sous la voûte étoilée et chants berbères autour du feu.',
  },
  {
    question: 'Vos circuits sont-ils 100% privatifs ?',
    answer:
      'Oui, absolument. Tous nos circuits et excursions sont exclusifs : vous disposez de votre véhicule privé haut de gamme (Mercedes Vito, Classe V ou 4x4 Prado) et de votre chauffeur-guide dédié. Vous voyagez à votre propre rythme sans contraintes de groupe.',
  },
  {
    question: 'Vos chauffeurs et guides parlent-ils ma langue ?',
    answer:
      'Tous nos chauffeurs et guides officiels locaux maîtrisent parfaitement le français, l’anglais et l’espagnol. Lors de la réservation, nous affectons le guide correspondant à votre langue de prédilection.',
  },
  {
    question: 'Quelles sont les modalités de réservation et d’acompte ?',
    answer:
      'Pour confirmer votre voyage sur-mesure, un acompte de 20% à 30% est demandé par virement bancaire sécurisé ou carte de crédit. Le solde peut être réglé avant le départ ou directement à votre arrivée à Marrakech.',
  },
];

const faqsEn: FaqItem[] = [
  {
    question: 'What is the best time of year to visit Morocco?',
    answer:
      'Spring (March to May) and Autumn (September to November) offer the most pleasant weather across both imperial cities and desert regions. For the Sahara desert (Merzouga & Erg Chebbi), October through April offers ideal sunny days and crisp starlit evenings.',
  },
  {
    question: 'What is a luxury desert camp experience like in Merzouga?',
    answer:
      'Arriving by camel trek or private 4x4 at sunset, you will stay in starlit royal glamping tents equipped with plush king beds, en-suite bathrooms with hot showers, authentic multi-course Moroccan dining, and traditional Berber music around a crackling campfire.',
  },
  {
    question: 'Are all your tours 100% private?',
    answer:
      'Yes, all our itineraries are strictly private. You will have your own dedicated luxury Mercedes vehicle and an experienced chauffeur-guide, traveling at your own leisurely pace without the constraints of large tour buses.',
  },
  {
    question: 'What languages do your guides speak?',
    answer:
      'Our certified local guides and private drivers are fluent in English, French, and Spanish. We assign the driver and city guides matching your preferred language.',
  },
  {
    question: 'How do bookings and payment terms work?',
    answer:
      'To secure your private journey, a 20% to 30% deposit is payable via secure bank transfer or credit card. The remaining balance can be completed prior to arrival or in Marrakech upon departure.',
  },
];

const faqsEs: FaqItem[] = [
  {
    question: '¿Cuál es la mejor época para viajar a Marruecos?',
    answer:
      'La primavera (marzo a mayo) y el otoño (septiembre a noviembre) son las estaciones más agradables tanto en las ciudades imperiales como en el desierto. Para el Sáhara (Merzouga), de octubre a abril el clima es idóneo.',
  },
  {
    question: '¿Cómo es la estancia en un campamento de lujo en el desierto?',
    answer:
      'Tras un paseo en dromedario o 4x4 al atardecer, descansará en jaimas de lujo con camas de matrimonio de gran confort, baño privado con agua caliente, cena tradicional marroquí y música bereber junto a la hoguera bajo el cielo estrellado.',
  },
  {
    question: '¿Todos sus circuitos son 100% privados?',
    answer:
      'Sí, todos nuestros viajes son exclusivamente privados. Contará con su propio vehículo Mercedes climatizado y chófer-guía profesional, disfrutando del viaje a su propio ritmo sin prisas ni grupos ajenos.',
  },
  {
    question: '¿En qué idiomas atienden sus guías y conductores?',
    answer:
      'Nuestros conductores y guías locales dominan con fluidez español, inglés y francés. Asignamos siempre el equipo que hable su idioma.',
  },
  {
    question: '¿Cómo se formaliza la reserva y el pago?',
    answer:
      'Para confirmar su itinerario personalizado, se abona un anticipo del 20% al 30% mediante transferencia bancaria segura o tarjeta. El resto se abona antes de la llegada o directamente en Marrakech.',
  },
];

interface FaqSectionProps {
  locale: string;
}

export default function FaqSection({ locale }: FaqSectionProps) {
  const t = useTranslations('sections');

  const faqs = locale === 'es' ? faqsEs : locale === 'en' ? faqsEn : faqsFr;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Schema.org FAQPage structured data for Google rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* FAQ Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-sand-600" />
          <span>Guide & Réponses</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-morocco-dark tracking-tight">
          {t('faqTitle')}
        </h2>
        <p className="mt-3 text-sand-800 text-sm sm:text-base leading-relaxed">
          {t('faqSub')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-sand-200/80 bg-white overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
              >
                <span className="font-serif text-base sm:text-lg font-bold text-morocco-dark pr-4">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-terracotta-500 text-white rotate-180'
                      : 'bg-sand-100 text-sand-700'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-sand-800 leading-relaxed border-t border-sand-50 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
