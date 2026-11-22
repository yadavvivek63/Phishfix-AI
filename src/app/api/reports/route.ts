import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { COMMUNITY_REPORTS } from "@/lib/seed";
import { jsonError, guardRead, guard } from "@/lib/api";

const createSchema = z.object({
 category: z.string().min(2).max(60),
 target: z.string().min(2).max(300),
 description: z.string().min(10).max(2000),
 state: z.string().min(2).max(60),
});

// Demo in-memory store so new reports persist for the session.
const reports = [...COMMUNITY_REPORTS];

export async function GET(req: NextRequest) {
 const g = guardRead(req, "reports-read", 60, 60_000);
 if (!g.ok) return g.response;
 return NextResponse.json({ reports, demo: true }, { headers: g.headers });
}

export async function POST(req: NextRequest) {
 const g = guard(req, "report", 5, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }
 const parsed = createSchema.safeParse(body);
 if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid report.");

 const report = {
 id: `r${Date.now()}`,
 ...parsed.data,
 createdAt: new Date().toISOString(),
 status: "open" as const,
 reports: 1,
 };
 reports.unshift(report);
 return NextResponse.json(report, { status: 201, headers: g.headers });
}