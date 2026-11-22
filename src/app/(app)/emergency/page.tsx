"use client";

import { useState } from "react";
import { ShieldAlert, Phone, Globe, FileText, Send, CheckCircle2, AlertTriangle, Copy, Download } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  incidentType: string;
  incidentDate: string;
  platform: string;
  amountLost: string;
  transactionId: string;
  upiId: string;
  phoneNumber: string;
  description: string;
  actionTaken: string;
}

const EMPTY: FormData = {
  fullName: "",
  phone: "",
  email: "",
  state: "",
  city: "",
  incidentType: "",
  incidentDate: "",
  platform: "",
  amountLost: "",
  transactionId: "",
  upiId: "",
  phoneNumber: "",
  description: "",
  actionTaken: "",
};

const INCIDENT_TYPES = [
  "Fake KYC / Identity fraud",
  "UPI / Payment fraud",
  "Delivery / Courier scam",
  "Phishing / Fake website",
  "QR code scam",
  "WhatsApp / SMS scam",
  "Loan app fraud",
  "Investment / Trading scam",
  "Job / Task scam",
  "Matrimony / Dating scam",
  "Lottery / Prize scam",
  "Other cybercrime",
];

const PLATFORMS = [
  "WhatsApp", "SMS", "Phone call", "Email", "Telegram",
  "Facebook", "Instagram", "UPI app", "Bank app", "Website",
  "Other",
];

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Other",
];

