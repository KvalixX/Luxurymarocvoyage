'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Images, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TourGalleryProps {
  slug: string;
  coverImage: string | null;
  gallery: string[];
  title: string;
}

function uniqueImages(images: (string | null | undefined)[]): string[] {
  return Array.from(new Set(
    images
      .filter((image): image is string => typeof image === 'string')
      .map((image) => image.trim())
      .filter(Boolean),
  ));
}

export default function TourGallery({ slug, coverImage, gallery, title }: TourGalleryProps) {
  const [databaseImages, setDatabaseImages] = useState<string[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Re-read gallery data from the live hosting database, including when a page
  // was previously generated while its gallery field was empty.
  useEffect(() => {
    let current = true;
    setDatabaseImages(null);
    fetch(`/api/tours/${encodeURIComponent(slug)}/gallery`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: unknown) => {
        if (!current || !data || typeof data !== 'object' || !('images' in data)) return;
        const images = (data as { images?: unknown }).images;
        if (Array.isArray(images) && images.every((image) => typeof image === 'string') && images.length > 0) {
          // Keep images supplied by the detail page too. The API may be served
          // by a stale app process or a DB connection with only the cover;
          // replacing the page gallery with that shorter response hides photos.
          setDatabaseImages(uniqueImages(images));
          setActiveIndex(0);
        }
      })
      .catch(() => undefined);
    return () => { current = false; };
  }, [slug]);

  const pageImages = [
    coverImage,
    ...gallery.filter((img) => img !== coverImage),
  ];
  // Merge the live API list with the server-rendered page list instead of
  // allowing a cover-only response to erase the page's gallery images.
  const allImages = uniqueImages([...(databaseImages ?? []), ...pageImages]);
  const displayImages = allImages.length > 0 ? allImages : [
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
  ];

  const safeActiveIndex = Math.min(activeIndex, displayImages.length - 1);

  const handleNext = () => setActiveIndex((p) => (p + 1) % displayImages.length);
  const handlePrev = () => setActiveIndex((p) => (p - 1 + displayImages.length) % displayImages.length);
  const openModal = (idx: number) => { setActiveIndex(idx); setModalOpen(true); };

  return (
    <>
      {/* ── Main image (contained, rounded) ──────────────── */}
      <div className="flex flex-col gap-3">
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-200 group shadow-md border border-slate-200"
          onClick={() => openModal(safeActiveIndex)}
        >
          <Image
            src={displayImages[safeActiveIndex]}
            alt={`${title} — photo ${safeActiveIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* Counter badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-semibold select-none">
            {safeActiveIndex + 1}/{displayImages.length}
          </div>

          {/* Gallery button */}
          <button
            onClick={(e) => { e.stopPropagation(); openModal(safeActiveIndex); }}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-sm transition-colors"
          >
            <Images className="w-3.5 h-3.5" />
            Gallery
          </button>

          {/* Prev / Next */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnail Strip ──────────────────────────────── */}
        {allImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-[calc((100%-5*0.5rem)/6)] sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                  idx === safeActiveIndex
                    ? 'border-terracotta-500 shadow-md opacity-100'
                    : 'border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} miniature ${idx + 1}`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[72vh]">
            <Image
              src={displayImages[safeActiveIndex]}
              alt={`${title} — photo ${safeActiveIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="mt-3 text-white/70 text-sm font-medium">
            {safeActiveIndex + 1} / {displayImages.length}
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto max-w-2xl">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-11 rounded overflow-hidden border-2 transition-all ${
                  idx === safeActiveIndex
                    ? 'border-terracotta-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
