"use client";

/**
 * Google Maps JavaScript API multi-pin map.
 *
 * Renders only when NEXT_PUBLIC_GOOGLE_MAPS_KEY is set. Shows all 12 Indian
 * cities as numbered, rank-coloured markers; clicking a marker calls onSelect.
 * When a city is selected, the map pans/zooms to it.
 *
 * If the key is missing or the script fails to load, `onUnavailable` fires and
 * the caller should fall back to GoogleMapEmbed.
 */

import { useEffect, useRef } from "react";
import type { CityLocation } from "@/lib/seed";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const RANK_COLORS = ["#ff5a6a", "#ffb020", "#35d5e9", "#35e08a", "#7ee7f2", "#60a5fa"];
function rankColor(i: number) {
 return RANK_COLORS[i] ?? "#8aa0bd";
}

// Minimal structural type for the Google Maps JS API surface we use.
// The full API is not typed here to avoid pulling in @types/google.maps.
interface GMap {
 panTo(latLng: { lat: number; lng: number }): void;
 setZoom(z: number): void;
 fitBounds(b: GLatLngBounds, padding?: number): void;
 addListener?(event: string, cb: () => void): void;
}
interface GLatLngBounds {
 extend(latLng: { lat: number; lng: number }): GLatLngBounds;
}
interface GMarker {
 setMap(map: GMap | null): void;
 addListener(event: string, cb: () => void): void;
}
interface GInfoWindow {
 open(map: GMap, anchor: GMarker): void;
}
interface GMapConstructor {
 new (el: HTMLElement, opts: Record<string, unknown>): GMap;
}
interface GMarkerConstructor {
 new (opts: Record<string, unknown>): GMarker;
}
interface GInfoWindowConstructor {
 new (opts: Record<string, unknown>): GInfoWindow;
}
interface GLatLngBoundsConstructor {
 new (): GLatLngBounds;
}
interface GSizeConstructor {
 new (w: number, h: number): unknown;
}
interface GPointConstructor {
 new (x: number, y: number): unknown;
}
interface GoogleMapsNamespace {
 maps: {
 Map: GMapConstructor;
 Marker: GMarkerConstructor;
 InfoWindow: GInfoWindowConstructor;
 LatLngBounds: GLatLngBoundsConstructor;
 Size: GSizeConstructor;
 Point: GPointConstructor;
 };
}

declare global {
 interface Window {
 google?: GoogleMapsNamespace;
 __phishfixGoogleReady?: boolean;
 }
}

function loadGoogleMaps(): Promise<void> {
 if (typeof window === "undefined") return Promise.reject(new Error("no window"));
 if (window.google?.maps) return Promise.resolve();
 if (window.__phishfixGoogleReady) {
 return new Promise((resolve) => {
 const check = setInterval(() => {
 if (window.google?.maps) {
 clearInterval(check);
 resolve();
 }
 }, 50);
 });
 }
 return new Promise((resolve, reject) => {
 window.__phishfixGoogleReady = true;
 const script = document.createElement("script");
 script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=marker`;
 script.async = true;
 script.defer = true;
 script.onload = () => resolve();
 script.onerror = () => {
 window.__phishfixGoogleReady = false;
 reject(new Error("Google Maps failed to load"));
 };
 document.head.appendChild(script);
 });
}

function pinSvg(color: string, num: number): string {
 const size = 34;
 return (
 `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 6}" viewBox="0 0 ${size} ${size + 6}">` +
 `<path d="M${size / 2} ${size + 6} C${size / 2} ${size + 6}, 0 ${size * 0.72}, 0 ${size / 2} A${size / 2} ${size / 2} 0 1 1 ${size} ${size / 2} C${size} ${size * 0.72}, ${size / 2} ${size + 6}, ${size / 2} ${size + 6} Z" fill="${color}" stroke="#08111f" stroke-width="2"/>` +
 `<text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#08111f" font-family="sans-serif">${num}</text>` +
 `</svg>`
 );
}

