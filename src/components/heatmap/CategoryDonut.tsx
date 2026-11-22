"use client";

import { CATEGORY_COLORS } from "@/lib/seed";

export interface CategoryDatum {
 key: string;
 name: string;
 value: number;
}

export function CategoryDonut({ data }: { data: CategoryDatum[] }) {
 const total = data.reduce((a, b) => a + b.value, 0) || 1;
 const size = 132;
 const stroke = 16;
 const r = (size - stroke) / 2;
 const c = 2 * Math.PI * r;

 const segments = data.map((d, i) => {
 const before = data.slice(0, i).reduce((a, b) => a + b.value, 0);
 const frac = d.value / total;
 const len = frac * c;
 return {
 ...d,
 pct: Math.round(frac * 100),
 color: CATEGORY_COLORS[d.key] || "#a78bfa",
 dash: `${len} ${c - len}`,
 offset: -(before / total) * c,
 };
 });

 return (
 <div className="flex items-center gap-3">
 <div className="relative shrink-0" style={{ width: size, height: size }}>
 <svg width={size} height={size} className="-rotate-90">
 <circle cx={size / 2} cy={size / 2} r={r} stroke="#f0efec" strokeWidth={stroke} fill="none" />
 {segments.map((s) => (
 <circle
 key={s.key}
 cx={size / 2}
 cy={size / 2}
 r={r}
 stroke={s.color}
 strokeWidth={stroke}
 fill="none"
 strokeDasharray={s.dash}
 strokeDashoffset={s.offset}
 />
 ))}
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span className="text-lg font-bold text-[#111111]">{total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}</span>
 <span className="text-[9px] uppercase tracking-wider text-[#858585]">scams</span>
 </div>
 </div>

 <div className="space-y-1">
 {segments.map((s) => (
 <div key={s.key} className="flex items-center gap-1.5 text-[11px]">
 <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
 <span className="text-[#858585]">{s.name}</span>
 <span className="ml-auto font-semibold text-[#111111]">{s.pct}%</span>
 </div>
 ))}
 </div>
 </div>
 );
}

export default CategoryDonut;