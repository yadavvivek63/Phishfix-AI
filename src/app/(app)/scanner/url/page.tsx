"use client";

import { Link2, Globe, Server, Lock, ExternalLink } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";
import { ScanForm } from "@/components/scanners/ScanForm";
import { useState } from "react";
import type { ScanResult } from "@/lib/types";

const EXAMPLES = [
  "http://sbi-kyc-update.xyz/verify",
  "https://bit.ly/dtdc-fee",
  "http://paytm-refund-claim.icu/refund",
];

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.04] py-2 last:border-0">
      <span className="text-xs text-[#858585]">{label}</span>
      <span className="max-w-[60%] truncate font-mono text-xs text-[#111111]">{String(value)}</span>
    </div>
  );
}

export default function UrlScannerPage() {
  const [last, setLast] = useState<ScanResult | null>(null);

  return (
    <div>
      <PageIntro
        icon={Link2}
        title="Advanced URL Scanner"
        subtitle="Paste a suspicious link. We analyze domain reputation signals, brand-spoofing, risky TLDs, shorteners, embedded credentials and credential-harvesting paths."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScanForm
            kind="url"
            label="URL"
            placeholder="https://example.com/path"
            buttonLabel="Scan URL"
            examples={EXAMPLES}
            singleColumn
            onResult={setLast}
          />
        </div>

        <Card className="h-fit p-5">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#713cff]" />
            <h3 className="text-sm font-semibold">Domain Intelligence</h3>
          </div>
          {last ? (
            <div>
              <DetailRow label="Hostname" value={(last.indicators.hostname as string) || "—"} />
              <DetailRow label="Protocol" value={(last.indicators.protocol as string) || "—"} />
              <DetailRow label="Subdomains" value={(last.indicators.subdomains as number) ?? 0} />
              {Array.isArray(last.indicators.pathHints) && (last.indicators.pathHints as string[]).length > 0 && (
                <DetailRow label="Path hints" value={(last.indicators.pathHints as string[]).join(", ")} />
              )}
              {Array.isArray(last.indicators.sensitiveParams) && (last.indicators.sensitiveParams as string[]).length > 0 && (
                <DetailRow label="Sensitive params" value={(last.indicators.sensitiveParams as string[]).join(", ")} />
              )}
            </div>
          ) : (
            <p className="text-xs text-[#858585]">Scan a URL to see parsed domain details here.</p>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#858585]"><Lock className="h-3.5 w-3.5" /> Flags missing HTTPS</div>
            <div className="flex items-center gap-2 text-xs text-[#858585]"><Server className="h-3.5 w-3.5" /> Detects raw IP hosts</div>
            <div className="flex items-center gap-2 text-xs text-[#858585]"><ExternalLink className="h-3.5 w-3.5" /> Flags brand spoofing</div>
          </div>

          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] leading-relaxed text-[#858585]">
            Phishfix never visits the target URL from the server. For isolated inspection, use the Cloud Sandbox.
          </p>
        </Card>
      </div>
    </div>
  );
}