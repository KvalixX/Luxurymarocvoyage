import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import {
  Compass,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-morocco-dark text-sand-100 pt-16 pb-10 border-t border-sand-800/40 relative overflow-hidden">
      {/* Top ambient luxury hairline transition */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DF6951]/60 to-transparent" />

      {/* Decorative background star glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-terracotta-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-sand-500 text-morocco-dark flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 shadow-md">
                <Compass className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Luxury<span className="text-terracotta-400">Maroc</span>Voyage
              </span>
            </Link>

            <p className="text-sand-300 text-sm leading-relaxed max-w-sm">
              {t('tagline')}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-sand-200">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <Award className="w-4 h-4 text-sand-400 shrink-0" />
                <span>Guides Officiels Agréés</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Véhicules Mercedes VIP</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-sand-400 shrink-0" />
                <span>Assistance Concierge 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <Sparkles className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>100% Itinéraires Sur-Mesure</span>
              </div>
            </div>
          </div>

          {/* Col 2: Circuits & Excursions */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              {t('ourCircuits')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-sand-300">
              <li>
                <Link
                  href="/circuits"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Grand Tour du Maroc
                </Link>
              </li>
              <li>
                <Link
                  href="/circuits"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Circuit Désert Merzouga & Erg Chebbi
                </Link>
              </li>
              <li>
                <Link
                  href="/circuits"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Villes Impériales & Médinas
                </Link>
              </li>
              <li>
                <Link
                  href="/circuits"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Vallée du Dadès & Gorges du Todra
                </Link>
              </li>
              <li>
                <Link
                  href="/circuits"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Oasis du Sud & Kasbahs
                </Link>
              </li>
              <li>
                <Link
                  href="/circuits"
                  className="text-terracotta-400 font-medium hover:underline pt-1 inline-block"
                >
                  Tous les circuits privés →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Excursions & Destinations */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              {t('ourExcursions')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-sand-300">
              <li>
                <Link
                  href="/excursions"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Excursion Vallée de l&apos;Ourika
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Cascades d&apos;Ouzoud
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Essaouira & Côte Atlantique
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Désert d&apos;Agafay au Coucher du Soleil
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Kasbah Aït Ben Haddou
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="text-terracotta-400 font-medium hover:underline pt-1 inline-block"
                >
                  Toutes les excursions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Marrakech Agency */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              {t('contactInfo')}
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-sand-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sand-400 shrink-0" />
                <a
                  href="tel:+212600000000"
                  className="hover:text-white transition-colors"
                >
                  {t('phone')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sand-400 shrink-0" />
                <a
                  href="mailto:contact@luxurymarocvoyage.com"
                  className="hover:text-white transition-colors"
                >
                  {t('email')}
                </a>
              </li>
            </ul>

            <div className="mt-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-morocco-dark bg-gradient-to-r from-sand-300 via-sand-400 to-sand-300 hover:from-sand-400 hover:to-sand-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-center w-full"
              >
                {tNav('customTrip')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <p>
            © {currentYear} Luxurymarocvoyage. {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-sand-200 transition-colors">
              {tNav('about')}
            </Link>
            <Link href="/contact" className="hover:text-sand-200 transition-colors">
              {tNav('contact')}
            </Link>
            <Link href="/faq" className="hover:text-sand-200 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
