import { NextRequest, NextResponse } from "next/server";
import { THREAT_ENTITIES } from "@/lib/seed";
import { guardRead } from "@/lib/api";

export async function GET(req: NextRequest) {
 const g = guardRead(req, "threats-read", 60, 60_000);
 if (!g.ok) return g.response;

 // Build graph nodes/edges for the threat intelligence graph.
 const nodes = THREAT_ENTITIES.map((e) => ({
 id: e.id,
 label: e.value,
 type: e.type,
 risk: e.risk,
 reports: e.reports,
 campaign: e.campaign,
 }));
 const edges = THREAT_ENTITIES.flatMap((e) =>
 e.links.map((id) => ({ source: e.id, target: id })),
 );

 return NextResponse.json(
 {
 nodes,
 edges,
 entities: THREAT_ENTITIES,
 campaigns: [...new Set(THREAT_ENTITIES.map((e) => e.campaign))],
 demo: true,
 note: "Illustrative threat graph — not a verified database.",
 },
 { headers: g.headers },
 );
}