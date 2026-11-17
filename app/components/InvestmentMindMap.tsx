"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency, getCurrencySymbol } from "@/app/utils/currency";
import { getInvestments, type Investment, type InvestmentType } from "@/app/data/investments";
import { EMOJI, NAME } from "@/app/data/investmentMeta";

const W = 316;
const H = 322;
const CX = W / 2;
const CY = 156;
const R1 = 104; // distance of the category nodes from the centre
const CORE = 46; // radius of the centre circle

const UP = "var(--success)";
const DOWN = "#ef4444";
const FLAT = "var(--muted)";

const tone = (pct: number) => (pct > 0 ? UP : pct < 0 ? DOWN : FLAT);

type Node = {
  type: InvestmentType;
  value: number;
  invested: number;
  pct: number;
  share: number;
  items: Investment[];
};

export default function InvestmentMindMap() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const loc = lang === "bn" ? "bn-BD" : "en-US";

  const [items, setItems] = useState<Investment[] | null>(null);
  const [picked, setPicked] = useState<InvestmentType | null>(null);

  useEffect(() => {
    const load = () => setItems(getInvestments());

    load();

    const events = ["investmentsUpdated", "languageUpdated", "currencyUpdated"];

    events.forEach((e) => window.addEventListener(e, load));

    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, []);

  if (!items || items.length === 0) return null;

  const total = items.reduce((s, i) => s + (Number(i.currentValue) || 0), 0);
  const invested = items.reduce((s, i) => s + (Number(i.investedAmount) || 0), 0);
  const profit = total - invested;
  const totalPct = invested > 0 ? (profit / invested) * 100 : 0;

  const groups = new Map<InvestmentType, Node>();

  items.forEach((item) => {
    const g = groups.get(item.type) ?? {
      type: item.type,
      value: 0,
      invested: 0,
      pct: 0,
      share: 0,
      items: [],
    };

    g.value += Number(item.currentValue) || 0;
    g.invested += Number(item.investedAmount) || 0;
    g.items.push(item);
    groups.set(item.type, g);
  });

  const nodes = [...groups.values()]
    .map((g) => ({
      ...g,
      pct: g.invested > 0 ? ((g.value - g.invested) / g.invested) * 100 : 0,
      share: total > 0 ? g.value / total : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const active = nodes.find((n) => n.type === picked) ?? nodes[0];

  const pctText = (value: number) => {
    const r = Math.abs(value) < 10 ? Math.round(value * 10) / 10 : Math.round(value);

    return `${r > 0 ? "+" : ""}${r.toLocaleString(loc)}%`;
  };

  const compact = (value: number) => {
    const a = Math.abs(value);
    const d = (n: number) => n.toLocaleString(loc, { maximumFractionDigits: 1 });
    const body =
      lang === "bn"
        ? a >= 1e5
          ? `${d(a / 1e5)}লা`
          : a >= 1e3
          ? `${d(a / 1e3)}হা`
          : d(a)
        : a >= 1e6
        ? `${d(a / 1e6)}M`
        : a >= 1e3
        ? `${d(a / 1e3)}K`
        : d(a);

    return `${getCurrencySymbol()}${body}`;
  };

  const count = nodes.length;

  const placed = nodes.map((n, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const r = Math.round(19 + 12 * Math.sqrt(n.share));
    const x = CX + dx * R1;
    const y = CY + dy * R1;

    // A gentle bend, so the branches look grown and not ruled.
    const sx = CX + dx * CORE;
    const sy = CY + dy * CORE;
    const ex = x - dx * r;
    const ey = y - dy * r;
    const bend = (i % 2 === 0 ? 1 : -1) * 14;
    const mx = (sx + ex) / 2 - dy * bend;
    const my = (sy + ey) / 2 + dx * bend;

    return { n, x, y, r, path: `M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`, i };
  });

  const title = lang === "bn" ? "বিনিয়োগের মানচিত্র" : "Investment map";
  const hint =
    lang === "bn"
      ? "কোনো বৃত্তে চাপ দিন, ভেতরের বিনিয়োগ দেখুন।"
      : "Tap a circle to see what is inside.";
  const kinds =
    lang === "bn"
      ? `${count.toLocaleString(loc)} ধরন`
      : `${count} ${count === 1 ? "kind" : "kinds"}`;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <style>{`
        @keyframes mmDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes mmPop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
        .mm-branch { stroke-dasharray: 1; stroke-dashoffset: 0; animation: mmDraw .9s ease-out both; }
        .mm-node { transform-box: fill-box; transform-origin: center; animation: mmPop .45s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .mm-branch, .mm-node { animation: none; } }
      `}</style>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-[var(--muted)]">{hint}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="group" aria-label={title}>
        {/* the orbit the branches grow towards */}
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="var(--border)" strokeDasharray="2 6" />

        {placed.map(({ n, path, i }) => (
          <path
            key={`b-${n.type}`}
            d={path}
            pathLength={1}
            fill="none"
            stroke={tone(n.pct)}
            strokeOpacity={0.55}
            strokeWidth={1.5 + 4 * n.share}
            strokeLinecap="round"
            className="mm-branch"
            style={{ animationDelay: `${0.05 * i}s` }}
          />
        ))}

        {/* centre */}
        <circle cx={CX} cy={CY} r={CORE} fill="var(--primary)" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">
          {compact(total)}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--gold)">
          {pctText(totalPct)}
        </text>
        <text x={CX} y={CY + 26} textAnchor="middle" fontSize="9" fill="#fff" fillOpacity={0.75}>
          {kinds}
        </text>

        {placed.map(({ n, x, y, r, i }) => {
          const on = n.type === active.type;

          return (
            <g
              key={`n-${n.type}`}
              role="button"
              tabIndex={0}
              aria-label={`${NAME[n.type][lang]}, ${pctText(n.pct)}`}
              aria-pressed={on}
              onClick={() => setPicked(n.type)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setPicked(n.type);
              }}
              className="mm-node cursor-pointer outline-none"
              style={{ animationDelay: `${0.35 + 0.06 * i}s` }}
            >
              {on && <circle cx={x} cy={y} r={r + 5} fill="none" stroke={tone(n.pct)} strokeOpacity={0.35} strokeWidth={4} />}

              <circle
                cx={x}
                cy={y}
                r={r}
                fill="var(--card)"
                stroke={tone(n.pct)}
                strokeWidth={on ? 3 : 2}
              />
              <circle cx={x} cy={y} r={r} fill={tone(n.pct)} fillOpacity={0.12} />

              <text x={x} y={y + r * 0.3} textAnchor="middle" fontSize={Math.round(r * 0.9)}>
                {EMOJI[n.type]}
              </text>

              <text
                x={x}
                y={y + r + 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={tone(n.pct)}
              >
                {pctText(n.pct)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* what is inside the picked circle */}
      <div className="mt-1 rounded-xl bg-[var(--background)] p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold">
            {EMOJI[active.type]} {NAME[active.type][lang]}
          </p>

          <p className="shrink-0 text-xs text-[var(--muted)]">
            {Math.round(active.share * 100).toLocaleString(loc)}%{" "}
            {lang === "bn" ? "পোর্টফোলিওর" : "of portfolio"}
          </p>
        </div>

        <ul className="mt-2 divide-y divide-[var(--border)]">
          {[...active.items]
            .sort((a, b) => (Number(b.currentValue) || 0) - (Number(a.currentValue) || 0))
            .map((item) => {
              const inv = Number(item.investedAmount) || 0;
              const cur = Number(item.currentValue) || 0;
              const pct = inv > 0 ? ((cur - inv) / inv) * 100 : 0;

              return (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{item.name}</span>
                    <span className="block text-[11px] text-[var(--muted)]">
                      {formatCurrency(inv)} → {formatCurrency(cur)}
                    </span>
                  </span>

                  <span className="shrink-0 text-sm font-semibold" style={{ color: tone(pct) }}>
                    {pctText(pct)}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}
