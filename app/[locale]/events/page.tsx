import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Image from 'next/image';
import { getEvents } from '@/lib/queries/events';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { MapPin, ArrowRight, Sparkles, Star } from 'lucide-react';

interface EventsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Événements & Départs Spéciaux au Maroc | Festivals & Célébrations',
    en: 'Morocco Special Departures & Cultural Events | Festivals & Gatherings',
    es: 'Eventos y Salidas Especiales en Marruecos | Festivales y Fiestas',
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez nos départs exclusifs et voyages organisés lors des grands événements culturels marocains : Festival des Roses, Nöel et Nouvel An dans le désert, Festival Gnaoua.',
    en: 'Join exclusive special departures celebrating iconic Moroccan events: New Year in the Sahara desert, Gnaoua World Music Festival, Rose Festival, and cultural gatherings.',
    es: 'Participe en salidas especiales durante los grandes festivales y eventos culturales de Marruecos: Fin de Año en el Sáhara, Festival de las Rosas y encuentros únicos.',
  };


  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/events'),
  };
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { locale } = await params;
  const events = await getEvents(locale);

  const breadcrumbs = [
    { label: locale === 'en' ? 'Events' : locale === 'es' ? 'Eventos' : 'Événements' },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-majorelle-50 text-majorelle-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-majorelle-500" />
            <span>Voyages à Dates Définies & Festivals</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight">
            Événements Culturels & Départs Spéciaux
          </h1>
          <p className="mt-3 text-sand-800 text-sm sm:text-base leading-relaxed">
            Prenez part aux célébrations traditionnelles, réveillons d&apos;exception au cœur des dunes de Merzouga et grands rendez-vous artistiques du Royaume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const defaultImage =
              'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
            const imageUrl =
              event.image && event.image.startsWith('http')
                ? event.image
                : defaultImage;

            return (
              <article
                key={event.id}
                className="group flex flex-col rounded-3xl bg-white overflow-hidden luxury-card border border-sand-200/60"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-morocco-charcoal">
                  <Image
                    src={imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-morocco-dark/80 via-transparent to-transparent" />

                  {event.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-majorelle-600 text-white shadow-md">
                        {event.category}
                      </span>
                    </div>
                  )}

                  {event.rating > 0 && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-morocco-dark/80 text-sand-300 text-xs font-semibold backdrop-blur-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{event.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-xs text-sand-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    <h2 className="font-serif text-xl font-bold text-morocco-dark group-hover:text-terracotta-600 transition-colors line-clamp-2">
                      <Link href={`/events/${event.slug}` as any}>
                        {event.title}
                      </Link>
                    </h2>

                    {event.description && (
                      <p className="text-xs text-sand-800 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-terracotta-600">
                      {event.price || 'Places Limitées'}
                    </span>

                    <Link
                      href={`/events/${event.slug}` as any}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-terracotta-600 group-hover:text-terracotta-700"
                    >
                      <span>Découvrir l&apos;événement</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
