"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { StatusScreen } from "@/components/ui/StatusScreen";

export default function AppError({
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
      description="An unexpected error occurred while loading this page. Your data is safe — try again, or head back to the dashboard."
    >
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-navy-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-cyan/50"
      >
        <Home className="h-4 w-4 text-cyan" /> Go to dashboard
      </Link>
      {process.env.NODE_ENV !== "production" && error?.message && (
        <p className="mt-2 w-full max-w-lg break-words rounded-lg bg-navy-2 p-3 text-left font-mono text-[11px] text-muted">
          {error.message}
        </p>
      )}
    </StatusScreen>
  );
}