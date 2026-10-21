import { getFeaturedTours, getPopularExcursions, getTours } from '@/lib/queries/tours';
import { getDestinations } from '@/lib/queries/destinations';
import { getUpcomingEvents } from '@/lib/queries/events';
import { getArticles } from '@/lib/queries/articles';

import Hero from '@/components/home/Hero';
import FeaturedCircuits from '@/components/home/FeaturedCircuits';
import PopularExcursions from '@/components/home/PopularExcursions';
import DestinationsShowcase from '@/components/home/DestinationsShowcase';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import LatestArticles from '@/components/home/LatestArticles';
import ExploreMoroccoSection from '@/components/home/ExploreMoroccoSection';
import ContactTabsPanel from '@/components/contact/ContactTabsPanel';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Parallel data fetching from MySQL database
  const [destinations, featuredTours, popularExcursions, upcomingEvents, latestArticles, circuits, excursions] =
    await Promise.all([
      getDestinations(locale).catch(() => []),
      getFeaturedTours(locale, 8).catch(() => []),
      getPopularExcursions(locale, 8).catch(() => []),
      getUpcomingEvents(locale, 3).catch(() => []),
      getArticles(locale, 3).catch(() => []),
      getTours(locale, { typeFilter: 'circuit' }).catch(() => []),
      getTours(locale, { typeFilter: 'excursion' }).catch(() => []),
    ]);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212776715010';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent('Bonjour Luxurymarocvoyage, je souhaite concevoir un projet de voyage au Maroc.');

  return (
    <div className="flex flex-col gap-0">
      {/* Hero section with live search */}
      <Hero destinations={destinations} />

      {/* Signature Multi-day Circuits */}
      <FeaturedCircuits tours={featuredTours} locale={locale} />

      {/* Popular 1-day Excursions */}
      <PopularExcursions excursions={popularExcursions} locale={locale} />

      {/* Destinations Showcase */}
      <DestinationsShowcase destinations={destinations} locale={locale} />

      {/* 4 Pillars - Why Choose Us */}
      <WhyChooseUs locale={locale} />

      {/* Illustrative sample testimonials */}
      <TestimonialsSection locale={locale} />

      {/* Upcoming Events & Cultural Festivals */}
      <UpcomingEvents events={upcomingEvents} locale={locale} />

      {/* Latest Travel Guides & Blog */}
      <LatestArticles articles={latestArticles} locale={locale} />

      {/* Explorer le Maroc Section */}
      <ExploreMoroccoSection
        tours={circuits}
        excursions={excursions}
        destinations={destinations}
        locale={locale}
      />

      <section className="bg-gradient-to-b from-white to-[#FDF8F2] px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B64F2E]">
              {locale === 'fr' ? 'Contactez-nous' : locale === 'es' ? 'Contáctanos' : 'Get in touch'}
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">
              {locale === 'fr' ? 'Parlons de votre prochain voyage' : locale === 'es' ? 'Hablemos de tu próximo viaje' : 'Let’s talk about your next trip'}
            </h2>
          </header>
          <ContactTabsPanel
            locale={locale}
            whatsappHref={`https://wa.me/${cleanNumber}?text=${whatsappMessage}`}
            circuits={circuits}
            excursions={excursions}
          />
        </div>
      </section>
    </div>
  );
}
