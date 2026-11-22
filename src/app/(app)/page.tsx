import Link from "next/link";
import {
 ShieldCheck,
 ShieldAlert,
 Link2,
 QrCode,
 Smartphone,
 Bot,
 Map,
 Network,
 FlaskConical,
 ArrowRight,
 ScanLine,
 Fingerprint,
 Languages,
 Gauge,
 CheckCircle2,
 Phone,
 Globe,
 FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Primitives";

const FEATURES = [
 { href: "/scanner/message", icon: ShieldAlert, title: "Message Scanner", desc: "Detect fake KYC, delivery & payment scams in SMS and WhatsApp messages." },
 { href: "/scanner/url", icon: Link2, title: "Advanced URL Scanner", desc: "Phishing pattern detection, brand-spoofing, risky TLDs and redirect hints." },
 { href: "/scanner/qr", icon: QrCode, title: "QR & Image Scanner", desc: "Extract QR destinations and OCR screenshot text, then risk-analyze them." },
 { href: "/scanner/upi", icon: Smartphone, title: "UPI & Phone Checker", desc: "Spot suspicious UPI handles and phone numbers before you pay." },
 { href: "/sandbox", icon: FlaskConical, title: "Cloud Sandbox", desc: "Isolated URL inspection with screenshot, redirects and fake-login detection." },
 { href: "/assistant", icon: Bot, title: "AI Cyber Assistant", desc: "Step-by-step safety guidance in Hindi and English, with emergency help." },
 { href: "/heatmap", icon: Map, title: "India Scam Heatmap", desc: "State-wise scam trends built on privacy-protected aggregated data." },
];

const UNIQUE = [
 { icon: Fingerprint, title: "Scam DNA Detection", desc: "Identify similarities across scam campaigns." },
 { icon: Network, title: "Scam Family Tree", desc: "Connect URLs, phones, domains and UPI IDs." },
 { icon: Gauge, title: "Digital Emergency Mode", desc: "Immediate instructions after a suspected scam." },
 { icon: Languages, title: "Multilingual Protection", desc: "Hindi & regional language support." },
];

export default function LandingPage() {
 return (
 <div className="space-y-16">
 {/* Hero */}
 <section className="relative overflow-hidden rounded-3xl border border-black/[0.06] grid-bg px-6 py-16 sm:px-10 lg:py-20">
 <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
 <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-purple-50 blur-3xl" />
 <div className="relative mx-auto max-w-3xl text-center">
 <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/50 px-4 py-1.5 text-xs font-medium text-[#713cff]">
 <ShieldCheck className="h-4 w-4" /> AI-Powered Scam Protection for India
 </span>
 <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
 Detect. Investigate. <span className="text-[#713cff] text-glow">Protect.</span>
 </h1>
 <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#858585] sm:text-lg">
 Phishfix AI is an all-in-one cybersecurity platform to protect Indian users from fake KYC,
 WhatsApp &amp; SMS scams, phishing sites, UPI fraud and more — free and open-source.
 </p>
 <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
 <Link
 href="/scanner/message"
 className="inline-flex items-center justify-center gap-2 rounded-xl purple-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
 >
 <ScanLine className="h-4 w-4" /> Scan a message now
 </Link>
 <Link
 href="/assistant"
 className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-6 py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-purple-400"
 >
 <Bot className="h-4 w-4 text-[#713cff]" /> Ask the AI assistant
 </Link>
 </div>
 <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#858585]">
 <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" /> Free &amp; open-source</span>
 <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" /> No paid APIs required</span>
 <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" /> Hindi &amp; English</span>
 </div>
 </div>
 </section>

 {/* Threat bar */}
 <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
 {[
 { label: "Fake KYC", value: "1.5k+", icon: ShieldAlert },
 { label: "Delivery scams", value: "900+", icon: Smartphone },
 { label: "UPI fraud", value: "1.2k+", icon: Link2 },
 { label: "Phishing sites", value: "700+", icon: QrCode },
 ].map((s) => (
 <Card key={s.label} className="p-4">
 <s.icon className="mb-2 h-5 w-5 text-[#713cff]" />
 <p className="text-xl font-bold">{s.value}</p>
 <p className="text-xs text-[#858585]">{s.label} reports (demo)</p>
 </Card>
 ))}
 </section>

 {/* Features */}
 <section>
 <div className="mb-8 text-center">
 <h2 className="text-2xl font-bold tracking-tight">Powerful scanners &amp; tools</h2>
 <p className="mt-2 text-sm text-[#858585]">Real, working analysis — not static screens.</p>
 </div>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {FEATURES.map((f) => (
 <Link key={f.href} href={f.href}>
 <Card className="group h-full p-5 transition-all hover:border-purple-200 hover:bg-white-2">
 <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#713cff] transition-transform group-hover:scale-110">
 <f.icon className="h-5 w-5" />
 </span>
 <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
 <p className="mt-1.5 text-xs leading-relaxed text-[#858585]">{f.desc}</p>
 <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#713cff]">
 Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
 </span>
 </Card>
 </Link>
 ))}
 </div>
 </section>

 {/* Unique */}
 <section className="rounded-3xl border border-black/[0.06] bg-white/40 p-8">
 <div className="mb-6 text-center">
 <h2 className="text-2xl font-bold tracking-tight">Beyond basic scanning</h2>
 <p className="mt-2 text-sm text-[#858585]">Innovative capabilities that make Phishfix stand out.</p>
 </div>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {UNIQUE.map((u) => (
 <div key={u.title} className="flex items-start gap-3">
 <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-[#713cff]">
 <u.icon className="h-5 w-5" />
 </span>
 <div>
 <h3 className="text-sm font-semibold">{u.title}</h3>
 <p className="text-xs text-[#858585]">{u.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Emergency CTA */}
 <section className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
 <h2 className="text-xl font-bold text-[#ef4444]">Already been scammed?</h2>
 <p className="mx-auto mt-2 max-w-xl text-sm text-[#858585]">
 Act fast — early reporting improves the chance of freezing your money. Call{" "}
 <span className="font-semibold text-[#111111]">1930</span> or report at{" "}
 <span className="font-semibold text-[#111111]">cybercrime.gov.in</span>.
 </p>
 <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
 <Link
 href="/emergency"
 className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
 >
 <FileText className="h-4 w-4" /> File a report
 </Link>
 <a
 href="tel:1930"
 className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-5 py-2.5 text-sm font-semibold text-[#ef4444] transition-colors hover:bg-red-50"
 >
 <Phone className="h-4 w-4" /> Call 1930
 </a>
 <a
 href="https://cybercrime.gov.in"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-5 py-2.5 text-sm font-semibold text-[#ef4444] transition-colors hover:bg-red-50"
 >
 <Globe className="h-4 w-4" /> cybercrime.gov.in
 </a>
 </div>
 </section>
 </div>
 );
}