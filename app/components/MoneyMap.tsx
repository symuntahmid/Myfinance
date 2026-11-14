"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ClipboardList,
  Landmark,
  Receipt,
  Waypoints,
} from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getAccounts, getBalances } from "@/app/data/accounts";
import { getBills, sortedStatuses, type BillStatus } from "@/app/data/bills";
import { getTransactions } from "@/app/data/transactions";
import { computePlan, getCustomCategories, getPlan } from "@/app/data/plan";

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function MoneyMap() {
  const { t, language } = useLanguage();

  const [state, setState] = useState<{
    total: number;
    count: number;
    next: BillStatus | null;
    ready: number;
    overspent: number;
  } | null>(null);

  useEffect(() => {
    const refresh = () => {
      const balances = getBalances();
      const accounts = getAccounts();

      const total = accounts.reduce(
        (sum, item) => sum + (balances[item.id] ?? 0),
        0
      );

      const plan = computePlan({
        month: currentMonth(),
        plan: getPlan(),
        transactions: getTransactions(),
        totalBalance: total,
        customCategories: getCustomCategories().map(
          (item) => item.value
        ),
      });

      setState({
        total,
        count: accounts.length,
        next:
          sortedStatuses(getBills(), new Date()).find(
            (item) => item.state !== "paid"
          ) ?? null,
        ready: plan.readyToAssign,
        // Only count categories the user actually planned for.
        overspent: plan.rows.filter(
          (row) => row.available < 0 && row.assigned > 0
        ).length,
      });
    };

    refresh();

    const events = [
      "accountsUpdated",
      "transactionsUpdated",
      "billsUpdated",
      "planUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, refresh));

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, refresh)
      );
  }, []);

  if (!state) return null;

  const number = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const next = state.next;

  const billText = !next
    ? t("noBillsShort")
    : `${next.bill.emoji} ${next.bill.name} · ${
        next.state === "overdue"
          ? t("billOverdue")
          : next.state === "today"
          ? t("billDueToday")
          : t("billDueIn", { days: number(next.daysLeft) })
      }`;

  const rows = [
    {
      href: "/accounts",
      icon: Landmark,
      title: t("accountsTitle"),
      sub: t("accountsCount", { count: number(state.count) }),
      value: formatCurrency(state.total),
      tone: "",
    },
    {
      href: "/bills",
      icon: Receipt,
      title: t("billsTitle"),
      sub: billText,
      value: next ? formatCurrency(next.bill.amount) : "",
      tone: next?.state === "overdue" ? "text-[var(--sun)]" : "",
    },
    {
      href: "/plan",
      icon: ClipboardList,
      title: t("planTitle"),
      sub:
        state.overspent > 0
          ? t("planOverspentCount", { count: number(state.overspent) })
          : t("planReadyToAssign"),
      // Same as the accounts total? Don't repeat the number.
      value:
        state.ready === state.total ? "" : formatCurrency(state.ready),
      tone:
        state.ready < 0 || state.overspent > 0
          ? "text-[var(--sun)]"
          : "",
    },
    {
      href: "/cash-flow",
      icon: Waypoints,
      title: t("cfTitle"),
      sub: t("cfSubtitle"),
      value: "",
      tone: "",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      {rows.map((row, index) => {
        const Icon = row.icon;

        return (
          <Link
            key={row.href}
            href={row.href}
            className={`flex items-center gap-3 px-4 py-3 ${
              index > 0 ? "border-t border-[var(--border)]" : ""
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Icon size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--foreground)]">
                {row.title}
              </span>

              <span
                className={`block truncate text-xs ${
                  row.tone || "text-[var(--muted)]"
                }`}
              >
                {row.sub}
              </span>
            </span>

            <span className="shrink-0 text-sm font-semibold text-[var(--foreground)]">
              {row.value}
            </span>

            <ChevronRight
              size={16}
              className="shrink-0 text-[var(--muted)]"
            />
          </Link>
        );
      })}
    </div>
  );
}
