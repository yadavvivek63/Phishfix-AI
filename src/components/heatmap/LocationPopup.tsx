"use client";

import { MapPin, X } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/seed";

const CAT_LABEL: Record<string, string> = {
  kyc: "Fake KYC",
  delivery: "Delivery",
  upi: "UPI fraud",
  phishing: "Phishing",
  qr: "QR",
  other: "Other",
};

export function LocationPopup({
  title,
  subtitle,
  reports,
  scams,
  onClose,
}: {
  title: string;
  subtitle?: string;
  reports: number;
  scams: Record<string, number>;
  onClose?: () => void;
}) {
  const entries = Object.entries(scams).filter(([, v]) => v > 0);

  return (
    <div className="absolute bottom-3 left-3 w-[230px] rounded-xl border border-black/[0.06] bg-white/95 p-3 shadow-xl backdrop-blur">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-[#713cff]">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-[#111111]">{title}</p>
            {subtitle && <p className="text-[10px] text-[#858585]">{subtitle}</p>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#858585] hover:text-[#111111]" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mb-2 rounded-lg bg-[#f9f9f9]/70 px-2 py-1.5">
        <p className="text-[10px] uppercase tracking-wider text-[#858585]">Total reports</p>
        <p className="text-lg font-bold text-[#111111]">{reports.toLocaleString()}</p>
      </div>

      <div className="space-y-1">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[k] || "#8aa0bd" }} />
            <span className="text-[#858585]">{CAT_LABEL[k] || k}</span>
            <span className="ml-auto font-medium text-[#111111]">{v.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationPopup;