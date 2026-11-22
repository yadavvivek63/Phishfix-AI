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
        className="inline-flex items-center gap-2 rounded-xl blue-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        <Home className="h-4 w-4" /> Go to dashboard
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[#f9f9f9] px-5 py-2.5 text-sm font-semibold text-[#111111] transition-colors hover:border-blue-400"
      >
        <ArrowLeft className="h-4 w-4 text-[#2563eb]" /> Back to home
      </Link>
    </StatusScreen>
  );
}