"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency, getCurrencySymbol } from "@/app/utils/currency";
import { categoryLabel } from "@/app/data/categoryLabel";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { computePlan, getPlan } from "@/app/data/plan";
import { getTransactions, type Transaction } from "@/app/data/transactions";
import { dayOf, monthOfDate, todayLocal } from "@/app/utils/date";
import MindMapGraph from "@/app/components/MindMapGraph";

const REST = "__rest";
const GOOD = "var(--success)";
const WARN = "var(--gold)";
const BAD = "#ef4444";
const NONE = "var(--muted)";

type Budget = { assigned: number; spent: number; left: number } | null;

type Node = {
  id: string;
  emoji: string;
  name: string;
  amount: number;
  last: number;
  share: number;
  budget: Budget;
  items: Transaction[];
};

function previousMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);

  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

function look(category: string, lang: "en" | "bn") {
  const found = quickExpenseCategories.find((item) => item.value === category);

  return {
    emoji: found?.emoji ?? category.match(/^\p{Extended_Pictographic}/u)?.[0] ?? "🧾",
    name: found ? found[lang] : categoryLabel(category, lang),
  };
}

export default function SpendingMindMap() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const loc = lang === "bn" ? "bn-BD" : "en-US";

  const [data, setData] = useState<{ nodes: Node[]; total: number; last: number } | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const month = monthOfDate(todayLocal());
      const before = previousMonth(month);

      const all = getTransactions().filter((tx) => tx.type === "Expense");
      const now = all.filter((tx) => monthOfDate(tx.date) === month);
      const past = all.filter((tx) => monthOfDate(tx.date) === before);

      const total = now.reduce((s, tx) => s + tx.amount, 0);
      const last = past.reduce((s, tx) => s + tx.amount, 0);

      if (total <= 0) {
        setData({ nodes: [], total: 0, last });

        return;
      }

      const balances = getBalances();
      const plan = computePlan({
        month,
        plan: getPlan(),
        transactions: getTransactions(),
        totalBalance: getAccounts().reduce((s, a) => s + (balances[a.id] ?? 0), 0),
      });

      const by = new Map<string, Transaction[]>();

      now.forEach((tx) => {
        const key = tx.category || "📦 Others";

        by.set(key, [...(by.get(key) ?? []), tx]);
      });

      const sum = (list: Transaction[]) => list.reduce((s, tx) => s + tx.amount, 0);

      const ranked = [...by.entries()]
        .map(([category, items]) => ({ category, items, amount: sum(items) }))
        .sort((a, b) => b.amount - a.amount);

      const top = ranked.slice(0, 6);
      const rest = ranked.slice(6);

      const nodes: Node[] = top.map((entry) => {
        const row = plan.rows.find((r) => r.category === entry.category);
        const had = row ? row.spent + row.available : 0;
        const view = look(entry.category, lang);

        return {
          id: entry.category,
          emoji: view.emoji,
          name: view.name,
          amount: entry.amount,
          last: sum(past.filter((tx) => (tx.category || "📦 Others") === entry.category)),
          share: entry.amount / total,
          budget:
            row && row.assigned > 0 && had > 0
              ? { assigned: had, spent: row.spent, left: row.available }
              : null,
          items: entry.items,
        };
      });

      if (rest.length > 0) {
        const items = rest.flatMap((r) => r.items);
        const amount = sum(items);
        const names = new Set(rest.map((r) => r.category));

        nodes.push({
          id: REST,
          emoji: "🧾",
          name: lang === "bn" ? "অন্যান্য সব" : "Everything else",
          amount,
          last: sum(past.filter((tx) => names.has(tx.category || "📦 Others"))),
          share: amount / total,
          budget: null,
          items,
        });
      }

      setData({ nodes, total, last });
    };

    load();

    const events = ["transactionsUpdated", "planUpdated", "accountsUpdated", "languageUpdated", "currencyUpdated"];

    events.forEach((e) => window.addEventListener(e, load));

    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, [lang]);

  if (!data || data.nodes.length === 0) return null;

  const { nodes, total, last } = data;
  const active = nodes.find((n) => n.id === picked) ?? nodes[0];

  const num = (v: number) => v.toLocaleString(loc);
  const share = (v: number) => `${num(Math.round(v * 100))}%`;

  const colorOf = (n: Node) => {
    if (!n.budget) return NONE;

    const pct = n.budget.spent / n.budget.assigned;

    return pct > 1 ? BAD : pct >= 0.8 ? WARN : GOOD;
  };

  const compact = (value: number) => {
    const d = (n: number) => n.toLocaleString(loc, { maximumFractionDigits: 1 });
    const body =
      lang === "bn"
        ? value >= 1e5
          ? `${d(value / 1e5)}লা`
          : value >= 1e3
          ? `${d(value / 1e3)}হা`
          : d(value)
        : value >= 1e6
        ? `${d(value / 1e6)}M`
        : value >= 1e3
        ? `${d(value / 1e3)}K`
        : d(value);

    return `${getCurrencySymbol()}${body}`;
  };

  const T =
    lang === "bn"
      ? {
          title: "টাকা কোথায় গেল",
          hint: "বৃত্তে চাপ দিন, ভেতরের খরচ দেখুন।",
          month: "এই মাসে খরচ",
          of: "বাজেট {b} এর মধ্যে {s}",
          over: "{x} বেশি খরচ হয়েছে",
          left: "আর {x} বাকি",
          none: "এখনও বাজেট দেননি",
          more: "গত মাসের চেয়ে {x} বেশি",
          less: "গত মাসের চেয়ে {x} কম",
          entries: "বড় খরচগুলো",
          ofSpend: "মোট খরচের",
        }
      : {
          title: "Where your money went",
          hint: "Tap a circle to see what is inside.",
          month: "spent this month",
          of: "{s} of {b} budget",
          over: "Over by {x}",
          left: "{x} left",
          none: "No budget set yet",
          more: "{x} more than last month",
          less: "{x} less than last month",
          entries: "Biggest spends",
          ofSpend: "of all spending",
        };

  const change = last > 0 ? ((total - last) / last) * 100 : null;
  const diff = active.amount - active.last;

  const when = (tx: Transaction) =>
    new Date(`${dayOf(tx.date)}T12:00:00`).toLocaleDateString(loc, { day: "numeric", month: "short" });

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{T.title}</h3>
        <span className="text-xs text-[var(--muted)]">{T.hint}</span>
      </div>

      <MindMapGraph
        title={T.title}
        big={compact(total)}
        small={change === null ? "" : `${change > 0 ? "▲" : change < 0 ? "▼" : ""} ${num(Math.abs(Math.round(change)))}%`}
        note={T.month}
        activeId={active.id}
        onPick={setPicked}
        nodes={nodes.map((n) => ({
          id: n.id,
          emoji: n.emoji,
          label: share(n.share),
          color: colorOf(n),
          share: n.share,
          aria: `${n.name}, ${formatCurrency(n.amount)}`,
        }))}
      />

      <div className="mt-1 rounded-xl bg-[var(--background)] p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold">
            {active.emoji} {active.name}
          </p>

          <p className="shrink-0 text-sm font-semibold [font-variant-numeric:tabular-nums]">
            {formatCurrency(active.amount)}
            <span className="ml-1.5 text-xs font-normal text-[var(--muted)]">
              {share(active.share)} {T.ofSpend}
            </span>
          </p>
        </div>

        <p className="mt-2 text-xs font-semibold" style={{ color: colorOf(active) }}>
          {active.budget
            ? active.budget.left < 0
              ? T.over.replace("{x}", formatCurrency(-active.budget.left))
              : T.left.replace("{x}", formatCurrency(active.budget.left))
            : T.none}
          {active.budget && (
            <span className="font-normal text-[var(--muted)]">
              {" · "}
              {T.of.replace("{s}", formatCurrency(active.budget.spent)).replace("{b}", formatCurrency(active.budget.assigned))}
            </span>
          )}
        </p>

        {active.last > 0 && diff !== 0 && (
          <p className="mt-1 text-xs" style={{ color: diff > 0 ? BAD : GOOD }}>
            {diff > 0 ? "▲ " : "▼ "}
            {(diff > 0 ? T.more : T.less).replace("{x}", formatCurrency(Math.abs(diff)))}
          </p>
        )}

        <p className="mt-3 text-[11px] font-semibold text-[var(--muted)]">{T.entries}</p>

        <ul className="divide-y divide-[var(--border)]">
          {[...active.items]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3)
            .map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0 truncate">
                  <span className="text-xs text-[var(--muted)]">{when(tx)}</span>{" "}
                  {tx.note || look(tx.category || "📦 Others", lang).name}
                </span>
                <span className="shrink-0 font-semibold [font-variant-numeric:tabular-nums]">
                  -{formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
