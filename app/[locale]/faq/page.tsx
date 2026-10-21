import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FaqSection from '@/components/home/FaqSection';
import { getTours } from '@/lib/queries/tours';
import { getPopularDestinations } from '@/lib/queries/destinations';
import { HelpCircle } from 'lucide-react';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Foire Aux Questions (FAQ) | Tout Savoir sur Votre Voyage au Maroc',
    en: 'Frequently Asked Questions (FAQ) | Morocco Travel Tips & Details',
    es: 'Preguntas Frecuentes (FAQ) | Todo sobre su Viaje a Marruecos',
  };

  const descriptions: Record<string, string> = {
    fr: 'Retrouvez toutes les réponses à vos questions pour préparer votre séjour au Maroc : formalités, climat, déroulement des nuits dans le désert, paiements et sécurité.',
    en: 'Find answers to the most common questions about traveling to Morocco: visa requirements, best season, luxury desert camp details, safety, and payments.',
    es: 'Respuestas a todas las dudas sobre su viaje a Marruecos: clima, seguridad, qué llevar, acampada en el desierto y condiciones de reserva.',
  };


  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/faq'),
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const [circuits, excursions, destinations] = await Promise.all([
    getTours(locale, { typeFilter: 'circuit' }).catch(() => []),
    getTours(locale, { typeFilter: 'excursion' }).catch(() => []),
    getPopularDestinations(locale, 6).catch(() => []),
  ]);

  const breadcrumbs = [
    { label: 'FAQ' },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <FaqSection locale={locale} circuits={circuits} excursions={excursions} destinations={destinations} />
      </div>
    </div>
  );
}
