import type { Risk, ScanResult } from "./types";

const RISK_ORDER: Record<Risk, number> = { safe: 0, low: 1, medium: 2, high: 3, critical: 4 };

export function riskFromScore(score: number): Risk {
 if (score >= 80) return "critical";
 if (score >= 55) return "high";
 if (score >= 30) return "medium";
 if (score >= 12) return "low";
 return "safe";
}

export function combineRisk(a: Risk, b: Risk): Risk {
 return RISK_ORDER[a] >= RISK_ORDER[b] ? a : b;
}

interface Signal {
 id: string;
 label: string;
 severity: Risk;
 detail: string;
 weight: number;
}

const SEV_WEIGHT: Record<Risk, number> = { safe: 0, low: 8, medium: 18, high: 28, critical: 40 };

function buildResult(
 kind: ScanResult["kind"],
 input: string,
 signals: Signal[],
 indicators: Record<string, unknown>,
): ScanResult {
 let raw = signals.reduce((acc, s) => acc + s.weight, 0);
 // diminishing returns so many medium signals don't instantly hit 100
 raw = 100 - 100 * Math.exp(-raw / 90);
 const riskScore = Math.max(0, Math.min(100, Math.round(raw)));
 const verdict = riskFromScore(riskScore);

 let summary: string;
 if (riskScore < 12) summary = "No strong scam indicators detected. Stay cautious with any request for money or credentials.";
 else if (riskScore < 30) summary = "Some suspicious patterns found. Verify the source independently before trusting it.";
 else if (riskScore < 55) summary = "Multiple scam indicators detected. Treat this as suspicious and avoid interacting.";
 else if (riskScore < 80) summary = "High risk. Strong scam signals present. Do not click, pay, or share personal data.";
 else summary = "Critical risk. This matches known scam behaviour. Do not engage; report it immediately.";

 const confidence = Math.min(96, 55 + signals.length * 7);

 return {
 kind,
 input,
 verdict,
 riskScore,
 confidence,
 summary,
 signals: signals
 .filter((s) => s.severity !== "safe")
 .sort((a, b) => RISK_ORDER[b.severity] - RISK_ORDER[a.severity]),
 indicators,
 demo: false,
 scannedAt: new Date().toISOString(),
 };
}

/* ----------------------------- URL analysis ----------------------------- */

const URL_SHORTENERS = [
 "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
 "rebrand.ly", "cutt.ly", "shorturl.at", "rb.gy", "tiny.cc",
];
const SUSPICIOUS_TLDS = [
 "xyz", "top", "click", "link", "work", "gq", "tk", "ml", "cf", "buzz",
 "rest", "cam", "icu", "zip", "mov", "country", "stream", "download",
];
const BRAND_KEYWORDS = [
 "paytm", "phonepe", "gpay", "sbi", "hdfc", "icici", "axis", "kotak",
 "amazon", "flipkart", "myntra", "whatsapp", "netflix", "paypal", "kyc",
 "delivery", "courier", "dtdc", "bluedart", "epost", "india-post",
];
const PHISH_PATH_HINTS = ["login", "signin", "verify", "kyc", "update", "secure", "account", "billing", "wallet", "otp", "reward", "claim", "refund"];

