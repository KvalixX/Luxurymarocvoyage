'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Star } from 'lucide-react';

interface TestimonialsSectionProps { locale: string }

const googleReviews = [
  { name: 'Sophie Martin', monthsAgo: 12, initials: 'SM', text: 'Nous avons vécu une expérience inoubliable en famille dans le sud du Maroc grâce à l’agence Luxury Maroc Voyage. Tout était parfaitement organisé du début à la fin : les hébergements, les visites, les paysages à couper le souffle…' },
  { name: 'Claire Dubois', monthsAgo: 9, initials: 'CD', text: 'Nous sommes partis en famille 10 jours, organisation last minute pendant la CAN et ils ont été super, le chauffeur au top, on a parcouru tout le nord du Maroc. Ils sont très pro et communiqué rapidement.' },
  { name: 'Émilie Laurent', monthsAgo: 12, initials: 'ÉL', text: 'J’ai récemment voyagé avec cette agence et je suis ravie de leur service. Tout était parfaitement organisé, du choix des destinations aux hébergements. Mention spéciale à Hamid, notre guide passionné, et à Yousef, notre chauffeur…' },
  { name: 'Laura Bernard', monthsAgo: 12, initials: 'LB', text: 'Il y a des voyages que l’on rêve de faire un jour… et puis il y a ceux qui dépassent toutes nos attentes. Grâce à Luxury Maroc Voyage, nous avons vécu une aventure extraordinaire à travers le Maroc sauvage, un circuit privé en 4x4…' },
  { name: 'Thomas Moreau', monthsAgo: 2, edited: true, initials: 'TM', text: 'Je recommande vivement Luxury Maroc Voyage. Si vous venez à Marrakech et que vous recherchez la tranquillité d’esprit, la gentillesse et un service irréprochable, n’hésitez pas à faire appel à cette agence. Merci beaucoup.' },
  { name: 'Lucas Petit', monthsAgo: 12, initials: 'LP', text: 'J’ai vécu une expérience exceptionnelle avec Luxury Maroc Voyages lors de mon voyage de 7 jours au départ de Marrakech avec mes amis. Tout était parfaitement organisé : des hébergements confortables, un programme riche et varié…' },
  { name: 'Emma Lefèvre', monthsAgo: 12, initials: 'EL', text: 'Super expérience avec l’agence ! Nous avons passé un séjour inoubliable grâce à cette agence. L’organisation était parfaite du début à la fin, les guides très professionnels et chaleureux…' },
  { name: 'Julien Michel', monthsAgo: 12, initials: 'JM', text: 'Une expérience exceptionnelle à Marrakech avec Luxury Maroc Voyage. Tout était parfaitement organisé, du dîner inoubliable sous les étoiles dans le désert d’Agafay au vol en montgolfière au lever du soleil…' },
];
const avatarColors = ['#4285F4', '#EA4335', '#34A853', '#A142F4', '#FBBC04', '#00ACC1', '#F06292', '#5F6368'];

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const fr = locale === 'fr';
  const es = locale === 'es';
  const labels = fr
    ? { agencyTitle: 'Luxury Maroc Voyage sur TripAdvisor', location: 'Marrakech, Maroc', profile: 'Découvrez notre agence, nos circuits privés et nos excursions au départ de Marrakech.', tripAdvisor: 'Voir la fiche TripAdvisor', reviewTitle: 'Avis Google de nos voyageurs', reviewSub: 'Quelques avis partagés par nos voyageurs sur Google.', google: 'Lire les avis sur Google', previous: 'Avis précédents', next: 'Avis suivants' }
    : es
      ? { agencyTitle: 'Luxury Maroc Voyage en TripAdvisor', location: 'Marrakech, Marruecos', profile: 'Descubre nuestra agencia, nuestros circuitos privados y excursiones desde Marrakech.', tripAdvisor: 'Ver perfil en TripAdvisor', reviewTitle: 'Opiniones de viajeros en Google', reviewSub: 'Algunas opiniones compartidas por nuestros viajeros en Google.', google: 'Leer opiniones en Google', previous: 'Opiniones anteriores', next: 'Opiniones siguientes' }
      : { agencyTitle: 'Luxury Maroc Voyage on TripAdvisor', location: 'Marrakech, Morocco', profile: 'Discover our agency, private Morocco tours, and day excursions from Marrakech.', tripAdvisor: 'View our TripAdvisor profile', reviewTitle: 'Google reviews from our travelers', reviewSub: 'A selection of reviews shared by our travelers on Google.', google: 'Read our reviews on Google', previous: 'Previous reviews', next: 'Next reviews' };

  const moveSlider = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector<HTMLElement>('[data-review-card]');
    slider.scrollBy({ left: (direction === 'right' ? 1 : -1) * ((card?.offsetWidth ?? 340) + 16), behavior: 'smooth' });
  };

  const tripAdvisorUrl = 'https://www.tripadvisor.fr/Attraction_Review-g293734-d32981818-Reviews-Luxury_Maroc_Voyage-Marrakech_Marrakech_Safi.html';
  const googleUrl = 'https://www.google.com/maps/search/?api=1&query=Luxury+Maroc+Voyage+Marrakech';
  const formatReviewDate = (monthsAgo: number, edited = false) => {
    const relative = fr
      ? monthsAgo >= 12 ? 'il y a un an' : `il y a ${monthsAgo} mois`
      : es
        ? monthsAgo >= 12 ? 'hace un año' : `hace ${monthsAgo} meses`
        : monthsAgo >= 12 ? '1 year ago' : `${monthsAgo} months ago`;
    if (!edited) return relative;
    return fr ? `Modifié ${relative}` : es ? `Editado ${relative}` : `Edited ${relative}`;
  };

  return (
    <section className="border-y border-[#E7E7E7] bg-[#F7F7F7] py-12 sm:py-16 lg:py-20" aria-labelledby="traveler-reviews-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="mb-9 border border-[#34E27A] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-4"><img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Tripadvisor" width="170" height="36" className="h-9 w-auto" /></div>
              <h2 className="text-xl font-bold text-[#181E4B] underline decoration-[#34E27A] decoration-2 underline-offset-4 sm:text-2xl">{labels.agencyTitle}</h2>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-600"><MapPin className="h-3.5 w-3.5" />{labels.location}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">{labels.profile}</p>
            </div>
            <a href={tripAdvisorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#00AA6C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#008F5B]">{labels.tripAdvisor}<ExternalLink className="h-4 w-4" /></a>
          </div>
        </article>

        <header className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow"><img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="" width="18" height="18" className="h-[18px] w-[18px]" /><span>{fr ? 'Avis Google' : es ? 'Opiniones de Google' : 'Google reviews'}</span></p>
            <h2 id="traveler-reviews-title" className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#181E4B] sm:text-3xl">{labels.reviewTitle}</h2>
            <p className="mt-1.5 text-sm text-slate-600">{labels.reviewSub}</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button type="button" onClick={() => moveSlider('left')} aria-label={labels.previous} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#4285F4] hover:text-[#4285F4]"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => moveSlider('right')} aria-label={labels.next} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#4285F4] hover:text-[#4285F4]"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </header>

        <div ref={sliderRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {googleReviews.map((review, index) => (
            <article data-review-card key={review.name} className="flex min-h-[235px] w-[min(88vw,360px)] shrink-0 snap-start flex-col rounded-2xl bg-[#F1F3F4] p-5 sm:w-[365px] sm:p-6">
              <div className="flex items-start gap-3">
                <div aria-hidden="true" style={{ backgroundColor: avatarColors[index % avatarColors.length] }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white">{review.initials[0]}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{review.name}</p><p className="mt-0.5 text-xs text-slate-500">{formatReviewDate(review.monthsAgo, review.edited)}</p></div>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white"><img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" width="24" height="24" className="h-6 w-6" /></span>
              </div>
              <div className="my-3 flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} className="h-[18px] w-[18px] fill-[#F4B400] text-[#F4B400]" />)}</div>
              <p className="flex-1 text-[13px] leading-5 text-slate-800">{review.text}</p>
              <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="mt-3 w-fit text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-[#1A73E8]">{labels.google}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}




