import type { CommunityReport, HeatPoint, ThreatEntity } from "./types";

// Aggregated, privacy-protected demo dataset. Not real live statistics.
export const HEATMAP_DATA: HeatPoint[] = [
 { state: "Maharashtra", reports: 4820, scams: { kyc: 1500, delivery: 900, upi: 1200, phishing: 700, qr: 320, other: 200 }, lat: 19.07, lng: 72.87 },
 { state: "Delhi", reports: 4210, scams: { kyc: 1300, delivery: 700, upi: 1100, phishing: 650, qr: 260, other: 200 }, lat: 28.61, lng: 77.21 },
 { state: "Karnataka", reports: 3640, scams: { kyc: 1100, delivery: 600, upi: 1000, phishing: 560, qr: 230, other: 150 }, lat: 12.97, lng: 77.59 },
 { state: "Tamil Nadu", reports: 3120, scams: { kyc: 900, delivery: 520, upi: 880, phishing: 480, qr: 200, other: 140 }, lat: 13.08, lng: 80.27 },
 { state: "Telangana", reports: 2980, scams: { kyc: 850, delivery: 500, upi: 820, phishing: 460, qr: 200, other: 150 }, lat: 17.38, lng: 78.48 },
 { state: "Gujarat", reports: 2450, scams: { kyc: 700, delivery: 400, upi: 650, phishing: 380, qr: 170, other: 150 }, lat: 23.02, lng: 72.57 },
 { state: "Uttar Pradesh", reports: 2320, scams: { kyc: 700, delivery: 420, upi: 600, phishing: 340, qr: 150, other: 110 }, lat: 26.85, lng: 80.95 },
 { state: "West Bengal", reports: 1980, scams: { kyc: 600, delivery: 360, upi: 500, phishing: 300, qr: 130, other: 90 }, lat: 22.57, lng: 88.36 },
 { state: "Rajasthan", reports: 1640, scams: { kyc: 500, delivery: 300, upi: 400, phishing: 250, qr: 110, other: 80 }, lat: 26.91, lng: 75.79 },
 { state: "Kerala", reports: 1520, scams: { kyc: 460, delivery: 280, upi: 380, phishing: 230, qr: 100, other: 70 }, lat: 10.85, lng: 76.27 },
 { state: "Madhya Pradesh", reports: 1310, scams: { kyc: 400, delivery: 240, upi: 320, phishing: 200, qr: 90, other: 60 }, lat: 23.26, lng: 77.41 },
 { state: "Punjab", reports: 1180, scams: { kyc: 360, delivery: 210, upi: 290, phishing: 180, qr: 80, other: 60 }, lat: 31.15, lng: 75.34 },
 { state: "Haryana", reports: 1040, scams: { kyc: 320, delivery: 190, upi: 250, phishing: 160, qr: 70, other: 50 }, lat: 28.46, lng: 77.03 },
 { state: "Odisha", reports: 860, scams: { kyc: 260, delivery: 150, upi: 210, phishing: 130, qr: 60, other: 50 }, lat: 20.3, lng: 85.82 },
 { state: "Bihar", reports: 790, scams: { kyc: 240, delivery: 140, upi: 190, phishing: 120, qr: 50, other: 50 }, lat: 25.59, lng: 85.14 },
 { state: "Jharkhand", reports: 610, scams: { kyc: 180, delivery: 110, upi: 150, phishing: 90, qr: 40, other: 40 }, lat: 23.34, lng: 85.31 },
 { state: "Assam", reports: 540, scams: { kyc: 160, delivery: 100, upi: 130, phishing: 80, qr: 40, other: 30 }, lat: 26.14, lng: 91.74 },
 { state: "Chhattisgarh", reports: 480, scams: { kyc: 140, delivery: 90, upi: 110, phishing: 70, qr: 30, other: 40 }, lat: 21.28, lng: 81.73 },
 { state: "Uttarakhand", reports: 360, scams: { kyc: 110, delivery: 70, upi: 80, phishing: 50, qr: 20, other: 30 }, lat: 30.32, lng: 78.03 },
 { state: "Goa", reports: 240, scams: { kyc: 70, delivery: 40, upi: 60, phishing: 30, qr: 20, other: 20 }, lat: 15.49, lng: 73.83 },
];

export const THREAT_ENTITIES: ThreatEntity[] = [
 { id: "t1", type: "url", value: "http://sbi-kyc-update.xyz/verify", risk: 92, reports: 1240, campaign: "KYC-Phish-India", links: ["t2", "t5"] },
 { id: "t2", type: "domain", value: "sbi-kyc-update.xyz", risk: 88, reports: 1180, campaign: "KYC-Phish-India", links: ["t1", "t3"] },
 { id: "t3", type: "upi", value: "kycverify@ybl", risk: 74, reports: 640, campaign: "KYC-Phish-India", links: ["t2"] },
 { id: "t4", type: "url", value: "http://dtdc-delivery-fee.click/pay", risk: 81, reports: 920, campaign: "Delivery-Fee", links: ["t6", "t7"] },
 { id: "t5", type: "phone", value: "+91 90000 00000", risk: 66, reports: 410, campaign: "KYC-Phish-India", links: ["t1"] },
 { id: "t6", type: "domain", value: "dtdc-delivery-fee.click", risk: 78, reports: 880, campaign: "Delivery-Fee", links: ["t4"] },
 { id: "t7", type: "upi", value: "deliveryfee@paytm", risk: 61, reports: 360, campaign: "Delivery-Fee", links: ["t4"] },
 { id: "t8", type: "url", value: "http://paytm-refund-claim.icu/refund", risk: 84, reports: 760, campaign: "Refund-Bait", links: ["t9"] },
 { id: "t9", type: "phone", value: "+91 98111 22222", risk: 58, reports: 300, campaign: "Refund-Bait", links: ["t8"] },
];

