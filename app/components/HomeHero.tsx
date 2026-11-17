"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarClock, Flame } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import HeroChart from "@/app/components/HeroChart";
import { buildCoach, type CoachState } from "@/app/data/coach";
import { getNetWorthNow } from "@/app/data/overview";
import { recordSnapshot } from "@/app/data/netWorth";
import { getPlayer } from "@/app/data/player";
import { getBills, sortedStatuses } from "@/app/data/bills";
import { getSummary, getTransactions } from "@/app/data/transactions";
import { buildNetWorthSeries, type SeriesPoint } from "@/app/data/netWorthSeries";
import { monthOfDate, todayLocal } from "@/app/utils/date";

const TEXT = {
  en: {
    left: "Left to spend",
    perDay: "{x} a day",
    daysLeft: "{n} days left this month, after {b} of bills",
    income: "Income",
    spent: "Spent",
    net: "Net worth",
    month: "This month",
    kept: "Kept {x} · {p}% of income",
    over: "Over by {x}",
    nothing: "Add your first entry to see this.",
    days: "{n}d",
  },
  bn: {
    left: "খরচ করার মতো আছে",
    perDay: "দিনে {x}",
    daysLeft: "মাসের আর {n} দিন, {b} বিল বাদ দিয়ে",
    income: "আয়",
    spent: "খরচ",
    net: "নিট সম্পদ",
    month: "এই মাস",
    kept: "জমেছে {x} · আয়ের {p}%",
    over: "{x} বেশি খরচ",
    nothing: "প্রথম এন্ট্রি দিলে এটি দেখা যাবে।",
    days: "{n} দিন",
  },
} as const;

type State = {
  worth: number;
  series: SeriesPoint[];
  streak: number;
  due: number;
  coach: CoachState;
  income: number;
  expense: number;
};

const chip =
  "flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 text-xs font-semibold text-[var(--foreground)]";

