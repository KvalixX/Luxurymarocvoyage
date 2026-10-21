import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getEventBySlug, getEventSlugs } from '@/lib/queries/events';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EventInquiryForm from '@/components/events/EventInquiryForm';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { localizedAlternates, localizedUrl } from '@/lib/seo/urls';
import { seoDescription } from '@/lib/seo/text';

interface EventDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  const locales = ['fr', 'en', 'es'];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const item of slugs) {
      if (item.slug) {
        params.push({ locale, slug: item.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug, locale);

  if (!event) return { title: 'Événement Non Trouvé' };

  const canonicalUrl = localizedUrl(locale, '/events/[slug]', { slug });

  return {
    title: `${event.title} | ${locale === 'en' ? 'Morocco Event' : locale === 'es' ? 'Evento en Marruecos' : '\u00c9v\u00e9nement au Maroc'}`,
    description: seoDescription(event.description, event.title),
    alternates: localizedAlternates(locale, '/events/[slug]', { slug }),
    openGraph: {
      title: event.title,
      description: seoDescription(event.description, event.title),
      url: canonicalUrl,
      images: event.image ? [{ url: event.image }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug, locale);

  if (!event) {
    notFound();
  }

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212776715010';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Bonjour Luxurymarocvoyage, je souhaite obtenir des informations et réserver pour l'événement : "${event.title}".`
  );

  const breadcrumbs = [
    {
      label: locale === 'en' ? 'Events' : locale === 'es' ? 'Eventos' : 'Événements',
      href: '/events',
    },
    { label: event.title },
  ];

  const defaultImage =
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85';
  const imageUrl =
    event.image && event.image.startsWith('http') ? event.image : defaultImage;

  // Schema.org Event structured data
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    image: imageUrl,
    location: {
      '@type': 'Place',
      name: event.location || 'Maroc',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MA',
      },
    },
    offers: {
      '@type': 'Offer',
      price: event.price?.replace(/[^0-9]/g, '') || '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          <div className="contents order-1 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:gap-5">
        {/* Header */}
        <div className="order-1 max-w-4xl lg:order-none">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {event.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-majorelle-50 text-majorelle-600">
                {event.category}
              </span>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-sand-800 font-semibold px-3 py-1 rounded-full bg-sand-100">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight leading-tight mb-1">
            {event.title}
          </h1>
        </div>

        {/* Hero image banner */}
        <div className="relative order-3 aspect-[21/9] sm:aspect-[21/8] w-full rounded-3xl overflow-hidden shadow-md lg:order-none">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-morocco-dark/60 via-transparent to-transparent" />
        </div>

          <div className="order-4 flex flex-col gap-6 lg:order-none">
            {/* Description */}
            {event.description && (
              <section className="rounded-3xl bg-white border border-sand-200 p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-morocco-dark mb-4">
                  À Propos de l&apos;Événement
                </h2>
                <div
                  className="text-sm sm:text-base text-sand-900 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: event.description.replace(/\n/g, '<br />'),
                  }}
                />
              </section>
            )}

            {/* Rich Details */}
            {event.details && (
              <section className="rounded-3xl bg-white border border-sand-200 p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-morocco-dark mb-4">
                  Programme & Déroulement
                </h2>
                <div
                  className="text-sm text-sand-800 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: event.details.replace(/\n/g, '<br />'),
                  }}
                />
              </section>
            )}

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <section className="rounded-3xl bg-sand-50/80 border border-sand-200 p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-morocco-dark mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sand-600" />
                  <span>Moments Forts Inclus</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          </div>
          <aside className="order-2 lg:order-none lg:sticky lg:top-28 lg:col-start-3 lg:row-start-1">
            <EventInquiryForm
              title={event.title}
              slug={event.slug}
              price={event.price || ''}
              locale={locale}
              whatsappHref={`https://wa.me/${cleanNumber}?text=${whatsappMessage}`}
            />
          </aside>
        </div>
      </article>
    </div>
  );
}
