"use client";

import { ImageIcon, Loader2, ScanText, FileImage } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";
import { ScanResultView } from "@/components/ui/ScanResultView";
import { postJSON } from "@/lib/client";
import type { ScanResult } from "@/lib/types";
import { useRef, useState } from "react";

export default function ImageScannerPage() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
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
    setOcrProgress(0);

    setPreview(URL.createObjectURL(file));

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100));
        },
      });
      let text = "";
      try {
        const { data } = await worker.recognize(file);
        text = data.text || "";
      } finally {
        await worker.terminate();
      }

      if (!text.trim()) {
        setErr("No readable text found. Try a sharper, higher-resolution screenshot.");
        setBusy(false);
        return;
      }
      const res = await postJSON<ScanResult>("/api/scan/image", { text, source: "ocr" });
      setResult(res);
    } catch (e) {
      setErr((e as Error).message || "Could not process the image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageIntro
        icon={ImageIcon}
        title="Screenshot & Image Scanner"
        subtitle="Upload a screenshot of a suspicious message or page. We run on-device OCR to extract the text, then risk-analyze it — your image never leaves your browser for OCR."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-navy-2/40 px-6 py-12 text-center transition-colors hover:border-cyan/40"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="mb-4 max-h-52 rounded-lg object-contain" />
            ) : (
              <FileImage className="mb-3 h-10 w-10 text-muted/50" />
            )}
            <p className="text-sm font-medium text-muted">{busy ? `Running OCR… ${ocrProgress}%` : "Click or drop a screenshot here"}</p>
            <p className="mt-1 text-xs text-muted/70">PNG / JPG / WEBP · max 8MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
          {err && <p className="text-xs text-danger">{err}</p>}
        </div>

        <div>
          {busy && (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line/70 p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan" />
              <p className="text-sm text-muted">Extracting text from image…</p>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-navy-2">
                <div className="h-full rounded-full bg-cyan transition-all" style={{ width: `${ocrProgress}%` }} />
              </div>
            </div>
          )}
          {!busy && result && (
            <div className="rounded-2xl glass p-5">
              <ScanResultView result={result} />
            </div>
          )}
          {!busy && !result && (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-line/70 p-8 text-center">
              <ImageIcon className="mb-3 h-10 w-10 text-muted/50" />
              <p className="text-sm font-medium text-muted">Results appear here</p>
              <p className="mt-1 max-w-xs text-xs text-muted/70">Upload a screenshot to extract and analyze its text.</p>
            </div>
          )}
        </div>
      </div>

      <Card className="mt-5 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan">
          <ScanText className="h-4 w-4" /> Deepfake &amp; media analysis (framework)
        </h3>
        <p className="text-xs leading-relaxed text-muted">
          Phishfix provides a framework slot for suspicious audio/video analysis. The current build focuses on
          text/image OCR. A production deepfake detector would run frame-level artifact analysis and audio
          voice-cloning detection on an isolated worker — see the README for the integration outline.
        </p>
      </Card>
    </div>
  );
}