export const COMMUNITY_REPORTS: CommunityReport[] = [
 { id: "r1", category: "Fake KYC", target: "sbi-kyc-update.xyz", description: "SMS asking to re-verify SBI KYC via a link, account to be frozen.", state: "Maharashtra", createdAt: "2026-11-18T09:30:00Z", status: "confirmed", reports: 1240 },
 { id: "r2", category: "Delivery scam", target: "dtdc-delivery-fee.click", description: "Redelivery fee SMS with a tiny URL leading to a card-entry page.", state: "Delhi", createdAt: "2026-11-17T14:10:00Z", status: "reviewing", reports: 920 },
 { id: "r3", category: "UPI fraud", target: "kycverify@ybl", description: "Caller posing as bank asking to approve a UPI collect request.", state: "Karnataka", createdAt: "2026-11-16T18:45:00Z", status: "confirmed", reports: 640 },
 { id: "r4", category: "Refund bait", target: "paytm-refund-claim.icu", description: "Fake refund page asking for card + OTP to 'process refund'.", state: "Tamil Nadu", createdAt: "2026-11-15T11:20:00Z", status: "open", reports: 760 },
 { id: "r5", category: "WhatsApp lottery", target: "Claim your iPhone reward", description: "Forwarded message claiming a prize with a short link.", state: "Gujarat", createdAt: "2026-11-14T08:05:00Z", status: "reviewing", reports: 480 },
 { id: "r6", category: "QR payment", target: "QR to scan@ybl", description: "Fake QR overlaid on a parking meter to redirect payments.", state: "Telangana", createdAt: "2026-11-13T16:40:00Z", status: "open", reports: 320 },
];

export const CATEGORY_COLORS: Record<string, string> = {
  kyc: "#713cff",
  delivery: "#a78bfa",
  upi: "#8b5cf6",
  phishing: "#6d28d9",
  qr: "#c4b5fd",
  other: "#a78bfa",
};

export function totalReports(): number {
 return HEATMAP_DATA.reduce((a, b) => a + b.reports, 0);
}

/* ------------------- Specific locations (cities, demo) ------------------- */

export interface CityLocation {
 city: string;
 state: string;
 lat: number;
 lng: number;
 reports: number;
 top: string;
 scams: Record<string, number>;
}

// Aggregated, privacy-protected demo dataset — not live statistics.
export const INDIAN_CITIES: CityLocation[] = [
 { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, reports: 2410, top: "UPI fraud", scams: { kyc: 600, delivery: 450, upi: 700, phishing: 350, qr: 160, other: 150 } },
 { city: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209, reports: 2620, top: "Fake KYC", scams: { kyc: 900, delivery: 450, upi: 650, phishing: 350, qr: 150, other: 120 } },
 { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, reports: 1980, top: "Phishing", scams: { kyc: 500, delivery: 350, upi: 500, phishing: 400, qr: 130, other: 100 } },
 { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, reports: 1640, top: "Fake KYC", scams: { kyc: 550, delivery: 300, upi: 420, phishing: 220, qr: 90, other: 60 } },
 { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, reports: 1520, top: "Delivery scam", scams: { kyc: 400, delivery: 550, upi: 350, phishing: 200, qr: 100, other: 80 } },
 { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, reports: 1210, top: "UPI fraud", scams: { kyc: 350, delivery: 250, upi: 320, phishing: 180, qr: 60, other: 50 } },
 { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, reports: 1140, top: "Delivery scam", scams: { kyc: 300, delivery: 400, upi: 250, phishing: 120, qr: 40, other: 30 } },
 { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, reports: 1020, top: "Phishing", scams: { kyc: 280, delivery: 260, upi: 240, phishing: 160, qr: 50, other: 30 } },
 { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, reports: 820, top: "Fake KYC", scams: { kyc: 280, delivery: 180, upi: 200, phishing: 100, qr: 40, other: 20 } },
 { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, reports: 760, top: "Delivery scam", scams: { kyc: 220, delivery: 250, upi: 160, phishing: 80, qr: 30, other: 20 } },
 { city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, reports: 710, top: "UPI fraud", scams: { kyc: 190, delivery: 180, upi: 200, phishing: 90, qr: 30, other: 20 } },
 { city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, reports: 640, top: "QR scam", scams: { kyc: 160, delivery: 160, upi: 150, phishing: 90, qr: 60, other: 20 } },
];