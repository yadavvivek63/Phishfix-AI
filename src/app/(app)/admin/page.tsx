"use client";

import { ShieldHalf, Activity, Server, Database, Users, AlertTriangle, CheckCircle2, Cpu } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card, SectionHeader, StatCard } from "@/components/ui/Primitives";
import { getJSON } from "@/lib/client";
import type { CommunityReport } from "@/lib/types";
import { useEffect, useState } from "react";

interface Stats {
  totalReports: number;
  activeThreats: number;
  confirmedThreats: number;
  protectedUsers: number;
}

const STATUS_STYLE: Record<string, string> = {
  open: "bg-cyan/10 text-cyan",
  reviewing: "bg-warn/10 text-warn",
  confirmed: "bg-danger/10 text-danger",
  dismissed: "bg-muted/10 text-muted",
};

const SERVICES = [
  { name: "Scan API", icon: Activity, status: "operational" },
  { name: "Assistant API", icon: Cpu, status: "operational" },
  { name: "Sandbox analysis", icon: Server, status: "operational" },
  { name: "Threat DB", icon: Database, status: "operational" },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<CommunityReport[]>([]);

  useEffect(() => {
    getJSON<Stats>("/api/stats").then(setStats).catch(() => setStats(null));
    getJSON<{ reports: CommunityReport[] }>("/api/reports").then((d) => setReports(d.reports));
  }, []);

  const queue = reports.filter((r) => r.status === "open" || r.status === "reviewing").slice(0, 5);

  return (
    <div>
      <PageIntro
        icon={ShieldHalf}
        title="Admin Dashboard"
        subtitle="System health, moderation queue and platform-wide metrics. Demo environment — no live production data."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total reports" value={stats?.totalReports.toLocaleString() ?? "—"} icon={AlertTriangle} accent="text-danger" />
        <StatCard label="Active threats" value={stats?.activeThreats ?? "—"} icon={ShieldHalf} accent="text-warn" />
        <StatCard label="Confirmed" value={stats?.confirmedThreats ?? "—"} icon={CheckCircle2} accent="text-success" />
        <StatCard label="Protected users" value={stats?.protectedUsers.toLocaleString() ?? "—"} icon={Users} accent="text-cyan" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <SectionHeader title="Service health" icon={Activity} />
          <div className="space-y-2">
            {SERVICES.map((s) => {
              const ok = s.status === "operational";
              return (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-line/60 bg-navy-2/50 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm">
                    <s.icon className="h-4 w-4 text-cyan" /> {s.name}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs ${ok ? "text-success" : "text-muted"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-muted"}`} />
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Moderation queue" subtitle="Open & reviewing reports" icon={ShieldHalf} />
          {queue.length === 0 ? (
            <p className="text-xs text-muted">Queue is clear.</p>
          ) : (
            <div className="space-y-2">
              {queue.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-line/60 bg-navy-2/50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-text">{r.target}</p>
                    <p className="text-[11px] text-muted">{r.category} · {r.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="rounded-lg border border-line py-2 text-xs text-muted transition-colors hover:text-text">Assign</button>
            <button className="rounded-lg bg-danger/10 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/20">Confirm</button>
            <button className="rounded-lg bg-success/10 py-2 text-xs font-medium text-success transition-colors hover:bg-success/20">Dismiss</button>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <SectionHeader title="Recent reports" icon={AlertTriangle} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line/60 text-left text-xs uppercase tracking-wider text-muted">
                <th className="pb-2 pr-4">Target</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">State</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Reports</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-line/30 last:border-0">
                  <td className="max-w-[220px] truncate py-2 pr-4 font-mono text-xs text-cyan-soft">{r.target}</td>
                  <td className="py-2 pr-4 text-xs text-muted">{r.category}</td>
                  <td className="py-2 pr-4 text-xs text-muted">{r.state}</td>
                  <td className="py-2 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="py-2 text-xs text-muted">{r.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}