"use client";

import { AlertOctagon, RotateCcw } from "lucide-react";

// Catches errors in the root layout itself. Must render its own <html>/<body>.
export default function GlobalError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 return (
 <html lang="en">
 <body
 style={{
 margin: 0,
 minHeight: "100vh",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 background: "#08111f",
 color: "#edf5ff",
 fontFamily: "system-ui, sans-serif",
 textAlign: "center",
 padding: 24,
 }}
 >
 <div>
 <div
 style={{
 width: 64,
 height: 64,
 margin: "0 auto 20px",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 borderRadius: 16,
 background: "rgba(255,90,106,0.1)",
 color: "#ff5a6a",
 }}
 >
 <AlertOctagon size={32} />
 </div>
 <div style={{ fontSize: 48, fontWeight: 700, color: "#ff5a6a" }}>500</div>
 <h1 style={{ fontSize: 24, margin: "8px 0" }}>Critical application error</h1>
 <p style={{ color: "#8aa0bd", fontSize: 14, maxWidth: 420, margin: "0 auto 24px" }}>
 The application failed to load. Please try again.
 </p>
 <button
 onClick={reset}
 style={{
 display: "inline-flex",
 alignItems: "center",
 gap: 8,
 background: "#35d5e9",
 color: "#08111f",
 border: "none",
 padding: "12px 22px",
 borderRadius: 12,
 fontSize: 14,
 fontWeight: 700,
 cursor: "pointer",
 }}
 >
 <RotateCcw size={16} /> Try again
 </button>
 {process.env.NODE_ENV !== "production" && error?.message && (
 <pre
 style={{
 marginTop: 16,
 textAlign: "left",
 background: "#101d30",
 color: "#8aa0bd",
 padding: 12,
 borderRadius: 8,
 fontSize: 11,
 maxWidth: 560,
 overflow: "auto",
 }}
 >
 {error.message}
 </pre>
 )}
 </div>
 </body>
 </html>
 );
}