export interface GooglePinMapProps {
 cities: CityLocation[];
 selectedCity: CityLocation | null;
 onSelect: (city: CityLocation) => void;
 onUnavailable: () => void;
 height?: number;
}

export function GooglePinMap({ cities, selectedCity, onSelect, onUnavailable, height = 420 }: GooglePinMapProps) {
 const containerRef = useRef<HTMLDivElement>(null);
 const mapRef = useRef<GMap | null>(null);
 const markersRef = useRef<GMarker[]>([]);
 const onSelectRef = useRef(onSelect);
 const onUnavailableRef = useRef(onUnavailable);
 useEffect(() => {
 onSelectRef.current = onSelect;
 onUnavailableRef.current = onUnavailable;
 }, [onSelect, onUnavailable]);

 // Initialise the map once.
 useEffect(() => {
 if (!GOOGLE_KEY) {
 onUnavailableRef.current();
 return;
 }
 let cancelled = false;
 loadGoogleMaps()
 .then(() => {
 if (cancelled || !containerRef.current || !window.google?.maps) return;
 const center = cities[0] ? { lat: cities[0].lat, lng: cities[0].lng } : { lat: 22, lng: 79 };
 mapRef.current = new window.google.maps.Map(containerRef.current, {
 center,
 zoom: 5,
 disableDefaultUI: false,
 zoomControl: true,
 mapTypeControl: false,
 streetViewControl: false,
 fullscreenControl: false,
 styles: [
 { elementType: "geometry", stylers: [{ color: "#0b1627" }] },
 { elementType: "labels.text.fill", stylers: [{ color: "#8aa0bd" }] },
 { elementType: "labels.text.stroke", stylers: [{ color: "#0b1627" }] },
 { featureType: "road", elementType: "geometry", stylers: [{ color: "#14243d" }] },
 { featureType: "water", elementType: "geometry", stylers: [{ color: "#08111f" }] },
 { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1e3350" }] },
 ],
 });
 })
 .catch(() => {
 if (!cancelled) onUnavailableRef.current();
 });
 return () => {
 cancelled = true;
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // (Re)build markers when cities change.
 useEffect(() => {
 const g = window.google;
 const map = mapRef.current;
 if (!g?.maps || !map || !cities.length) return;
 markersRef.current.forEach((m) => m.setMap(null));
 markersRef.current = [];
 const ranked = [...cities].sort((a, b) => b.reports - a.reports);
 ranked.forEach((c, i) => {
 const color = rankColor(i);
 const marker = new g.maps.Marker({
 position: { lat: c.lat, lng: c.lng },
 map,
 icon: {
 url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg(color, i + 1))}`,
 scaledSize: new g.maps.Size(34, 40),
 anchor: new g.maps.Point(17, 40),
 },
 title: `${c.city} — ${c.reports.toLocaleString()} reports`,
 });
 const info = new g.maps.InfoWindow({
 content: `<div style="color:#edf5ff;font:12px sans-serif;min-width:120px"><b style="font-size:13px">${c.city}</b><br/><span style="color:#8aa0bd">${c.state}</span><br/><span style="color:#35d5e9;font-weight:600">${c.reports.toLocaleString()} reports</span></div>`,
 });
 marker.addListener("click", () => {
 info.open(map, marker);
 onSelectRef.current(c);
 });
 markersRef.current.push(marker);
 });
 }, [cities]);

 // Pan/zoom when selection changes.
 useEffect(() => {
 if (!mapRef.current || !window.google?.maps) return;
 if (selectedCity) {
 mapRef.current.panTo({ lat: selectedCity.lat, lng: selectedCity.lng });
 mapRef.current.setZoom(11);
 } else if (cities.length > 1) {
 const bounds = new window.google.maps.LatLngBounds();
 cities.forEach((c) => bounds.extend({ lat: c.lat, lng: c.lng }));
 mapRef.current.fitBounds(bounds, 40);
 }
 }, [selectedCity, cities]);

 if (!GOOGLE_KEY) return null;

 return <div ref={containerRef} style={{ height, width: "100%", background: "#08111f" }} />;
}

export default GooglePinMap;