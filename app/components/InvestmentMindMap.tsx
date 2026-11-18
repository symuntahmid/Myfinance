"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency, getCurrencySymbol } from "@/app/utils/currency";
import { getInvestments, type Investment, type InvestmentType } from "@/app/data/investments";
import MindMapGraph from "@/app/components/MindMapGraph";
import { EMOJI, NAME } from "@/app/data/investmentMeta";

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

  const title = lang === "bn" ? "বিনিয়োগের মানচিত্র" : "Investment map";
  const hint =
    lang === "bn"
      ? "কোনো বৃত্তে চাপ দিন, ভেতরের বিনিয়োগ দেখুন।"
      : "Tap a circle to see what is inside.";
  const count = nodes.length;
  const kinds =
    lang === "bn"
      ? `${count.toLocaleString(loc)} ধরন`
      : `${count} ${count === 1 ? "kind" : "kinds"}`;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-[var(--muted)]">{hint}</span>
      </div>

      <MindMapGraph
        title={title}
        big={compact(total)}
        small={pctText(totalPct)}
        note={kinds}
        activeId={active.type}
        onPick={(id) => setPicked(id as InvestmentType)}
        nodes={nodes.map((n) => ({
          id: n.type,
          emoji: EMOJI[n.type],
          label: pctText(n.pct),
          color: tone(n.pct),
          share: n.share,
          aria: `${NAME[n.type][lang]}, ${pctText(n.pct)}`,
        }))}
      />

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
