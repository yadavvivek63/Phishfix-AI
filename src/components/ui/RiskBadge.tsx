import type { Risk } from "@/lib/types";
import { RISK_META } from "@/lib/scanner";
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<Risk, LucideIcon> = {
  safe: ShieldCheck,
  low: ShieldCheck,
  medium: AlertTriangle,
  high: ShieldAlert,
  critical: ShieldX,
};

export function RiskBadge({ risk, size = "md" }: { risk: Risk; size?: "sm" | "md" }) {
  const meta = RISK_META[risk];
  const Icon = ICONS[risk];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${meta.bg} ${meta.color} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      } border-current/20`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {meta.label}
    </span>
  );
}