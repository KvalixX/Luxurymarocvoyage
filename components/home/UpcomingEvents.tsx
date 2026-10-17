import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { Event } from '@/lib/queries/events';
import { getTranslations } from 'next-intl/server';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface UpcomingEventsProps {
  events: Event[];
  locale: string;
}

export default async function UpcomingEvents({ events, locale }: UpcomingEventsProps) {
  const t = await getTranslations({ locale, namespace: 'sections' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  if (!events || events.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-[#F0E6D8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="section-eyebrow">
              <Sparkles className="w-3 h-3 text-[#DF6951]" />
              <span>
                {locale === 'fr'
                  ? 'Départs & Festivals'
                  : locale === 'es'
                  ? 'Salidas y Festivales'
                  : 'Departures & Festivals'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#181E4B] tracking-tight leading-tight">
              {t('eventsTitle')}
            </h2>
            <p className="mt-2 text-slate-500 text-xs sm:text-[14px] leading-relaxed">
              {t('eventsSub')}
            </p>
          </div>

          <Link
            href="/events"
            className="btn-outline shrink-0 self-start md:self-auto"
          >
            <span>{tCommon('viewAllEvents')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => {
            const defaultImage =
              'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
            const imageUrl =
              event.image && event.image.startsWith('http') ? event.image : defaultImage;

            return (
              <article
                key={event.id}
                className="group flex flex-col rounded-2xl bg-white overflow-hidden border border-[#F0E6D8]/80 shadow-[0_2px_12px_rgba(26,15,10,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(223,105,81,0.16)] hover:border-terracotta-300/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {event.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#DF6951] text-white shadow-xs">
                        {event.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#DF6951]" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181E4B] group-hover:text-[#DF6951] transition-colors line-clamp-2">
                      <Link href={`/events/${event.slug}` as any}>{event.title}</Link>
                    </h3>

                    {event.description && (
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {event.price ? (
                      <span className="text-xs font-bold text-[#DF6951]">
                        {event.price}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        Départ exclusif
                      </span>
                    )}

                    <Link
                      href={`/events/${event.slug}` as any}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DF6951] hover:text-[#c94e38] transition-colors"
                    >
                      <span>Détails</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
