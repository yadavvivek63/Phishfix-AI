import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanMessage } from "@/lib/scanner";
import { guard, jsonError } from "@/lib/api";

const schema = z.object({
 text: z.string().min(3).max(8000),
 source: z.enum(["ocr", "qr", "text"]).default("text"),
});

// Analyze text extracted from a screenshot (OCR) or QR code.
export async function POST(req: NextRequest) {
 const g = guard(req, "image", 20, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }
 const parsed = schema.safeParse(body);
 if (!parsed.success) return jsonError("Provide extracted text.");

 const base = scanMessage(parsed.data.text);
 return NextResponse.json(
 {
 ...base,
 kind: "image",
 indicators: { ...base.indicators, extractionSource: parsed.data.source },
 },
 { headers: g.headers },
 );
}