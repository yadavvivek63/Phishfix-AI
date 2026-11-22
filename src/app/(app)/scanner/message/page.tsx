"use client";

import { MessageSquare } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Card } from "@/components/ui/Primitives";
import { ScanForm } from "@/components/scanners/ScanForm";

const EXAMPLES = [
  "Your SBI account KYC is pending. Update now to avoid blocking: http://sbi-kyc-update.xyz/verify",
  "Your Amazon delivery failed. Reschedule and pay ₹15 redelivery fee: bit.ly/dtdc-fee",
  "Congratulations! You won an iPhone 15. Claim now: http://claim-reward.icu/win",
];

export default function MessageScannerPage() {
  return (
    <div>
      <PageIntro
        icon={MessageSquare}
        title="Message Scanner"
        subtitle="Paste any SMS, WhatsApp or email text. We detect fake KYC, delivery, payment and urgency scams with a clear risk verdict and step-by-step reasons."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScanForm
            kind="message"
            label="Message text"
            rows={8}
            placeholder="Paste the full suspicious message here…"
            buttonLabel="Scan message"
            examples={EXAMPLES}
          />
        </div>
        <Card className="h-fit p-5">
          <h3 className="mb-3 text-sm font-semibold">What we look for</h3>
          <ul className="space-y-2 text-xs text-muted">
            {[
              "Fake KYC / account-blocking pretexts",
              "Delivery & redelivery fee scams",
              "Payment / refund / reward lures",
              "Urgency & pressure tactics",
              "Requests for OTP, PIN, Aadhaar",
              "Brand & authority impersonation",
              "Suspicious links in the message",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-cyan/5 p-3 text-[11px] leading-relaxed text-muted">
            Analysis runs locally with transparent heuristics — no message content leaves your device.
          </p>
        </Card>
      </div>
    </div>
  );
}