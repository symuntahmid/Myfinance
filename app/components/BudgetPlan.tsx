"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { monthOfDate } from "@/app/utils/date";
import { getTransactions } from "@/app/data/transactions";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import { categoryLabel } from "@/app/data/categoryLabel";
import {
  addCustomCategory,
  computePlan,
  copyFromPreviousMonth,
  deleteCustomCategory,
  getCustomCategories,
  getPlan,
  setAssigned,
  shiftMonth,
  type PlanResult,
} from "@/app/data/plan";

const TEXT = {
  en: {
    title: "Budget",
    add: "Add budget",
    left: "Left in your budget",
    overBy: "Over your budget by",
    spent: "Spent {x}",
    planned: "Planned {x}",
    over: "{n} over budget",
    unplanned: "{x} not planned yet",
    tooMuch: "You planned {x} more than your cash",
    unbudgeted: "{x} spent outside your budget",
    cash: "Cash on hand",
    accounts: "Accounts",
    negative: "Your cash shows below zero. Set your real balances so the budget makes sense.",
    setBalances: "Set balances",
    emptyTitle: "Give your money a plan",
    emptyBody: "Pick how much you want to spend on each thing. We will show how you are doing, every day.",
    suggest: "Suggest from my spending",
    manual: "Add a budget myself",
    copy: "Copy last month",
    left1: "{x} left",
    over1: "{x} over",
    noBudget: "No budget",
    setIt: "Set budget",
    amount: "Monthly budget",
    save: "Save",
    remove: "Remove budget",
    match: "Match my spending",
    pick: "Pick a category",
    newCat: "New category",
    catName: "Category name",
    catExists: "That category already exists.",
    delCat: "Delete this category?",
    hint: "Tap a category to change its budget. Spending is counted from your entries.",
    prev: "Previous month",
    next: "Next month",
    close: "Close",
  },
  bn: {
    title: "বাজেট",
    add: "বাজেট যোগ করুন",
    left: "বাজেটে বাকি আছে",
    overBy: "বাজেটের চেয়ে বেশি",
    spent: "খরচ {x}",
    planned: "পরিকল্পনা {x}",
    over: "{n}টি বাজেট ছাড়িয়েছে",
    unplanned: "{x} এখনও ভাগ করা হয়নি",
    tooMuch: "নগদের চেয়ে {x} বেশি ভাগ করেছেন",
    unbudgeted: "বাজেটের বাইরে {x} খরচ হয়েছে",
    cash: "হাতে নগদ",
    accounts: "অ্যাকাউন্ট",
    negative: "আপনার নগদ শূন্যের নিচে দেখাচ্ছে। আসল ব্যালান্স দিন, তাহলে বাজেট ঠিকভাবে চলবে।",
    setBalances: "ব্যালান্স দিন",
    emptyTitle: "টাকার একটি পরিকল্পনা করুন",
    emptyBody: "প্রতিটি খাতে কত খরচ করতে চান ঠিক করুন। প্রতিদিন দেখাব আপনি কেমন চলছেন।",
    suggest: "আমার খরচ দেখে প্রস্তাব দিন",
    manual: "নিজে বাজেট দিই",
    copy: "গত মাসের কপি করুন",
    left1: "{x} বাকি",
    over1: "{x} বেশি",
    noBudget: "বাজেট নেই",
    setIt: "বাজেট দিন",
    amount: "মাসিক বাজেট",
    save: "সেভ করুন",
    remove: "বাজেট সরান",
    match: "আমার খরচের সমান করুন",
    pick: "একটি খাত বেছে নিন",
    newCat: "নতুন খাত",
    catName: "খাতের নাম",
    catExists: "এই খাত আগে থেকেই আছে।",
    delCat: "এই খাত মুছবেন?",
    hint: "বাজেট বদলাতে কোনো খাতে চাপ দিন। খরচ আপনার এন্ট্রি থেকে গোনা হয়।",
    prev: "আগের মাস",
    next: "পরের মাস",
    close: "বন্ধ করুন",
  },
} as const;

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function monthTitle(month: string, language: "en" | "bn"): string {
  const [year, m] = month.split("-").map(Number);

  return new Date(year, m - 1, 1).toLocaleDateString(
    language === "bn" ? "bn-BD" : "en-US",
    { month: "long", year: "numeric" }
  );
}

type Sheet =
  | { kind: "edit"; category: string }
  | { kind: "pick" }
  | { kind: "new" }
  | null;

