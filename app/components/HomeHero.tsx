"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Flame } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getNetWorthNow } from "@/app/data/overview";
import { previousSnapshot, recordSnapshot } from "@/app/data/netWorth";
import { getPlayer } from "@/app/data/player";
import HeroChart from "@/app/components/HeroChart";
import { getTransactions } from "@/app/data/transactions";
import { buildNetWorthSeries, type SeriesPoint } from "@/app/data/netWorthSeries";
import { getBills, sortedStatuses } from "@/app/data/bills";

function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function HomeHero() {
  const { t, language } = useLanguage();

  const [state, setState] = useState<{
    worth: number;
    change: number | null;
    streak: number;
    due: number;
    series: SeriesPoint[];
  } | null>(null);

  useEffect(() => {
    const refresh = () => {
      const worth = getNetWorthNow().netWorth;
      const month = currentMonth();

      recordSnapshot(month, worth);

      const before = previousSnapshot(month);

      setState({
        worth,
        change: before ? worth - before.value : null,
        streak: getPlayer().streak,
        series: buildNetWorthSeries(worth, getTransactions()),
        due: sortedStatuses(getBills(), new Date()).filter(
          (item) => item.state === "overdue" || item.state === "today"
        ).length,
      });
    };

    refresh();

    const events = [
      "accountsUpdated",
      "transactionsUpdated",
      "goalsUpdated",
      "debtsUpdated",
      "investmentsUpdated",
      "currencyUpdated",
      "languageUpdated",
      "player-updated",
      "dailyJourneyUpdated",
      "billsUpdated",
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

  const bn = language === "bn";
  const first = state.series[0];
  const last = state.series[state.series.length - 1];
  const diff = first && last ? last.value - first.value : 0;
  const hasTrend = state.series.length >= 2 && diff !== 0;
  const days = number(Math.max(state.series.length - 1, 0));

  const chip =
    "flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 text-xs font-semibold text-[var(--foreground)]";

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--muted)]">
          {t("netWorthTitle")}
        </p>

        <div className="flex items-center gap-2">
          <Link href="/reminders" aria-label={t("billsTitle")} className={chip}>
            <Bell size={14} className="text-[var(--muted)]" />
            {state.due > 0 && (
              <span className="text-[var(--sun)]">{number(state.due)}</span>
            )}
          </Link>

          <span className={chip}>
            <Flame size={14} className="text-[var(--sun)]" />
            {number(state.streak)}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-[30px] font-semibold leading-none tracking-tight [font-variant-numeric:tabular-nums]">
          {formatCurrency(state.worth)}
        </p>

        {hasTrend && (
          <span
            className={`mb-0.5 shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
              diff > 0
                ? "bg-[var(--success)]/12 text-[var(--success)]"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {diff > 0 ? "+" : "-"}
            {formatCurrency(Math.abs(diff))}
            {" · "}
            {bn ? `${days} দিন` : `${days}d`}
          </span>
        )}
      </div>

      <HeroChart series={state.series} bn={bn} />
    </section>
  );
}
