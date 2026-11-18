"use client";

import { useEffect, useState } from "react";
import type { Row } from "@/lib/training";
import { toolName, usePrefs } from "./prefs";

// Pads for the six tools, three on each side, joined to the hamster in the middle by right-angled traces.
const W = 360;
const H = 210;
const C = { x: W / 2, y: H / 2 };
const PADS = [
  { x: 36, y: 34, side: "l" },
  { x: 36, y: 105, side: "l" },
  { x: 36, y: 176, side: "l" },
  { x: 324, y: 34, side: "r" },
  { x: 324, y: 105, side: "r" },
  { x: 324, y: 176, side: "r" },
] as const;
const trace = (p: (typeof PADS)[number], i: number) => {
  const mid = p.side === "l" ? 104 - (i % 3) * 10 : 256 + (i % 3) * 10;
  return `M${C.x},${C.y} H${mid} V${p.y} H${p.x}`;
};

/** An animated circuit board: one pad per tool, lit by whether it has a trainer or people waiting. */
export default function Circuit({ rows }: { rows: Row[] | null }) {
  const { t, lang } = usePrefs();
  const [motion, setMotion] = useState(true);
  useEffect(() => setMotion(!matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  return (
    <div className="circuit" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        {PADS.map((p, i) => {
          const row = rows?.[i];
          const state = !row ? "off" : row.train.length ? "ok" : row.learn.length ? "wait" : "off";
          const d = trace(p, i);
          return (
            <g key={i} className={`ct ct-${state}`} style={{ ["--i" as string]: i }}>
              <path d={d} pathLength={1} className="ct-line" />
              {motion && state !== "off" && (
                <circle r="2.6" className="ct-pulse">
                  <animateMotion dur={`${2.2 + i * 0.3}s`} begin={`${0.9 + i * 0.15}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" />
                </circle>
              )}
              <circle cx={p.x} cy={p.y} r="7" className="ct-pad" />
              <circle cx={p.x} cy={p.y} r="2.6" className="ct-hole" />
              {row && (
                <text x={p.side === "l" ? p.x + 14 : p.x - 14} y={p.y - 12} textAnchor={p.side === "l" ? "start" : "end"} className="ct-label">
                  {toolName(row.tool.id, lang)}
                </text>
              )}
            </g>
          );
        })}
        <rect x={C.x - 34} y={C.y - 34} width="68" height="68" rx="18" className="ct-chip" />
        <image href="/logo.png" x={C.x - 28} y={C.y - 28} width="56" height="56" style={{ clipPath: "inset(0 round 14px)" }} />
      </svg>
      <div className="ct-legend">
        <span><i className="dot train" /> {t.legendOk}</span>
        <span><i className="dot learn" /> {t.legendWait}</span>
      </div>
    </div>
  );
}
