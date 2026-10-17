# Luxurymarocvoyage — Production Web Platform

A production-ready Next.js website for **Luxurymarocvoyage**, an elite receptive travel agency based in Marrakech, Morocco.

---

## Key Features

1. **Top Priority SEO Architecture**:
   - Multilingual with localized routing in French, English, and Spanish (`/fr`, `/en`, `/es`).
   - Self-referencing and cross-lingual `hreflang` tags on all pages.
   - Comprehensive JSON-LD structured data: `TravelAgency`, `TouristTrip`, `Product`, `Event`, `BlogPosting`, `FAQPage`, `TouristDestination`, `BreadcrumbList`.
   - Dynamic `sitemap.xml` generating all routes, tours, events, articles, and destinations.
   - Optimized Core Web Vitals: Zero Cumulative Layout Shift via Google Fonts variable integration, lazy loading with `next/image`.

2. **Moroccan Luxury Design System**:
   - Curated color palette: Terracotta (`#DF6951`), Desert Gold/Sand (`#C9963C`), Majorelle Blue (`#4045f0`), Charcoal Night (`#1A0F0A`), Cream Linen (`#FDF8F2`).
   - Cormorant Garamond & Playfair Display serif typography for editorial titles, Outfit for UI.
   - Sticky glassmorphic navbar with smooth scroll elevation.
   - Expandable timeline itineraries for day-by-day tour programs.
   - Floating VIP WhatsApp assistance button with pre-filled message generator.

3. **Connected to Existing MySQL Database**:
   - Directly connects to MariaDB/MySQL database (`voyagemaroc`).
   - Queries 52 circuits and excursions, destinations, cultural events, and blog articles.
   - Handles multilingual JSON columns (`{"fr": "...", "en": "...", "es": "..."}`) seamlessly.

---

## Getting Started

### 1. Environment Configuration
Ensure your `.env.local` contains:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=voyagemaroc
DB_USER=root
DB_PASSWORD=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Luxurymarocvoyage
NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site (automatically redirects to `/fr`).

### 3. Production Build
```bash
npm run build
npm run start
```
Prerenders all 464 static and dynamic routes.
