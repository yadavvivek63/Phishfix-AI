"use client";

import { Map, TrendingUp, Users, Filter, MapPin } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card, StatCard } from "@/components/ui/Primitives";
import { getJSON } from "@/lib/client";
import type { HeatPoint } from "@/lib/types";
import type { CityLocation } from "@/lib/seed";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_COLORS } from "@/lib/seed";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import GoogleMapEmbed from "@/components/heatmap/GoogleMapEmbed";
import dynamic from "next/dynamic";
import CategoryDonut from "@/components/heatmap/CategoryDonut";
import LocationPopup from "@/components/heatmap/LocationPopup";

const GooglePinMap = dynamic(() => import("@/components/heatmap/GooglePinMap"), { ssr: false });

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

interface HeatmapResp {
  points: HeatPoint[];
  totals: { reports: number; states: number };
  demo: boolean;
}

export default function HeatmapPage() {
  const [data, setData] = useState<HeatmapResp | null>(null);
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [selected, setSelected] = useState<HeatPoint | null>(null);
  const [cities, setCities] = useState<CityLocation[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);

  useEffect(() => {
    getJSON<HeatmapResp>("/api/heatmap").then((d) => {
      setData(d);
      const top = [...d.points].sort((a, b) => b.reports - a.reports)[0];
      setSelected(top ?? null);
    }).catch(() => setData(null));
    getJSON<{ locations: CityLocation[] }>("/api/locations")
      .then((d) => setCities(d.locations))
      .catch(() => setCities([]));
  }, []);

  const mapLat = selectedCity?.lat ?? selected?.lat ?? 22;
  const mapLng = selectedCity?.lng ?? selected?.lng ?? 79;
  const mapZoom = selectedCity ? 12 : selected ? 7 : 5;
  const mapLabel = selectedCity?.city ?? selected?.state ?? "India";

  const multiplier = period === "week" ? 0.28 : 1;

  const barData = useMemo(() => {
    if (!data) return [];
    return [...data.points]
      .map((p) => ({ state: p.state, reports: Math.round(p.reports * multiplier) }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 12);
  }, [data, multiplier]);

  const categoryTotals = useMemo(() => {
    if (!data) return [];
    const agg: Record<string, number> = {};
    for (const p of data.points) {
      for (const [k, v] of Object.entries(p.scams)) agg[k] = (agg[k] || 0) + v;
    }
    return Object.entries(agg).map(([name, value]) => ({
      name: name === "kyc" ? "Fake KYC" : name === "upi" ? "UPI fraud" : name === "phishing" ? "Phishing" : name === "qr" ? "QR" : name === "delivery" ? "Delivery" : "Other",
      value: Math.round(value * multiplier),
      key: name,
    }));
  }, [data, multiplier]);

  return (
    <div>
      <PageIntro
        icon={Map}
        title="India Scam Heatmap"
        subtitle="Interactive state-wise view of scam reports across India. Data is aggregated and privacy-protected — no individual information is shown."
      >
        <div className="inline-flex rounded-xl border border-black/[0.06] bg-[#f9f9f9] p-1">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${period === p ? "bg-blue-50 text-[#2563eb]" : "text-[#858585] hover:text-[#111111]"}`}
            >
              {p === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </PageIntro>

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total reports" value={data ? Math.round(data.totals.reports * multiplier).toLocaleString() : "—"} icon={TrendingUp} accent="text-[#ef4444]" />
        <StatCard label="States covered" value={data?.totals.states ?? "—"} icon={Map} accent="text-[#2563eb]" />
        <StatCard label="Top category" value="Fake KYC" icon={Filter} accent="text-[#f59e0b]" />
        <StatCard label="Demo data" value="Illustrative" icon={Users} accent="text-[#858585]" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">
              {selected ? `Scam activity — ${selected.state}` : "Scam activity — India"}
            </h3>
            <select
              value={selected?.state ?? ""}
              onChange={(e) => {
                const st = data?.points.find((p) => p.state === e.target.value) ?? null;
                setSelected(st);
              }}
              className="rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-1.5 text-xs text-[#111111] focus:border-blue-400 focus:outline-none"
            >
              {(data?.points ?? []).map((p) => (
                <option key={p.state} value={p.state}>
                  {p.state} · {p.reports.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            {GOOGLE_KEY && cities.length > 0 ? (
              <GooglePinMap
                cities={cities}
                selectedCity={selectedCity}
                onSelect={(c) => {
                  setSelectedCity(c);
                  setSelected(null);
                }}
                onUnavailable={() => {}}
                height={420}
              />
            ) : (
              <GoogleMapEmbed
                lat={mapLat}
                lng={mapLng}
                zoom={mapZoom}
                label={mapLabel}
                height={420}
              />
            )}

            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 700 }}>
              {categoryTotals.length > 0 && (
                <div className="absolute right-3 top-3 max-w-[260px] rounded-xl border border-black/[0.06] bg-white/95 p-3 shadow-xl backdrop-blur" style={{ pointerEvents: "auto" }}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#2563eb]">
                    Reports by category{period ? ` (${period})` : ""}
                  </p>
                  <CategoryDonut data={categoryTotals} />
                </div>
              )}
              {selectedCity && (
                <div style={{ pointerEvents: "auto" }}>
                  <LocationPopup
                    title={selectedCity.city}
                    subtitle={selectedCity.state}
                    reports={selectedCity.reports}
                    scams={selectedCity.scams}
                    onClose={() => setSelectedCity(null)}
                  />
                </div>
              )}
              {!selectedCity && selected && (
                <div style={{ pointerEvents: "auto" }}>
                  <LocationPopup
                    title={selected.state}
                    subtitle="State"
                    reports={selected.reports}
                    scams={selected.scams}
                  />
                </div>
              )}
            </div>
          </div>
          {selected && (
            <p className="mt-2 text-center text-xs text-[#858585]">
              {selected.reports.toLocaleString()} reports in {selected.state} · KYC {selected.scams.kyc} · Delivery {selected.scams.delivery} · UPI {selected.scams.upi}
            </p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Reports by category ({period})</h3>
          {categoryTotals.length > 0 ? (
            <div className="space-y-2">
              {categoryTotals.map((c) => {
                const total = categoryTotals.reduce((a, b) => a + b.value, 0);
                const pct = total ? Math.round((c.value / total) * 100) : 0;
                return (
                  <div key={c.key}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[#858585]">{c.name}</span>
                      <span className="font-medium text-[#111111]">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#f9f9f9]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: CATEGORY_COLORS[c.key] || "#8aa0bd" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#858585]">Loading…</p>
          )}
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <h3 className="mb-3 text-sm font-semibold">Top states by reports</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis type="number" stroke="#858585" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#111111" }} />
            <YAxis dataKey="state" type="category" stroke="#858585" fontSize={11} tickLine={false} axisLine={false} width={110} tick={{ fill: "#111111" }} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, fontSize: 12, color: "#111111" }} labelStyle={{ color: "#111111" }} itemStyle={{ color: "#111111" }} cursor={{ fill: "rgba(37,99,235,0.05)" }} />
            <Bar dataKey="reports" radius={[0, 6, 6, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill="#2563eb" fillOpacity={1 - i * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2563eb]" />
          <h3 className="text-sm font-semibold">Specific locations</h3>
          <span className="text-xs text-[#858585]">— click a city to view it on the map</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cities.length === 0 && <p className="text-xs text-[#858585]">Loading locations…</p>}
          {cities.map((c) => {
            const isActive = selectedCity?.city === c.city;
            return (
              <button
                key={c.city}
                onClick={() => {
                  setSelectedCity(c);
                  setSelected(null);
                }}
                className={`rounded-xl border p-3 text-left transition-colors ${isActive ? "border-blue-400 bg-blue-50/50" : "border-black/[0.06] bg-[#f9f9f9]/50 hover:border-blue-200"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#2563eb]" /> {c.city}
                  </span>
                  <span className="text-xs text-[#858585]">{c.reports.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#858585]">{c.state} · {c.top}</p>
              </button>
            );
          })}
        </div>
        {selectedCity && (
          <p className="mt-3 rounded-lg bg-blue-50/50 p-3 text-xs text-[#858585]">
            <span className="font-semibold text-[#2563eb]">{selectedCity.city}</span> — {selectedCity.reports.toLocaleString()} reports · KYC {selectedCity.scams.kyc} · Delivery {selectedCity.scams.delivery} · UPI {selectedCity.scams.upi} · Phishing {selectedCity.scams.phishing} · QR {selectedCity.scams.qr}
          </p>
        )}
      </Card>

      <p className="mt-4 text-center text-xs text-[#858585]">
        Aggregated demo dataset — figures are illustrative and not live statistics.
      </p>
    </div>
  );
}