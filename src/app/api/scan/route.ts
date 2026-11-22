import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanUrl, scanMessage, scanUpi, scanPhone } from "@/lib/scanner";
import { guard, jsonError } from "@/lib/api";

const schema = z.object({
 kind: z.enum(["url", "message", "upi", "phone"]),
 input: z.string().min(3, "Input must be at least 3 characters.").max(4000),
});

export async function POST(req: NextRequest) {
 const g = guard(req, "scan", 30, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }

 const parsed = schema.safeParse(body);
 if (!parsed.success) {
 return jsonError(parsed.error.issues[0]?.message || "Invalid input.");
 }

 const { kind, input } = parsed.data;
 const headers = g.headers;

 switch (kind) {
 case "url":
 return NextResponse.json(scanUrl(input), { headers });
 case "message":
 return NextResponse.json(scanMessage(input), { headers });
 case "upi":
 return NextResponse.json(scanUpi(input), { headers });
 case "phone":
 return NextResponse.json(scanPhone(input), { headers });
 }
}