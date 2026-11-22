import { NextRequest, NextResponse } from "next/server";
import { INDIAN_CITIES } from "@/lib/seed";
import { guardRead } from "@/lib/api";

// Specific city-level scam locations (demo, aggregated & privacy-protected).
export async function GET(req: NextRequest) {
 const g = guardRead(req, "locations-read", 60, 60_000);
 if (!g.ok) return g.response;

 const total = INDIAN_CITIES.reduce((a, b) => a + b.reports, 0);
 return NextResponse.json(
 {
 locations: INDIAN_CITIES,
 totals: { cities: INDIAN_CITIES.length, reports: total },
 demo: true,
 note: "Aggregated, privacy-protected demo dataset — not live statistics.",
 },
 { headers: g.headers },
 );
}