function analyzeUrl(input: string): ScanResult {
 const signals: Signal[] = [];
 const indicators: Record<string, unknown> = {};
 let raw = input.trim();
 if (!/^https?:\/\//i.test(raw)) raw = "http://" + raw;

 let url: URL;
 try {
 url = new URL(raw);
 } catch {
 return buildResult("url", input, [
 { id: "invalid", label: "Malformed URL", severity: "high", detail: "The input is not a valid URL.", weight: SEV_WEIGHT.high },
 ], indicators);
 }

 const host = url.hostname.toLowerCase();
 const full = url.href.toLowerCase();
 indicators.hostname = host;
 indicators.protocol = url.protocol;
 indicators.subdomains = host.split(".").length - 2;

 // Punycode / IDN homograph
 if (host.includes("xn--")) {
 signals.push({ id: "punycode", label: "Punycode domain", severity: "high", detail: "Domain uses punycode, often used to spoof look-alike domains.", weight: SEV_WEIGHT.high });
 }

 // @ in URL
 if (url.username || url.password || full.includes("@") && !full.includes("://")) {
 signals.push({ id: "at", label: "Credentials in URL", severity: "high", detail: "URL contains embedded credentials or an @ trick.", weight: SEV_WEIGHT.high });
 }

 // IP-based host
 if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
 signals.push({ id: "ip-host", label: "Raw IP address", severity: "high", detail: "Legitimate services rarely use raw IP addresses in links.", weight: SEV_WEIGHT.high });
 }

 // Brand keyword in subdomain but different registrable domain (classic phishing)
 const parts = host.split(".");
 const registrable = parts.slice(-2).join(".");
 for (const brand of BRAND_KEYWORDS) {
 if (host.includes(brand) && !registrable.includes(brand)) {
 signals.push({ id: `brand-${brand}`, label: `Spoofed brand (${brand})`, severity: "critical", detail: `"${brand}" appears in the subdomain, not the real domain — a common phishing trick.`, weight: SEV_WEIGHT.critical });
 break;
 }
 }

 // Suspicious TLD
 const tld = parts[parts.length - 1];
 if (SUSPICIOUS_TLDS.includes(tld)) {
 signals.push({ id: "tld", label: `Risky TLD (.${tld})`, severity: "medium", detail: `The .${tld} top-level domain is frequently abused for scams.`, weight: SEV_WEIGHT.medium });
 }

 // Shortener
 if (URL_SHORTENERS.includes(host) || URL_SHORTENERS.includes(registrable)) {
 signals.push({ id: "shortener", label: "URL shortener", severity: "medium", detail: "Shortened links hide the true destination. Expand and verify first.", weight: SEV_WEIGHT.medium });
 }

 // Too many subdomains
 if ((indicators.subdomains as number) >= 4) {
 signals.push({ id: "many-sub", label: "Deep subdomain chain", severity: "medium", detail: "Many nested subdomains are used to obscure the real domain.", weight: SEV_WEIGHT.medium });
 }

 // Long host
 if (host.length > 40) {
 signals.push({ id: "long-host", label: "Unusually long hostname", severity: "low", detail: "Very long hostnames are often used to push the real domain off-screen.", weight: SEV_WEIGHT.low });
 }

 // Numeric-heavy host
 if (/\d{3,}/.test(host) && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
 signals.push({ id: "numeric-host", label: "Random-looking hostname", severity: "low", detail: "Long numeric strings in the hostname are typical of auto-generated scam domains.", weight: SEV_WEIGHT.low });
 }

 // Path hints
 const pathHints = PHISH_PATH_HINTS.filter((h) => full.includes(h));
 indicators.pathHints = pathHints;
 if (pathHints.length >= 1 && pathHints.some((p) => ["kyc", "otp", "verify", "login", "signin", "update"].includes(p))) {
 signals.push({ id: "path-phish", label: "Credential-harvesting path", severity: "high", detail: `URL path references sensitive actions (${pathHints.join(", ")}).`, weight: SEV_WEIGHT.high });
 }

 // HTTP (insecure)
 if (url.protocol === "http:") {
 signals.push({ id: "http", label: "No HTTPS", severity: "low", detail: "The page does not use an encrypted connection.", weight: SEV_WEIGHT.low });
 }

 // Sensitive query params
 const sensitiveParams = ["otp", "pin", "password", "card", "cvv", "upi"];
 const foundParams = sensitiveParams.filter((p) => full.includes(p + "="));
 indicators.sensitiveParams = foundParams;
 if (foundParams.length) {
 signals.push({ id: "query-pii", label: "Sensitive data in URL", severity: "high", detail: `URL requests sensitive data: ${foundParams.join(", ")}. Never submit these.`, weight: SEV_WEIGHT.high });
 }

 if (signals.length === 0) {
 signals.push({ id: "clean", label: "No obvious signals", severity: "safe", detail: "No heuristic red flags found. This does not guarantee safety — verify independently.", weight: 0 });
 }

 return buildResult("url", input, signals, indicators);
}

/* --------------------------- Message analysis --------------------------- */

