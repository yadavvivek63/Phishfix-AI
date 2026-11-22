"use client";

import type { Risk } from "@/lib/types";

const COLORS: Record<Risk, string> = {
  safe: "#35e08a",
  low: "#35e08a",
  medium: "#ffb020",
  high: "#ff5a6a",
  critical: "#ff5a6a",
};

export function RiskGauge({
  score,
  risk,
  size = 140,
  label = "Risk Score",
}: {
  score: number;
  risk: Risk;
  size?: number;
  label?: string;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const color = COLORS[risk];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1e3350" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.4s ease", filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {Math.round(pct)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
      </div>
    </div>
  );
}