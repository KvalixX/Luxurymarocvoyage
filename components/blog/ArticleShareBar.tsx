'use client';

import { useState } from 'react';
import { Copy, Link2, MessageCircle } from 'lucide-react';

interface ArticleShareBarProps {
  title: string;
  label: string;
  locale: string;
  url: string;
}

export default function ArticleShareBar({ title, label, locale, url }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <span className="mr-2 text-sm font-semibold text-[#181E4B]">{label}</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-[#1877F2] text-white transition hover:-translate-y-0.5 hover:shadow-md"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4Z" /></svg></a>
      <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer" aria-label="Share on X" className="grid h-10 w-10 place-items-center rounded-full bg-[#22A7E8] text-white transition hover:-translate-y-0.5 hover:shadow-md"><span className="text-sm font-bold">𝕏</span></a>
      <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-[#20C66A] text-white transition hover:-translate-y-0.5 hover:shadow-md"><MessageCircle className="h-5 w-5" /></a>
      <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Open Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-[#E83E66] text-white transition hover:-translate-y-0.5 hover:shadow-md"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.7" cy="6.6" r=".8" className="fill-current stroke-none" /></svg></a>
      <button type="button" onClick={copyLink} aria-label={copied ? 'Link copied' : 'Copy article link'} className="grid h-10 w-10 place-items-center rounded-full bg-slate-500 text-white transition hover:-translate-y-0.5 hover:shadow-md">{copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-5 w-5" />}</button>
      {copied && <span role="status" className="text-xs text-slate-600">{locale === 'fr' ? 'Lien copié' : locale === 'es' ? 'Enlace copiado' : 'Link copied'}</span>}
    </div>
  );
}
