import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl bg-white border border-black/[0.06] transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] ${glow ? "glow-blue" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#111111]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-[#858585]">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "text-[#2563eb]",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: string;
}) {
  return (
    <div className="rounded-3xl bg-white border border-black/[0.06] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[#858585]">{label}</span>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <Icon className={`h-4 w-4 ${accent}`} />
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-[#111111]">{value}</div>
      {trend && (
        <div className={`mt-1 text-xs font-medium ${trend.up ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
          {trend.up ? "▲" : "▼"} {trend.value}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/[0.08] py-12 text-center bg-blue-50/20">
      {Icon && <Icon className="mb-3 h-10 w-10 text-[#2563eb]/40" />}
      <p className="text-sm font-medium text-[#858585]">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-xs text-[#858585]/70">{hint}</p>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-[#858585]">
      <span className="relative flex h-6 w-6">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-blue-400/40" />
        <span className="relative inline-flex h-3 w-3 m-auto mt-1.5 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}