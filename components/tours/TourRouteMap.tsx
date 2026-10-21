'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItineraryItem {
  id: number;
  day: string;
  title: string;
  text: string;
}

interface Stop {
  name: string;
  lat: number;
  lon: number;
  day: string;
}

interface MapData {
  dailyStops: Stop[];
  otherPlaces: Stop[];
  route: Stop[];
}

const PLACES = [
  { name: 'Tangier', lat: 35.7595, lon: -5.834, aliases: ['Tangier', 'Tanger', 'Tánger'] },
  { name: 'Tetouan', lat: 35.5889, lon: -5.3626, aliases: ['Tetouan', 'Tétouan', 'Tetuán'] },
  { name: 'Chefchaouen', lat: 35.1688, lon: -5.2636, aliases: ['Chefchaouen', 'Chaouen'] },
  { name: 'Akchour', lat: 35.244, lon: -5.178, aliases: ['Akchour'] },
  { name: 'Moulay Idriss Zerhoun', lat: 34.0551, lon: -5.5207, aliases: ['Moulay Idriss Zerhoun', 'Moulay Idriss', 'Moulay Idriss Zarhoun'] },
  { name: 'Volubilis', lat: 34.0736, lon: -5.5547, aliases: ['Volubilis'] },
  { name: 'Meknes', lat: 33.8935, lon: -5.5473, aliases: ['Meknes', 'Meknès'] },
  { name: 'Bab Mansour', lat: 33.8947, lon: -5.5545, aliases: ['Bab Mansour'] },
  { name: 'Moulay Ismail Mausoleum', lat: 33.8944, lon: -5.5614, aliases: ['tombeau de Moulay Ismail', 'Moulay Ismail Mausoleum'] },
  { name: 'Ifrane', lat: 33.5228, lon: -5.1107, aliases: ['Ifrane'] },
  { name: 'Azrou', lat: 33.4344, lon: -5.2213, aliases: ['Azrou'] },
  { name: 'Midelt', lat: 32.6852, lon: -4.7451, aliases: ['Midelt'] },
  { name: 'Imouzzer Kandar', lat: 33.7287, lon: -5.0101, aliases: ['Imouzzer-Kandar', 'Imouzzer Kandar'] },
  { name: 'Fez', lat: 34.0331, lon: -5.0003, aliases: ['Fez', 'Fes', 'Fès'] },
  { name: 'Bou Inania Madrasa', lat: 34.0612, lon: -4.9858, aliases: ['Medersa Bou Inania', 'Bou Inania Madrasa'] },
  { name: 'Al-Attarine Madrasa', lat: 34.0646, lon: -4.9782, aliases: ['Medersa des Attarine', 'Attarine Medersa', 'Al-Attarine Madrasa'] },
  { name: 'Al Quaraouiyine', lat: 34.0645, lon: -4.9739, aliases: ['mosquée d’El Qarawiyin', 'El Qarawiyin mosque', 'Al Quaraouiyine'] },
  { name: 'Rabat', lat: 34.0209, lon: -6.8416, aliases: ['Rabat'] },
  { name: 'Kasbah of the Udayas', lat: 34.0319, lon: -6.8366, aliases: ['Kasbah des Oudayas', 'Kasbah of the Udayas', 'Kasbah des Oudaias'] },
  { name: 'Hassan Tower', lat: 34.0241, lon: -6.8225, aliases: ['Tour Hassan', 'Hassan Tower'] },
  { name: 'Mohammed V Mausoleum', lat: 34.0233, lon: -6.8228, aliases: ['Mausolée Mohammed V', 'Mohammed V Mausoleum', 'Mohamed V mausoleum'] },
  { name: 'Casablanca', lat: 33.5731, lon: -7.5898, aliases: ['Casablanca'] },
  { name: 'Hassan II Mosque', lat: 33.6084, lon: -7.6326, aliases: ['Mosquée Hassan II', 'Hassan II Mosque', 'Mezquita Hassan II'] },
  { name: 'Place des Nations Unies', lat: 33.5973, lon: -7.6188, aliases: ['Place des Nations Unies', 'United Nations Square'] },
  { name: 'Habous Quarter', lat: 33.5729, lon: -7.6032, aliases: ['Quartier Al Habous', 'Habous Quarter'] },
  { name: 'Royal Palace of Casablanca', lat: 33.5858, lon: -7.6321, aliases: ['Palais Royal de Casablanca', 'Royal Palace of Casablanca'] },
  { name: 'Marrakech', lat: 31.6295, lon: -7.9811, aliases: ['Marrakech', 'Marrakesh'] },
  { name: 'Jemaa el-Fnaa', lat: 31.6258, lon: -7.9891, aliases: ['Jemaa El Fna', 'Jemaa el-Fnaa', 'Djemaa El Fna', 'Place Jemaa El Fna'] },
  { name: 'Bahia Palace', lat: 31.6218, lon: -7.9812, aliases: ['Palais Bahia', 'Bahia Palace'] },
  { name: 'Agdal Gardens', lat: 31.603, lon: -7.981, aliases: ['Jardins de l’Agdal', 'Agdal Gardens'] },
  { name: 'Menara Gardens', lat: 31.6167, lon: -8.02, aliases: ['Jardins de la Menara', 'Menara Gardens'] },
  { name: 'Saadian Tombs', lat: 31.6165, lon: -7.9896, aliases: ['Tombeaux Saadiens', 'Saadian Tombs'] },
  { name: 'Agafay', lat: 31.381, lon: -8.252, aliases: ['Agafay'] },
  { name: 'Imintanoute', lat: 31.1777, lon: -8.8699, aliases: ['Imintanoute'] },
  { name: 'Tizi n’Tichka Pass', lat: 31.2858, lon: -7.3817, aliases: ['Tizi n’Tichka', "Tizi n'Tichka", 'Tichka Pass', 'col du Tichka'] },
  { name: 'Ait Ben Haddou', lat: 31.047, lon: -7.1298, aliases: ['Ait Ben Haddou', 'Aït Ben Haddou', 'Ait Benhaddou'] },
  { name: 'Telouet', lat: 31.2893, lon: -7.2362, aliases: ['Telouet'] },
  { name: 'Ouarzazate', lat: 30.9189, lon: -6.8934, aliases: ['Ouarzazate'] },
  { name: 'Taourirt Kasbah', lat: 30.9198, lon: -6.902, aliases: ['Kasbah de Taourirt', 'Kasbah Taourirt', 'Taourirt Kasbah'] },
  { name: 'Fint Oasis', lat: 30.851, lon: -6.778, aliases: ['Oasis de Fint', 'Fint Oasis'] },
  { name: 'Draa Valley', lat: 30.55, lon: -6.15, aliases: ['Vallée du Drâa', 'Vallée du Draa', 'Draa Valley'] },
  { name: 'Skoura', lat: 31.0598, lon: -6.5539, aliases: ['Skoura'] },
  { name: 'Boumalne Dades', lat: 31.3744, lon: -5.9986, aliases: ['Boumalne Dades', 'Boumalne du Dadès', 'Boumalne'] },
  { name: 'Kelaat M’Gouna', lat: 31.2457, lon: -6.1326, aliases: ['Kelaat M’Gouna', "Kelaat M'Gouna", 'El-Kelaâ M’Gouna', "El-Kelaa M'Gouna"] },
  { name: 'Dades Gorge', lat: 31.445, lon: -5.922, aliases: ['Gorges du Dadès', 'Gorges de Dadès', 'Dades Gorge', 'Dades Valley', 'Vallée du Dadès'] },
  { name: 'Todra Gorge', lat: 31.5892, lon: -5.5927, aliases: ['Gorges du Todgha', 'Gorges de Todgha', 'Gorges du Todra', 'Gorges de Todra', 'Vallée de Todra', 'Todra Gorge', 'Todra'] },
  { name: 'Tinghir', lat: 31.5147, lon: -5.5328, aliases: ['Tinghir', 'Tinerhir'] },
  { name: 'Erfoud', lat: 31.4353, lon: -4.2326, aliases: ['Erfoud'] },
  { name: 'Rissani', lat: 31.2833, lon: -4.2667, aliases: ['Rissani'] },
  { name: 'Merzouga', lat: 31.0802, lon: -4.0134, aliases: ['Merzouga'] },
  { name: 'Erg Chebbi', lat: 31.15, lon: -4.03, aliases: ['Erg Chebbi'] },
  { name: 'Alnif', lat: 31.1145, lon: -5.1719, aliases: ['Alnif'] },
  { name: 'Tazzarine', lat: 30.7754, lon: -5.5324, aliases: ['Tazzarine', 'Tazarine'] },
  { name: 'N’kob', lat: 30.8694, lon: -5.8703, aliases: ['N’kob', "N'kob", 'Nkob'] },
  { name: 'Agdz', lat: 30.6932, lon: -6.446, aliases: ['Agdz'] },
  { name: 'Zagora', lat: 30.3324, lon: -5.8384, aliases: ['Zagora'] },
  { name: 'Tamegroute', lat: 30.2606, lon: -5.6823, aliases: ['Tamegroute'] },
  { name: 'M’hamid El Ghizlane', lat: 29.8281, lon: -5.7242, aliases: ['M’hamid El Ghizlane', "M'hamid El Ghizlane", 'M’hamid', "M'hamid", 'Mhamid'] },
  { name: 'Erg Chegaga', lat: 29.8333, lon: -6.25, aliases: ['Erg Chegaga', 'Chegaga'] },
  { name: 'Tata', lat: 29.7441, lon: -7.9726, aliases: ['Tata'] },
  { name: 'Oualidia', lat: 32.734, lon: -9.03, aliases: ['Oualidia'] },
  { name: 'El Jadida', lat: 33.2333, lon: -8.5, aliases: ['El Jadida', 'Mazagan'] },
  { name: 'Beni Mellal', lat: 32.3373, lon: -6.3498, aliases: ['Beni Mellal', 'Beni-Mellal'] },
  { name: 'Chichaoua', lat: 31.5435, lon: -8.7628, aliases: ['Chichaoua'] },
  { name: 'Taghazout', lat: 30.5453, lon: -9.7086, aliases: ['Taghazout'] },
  { name: 'Imsouane', lat: 30.842, lon: -9.816, aliases: ['Imsouane'] },
  { name: 'Sidi Kaouki', lat: 31.349, lon: -9.801, aliases: ['Sidi Kaouki'] },
  { name: 'Inezgane', lat: 30.3658, lon: -9.5381, aliases: ['Inezgane'] },
  { name: 'Agadir Oufella Kasbah', lat: 30.4274, lon: -9.6315, aliases: ['Kasbah d’Agadir Oufella', 'Kasbah of Agadir Oufella', 'Agadir Oufella'] },
  { name: 'Imlil', lat: 31.1372, lon: -7.9214, aliases: ['Imlil'] },
  { name: 'Imi Oughlad', lat: 31.2008, lon: -7.95737, aliases: ['Imi Oughlad', 'Imoughlad', 'Imi-Oughlad'] },
  { name: 'Tizi Oussem', lat: 31.11855, lon: -7.9736, aliases: ['Tizi Oussem'] },
  { name: 'Aguersioual', lat: 31.16052, lon: -7.92475, aliases: ['Aguersoual', 'Aguersioual', 'Augursioual', 'Aguerrioual'] },
  { name: 'Toubkal', lat: 31.059, lon: -7.915, aliases: ['Toubkal'] },
  { name: 'Ouzoud Waterfalls', lat: 32.015, lon: -6.72, aliases: ['Ouzoud', 'Cascades d’Ouzoud', "Cascades d'Ouzoud"] },
  { name: 'Agadir', lat: 30.4278, lon: -9.5981, aliases: ['Agadir'] },
  { name: 'Essaouira', lat: 31.5085, lon: -9.7595, aliases: ['Essaouira'] },
  { name: 'Taroudant', lat: 30.4703, lon: -8.8769, aliases: ['Taroudant'] },
  { name: 'Tafraoute', lat: 29.7245, lon: -8.9747, aliases: ['Tafraoute'] },
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

function findPlaces(value: string, preserveRepeatedStops = false) {
  const text = normalize(value);
  const matches = PLACES.flatMap((place) =>
    place.aliases.flatMap((alias) => {
      const normalizedAlias = normalize(alias);
      const index = text.indexOf(normalizedAlias);
      if (index < 0) return [];
      const before = index === 0 ? '' : text[index - 1];
      const after = text[index + normalizedAlias.length] || '';
      if ((before && /[\p{L}\p{N}]/u.test(before)) || (after && /[\p{L}\p{N}]/u.test(after))) return [];
      return [{ place, index, length: normalizedAlias.length }];
    })
  ).sort((a, b) => a.index - b.index || b.length - a.length);

  const found: (typeof PLACES)[number][] = [];
  for (const match of matches) {
    if (found.at(-1)?.name !== match.place.name && (preserveRepeatedStops || !found.some((place) => place.name === match.place.name))) {
      found.push(match.place);
    }
  }
  return found;
}

function getMapData(itinerary: ItineraryItem[], departure: string): MapData {
  // The database IDs reflect insertion order, which may not match the displayed day order.
  const orderedItinerary = itinerary
    .map((item, index) => ({ item, index, dayNumber: Number(item.day.match(/\d+/)?.[0]) }))
    .sort((a, b) => {
      const aDay = Number.isFinite(a.dayNumber) ? a.dayNumber : a.index + 1;
      const bDay = Number.isFinite(b.dayNumber) ? b.dayNumber : b.index + 1;
      return aDay - bDay || a.index - b.index;
    })
    .map(({ item }) => item);
  const firstKnownPlace = findPlaces(departure)[0] || orderedItinerary
    .flatMap((item) => [...findPlaces(item.title, true), ...findPlaces(item.text)])
    .at(0);
  let previousPlace = firstKnownPlace;
  const result: MapData = { dailyStops: [], otherPlaces: [], route: [] };

  orderedItinerary.forEach((item, index) => {
    const day = item.day || `Day ${index + 1}`;
    const titlePlaces = findPlaces(item.title, true);
    const descriptionPlaces = findPlaces(item.text);
    const destination = titlePlaces.at(-1) || descriptionPlaces.at(-1) || previousPlace;
    if (!destination) return;
    previousPlace = destination;

    const toStop = (place: (typeof PLACES)[number]): Stop => ({
      name: place.name,
      lat: place.lat,
      lon: place.lon,
      day,
    });
    result.dailyStops.push(toStop(destination));

    const titleNames = new Set(titlePlaces.map((place) => place.name));
    const descriptionOnly = descriptionPlaces.filter((place) => !titleNames.has(place.name));
    const otherCandidates = [...titlePlaces.slice(0, -1), ...descriptionOnly];
    const seen = new Set<string>();
    const uniqueOtherPlaces = otherCandidates.filter((place) => {
      if (place.name === destination.name || seen.has(place.name)) return false;
      seen.add(place.name);
      return true;
    });
    result.otherPlaces.push(...uniqueOtherPlaces.map(toStop));

    const dayRoute = titlePlaces.length > 1
      ? orderAlongRoute(titlePlaces, descriptionOnly)
      : titlePlaces.length === 1
        ? [titlePlaces[0], ...descriptionOnly]
        : descriptionPlaces.length > 0
          ? descriptionPlaces
          : [destination];
    result.route.push(...dayRoute.map(toStop));
  });

  return result;
}

function orderAlongRoute(
  route: (typeof PLACES)[number][],
  extras: (typeof PLACES)[number][]
) {
  if (route.length < 2 || extras.length === 0) return route;

  const project = (place: (typeof PLACES)[number]) => {
    let closest = { position: 0, distance: Number.POSITIVE_INFINITY };
    for (let index = 0; index < route.length - 1; index++) {
      const cosLatitude = Math.cos(((route[index].lat + route[index + 1].lat) / 2) * Math.PI / 180);
      const ax = route[index].lon * cosLatitude;
      const ay = route[index].lat;
      const bx = route[index + 1].lon * cosLatitude;
      const by = route[index + 1].lat;
      const px = place.lon * cosLatitude;
      const py = place.lat;
      const dx = bx - ax;
      const dy = by - ay;
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
      const distance = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      if (distance < closest.distance) closest = { position: index + t, distance };
    }
    return closest.position;
  };

  return [
    ...route.map((place, index) => ({ place, position: index, sourceOrder: 0 })),
    ...extras.map((place, index) => ({ place, position: project(place), sourceOrder: index + 1 })),
  ].sort((a, b) => a.position - b.position || a.sourceOrder - b.sourceOrder).map(({ place }) => place);
}

export default function TourRouteMap({ itinerary, locale, departure = '' }: { itinerary: ItineraryItem[]; locale: string; departure?: string }) {
  const { dailyStops, otherPlaces, route } = useMemo(
    () => getMapData(itinerary, departure),
    [itinerary, departure]
  );
  const mapElement = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<import('leaflet').Map | null>(null);
  const markerRefs = useRef<Map<string, import('leaflet').Marker>>(new Map());
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [placesOpen, setPlacesOpen] = useState(true);
  const labels = {
    fr: { title: 'Carte de l’itinéraire', places: 'Lieux de l’itinéraire', other: 'Autres lieux mentionnés chaque jour' },
    en: { title: 'Itinerary map', places: 'Itinerary places', other: 'Other places mentioned each day' },
    es: { title: 'Mapa del itinerario', places: 'Lugares del itinerario', other: 'Otros lugares mencionados cada día' },
  }[locale] || { title: 'Itinerary map', places: 'Itinerary places', other: 'Other places mentioned each day' };

  useEffect(() => {
    if (!mapElement.current || dailyStops.length === 0) return;
    let cancelled = false;
    let map: import('leaflet').Map | undefined;

    void import('leaflet').then(({ default: L }) => {
      if (cancelled || !mapElement.current) return;
      map = L.map(mapElement.current, { scrollWheelZoom: false });
      leafletMap.current = map;
      markerRefs.current.clear();
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const allStops = [...dailyStops, ...otherPlaces];
      const bounds = L.latLngBounds(allStops.map((stop) => [stop.lat, stop.lon] as [number, number]));
      if (allStops.length === 1) {
        map.setView([allStops[0].lat, allStops[0].lon], 10, { animate: false });
      } else {
        map.fitBounds(bounds.pad(0.18), { animate: false });
      }
      dailyStops.forEach((stop, index) => {
        const number = index + 1;
        const samePlace = dailyStops.filter((candidate) => candidate.lat === stop.lat && candidate.lon === stop.lon);
        const samePlaceIndex = samePlace.indexOf(stop);
        const angle = samePlace.length > 1 ? (2 * Math.PI * samePlaceIndex) / samePlace.length : 0;
        const offsetX = samePlace.length > 1 ? Math.cos(angle) * 18 : 0;
        const offsetY = samePlace.length > 1 ? Math.sin(angle) * 18 : 0;
        const icon = L.divIcon({
          className: '',
          html: `<span class="route-map-marker">${number}</span>`,
          iconSize: [24, 24],
          iconAnchor: [12 - offsetX, 12 - offsetY],
        });
        const marker = L.marker([stop.lat, stop.lon], { icon })
          .bindPopup(`${stop.day}: ${stop.name}`)
          .addTo(map!);
        marker.on('click', () => setSelectedPlace(`day-${index}`));
        markerRefs.current.set(`day-${index}`, marker);
      });

      otherPlaces.forEach((stop, index) => {
        const icon = L.divIcon({
          className: '',
          html: '<span class="route-map-marker route-map-marker-other">•</span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        const marker = L.marker([stop.lat, stop.lon], { icon })
          .bindPopup(`${labels.other} · ${stop.day}: ${stop.name}`)
          .addTo(map!);
        marker.on('click', () => setSelectedPlace(`other-${index}`));
        markerRefs.current.set(`other-${index}`, marker);
      });

      if (route.length > 1) {
        const coordinates = route.map((stop) => `${stop.lon},${stop.lat}`).join(';');
        fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`)
          .then((response) => (response.ok ? response.json() : null))
          .then((data) => {
            const line = data?.routes?.[0]?.geometry?.coordinates;
            if (!cancelled && line?.length) {
              L.polyline(line.map(([lon, lat]: [number, number]) => [lat, lon]), {
                color: '#c45a3c',
                weight: 4,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }).addTo(map!);
            }
          })
          .catch(() => undefined);
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
      leafletMap.current = null;
      markerRefs.current.clear();
    };
  }, [dailyStops, otherPlaces, route, labels.other]);

  useEffect(() => {
    if (!selectedPlace) return;
    const marker = markerRefs.current.get(selectedPlace);
    const map = leafletMap.current;
    if (!marker || !map) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 12), { duration: 0.5 });
    marker.openPopup();
  }, [selectedPlace]);

  if (!dailyStops.length) return null;

  return (
    <section className="mt-8 mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label={labels.title}>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-serif text-xl font-bold text-slate-900">{labels.title}</h2>
        {otherPlaces.length > 0 && (
          <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-slate-600">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            {labels.other}
          </p>
        )}
      </div>
      <div className="relative isolate">
        <div className="h-[280px] w-full sm:h-[340px] md:h-[400px]" ref={mapElement} aria-label={labels.title} />
        <aside className={`absolute bottom-3 right-3 z-[1000] max-h-[calc(100%-1.5rem)] overflow-y-auto overscroll-contain rounded-lg bg-white/95 p-2 shadow-md backdrop-blur-sm transition-[width] ${placesOpen ? 'w-[180px] sm:w-[210px]' : 'w-10'}`} aria-label={labels.places}>
          <div className={`mb-3 flex items-center ${placesOpen ? 'justify-between gap-2' : 'justify-center'}`}>
            {placesOpen && <h3 className="text-sm font-semibold text-slate-700">{labels.places}</h3>}
            <button
              type="button"
              onClick={() => setPlacesOpen((open) => !open)}
              aria-label={placesOpen ? 'Hide itinerary places' : 'Show itinerary places'}
              aria-expanded={placesOpen}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
            >
              {placesOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          {placesOpen && <ol className="space-y-4">
            {dailyStops.map((stop, dayIndex) => (
              <li key={`day-${dayIndex}`}>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">{stop.day}</p>
                <button type="button" onClick={() => setSelectedPlace(`day-${dayIndex}`)} aria-pressed={selectedPlace === `day-${dayIndex}`} className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm transition ${selectedPlace === `day-${dayIndex}` ? 'bg-orange-50 font-semibold text-orange-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c45a3c] text-[10px] font-bold text-white">{dayIndex + 1}</span>
                  {stop.name}
                </button>
                {otherPlaces.map((place, placeIndex) => place.day === stop.day ? (
                  <button key={`other-${placeIndex}`} type="button" onClick={() => setSelectedPlace(`other-${placeIndex}`)} aria-pressed={selectedPlace === `other-${placeIndex}`} className={`block w-full rounded-lg px-2 py-1.5 pl-9 text-left text-sm transition ${selectedPlace === `other-${placeIndex}` ? 'bg-amber-50 font-semibold text-amber-800' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />
                    {place.name}
                  </button>
                ) : null)}
              </li>
            ))}
          </ol>
          }
        </aside>
      </div>
      <style jsx global>{`
        .route-map-marker { display: flex; width: 24px; height: 24px; align-items: center; justify-content: center; border: 2px solid #fff; border-radius: 50%; background: #c45a3c; color: #fff; font-size: 10px; font-weight: 700; box-shadow: 0 1px 6px #0006; }
        .route-map-marker-other { width: 18px; height: 18px; background: #d59b3e; font-size: 12px; }
      `}</style>
    </section>
  );
}





