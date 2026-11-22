"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { StatusScreen } from "@/components/ui/StatusScreen";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      icon={AlertTriangle}
      code="500"
      tone="danger"
      title="Something went wrong"
      description="An unexpected error occurred. Try again, or return to the homepage."
    >
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl blue-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-5 py-2.5 text-sm font-semibold text-[#111111] transition-colors hover:border-blue-400"
      >
        <Home className="h-4 w-4 text-[#2563eb]" /> Homepage
      </Link>
      {process.env.NODE_ENV !== "production" && error?.message && (
        <p className="mt-2 w-full max-w-lg break-words rounded-lg bg-[#f9f9f9] p-3 text-left font-mono text-[11px] text-[#858585]">
          {error.message}
        </p>
      )}
    </StatusScreen>
  );
}