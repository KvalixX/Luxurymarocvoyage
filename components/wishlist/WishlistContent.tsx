'use client';

import { Heart, Trash2 } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLocale } from 'next-intl';
import TourCard from '@/components/tours/TourCard';
import type { Tour } from '@/lib/queries/tours';
import { useWishlist } from './WishlistProvider';

export default function WishlistContent() {
  const locale = useLocale();
  const { items, ready, clear } = useWishlist();
  const fr = locale === 'fr';
  const es = locale === 'es';
  const copy = fr
    ? { title: 'Vos voyages favoris', intro: 'Gardez ici les circuits et excursions qui vous intéressent pour les retrouver facilement.', saved: 'Enregistrés dans ce navigateur. Revenez avec le même appareil et le même navigateur pour les retrouver.', empty: 'Votre liste est encore vide', emptyText: 'Touchez le cœur sur un circuit ou une excursion pour l’ajouter à vos favoris.', exploreCircuits: 'Découvrir les circuits', exploreExcursions: 'Voir les excursions', clear: 'Tout effacer', loading: 'Chargement de vos favoris…' }
    : es
      ? { title: 'Tus viajes favoritos', intro: 'Guarda aquí los circuitos y excursiones que te interesan para encontrarlos fácilmente.', saved: 'Guardados en este navegador. Vuelve con el mismo dispositivo y navegador para encontrarlos.', empty: 'Tu lista está vacía', emptyText: 'Pulsa el corazón de un circuito o excursión para añadirlo a favoritos.', exploreCircuits: 'Ver circuitos', exploreExcursions: 'Ver excursiones', clear: 'Borrar todo', loading: 'Cargando tus favoritos…' }
      : { title: 'Your travel wishlist', intro: 'Save the tours and excursions you like here so you can find them again easily.', saved: 'Saved in this browser. Return with the same device and browser to find your wishlist again.', empty: 'Your wishlist is empty', emptyText: 'Tap the heart on any tour or excursion to save it here.', exploreCircuits: 'Explore tours', exploreExcursions: 'Browse excursions', clear: 'Clear all', loading: 'Loading your wishlist…' };

  return (
    <div className="min-h-screen bg-[#FCFAF7] pb-16 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-[#E9DDCD] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FCF0EA] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B64F2E]"><Heart className="h-3.5 w-3.5 fill-current" />Luxury Maroc Voyage</div>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#181E4B] sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{copy.intro}</p>
          </div>
          {ready && items.length > 0 && <button type="button" onClick={clear} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9DDCD] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-700"><Trash2 className="h-4 w-4" />{copy.clear}</button>}
        </header>

        <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#E9DDCD] bg-white p-4 text-sm leading-6 text-slate-600">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#B64F2E]" />
          <p>{copy.saved}</p>
        </div>

        {!ready ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">{copy.loading}</p>
        ) : items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#DCCBB7] bg-white px-6 py-14 text-center sm:py-20">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FCF0EA] text-[#B64F2E]"><Heart className="h-6 w-6" /></span>
            <h2 className="mt-5 font-serif text-2xl font-bold text-[#181E4B]">{copy.empty}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{copy.emptyText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/circuits" className="rounded-xl bg-[#B64F2E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#984126]">{copy.exploreCircuits}</Link>
              <Link href="/excursions" className="rounded-xl border border-[#E9DDCD] bg-white px-5 py-3 text-sm font-bold text-[#181E4B] transition hover:border-[#DF6951]">{copy.exploreExcursions}</Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, index) => {
              const tour: Tour = {
                id: item.id,
                image: item.image,
                title: item.title,
                days: item.days,
                nights: item.nights,
                type: item.type,
                departure: item.departure,
                rating: item.rating,
                reviews: item.reviews,
                clicks: item.clicks,
                exceptional: item.exceptional,
                promotion: item.promotion,
                slug: item.slug,
                gallery: item.gallery,
                destinationId: item.destinationId,
                updatedAt: item.updatedAt,
              };
              return <TourCard key={item.key} tour={tour} locale={locale} isExcursion={item.kind === 'excursion'} index={index} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
