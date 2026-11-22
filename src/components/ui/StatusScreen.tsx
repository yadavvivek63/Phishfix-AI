import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatusScreen({
  icon: Icon,
  code,
  title,
  description,
  tone = "cyan",
  children,
}: {
  icon: LucideIcon;
  code?: string;
  title: string;
  description: string;
  tone?: "cyan" | "danger" | "warn";
  children?: ReactNode;
}) {
  const toneClass =
    tone === "danger" ? "text-[#ef4444]" : tone === "warn" ? "text-[#f59e0b]" : "text-[#2563eb]";
  const bgClass =
    tone === "danger" ? "bg-red-50" : tone === "warn" ? "bg-amber-50" : "bg-blue-50";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${bgClass} ${toneClass}`}>
        <Icon className="h-8 w-8" />
      </div>
      {code && (
        <span className={`mb-2 font-mono text-5xl font-bold ${toneClass}`}>{code}</span>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-[#111111]">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#858585]">{description}</p>
      {children && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}