export default function EmergencyReportPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof FormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function nextStep() {
    if (step === 1) {
      if (!form.fullName || !form.phone || !form.state) return;
    }
    if (step === 2) {
      if (!form.incidentType || !form.incidentDate || !form.description) return;
    }
    setStep((s) => s + 1);
  }

  function submit() {
    setSubmitted(true);
  }

  function reset() {
    setForm(EMPTY);
    setStep(1);
    setSubmitted(false);
    setCopied(false);
  }

  const reportText = buildReportText(form);

  function copyReport() {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadReport() {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybercrime-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const canProceed =
    (step === 1 && form.fullName && form.phone && form.state) ||
    (step === 2 && form.incidentType && form.incidentDate && form.description) ||
    step === 3;

  if (submitted) {
    return (
      <div>
        <PageIntro
          icon={ShieldAlert}
          title="Report Cybercrime"
          subtitle="Official cybercrime reporting for India — fill in the details and submit to cybercrime.gov.in."
        />

        <Card className="mx-auto max-w-2xl p-8 text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-[#22c55e]">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="text-xl font-bold text-[#111111]">Report Prepared</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#858585]">
            Your report has been prepared with all the details you provided. Submit it to the official cybercrime portal below.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ef4444] py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              <Globe className="h-4 w-4" /> Submit on cybercrime.gov.in
            </a>
            <a
              href="tel:1930"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-semibold text-[#ef4444] transition-colors hover:bg-red-100"
            >
              <Phone className="h-4 w-4" /> Call 1930 (Cyber Crime Helpline)
            </a>
            <div className="flex gap-3">
              <button
                onClick={copyReport}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.06] py-2.5 text-xs font-medium text-[#858585] transition-colors hover:border-purple-200 hover:text-[#713cff]"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy report text"}
              </button>
              <button
                onClick={downloadReport}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.06] py-2.5 text-xs font-medium text-[#858585] transition-colors hover:border-purple-200 hover:text-[#713cff]"
              >
                <Download className="h-3.5 w-3.5" /> Download report
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#f9f9f9]/50 p-4 text-left">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#858585]">Report Summary</h3>
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#111111]/80">
              {reportText}
            </pre>
          </div>

          <button
            onClick={reset}
            className="mt-4 text-xs text-[#858585] transition-colors hover:text-[#713cff]"
          >
            ← File another report
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        icon={ShieldAlert}
        title="Report Cybercrime"
        subtitle="Fill in the details of the cybercrime and submit an official report to cybercrime.gov.in. All data stays on your device."
      />

      {/* Emergency call bar */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href="tel:1930"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-bold text-[#ef4444] transition-colors hover:bg-[#ef4444]/20"
        >
          <Phone className="h-4 w-4" /> Call 1930 — Cyber Crime Helpline
        </a>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-[#f9f9f9] py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-purple-400"
        >
          <Globe className="h-4 w-4 text-[#713cff]" /> Visit cybercrime.gov.in
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step >= s ? "purple-gradient text-white" : "bg-[#f9f9f9] text-[#858585]"
                  }`}
                >
                  {s}
                </span>
                {s < 3 && (
                  <span className={`h-0.5 w-12 rounded-full transition-colors ${step > s ? "bg-[#713cff]" : "bg-black/[0.08]"}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-up space-y-4">
              <h2 className="text-lg font-semibold">Your Information</h2>
              <p className="text-xs text-[#858585]">Fields marked with * are required.</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name *" value={form.fullName} onChange={(v) => update("fullName", v)} placeholder="As per your ID" />
                <Field label="Phone number *" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+91 XXXXX XXXXX" type="tel" />
                <Field label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" type="email" />
                <div>
                  <label className="mb-1 block text-xs text-[#858585]">State / UT *</label>
                  <select
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="w-full rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Field label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Your city" />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-2 rounded-xl purple-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  Next <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up space-y-4">
              <h2 className="text-lg font-semibold">Incident Details</h2>
              <p className="text-xs text-[#858585]">Describe what happened. More details help authorities act faster.</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-[#858585]">Type of cybercrime *</label>
                  <select
                    value={form.incidentType}
                    onChange={(e) => update("incidentType", e.target.value)}
                    className="w-full rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Select type</option>
                    {INCIDENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <Field label="Date of incident *" value={form.incidentDate} onChange={(v) => update("incidentDate", v)} type="date" />
                <div>
                  <label className="mb-1 block text-xs text-[#858585]">Platform / Channel</label>
                  <select
                    value={form.platform}
                    onChange={(e) => update("platform", e.target.value)}
                    className="w-full rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Select platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <Field label="Amount lost (₹)" value={form.amountLost} onChange={(v) => update("amountLost", v)} placeholder="e.g. 5000" type="number" />
              </div>

              <Field
                label="Description of the incident *"
                value={form.description}
                onChange={(v) => update("description", v)}
                placeholder="Describe in detail what happened, how they contacted you, what they asked for, etc."
                textarea
                rows={4}
              />

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-black/[0.06] px-4 py-2.5 text-sm text-[#858585] transition-colors hover:text-[#111111]"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-2 rounded-xl purple-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  Next <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up space-y-4">
              <h2 className="text-lg font-semibold">Additional Evidence</h2>
              <p className="text-xs text-[#858585]">Provide any details that can help track the fraudster (optional).</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Transaction ID / UTR" value={form.transactionId} onChange={(v) => update("transactionId", v)} placeholder="Bank transaction reference" />
                <Field label="UPI ID / Handle" value={form.upiId} onChange={(v) => update("upiId", v)} placeholder="fraudster@upi" />
                <Field label="Phone number used by scammer" value={form.phoneNumber} onChange={(v) => update("phoneNumber", v)} placeholder="+91 XXXXX XXXXX" type="tel" />
              </div>

              <Field
                label="Action already taken"
                value={form.actionTaken}
                onChange={(v) => update("actionTaken", v)}
                placeholder="e.g. Blocked my card, filed complaint with bank, changed passwords..."
                textarea
                rows={3}
              />

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                  <p className="text-[11px] leading-relaxed text-[#858585]">
                    <span className="font-semibold text-[#f59e0b]">Important:</span> Once you submit, you'll be redirected to cybercrime.gov.in to file the official report. You'll also be able to copy or download your report text to paste into the portal.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-black/[0.06] px-4 py-2.5 text-sm text-[#858585] transition-colors hover:text-[#111111]"
                >
                  ← Back
                </button>
                <button
                  onClick={submit}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ef4444] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" /> Prepare Report
                </button>
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="border-red-100 p-5">
            <div className="mb-3 flex items-center gap-2 text-[#ef4444]">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Act Fast — Golden Hour</h3>
            </div>
            <p className="text-xs leading-relaxed text-[#858585]">
              Early reporting significantly improves the chance of freezing your money. Don't wait — report within the first few hours.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-[#858585]">
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#ef4444]" /> Call <span className="font-semibold text-[#111111]">1930</span> immediately</li>
              <li className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-[#ef4444]" /> Report at <span className="font-semibold text-[#111111]">cybercrime.gov.in</span></li>
              <li className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-[#ef4444]" /> Save all evidence (SMS, screenshots, IDs)</li>
              <li className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-[#ef4444]" /> Contact your bank to block transactions</li>
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="mb-2 text-sm font-semibold">What to Report</h3>
            <ul className="space-y-1.5 text-xs text-[#858585]">
              {[
                "Fake KYC / identity theft",
                "UPI / payment fraud",
                "Delivery / courier scams",
                "Phishing / fake websites",
                "QR code scams",
                "WhatsApp / SMS fraud",
                "Loan app / investment scams",
                "Job / task / lottery scams",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#713cff]" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="mb-2 text-sm font-semibold">Need Help?</h3>
            <p className="text-xs leading-relaxed text-[#858585]">
              If you're unsure whether something is a scam, use the AI Cyber Assistant or scan the message/link first.
            </p>
            <a
              href="/assistant"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/[0.06] px-3 py-2 text-xs font-medium text-[#713cff] transition-colors hover:border-purple-200"
            >
              <ShieldAlert className="h-3.5 w-3.5" /> Ask the AI Assistant
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", textarea, rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-[#858585]">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows ?? 3}
          className="w-full resize-none rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-2 text-sm leading-relaxed placeholder:text-[#858585]/40 focus:border-purple-400 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-2 text-sm placeholder:text-[#858585]/40 focus:border-purple-400 focus:outline-none"
        />
      )}
    </div>
  );
}

function buildReportText(form: FormData): string {
  const lines = [
    "CYBERCRIME REPORT — Phishfix AI",
    "==================================",
    "",
    `Name: ${form.fullName}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email || "N/A"}`,
    `State: ${form.state}`,
    `City: ${form.city || "N/A"}`,
    "",
    `Incident type: ${form.incidentType}`,
    `Date of incident: ${form.incidentDate}`,
    `Platform: ${form.platform || "N/A"}`,
    `Amount lost: ₹${form.amountLost || "0"}`,
    "",
    "Description:",
    form.description,
    "",
    `Transaction ID: ${form.transactionId || "N/A"}`,
    `UPI ID: ${form.upiId || "N/A"}`,
    `Scammer phone: ${form.phoneNumber || "N/A"}`,
    "",
    `Action taken: ${form.actionTaken || "None yet"}`,
    "",
    "==================================",
    "Report at: https://cybercrime.gov.in",
    "Helpline: 1930",
  ];
  return lines.join("\n");
}