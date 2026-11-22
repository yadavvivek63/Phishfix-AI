# Phishfix AI

**Detect. Investigate. Protect.**

An all-in-one AI-powered scam detection and cybersecurity platform built to protect
Indian users from fake KYC messages, WhatsApp/SMS scams, phishing websites, fraudulent
UPI requests, fake delivery messages, malicious QR codes and suspicious phone numbers.

Built for a national-level hackathon demonstration. Free and open-source — no paid APIs
are required to run the core experience.

---

## Features

- **Advanced URL Scanner** — domain reputation signals, brand-spoofing detection,
  risky TLDs, URL shorteners, raw-IP hosts, credential-harvesting paths, sensitive params.
- **Message Scanner** — detects fake KYC, delivery, payment/refund and urgency scams in
  SMS / WhatsApp text, with a risk score and explainable reasons.
- **QR & Image Scanner** — decodes QR codes (jsQR) and runs on-device OCR (Tesseract.js)
  on screenshots, then risk-analyzes the extracted content.
- **UPI & Phone Checker** — flags suspicious UPI handles and phone number patterns.
- **AI Cyber Safety Assistant** — step-by-step safety guidance in Hindi and English,
  with emergency instructions. Uses a local LLM via **Ollama** when configured, otherwise
  a transparent rule-based assistant (clearly labelled "local mode").
- **Cloud Sandbox** — isolated, *static* inspection of suspicious URLs (never visits the
  target from the main server). Includes a documented worker architecture for live
  Playwright capture behind a firewall.
- **India Scam Heatmap** — state-wise scam activity on a **keyless Google Map** (free, no API
  key) with a state selector, weekly/monthly trends and category breakdowns (aggregated,
  privacy-protected demo data; Google tiles require internet).
- **Threat Intelligence Dashboard** — visual threat graph + scam family tree connecting
  URLs, domains, phones and UPI IDs.
- **Real-Time Browser Protection** — downloadable Chrome extension starter (Manifest V3)
  that warns before visiting known-malicious URLs.
- **Community Reporting Portal** — submit and browse scam reports.
- **Profile & Settings**, **Admin Dashboard**, **Digital Emergency Mode** (global modal).

### Advanced capabilities
Scam DNA Detection · Scam Family Tree · Digital Emergency Mode · Threat Intelligence
Graph · Multilingual (Hindi/English) · Deepfake detection framework · AI Scam Explanation.

---

## Tech Stack

| Layer      | Choice |
|------------|--------|
| Frontend   | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Backend    | Node.js via Next.js API routes |
| Charts     | Recharts |
| Maps       | Keyless Google Maps embed (free, no API key) |
| OCR        | Tesseract.js (runs in-browser) |
| QR decode  | jsQR (runs in-browser) |
| Validation | Zod |
| AI         | Ollama (local LLM) — optional |
| Icons      | Lucide |
| Extension  | Chrome Manifest V3 starter |

The scaffold targets PostgreSQL for persistence in production. This demo keeps community
reports in an in-memory store and serves aggregated datasets from `src/lib/seed.ts` — no
database is required to run locally.

---

## Getting Started

### Prerequisites
- Node.js 20+ (tested on Node 26)
- npm

### Install & run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

### Production build
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

---

## Configuration

## Configuration — Free, No API Keys

**Phishfix runs 100% free with no API keys and no configuration.** Every feature
(scanners, QR/OCR, assistant, sandbox, heatmap, threat graph, reporting) works out of the
box using local, open-source logic. There is nothing to sign up for and no key to paste.

There are **no** optional environment variables required to run the product. The only
optional enhancement is pointing the assistant at a locally running Ollama model — if you
want a generative LLM instead of the built-in free assistant. This is entirely optional:

| Variable        | Default    | Description |
|-----------------|------------|-------------|
| `OLLAMA_URL`    | _(unset)_  | Optional. Base URL of a local Ollama server. Unset = use the built-in free assistant. |
| `OLLAMA_MODEL`  | `llama3.2` | Optional. Ollama model name. |

### Optional: use a local LLM (not required)
1. Install Ollama: https://ollama.com
2. Pull a model: `ollama pull llama3.2`
3. Set `OLLAMA_URL=http://localhost:11434` in `.env.local`
4. Restart the dev server.

If Ollama is not set or unreachable, the assistant automatically uses the built-in free
cyber-safety assistant (Hindi + English) — no key, no setup, no interruption.

---

## Project Structure

