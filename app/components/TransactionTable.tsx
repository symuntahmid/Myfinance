"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";

import EditTransactionModal from "./EditTransactionModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import {
  deleteTransaction,
  getTransactions,
  type Transaction,
} from "../data/transactions";

type Filter = "All" | "Income" | "Expense" | "Investment" | "Transfer";

const FILTERS: [Filter, string][] = [
  ["All", "txAll"],
  ["Income", "income"],
  ["Expense", "expenses"],
  ["Investment", "txInvested"],
  ["Transfer", "txTransfers"],
];

const SIGN: Record<Transaction["type"], string> = {
  Income: "+",
  Expense: "-",
  Investment: "-",
  Transfer: "",
};

// yyyy-mm-dd of an entry, in the person's own day (no time-zone drift).
function dayOf(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);

  const d = new Date(date);

  return Number.isNaN(d.getTime())
    ? "0000-00-00"
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
}

const strip = (text: string) => text.replace(/^[^\p{L}\p{N}]+/u, "");

export default function TransactionTable() {
  const { t, language } = useLanguage();

  const [items, setItems] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [month, setMonth] = useState<string | null>(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [openId, setOpenId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [, bump] = useState(0);

  useEffect(() => {
    const refresh = () => setItems(getTransactions());
    const redraw = () => bump((v) => v + 1);

    refresh();

    window.addEventListener("transactionsUpdated", refresh);
    window.addEventListener("currencyUpdated", redraw);
    window.addEventListener("languageUpdated", redraw);

    return () => {
      window.removeEventListener("transactionsUpdated", refresh);
      window.removeEventListener("currencyUpdated", redraw);
      window.removeEventListener("languageUpdated", redraw);
    };
  }, []);

  const locale = language === "bn" ? "bn-BD" : "en-GB";

  const labelOf = (item: Transaction) => {
    if (item.type === "Transfer") {
      return { emoji: "🔁", text: t("txTransferOne") };
    }

    const raw = item.category?.trim() || item.type;
    const found = quickExpenseCategories.find((c) => c.value === raw);

    return found
      ? { emoji: found.emoji, text: found[language] }
      : {
          emoji:
            item.type === "Income" ? "💰" : item.type === "Investment" ? "📈" : "💸",
          text: strip(raw),
        };
  };

  const subOf = (item: Transaction) =>
    item.type === "Transfer"
      ? `${strip(item.source)} → ${strip(item.destination ?? "")}`
      : [strip(item.source), item.note].filter(Boolean).join(" · ");

  // Everything in the chosen month (or all time), newest first.
  const inMonth = useMemo(
    () =>
      items
        .filter((item) => month === null || dayOf(item.date).startsWith(month))
        .sort(
          (a, b) =>
            dayOf(b.date).localeCompare(dayOf(a.date)) || b.id - a.id
        ),
    [items, month]
  );

  const totals = useMemo(() => {
    const sum = (type: Transaction["type"]) =>
      inMonth
        .filter((item) => item.type === type)
        .reduce((total, item) => total + item.amount, 0);

    return { income: sum("Income"), spent: sum("Expense") };
  }, [inMonth]);

  const shown = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return inMonth.filter((item) => {
      if (filter !== "All" && item.type !== filter) return false;
      if (!needle) return true;

      return [
        item.source,
        item.category ?? "",
        item.note ?? "",
        item.destination ?? "",
        String(item.amount),
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [inMonth, filter, search]);

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();

    shown.forEach((item) => {
      const key = dayOf(item.date);

      map.set(key, [...(map.get(key) ?? []), item]);
    });

    return [...map.entries()];
  }, [shown]);

  const shiftMonth = (by: number) => {
    if (!month) return;

    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + by, 1);

    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = month
    ? new Date(
        Number(month.slice(0, 4)),
        Number(month.slice(5, 7)) - 1,
        1
      ).toLocaleDateString(locale, { month: "long", year: "numeric" })
    : t("txAllTime");

  const dayLabel = (key: string) => {
    const local = new Date();
    const todayKey = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(local.getDate()).padStart(2, "0")}`;
    const yest = new Date(local.getFullYear(), local.getMonth(), local.getDate() - 1);
    const yestKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(yest.getDate()).padStart(2, "0")}`;

    if (key === todayKey) return t("txToday");
    if (key === yestKey) return t("txYesterday");

    const [y, m, d] = key.split("-").map(Number);

    return new Date(y, m - 1, d).toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const num = (value: number) => value.toLocaleString(locale);

  return (
    <div className="space-y-4">
      {/* Month and totals */}

      <section className="rounded-2xl bg-[var(--forest)] p-4 text-[var(--on-forest)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={t("txPrevMonth")}
            disabled={!month}
            onClick={() => shiftMonth(-1)}
            className="rounded-full p-1.5 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              setMonth(
                month
                  ? null
                  : `${new Date().getFullYear()}-${String(
                      new Date().getMonth() + 1
                    ).padStart(2, "0")}`
              )
            }
            className="text-sm font-semibold"
          >
            {monthLabel}
          </button>

          <button
            type="button"
            aria-label={t("txNextMonth")}
            disabled={!month}
            onClick={() => shiftMonth(1)}
            className="rounded-full p-1.5 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs opacity-70">{t("income")}</p>
            <p className="text-sm font-bold">+{formatCurrency(totals.income)}</p>
          </div>

          <div>
            <p className="text-xs opacity-70">{t("txSpent")}</p>
            <p className="text-sm font-bold">-{formatCurrency(totals.spent)}</p>
          </div>

          <div>
            <p className="text-xs opacity-70">{t("txNet")}</p>
            <p className="text-sm font-bold">
              {totals.income - totals.spent < 0 ? "-" : ""}
              {formatCurrency(Math.abs(totals.income - totals.spent))}
            </p>
          </div>
        </div>
      </section>

      {/* Search and filters */}

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("txSearch")}
          className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map(([id, key]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold ${
              filter === id
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            {t(key as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* The list, day by day */}

      {groups.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] py-10 text-center text-sm text-[var(--muted)]">
          {search || filter !== "All" ? t("txNoMatch") : t("txEmpty")}
        </p>
      ) : (
        groups.map(([key, rows]) => {
          const dayNet = rows.reduce(
            (sum, item) =>
              sum +
              (item.type === "Income"
                ? item.amount
                : item.type === "Transfer"
                ? 0
                : -item.amount),
            0
          );

          return (
            <section key={key}>
              <div className="mb-1.5 flex items-baseline justify-between px-1">
                <h2 className="text-xs font-bold text-[var(--muted)]">
                  {dayLabel(key)}
                </h2>

                <span className="text-xs font-semibold text-[var(--muted)]">
                  {dayNet < 0 ? "-" : dayNet > 0 ? "+" : ""}
                  {formatCurrency(Math.abs(dayNet))}
                </span>
              </div>

              <ul className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                {rows.map((item, index) => {
                  const label = labelOf(item);
                  const open = openId === item.id;

                  return (
                    <li
                      key={item.id}
                      className={index > 0 ? "border-t border-[var(--border)]" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : item.id)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-lg">
                          {label.emoji}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">
                            {label.text}
                          </span>

                          <span className="block truncate text-xs text-[var(--muted)]">
                            {subOf(item)}
                          </span>
                        </span>

                        <span
                          className={`shrink-0 text-sm font-bold ${
                            item.type === "Income" ? "text-[var(--success)]" : ""
                          }`}
                        >
                          {SIGN[item.type]}
                          {formatCurrency(item.amount)}
                        </span>
                      </button>

                      {open && (
                        <div className="flex gap-2 px-4 pb-3">
                          {item.type !== "Transfer" && (
                            <button
                              type="button"
                              onClick={() => setEditing(item)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] py-2 text-sm font-semibold"
                            >
                              <Pencil size={14} />
                              {t("txEdit")}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(t("txDeleteConfirm"))) {
                                deleteTransaction(item.id);
                                setOpenId(null);
                              }
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
          );
        })
      )}

      <p className="pt-1 text-center text-xs text-[var(--muted)]">
        {t("txCount", { n: num(shown.length) })}
      </p>

      <EditTransactionModal
        open={editing !== null}
        transaction={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