export default function HomeHero() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [state, setState] = useState<State | null>(null);
  const [page, setPage] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => {
      const worth = getNetWorthNow().netWorth;

      recordSnapshot(monthOfDate(todayLocal()), worth);

      const summary = getSummary();

      setState({
        worth,
        series: buildNetWorthSeries(worth, getTransactions()),
        streak: getPlayer().streak,
        due: sortedStatuses(getBills(), new Date()).filter(
          (item) => item.state === "overdue" || item.state === "today"
        ).length,
        coach: buildCoach(lang),
        income: summary.income,
        expense: summary.expense,
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
      events.forEach((e) => window.removeEventListener(e, refresh));
  }, [lang]);

  if (!state) return null;

  const loc = lang === "bn" ? "bn-BD" : "en-US";
  const num = (value: number) => value.toLocaleString(loc);

  const { coach, income, expense } = state;
  const hasData = income > 0 || expense > 0 || coach.cash > 0;
  const usedPct = income > 0 ? Math.min(expense / income, 1.5) : 0;
  const barColor =
    expense > income ? "#ef4444" : usedPct >= 0.8 ? "var(--gold)" : "var(--primary)";

  const first = state.series[0];
  const last = state.series[state.series.length - 1];
  const diff = first && last ? last.value - first.value : 0;
  const trend = state.series.length >= 2 && diff !== 0;

  const biggest = Math.max(income, expense, 1);
  const kept = income - expense;

  const go = (index: number) => {
    const el = scroller.current;

    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const slide = "w-full shrink-0 snap-center";
  const label = "text-sm font-medium text-[var(--muted)]";
  const big =
    "text-[30px] font-semibold leading-none tracking-tight [font-variant-numeric:tabular-nums]";

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] pb-2.5 pt-3.5">
      <div className="relative">
        <div className="absolute right-3.5 top-0 z-10 flex items-center gap-2">
          <Link href="/reminders" aria-label="Reminders" className={chip}>
            <CalendarClock size={14} className="text-[var(--muted)]" />
            {state.due > 0 && <span className="text-[var(--sun)]">{num(state.due)}</span>}
          </Link>

          <span className={chip}>
            <Flame size={14} className="text-[var(--sun)]" />
            {num(state.streak)}
          </span>
        </div>

        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;

            setPage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* 1. Left to spend */}
          <div className={`${slide} h-[150px] px-3.5`}>
            <p className={`${label} flex h-8 items-center`}>{x.left}</p>

            <div className="mt-1 flex items-end justify-between gap-3">
              <p className={big}>{formatCurrency(coach.safe)}</p>

              {coach.cash > 0 && (
                <span className="mb-0.5 shrink-0 rounded-full bg-[var(--background)] px-2 py-1 text-xs font-semibold">
                  {x.perDay.replace("{x}", formatCurrency(coach.perDay))}
                </span>
              )}
            </div>

            <p className="mt-1.5 truncate text-xs text-[var(--muted)]">
              {x.daysLeft
                .replace("{n}", num(coach.daysLeft))
                .replace("{b}", formatCurrency(coach.billsLeft))}
            </p>

            <div className="mt-3 h-1.5 rounded-full bg-[var(--border)]">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${Math.round(Math.min(usedPct, 1) * 100)}%`, background: barColor }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs">
              <span className="text-[var(--muted)]">
                {x.income}{" "}
                <b className="font-semibold text-[var(--success)]">+{formatCurrency(income)}</b>
              </span>
              <span className="text-[var(--muted)]">
                {x.spent}{" "}
                <b className="font-semibold text-[var(--foreground)]">-{formatCurrency(expense)}</b>
              </span>
            </div>
          </div>

          {/* 2. Net worth */}
          <div className={`${slide} h-[150px] px-3.5`}>
            <p className={`${label} flex h-8 items-center`}>{x.net}</p>

            <div className="mt-1 flex items-end justify-between gap-3">
              <p className={big}>{formatCurrency(state.worth)}</p>

              {trend && (
                <span
                  className={`mb-0.5 shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                    diff > 0
                      ? "bg-[var(--success)]/12 text-[var(--success)]"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {diff > 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(diff))} ·{" "}
                  {x.days.replace("{n}", num(state.series.length - 1))}
                </span>
              )}
            </div>

            <HeroChart series={state.series} bn={lang === "bn"} compactH={50} />
          </div>

          {/* 3. This month */}
          <div className={`${slide} h-[150px] px-3.5`}>
            <p className={`${label} flex h-8 items-center`}>{x.month}</p>

            {!hasData ? (
              <p className="mt-3 text-sm text-[var(--muted)]">{x.nothing}</p>
            ) : (
              <>
                <div className="mt-1 space-y-2">
                  {(
                    [
                      [x.income, income, "var(--success)"],
                      [x.spent, expense, "#ef4444"],
                    ] as const
                  ).map(([name, value, color]) => (
                    <div key={name} className="flex items-center gap-3 text-xs">
                      <span className="w-12 shrink-0 text-[var(--muted)]">{name}</span>

                      <span className="h-2 flex-1 rounded-full bg-[var(--border)]">
                        <span
                          className="block h-2 rounded-full"
                          style={{ width: `${Math.round((value / biggest) * 100)}%`, background: color }}
                        />
                      </span>

                      <span className="w-20 shrink-0 text-right font-semibold [font-variant-numeric:tabular-nums]">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${
                    kept >= 0 ? "text-[var(--success)]" : "text-red-600"
                  }`}
                >
                  {kept >= 0
                    ? x.kept
                        .replace("{x}", formatCurrency(kept))
                        .replace("{p}", num(income > 0 ? Math.round((kept / income) * 100) : 0))
                    : x.over.replace("{x}", formatCurrency(-kept))}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-1 flex justify-center gap-1.5">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => go(index)}
            aria-label={`Card ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              page === index ? "w-4 bg-[var(--foreground)]" : "w-1.5 bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
