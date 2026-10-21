'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';

interface InquiryConfirmationModalProps {
  locale: string;
  onClose: () => void;
  lockScroll?: boolean;
}

export default function InquiryConfirmationModal({ locale, onClose, lockScroll = true }: InquiryConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);
  const fr = locale === 'fr';
  const es = locale === 'es';
  const copy = fr
    ? { title: 'Demande envoyée !', message: 'Merci pour votre confiance. Notre équipe étudie votre demande et vous répondra dans les meilleurs délais.', close: 'Fermer', action: 'Terminé' }
    : es
      ? { title: '¡Solicitud enviada!', message: 'Gracias por confiar en nosotros. Nuestro equipo revisará tu solicitud y te responderá lo antes posible.', close: 'Cerrar', action: 'Listo' }
      : { title: 'Request sent!', message: 'Thank you for choosing us. Our team will review your request and get back to you as soon as possible.', close: 'Close', action: 'Done' };

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      if (lockScroll) document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lockScroll, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="inquiry-confirmation-title" className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9">
        <button type="button" onClick={onClose} aria-label={copy.close} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
          <X className="h-5 w-5" />
        </button>
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B64F2E]">Luxury Maroc Voyage</p>
        <h2 id="inquiry-confirmation-title" className="mt-2 font-serif text-2xl font-bold text-[#181E4B]">{copy.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">{copy.message}</p>
        <button type="button" autoFocus onClick={onClose} className="mt-7 w-full rounded-xl bg-[#B64F2E] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#963F25]">{copy.action}</button>
      </section>
    </div>,
    document.body,
  );
}
