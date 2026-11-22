"use client";

import { FlaskConical, Play, ShieldAlert, Search, ArrowRightLeft, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card, SectionHeader } from "@/components/ui/Primitives";
import { postJSON } from "@/lib/client";
import { useState } from "react";

interface SandboxReport {
  target: string;
  inspectedAt: string;
  mode: string;
  note: string;
  host: string;
  registrableDomain: string;
  redirects: { risk: string; chain: string[]; note: string };
  fakeLogin: string;
  findings: { severity: string; title: string; detail: string }[];
  risk: string;
  riskScore: number;
  confidence: number;
  verdict: string;
}

export default function SandboxPage() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [report, setReport] = useState<SandboxReport | null>(null);

  async function run() {
    if (url.trim().length < 3) {
      setErr("Enter a URL to inspect.");
      return;
    }
    setErr("");
    setBusy(true);
    setReport(null);
    try {
      const res = await postJSON<SandboxReport>("/api/sandbox", { url });
      setReport(res);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageIntro
        icon={FlaskConical}
        title="Cloud Sandbox"
        subtitle="Run a full, free structural investigation of a suspicious URL — domain reputation, fake-login likelihood and redirect risk — without ever contacting the target site. No API key required."
      />

      <Card className="mb-5 p-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://suspicious-site.xyz/login"
            className="flex-1 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#858585]/60 focus:border-blue-400 focus:outline-none"
          />
          <button
            onClick={run}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl blue-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {busy ? "Investigating…" : "Run investigation"}
          </button>
        </div>
        {err && <p className="mt-2 text-xs text-[#ef4444]">{err}</p>}
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#858585]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" /> 100% free · runs locally · the target site is never contacted
        </p>
      </Card>

      {report ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-[#858585]">Risk verdict</p>
              <p className="mt-1 text-lg font-bold capitalize text-[#111111]">{report.risk}</p>
            </Card>
            <Card className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-[#858585]">Risk score</p>
              <p className="mt-1 text-xl font-bold">{report.riskScore}<span className="text-sm text-[#858585]">/100</span></p>
            </Card>
            <Card className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-[#858585]">Fake login</p>
              <p className="mt-1 text-sm font-semibold capitalize text-[#f59e0b]">{report.fakeLogin}</p>
            </Card>
            <Card className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-[#858585]">Redirect risk</p>
              <p className="mt-1 text-sm font-semibold capitalize text-[#2563eb]">{report.redirects.risk}</p>
            </Card>
          </div>

          <Card className="p-5">
            <SectionHeader title="Investigation findings" icon={ShieldAlert} />
            {report.findings.length > 0 ? (
              <div className="space-y-2">
                {report.findings.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-black/[0.06] bg-[#f9f9f9]/50 p-3">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${f.severity === "critical" || f.severity === "high" ? "bg-[#ef4444]" : f.severity === "medium" ? "bg-[#f59e0b]" : "bg-[#22c55e]"}`} />
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-xs text-[#858585]">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858585]">No suspicious indicators found in the URL structure.</p>
            )}
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-[#2563eb]" /> Domain reputation</h3>
              <p className="break-all text-xs text-[#858585]">Host: <span className="font-mono text-[#111111]">{report.host || "—"}</span></p>
              <p className="mt-1 break-all text-xs text-[#858585]">Registrable: <span className="font-mono text-[#111111]">{report.registrableDomain || "—"}</span></p>
            </Card>
            <Card className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><ArrowRightLeft className="h-4 w-4 text-[#2563eb]" /> Redirect analysis</h3>
              <p className="text-xs text-[#858585]">{report.redirects.note}</p>
            </Card>
            <Card className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><KeyRound className="h-4 w-4 text-[#2563eb]" /> Fake-login check</h3>
              <p className="text-xs text-[#858585]">
                Likelihood: <span className="font-semibold capitalize text-[#111111]">{report.fakeLogin}</span>. Based on credential-harvesting paths, brand spoofing and sensitive parameters.
              </p>
            </Card>
          </div>

          <Card className="border-blue-200 p-5">
            <h3 className="mb-1 text-sm font-semibold text-[#2563eb]">Verdict</h3>
            <p className="text-sm leading-relaxed text-[#858585]">{report.verdict}</p>
            <p className="mt-2 text-[11px] text-[#858585]/70">{report.note}</p>
          </Card>
        </div>
      ) : (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.06]/70 p-8 text-center">
          <FlaskConical className="mb-3 h-10 w-10 text-[#858585]/50" />
          <p className="text-sm font-medium text-[#858585]">No investigation yet</p>
          <p className="mt-1 max-w-sm text-xs text-[#858585]/70">
            Enter a URL and run the investigation to see a structured report — free, no API key needed.
          </p>
        </div>
      )}
    </div>
  );
}