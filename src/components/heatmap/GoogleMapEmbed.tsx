"use client";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export function GoogleMapEmbed({
  lat,
  lng,
  zoom = 12,
  label,
  height = 420,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
  height?: number;
}) {
  const external = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const src = GOOGLE_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${lat},${lng}&zoom=${zoom}&maptype=roadmap&language=en`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-line/60"
      style={{ height, background: "#0b1627" }}
    >
      <iframe
        key={`${lat},${lng},${zoom}`}
        title={label ? `Google Map — ${label}` : "Google Map"}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <a
        href={external}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-[600] inline-flex items-center gap-1.5 rounded-lg border border-line bg-card/95 px-3 py-1.5 text-[11px] font-medium text-text shadow-lg backdrop-blur transition-colors hover:border-cyan/50 hover:text-cyan"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Open in Google Maps
      </a>

      {label && (
        <span className="absolute left-3 top-3 z-[600] rounded-lg border border-line/80 bg-card/90 px-2.5 py-1 text-[11px] font-medium text-cyan shadow-lg backdrop-blur">
          {label}
        </span>
      )}

      {!GOOGLE_KEY && (
        <span className="absolute bottom-3 left-3 z-[600] rounded-lg border border-warn/30 bg-warn/10 px-2.5 py-1 text-[10px] font-medium text-warn shadow-lg backdrop-blur">
          No API key — using fallback
        </span>
      )}
    </div>
  );
}

export default GoogleMapEmbed;