import { MapPinOff, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StatusScreen } from "@/components/ui/StatusScreen";

export default function AppNotFound() {
  return (
    <StatusScreen
      icon={MapPinOff}
      code="404"
      tone="warn"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved. It may have been removed. Let's get you back on track."
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
      >
        <Home className="h-4 w-4" /> Go to dashboard
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-navy-2 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-cyan/50"
      >
        <ArrowLeft className="h-4 w-4 text-cyan" /> Back to home
      </Link>
    </StatusScreen>
  );
}