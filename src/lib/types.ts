export type Risk = "safe" | "low" | "medium" | "high" | "critical";

export interface ScanSignal {
 id: string;
 label: string;
 severity: Risk;
 detail: string;
 weight: number;
}

export interface ScanResult {
 kind: "url" | "message" | "upi" | "qr" | "image" | "phone";
 input: string;
 verdict: Risk;
 riskScore: number; // 0-100
 confidence: number; // 0-100
 summary: string;
 signals: ScanSignal[];
 indicators: Record<string, unknown>;
 demo: boolean;
 scannedAt: string;
}

export interface HeatPoint {
 state: string;
 reports: number;
 scams: Record<string, number>;
 lat: number;
 lng: number;
}

export interface ThreatEntity {
 id: string;
 type: "domain" | "url" | "phone" | "upi" | "ip";
 value: string;
 risk: number;
 reports: number;
 campaign: string;
 links: string[];
}

export interface CommunityReport {
 id: string;
 category: string;
 target: string;
 description: string;
 state: string;
 createdAt: string;
 status: "open" | "reviewing" | "confirmed" | "dismissed";
 reports: number;
}