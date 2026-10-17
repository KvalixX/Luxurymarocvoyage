'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Images, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TourGalleryProps {
  coverImage: string | null;
  gallery: string[];
  title: string;
}

export default function TourGallery({ coverImage, gallery, title }: TourGalleryProps) {
  const allImages = [
    coverImage,
    ...gallery.filter((img) => img !== coverImage),
  ].filter(Boolean) as string[];

  if (allImages.length === 0) {
    allImages.push(
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85'
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNext = () => setActiveIndex((p) => (p + 1) % allImages.length);
  const handlePrev = () => setActiveIndex((p) => (p - 1 + allImages.length) % allImages.length);
  const openModal = (idx: number) => { setActiveIndex(idx); setModalOpen(true); };

  return (
    <>
      {/* ── Main image (contained, rounded) ──────────────── */}
      <div className="flex flex-col gap-3">
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-200 group shadow-md border border-slate-200"
          onClick={() => openModal(activeIndex)}
        >
          <Image
            src={allImages[activeIndex]}
            alt={`${title} — photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* Counter badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-semibold select-none">
            {activeIndex + 1}/{allImages.length}
          </div>

          {/* Gallery button */}
          <button
            onClick={(e) => { e.stopPropagation(); openModal(activeIndex); }}
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
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-[calc((100%-5*0.5rem)/6)] sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-terracotta-500 shadow-md opacity-100'
                    : 'border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} miniature ${idx + 1}`}
                  fill
                  sizes="80px"
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
              src={allImages[activeIndex]}
              alt={`${title} — photo ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="mt-3 text-white/70 text-sm font-medium">
            {activeIndex + 1} / {allImages.length}
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto max-w-2xl">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-11 rounded overflow-hidden border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-terracotta-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