const KYC_PATTERNS = [
 /kyc/i, /e-?kyc/i, /update your kyc/i, /kyc (update|verification|pending|expired)/i,
 /your account will be (blocked|suspended|closed)/i, /aadhaar|pan card|aadhar/i,
];
const DELIVERY_PATTERNS = [
 /delivery (failed|pending|attempt|issue)/i, /your (parcel|package|order|shipment)/i,
 /reschedule (your )?delivery/i, /customs (fee|charge|duty)/i, /redelivery/i, /track your (parcel|shipment)/i,
 /dtdc|bluedart|fedex|india[- ]?post|amazon|flipkart/i,
];
const PAYMENT_PATTERNS = [
 /pay(ment)? (failed|pending|request|link)/i, /refund (pending|failed|of|is)/i,
 /receive (a )?payment/i, /you (have )?(won|received) (a )?(prize|reward|cashback|lottery)/i,
 /claim (your )?(reward|prize|money)/i, /verify (your )?(bank|account|upi)/i,
 /upi|paytm|phonepe|gpay|google pay/i,
];
const URGENCY = [
 /urgent/i, /immediately/i, /within \d+ (min|hour)/i, /act now/i, /limited time/i,
 /last chance/i, /expires? (today|soon)/i, /only \d+ (left|remaining)/i, /hurry/i,
];
const LINK_RE = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

function analyzeMessage(input: string): ScanResult {
 const signals: Signal[] = [];
 const indicators: Record<string, unknown> = {};
 const text = input;

 const hit = (arr: RegExp[]) => arr.filter((r) => r.test(text)).length;

 const kyc = hit(KYC_PATTERNS);
 const delivery = hit(DELIVERY_PATTERNS);
 const payment = hit(PAYMENT_PATTERNS);
 const urgency = hit(URGENCY);
 indicators.categories = { kyc, delivery, payment, urgency };

 if (kyc > 0) signals.push({ id: "kyc", label: "Fake KYC language", severity: "critical", detail: "Requests to 'update/verify KYC' are a dominant Indian scam pretext. Legit banks never ask via SMS/WhatsApp links.", weight: SEV_WEIGHT.critical });
 if (delivery > 0) signals.push({ id: "delivery", label: "Delivery scam pattern", severity: "high", detail: "Delivery/customs-fee messages with links are a common courier scam.", weight: SEV_WEIGHT.high });
 if (payment > 0) signals.push({ id: "payment", label: "Payment / refund lure", severity: "high", detail: "Requests to claim money, receive refunds, or verify bank/UPI are typical fraud lures.", weight: SEV_WEIGHT.high });
 if (urgency >= 1) signals.push({ id: "urgency", label: "Urgency / pressure", severity: urgency >= 2 ? "high" : "medium", detail: "Scammers create false urgency to rush you past verification.", weight: urgency >= 2 ? SEV_WEIGHT.high : SEV_WEIGHT.medium });

 const links = text.match(LINK_RE) || [];
 indicators.links = links;
 if (links.length > 0) {
 signals.push({ id: "has-link", label: "Contains a link", severity: "medium", detail: "Message contains a link — scan it separately before clicking.", weight: SEV_WEIGHT.medium });
 }

 // Ask for sensitive info
 if (/(otp|pin|password|cvv|card number|aadhaar number|bank password)/i.test(text)) {
 signals.push({ id: "ask-pii", label: "Asks for sensitive info", severity: "critical", detail: "No legitimate entity asks for OTP, PIN, password, CVV or full Aadhaar over a message.", weight: SEV_WEIGHT.critical });
 }

 // Impersonation of authority
 if (/(income tax|police|cbi|cyber ?crime|lic|sbi|hdfc|icici|axis|uidai|trai)/i.test(text)) {
 signals.push({ id: "impersonation", label: "Authority / brand impersonation", severity: "high", detail: "References a bank, government body or brand — often impersonated in scams.", weight: SEV_WEIGHT.high });
 }

 // Spelling pressure / all caps
 const capsRatio = (text.match(/[A-Z]/g) || []).length / Math.max(1, text.length);
 if (capsRatio > 0.5 && text.length > 20) {
 signals.push({ id: "caps", label: "Shouting (ALL CAPS)", severity: "low", detail: "Heavy use of capitals is a pressure tactic.", weight: SEV_WEIGHT.low });
 }

 if (signals.length === 0) {
 signals.push({ id: "clean", label: "No obvious signals", severity: "safe", detail: "No common scam phrases detected. Always verify requests for money or data independently.", weight: 0 });
 }

 return buildResult("message", input, signals, indicators);
}

/* ----------------------------- UPI analysis ----------------------------- */

const UPI_RE = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

