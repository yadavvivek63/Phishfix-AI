import { MapPinOff, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-warn/10 text-warn">
        <MapPinOff className="h-8 w-8" />
      </div>
      <span className="mb-2 font-mono text-5xl font-bold text-warn">404</span>
      <h1 className="text-2xl font-bold tracking-tight text-text">Page not found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
        >
          <Home className="h-4 w-4" /> Go to home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-navy-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-cyan/50"
        >
          <ArrowLeft className="h-4 w-4 text-cyan" /> Dashboard
        </Link>
      </div>
    </div>
  );
}