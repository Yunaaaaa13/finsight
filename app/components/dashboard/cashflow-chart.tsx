"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";

interface CashflowPoint {
  label: string;
  value: number;
}

interface CashflowChartProps {
  points: CashflowPoint[];
}

export function CashflowChart({ points }: CashflowChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...points.map((item) => item.value)) || 1;

  // Generate smooth curve path (catmull-rom → cubic bezier approximation)
  function getSplinePath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const chartPts = points.map((point, index) => ({
    x: 8 + (index / (points.length - 1)) * 84,
    y: 10 + (1 - point.value / maxValue) * 70,
  }));

  const linePath = getSplinePath(chartPts);
  const areaPath = `${linePath} L ${chartPts[chartPts.length - 1].x} 95 L ${chartPts[0].x} 95 Z`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-glow animate-float-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-400/15">
            <BarChart3 className="size-[18px] text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Grafik Cashflow</p>
            <h2 className="text-lg font-bold text-foreground">Arus Kas Mingguan</h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
          Stabil
        </span>
      </div>

      {/* Chart */}
      <div className="mt-6 relative">
        <svg viewBox="0 0 100 100" className="h-56 w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cashflowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.70 0.19 160 / 0.35)" />
              <stop offset="60%" stopColor="oklch(0.65 0.16 200 / 0.15)" />
              <stop offset="100%" stopColor="oklch(0.65 0.16 200 / 0)" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.55 0.18 160)" />
              <stop offset="50%" stopColor="oklch(0.60 0.16 200)" />
              <stop offset="100%" stopColor="oklch(0.58 0.17 240)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1="8"
              y1={10 + frac * 70}
              x2="92"
              y2={10 + frac * 70}
              stroke="oklch(0.5 0 0 / 0.08)"
              strokeWidth="0.3"
              strokeDasharray="2 2"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#cashflowGradient)" stroke="none" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Data points */}
          {chartPts.map((pt, index) => (
            <g key={points[index].label}>
              {/* Hover target (invisible, larger) */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              />
              {/* Outer ring on hover */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === index ? 5 : 0}
                fill="oklch(0.55 0.18 160 / 0.15)"
                style={{ transition: "r 0.2s ease" }}
              />
              {/* Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === index ? 3 : 2.2}
                fill="oklch(0.55 0.18 160)"
                stroke="oklch(1 0 0)"
                strokeWidth="1"
                style={{ transition: "r 0.2s ease" }}
              />
              {/* Tooltip */}
              {hoveredIndex === index && (
                <g>
                  <rect
                    x={pt.x - 14}
                    y={pt.y - 16}
                    width="28"
                    height="10"
                    rx="3"
                    fill="oklch(0.2 0.015 260 / 0.9)"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    textAnchor="middle"
                    fill="white"
                    fontSize="4.5"
                    fontWeight="600"
                  >
                    {(points[index].value / 1000).toFixed(1)}k
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend labels */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {points.map((point, i) => (
          <button
            key={point.label}
            className={`group rounded-xl p-2.5 text-center transition-all duration-200 ${
              hoveredIndex === i
                ? "bg-primary/10 ring-1 ring-primary/20"
                : "bg-muted/40 hover:bg-muted/60"
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <p className="text-[0.65rem] font-semibold text-foreground">{point.label}</p>
            <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
              Rp {point.value.toLocaleString("id-ID")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
