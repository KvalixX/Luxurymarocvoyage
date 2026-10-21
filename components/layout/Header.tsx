'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import type { Tour } from '@/lib/queries/tours';
import type { Destination } from '@/lib/queries/destinations';
import type { Event } from '@/lib/queries/events';
import type { Article } from '@/lib/queries/articles';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

interface HeaderProps {
  circuits?: Tour[];
  excursions?: Tour[];
  destinations?: Destination[];
  events?: Event[];
  articles?: Article[];
}

export default function Header({ circuits = [], excursions = [], destinations = [], events = [], articles = [] }: HeaderProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const routeParams = useParams<Record<string, string | string[]>>();
  const { items: wishlistItems, ready: wishlistReady } = useWishlist();
  const wishlistLabel = locale === 'fr' ? 'Favoris' : locale === 'es' ? 'Favoritos' : 'Wishlist';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: 'fr' | 'en' | 'es') => {
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace({ pathname, params: routeParams } as any, { locale: newLocale });
  };

  const navLinks = [
    { href: '/' as any, key: 'home', label: t('home'), hasDropdown: false },
    { href: '/circuits' as any, key: 'circuits', label: t('circuits'), hasDropdown: true },
    { href: '/excursions' as any, key: 'excursions', label: t('excursions'), hasDropdown: true },
    { href: '/destinations' as any, key: 'destinations', label: t('destinations'), hasDropdown: true },
    { href: '/events' as any, key: 'events', label: t('events'), hasDropdown: true },
    { href: '/blog' as any, key: 'blog', label: t('blog'), hasDropdown: true },
    { href: '/contact' as any, key: 'contact', label: t('contact'), hasDropdown: false },
  ];

  const labels = locale === 'fr'
    ? { allCircuits: 'Circuits privés au Maroc', allExcursions: 'Excursions au Maroc', allDestinations: 'Destinations du Maroc', allEvents: 'Événements au Maroc', allArticles: 'Guides de voyage au Maroc' }
    : locale === 'es'
      ? { allCircuits: 'Circuitos privados por Marruecos', allExcursions: 'Excursiones en Marruecos', allDestinations: 'Destinos de Marruecos', allEvents: 'Eventos en Marruecos', allArticles: 'Guías de viaje de Marruecos' }
      : { allCircuits: 'Private Morocco tours', allExcursions: 'Morocco day trips & excursions', allDestinations: 'Morocco travel destinations', allEvents: 'Cultural events in Morocco', allArticles: 'Morocco travel guides' };

  const dropdownLinks: Record<string, { href: string; label: string }[]> = {
    circuits: [{ href: '/circuits', label: labels.allCircuits }, ...circuits.slice(0, 4).map((tour) => ({ href: `/circuits/${tour.slug}`, label: tour.title }))],
    excursions: [{ href: '/excursions', label: labels.allExcursions }, ...excursions.slice(0, 4).map((tour) => ({ href: `/excursions/${tour.slug}`, label: tour.title }))],
    destinations: [{ href: '/destinations', label: labels.allDestinations }, ...destinations.slice(0, 5).map((destination) => ({ href: `/destinations/${destination.slug}`, label: locale === 'fr' ? `Voyage à ${destination.name}` : locale === 'es' ? `Viaje a ${destination.name}` : `${destination.name} travel guide` }))],
    events: [{ href: '/events', label: labels.allEvents }, ...events.slice(0, 4).map((event) => ({ href: `/events/${event.slug}`, label: event.title }))],
    blog: [{ href: '/blog', label: labels.allArticles }, ...articles.slice(0, 4).map((article) => ({ href: `/blog/${article.slug}`, label: article.title }))],
  };
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const isHomeActive = (pathname as string) === '/' || (pathname as string) === `/${locale}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7EBDD]/95 backdrop-blur-md shadow-sm py-1.5 border-b border-[#E9DDCD]'
          : 'bg-[#F7EBDD]/95 backdrop-blur-md border-b border-[#E9DDCD]/70 py-1.5 sm:py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Luxury Maroc Voyage logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Luxury Maroc Voyage"
          >
            <Image
              src="/logos/logo2-Photoroom.png"
              alt="Luxury Maroc Voyage"
              width={743}
              height={439}
              priority
              className="h-auto w-[68px] transition-transform duration-300 group-hover:scale-[1.03] sm:w-[78px]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] font-medium text-[#212832]">
            {navLinks.map((link) => {
              const isActive = link.key === 'home' ? isHomeActive : pathname.includes(link.key);
              const submenu = dropdownLinks[link.key];

              return (
                <div key={link.key} className="group relative">
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1 py-2 transition-colors duration-200 hover:text-[#DF6951] ${
                      isActive ? 'text-[#DF6951] font-semibold' : 'text-[#212832]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {submenu && <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />}
                    {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#DF6951]" />}
                  </Link>
                  {submenu && (
                    <div className="invisible absolute left-0 top-full z-50 w-60 translate-y-1 rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {submenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href as any}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-[#DF6951]"
                        >
                          {item.label}
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher */}
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              aria-label={`${wishlistLabel}${wishlistReady ? ` (${wishlistItems.length})` : ''}`}
              className="relative flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-white/70 hover:text-[#B64F2E] sm:px-3"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden xl:inline">{wishlistLabel}</span>
              {wishlistReady && wishlistItems.length > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B64F2E] px-1 text-[10px] font-bold text-white">{wishlistItems.length > 99 ? '99+' : wishlistItems.length}</span>}
            </Link>
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 focus:outline-none"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-slate-600" />
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 text-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code as 'fr' | 'en' | 'es')}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-slate-50 transition-colors ${
                        locale === lang.code
                          ? 'text-[#DF6951] font-bold bg-orange-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-base">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 text-slate-800 px-5 py-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = link.key === 'home' ? isHomeActive : pathname.includes(link.key);
              const submenu = dropdownLinks[link.key];
              return (
                <div key={link.key}>
                  <div className={`flex items-center rounded-lg transition-colors ${isActive ? 'bg-orange-50 text-[#DF6951]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#DF6951]'}`}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-3 py-2.5"
                    >
                      {link.label}
                    </Link>
                    {submenu && (
                      <button
                        type="button"
                        aria-label={`${link.label} submenu`}
                        aria-expanded={openMobileDropdown === link.key}
                        onClick={() => setOpenMobileDropdown(openMobileDropdown === link.key ? null : link.key)}
                        className="px-3 py-2.5"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${openMobileDropdown === link.key ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {submenu && openMobileDropdown === link.key && (
                    <div className="ml-3 mt-1 border-l border-[#E9DDCD] pl-3">
                      {submenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href as any}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-orange-50 hover:text-[#DF6951]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold uppercase tracking-wider">Language:</span>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code as 'fr' | 'en' | 'es')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    locale === lang.code
                      ? 'bg-[#DF6951] text-white border-[#DF6951]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
