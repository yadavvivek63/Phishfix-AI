import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanUrl } from "@/lib/scanner";
import { guard, jsonError } from "@/lib/api";

const schema = z.object({ url: z.string().min(3).max(2000) });

/**
 * Cloud Sandbox — 100% free, no API key, no external services.
 *
 * Performs a full structural investigation of a suspicious URL entirely on the
 * server using local heuristics: it parses the URL, scores redirect risk,
 * estimates fake-login likelihood, extracts domain reputation signals and
 * returns a complete investigation report. It never contacts the target site.
 */
export async function POST(req: NextRequest) {
 const g = guard(req, "sandbox", 10, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }
 const parsed = schema.safeParse(body);
 if (!parsed.success) return jsonError("A valid URL is required.");

 const url = parsed.data.url;
 const scan = scanUrl(url);

 let host = "";
 let registrable = "";
 try {
 const u = new URL(/^https?:\/\//i.test(url) ? url : "http://" + url);
 host = u.hostname.toLowerCase();
 registrable = host.split(".").slice(-2).join(".");
 } catch {
 /* scanUrl already reported malformed */
 }

 const loginSignals = scan.signals.filter((s) =>
 ["path-phish", "brand", "query-pii", "at", "punycode", "ip-host"].some((k) => s.id.startsWith(k)),
 );
 const fakeLogin =
 loginSignals.length >= 2 ? "high" : loginSignals.length === 1 ? "possible" : "low";

 const redirectRisk =
 scan.signals.find((s) => s.id === "shortener") ? "high"
 : scan.indicators.subdomains && (scan.indicators.subdomains as number) >= 4 ? "medium"
 : "low";

 const report = {
 target: url,
 inspectedAt: new Date().toISOString(),
 mode: "free-local",
 note: "Full structural investigation performed locally — no API key and no live request to the target site.",
 host,
 registrableDomain: registrable,
 redirects: {
 risk: redirectRisk,
 chain: [] as string[],
 note: "Redirect risk is estimated from URL structure (shorteners, deep subdomains).",
 },
 fakeLogin,
 findings: scan.signals.map((s) => ({ severity: s.severity, title: s.label, detail: s.detail })),
 risk: scan.verdict,
 riskScore: scan.riskScore,
 confidence: scan.confidence,
 verdict: scan.summary,
 };

 return NextResponse.json(report, { headers: g.headers });
}