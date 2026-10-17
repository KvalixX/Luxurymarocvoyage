import type { Metadata } from 'next';
import { getTours } from '@/lib/queries/tours';
import { getDestinations } from '@/lib/queries/destinations';
import TourCard from '@/components/tours/TourCard';
import CircuitSidebarFilters from '@/components/tours/CircuitSidebarFilters';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Sparkles, LayoutGrid, Route, CarFront, Compass } from 'lucide-react';

const PAGE_SIZE = 9;

interface CircuitsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    destination?: string;
    duration?: string;
    nights?: string;
    type?: string;
    q?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Circuits Privés au Maroc | Désert du Sahara & Villes Impériales',
    en: 'Private Morocco Tours | Sahara Desert & Imperial Cities Itineraries',
    es: 'Circuitos Privados por Marruecos | Desierto del Sáhara y Ciudades Imperiales',
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez notre collection exclusive de circuits privés au Maroc. Itinéraires sur-mesure de 3 à 15 jours, riads de charme, campements de luxe à Merzouga et chauffeur VIP.',
    en: 'Explore our handpicked private tours across Morocco. Bespoke itineraries from 3 to 15 days, luxury desert camps in Erg Chebbi, private Mercedes chauffeurs, and expert Berber guides.',
    es: 'Descubra nuestros circuitos privados exclusivos por Marruecos. Itinerarios a medida de 3 a 15 días, campamentos de lujo en el Sáhara y chófer VIP.',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `${siteUrl}/${locale}/circuits`,
      languages: {
        fr: `${siteUrl}/fr/circuits`,
        en: `${siteUrl}/en/circuits`,
        es: `${siteUrl}/es/circuitos`,
      },
    },
  };
}

