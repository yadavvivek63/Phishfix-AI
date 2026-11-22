"use client";

import { Smartphone } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";
import { ScanForm } from "@/components/scanners/ScanForm";
import { useState } from "react";

const UPI_EXAMPLES = ["kycverify@ybl", "deliveryfee@paytm", "fraudclaims@ibl"];
const PHONE_EXAMPLES = ["+91 90000 00000", "9811122222", "+91 98111 22222"];

export default function UpiCheckerPage() {
  const [mode, setMode] = useState<"upi" | "phone">("upi");

  return (
    <div>
      <PageIntro
        icon={Smartphone}
        title="UPI & Phone Checker"
        subtitle="Check a UPI ID or phone number for suspicious patterns before you pay or share information."
      />

      <div className="mb-5 inline-flex rounded-xl border border-black/[0.06] bg-[#f9f9f9] p-1">
        <button
          onClick={() => setMode("upi")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${mode === "upi" ? "bg-purple-50 text-[#713cff]" : "text-[#858585] hover:text-[#111111]"}`}
        >
          UPI ID
        </button>
        <button
          onClick={() => setMode("phone")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${mode === "phone" ? "bg-purple-50 text-[#713cff]" : "text-[#858585] hover:text-[#111111]"}`}
        >
          Phone Number
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {mode === "upi" ? (
            <ScanForm
              key="upi"
              kind="upi"
              label="UPI ID"
              placeholder="name@bank"
              buttonLabel="Check UPI"
              examples={UPI_EXAMPLES}
            />
          ) : (
            <ScanForm
              key="phone"
              kind="phone"
              label="Phone number"
              placeholder="+91 98765 43210"
              buttonLabel="Check number"
              examples={PHONE_EXAMPLES}
            />
          )}
        </div>

        <Card className="h-fit p-5">
          <h3 className="mb-3 text-sm font-semibold">How to stay safe</h3>
          <ul className="space-y-2 text-xs text-[#858585]">
            <li>• Never approve a UPI collect request to "receive" money.</li>
            <li>• Entering a UPI PIN is only ever for <em>paying</em>.</li>
            <li>• Verify the recipient&apos;s name in your UPI app before sending.</li>
            <li>• Unknown numbers asking for OTP/PIN are almost always scams.</li>
            <li>• Report confirmed fraud at cybercrime.gov.in or call 1930.</li>
          </ul>
          <p className="mt-4 rounded-lg bg-purple-50/50 p-3 text-[11px] leading-relaxed text-[#858585]">
            A "valid format" result does not mean an ID is safe — always verify the person independently.
          </p>
        </Card>
      </div>
    </div>
  );
}