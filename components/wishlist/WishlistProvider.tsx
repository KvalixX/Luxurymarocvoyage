'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { Tour } from '@/lib/queries/tours';

export type WishlistKind = 'circuit' | 'excursion';

export interface WishlistItem {
  key: string;
  kind: WishlistKind;
  id: number;
  slug: string;
  title: string;
  image: string | null;
  days: number;
  nights: number;
  departure: string;
  type: string;
  rating: number;
  reviews: number;
  clicks: number;
  exceptional: boolean;
  promotion: boolean;
  gallery: string[];
  destinationId: number | null;
  updatedAt: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  ready: boolean;
  has: (kind: WishlistKind, id: number) => boolean;
  toggle: (tour: Tour, kind: WishlistKind) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'luxury-maroc-voyage:wishlist:v1';
const EMPTY_ITEMS: WishlistItem[] = [];
let storedItems: WishlistItem[] = EMPTY_ITEMS;
let storageReady = false;
let storageLoaded = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function loadStoredItems() {
  if (storageLoaded) return;
  storageLoaded = true;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      storedItems = Array.isArray(parsed) ? parsed.map(normalizeWishlistItem).filter((item): item is WishlistItem => item !== null) : EMPTY_ITEMS;
    }
  } catch {
    storedItems = EMPTY_ITEMS;
  }
  storageReady = true;
  emitChange();
}

function updateStoredItems(update: (current: WishlistItem[]) => WishlistItem[]) {
  storedItems = update(storedItems);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
  } catch {
    // Storage can be unavailable in private browsing or when the browser is full.
  }
  emitChange();
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function normalizeWishlistItem(value: unknown): WishlistItem | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<WishlistItem>;
  if ((item.kind !== 'circuit' && item.kind !== 'excursion')
    || typeof item.id !== 'number' || !Number.isFinite(item.id)
    || typeof item.slug !== 'string' || typeof item.title !== 'string') return null;

  return {
    key: `${item.kind}:${item.id}`,
    kind: item.kind,
    id: item.id,
    slug: item.slug,
    title: item.title,
    image: typeof item.image === 'string' ? item.image : null,
    days: typeof item.days === 'number' && Number.isFinite(item.days) ? item.days : 0,
    nights: typeof item.nights === 'number' && Number.isFinite(item.nights) ? item.nights : 0,
    departure: typeof item.departure === 'string' ? item.departure : '',
    type: typeof item.type === 'string' ? item.type : '',
    rating: typeof item.rating === 'number' && Number.isFinite(item.rating) ? item.rating : 0,
    reviews: typeof item.reviews === 'number' && Number.isFinite(item.reviews) ? item.reviews : 0,
    clicks: typeof item.clicks === 'number' && Number.isFinite(item.clicks) ? item.clicks : 0,
    exceptional: item.exceptional === true,
    promotion: item.promotion === true,
    gallery: Array.isArray(item.gallery) ? item.gallery.filter((image): image is string => typeof image === 'string') : [],
    destinationId: typeof item.destinationId === 'number' && Number.isFinite(item.destinationId) ? item.destinationId : null,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : '',
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, () => storedItems, () => EMPTY_ITEMS);
  const ready = useSyncExternalStore(subscribe, () => storageReady, () => false);

  useEffect(() => {
    loadStoredItems();
    const syncFromOtherTab = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const parsed: unknown = event.newValue ? JSON.parse(event.newValue) : [];
        storedItems = Array.isArray(parsed) ? parsed.map(normalizeWishlistItem).filter((item): item is WishlistItem => item !== null) : EMPTY_ITEMS;
      } catch {
        storedItems = EMPTY_ITEMS;
      }
      emitChange();
    };
    window.addEventListener('storage', syncFromOtherTab);
    return () => window.removeEventListener('storage', syncFromOtherTab);
  }, []);

  const toggle = useCallback((tour: Tour, kind: WishlistKind) => {
    const key = `${kind}:${tour.id}`;
    updateStoredItems((current) => current.some((item) => item.key === key)
      ? current.filter((item) => item.key !== key)
      : [{
          key,
          kind,
          id: tour.id,
          slug: tour.slug,
          title: tour.title,
          image: tour.image || null,
          days: Number.isFinite(tour.days) ? tour.days : 0,
          nights: Number.isFinite(tour.nights) ? tour.nights : 0,
          departure: tour.departure || '',
          type: tour.type || '',
          rating: Number.isFinite(tour.rating) ? tour.rating : 0,
          reviews: Number.isFinite(tour.reviews) ? tour.reviews : 0,
          clicks: Number.isFinite(tour.clicks) ? tour.clicks : 0,
          exceptional: Boolean(tour.exceptional),
          promotion: Boolean(tour.promotion),
          gallery: Array.isArray(tour.gallery) ? tour.gallery.filter((image): image is string => typeof image === 'string') : [],
          destinationId: typeof tour.destinationId === 'number' ? tour.destinationId : null,
          updatedAt: typeof tour.updatedAt === 'string' ? tour.updatedAt : '',
        }, ...current]);
  }, []);

  const remove = useCallback((key: string) => {
    updateStoredItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clear = useCallback(() => updateStoredItems(() => EMPTY_ITEMS), []);
  const has = useCallback((kind: WishlistKind, id: number) => items.some((item) => item.key === `${kind}:${id}`), [items]);
  const value = useMemo(() => ({ items, ready, has, toggle, remove, clear }), [items, ready, has, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
