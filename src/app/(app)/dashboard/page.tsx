"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Link2,
  QrCode,
  Smartphone,
  MessageSquare,
  Network,
  ArrowUpRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Card, SectionHeader, StatCard } from "@/components/ui/Primitives";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { ScanResult } from "@/lib/types";
import { getJSON, postJSON } from "@/lib/client";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/seed";

interface Stats {
  totalReports: number;
  activeThreats: number;
  confirmedThreats: number;
  protectedUsers: number;
  demo: boolean;
}

const TREND = [
  { day: "Mon", scans: 420 },
  { day: "Tue", scans: 510 },
  { day: "Wed", scans: 380 },
  { day: "Thu", scans: 640 },
  { day: "Fri", scans: 720 },
  { day: "Sat", scans: 560 },
  { day: "Sun", scans: 690 },
];

const QUICK = [
  { href: "/scanner/message", icon: MessageSquare, label: "Scan a message" },
  { href: "/scanner/url", icon: Link2, label: "Scan a URL" },
  { href: "/scanner/qr", icon: QrCode, label: "Scan a QR / image" },
  { href: "/scanner/upi", icon: Smartphone, label: "Check a UPI / phone" },
  { href: "/sandbox", icon: ShieldAlert, label: "Run in sandbox" },
];

const CAT_DATA = [
  { name: "Fake KYC", value: 40 },
  { name: "Delivery", value: 24 },
  { name: "UPI fraud", value: 20 },
  { name: "Phishing", value: 12 },
  { name: "QR", value: 4 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<ScanResult[]>([]);
  const [quickMsg, setQuickMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    getJSON<Stats>("/api/stats").then(setStats).catch(() => setStats(null));
  }, []);

  async function quickScan() {
    if (quickMsg.trim().length < 3) {
      setErr("Enter a message to scan.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const res = await postJSON<ScanResult>("/api/scan", { kind: "message", input: quickMsg });
      setRecent((r) => [res, ...r].slice(0, 5));
      setQuickMsg("");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Overview</h1>
          <p className="mt-1 text-sm text-[#858585]">Your protection at a glance · {new Date().toISOString().slice(0, 10)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-green-50 px-3 py-1.5 text-xs font-medium text-[#22c55e]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> Protection active
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Scams reported" value={stats ? stats.totalReports.toLocaleString() : "—"} icon={ShieldAlert} accent="text-[#ef4444]" trend={{ value: "12% this week", up: true }} />
        <StatCard label="Active threats" value={stats?.activeThreats ?? "—"} icon={Network} accent="text-[#f59e0b]" />
        <StatCard label="Confirmed threats" value={stats?.confirmedThreats ?? "—"} icon={ShieldCheck} accent="text-[#2563eb]" />
        <StatCard label="Protected users" value={stats ? stats.protectedUsers.toLocaleString() : "—"} icon={Activity} accent="text-[#22c55e]" trend={{ value: "8% this month", up: true }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Quick Scan" subtitle="Paste a suspicious message to get an instant verdict" icon={ShieldCheck} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && quickScan()}
              placeholder="e.g. Your SBI KYC is pending, verify here: http://sbi-kyc.xyz/verify"
              className="flex-1 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#858585]/60 focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={quickScan}
              disabled={busy}
              className="rounded-xl blue-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {busy ? "Scanning…" : "Scan"}
            </button>
          </div>
          {err && <p className="mt-2 text-xs text-[#ef4444]">{err}</p>}
          {recent.length > 0 && (
            <div className="mt-4 space-y-2">
              {recent.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-black/[0.06] bg-[#f9f9f9]/50 px-3 py-2">
                  <span className="truncate text-xs text-[#858585]">{r.input}</span>
                  <RiskBadge risk={r.verdict} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <SectionHeader title="Scans this week" icon={TrendingUp} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" stroke="#858585" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#858585" fontSize={11} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={{ background: "#101d30", border: "1px solid #1e3350", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="scans" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <SectionHeader title="Scam categories" subtitle="Share of reports (demo)" icon={ShieldAlert} />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CAT_DATA} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {CAT_DATA.map((d) => (
                  <Cell key={d.name} fill={CATEGORY_COLORS[d.name === "Fake KYC" ? "kyc" : d.name === "Delivery" ? "delivery" : d.name === "UPI fraud" ? "upi" : d.name === "Phishing" ? "phishing" : "qr"]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#101d30", border: "1px solid #1e3350", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {CAT_DATA.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[#858585]">
                <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[d.name === "Fake KYC" ? "kyc" : d.name === "Delivery" ? "delivery" : d.name === "UPI fraud" ? "upi" : d.name === "Phishing" ? "phishing" : "qr"] }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Quick actions" icon={Activity} />
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK.map((q) => (
              <button
                key={q.href}
                onClick={() => router.push(q.href)}
                className="group flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[#f9f9f9]/50 p-3 text-left transition-colors hover:border-blue-200"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                  <q.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{q.label}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-[#858585] group-hover:text-[#2563eb]" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}