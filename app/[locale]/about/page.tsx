import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Compass, Award, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'À Propos de Luxurymarocvoyage | Notre Histoire & Philosophie',
    en: 'About Luxurymarocvoyage | Our Story, Values & Local Roots',
    es: 'Sobre Nosotros | Historia y Filosofía de Luxurymarocvoyage',
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez Luxurymarocvoyage, agence réceptive de prestige à Marrakech. Notre équipe de guides berbères et experts locaux façonne des voyages sur-mesure d’exception.',
    en: 'Learn about Luxurymarocvoyage, Marrakech-based destination management company specializing in bespoke private tours, luxury desert camps, and authentic Moroccan travel.',
    es: 'Conozca Luxurymarocvoyage, agencia de élite en Marrakech dedicada a crear viajes privados y experiencias exclusivas por todo Marruecos.',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxurymarocvoyage.com';

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        fr: `${siteUrl}/fr/a-propos`,
        en: `${siteUrl}/en/about`,
        es: `${siteUrl}/es/sobre-nosotros`,
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  const breadcrumbs = [
    {
      label:
        locale === 'en'
          ? 'About Us'
          : locale === 'es'
          ? 'Sobre Nosotros'
          : 'À Propos',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-morocco-cream min-h-screen">
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-sand-600" />
            <span>Notre Philosophie & Savoir-Faire</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-morocco-dark tracking-tight">
            L&apos;Artisanat du Voyage d&apos;Exception au Maroc
          </h1>
          <p className="mt-4 text-sand-800 text-sm sm:text-base leading-relaxed">
            Née de la passion commune d’experts natifs de Marrakech et du désert du Sahara, notre agence réceptive conçoit chaque itinéraire comme une pièce unique d’orfèvrerie.
          </p>
        </div>

        {/* Dual Banner Image + Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-sand-200">
            <Image
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
              alt="Désert du Maroc et hospitalité berbère"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-morocco-dark">
              Une Vision Authentique du Luxe
            </h2>
            <p className="text-sm text-sand-900 leading-relaxed">
              Pour nous, le vrai luxe ne réside pas dans l’ostentation, mais dans l’exclusivité du moment, la beauté d’un silence sous la voûte étoilée du Sahara, la rencontre privilégiée avec un artisan des médinas ou le confort feutré d’un riad historique privatisé.
            </p>
            <p className="text-sm text-sand-900 leading-relaxed">
              Nous sélectionnons chaque chauffeur, chaque guide certifié et chaque hébergement selon des critères d’excellence rigoureux. Nous garantissons une disponibilité 24/7 pour que votre voyage se déroule avec une fluidité absolue.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-sand-200">
                <span className="font-serif text-3xl font-bold text-terracotta-600 block">
                  +12 ans
                </span>
                <span className="text-xs text-sand-700 font-semibold mt-1 block">
                  D&apos;expertise sur le terrain marocain
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-sand-200">
                <span className="font-serif text-3xl font-bold text-sand-600 block">
                  100%
                </span>
                <span className="text-xs text-sand-700 font-semibold mt-1 block">
                  Itinéraires privés sur-mesure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="rounded-3xl bg-white border border-sand-200 p-8 sm:p-12 shadow-sm mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-morocco-dark">
              Nos Engagements Fondamentaux
            </h2>
            <p className="text-xs sm:text-sm text-sand-800 mt-2">
              Ce qui guide chacune de nos créations de voyage au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-morocco-dark">
                Guides Officiels & Éthique
              </h3>
              <p className="text-xs text-sand-800 leading-relaxed">
                Rémunération équitable des guides et équipes locales berbères, valorisation des artisans traditionnels et respect scrupuleux du patrimoine.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sand-50 text-sand-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-morocco-dark">
                Sécurité & Flotte VIP
              </h3>
              <p className="text-xs text-sand-800 leading-relaxed">
                Véhicules récents Mercedes Classe V et 4x4 Prado entretenus régulièrement, chauffeurs formés à la conduite préventive en montagne et désert.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-morocco-dark">
                Hospitalité Chaleureuse
              </h3>
              <p className="text-xs text-sand-800 leading-relaxed">
                Un accueil sincère hérité des traditions millénaires d&apos;hospitalité marocaine. Vous arrivez en voyageur, vous repartez en ami.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-morocco-dark via-morocco-charcoal to-morocco-dark text-white">
          <h2 className="font-serif text-3xl font-bold mb-3">
            Envie de Vivre l&apos;Expérience Marocaine ?
          </h2>
          <p className="text-sand-300 text-sm max-w-xl mx-auto mb-8">
            Contactez notre équipe de concepteurs de voyage pour échanger sur vos envies et recevoir une proposition sur-mesure.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all inline-block"
          >
            Créer Mon Voyage Sur-Mesure
          </Link>
        </div>
      </div>
    </div>
  );
}
