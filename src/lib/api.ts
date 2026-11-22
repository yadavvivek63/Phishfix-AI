import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

// Shared request helpers for API routes: IP extraction, JSON error helpers,
// validation wrappers, and read rate limiting.
export function clientKey(req: NextRequest, scope: string): string {
 const ip =
 req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
 req.headers.get("x-real-ip") ||
 "local";
 return `${scope}:${ip}`;
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
 return NextResponse.json({ error: message, ...extra }, { status });
}

export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown) {
 return schema.safeParse(data);
}

export type ReadGuard =
 | { ok: true; headers: Record<string, string> }
 | { ok: false; response: NextResponse };

/**
 * Rate-limit a request (any method) per client IP. Returns the headers to attach
 * on success, or a ready-to-return 429 response when the limit is exceeded.
 */
export function guard(
 req: NextRequest,
 scope: string,
 limit = 60,
 windowMs = 60_000,
): ReadGuard {
 const r = rateLimit(clientKey(req, scope), limit, windowMs);
 if (!r.ok) {
 return {
 ok: false,
 response: NextResponse.json(
 { error: "Rate limit reached — too many requests. Please wait a moment.", retryAfter: r.retryAfter },
 { status: 429, headers: rateLimitHeaders(r) },
 ),
 };
 }
 return { ok: true, headers: rateLimitHeaders(r) };
}

/** Alias kept for readability on read (GET) endpoints. */
export const guardRead = guard;