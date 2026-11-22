"use client";

import { Flag, Filter, Clock, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card, SectionHeader } from "@/components/ui/Primitives";
import { getJSON, postJSON } from "@/lib/client";
import type { CommunityReport } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["Fake KYC", "Delivery scam", "UPI fraud", "Refund bait", "WhatsApp lottery", "QR payment", "Phishing site", "Other"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat", "Uttar Pradesh", "West Bengal", "Rajasthan", "Kerala", "Other"];

const STATUS_STYLE: Record<string, string> = {
  open: "bg-cyan/10 text-cyan",
  reviewing: "bg-warn/10 text-warn",
  confirmed: "bg-danger/10 text-danger",
  dismissed: "bg-muted/10 text-muted",
};

export default function ReportPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({ category: CATEGORIES[0], target: "", description: "", state: STATES[0] });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    getJSON<{ reports: CommunityReport[] }>("/api/reports").then((d) => setReports(d.reports));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (form.description.trim().length < 10) {
      setErr("Description must be at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      const r = await postJSON<CommunityReport>("/api/reports", form);
      setReports((prev) => [r, ...prev]);
      setForm({ category: CATEGORIES[0], target: "", description: "", state: STATES[0] });
      setMsg("Report submitted. Thank you for helping protect the community!");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => {
    const list = filter === "all" ? reports : reports.filter((r) => r.status === filter);
    return list;
  }, [reports, filter]);

  return (
    <div>
      <PageIntro
        icon={Flag}
        title="Community Reporting Portal"
        subtitle="Report suspicious URLs, phone numbers, UPI IDs and scam messages. Community reports help everyone stay safer."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="h-fit p-5">
          <SectionHeader title="Submit a report" icon={MessageSquarePlus} />
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm text-text focus:border-cyan/50 focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Target (URL / phone / UPI)</label>
              <input
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                placeholder="e.g. sbi-kyc.xyz or name@ybl"
                className="w-full rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm text-text placeholder:text-muted/50 focus:border-cyan/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">State</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm text-text focus:border-cyan/50 focus:outline-none"
              >
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                maxLength={2000}
                placeholder="What happened? Include the message or context."
                className="w-full resize-none rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm text-text placeholder:text-muted/50 focus:border-cyan/50 focus:outline-none"
              />
            </div>
            {err && <p className="text-xs text-danger">{err}</p>}
            {msg && <p className="text-xs text-success">{msg}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-cyan py-2.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit report"}
            </button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted"><Filter className="h-3.5 w-3.5" /> Filter:</span>
            {["all", "open", "reviewing", "confirmed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-cyan/15 text-cyan" : "text-muted hover:text-text"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.length === 0 && (
              <Card className="p-6 text-center text-sm text-muted">No reports match this filter yet.</Card>
            )}
            {filtered.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-cyan/10 px-2 py-0.5 text-[11px] font-medium text-cyan">{r.category}</span>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                      <span className="text-[11px] text-muted">{r.state}</span>
                    </div>
                    <p className="mt-2 break-all font-mono text-sm text-text">{r.target}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{r.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs text-muted"><CheckCircle2 className="h-3.5 w-3.5" /> {r.reports}</div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted/70"><Clock className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}