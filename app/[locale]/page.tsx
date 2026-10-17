import { getFeaturedTours, getPopularExcursions } from '@/lib/queries/tours';
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

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Parallel data fetching from MySQL database
  const [destinations, featuredTours, popularExcursions, upcomingEvents, latestArticles] =
    await Promise.all([
      getDestinations(locale).catch(() => []),
      getFeaturedTours(locale, 8).catch(() => []),
      getPopularExcursions(locale, 8).catch(() => []),
      getUpcomingEvents(locale, 3).catch(() => []),
      getArticles(locale, 3).catch(() => []),
    ]);

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

      {/* Verified Traveler Testimonials */}
      <TestimonialsSection locale={locale} />

      {/* Upcoming Events & Cultural Festivals */}
      <UpcomingEvents events={upcomingEvents} locale={locale} />

      {/* Latest Travel Guides & Blog */}
      <LatestArticles articles={latestArticles} locale={locale} />

      {/* Explorer le Maroc Section */}
      <ExploreMoroccoSection
        tours={featuredTours}
        destinations={destinations}
        locale={locale}
      />
    </div>
  );
}