function analyzeUpi(input: string): ScanResult {
 const signals: Signal[] = [];
 const indicators: Record<string, unknown> = {};
 const v = input.trim();

 if (!UPI_RE.test(v)) {
 signals.push({ id: "format", label: "Invalid UPI format", severity: "medium", detail: "This does not look like a valid UPI ID (e.g. name@bank).", weight: SEV_WEIGHT.medium });
 return buildResult("upi", input, signals, indicators);
 }

 const [handle, provider] = v.toLowerCase().split("@");
 indicators.handle = handle;
 indicators.provider = provider;

 // Virtual payment address abuse indicators
 const abuseWords = ["fraud", "scam", "fake", "test", "temp", "x", "verify", "kyc"];
 if (abuseWords.some((w) => handle.includes(w))) {
 signals.push({ id: "abuse-name", label: "Suspicious handle", severity: "high", detail: "Handle contains words often used in throwaway scam accounts.", weight: SEV_WEIGHT.high });
 }
 if (handle.length < 3 || /\d{6,}/.test(handle)) {
 signals.push({ id: "random-handle", label: "Auto-generated-looking handle", severity: "medium", detail: "Handles with long digit runs are common in mule accounts.", weight: SEV_WEIGHT.medium });
 }
 // Known abused-ish providers heavily used in scams get a light flag
 const lightProviders = ["ybl", "ibl", "axl", "paytm", "okaxis", "oksbi", "okhdfc"];
 if (lightProviders.includes(provider)) {
 indicators.note = "This provider handle can be legitimate or abused; check the full handle.";
 }

 if (signals.length === 0) {
 signals.push({ id: "format-ok", label: "Format looks valid", severity: "safe", detail: "Format is valid, but reputation cannot be confirmed without a threat database. Verify the recipient's identity directly.", weight: 0 });
 }
 return buildResult("upi", input, signals, indicators);
}

/* ---------------------------- Phone analysis ---------------------------- */

const PHONE_RE = /^(\+?\d[\d\s-]{7,14}\d)$/;
function analyzePhone(input: string): ScanResult {
 const signals: Signal[] = [];
 const indicators: Record<string, unknown> = {};
 const digits = input.replace(/\D/g, "");
 if (!PHONE_RE.test(input.trim()) || digits.length < 10 || digits.length > 15) {
 signals.push({ id: "format", label: "Malformed phone number", severity: "medium", detail: "Enter a valid phone number with country code.", weight: SEV_WEIGHT.medium });
 return buildResult("phone", input, signals, indicators);
 }
 const country = digits.slice(0, digits.length - 10);
 indicators.countryCode = country;
 if (digits.length === 10) {
 signals.push({ id: "no-cc", label: "No country code", severity: "low", detail: "Consider verifying with the country code included.", weight: SEV_WEIGHT.low });
 }
 if (/^(\d)\1{9,}$/.test(digits)) {
 signals.push({ id: "repeat", label: "Repeated digits", severity: "high", detail: "Repeated-digit numbers are frequently used by scammers.", weight: SEV_WEIGHT.high });
 }
 if (signals.length === 0) {
 signals.push({ id: "format-ok", label: "Format looks valid", severity: "safe", detail: "Format is valid. Unknown numbers should still be verified before sharing OTPs or paying.", weight: 0 });
 }
 return buildResult("phone", input, signals, indicators);
}

/* ------------------------------ Dispatcher ------------------------------ */

export function scanUrl(input: string): ScanResult {
 return analyzeUrl(input);
}
export function scanMessage(input: string): ScanResult {
 return analyzeMessage(input);
}
export function scanUpi(input: string): ScanResult {
 return analyzeUpi(input);
}
export function scanPhone(input: string): ScanResult {
 return analyzePhone(input);
}

export const RISK_META: Record<Risk, { label: string; color: string; bg: string }> = {
  safe: { label: "Safe", color: "text-[#22c55e]", bg: "bg-green-50" },
  low: { label: "Low", color: "text-[#22c55e]", bg: "bg-green-50" },
  medium: { label: "Suspicious", color: "text-[#f59e0b]", bg: "bg-amber-50" },
  high: { label: "High Risk", color: "text-[#ef4444]", bg: "bg-red-50" },
  critical: { label: "Critical", color: "text-[#ef4444]", bg: "bg-red-100" },
};