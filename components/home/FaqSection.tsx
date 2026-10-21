'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import type { Destination } from '@/lib/queries/destinations';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  locale: string;
  circuits?: Tour[];
  excursions?: Tour[];
  destinations?: Destination[];
}

export default function FaqSection({ locale, circuits = [], excursions = [], destinations = [] }: FaqSectionProps) {
  const t = useTranslations('sections');
  const fr = locale === 'fr';
  const es = locale === 'es';
  const destinationNames = destinations.slice(0, 5).map((destination) => destination.name);
  const circuitNames = circuits.slice(0, 3).map((tour) => tour.title);
  const excursionNames = excursions.slice(0, 3).map((tour) => tour.title);
  const list = (items: string[], fallback: string) => items.length ? items.join(', ') : fallback;

  const faqs: FaqItem[] = fr
    ? [
        { question: 'Quels circuits privés et voyages sur mesure proposez-vous au Maroc ?', answer: `Nous proposons des circuits privés et des itinéraires personnalisés au Maroc, avec des étapes choisies selon vos envies. Parmi les circuits disponibles : ${list(circuitNames, 'Marrakech, les villes impériales et le désert du Sahara')}.` },
        { question: 'Quelles destinations découvrir pendant un voyage au Maroc ?', answer: `Selon les circuits et excursions disponibles, vous pouvez organiser un séjour autour de destinations comme ${list(destinationNames, 'Marrakech, Fès, Merzouga, Chefchaouen et Essaouira')}. Consultez chaque fiche destination pour voir les voyages associés.` },
        { question: 'Quelles excursions peut-on réserver depuis Marrakech ?', answer: `Les excursions publiées comprennent notamment : ${list(excursionNames, 'des sorties dans le Haut Atlas, vers la côte atlantique et dans le désert d’Agafay')}. Les détails de départ et de durée figurent sur chaque fiche.` },
        { question: 'Comment demander un devis pour un circuit au Maroc ?', answer: 'Choisissez un circuit ou une excursion, puis envoyez votre demande avec vos dates, le nombre de voyageurs et vos préférences. Vous pouvez aussi contacter notre équipe pour préparer un voyage sur mesure.' },
        { question: 'Quelle est la meilleure période pour visiter le Maroc et le Sahara ?', answer: 'Le printemps et l’automne offrent généralement des températures agréables pour découvrir Marrakech, les villes impériales et les paysages du Sud. Dans le Sahara, les journées sont souvent plus confortables d’octobre à avril ; prévoyez des vêtements chauds pour les nuits.' },
      ]
    : es
      ? [
          { question: '¿Qué circuitos privados y viajes a medida ofrecéis en Marruecos?', answer: `Ofrecemos circuitos privados e itinerarios personalizados por Marruecos, con paradas adaptadas a tus intereses. Entre los circuitos disponibles: ${list(circuitNames, 'Marrakech, las ciudades imperiales y el desierto del Sáhara')}.` },
          { question: '¿Qué destinos visitar durante un viaje por Marruecos?', answer: `Según los circuitos y excursiones disponibles, puedes organizar tu viaje en destinos como ${list(destinationNames, 'Marrakech, Fez, Merzouga, Chefchaouen y Essaouira')}. Consulta cada destino para ver los viajes relacionados.` },
          { question: '¿Qué excursiones se pueden hacer desde Marrakech?', answer: `Las excursiones publicadas incluyen, entre otras: ${list(excursionNames, 'salidas al Alto Atlas, la costa atlántica y el desierto de Agafay')}. Cada ficha incluye información sobre salida y duración.` },
          { question: '¿Cómo puedo solicitar un presupuesto para un circuito por Marruecos?', answer: 'Elige un circuito o una excursión y envía tu solicitud con las fechas, el número de viajeros y tus preferencias. También puedes contactar con el equipo para diseñar un viaje a medida.' },
          { question: '¿Cuál es la mejor época para visitar Marruecos y el Sáhara?', answer: 'La primavera y el otoño suelen ofrecer temperaturas agradables para descubrir Marrakech, las ciudades imperiales y el sur. En el Sáhara, los días suelen ser más cómodos de octubre a abril; lleva ropa de abrigo para las noches.' },
        ]
      : [
          { question: 'What private Morocco tours and tailor-made trips can I book?', answer: `Browse our current private tours and build an itinerary around the places and pace you prefer. Available journeys include: ${list(circuitNames, 'Marrakech, Morocco’s imperial cities, and the Sahara Desert')}.` },
          { question: 'Which destinations can I visit on a Morocco trip?', answer: `Depending on the current tours and excursions, you can plan a journey around destinations such as ${list(destinationNames, 'Marrakech, Fes, Merzouga, Chefchaouen, and Essaouira')}. Open a destination page to see its related trips.` },
          { question: 'What day trips and excursions are available from Marrakech?', answer: `Current excursions include options such as ${list(excursionNames, 'High Atlas outings, Atlantic coast trips, and visits to the Agafay Desert')}. Each trip page lists its departure and duration details.` },
          { question: 'How do I request a quote for a Morocco tour?', answer: 'Choose a tour or excursion and send an inquiry with your travel dates, group size, and preferences. You can also contact the team to discuss a tailor-made Morocco itinerary.' },
          { question: 'When is the best time to visit Morocco and the Sahara?', answer: 'Spring and autumn generally bring comfortable temperatures for Marrakech, the imperial cities, and southern Morocco. Sahara days are often milder from October to April; pack warm layers for desert nights.' },
        ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8" aria-labelledby="travel-faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mb-9 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sand-800"><HelpCircle className="h-3.5 w-3.5 text-sand-600" /><span>{fr ? 'Conseils de voyage au Maroc' : es ? 'Consejos para viajar por Marruecos' : 'Morocco travel advice'}</span></div>
        <h2 id="travel-faq-title" className="font-serif text-3xl font-bold tracking-tight text-morocco-dark sm:text-4xl">{t('faqTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-sand-800 sm:text-base">{fr ? 'Réponses pratiques sur les circuits, excursions et destinations du Maroc.' : es ? 'Respuestas prácticas sobre circuitos, excursiones y destinos de Marruecos.' : 'Practical answers about Morocco tours, excursions, and destinations.'}</p>
      </div>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0} className="group overflow-hidden rounded-2xl border border-sand-200/80 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left marker:hidden sm:p-6">
              <span className="font-serif text-base font-bold text-morocco-dark sm:text-lg">{faq.question}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand-100 text-sand-700 transition-transform group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
            </summary>
            <div className="border-t border-sand-100 px-5 pb-5 pt-4 text-sm leading-7 text-sand-800 sm:px-6">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
