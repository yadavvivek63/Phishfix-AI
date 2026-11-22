import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/api";

export async function GET(req: NextRequest) {
 const g = guard(req, "notif", 60, 60_000);
 if (!g.ok) return g.response;

 const notifications = [
 {
 id: "n1",
 type: "critical" as const,
 title: "Fake KYC scam spike detected",
 message: "A new wave of fake SBI KYC SMS scams is targeting Maharashtra and Delhi. Don't click any KYC update links.",
 time: "2 min ago",
 read: false,
 },
 {
 id: "n2",
 type: "warning" as const,
 title: "Delivery fee scam trending",
 message: "Multiple users reported fake DTDC redelivery SMS with shortened links. Verify on the official courier app only.",
 time: "15 min ago",
 read: false,
 },
 {
 id: "n3",
 type: "info" as const,
 title: "New UPI fraud pattern",
 message: "Scammers are sending collect requests disguised as refunds. Never approve a collect request to receive money.",
 time: "1 hour ago",
 read: false,
 },
 {
 id: "n4",
 type: "success" as const,
 title: "Weekly report is ready",
 message: "Your weekly scam protection summary is available. 12 threats blocked, 3 warnings issued.",
 time: "3 hours ago",
 read: true,
 },
 ];

 return NextResponse.json(
 { notifications, unread: notifications.filter((n) => !n.read).length },
 { headers: g.headers },
 );
}