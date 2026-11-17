"use client";

import { getCurrencySymbol } from "@/app/utils/currency";
import type { SeriesPoint } from "@/app/data/netWorthSeries";

const H = 72; // chart height in px
const PAD = 14; // room for the label above each line

function compact(value: number, bn: boolean): string {
  const a = Math.abs(value);
  const digits = (n: number) =>
    n.toLocaleString(bn ? "bn-BD" : "en-US", { maximumFractionDigits: 1 });

  let text: string;

  if (bn) {
    text =
      a >= 1e5 ? `${digits(a / 1e5)}লা` : a >= 1e3 ? `${digits(a / 1e3)}হা` : digits(a);
  } else {
    text =
      a >= 1e6 ? `${digits(a / 1e6)}M` : a >= 1e3 ? `${digits(a / 1e3)}K` : digits(a);
  }

  return `${value < 0 ? "-" : ""}${getCurrencySymbol()}${text}`;
}

export default function HeroChart({
  series,
  bn,
}: {
  series: SeriesPoint[];
  bn: boolean;
}) {
  if (series.length < 2) return null;

  const values = series.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);

  if (max === min) {
    max += 1;
    min -= 1;
  }

  const mid = (max + min) / 2;
  const y = (v: number) => PAD + (1 - (v - min) / (max - min)) * (H - PAD - 4);
  const x = (i: number) => (i / (series.length - 1)) * 100;

  const line = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`)
    .join(" ");

  const area = `${line} L100,${H} L0,${H} Z`;

  const day = (iso: string) => {
    const [yy, m, d] = iso.split("-").map(Number);

    return new Date(yy, m - 1, d).toLocaleDateString(bn ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const ticks = [max, mid, min];

  return (
    <div className="mt-4">
      <div className="relative" style={{ height: H }}>
        <svg
          width="100%"
          height={H}
          viewBox={`0 0 100 ${H}`}
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.18 }} />
              <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {ticks.map((v) => (
            <line
              key={v}
              x1="0"
              x2="100"
              y1={y(v)}
              y2={y(v)}
              stroke="var(--border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={area} fill="url(#heroFill)" />

          <path
            d={line}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {ticks.map((v) => (
          <span
            key={v}
            className="absolute right-0 rounded bg-[var(--card)]/80 pl-1 text-[10px] leading-none text-[var(--muted)]"
            style={{ top: y(v) - 12 }}
          >
            {compact(v, bn)}
          </span>
        ))}
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-[var(--muted)]">
        <span>{day(series[0].date)}</span>
        <span>{day(series[series.length - 1].date)}</span>
      </div>
    </div>
  );
}
