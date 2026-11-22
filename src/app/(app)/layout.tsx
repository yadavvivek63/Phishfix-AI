import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
 <TopBar />
 <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
 <footer className="border-t border-line/60 px-8 py-4 text-center text-xs text-muted">
 Phishfix AI · Detect. Investigate. Protect. · Not a substitute for official cybercrime reporting (cybercrime.gov.in · 1930)
 </footer>
 </div>
 </div>
 );
}