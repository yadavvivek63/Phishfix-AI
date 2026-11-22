"use client";

import { QrCode, Upload, Loader2, ScanText } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { ScanResultView } from "@/components/ui/ScanResultView";
import { postJSON } from "@/lib/client";
import type { ScanResult } from "@/lib/types";
import { useRef, useState } from "react";

type Tab = "qr" | "image";

export default function QrScannerPage() {
  const [tab] = useState<Tab>("qr");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErr("Please upload a PNG, JPG or WEBP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErr("Image too large (max 8MB).");
      return;
    }
    setErr("");
    setResult(null);
    setBusy(true);

    const url = URL.createObjectURL(file);
    setPreview(url);

    try {
      let text = "";
      if (tab === "qr") {
        text = await decodeQr(file);
      } else {
        text = await runOcr(file);
      }

      if (!text.trim()) {
        setErr(tab === "qr" ? "No QR code found in this image. Try a clearer, cropped image." : "No readable text found. Try a sharper screenshot.");
        setBusy(false);
        return;
      }
      const res = await postJSON<ScanResult>("/api/scan/image", { text, source: tab === "qr" ? "qr" : "ocr" });
      setResult(res);
    } catch (e) {
      setErr((e as Error).message || "Could not process the image.");
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <PageIntro
        icon={QrCode}
        title="QR & Image Scanner"
        subtitle="Upload a QR code or screenshot. We decode the QR destination or run OCR on the image, then risk-analyze the extracted content — all in your browser."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex rounded-xl border border-black/[0.06] bg-[#f9f9f9] p-1">
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${tab === "qr" ? "bg-purple-50 text-[#713cff]" : "text-[#858585] hover:text-[#111111]"}`}
            >
              <QrCode className="h-4 w-4" /> QR Code
            </button>
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${tab === "image" ? "bg-purple-50 text-[#713cff]" : "text-[#858585] hover:text-[#111111]"}`}
            >
              <ScanText className="h-4 w-4" /> Screenshot (OCR)
            </button>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/[0.06] bg-[#f9f9f9]/40 px-6 py-12 text-center transition-colors hover:border-purple-200"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="mb-4 max-h-48 rounded-lg object-contain" />
            ) : (
              <Upload className="mb-3 h-10 w-10 text-[#858585]/50" />
            )}
            <p className="text-sm font-medium text-[#858585]">
              {busy ? "Processing…" : "Click or drop an image here"}
            </p>
            <p className="mt-1 text-xs text-[#858585]/70">
              {tab === "qr" ? "PNG/JPG containing a QR code" : "PNG/JPG screenshot with text"} · max 8MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {err && <p className="text-xs text-[#ef4444]">{err}</p>}
        </div>

        <div>
          {busy && <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#713cff]" />}
          {!busy && result && (
            <div className="rounded-2xl glass p-5">
              <ScanResultView result={result} />
            </div>
          )}
          {!busy && !result && (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.06]/70 p-8 text-center">
              <QrCode className="mb-3 h-10 w-10 text-[#858585]/50" />
              <p className="text-sm font-medium text-[#858585]">Results appear here</p>
              <p className="mt-1 max-w-xs text-xs text-[#858585]/70">
                Upload a QR code or screenshot to extract and analyze its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function decodeQr(file: File): Promise<string> {
  const jsQR = (await import("jsqr")).default;
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported.");
  ctx.drawImage(bitmap, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(data.data, data.width, data.height);
  return code?.data || "";
}

async function runOcr(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(file);
    return data.text || "";
  } finally {
    await worker.terminate();
  }
}