"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { formatCurrency } from "@/app/utils/currency";
import type { Investment, InvestmentType } from "@/app/data/investments";
import { EMOJI, NAME } from "@/app/data/investmentMeta";

const MIN = 30;
const MAX = 50;

export default function InvestmentBubbles({
  items,
  lang,
}: {
  items: Investment[];
  lang: "en" | "bn";
}) {
  const loc = lang === "bn" ? "bn-BD" : "en-US";

  const invested = items.reduce((s, i) => s + (Number(i.investedAmount) || 0), 0);
  const current = items.reduce((s, i) => s + (Number(i.currentValue) || 0), 0);
  const profit = current - invested;
  const pct = invested > 0 ? (profit / invested) * 100 : 0;

  const pctText = (value: number) => {
    const rounded = Math.abs(value) < 10 ? Math.round(value * 10) / 10 : Math.round(value);

    return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString(loc)}%`;
  };

  // One bubble per kind of investment.
  const groups = new Map<InvestmentType, { invested: number; current: number }>();

  items.forEach((item) => {
    const g = groups.get(item.type) ?? { invested: 0, current: 0 };

    g.invested += Number(item.investedAmount) || 0;
    g.current += Number(item.currentValue) || 0;
    groups.set(item.type, g);
  });

  const bubbles = [...groups.entries()]
    .map(([type, g]) => ({
      type,
      value: g.current,
      pct: g.invested > 0 ? ((g.current - g.invested) / g.invested) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const biggest = Math.max(...bubbles.map((b) => b.value), 1);

  if (items.length === 0) {
    return (
      <Link href="/investments" className="mt-3 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-[var(--muted)]">
          <Plus size={18} />
        </span>

        <span className="text-sm text-[var(--muted)]">
          {lang === "bn"
            ? "প্রথম বিনিয়োগ যোগ করুন, এখানে ছবির মতো দেখা যাবে।"
            : "Add your first investment and it appears here as a bubble map."}
        </span>
      </Link>
    );
  }

  const tone = profit > 0 ? "up" : profit < 0 ? "down" : "flat";

  return (
    <>
      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="text-[30px] font-semibold leading-none tracking-tight [font-variant-numeric:tabular-nums]">
          {formatCurrency(current)}
        </p>

        <span
          className={`mb-0.5 shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
            tone === "up"
              ? "bg-[var(--success)]/12 text-[var(--success)]"
              : tone === "down"
              ? "bg-red-500/10 text-red-600"
              : "bg-[var(--background)] text-[var(--muted)]"
          }`}
        >
          {profit > 0 ? "+" : profit < 0 ? "-" : ""}
          {formatCurrency(Math.abs(profit))} · {pctText(pct)}
        </span>
      </div>

      <Link href="/investments" className="mt-2.5 flex items-end gap-3 overflow-hidden">
        {bubbles.map((b) => {
          const size = Math.round(MIN + (MAX - MIN) * Math.sqrt(b.value / biggest));
          const up = b.pct > 0;
          const down = b.pct < 0;

          return (
            <span
              key={b.type}
              title={`${NAME[b.type][lang]} · ${formatCurrency(b.value)}`}
              className="flex shrink-0 flex-col items-center gap-0.5"
            >
              <span
                className={`flex items-center justify-center rounded-full border ${
                  up
                    ? "border-[var(--success)]/40 bg-[var(--success)]/12"
                    : down
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-[var(--border)] bg-[var(--background)]"
                }`}
                style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
              >
                {EMOJI[b.type]}
              </span>

              <span
                className={`text-[10px] font-semibold leading-none ${
                  up ? "text-[var(--success)]" : down ? "text-red-600" : "text-[var(--muted)]"
                }`}
              >
                {pctText(b.pct)}
              </span>
            </span>
          );
        })}
      </Link>
    </>
  );
}
