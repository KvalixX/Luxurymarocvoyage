import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/seo/urls';
import { getTours } from '@/lib/queries/tours';
import { getDestinations } from '@/lib/queries/destinations';
import TourResults from '@/components/tours/TourResults';
import CircuitSidebarFilters from '@/components/tours/CircuitSidebarFilters';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Sparkles, SortAsc, MapPin, CarFront, Clock3 } from 'lucide-react';

const PAGE_SIZE = 12;

interface ExcursionsPageProps {
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
    fr: "Excursions au Maroc d'une Journée | Au Départ de Marrakech & Fès",
    en: 'Morocco Day Trips & Excursions | Marrakech & Fes Departures',
    es: 'Excursiones de un Día por Marruecos | Salidas desde Marrakech y Fez',
  };

  const descriptions: Record<string, string> = {
    fr: "Découvrez nos excursions d'une journée au départ de Marrakech : Vallée de l'Ourika, Cascades d'Ouzoud, Essaouira et désert d'Agafay en véhicule privé.",
    en: 'Handcrafted day trips departing from Marrakech and Fes: Ourika Valley, Ouzoud Waterfalls, coastal Essaouira, and sunset Agafay desert with private driver.',
    es: 'Excursiones de un día desde Marrakech: Valle de Ourika, Cascadas de Ouzoud, Essaouira y desierto de Agafay en vehículo privado con conductor.',
  };


  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: localizedAlternates(locale, '/excursions'),
  };
}

export default async function ExcursionsPage({
  params,
  searchParams,
}: ExcursionsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;

  const destinationId = sp.destination ? parseInt(sp.destination) : undefined;
  const currentPage = sp.page ? Math.max(1, parseInt(sp.page)) : 1;

  const [allExcursions, destinations] = await Promise.all([
    getTours(locale, {
      typeFilter: 'excursion',
      destinationId,
      limit: 100,
    }),
    getDestinations(locale),
  ]);

  // ── In-memory filtering ─────────────────────────────────
  let filtered = allExcursions;

  if (sp.duration) {
    filtered = filtered.filter((tour) => tour.days === Number(sp.duration));
  }

  if (sp.nights) {
    filtered = filtered.filter((tour) => tour.nights === Number(sp.nights));
  }

  if (sp.type) {
    const types = sp.type.split(',');
    filtered = filtered.filter((tour) => {
      const type = (tour.type || '').toLowerCase();
      return types.some((selected) =>
        selected === 'private'
          ? type.includes('privé') || type.includes('prive') || type.includes('private')
          : type.includes('group') || type.includes('groupe')
      );
    });
  }

  if (sp.q) {
    const qLower = sp.q.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        (t.departure && t.departure.toLowerCase().includes(qLower))
    );
  }

  if (sp.destination && !destinationId) {
    // already handled via query
  }

  // ── Pagination ──────────────────────────────────────────
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const breadcrumbs = [
    {
      label:
        locale === 'en' ? 'Excursions' : locale === 'es' ? 'Excursiones' : 'Excursions',
    },
  ];

  const hasActiveFilters = !!(sp.destination || sp.duration || sp.nights || sp.type || sp.q);

  const heroTranslations = {"fr":{"eyebrow":"Échappées privées","title":"Excursions au départ de Marrakech","subtitle":"Une journée pour changer de décor : montagne, villages berbères, côte Atlantique ou désert, avec prise en charge privée.","features":["Départ depuis votre hébergement","Transport privé","Une journée à votre rythme"],"label":"Votre prochaine escapade","cardTitle":"Prenez la route","cardText":"Choisissez une destination, nous préparons la journée et le trajet.","places":["Vallée de l’Ourika","Essaouira","Désert d’Agafay"],"action":"Organiser une excursion"},"en":{"eyebrow":"Private day escapes","title":"Day trips from Marrakech","subtitle":"Change the scenery for a day: mountain valleys, Berber villages, the Atlantic coast, or the desert, with private pickup.","features":["Pickup from your stay","Private transport","A day at your pace"],"label":"Your next escape","cardTitle":"Take the scenic route","cardText":"Choose a destination and we’ll help arrange the day and the drive.","places":["Ourika Valley","Essaouira","Agafay Desert"],"action":"Plan a day trip"},"es":{"eyebrow":"Escapadas privadas","title":"Excursiones desde Marrakech","subtitle":"Cambia de paisaje por un día: valles de montaña, pueblos bereberes, costa atlántica o desierto, con recogida privada.","features":["Recogida en tu alojamiento","Transporte privado","Un día a tu ritmo"],"label":"Tu próxima escapada","cardTitle":"Sal a descubrir","cardText":"Elige un destino y te ayudamos a organizar el día y el trayecto.","places":["Valle de Ourika","Essaouira","Desierto de Agafay"],"action":"Organizar excursión"}};
  const heroCopy = locale === 'en' ? heroTranslations.en : locale === 'es' ? heroTranslations.es : heroTranslations.fr;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7] to-[#FAF8F5]">
      {/* ── Compact hero header ───────────────────────────── */}
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
                  const FeatureIcon = [MapPin, CarFront, Clock3][index];
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

      {/* ── E-commerce layout ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* LEFT SIDEBAR — reuse circuit sidebar (no duration/nights for excursions) */}
          <CircuitSidebarFilters
            destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
            locale={locale}
            currentDestination={sp.destination}
            currentDuration={sp.duration}
            currentNights={sp.nights}
            currentType={sp.type}
            currentSearch={sp.q}
            totalCount={totalCount}
            durationOptions={allExcursions.map((tour) => tour.days)}
            nightOptions={allExcursions.map((tour) => tour.nights)}
            excursionMode={true}
          />

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white border border-[#F0E6D8]/80 rounded-2xl px-5 py-3.5 mb-6 shadow-xs gap-3 flex-wrap">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-[#181E4B]">{totalCount}</span>{' '}
                excursion{totalCount !== 1 ? 's' : ''} trouvée{totalCount !== 1 ? 's' : ''}{' '}
                {totalPages > 1 && (
                  <span className="text-slate-400">
                    — Page {currentPage} sur {totalPages}
                  </span>
                )}
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-50 text-[#DF6951] text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                    Filtrées
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <SortAsc className="w-3.5 h-3.5" />
                <span>Les plus populaires en premier</span>
              </div>
            </div>

            {/* Grid */}
            {paginated.length > 0 ? (
              <>
                <TourResults tours={paginated} locale={locale} isExcursion />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const urlParams = new URLSearchParams();
                      if (sp.destination) urlParams.set('destination', sp.destination);
                      if (sp.duration) urlParams.set('duration', sp.duration);
                      if (sp.nights) urlParams.set('nights', sp.nights);
                      if (sp.type) urlParams.set('type', sp.type);
                      if (sp.q) urlParams.set('q', sp.q);
                      urlParams.set('page', String(p));
                      return (
                        <a
                          key={p}
                          href={`?${urlParams.toString()}`}
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
                  Aucune excursion ne correspond à vos critères.
                </p>
                <p className="text-xs text-slate-500 mb-5">
                  Contactez nos experts pour une excursion personnalisée.
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
