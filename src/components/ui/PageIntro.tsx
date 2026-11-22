import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageIntro({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-[#713cff]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-[#111111]">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#858585]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}