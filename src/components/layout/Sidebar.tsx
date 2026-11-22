"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_GROUPS } from "@/lib/nav";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl glass-strong text-[#713cff] shadow-lg lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/[0.06] bg-white/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl purple-gradient text-white shadow-lg shadow-purple-500/30">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight text-[#111111]">
              Phish<span className="purple-text-gradient">fix</span>{" "}
              <span className="text-[#858585] font-semibold">AI</span>
            </span>
          </Link>
          <button className="text-[#858585] lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-none flex-1 space-y-5 overflow-y-auto px-3 pb-6 pt-2">
          {NAV_GROUPS.map((group) => (
            <div key={group}>
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-[#858585]">
                {group}
              </p>
              <ul className="space-y-1">
                {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                          active
                            ? "bg-purple-50 text-[#713cff] font-medium shadow-sm"
                            : "text-[#858585] hover:bg-black/[0.03] hover:text-[#111111]"
                        }`}
                      >
                        <Icon className={`h-4 w-4 transition-colors ${active ? "text-[#713cff]" : "text-[#858585] group-hover:text-[#111111]"}`} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/[0.06] p-4">
          <div className="rounded-xl bg-purple-50/60 p-3">
            <p className="text-xs font-semibold purple-text-gradient">Detect. Investigate. Protect.</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#858585]">
              Free &amp; open-source scam protection for every Indian.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}