import {
 LayoutDashboard,
 ShieldAlert,
 Link2,
 FlaskConical,
 Bot,
 Map,
 QrCode,
 Image,
 Smartphone,
 Flag,
 User,
 ShieldHalf,
 Home,
 type LucideIcon,
} from "lucide-react";

export interface NavItem {
 href: string;
 label: string;
 icon: LucideIcon;
 group: string;
 desc: string;
}

export const NAV_ITEMS: NavItem[] = [
 { href: "/", label: "Home", icon: Home, group: "Overview", desc: "Landing & product overview" },
 { href: "/dashboard", label: "Security Dashboard", icon: LayoutDashboard, group: "Overview", desc: "Your protection at a glance" },
 { href: "/scanner/message", label: "Message Scanner", icon: ShieldAlert, group: "Scanners", desc: "Scan SMS & WhatsApp messages" },
 { href: "/scanner/url", label: "Advanced URL Scanner", icon: Link2, group: "Scanners", desc: "Deep URL & domain analysis" },
 { href: "/scanner/qr", label: "QR Code Scanner", icon: QrCode, group: "Scanners", desc: "Decode & analyze QR codes" },
 { href: "/scanner/image", label: "Screenshot & Image Scanner", icon: Image, group: "Scanners", desc: "OCR & analyze screenshots" },
 { href: "/scanner/upi", label: "UPI & Phone Checker", icon: Smartphone, group: "Scanners", desc: "Check UPI IDs & phone numbers" },
 { href: "/sandbox", label: "Cloud Sandbox", icon: FlaskConical, group: "Investigate", desc: "Isolated URL inspection" },
 { href: "/assistant", label: "AI Cyber Assistant", icon: Bot, group: "Investigate", desc: "Safety guidance chatbot" },
 { href: "/heatmap", label: "India Scam Heatmap", icon: Map, group: "Investigate", desc: "State-wise scam trends" },
 { href: "/report", label: "Community Reporting", icon: Flag, group: "Community", desc: "Report & review scams" },
 { href: "/emergency", label: "Report Cybercrime", icon: ShieldAlert, group: "Community", desc: "File an official cybercrime report" },
 { href: "/profile", label: "Profile & Settings", icon: User, group: "Account", desc: "Your account preferences" },
 { href: "/admin", label: "Admin Dashboard", icon: ShieldHalf, group: "Account", desc: "Moderation & system health" },
];

export const NAV_GROUPS = ["Overview", "Scanners", "Investigate", "Community", "Account"];