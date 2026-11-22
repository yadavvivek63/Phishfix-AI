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
 className={`rounded-2xl glass ${glow ? "glow-cyan" : ""} ${className}`}
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
 <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
 <Icon className="h-5 w-5" />
 </span>
 )}
 <div>
 <h2 className="text-lg font-semibold tracking-tight text-text">{title}</h2>
 {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
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
 accent = "text-cyan",
}: {
 label: string;
 value: string | number;
 icon?: LucideIcon;
 trend?: { value: string; up: boolean };
 accent?: string;
}) {
 return (
 <Card className="p-5">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
 {Icon && <Icon className={`h-5 w-5 ${accent}`} />}
 </div>
 <div className="mt-3 text-2xl font-bold tracking-tight text-text">{value}</div>
 {trend && (
 <div className={`mt-1 text-xs ${trend.up ? "text-success" : "text-danger"}`}>
 {trend.up ? "▲" : "▼"} {trend.value}
 </div>
 )}
 </Card>
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
 <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line/70 py-12 text-center">
 {Icon && <Icon className="mb-3 h-10 w-10 text-muted/60" />}
 <p className="text-sm font-medium text-muted">{title}</p>
 {hint && <p className="mt-1 max-w-xs text-xs text-muted/70">{hint}</p>}
 </div>
 );
}

export function Spinner({ label }: { label?: string }) {
 return (
 <div className="flex items-center justify-center gap-3 py-6 text-muted">
 <span className="relative flex h-6 w-6">
 <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-lg bg-cyan/40" />
 <span className="relative inline-flex h-3 w-3 m-auto mt-1.5 animate-spin rounded-lg border-2 border-cyan border-t-transparent" />
 </span>
 {label && <span className="text-sm">{label}</span>}
 </div>
 );
}