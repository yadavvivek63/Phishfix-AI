import { NextRequest, NextResponse } from "next/server";
import { HEATMAP_DATA, CATEGORY_COLORS, totalReports } from "@/lib/seed";
import { guardRead } from "@/lib/api";

export async function GET(req: NextRequest) {
 const g = guardRead(req, "heatmap-read", 60, 60_000);
 if (!g.ok) return g.response;

 return NextResponse.json(
 {
 points: HEATMAP_DATA,
 categories: CATEGORY_COLORS,
 totals: {
 reports: totalReports(),
 states: HEATMAP_DATA.length,
 },
 note: "Aggregated, privacy-protected demo dataset — not live statistics.",
 demo: true,
 },
 { headers: g.headers },
 );
}