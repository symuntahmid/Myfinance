"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getTransactions } from "@/app/data/transactions";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { quickExpenseCategories } from "@/app/data/quickAdd";
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

export default function PlanPage() {
  const { t, language } = useLanguage();

  const [month, setMonth] = useState(currentMonth());
  const [result, setResult] = useState<PlanResult | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const [customList, setCustomList] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();

      const total = getAccounts().reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      setTotalBalance(total);

      const custom = getCustomCategories().map((item) => item.value);

      setCustomList(custom);

      setResult(
        computePlan({
          month,
          plan: getPlan(),
          transactions: getTransactions(),
          totalBalance: total,
          customCategories: custom,
        })
      );
    };

    refresh();

    const events = [
      "planUpdated",
      "transactionsUpdated",
      "accountsUpdated",
      "languageUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, [month]);

  function label(category: string): string {
    const found = quickExpenseCategories.find(
      (item) => item.value === category
    );

    return found
      ? `${found.emoji} ${found[language]}`
      : category;
  }

  function commit(category: string) {
    const value = Number(draft);

    if (draft !== "" && !isNaN(value) && value >= 0) {
      setAssigned(month, category, value);
    }

    setEditing(null);
  }

  if (!result) return null;

  const rta = result.readyToAssign;

  const visibleRows = result.rows.filter(
    (row) =>
      row.assigned > 0 ||
      row.spent > 0 ||
      row.available !== 0 ||
      customList.includes(row.category) ||
      quickExpenseCategories.some(
        (item) => item.value === row.category
      )
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-6 md:px-0">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          {t("planTitle")}
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("planSubtitle")}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2">
        <button
          type="button"
          aria-label="previous month"
          onClick={() => setMonth(shiftMonth(month, -1))}
          className="rounded-xl p-2 text-[var(--foreground)]"
        >
          <ChevronLeft size={20} />
        </button>

        <p className="font-semibold text-[var(--foreground)]">
          {monthTitle(month, language)}
        </p>

        <button
          type="button"
          aria-label="next month"
          onClick={() => setMonth(shiftMonth(month, 1))}
          className="rounded-xl p-2 text-[var(--foreground)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        className={`rounded-3xl p-6 text-white ${
          rta < 0
            ? "bg-gradient-to-r from-red-500 to-rose-500"
            : rta === 0
            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : "bg-gradient-to-r from-violet-600 to-cyan-600"
        }`}
      >
        <p className="text-sm opacity-90">
          {t("planReadyToAssign")}
        </p>

        <p className="mt-1 text-4xl font-bold">
          {formatCurrency(rta)}
        </p>

        <p className="mt-2 text-sm opacity-95">
          {rta < 0
            ? t("planOverAssigned")
            : rta === 0 && totalBalance > 0
            ? t("planAllAssigned")
            : ""}
        </p>
      </div>

      {totalBalance === 0 && result.totalAssigned === 0 && (
        <p className="rounded-2xl bg-amber-500/10 p-3 text-sm text-[var(--foreground)]">
          {t("planSetBalances")}
        </p>
      )}

      <button
        type="button"
        onClick={() => copyFromPreviousMonth(month)}
        className="w-full rounded-2xl border border-[var(--border)] py-3 text-sm font-semibold text-[var(--foreground)]"
      >
        {t("planCopyLast")}
      </button>

      {adding ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="grid grid-cols-[4rem_1fr] gap-3">
            <input
              value={newEmoji}
              maxLength={2}
              onChange={(e) => setNewEmoji(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-center text-[var(--foreground)]"
            />

            <input
              value={newName}
              maxLength={30}
              placeholder={t("planCategoryPlaceholder")}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
            />
          </div>

          {addError && (
            <p className="mt-2 text-sm text-red-500">{addError}</p>
          )}

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              disabled={!newName.trim()}
              onClick={() => {
                if (
                  addCustomCategory({
                    name: newName,
                    emoji: newEmoji,
                  })
                ) {
                  setNewName("");
                  setAddError("");
                  setAdding(false);
                } else {
                  setAddError(t("planCategoryExists"));
                }
              }}
              className="rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {t("saveLabel")}
            </button>

            <button
              type="button"
              onClick={() => setAdding(false)}
              className="text-sm text-[var(--muted)]"
            >
              {t("cancelLabel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          <Plus size={16} />
          {t("planNewCategory")}
        </button>
      )}

      <div className="space-y-3">
        {visibleRows.map((row) => {
          // How much of what this category had has been used up.
          const had = row.spent + Math.max(row.available, 0);
          const share = had > 0 ? (row.spent / had) * 100 : 0;

          return (
            <div
              key={row.category}
              className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="flex min-w-0 items-center gap-2 truncate font-semibold text-[var(--foreground)]">
                  {label(row.category)}

                  {customList.includes(row.category) && (
                    <button
                      type="button"
                      aria-label="remove category"
                      onClick={() => {
                        if (window.confirm(t("planDeleteCategory"))) {
                          deleteCustomCategory(row.category);
                        }
                      }}
                      className="text-[var(--muted)]"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </p>

                <p
                  className={`shrink-0 text-sm font-bold ${
                    row.available < 0
                      ? "text-red-500"
                      : row.available > 0
                      ? "text-emerald-600"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {row.available < 0
                    ? `${t("planOverspent")} ${formatCurrency(-row.available)}`
                    : `${t("planAvailable")} ${formatCurrency(row.available)}`}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className={`h-full rounded-full ${
                    row.available < 0
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${row.available < 0 ? 100 : share}%`,
                  }}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-[var(--muted)]">
                <div>
                  {t("planAssigned")}

                  {editing === row.category ? (
                    <input
                      autoFocus
                      inputMode="decimal"
                      value={draft}
                      onChange={(e) =>
                        setDraft(
                          e.target.value.replace(/[^\d.]/g, "")
                        )
                      }
                      onBlur={() => commit(row.category)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commit(row.category);
                      }}
                      className="mt-1 w-full rounded-xl border border-violet-400 bg-[var(--card)] p-2 text-sm font-semibold text-[var(--foreground)]"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row.category);
                        setDraft(
                          row.assigned ? String(row.assigned) : ""
                        );
                      }}
                      className="mt-1 block w-full rounded-xl bg-black/5 p-2 text-left text-sm font-semibold text-[var(--foreground)]"
                    >
                      {formatCurrency(row.assigned)}
                    </button>
                  )}
                </div>

                <div>
                  {t("planSpent")}

                  <p className="mt-1 p-2 text-sm font-semibold text-[var(--foreground)]">
                    {formatCurrency(row.spent)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs leading-5 text-[var(--muted)]">
        {t("planHint")}
      </p>
    </div>
  );
}
