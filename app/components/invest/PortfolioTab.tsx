"use client";

import InvestmentMindMap from "@/app/components/InvestmentMindMap";
import { useEffect, useState } from "react";
import { Flame, Pencil, Plus, Trash2 } from "lucide-react";

import AddInvestmentModal from "@/app/components/AddInvestmentModal";
import EditInvestmentModal from "@/app/components/EditInvestmentModal";
import RemoveSheet from "@/app/components/invest/RemoveSheet";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { TYPE_INFO } from "@/app/data/investLearn";
import {
  getInvestments,
  getPortfolioSummary,
  type Investment,
} from "@/app/data/investments";
import {
  STALE_DAYS,
  daysSince,
  getHabit,
  getMonthlyTarget,
  monthsBetween,
  nextMilestone,
  setMonthlyTarget,
} from "@/app/data/investHabit";

const TEXT = {
  en: {
    since: "since you started {m} months ago",
    sinceNew: "since you started",
    calm: "Markets move up and down. Investing is a long game, and time is on your side.",
    toGoal: "{x} to reach {y}",
    month: "This month",
    askTarget: "How much will you invest each month?",
    askHint: "A small, steady amount beats a big one-off. You can change it any time.",
    of: "{a} of {b}",
    add: "Add",
    done: "This month's goal is done. Well done!",
    streak: "{n} months in a row",
    change: "Change",
    insight: "Your next step",
    staleText: "{name} was last checked {d} days ago. Update its value so your numbers stay true.",
    stale: "Update value",
    heavyText: "{pct}% of your money is in {type}. Spreading it across another type lowers your risk.",
    heavyWhy: "If one type falls, the others hold you steady.",
    bestText: "{name} is your best performer, up {pct}%. Keep going.",
    ago: "{d} days ago",
    map: "See your investment map",
  },
  bn: {
    since: "{m} মাস আগে শুরুর পর থেকে",
    sinceNew: "শুরুর পর থেকে",
    calm: "বাজার ওঠানামা করে। বিনিয়োগ লম্বা দৌড়, আর সময় আপনার পক্ষে।",
    toGoal: "{y} হতে আর {x}",
    month: "এই মাসে",
    askTarget: "প্রতি মাসে কত বিনিয়োগ করবেন?",
    askHint: "বড় একবারের চেয়ে ছোট নিয়মিত অঙ্ক ভালো। যেকোনো সময় বদলাতে পারবেন।",
    of: "{b} এর মধ্যে {a}",
    add: "যোগ করুন",
    done: "এই মাসের লক্ষ্য পূর্ণ। চমৎকার!",
    streak: "{n} মাস টানা",
    change: "বদলান",
    insight: "আপনার পরের ধাপ",
    staleText: "{name}-এর মান {d} দিন আগে দেখা হয়েছে। এখনকার মান দিন, যাতে হিসাব ঠিক থাকে।",
    stale: "মান আপডেট",
    heavyText: "আপনার {pct}% টাকা {type}-এ। আরেকটি ধরনে ভাগ করলে ঝুঁকি কমে।",
    heavyWhy: "একটি পড়লে অন্যগুলো আপনাকে স্থির রাখে।",
    bestText: "{name} সবচেয়ে ভালো করছে, {pct}% বেড়েছে। চালিয়ে যান।",
    ago: "{d} দিন আগে",
    map: "বিনিয়োগের মানচিত্র দেখুন",
  },
} as const;
export default function PortfolioTab({ onGrow }: { onGrow: () => void }) {
  const { t, language } = useLanguage();

  const [items, setItems] = useState<Investment[]>([]);
  const [summary, setSummary] = useState({ invested: 0, current: 0, profit: 0, returnPercentage: 0 });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Investment | null>(null);
  const [, bump] = useState(0);
  const [target, setTarget] = useState(0);
  const [habit, setHabit] = useState({ thisMonth: 0, streak: 0 });

  useEffect(() => {
    const refresh = () => {
      setItems(getInvestments());
      setSummary(getPortfolioSummary());
      setTarget(getMonthlyTarget());
      setHabit(getHabit());
    };
    const redraw = () => bump((v) => v + 1);

    refresh();

    window.addEventListener("investmentsUpdated", refresh);
    window.addEventListener("transactionsUpdated", refresh);
    window.addEventListener("currencyUpdated", redraw);
    window.addEventListener("languageUpdated", redraw);

    return () => {
      window.removeEventListener("investmentsUpdated", refresh);
      window.removeEventListener("transactionsUpdated", refresh);
      window.removeEventListener("currencyUpdated", redraw);
      window.removeEventListener("languageUpdated", redraw);
    };
  }, []);

  const locale = language === "bn" ? "bn-BD" : "en-US";
  const typeName = (type: Investment["type"]) =>
    TYPE_INFO[type]?.[language] ?? type;

  // Share of the portfolio by type, biggest first.
  const byType = new Map<Investment["type"], number>();

  items.forEach((item) =>
    byType.set(item.type, (byType.get(item.type) ?? 0) + (Number(item.currentValue) || 0))
  );

  const total = [...byType.values()].reduce((sum, v) => sum + v, 0);
  const mix = [...byType.entries()]
    .map(([type, value]) => ({ type, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value);

  const heavy = mix[0] && mix[0].pct > 60 ? mix[0] : null;
  const gainUp = summary.profit >= 0;
  const x = TEXT[language === "bn" ? "bn" : "en"];
  const num = (v: number) => v.toLocaleString(locale);

  const oldest = items.reduce(
    (min, item) => (item.purchaseDate && item.purchaseDate < min ? item.purchaseDate : min),
    items[0]?.purchaseDate ?? ""
  );
  const months = oldest ? monthsBetween(oldest) : 0;
  const goal = nextMilestone(summary.current);

  const staleItem = items
    .map((item) => ({ item, days: daysSince(item.updatedAt, item.purchaseDate) }))
    .filter((entry) => entry.days >= STALE_DAYS)
    .sort((a, b) => b.days - a.days)[0];

  const best = items
    .map((item) => ({
      item,
      pct: item.investedAmount > 0 ? ((item.currentValue - item.investedAmount) / item.investedAmount) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct)[0];

  const monthPct = target > 0 ? Math.min(100, Math.round((habit.thisMonth / target) * 100)) : 0;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <p className="text-lg font-bold">{t("ivNoneTitle")}</p>

          <p className="mt-1 text-sm text-[var(--muted)]">{t("ivNoneText")}</p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-full bg-[var(--primary)] py-3 text-sm font-bold text-white"
            >
              {t("ivAdd")}
            </button>

            <button
              type="button"
              onClick={onGrow}
              className="rounded-full border border-[var(--border)] py-3 text-sm font-semibold"
            >
              {t("ivTabGrow")}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
            <p className="text-sm opacity-80">{t("ivValue")}</p>

            <p className="mt-1 text-4xl font-bold tracking-tight [font-variant-numeric:tabular-nums]">
              {formatCurrency(summary.current)}
            </p>

            <p className={`mt-2 text-sm font-semibold ${gainUp ? "text-[var(--gold)]" : "text-[var(--sun)]"}`}>
              {gainUp ? "+" : "-"}
              {formatCurrency(Math.abs(summary.profit))} ({gainUp ? "+" : "-"}
              {num(Math.abs(Math.round(summary.returnPercentage * 10) / 10))}%){" "}
              <span className="font-normal opacity-80">
                {months >= 1 ? x.since.replace("{m}", num(months)) : x.sinceNew}
              </span>
            </p>

            {!gainUp && <p className="mt-2 text-xs opacity-75">{x.calm}</p>}

            <div className="mt-4 border-t border-white/15 pt-3">
              <div className="h-1.5 rounded-full bg-white/15">
                <div className="h-1.5 rounded-full bg-[var(--gold)]" style={{ width: `${Math.max(goal.pct, 3)}%` }} />
              </div>

              <p className="mt-2 text-xs opacity-80">
                {x.toGoal
                  .replace("{x}", formatCurrency(goal.target - summary.current))
                  .replace("{y}", formatCurrency(goal.target))}
              </p>
            </div>
          </section>

          {/* The monthly habit */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            {target <= 0 ? (
              <>
                <p className="text-sm font-bold">{x.askTarget}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{x.askHint}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[1000, 2000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setMonthlyTarget(amount)}
                      className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold">{x.month}</p>

                  <div className="flex items-center gap-3">
                    {habit.streak > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--gold-soft)] px-2.5 py-1 text-xs font-semibold">
                        <Flame size={13} />
                        {x.streak.replace("{n}", num(habit.streak))}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setMonthlyTarget(0)}
                      className="text-xs font-semibold text-[var(--muted)]"
                    >
                      {x.change}
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm [font-variant-numeric:tabular-nums]">
                  {x.of
                    .replace("{a}", formatCurrency(habit.thisMonth))
                    .replace("{b}", formatCurrency(target))}
                </p>

                <div className="mt-2 h-2 rounded-full bg-[var(--border)]">
                  <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${monthPct}%` }} />
                </div>

                {monthPct >= 100 ? (
                  <p className="mt-3 text-sm font-semibold text-[var(--success)]">{x.done}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="mt-3 flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus size={16} />
                    {x.add}
                  </button>
                )}
              </>
            )}
          </section>

          {/* One next step */}
          {(staleItem || heavy || best) && (
            <section className="rounded-2xl bg-[var(--gold-soft)] p-4">
              <p className="text-xs font-semibold text-[var(--muted)]">{x.insight}</p>

              {staleItem ? (
                <>
                  <p className="mt-1 text-sm">
                    {x.staleText
                      .replace("{name}", staleItem.item.name)
                      .replace("{d}", num(staleItem.days))}
                  </p>

                  <button
                    type="button"
                    onClick={() => setEditing(staleItem.item)}
                    className="mt-3 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    {x.stale}
                  </button>
                </>
              ) : heavy ? (
                <>
                  <p className="mt-1 text-sm">
                    {x.heavyText
                      .replace("{pct}", num(heavy.pct))
                      .replace("{type}", typeName(heavy.type))}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{x.heavyWhy}</p>
                </>
              ) : (
                best && (
                  <p className="mt-1 text-sm">
                    {x.bestText
                      .replace("{name}", best.item.name)
                      .replace("{pct}", num(Math.max(0, Math.round(best.pct * 10) / 10)))}
                  </p>
                )
              )}
            </section>
          )}

          <details className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold">
              {x.map}
            </summary>

            <div className="px-1 pb-2">
              <InvestmentMindMap />
            </div>
          </details>

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-[var(--muted)]">{t("ivHoldings")}</h2>

              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
              >
                <Plus size={14} />
                {t("ivAdd")}
              </button>
            </div>

            <ul className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {items.map((item, index) => {
                const gain = (Number(item.currentValue) || 0) - (Number(item.investedAmount) || 0);
                const pct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
                const open = openId === item.id;

                return (
                  <li key={item.id} className={index > 0 ? "border-t border-[var(--border)]" : ""}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-lg">
                        {TYPE_INFO[item.type]?.emoji ?? "💼"}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.name}</span>
                        <span className="block truncate text-xs text-[var(--muted)]">
                          {typeName(item.type)}
                          {daysSince(item.updatedAt, item.purchaseDate) >= STALE_DAYS && (
                            <span className="text-[var(--sun)]">
                              {" · "}
                              {x.ago.replace("{d}", num(daysSince(item.updatedAt, item.purchaseDate)))}
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-bold">{formatCurrency(item.currentValue)}</span>
                        <span
                          className={`block text-xs font-semibold ${
                            gain >= 0 ? "text-[var(--success)]" : "text-[var(--sun)]"
                          }`}
                        >
                          {gain >= 0 ? "▲" : "▼"} {Math.abs(Math.round(pct * 10) / 10).toLocaleString(locale)}%
                        </span>
                      </span>
                    </button>

                    {open && (
                      <div className="flex gap-2 px-4 pb-3">
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] py-2 text-sm font-semibold"
                        >
                          <Pencil size={14} />
                          {t("txEdit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRemoving(item);
                            setOpenId(null);
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 py-2 text-sm font-semibold text-red-600"
                        >
                          <Trash2 size={14} />
                          {t("txDelete")}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {removing && <RemoveSheet investment={removing} onClose={() => setRemoving(null)} />}

      <AddInvestmentModal open={adding} onClose={() => setAdding(false)} />

      <EditInvestmentModal
        open={editing !== null}
        investment={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
