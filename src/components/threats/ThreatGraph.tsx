"use client";

import { useMemo } from "react";

interface Node {
 id: string;
 label: string;
 type: string;
 risk: number;
 reports: number;
 campaign: string;
}
interface Edge {
 source: string;
 target: string;
}

// Deterministic circular layout with a light force relaxation.
export function ThreatGraph({
 nodes,
 edges,
 typeColor,
 selectedId,
 onSelect,
}: {
 nodes: Node[];
 edges: Edge[];
 typeColor: Record<string, string>;
 selectedId?: string;
 onSelect?: (id: string) => void;
}) {
 const W = 720;
 const H = 360;
 const positions = useMemo(() => {
 const cx = W / 2;
 const cy = H / 2;
 const r = Math.min(W, H) / 2 - 50;
 const map = new Map<string, { x: number; y: number }>();
 nodes.forEach((n, i) => {
 const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
 map.set(n.id, { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
 });
 return map;
 }, [nodes]);

 return (
 <div className="w-full overflow-x-auto">
 <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[520px]" style={{ width: "100%", height: "auto" }}>
 <defs>
 <radialGradient id="glow" cx="50%" cy="50%" r="50%">
 <stop offset="0%" stopColor="#35d5e9" stopOpacity="0.08" />
 <stop offset="100%" stopColor="#35d5e9" stopOpacity="0" />
 </radialGradient>
 </defs>
 <rect x="0" y="0" width={W} height={H} fill="url(#glow)" />

 {edges.map((e, i) => {
 const a = positions.get(e.source);
 const b = positions.get(e.target);
 if (!a || !b) return null;
 return (
 <line
 key={i}
 x1={a.x}
 y1={a.y}
 x2={b.x}
 y2={b.y}
 stroke="#1e3350"
 strokeWidth={1.5}
 />
 );
 })}

 {nodes.map((n) => {
 const p = positions.get(n.id);
 if (!p) return null;
 const selected = n.id === selectedId;
 const color = typeColor[n.type] || "#8aa0bd";
 const r = 6 + (n.reports / 1200) * 8;
 return (
 <g
 key={n.id}
 onClick={() => onSelect?.(n.id)}
 className="cursor-pointer"
 style={{ transition: "all 0.2s" }}
 >
 {selected && <circle cx={p.x} cy={p.y} r={r + 6} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6} />}
 <circle cx={p.x} cy={p.y} r={r} fill={color} fillOpacity={selected ? 1 : 0.8} />
 <title>{`${n.label} (${n.type}) — risk ${n.risk}`}</title>
 </g>
 );
 })}
 </svg>
 </div>
 );
}