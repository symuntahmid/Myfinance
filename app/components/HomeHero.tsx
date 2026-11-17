"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Flame, Snowflake } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { getNetWorthNow } from "@/app/data/overview";
import { previousSnapshot, recordSnapshot } from "@/app/data/netWorth";
import { getPlayer } from "@/app/data/player";
import HeroChart from "@/app/components/HeroChart";
import { getTransactions } from "@/app/data/transactions";
import { buildNetWorthSeries, type SeriesPoint } from "@/app/data/netWorthSeries";
import { getBills, sortedStatuses } from "@/app/data/bills";
import { getFreezeData, MAX_FREEZES } from "@/app/data/streakFreeze";

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
    freezes: number;
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
        freezes: getFreezeData().freezes,
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

  return (
    <section className="hero-rise alpona relative overflow-hidden rounded-3xl bg-[var(--forest)] p-4 text-[var(--on-forest)] shadow-[0_14px_30px_rgba(11,59,46,0.25)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,182,79,0.5) 0%, rgba(226,182,79,0.1) 45%, transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/reminders"
            className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-semibold"
          >
            <Bell size={14} className="text-[var(--gold)]" />
            {t("billsTitle")}
            {state.due > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold text-[#1F1500]">
                {number(state.due)}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-black/25 px-2.5 py-1 text-xs">
            <span className="flex items-center gap-1">
              <Flame size={13} className="text-[var(--gold)]" />
              {number(state.streak)}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex items-center gap-1">
              <Snowflake size={13} className="text-[var(--gold)]" />
              {number(state.freezes)}/{number(MAX_FREEZES)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[13px] text-[var(--on-forest)]/75">
          {t("netWorthTitle")}
        </p>

        <p className="font-display mt-1 text-[34px] leading-none">
          {formatCurrency(state.worth)}
        </p>

        {(() => {
          const bn = language === "bn";
          const first = state.series[0];
          const last = state.series[state.series.length - 1];
          const diff = first && last ? last.value - first.value : 0;

          if (state.series.length >= 2 && diff !== 0) {
            const days = number(state.series.length - 1);
            const amount = formatCurrency(Math.abs(diff));

            return (
              <p className="mt-1.5 text-xs text-[var(--gold)]">
                {diff > 0 ? "▲ " : "▼ "}
                {bn ? `${days} দিনে ${amount}` : `${amount} in ${days} days`}
              </p>
            );
          }

          if (state.change !== null && state.change !== 0) {
            return (
              <p className="mt-1.5 text-xs text-[var(--gold)]">
                {state.change > 0 ? "▲ " : "▼ "}
                {t("heroSinceLast", {
                  amount: formatCurrency(Math.abs(state.change)),
                })}
              </p>
            );
          }

          return null;
        })()}

        <HeroChart series={state.series} bn={language === "bn"} />
      </div>
    </section>
  );
}
