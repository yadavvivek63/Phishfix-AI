"use client";

import { X, Phone, Globe, Building2, Camera, ShieldAlert, Clock } from "lucide-react";
import { useEffect } from "react";

const STEPS = [
  { icon: Clock, title: "Act within the golden hour", desc: "Call 1930 and report at cybercrime.gov.in immediately. Early reporting greatly improves the chance of freezing your funds." },
  { icon: Building2, title: "Contact your bank / UPI app", desc: "Ask them to block the fraudulent transaction and freeze the affected account or card." },
  { icon: Camera, title: "Preserve all evidence", desc: "Save screenshots, SMS, call logs, transaction IDs, UPI references and the recipient's number/ID." },
  { icon: ShieldAlert, title: "Secure your accounts", desc: "Change netbanking, UPI and email passwords. Never share OTPs or PINs with anyone who calls you." },
  { icon: Globe, title: "File a formal report", desc: "Submit an online complaint at cybercrime.gov.in and, if advised, file an FIR at your local police station." },
];

export function EmergencyMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-red-100 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-[#ef4444]">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#ef4444]">Digital Emergency Mode</h2>
              <p className="text-xs text-[#858585]">Act fast — every minute counts.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#858585] hover:text-[#111111] transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <a
            href="tel:1930"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" /> Call 1930
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-[#f9f9f9] py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-blue-400"
          >
            <Globe className="h-4 w-4 text-[#2563eb]" /> cybercrime.gov.in
          </a>
        </div>

        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                <s.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#111111]">{i + 1}. {s.title}</p>
                <p className="text-xs leading-relaxed text-[#858585]">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] leading-relaxed text-[#858585]">
          Phishfix AI provides guidance, not legal advice. For emergencies dial 112.
        </p>
      </div>
    </div>
  );
}