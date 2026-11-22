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
 className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl glass text-cyan lg:hidden"
 onClick={() => setOpen(true)}
 aria-label="Open menu"
 >
 <Menu className="h-5 w-5" />
 </button>

 {open && (
 <div
 className="fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm lg:hidden"
 onClick={() => setOpen(false)}
 />
 )}

 <aside
 className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line/60 bg-navy-2/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${
 open ? "translate-x-0" : "-translate-x-full"
 }`}
 >
 <div className="flex h-16 items-center justify-between px-5">
 <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/15 text-cyan glow-cyan">
 <ShieldCheck className="h-5 w-5" />
 </span>
 <span className="text-sm font-bold tracking-tight">
 PHISH<span className="text-cyan">FIX</span>{" "}
 <span className="text-cyan-soft">AI</span>
 </span>
 </Link>
 <button className="text-muted lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
 <X className="h-5 w-5" />
 </button>
 </div>

 <nav className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-3 pb-6 pt-2">
 {NAV_GROUPS.map((group) => (
 <div key={group}>
 <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted/70">
 {group}
 </p>
 <ul className="space-y-0.5">
 {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
 const active = isActive(item.href);
 const Icon = item.icon;
 return (
 <li key={item.href}>
 <Link
 href={item.href}
 onClick={() => setOpen(false)}
 className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
 active
 ? "bg-cyan/10 font-medium text-cyan"
 : "text-muted hover:bg-card/5 hover:text-text"
 }`}
 >
 <Icon className={`h-4 w-4 ${active ? "text-cyan" : "text-muted group-hover:text-text"}`} />
 {item.label}
 </Link>
 </li>
 );
 })}
 </ul>
 </div>
 ))}
 </nav>

 <div className="border-t border-line/60 p-4">
 <div className="rounded-xl bg-cyan/5 p-3">
 <p className="text-xs font-semibold text-cyan-soft">Detect. Investigate. Protect.</p>
 <p className="mt-1 text-[11px] leading-relaxed text-muted">
 Free &amp; open-source scam protection for every Indian.
 </p>
 </div>
 </div>
 </aside>
 </>
 );
}