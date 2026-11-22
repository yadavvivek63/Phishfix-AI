"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { Bell, Search, ShieldAlert, AlertTriangle, Info, CheckCircle2, X, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getJSON } from "@/lib/client";

interface Notif {
 id: string;
 type: "critical" | "warning" | "info" | "success";
 title: string;
 message: string;
 time: string;
 read: boolean;
}

const TYPE_META = {
 critical: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10" },
 warning: { icon: ShieldAlert, color: "text-warn", bg: "bg-warn/10" },
 info: { icon: Info, color: "text-cyan", bg: "bg-cyan/10" },
 success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

export function TopBar() {
 const pathname = usePathname();
 const [notifOpen, setNotifOpen] = useState(false);
 const [notifications, setNotifications] = useState<Notif[]>([]);
 const [unread, setUnread] = useState(0);
 const notifRef = useRef<HTMLDivElement>(null);

 const current =
 NAV_ITEMS.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href))) ||
 NAV_ITEMS[0];

 useEffect(() => {
 getJSON<{ notifications: Notif[]; unread: number }>("/api/notifications")
 .then((d) => {
 setNotifications(d.notifications);
 setUnread(d.unread);
 })
 .catch(() => {});
 }, []);

 useEffect(() => {
 if (!notifOpen) return;
 const onClick = (e: MouseEvent) => {
 if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
 setNotifOpen(false);
 }
 };
 document.addEventListener("mousedown", onClick);
 return () => document.removeEventListener("mousedown", onClick);
 }, [notifOpen]);

 function markAllRead() {
 setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
 setUnread(0);
 }

 function toggleNotif(id: string) {
 setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));
 setUnread((u) => Math.max(0, u - 1));
 }

 return (
 <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/60 bg-navy/70 px-5 backdrop-blur-xl lg:px-8">
 <div className="flex items-center gap-3 pl-12 lg:pl-0">
 <h1 className="text-base font-semibold tracking-tight">{current.label}</h1>
 <span className="hidden rounded-lg border border-line/70 px-2.5 py-0.5 text-[11px] text-muted sm:inline">
 {current.group}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <Link
 href="/emergency"
 className="inline-flex items-center gap-1.5 rounded-lg border border-line/70 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
 >
 <FileText className="h-3.5 w-3.5" />
 <span className="hidden sm:inline">File report</span>
 </Link>
 <a
 href="tel:1930"
 className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/5 px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/15"
 aria-label="Call 1930 cybercrime helpline"
 >
 <ShieldAlert className="h-3.5 w-3.5" />
 <span className="hidden sm:inline">Emergency</span>
 </a>
 <Link
 href="/scanner/message"
 className="hidden items-center gap-2 rounded-lg border border-line/70 px-3 py-1.5 text-sm text-muted transition-colors hover:text-text sm:flex"
 >
 <Search className="h-4 w-4" /> Quick scan
 </Link>
 <div className="relative" ref={notifRef}>
 <button
 onClick={() => setNotifOpen((o) => !o)}
 className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line/70 text-muted transition-colors hover:text-text"
 aria-label="Notifications"
 >
 <Bell className="h-4 w-4" />
 {unread > 0 && (
 <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-lg bg-danger px-1 text-[9px] font-bold text-navy">
 {unread}
 </span>
 )}
 </button>

 {notifOpen && (
 <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-line/60 bg-navy-2 shadow-2xl animate-fade-up">
 <div className="flex items-center justify-between border-b border-line/60 px-4 py-3">
 <h3 className="text-sm font-semibold">Notifications</h3>
 <div className="flex items-center gap-2">
 {unread > 0 && (
 <button
 onClick={markAllRead}
 className="text-[11px] font-medium text-cyan hover:underline"
 >
 Mark all read
 </button>
 )}
 <button
 onClick={() => setNotifOpen(false)}
 className="text-muted hover:text-text"
 aria-label="Close"
 >
 <X className="h-4 w-4" />
 </button>
 </div>
 </div>
 <div className="max-h-80 overflow-y-auto">
 {notifications.length === 0 && (
 <p className="p-4 text-center text-xs text-muted">No notifications</p>
 )}
 {notifications.map((n) => {
 const meta = TYPE_META[n.type];
 return (
 <button
 key={n.id}
 onClick={() => toggleNotif(n.id)}
 className={`flex w-full gap-3 border-b border-line/40 px-4 py-3 text-left transition-colors hover:bg-navy-2/50 ${!n.read ? "bg-cyan/5" : ""}`}
 >
 <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
 <meta.icon className="h-4 w-4" />
 </span>
 <div className="min-w-0 flex-1">
 <p className="text-xs font-medium text-text">{n.title}</p>
 <p className="mt-0.5 text-[11px] leading-snug text-muted">{n.message}</p>
 <p className="mt-1 text-[10px] text-muted/60">{n.time}</p>
 </div>
 {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-lg bg-cyan" />}
 </button>
 );
 })}
 </div>
 </div>
 )}
 </div>
 <div className="flex items-center gap-2 rounded-lg border border-line/70 py-1 pl-1 pr-3">
 <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan/15 text-xs font-bold text-cyan">
 SK
 </span>
 <span className="hidden text-sm font-medium sm:inline">Guest</span>
 </div>
 </div>
 </header>
 );
}