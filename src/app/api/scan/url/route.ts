import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { guard, jsonError } from "@/lib/api";
import { z } from "zod";

const schema = z.object({ url: z.string().min(3).max(2000) });

export async function POST(req: NextRequest) {
 const g = guard(req, "url", 30, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }
 const parsed = schema.safeParse(body);
 if (!parsed.success) return jsonError("A valid URL is required.");
 return NextResponse.json(scanUrl(parsed.data.url), { headers: g.headers });
}