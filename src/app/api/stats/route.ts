import { NextRequest, NextResponse } from "next/server";
import { totalReports, THREAT_ENTITIES } from "@/lib/seed";
import { guardRead } from "@/lib/api";

export async function GET(req: NextRequest) {
 const g = guardRead(req, "stats-read", 60, 60_000);
 if (!g.ok) return g.response;

 const reports = totalReports();
 const threats = THREAT_ENTITIES.length;
 const confirmed = THREAT_ENTITIES.filter((e) => e.risk >= 70).length;
 return NextResponse.json(
 {
 totalReports: reports,
 activeThreats: threats,
 confirmedThreats: confirmed,
 protectedUsers: 12480, // illustrative
 demo: true,
 note: "Dashboard figures are illustrative demo data, not live statistics.",
 },
 { headers: g.headers },
 );
}