"use client";

import { User, Shield, Bell, Languages, LogOut, Save, Check } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card, SectionHeader } from "@/components/ui/Primitives";
import { useState } from "react";
import { LANGUAGES } from "@/lib/assistant";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 ${on ? "bg-cyan" : "bg-line"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

interface Prefs {
  lang: string;
  emailAlerts: boolean;
  browserWarnings: boolean;
  autoBlock: boolean;
  shareTelemetry: boolean;
}

const DEFAULT_PREFS: Prefs = {
  lang: "auto",
  emailAlerts: true,
  browserWarnings: true,
  autoBlock: false,
  shareTelemetry: false,
};

const STORAGE_KEY = "phishfix:prefs";

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Prefs>;
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch {
    // ignore corrupt storage
  }
  return DEFAULT_PREFS;
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage might be unavailable
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const langOptions = [{ code: "auto", label: "Auto-detect" }, ...LANGUAGES.map((l) => ({ code: l.code, label: l.native }))];

  return (
    <div>
      <PageIntro
        icon={User}
        title="Profile & Settings"
        subtitle="Manage your profile, language preference and protection settings. Your privacy is always respected."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/15 text-2xl font-bold text-cyan">SK</span>
            <div>
              <h3 className="text-lg font-semibold">Guest User</h3>
              <p className="text-sm text-muted">guest@phishfix.ai</p>
              <span className="mt-1 inline-block rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">Free plan</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="mb-1 block text-xs text-muted">Display name</label>
            <input defaultValue="Guest User" className="w-full rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm focus:border-cyan/50 focus:outline-none" />
            <label className="mb-1 block text-xs text-muted">Email</label>
            <input defaultValue="guest@phishfix.ai" className="w-full rounded-lg border border-line bg-navy-2 px-3 py-2 text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <button
            onClick={save}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-2.5 text-sm font-semibold text-navy"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Language" icon={Languages} />
          <p className="mb-3 text-xs text-muted">The assistant can respond in 6 languages. Choose one, or let it auto-detect from your message.</p>
          <div className="flex flex-wrap gap-2">
            {langOptions.map((l) => (
              <button
                key={l.code}
                onClick={() => setPrefs({ ...prefs, lang: l.code })}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${prefs.lang === l.code ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-line text-muted hover:text-text"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={save}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-xs font-medium text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save preferences"}
          </button>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Privacy" icon={Shield} />
            <ul className="mb-4 space-y-2 text-xs text-muted">
              <li className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-cyan" /> We never store OTPs, PINs or passwords.</li>
              <li className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-cyan" /> Scans run locally on your device where possible.</li>
              <li className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-cyan" /> Heatmap data is aggregated & anonymous.</li>
            </ul>
            <div className="space-y-3 border-t border-line/60 pt-4">
              {([
                ["emailAlerts", "Email scam alerts"],
                ["browserWarnings", "Browser protection warnings"],
                ["autoBlock", "Auto-block known-bad URLs"],
                ["shareTelemetry", "Share anonymous telemetry"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <Toggle on={prefs[key]} onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })} />
                </div>
              ))}
            </div>
            <button
              onClick={save}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-xs font-medium text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {saved ? "Saved" : "Save privacy settings"}
            </button>
          </Card>
          <Card className="p-5">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/40 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}