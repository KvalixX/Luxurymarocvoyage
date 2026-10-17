'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const t = useTranslations('common');
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000';
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const defaultMessage = encodeURIComponent(
    'Bonjour Luxurymarocvoyage, je souhaite planifier un voyage privé au Maroc.'
  );

  return (
    <aside aria-label="Support WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center group">
      <div className="mr-3 hidden md:flex items-center bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-sand-200 text-xs font-medium text-morocco-charcoal opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
        {t('whatsappUs')}
      </div>
      <a
        href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Luxurymarocvoyage sur WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
}