```
src/
├── app/
│   ├── (app)/              # App shell (sidebar + topbar) for all product pages
│   │   ├── page.tsx        # Landing page
│   │   ├── dashboard/      # Security dashboard
│   │   ├── scanner/        # message, url, qr, image, upi
│   │   ├── sandbox/        # Cloud sandbox
│   │   ├── assistant/      # AI cyber assistant
│   │   ├── heatmap/        # India scam heatmap
│   │   ├── threats/        # Threat intelligence + family tree
│   │   ├── browser/        # Chrome extension download
│   │   ├── report/         # Community reporting
│   │   ├── profile/        # Settings
│   │   └── admin/          # Admin dashboard
│   └── api/                # Route handlers (scan, image, heatmap, threats, stats, reports, assistant, sandbox)
├── components/             # Reusable UI (sidebar, topbar, cards, gauges, charts, maps, emergency mode, scanners)
└── lib/                    # scanner engine, seed data, rate limiter, types, nav
```

---

## API Endpoints

| Method | Route              | Purpose |
|--------|--------------------|---------|
| POST   | `/api/scan`        | Scan `{kind: url\|message\|upi\|phone, input}` |
| POST   | `/api/scan/url`    | Convenience URL scan |
| POST   | `/api/scan/image`  | Analyze `{text}` extracted from OCR/QR |
| GET    | `/api/heatmap`     | State-wise scam heatmap data |
| GET    | `/api/threats`     | Threat graph nodes/edges + entities |
| GET    | `/api/stats`       | Dashboard summary (demo) |
| GET/POST | `/api/reports`   | List / create community reports |
| POST   | `/api/assistant`   | Chat `{message, history}` → `{reply, source}` |
| POST   | `/api/sandbox`     | Static inspection report for a URL |

### Rate limits (per client IP, per minute)
All endpoints validate input with Zod and apply per-IP rate limiting. Responses include
`x-ratelimit-limit`, `x-ratelimit-remaining` and `x-ratelimit-reset` headers; when the
limit is exceeded the API returns `429` with a `retry-after` header.

| Endpoint | Method | Limit / min |
|----------|--------|-------------|
| `/api/heatmap`, `/api/threats`, `/api/stats`, `/api/reports` | GET (read) | 60 |
| `/api/scan`, `/api/scan/url` | POST | 30 |
| `/api/scan/image` | POST | 20 |
| `/api/assistant` | POST | 15 |
| `/api/sandbox` | POST | 10 |
| `/api/reports` | POST | 5 |

---

## Cloud Sandbox

The `/api/sandbox` endpoint performs a **full structural investigation entirely on the
server, for free, with no API key**: it parses the URL, scores domain reputation signals,
estimates fake-login likelihood and redirect risk, and returns a complete report. It
**never** contacts the target site, so it is safe to run on any suspicious URL.

(For advanced live capture you could later add an isolated Playwright worker behind a
firewall, but this is not required and not needed for the free product.)

---

## Deepfake Detection Framework

Phishfix reserves a framework slot for suspicious audio/video analysis. A production
implementation would:
- Extract frames and run artifact/consistency detection.
- Run audio voice-cloning / synthesis detection.
- Score and surface results in the Image/Media Scanner.

The current build focuses on text and image (OCR) analysis and documents this as a
framework integration point rather than shipping an untested detector.

---

## Error Handling & Recovery Pages

The app ships with branded, graceful error-correction pages (matching the Phishfix theme)
so failures never show a raw error screen:

| File | Purpose |
|------|---------|
| `src/app/(app)/error.tsx` | App error boundary (inside the sidebar shell) — shows a 500 screen with **Try again** (reset) and **Go to dashboard** actions. |
| `src/app/(app)/not-found.tsx` | Branded 404 for unknown app routes. |
| `src/app/error.tsx` | Root error boundary for pages outside the app shell. |
| `src/app/global-error.tsx` | Last-resort boundary for root-layout crashes (renders its own `<html>`). |
| `src/app/not-found.tsx` | Root 404 page. |
| `src/app/(app)/loading.tsx`, `src/app/loading.tsx` | Skeleton loaders so navigation never shows a blank screen. |

Removed routes (e.g. the old `/world-map`) now render the branded 404 instead of an error.

---

## Security Notes

- OTPs, passwords, card numbers and UPI PINs are **never** stored.
- Uploaded files are validated (type + size) before processing.
- API keys and service credentials stay **server-side** (env only).
- Rate limiting is applied to all analysis endpoints.
- OCR and QR decoding run **in the browser**; images are not uploaded to the server.
- The sandbox never visits target URLs from the main application server.
- Heatmap / threat data is aggregated and privacy-protected (no individual data).

---

## Disclaimer

Scan verdicts are produced by transparent local heuristics, **not** a verified threat
database. Always confirm sensitive requests (money, OTP, identity) through an official
channel. Phishfix provides guidance, not legal advice.

If you have been scammed in India: call **1930** (national cybercrime helpline) or report
at **https://cybercrime.gov.in** immediately.

---

## Browser Extension

See the **Browser Protection** page (`/browser`) in the app — it provides copyable/downloadable
`manifest.json`, `background.js` and `content.js` starter files. Load them unpacked via
`chrome://extensions` and point the extension at your deployed Phishfix API.

---

## License

MIT. Built with open-source technologies. Free for educational and hackathon use.
# Phishfix-AI
