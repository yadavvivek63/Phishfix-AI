import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phishfix AI — Detect. Investigate. Protect.",
  description:
    "AI-powered scam detection & cybersecurity platform for India. Scan messages, URLs, QR codes, UPI IDs and get real-time protection against phishing, fake KYC and financial fraud.",
  applicationName: "Phishfix AI",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
 return (
 <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
 <body className="min-h-full antialiased">{children}</body>
 </html>
 );
}