export default async function CircuitsPage({
  params,
  searchParams,
}: CircuitsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;

  const destinationId = sp.destination ? parseInt(sp.destination) : undefined;
  const currentPage = sp.page ? Math.max(1, parseInt(sp.page)) : 1;

  const [allTours, destinations] = await Promise.all([
    getTours(locale, {
      typeFilter: 'circuit',
      destinationId,
      limit: 100,
    }),
    getDestinations(locale),
  ]);

  // ── In-memory filtering ─────────────────────────────────────
  let filteredTours = allTours;

  // Duration (exact days)
  if (sp.duration) {
    const days = parseInt(sp.duration);
    filteredTours = filteredTours.filter((t) => t.days === days);
  }

  // Nights (exact)
  if (sp.nights) {
    const nights = parseInt(sp.nights);
    filteredTours = filteredTours.filter((t) => t.nights === nights);
  }

  // Type (group vs private) — use the tour.type field
  if (sp.type) {
    const types = sp.type.split(',');
    filteredTours = filteredTours.filter((t) => {
      const lower = (t.type || '').toLowerCase();
      return types.some((tp) =>
        tp === 'private' ? lower.includes('privé') || lower.includes('prive') || lower.includes('private') : lower.includes('group') || lower.includes('groupe')
      );
    });
  }

  // Keyword search
  if (sp.q) {
    const qLower = sp.q.toLowerCase();
    filteredTours = filteredTours.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        (t.departure && t.departure.toLowerCase().includes(qLower))
    );
  }

  // ── Pagination ──────────────────────────────────────────────
  const totalCount = filteredTours.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const breadcrumbs = [
    { label: locale === 'en' ? 'Tours' : locale === 'es' ? 'Circuitos' : 'Circuits' },
  ];

  const heroTranslations = {"fr":{"eyebrow":"Circuits signature","title":"Circuits privés au Maroc","subtitle":"Des voyages pensés autour de vous, avec chauffeur privé, belles adresses et étapes choisies à votre rythme.","features":["Itinéraire sur mesure","Chauffeur privé","Rythme flexible"],"label":"L’art du voyage privé","cardTitle":"Le Maroc, à votre façon","cardText":"Des médinas aux dunes du Sahara, composez un itinéraire qui vous ressemble.","places":["Marrakech","Haut Atlas","Sahara"],"action":"Créer mon circuit"},"en":{"eyebrow":"Signature journeys","title":"Private tours in Morocco","subtitle":"Journeys shaped around you, with a private driver, handpicked stays, and time to travel at your own pace.","features":["Tailor-made route","Private chauffeur","Flexible pace"],"label":"The private travel experience","cardTitle":"Morocco, your way","cardText":"From ancient medinas to Sahara dunes, shape a route that feels like yours.","places":["Marrakech","High Atlas","Sahara"],"action":"Plan my tour"},"es":{"eyebrow":"Viajes exclusivos","title":"Circuitos privados por Marruecos","subtitle":"Viajes diseñados para ti, con chófer privado, alojamientos seleccionados y tiempo para disfrutar a tu ritmo.","features":["Ruta a medida","Chófer privado","Ritmo flexible"],"label":"La experiencia privada","cardTitle":"Marruecos, a tu manera","cardText":"De las medinas antiguas a las dunas del Sáhara, crea una ruta propia.","places":["Marrakech","Alto Atlas","Sáhara"],"action":"Planear mi circuito"}};
  const heroCopy = locale === 'en' ? heroTranslations.en : locale === 'es' ? heroTranslations.es : heroTranslations.fr;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7] to-[#FAF8F5]">
      {/* ── Compact hero ──────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-[#E9DDCD] bg-[radial-gradient(ellipse_at_82%_18%,rgba(223,105,81,0.12),transparent_30%),linear-gradient(125deg,#FFFDF9_0%,#FBF4EA_55%,#F5E8D7_100%)]">
        <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#D8B67A]/25" />
        <div aria-hidden="true" className="absolute -right-4 -top-12 h-56 w-56 rounded-full border border-[#D8B67A]/20" />
        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-20 sm:px-6 sm:pb-6 lg:px-8 lg:pt-24">
          <Breadcrumbs items={breadcrumbs} locale={locale} />
          <div className="mt-3 grid items-center gap-3 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="section-eyebrow"><Sparkles className="h-3.5 w-3.5 text-[#DF6951]" /><span>{heroCopy.eyebrow}</span></div>
              <h1 className="max-w-3xl font-serif text-3xl font-bold leading-[1.08] tracking-tight text-[#181E4B] sm:text-4xl lg:text-[48px]">{heroCopy.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{heroCopy.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {heroCopy.features.map((feature, index) => {
                  const FeatureIcon = [Route, CarFront, Compass][index];
                  return <span key={feature} className="inline-flex items-center gap-2 rounded-full border border-[#E9DDCD] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#4B5563]"><FeatureIcon className="h-3.5 w-3.5 text-[#C87936]" />{feature}</span>;
                })}
              </div>
            </div>
            <div aria-hidden="true" className="hidden h-20 w-40 items-center justify-center lg:flex">
              <svg viewBox="0 0 160 80" fill="none" className="h-full w-full">
                <path d="M12 56C40 56 38 22 76 22s34 36 72 2" stroke="#C87936" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
                <circle cx="12" cy="56" r="5" fill="#DF6951" />
                <circle cx="76" cy="22" r="5" fill="#C87936" />
                <circle cx="148" cy="24" r="5" fill="#181E4B" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── E-commerce layout ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* LEFT SIDEBAR */}
          <CircuitSidebarFilters
            destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
            currentDestination={sp.destination}
            currentDuration={sp.duration}
            currentNights={sp.nights}
            currentType={sp.type}
            currentSearch={sp.q}
            totalCount={totalCount}
          />

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* ── Toolbar ─────────────────────────────────────── */}
            <div className="flex items-center justify-between bg-white border border-[#F0E6D8]/80 rounded-2xl px-5 py-3.5 mb-6 shadow-xs gap-3 flex-wrap">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-[#181E4B]">{totalCount}</span>{' '}
                circuit{totalCount !== 1 ? 's' : ''} trouvé{totalCount !== 1 ? 's' : ''}{' '}
                {totalPages > 1 && (
                  <span className="text-slate-400">
                    — Page {currentPage} sur {totalPages}
                  </span>
                )}
              </p>
              {/* View toggle (decorative, grid is default) */}
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                  title="Vue grille"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title="Vue liste"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Tour Grid ───────────────────────────────────── */}
            {paginatedTours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedTours.map((tour, index) => (
                    <TourCard key={tour.id} tour={tour} locale={locale} index={index} />
                  ))}
                </div>

                {/* ── Pagination ──────────────────────────────── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const params = new URLSearchParams();
                      if (sp.destination) params.set('destination', sp.destination);
                      if (sp.duration) params.set('duration', sp.duration);
                      if (sp.nights) params.set('nights', sp.nights);
                      if (sp.type) params.set('type', sp.type);
                      if (sp.q) params.set('q', sp.q);
                      params.set('page', String(p));
                      return (
                        <a
                          key={p}
                          href={`?${params.toString()}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                            p === currentPage
                              ? 'bg-terracotta-500 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-terracotta-300 hover:text-terracotta-600'
                          }`}
                        >
                          {p}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-white p-12 text-center border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 mb-2">
                  Aucun circuit ne correspond à vos critères.
                </p>
                <p className="text-xs text-slate-500 mb-5">
                  Modifiez les filtres ou contactez nos experts pour un itinéraire sur-mesure.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Contacter un expert
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
