"use client";

import { useEffect, useMemo } from "react";
import {
 MapContainer,
 TileLayer,
 Marker,
 Popup,
 Tooltip,
 useMap,
} from "react-leaflet";
import { divIcon } from "leaflet";
import type { CityLocation } from "@/lib/seed";

const INDIA_CENTER: [number, number] = [22, 79];
const INDIA_BOUNDS: [[number, number], [number, number]] = [
 [6.5, 68],
 [35.5, 97.5],
];

const RANK_COLORS = ["#ff5a6a", "#ffb020", "#35d5e9", "#35e08a", "#7ee7f2", "#a78bfa"];

function rankColor(index: number): string {
 return RANK_COLORS[index] ?? "#8aa0bd";
}

function makeIcon(index: number, active: boolean): L.DivIcon {
 const color = rankColor(index);
 const size = active ? 34 : 26;
 const html = `
 <div class="hm-pin" style="--pin-color:${color};--pin-size:${size}px;">
 <span class="hm-pin-dot" style="background:${color};"></span>
 <span class="hm-pin-num">${index + 1}</span>
 </div>`;
 return divIcon({
 html,
 className: "hm-pin-wrap",
 iconSize: [size, size],
 iconAnchor: [size / 2, size / 2],
 popupAnchor: [0, -size / 2],
 });
}

function FlyController({
 cities,
 selectedCity,
}: {
 cities: CityLocation[];
 selectedCity: CityLocation | null;
}) {
 const map = useMap();

 useEffect(() => {
 if (selectedCity) {
 map.flyTo([selectedCity.lat, selectedCity.lng], 11, { duration: 0.8 });
 return;
 }
 if (cities.length > 1) {
 map.flyToBounds(INDIA_BOUNDS, { padding: [30, 30], duration: 0.8 });
 return;
 }
 if (cities.length === 1) {
 map.flyTo([cities[0].lat, cities[0].lng], 7, { duration: 0.8 });
 }
 }, [map, selectedCity, cities]);

 return null;
}

export interface CityPinMapProps {
 cities: CityLocation[];
 selectedCity: CityLocation | null;
 onSelect: (city: CityLocation) => void;
 height?: number;
}

export function CityPinMap({ cities, selectedCity, onSelect, height = 420 }: CityPinMapProps) {
 const ranked = useMemo(
 () => [...cities].sort((a, b) => b.reports - a.reports),
 [cities]
 );

 return (
 <div className="hm-map-wrap" style={{ height }}>
 <MapContainer
 center={INDIA_CENTER}
 zoom={5}
 zoomControl={true}
 attributionControl={true}
 scrollWheelZoom={false}
 style={{ height: "100%", width: "100%", background: "#08111f" }}
 >
 <TileLayer
 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
 subdomains="abcd"
 maxZoom={19}
 />
 <FlyController cities={ranked} selectedCity={selectedCity} />
 {ranked.map((c, i) => {
 const active = selectedCity?.city === c.city;
 return (
 <Marker
 key={c.city}
 position={[c.lat, c.lng]}
 icon={makeIcon(i, active)}
 eventHandlers={{ click: () => onSelect(c) }}
 >
 <Tooltip direction="top" offset={[0, -10]} opacity={1}>
 <span style={{ color: "#edf5ff", fontWeight: 600 }}>{c.city}</span>
 <span style={{ color: "#8aa0bd", marginLeft: 6 }}>{c.reports.toLocaleString()} reports</span>
 </Tooltip>
 <Popup>
 <div className="hm-popup">
 <p className="hm-popup-title">{c.city}</p>
 <p className="hm-popup-sub">{c.state}</p>
 <p className="hm-popup-reports">{c.reports.toLocaleString()} reports</p>
 </div>
 </Popup>
 </Marker>
 );
 })}
 </MapContainer>
 <p className="hm-map-hint">Drag to pan · Click a pin for city details</p>
 </div>
 );
}

export default CityPinMap;