import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { guard, jsonError } from "@/lib/api";
import { assistantReply, greetingFor, isLanguageCode, LANGUAGES, type LanguageCode } from "@/lib/assistant";

const schema = z.object({
 message: z.string().min(2).max(2000),
 history: z
 .array(
 z.object({
 role: z.enum(["user", "assistant"]),
 content: z.string(),
 }),
 )
 .max(20)
 .optional(),
 lang: z.string().max(8).optional(),
});

function languageName(code: LanguageCode): string {
 return LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

export async function POST(req: NextRequest) {
 const g = guard(req, "chat", 30, 60_000);
 if (!g.ok) return g.response;

 let body: unknown;
 try {
 body = await req.json();
 } catch {
 return jsonError("Invalid JSON body.");
 }
 const parsed = schema.safeParse(body);
 if (!parsed.success) return jsonError("Please send a message.");

 const { message, history = [] } = parsed.data;
 const requested = parsed.data.lang;
 const lang: LanguageCode | "auto" =
 requested && isLanguageCode(requested) ? requested : "auto";

 const result = assistantReply(message, lang);
 const resolvedLanguage = result.lang;
 const targetLanguage = languageName(resolvedLanguage);

 const systemPrompt =
 `You are Phishfix AI, a calm, expert Indian cyber-safety assistant. ` +
 `Help users understand scams (fake KYC, delivery, UPI, phishing, QR, WhatsApp/SMS fraud). ` +
 `Always give concrete step-by-step safety instructions. ` +
 `Never ask for OTP, PIN, passwords, card or UPI PINs. ` +
 `If a user has already been scammed, give emergency guidance: call 1930 (cybercrime helpline), ` +
 `visit cybercrime.gov.in, contact their bank, and preserve evidence. ` +
 `Respond in ${targetLanguage} (${resolvedLanguage}). Be concise, warm, and actionable. ` +
 `Do not invent statistics. Keep replies under 150 words.`;

 // 1) Gemini (Google AI Studio) — real AI replies, free tier.
 const geminiKey = process.env.GEMINI_API_KEY;
 if (geminiKey) {
 const geminiModel = process.env.GEMINI_MODEL || "gemini-flash-latest";
 for (let attempt = 1; attempt <= 3; attempt++) {
 try {
 const contents = [
 ...history.slice(-8).map((m) => ({
 role: m.role === "assistant" ? "model" : "user",
 parts: [{ text: m.content }],
 })),
 { role: "user", parts: [{ text: message }] },
 ];
 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), 20_000);
 const resp = await fetch(
 `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
 {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 systemInstruction: { parts: [{ text: systemPrompt }] },
 contents,
 generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
 }),
 signal: controller.signal,
 },
 );
 clearTimeout(timer);
 if (resp.ok) {
 const data = (await resp.json()) as {
 candidates?: { content?: { parts?: { text?: string }[] } }[];
 };
 const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
 if (text) {
 return NextResponse.json(
 { reply: text, source: "gemini", demo: false, lang: resolvedLanguage, intent: result.intent },
 { headers: g.headers },
 );
 }
 } else if (resp.status !== 503 && resp.status !== 429) {
 // Non-retryable error (e.g. bad key) — stop retrying.
 break;
 }
 // 503/429 → retry after backoff
 } catch {
 // network/timeout — retry
 }
 if (attempt < 3) {
 await new Promise((r) => setTimeout(r, 800 * attempt));
 }
 }
 }

 // 2) Ollama (local LLM) — used only when OLLAMA_URL is configured.
 const ollamaUrl = process.env.OLLAMA_URL;
 if (ollamaUrl) {
 try {
 const messages = [
 { role: "system", content: systemPrompt },
 ...history.slice(-8),
 { role: "user", content: message },
 ];
 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), 25_000);
 const resp = await fetch(`${ollamaUrl}/api/chat`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 model: process.env.OLLAMA_MODEL || "llama3.2",
 messages,
 stream: false,
 }),
 signal: controller.signal,
 });
 clearTimeout(timer);
 if (resp.ok) {
 const data = (await resp.json()) as { message?: { content?: string } };
 const content = data.message?.content?.trim();
 if (content) {
 return NextResponse.json(
 { reply: content, source: "ollama", demo: false, lang: resolvedLanguage, intent: result.intent },
 { headers: g.headers },
 );
 }
 }
 } catch {
 // fall through to the built-in assistant
 }
 }

 // 3) Built-in offline assistant — always works, no key needed.
 return NextResponse.json(
 {
 reply: result.reply,
 source: "local",
 demo: true,
 lang: resolvedLanguage,
 intent: result.intent,
 greeting: greetingFor(resolvedLanguage),
 note: geminiKey
 ? "Gemini key set but request failed — used built-in assistant."
 : "Built-in assistant (no API key). Add GEMINI_API_KEY for real AI replies.",
 },
 { headers: g.headers },
 );
}