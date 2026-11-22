"use client";

import type { ScanResult } from "@/lib/types";
import { RISK_META } from "@/lib/scanner";
import { RiskGauge } from "./RiskGauge";
import { RiskBadge } from "./RiskBadge";
import { AlertTriangle, CheckCircle2, Info, FlaskConical } from "lucide-react";

export function ScanResultView({ result }: { result: ScanResult }) {
  const meta = RISK_META[result.verdict];
  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <RiskGauge score={result.riskScore} risk={result.verdict} />
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <RiskBadge risk={result.verdict} />
            <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-[11px] font-medium text-cyan">
              {result.confidence}% confidence
            </span>
            {result.demo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warn/10 px-2 py-0.5 text-[11px] font-medium text-warn">
                <FlaskConical className="h-3 w-3" /> Demo data
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-text/90">{result.summary}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Info className="h-4 w-4 text-cyan" /> Analysis Signals
        </h4>
        {result.signals.map((s) => {
          const m = RISK_META[s.severity];
          const Icon = s.severity === "safe" ? CheckCircle2 : AlertTriangle;
          return (
            <div
              key={s.id}
              className="flex items-start gap-3 rounded-xl border border-line/60 bg-navy-2/50 p-3"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${m.color}`} />
              <div>
                <p className="text-sm font-medium text-text">{s.label}</p>
                <p className="text-xs text-muted">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-line/60 bg-navy-2/40 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-semibold text-cyan-soft">Disclaimer:</span> {meta.label} verdicts are generated
          by local heuristic analysis, not a verified threat database. Always confirm sensitive requests
          (money, OTP, identity) through an official channel.
        </p>
      </div>
    </div>
  );
}