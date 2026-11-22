"use client";

import { useState } from "react";
import { ScanLine, Loader2, Eraser } from "lucide-react";
import { postJSON } from "@/lib/client";
import type { ScanResult } from "@/lib/types";
import { ScanResultView } from "@/components/ui/ScanResultView";

export function ScanForm({
  kind,
  placeholder,
  label,
  buttonLabel = "Scan",
  rows,
  maxLength = 4000,
  examples,
  footer,
  singleColumn = false,
  onResult,
}: {
  kind: ScanResult["kind"];
  placeholder: string;
  label: string;
  buttonLabel?: string;
  rows?: number;
  maxLength?: number;
  examples?: string[];
  footer?: React.ReactNode;
  singleColumn?: boolean;
  onResult?: (r: ScanResult) => void;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    if (input.trim().length < 3) {
      setErr(`Enter ${label.toLowerCase()} first.`);
      return;
    }
    setErr("");
    setBusy(true);
    setResult(null);
    try {
      const res = await postJSON<ScanResult>("/api/scan", { kind, input });
      setResult(res);
      onResult?.(res);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const resultPanel = result ? (
    <div className="rounded-2xl glass p-5">
      <ScanResultView result={result} />
    </div>
  ) : (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.06]/70 p-8 text-center">
      <ScanLine className="mb-3 h-10 w-10 text-[#858585]/50" />
      <p className="text-sm font-medium text-[#858585]">Results appear here</p>
      <p className="mt-1 max-w-xs text-xs text-[#858585]/70">
        Submit {label.toLowerCase()} to run the local heuristic analysis and get a risk verdict.
      </p>
    </div>
  );

  return (
    <div className={singleColumn ? "" : "grid gap-5 lg:grid-cols-2"}>
      <div>
        <div className="rounded-2xl glass p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#858585]">
            {label}
          </label>
          {rows ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className="w-full resize-none rounded-xl border border-black/[0.06] bg-[#f9f9f9] p-4 text-sm leading-relaxed text-[#111111] placeholder:text-[#858585]/50 focus:border-blue-400 focus:outline-none"
            />
          ) : (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder={placeholder}
              maxLength={maxLength}
              className="w-full rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-4 py-3 text-sm text-[#111111] placeholder:text-[#858585]/50 focus:border-blue-400 focus:outline-none"
            />
          )}
          {err && <p className="mt-2 text-xs text-[#ef4444]">{err}</p>}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={run}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl blue-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
              {busy ? "Analyzing…" : buttonLabel}
            </button>
            <button
              onClick={() => {
                setInput("");
                setResult(null);
                setErr("");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] px-4 py-2.5 text-sm text-[#858585] transition-colors hover:text-[#111111]"
            >
              <Eraser className="h-4 w-4" /> Clear
            </button>
          </div>
          {examples && examples.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-[#858585]">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(ex);
                      setErr("");
                      setResult(null);
                    }}
                    className="rounded-lg border border-black/[0.06] px-2.5 py-1 text-[11px] text-[#858585] transition-colors hover:border-blue-200 hover:text-[#2563eb]"
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          {footer}
        </div>
        {singleColumn && <div className="mt-5">{resultPanel}</div>}
      </div>

      {!singleColumn && <div>{resultPanel}</div>}
    </div>
  );
}