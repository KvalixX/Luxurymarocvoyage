import { Link } from '@/lib/i18n/navigation';
import Image from 'next/image';
import { Compass, Mail, MapPin } from 'lucide-react';
import type { Tour } from '@/lib/queries/tours';
import type { Destination } from '@/lib/queries/destinations';
import type { Event } from '@/lib/queries/events';
import type { Article } from '@/lib/queries/articles';

interface FooterProps {
  locale: string;
  circuits: Tour[];
  excursions: Tour[];
  destinations: Destination[];
  events: Event[];
  articles: Article[];
}

export default function Footer({ locale, circuits, excursions, destinations, events, articles }: FooterProps) {
  const fr = locale === 'fr';
  const es = locale === 'es';
  const text = fr
    ? {
        tagline: 'Circuits privés au Maroc, excursions depuis Marrakech et voyages sur mesure vers le Sahara, les villes impériales et les côtes atlantiques.',
        company: 'Luxurymarocvoyage', tours: 'Circuits privés au Maroc', excursions: 'Excursions au Maroc',
        destinations: 'Destinations marocaines', explore: 'Événements et guides de voyage',
        allTours: 'Voir tous les circuits privés', allExcursions: 'Voir toutes les excursions',
        allDestinations: 'Explorer toutes les destinations', allEvents: 'Événements au Maroc',
        allArticles: 'Conseils pour voyager au Maroc', ideas: 'Explorer le Maroc : idées de voyage',
        contact: 'Contact', about: 'À propos', rights: 'Tous droits réservés', home: 'Accueil', legal: 'Liens utiles',
        sahara: 'Circuit privé dans le désert du Sahara', dayTrips: 'Excursions à la journée depuis Marrakech',
      }
    : es
      ? {
          tagline: 'Circuitos privados por Marruecos, excursiones desde Marrakech y viajes a medida al Sáhara, las ciudades imperiales y la costa atlántica.',
          company: 'Luxurymarocvoyage', tours: 'Circuitos privados por Marruecos', excursions: 'Excursiones en Marruecos',
          destinations: 'Destinos de Marruecos', explore: 'Eventos y guías de viaje',
          allTours: 'Ver todos los circuitos privados', allExcursions: 'Ver todas las excursiones',
          allDestinations: 'Explorar todos los destinos', allEvents: 'Eventos en Marruecos',
          allArticles: 'Consejos para viajar a Marruecos', ideas: 'Explora Marruecos: ideas de viaje',
          contact: 'Contacto', about: 'Sobre nosotros', rights: 'Todos los derechos reservados', home: 'Inicio', legal: 'Enlaces útiles',
          sahara: 'Circuito privado por el desierto del Sáhara', dayTrips: 'Excursiones de un día desde Marrakech',
        }
      : {
          tagline: 'Private Morocco tours, day trips from Marrakech, and tailor-made journeys to the Sahara, imperial cities, and Atlantic coast.',
          company: 'Luxurymarocvoyage', tours: 'Private Morocco tours', excursions: 'Morocco day trips & excursions',
          destinations: 'Places to visit in Morocco', explore: 'Morocco events & travel guides',
          allTours: 'Browse all private Morocco tours', allExcursions: 'Browse all Morocco excursions',
          allDestinations: 'Explore all Morocco destinations', allEvents: 'Cultural events in Morocco',
          allArticles: 'Morocco travel tips and guides', ideas: 'Explore Morocco: trip ideas',
          contact: 'Contact', about: 'About us', rights: 'All rights reserved', home: 'Home', legal: 'Helpful links',
          sahara: 'Private Sahara Desert tours', dayTrips: 'Day trips from Marrakech',
        };

  const columns = [
    { title: text.company, links: [{ label: text.home, href: '/' }, { label: text.about, href: '/about' }, { label: text.contact, href: '/contact' }] },
    { title: text.tours, links: [{ label: text.allTours, href: '/circuits' }, ...circuits.slice(0, 4).map((tour) => ({ label: tour.title, href: `/circuits/${tour.slug}` }))] },
    { title: text.excursions, links: [{ label: text.allExcursions, href: '/excursions' }, ...excursions.slice(0, 3).map((tour) => ({ label: tour.title, href: `/excursions/${tour.slug}` }))] },
    { title: text.destinations, links: [{ label: text.allDestinations, href: '/destinations' }, ...destinations.slice(0, 5).map((destination) => ({ label: destination.name, href: `/destinations/${destination.slug}` }))] },
    { title: text.explore, links: [{ label: text.allEvents, href: '/events' }, ...events.slice(0, 2).map((event) => ({ label: event.title, href: `/events/${event.slug}` })), { label: text.allArticles, href: '/blog' }, ...articles.slice(0, 2).map((article) => ({ label: article.title, href: `/blog/${article.slug}` }))] },
  ];
  const ideaLinks = [
    { label: text.sahara, href: '/circuits' },
    { label: text.dayTrips, href: '/excursions' },
    ...destinations.slice(0, 3).map((destination) => ({
      label: fr ? `Voyage à ${destination.name}` : es ? `Viaje a ${destination.name}` : `Travel guide to ${destination.name}`,
      href: `/destinations/${destination.slug}`,
    })),
  ];

  return (
    <footer className="bg-[#181E4B] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-x-7 gap-y-9 sm:grid-cols-3 lg:grid-cols-[1.25fr_repeat(5,minmax(0,1fr))] lg:gap-x-7">
          <div className="col-span-2 max-w-sm sm:col-span-1">
            <Link href="/" aria-label="Luxury Maroc Voyage home" className="mb-6 inline-flex">
              <Image src="/logos/logo2-Photoroom.png" alt="Luxury Maroc Voyage" width={743} height={439} className="h-auto w-[78px]" />
            </Link>
            <p className="text-sm leading-relaxed text-[#D7D9E7]">{text.tagline}</p>
            <div className="mt-5 flex gap-2.5">
              <a href="mailto:contact@luxurymarocvoyage.com" aria-label="Email Luxury Maroc Voyage" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><Mail className="h-4 w-4" /></a>
              <Link href="/blog" aria-label={text.allArticles} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><Compass className="h-4 w-4" /></Link>
              <Link href="/destinations" aria-label={text.allDestinations} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><MapPin className="h-4 w-4" /></Link>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="min-w-0">
              <h2 className="mb-4 font-serif text-base font-bold text-white">{column.title}</h2>
              <ul className="space-y-3">
                {column.links.map((item) => <li key={`${item.label}-${item.href}`}><Link href={item.href as any} className="text-sm leading-snug text-[#D7D9E7] transition-colors hover:text-white">{item.label}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>

        <section className="mt-10 border-t border-white/10 pt-7">
          <h2 className="mb-4 font-serif text-lg font-bold">{text.ideas}</h2>
          <div className="flex flex-wrap gap-2">
            {ideaLinks.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href as any} className="rounded-md border border-white/15 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-[#D7D9E7] transition hover:border-white/30 hover:bg-white/10 hover:text-white">{item.label}</Link>)}
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-[#AEB3CA] sm:flex-row">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} LuxuryMarocVoyage. {text.rights}</p>
          <nav aria-label={text.legal} className="flex gap-5">
            <Link href="/about" className="transition hover:text-white">{text.about}</Link>
            <Link href="/contact" className="transition hover:text-white">{text.contact}</Link>
            <Link href="/faq" className="transition hover:text-white">FAQ</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
