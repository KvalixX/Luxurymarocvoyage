'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { FileText } from 'lucide-react';

export default function FreeQuoteButton() {
  const locale = useLocale();
  const label = locale === 'fr' ? 'Demander votre devis gratuit' : locale === 'es' ? 'Solicitar presupuesto gratis' : 'Request your free quote';

  return (
    <Link
      href="/contact#devis"
      aria-label={label}
      className="fixed bottom-6 left-6 z-50 inline-flex max-w-[calc(100vw-7rem)] items-center gap-2.5 rounded-full bg-[#B05030] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-[#963F25] focus:outline-none focus:ring-4 focus:ring-orange-200 sm:px-5"
    >
      <FileText className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
