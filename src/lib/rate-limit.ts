// Lightweight in-memory fixed-window rate limiter. Good enough for a single
// node instance / demo. For production multi-instance, use Redis.
interface Bucket {
 count: number;
 resetAt: number;
}
const store = new Map<string, Bucket>();

export interface RateLimitResult {
 ok: boolean;
 limit: number;
 remaining: number;
 retryAfter: number;
 resetAt: number;
}

export function rateLimit(key: string, limit = 20, windowMs = 60_000): RateLimitResult {
 const now = Date.now();
 const bucket = store.get(key);
 if (!bucket || bucket.resetAt <= now) {
 store.set(key, { count: 1, resetAt: now + windowMs });
 return { ok: true, limit, remaining: limit - 1, retryAfter: 0, resetAt: now + windowMs };
 }
 bucket.count += 1;
 if (bucket.count > limit) {
 return { ok: false, limit, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000), resetAt: bucket.resetAt };
 }
 return { ok: true, limit, remaining: limit - bucket.count, retryAfter: 0, resetAt: bucket.resetAt };
}

// Standard rate-limit headers (draft RateLimit header fields).
export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
 return {
 "x-ratelimit-limit": String(r.limit),
 "x-ratelimit-remaining": String(Math.max(0, r.remaining)),
 "x-ratelimit-reset": String(Math.ceil(r.resetAt / 1000)),
 ...(r.retryAfter > 0 ? { "retry-after": String(r.retryAfter) } : {}),
 };
}

// Basic cleanup so the map doesn't grow unbounded.
setInterval(() => {
 const now = Date.now();
 for (const [k, v] of store) {
 if (v.resetAt <= now) store.delete(k);
 }
}, 120_000).unref?.();