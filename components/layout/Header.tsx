'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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
    router.replace(pathname as any, { locale: newLocale });
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

  const dropdownLinks: Record<string, { href: string; label: string }[]> = locale === 'fr'
    ? {
        circuits: [{ href: '/circuits', label: 'Tous les circuits' }, { href: '/contact', label: 'Créer un voyage sur mesure' }],
        excursions: [{ href: '/excursions', label: 'Toutes les excursions' }, { href: '/contact', label: 'Organiser une excursion privée' }],
        destinations: [{ href: '/destinations', label: 'Toutes les destinations' }, { href: '/circuits', label: 'Circuits par destination' }],
        events: [{ href: '/events', label: 'Tous les événements' }, { href: '/blog', label: 'Culture et traditions' }],
        blog: [{ href: '/blog', label: 'Tous les articles' }, { href: '/about', label: 'À propos de nous' }],
      }
    : locale === 'es'
      ? {
          circuits: [{ href: '/circuits', label: 'Todos los circuitos' }, { href: '/contact', label: 'Crear un viaje a medida' }],
          excursions: [{ href: '/excursions', label: 'Todas las excursiones' }, { href: '/contact', label: 'Organizar una excursión privada' }],
          destinations: [{ href: '/destinations', label: 'Todos los destinos' }, { href: '/circuits', label: 'Circuitos por destino' }],
          events: [{ href: '/events', label: 'Todos los eventos' }, { href: '/blog', label: 'Cultura y tradiciones' }],
          blog: [{ href: '/blog', label: 'Todos los artículos' }, { href: '/about', label: 'Sobre nosotros' }],
        }
      : {
          circuits: [{ href: '/circuits', label: 'All circuits' }, { href: '/contact', label: 'Create a tailor-made trip' }],
          excursions: [{ href: '/excursions', label: 'All excursions' }, { href: '/contact', label: 'Arrange a private day trip' }],
          destinations: [{ href: '/destinations', label: 'All destinations' }, { href: '/circuits', label: 'Tours by destination' }],
          events: [{ href: '/events', label: 'All events' }, { href: '/blog', label: 'Culture and traditions' }],
          blog: [{ href: '/blog', label: 'All articles' }, { href: '/about', label: 'About our team' }],
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
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-1.5 border-b border-slate-100'
          : 'bg-white/80 lg:bg-transparent py-1.5 sm:py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Circular Luxury Badge Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Prestigia Maroc Voyages"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] flex items-center justify-center p-1 shadow-sm border border-amber-500/30 group-hover:scale-105 transition-transform duration-300">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer decorative ring */}
                <circle cx="50" cy="50" r="46" stroke="#C9963C" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                {/* Sun / Star */}
                <circle cx="50" cy="28" r="4" fill="#E9C580" />
                {/* Morocco Atlas Mountains Peaks */}
                <path
                  d="M24 58 L42 36 L56 50 L66 40 L76 58 Z"
                  stroke="#E9C580"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M34 58 L46 44 L54 52"
                  stroke="#DF6951"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Text inside badge */}
                <text
                  x="50"
                  y="72"
                  textAnchor="middle"
                  fill="#E9C580"
                  fontSize="7.5"
                  fontWeight="bold"
                  letterSpacing="1.5"
                >
                  PRESTIGIA
                </text>
                <text
                  x="50"
                  y="82"
                  textAnchor="middle"
                  fill="#DF6951"
                  fontSize="6.5"
                  fontWeight="bold"
                  letterSpacing="1.2"
                >
                  MAROC
                </text>
              </svg>
            </div>
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
