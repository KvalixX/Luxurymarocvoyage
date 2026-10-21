import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { getDestinations } from '@/lib/queries/destinations';
import { getTours } from '@/lib/queries/tours';
import { ArrowRight, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: 'À propos de Luxury Maroc Voyage | Marrakech, Maroc',
    en: 'About Luxury Maroc Voyage | Marrakech, Morocco',
    es: 'Sobre Luxury Maroc Voyage | Marrakech, Marruecos',
  };
  const descriptions: Record<string, string> = {
    fr: 'Consultez les informations de Luxury Maroc Voyage, son adresse à Marrakech et les circuits, excursions et destinations actuellement proposés sur le site.',
    en: 'Find Luxury Maroc Voyage contact details in Marrakech and browse the tours, excursions, and destinations currently listed on the website.',
    es: 'Consulta la información de contacto de Luxury Maroc Voyage en Marrakech y descubre los circuitos, excursiones y destinos publicados en el sitio.',
  };
  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/about'),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const [destinations, circuits, excursions] = await Promise.all([
    getDestinations(locale).catch(() => []),
    getTours(locale, { typeFilter: 'circuit' }).catch(() => []),
    getTours(locale, { typeFilter: 'excursion' }).catch(() => []),
  ]);
  const fr = locale === 'fr';
  const es = locale === 'es';
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'Bureau N°5, 2ème étage, Lot, 359, Marrakech 40000, Maroc';
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const featuredDestinations = destinations.slice(0, 4);
  const featuredTrips = [...circuits.slice(0, 3), ...excursions.slice(0, 3)];
  const addressUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const labels = fr
    ? {
        eyebrow: 'Luxury Maroc Voyage', title: 'Informations sur notre agence de voyage à Marrakech',
        intro: 'Luxury Maroc Voyage propose des circuits et excursions au Maroc. Cette page présente l’adresse de l’agence ainsi que les voyages et destinations actuellement répertoriés sur le site.',
        aboutTitle: 'Préparez votre voyage avec des informations claires',
        aboutText: 'Un voyage se prépare plus sereinement lorsque l’itinéraire, la durée et les étapes sont faciles à consulter. Parcourez les fiches de circuits et d’excursions pour découvrir les programmes publiés, comparer les destinations et choisir les expériences qui correspondent à votre projet.',
        aboutText2: 'Les informations présentées sur cette page proviennent du catalogue du site et peuvent évoluer. Ouvrez la fiche de chaque voyage pour consulter son programme et ses détails, puis contactez l’agence si vous souhaitez poser une question ou préciser votre demande avant de réserver.',
        trustTitle: 'Vérifiez les informations et contactez l’agence',
        trustText: 'Vous pouvez retrouver l’adresse de l’agence à Marrakech et ouvrir son emplacement dans Google Maps. Les avis clients plus bas sur cette page reprennent les retours transmis pour le site ; consultez aussi les profils Google et TripAdvisor liés pour accéder aux plateformes d’origine et vérifier les informations disponibles.',
        choiceTitle: 'Choisissez le format qui vous convient',
        choiceText: 'Le catalogue présente des circuits de plusieurs jours ainsi que des excursions. Les destinations et les itinéraires sont affichés à partir des fiches disponibles sur le site. Comparez les étapes et la durée indiquées, puis consultez directement la fiche détaillée du voyage qui vous intéresse.',
        office: 'Adresse de l’agence', catalog: 'Le catalogue actuel',
        catalogIntro: 'Les éléments ci-dessous sont chargés depuis le catalogue du site et peuvent évoluer avec les offres publiées.',
        destinations: 'Destinations', circuits: 'Circuits privés', excursions: 'Excursions',
        destinationsTitle: 'Destinations actuellement proposées', allDestinations: 'Toutes les destinations',
        tripsTitle: 'Circuits et excursions du catalogue', allTrips: 'Tous les circuits',
        trip: 'Voir le voyage', duration: 'jours', nights: 'nuits',
        contactTitle: 'Contacter Luxury Maroc Voyage', phone: 'Téléphone', email: 'E-mail', directions: 'Voir sur Google Maps',
        destinationFallback: 'Destination au Maroc',
      }
    : es
      ? {
          eyebrow: 'Luxury Maroc Voyage', title: 'Información de nuestra agencia de viajes en Marrakech',
          intro: 'Luxury Maroc Voyage ofrece circuitos y excursiones por Marruecos. Esta página muestra la dirección de la agencia y los viajes y destinos publicados actualmente en el sitio.',
          aboutTitle: 'Prepara tu viaje con información clara',
          aboutText: 'Planificar es más sencillo cuando puedes consultar el itinerario, la duración y las etapas. Explora las fichas de circuitos y excursiones para conocer los programas publicados, comparar destinos y elegir experiencias que se ajusten a tu viaje.',
          aboutText2: 'La información de esta página procede del catálogo del sitio y puede cambiar. Abre la ficha de cada viaje para consultar el programa y sus detalles, y contacta con la agencia si tienes preguntas o quieres explicar tu solicitud antes de reservar.',
          trustTitle: 'Comprueba la información y contacta con la agencia',
          trustText: 'Puedes consultar la dirección de la agencia en Marrakech y abrir su ubicación en Google Maps. Las opiniones que aparecen más abajo son reseñas facilitadas para el sitio; también puedes visitar los perfiles enlazados de Google y TripAdvisor para consultar las plataformas originales.',
          choiceTitle: 'Elige el tipo de viaje que prefieres',
          choiceText: 'El catálogo incluye circuitos de varios días y excursiones. Los destinos e itinerarios se muestran según las fichas disponibles en el sitio. Compara las etapas y la duración indicadas y consulta la ficha detallada del viaje que te interese.',
          office: 'Dirección de la agencia', catalog: 'Catálogo actual',
          catalogIntro: 'Los elementos siguientes se cargan desde el catálogo del sitio y pueden cambiar cuando se actualicen las ofertas.',
          destinations: 'Destinos', circuits: 'Circuitos privados', excursions: 'Excursiones',
          destinationsTitle: 'Destinos disponibles actualmente', allDestinations: 'Todos los destinos',
          tripsTitle: 'Circuitos y excursiones del catálogo', allTrips: 'Todos los circuitos',
          trip: 'Ver viaje', duration: 'días', nights: 'noches',
          contactTitle: 'Contactar con Luxury Maroc Voyage', phone: 'Teléfono', email: 'Correo electrónico', directions: 'Ver en Google Maps',
          destinationFallback: 'Destino de Marruecos',
        }
      : {
          eyebrow: 'Luxury Maroc Voyage', title: 'About our Marrakech travel agency',
          intro: 'Luxury Maroc Voyage offers tours and excursions in Morocco. This page lists the agency address and the trips and destinations currently published on the website.',
          aboutTitle: 'Plan your trip with clear information',
          aboutText: 'Planning is easier when you can review the itinerary, duration, and stops. Browse the tour and excursion pages to see the programs currently listed, compare destinations, and find experiences that fit your plans.',
          aboutText2: 'The information on this page comes from the website catalog and may change. Open each trip page to review its program and details, then contact the agency if you have questions or want to explain your request before booking.',
          trustTitle: 'Check the details and contact the agency',
          trustText: 'You can find the agency address in Marrakech and open its location in Google Maps. The customer review excerpts further down were supplied for this website; the linked Google and TripAdvisor profiles take you to the original platforms to check the information there.',
          choiceTitle: 'Choose the kind of trip that suits you',
          choiceText: 'The catalog lists multi-day tours as well as excursions. Destinations and itineraries are shown from the pages currently available on the website. Compare the listed stops and duration, then open a trip page for its full details.',
          office: 'Agency address', catalog: 'Current catalog',
          catalogIntro: 'The listings below are loaded from the website catalog and can change as tour offerings are updated.',
          destinations: 'Destinations', circuits: 'Private tours', excursions: 'Excursions',
          destinationsTitle: 'Destinations currently listed', allDestinations: 'All destinations',
          tripsTitle: 'Tours and excursions in the catalog', allTrips: 'All tours',
          trip: 'View trip', duration: 'days', nights: 'nights',
          contactTitle: 'Contact Luxury Maroc Voyage', phone: 'Phone', email: 'Email', directions: 'Open in Google Maps',
          destinationFallback: 'Morocco destination',
        };

  const breadcrumbs = [{ label: fr ? 'À propos' : es ? 'Sobre nosotros' : 'About Us' }];
  const stats = [
    { label: labels.destinations, value: destinations.length },
    { label: labels.circuits, value: circuits.length },
    { label: labels.excursions, value: excursions.length },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7] pb-0 pt-24">
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <div className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-9 max-w-3xl">
          <div className="section-eyebrow"><MapPin className="h-3.5 w-3.5 text-[#DF6951]" /><span>{labels.eyebrow}</span></div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#181E4B] sm:text-5xl">{labels.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{labels.intro}</p>
        </header>

        <section className="mb-10 grid gap-6 rounded-3xl border border-[#E9DDCD] bg-white p-6 sm:p-9 lg:grid-cols-[1fr_0.8fr] lg:gap-12" aria-labelledby="about-introduction-title">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B64F2E]">{labels.eyebrow}</p>
            <h2 id="about-introduction-title" className="mt-3 font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{labels.aboutTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{labels.aboutText}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{labels.aboutText2}</p>
          </div>
          <div className="rounded-2xl bg-[#FCFAF7] p-5 sm:p-6">
            <h3 className="font-serif text-xl font-bold text-[#181E4B]">{labels.trustTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{labels.trustText}</p>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#B64F2E] hover:underline">{labels.contactTitle}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#E9DDCD] bg-white shadow-[0_18px_50px_-35px_rgba(24,30,75,0.3)]" aria-labelledby="agency-address-title">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-9 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCF0EA] text-[#B64F2E]"><MapPin className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B64F2E]">Luxury Maroc Voyage</p>
                  <h2 id="agency-address-title" className="mt-1 font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{labels.office}</h2>
                </div>
              </div>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-700">{address}</p>
              <a href={addressUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B64F2E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#984126]">{labels.directions}<ExternalLink className="h-4 w-4" /></a>
            </div>
            <div className="border-t border-[#E9DDCD] bg-[#FCFAF7] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B64F2E]">{labels.contactTitle}</p>
              <div className="mt-4 grid gap-3">
                {phone && <a href={`tel:${phone}`} className="group flex items-center gap-4 rounded-2xl border border-[#E9DDCD] bg-white p-4 transition hover:border-[#DF6951]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCF0EA] text-[#B64F2E]"><Phone className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block text-xs text-slate-500">{labels.phone}</span><span className="mt-1 block break-all text-sm font-semibold text-[#181E4B]">{phone}</span></span>
                </a>}
                {email && <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-2xl border border-[#E9DDCD] bg-white p-4 transition hover:border-[#DF6951]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCF0EA] text-[#B64F2E]"><Mail className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block text-xs text-slate-500">{labels.email}</span><span className="mt-1 block break-all text-sm font-semibold text-[#181E4B]">{email}</span></span>
                </a>}
                {!phone && !email && <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[#E9DDCD] bg-white px-4 py-3 text-sm font-semibold text-[#181E4B] hover:border-[#DF6951]">{labels.contactTitle}<ArrowRight className="h-4 w-4 text-[#B64F2E]" /></Link>}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14" aria-labelledby="catalog-title">
          <div className="mb-6 max-w-2xl"><h2 id="catalog-title" className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{labels.catalog}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{labels.catalogIntro}</p></div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-[#E9DDCD] bg-white p-4 text-center sm:p-6"><p className="font-serif text-2xl font-bold text-[#B64F2E] sm:text-3xl">{stat.value}</p><p className="mt-1 text-[11px] leading-4 text-slate-600 sm:text-sm">{stat.label}</p></div>)}
          </div>
        </section>

        <section className="pb-12 sm:pb-14" aria-labelledby="about-destinations-title">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 id="about-destinations-title" className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{labels.destinationsTitle}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{labels.choiceText}</p></div><Link href="/destinations" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#B64F2E] hover:underline">{labels.allDestinations}<ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDestinations.map((destination) => <Link key={destination.id} href={`/destinations/${destination.slug}` as any} className="group relative min-h-[220px] overflow-hidden rounded-2xl bg-[#D8C8B2]">
              {destination.image && <Image src={destination.image} alt={destination.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-white/75">{labels.destinationFallback}</p><h3 className="mt-1 font-serif text-xl font-bold text-white">{destination.name}</h3></div>
            </Link>)}
            {!featuredDestinations.length && <p className="col-span-full rounded-xl bg-white p-5 text-sm text-slate-600">{labels.catalogIntro}</p>}
          </div>
        </section>

        <section className="pb-14 sm:pb-16" aria-labelledby="about-trips-title">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><h2 id="about-trips-title" className="font-serif text-2xl font-bold text-[#181E4B] sm:text-3xl">{labels.tripsTitle}</h2><Link href="/circuits" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#B64F2E] hover:underline">{labels.allTrips}<ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTrips.map((tour) => <Link key={`${tour.type}-${tour.id}`} href={`${tour.type.toLowerCase().includes('excursion') ? '/excursions' : '/circuits'}/${tour.slug}` as any} className="group flex items-center justify-between gap-4 rounded-xl border border-[#E9DDCD] bg-white p-4 transition hover:border-[#DF6951]/50 hover:shadow-sm"><span className="min-w-0"><span className="block truncate text-sm font-bold text-[#181E4B] group-hover:text-[#B64F2E]">{tour.title}</span><span className="mt-1 block text-xs text-slate-500">{tour.days} {labels.duration} · {tour.nights} {labels.nights}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-[#B64F2E]" /></Link>)}
            {!featuredTrips.length && <p className="col-span-full rounded-xl bg-white p-5 text-sm text-slate-600">{labels.catalogIntro}</p>}
          </div>
        </section>
      </div>
      <TestimonialsSection locale={locale} />
    </div>
  );
}