export default function BudgetPlan() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];
  const loc = lang === "bn" ? "bn-BD" : "en-US";
  const num = (v: number) => v.toLocaleString(loc);
  const money = (v: number) => formatCurrency(Math.round(v));

  const [month, setMonth] = useState(currentMonth());
  const [result, setResult] = useState<PlanResult | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [lastSpend, setLastSpend] = useState<Record<string, number>>({});
  const [customList, setCustomList] = useState<string[]>([]);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [draft, setDraft] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();
      const total = getAccounts().reduce((sum, item) => sum + (balances[item.id] ?? 0), 0);
      const custom = getCustomCategories().map((item) => item.value);
      const all = getTransactions();

      setTotalBalance(total);
      setCustomList(custom);

      // What was spent in each category the month before. It helps suggest a budget.
      const before = shiftMonth(month, -1);
      const past: Record<string, number> = {};

      all
        .filter((tx) => tx.type === "Expense" && monthOfDate(tx.date) === before)
        .forEach((tx) => {
          const key = tx.category || "📦 Others";

          past[key] = (past[key] ?? 0) + tx.amount;
        });

      setLastSpend(past);

      setResult(
        computePlan({
          month,
          plan: getPlan(),
          transactions: all,
          totalBalance: total,
          customCategories: custom,
        })
      );
    };

    refresh();

    const events = ["planUpdated", "transactionsUpdated", "accountsUpdated", "languageUpdated", "settingsUpdated", "currencyUpdated"];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, [month]);

  const nameOf = (category: string) => {
    const found = quickExpenseCategories.find((item) => item.value === category);

    return found ? found[lang] : categoryLabel(category, lang);
  };

  const emojiOf = (category: string) => {
    const found = quickExpenseCategories.find((item) => item.value === category);

    return found?.emoji ?? category.match(/^\p{Extended_Pictographic}/u)?.[0] ?? "🧾";
  };

  if (!result) return null;

  const rows = result.rows;
  const budgeted = rows.filter((row) => row.assigned > 0);
  const unbudgetedSpent = rows
    .filter((row) => row.assigned <= 0 && row.spent > 0)
    .reduce((sum, row) => sum + row.spent, 0);

  const planned = budgeted.reduce((sum, row) => sum + row.assigned, 0);
  const spentIn = budgeted.reduce((sum, row) => sum + row.spent, 0);
  const left = planned - spentIn;
  const usedPct = planned > 0 ? spentIn / planned : 0;
  const overCount = budgeted.filter((row) => row.available < 0).length;
  const rta = result.readyToAssign;

  const barColor = usedPct > 1 ? "#ef4444" : usedPct >= 0.8 ? "var(--gold)" : "var(--primary)";

  // Rows to show: anything with a budget or spending, biggest budget first.
  const shown = rows
    .filter((row) => row.assigned > 0 || row.spent > 0 || row.available !== 0)
    .sort((a, b) => b.assigned - a.assigned || b.spent - a.spent);

  const sheetRow =
    sheet && sheet.kind === "edit"
      ? rows.find((row) => row.category === sheet.category) ?? null
      : null;

  const openEdit = (category: string) => {
    const row = rows.find((item) => item.category === category);
    const hint = row && row.assigned > 0 ? row.assigned : Math.ceil((lastSpend[category] ?? row?.spent ?? 0) / 100) * 100;

    setDraft(hint > 0 ? String(hint) : "");
    setSheet({ kind: "edit", category });
  };

  const save = () => {
    if (sheet?.kind !== "edit") return;

    const value = Number(draft);

    if (draft !== "" && !isNaN(value) && value >= 0) setAssigned(month, sheet.category, value);

    setSheet(null);
  };

  // A first budget from real spending: last month, or this month so far.
  const suggest = () => {
    rows.forEach((row) => {
      const base = lastSpend[row.category] ?? row.spent;

      if (base > 0 && row.assigned <= 0) {
        setAssigned(month, row.category, Math.max(100, Math.ceil(base / 100) * 100));
      }
    });
  };

  const hasSpendToSuggest =
    Object.keys(lastSpend).length > 0 || rows.some((row) => row.spent > 0);

  const allCategories = [
    ...quickExpenseCategories.map((item) => item.value),
    ...customList.filter((value) => !quickExpenseCategories.some((item) => item.value === value)),
  ];

  const chipBtn =
    "rounded-full border border-[var(--border)] px-3.5 py-2 text-sm font-semibold";

  return (
    <div className="space-y-4">
      {/* Title, month and the main action */}
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{x.title}</h1>

        <button
          type="button"
          onClick={() => setSheet({ kind: "pick" })}
          className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {x.add}
        </button>
      </header>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          aria-label={x.prev}
          onClick={() => setMonth(shiftMonth(month, -1))}
          className="rounded-full p-2 text-[var(--muted)]"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="min-w-36 text-center text-sm font-semibold">{monthTitle(month, lang)}</p>

        <button
          type="button"
          aria-label={x.next}
          onClick={() => setMonth(shiftMonth(month, 1))}
          className="rounded-full p-2 text-[var(--muted)]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* The one number that matters */}
      {planned > 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm font-medium text-[var(--muted)]">{left >= 0 ? x.left : x.overBy}</p>

          <p
            className={`mt-1 text-[34px] font-semibold leading-none tracking-tight [font-variant-numeric:tabular-nums] ${
              left < 0 ? "text-red-600" : ""
            }`}
          >
            {money(Math.abs(left))}
          </p>

          <div className="mt-4 h-2 rounded-full bg-[var(--border)]">
            <div
              className="h-2 rounded-full"
              style={{ width: `${Math.round(Math.min(usedPct, 1) * 100)}%`, background: barColor }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <span>{x.spent.replace("{x}", money(spentIn))}</span>
            <span>{x.planned.replace("{x}", money(planned))}</span>
          </div>

          {(overCount > 0 || unbudgetedSpent > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {overCount > 0 && (
                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600">
                  {x.over.replace("{n}", num(overCount))}
                </span>
              )}

              {unbudgetedSpent > 0 && (
                <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                  {x.unbudgeted.replace("{x}", money(unbudgetedSpent))}
                </span>
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
          <p className="text-3xl">🎯</p>
          <h2 className="mt-2 text-base font-semibold">{x.emptyTitle}</h2>
          <p className="mx-auto mt-1 max-w-xs text-sm text-[var(--muted)]">{x.emptyBody}</p>

          <div className="mt-4 flex flex-col gap-2">
            {hasSpendToSuggest && (
              <button
                type="button"
                onClick={suggest}
                className="rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white"
              >
                {x.suggest}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSheet({ kind: "pick" })}
              className={`${chipBtn} ${hasSpendToSuggest ? "" : "bg-[var(--primary)] text-white"}`}
            >
              {x.manual}
            </button>

            <button
              type="button"
              onClick={() => copyFromPreviousMonth(month)}
              className="py-1.5 text-xs font-semibold text-[var(--muted)]"
            >
              {x.copy}
            </button>
          </div>
        </section>
      )}

      {/* Cash and how it fits the plan */}
      {totalBalance < 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--gold-soft)] p-3 text-sm">
          <span>{x.negative}</span>

          <Link
            href="/accounts"
            className="shrink-0 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white"
          >
            {x.setBalances}
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 px-1 text-xs text-[var(--muted)]">
          <span>
            {x.cash} <b className="font-semibold text-[var(--foreground)]">{money(totalBalance)}</b>
            {planned > 0 && rta !== 0 && (
              <>
                {" · "}
                <span className={rta < 0 ? "font-semibold text-red-600" : ""}>
                  {rta < 0
                    ? x.tooMuch.replace("{x}", money(-rta))
                    : x.unplanned.replace("{x}", money(rta))}
                </span>
              </>
            )}
          </span>

          <Link href="/accounts" className="shrink-0 font-semibold text-[var(--primary)]">
            {x.accounts} ›
          </Link>
        </div>
      )}

      {/* Categories */}
      {shown.length > 0 && (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {shown.map((row) => {
            const had = row.spent + Math.max(row.available, 0);
            const pct = had > 0 ? row.spent / had : 0;
            const has = row.assigned > 0;
            const color = row.available < 0 ? "#ef4444" : pct >= 0.8 ? "var(--gold)" : "var(--primary)";

            return (
              <li key={row.category}>
                <button
                  type="button"
                  onClick={() => openEdit(row.category)}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-lg">
                    {emojiOf(row.category)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <b className="truncate text-sm font-semibold">{nameOf(row.category)}</b>

                      {has ? (
                        <span
                          className={`shrink-0 text-xs font-semibold ${
                            row.available < 0 ? "text-red-600" : "text-[var(--muted)]"
                          }`}
                        >
                          {row.available < 0
                            ? x.over1.replace("{x}", money(-row.available))
                            : x.left1.replace("{x}", money(row.available))}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--primary)]">
                          {x.setIt}
                        </span>
                      )}
                    </span>

                    <span className="mt-1.5 block h-1.5 rounded-full bg-[var(--border)]">
                      <span
                        className="block h-1.5 rounded-full"
                        style={{ width: `${has ? Math.round(Math.min(row.available < 0 ? 1 : pct, 1) * 100) : 0}%`, background: color }}
                      />
                    </span>

                    <span className="mt-1 block text-[11px] text-[var(--muted)] [font-variant-numeric:tabular-nums]">
                      {has ? `${money(row.spent)} / ${money(row.assigned)}` : `${money(row.spent)} · ${x.noBudget}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {planned > 0 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => copyFromPreviousMonth(month)}
            className="text-xs font-semibold text-[var(--muted)]"
          >
            {x.copy}
          </button>

          <p className="text-right text-[11px] text-[var(--muted)]">{x.hint}</p>
        </div>
      )}

      {/* Bottom sheets */}
      {sheet && (
        <div className="fixed inset-0 z-[90] flex items-end bg-black/40" onClick={() => setSheet(null)}>
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-[var(--card)] p-5 pb-8"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {sheet.kind === "edit"
                  ? `${emojiOf(sheet.category)} ${nameOf(sheet.category)}`
                  : sheet.kind === "pick"
                  ? x.pick
                  : x.newCat}
              </h2>

              <button type="button" aria-label={x.close} onClick={() => setSheet(null)} className="rounded-full p-1.5 text-[var(--muted)]">
                <X size={20} />
              </button>
            </div>

            {sheet.kind === "edit" && (
              <>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  {x.amount}
                  <input
                    autoFocus
                    inputMode="decimal"
                    value={draft}
                    placeholder="0"
                    onChange={(e) => setDraft(e.target.value.replace(/[^\d.]/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save();
                    }}
                    className="mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-2xl font-semibold text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[500, 1000, 5000].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setDraft(String((Number(draft) || 0) + step))}
                      className={chipBtn}
                    >
                      +{num(step)}
                    </button>
                  ))}

                  {sheetRow && sheetRow.spent > 0 && (
                    <button
                      type="button"
                      onClick={() => setDraft(String(Math.ceil(sheetRow.spent / 100) * 100))}
                      className={chipBtn}
                    >
                      {x.match}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={save}
                  className="mt-5 w-full rounded-full bg-[var(--primary)] py-3.5 text-sm font-semibold text-white"
                >
                  {x.save}
                </button>

                <div className="mt-3 flex items-center justify-between">
                  {sheetRow && sheetRow.assigned > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAssigned(month, sheet.category, 0);
                        setSheet(null);
                      }}
                      className="text-xs font-semibold text-[var(--muted)]"
                    >
                      {x.remove}
                    </button>
                  ) : (
                    <span />
                  )}

                  {customList.includes(sheet.category) && (
                    <button
                      type="button"
                      aria-label="delete category"
                      onClick={() => {
                        if (window.confirm(x.delCat)) {
                          deleteCustomCategory(sheet.category);
                          setSheet(null);
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </>
            )}

            {sheet.kind === "pick" && (
              <>
                <ul className="grid grid-cols-3 gap-2">
                  {allCategories.map((category) => {
                    const row = rows.find((item) => item.category === category);
                    const on = !!row && row.assigned > 0;

                    return (
                      <li key={category}>
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className={`flex h-full w-full flex-col items-center gap-1 rounded-2xl border p-3 text-center ${
                            on ? "border-[var(--primary)] bg-[var(--primary)]/8" : "border-[var(--border)]"
                          }`}
                        >
                          <span className="text-2xl">{emojiOf(category)}</span>
                          <span className="text-[11px] font-semibold leading-tight">{nameOf(category)}</span>
                        </button>
                      </li>
                    );
                  })}

                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSheet({ kind: "new" });
                      }}
                      className="flex h-full w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-[var(--border)] p-3 text-center text-[var(--muted)]"
                    >
                      <Plus size={24} />
                      <span className="text-[11px] font-semibold leading-tight">{x.newCat}</span>
                    </button>
                  </li>
                </ul>
              </>
            )}

            {sheet.kind === "new" && (
              <>
                <div className="grid grid-cols-[4rem_1fr] gap-3">
                  <input
                    value={newEmoji}
                    maxLength={2}
                    aria-label="emoji"
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 text-center text-xl outline-none"
                  />

                  <input
                    autoFocus
                    value={newName}
                    maxLength={30}
                    placeholder={x.catName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <button
                  type="button"
                  disabled={!newName.trim()}
                  onClick={() => {
                    if (addCustomCategory({ name: newName, emoji: newEmoji })) {
                      const made = `${newEmoji} ${newName.trim()}`;

                      setNewName("");
                      setError("");
                      setSheet({ kind: "edit", category: made });
                      setDraft("");
                    } else {
                      setError(x.catExists);
                    }
                  }}
                  className="mt-4 w-full rounded-full bg-[var(--primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {x.save}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
