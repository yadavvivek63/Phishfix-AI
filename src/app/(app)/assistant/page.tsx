"use client";

import { Bot, Send, User, ShieldAlert, Phone, Languages, Sparkles } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";
import { postJSON } from "@/lib/client";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, greetingFor, suggestionsFor, type LanguageCode } from "@/lib/assistant";

interface Msg {
  role: "user" | "assistant";
  content: string;
  demo?: boolean;
}

type LangChoice = LanguageCode | "auto";

function loadLangPref(): LangChoice {
  try {
    const raw = localStorage.getItem("phishfix:prefs");
    if (raw) {
      const saved = JSON.parse(raw) as { lang?: string };
      if (saved.lang && LANGUAGES.some((l) => l.code === saved.lang)) {
        return saved.lang as LangChoice;
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return "auto";
}

export default function AssistantPage() {
  const [history, setHistory] = useState<Msg[]>([
    { role: "assistant", content: greetingFor("en") },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<LangChoice>(loadLangPref);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("phishfix:prefs");
      const base = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      localStorage.setItem("phishfix:prefs", JSON.stringify({ ...base, lang }));
    } catch {
      // ignore
    }
  }, [lang]);

  const suggestionLang: LanguageCode = lang === "auto" ? "en" : lang;
  const suggestions = suggestionsFor(suggestionLang);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, busy]);

  useEffect(() => {
    if (lang === "auto") return;
    setHistory((h) =>
      h.length === 1 && h[0].role === "assistant"
        ? [{ role: "assistant", content: greetingFor(lang) }]
        : h
    );
  }, [lang]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    const next: Msg[] = [...history, { role: "user", content: msg }];
    setHistory(next);
    setInput("");
    setBusy(true);
    try {
      const res = await postJSON<{ reply: string; demo: boolean; lang?: LanguageCode }>(
        "/api/assistant",
        { message: msg, history: history.slice(-8), lang },
      );
      setHistory((h) => [...h, { role: "assistant", content: res.reply, demo: res.demo }]);
    } catch (e) {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: `Sorry, I couldn't respond right now. ${(e as Error).message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageIntro
        icon={Bot}
        title="AI Cyber Safety Assistant"
        subtitle="Get step-by-step safety guidance, emergency help and instructions on reporting cybercrime in India — in 6 languages."
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-2 py-1">
            <Languages className="h-3.5 w-3.5 text-[#713cff]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangChoice)}
              className="bg-transparent text-xs text-[#111111] focus:outline-none"
              aria-label="Assistant language"
            >
              <option value="auto" className="bg-[#f9f9f9]">Auto-detect</option>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#f9f9f9]">
                  {l.label} · {l.native}
                </option>
              ))}
            </select>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-[#f9f9f9] px-3 py-1.5 text-xs text-[#858585]">
            <ShieldAlert className="h-3.5 w-3.5 text-[#713cff]" /> Emergency ready
          </span>
        </div>
      </PageIntro>

      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="flex h-[560px] flex-col lg:col-span-3">
          <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto p-5">
            {history.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role === "user" ? "bg-purple-50 text-[#713cff]" : "bg-white-2 text-[#713cff]"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "purple-gradient text-white"
                      : "border border-black/[0.06] bg-[#f9f9f9] text-[#111111]/90"
                  }`}
                >
                  {m.content}
                  {m.role === "assistant" && m.demo && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-[9px] text-[#713cff]">
                      <Sparkles className="h-2.5 w-2.5" /> built-in · free
                    </span>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white-2 text-[#713cff]"><Bot className="h-4 w-4" /></span>
                <div className="flex items-center gap-1 rounded-2xl border border-black/[0.06] bg-[#f9f9f9] px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#713cff]" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-black/[0.06] p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Describe the scam or paste the message…"
                className="flex-1 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#858585]/60 focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={busy || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl purple-gradient text-white transition-transform hover:scale-105 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#858585]">Try asking</h3>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full rounded-lg border border-black/[0.06] px-3 py-2 text-left text-xs text-[#858585] transition-colors hover:border-purple-200 hover:text-[#111111]"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card className="border-red-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-[#ef4444]">
              <Phone className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Already scammed?</h3>
            </div>
            <p className="text-xs leading-relaxed text-[#858585]">
              Act fast to improve chances of recovering funds.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[#858585]">
              <li>☎ Call <span className="font-semibold text-[#111111]">1930</span> (national cybercrime helpline)</li>
              <li>🌐 Report at <span className="font-semibold text-[#111111]">cybercrime.gov.in</span></li>
              <li>🏦 Contact your bank to block the transaction</li>
              <li>📸 Save all evidence (SMS, screenshots, IDs)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}