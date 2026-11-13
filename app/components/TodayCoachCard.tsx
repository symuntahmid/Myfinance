"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Flame, Snowflake } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { getSettings } from "@/app/data/settings";
import { getTransactions } from "@/app/data/transactions";
import {
  getCustomReminders,
  getDueReminders,
  type DueReminder,
} from "@/app/data/customReminders";
import {
  getBills,
  sortedStatuses,
  type BillStatus,
} from "@/app/data/bills";
import { formatCurrency } from "@/app/utils/currency";
import { getPlayer } from "@/app/data/player";
import { getJourneyProgress } from "@/app/data/dailyJourney";
import {
  getFreezeData,
  MAX_FREEZES,
  todayKey,
} from "@/app/data/streakFreeze";
import { quickExpenseCategories } from "@/app/data/quickAdd";
import {
  getDayReminders,
  pickNudge,
  type CoachCta,
  type CoachNudge,
  type CoachReminder,
} from "@/app/data/todayCoach";

type Props = {
  onQuickAdd: () => void;
};

export default function TodayCoachCard({ onQuickAdd }: Props) {
  const { t, language } = useLanguage();

  const [state, setState] = useState<{
    nudge: CoachNudge;
    reminders: CoachReminder[];
    custom: DueReminder[];
    bills: BillStatus[];
    streak: number;
    freezes: number;
    done: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    const refresh = () => {
      const settings = getSettings();
      const now = new Date();

      const nudge = pickNudge({
        transactions: getTransactions(),
        now,
        categoryLabel: (category) => {
          const found = quickExpenseCategories.find(
            (item) => item.value === category
          );

          return found
            ? found[language]
            : category.replace(/^[^\p{L}\p{N}]+/u, "");
        },
      });

      const reminders = settings.remindersEnabled
        ? getDayReminders({
            date: now,
            salaryDay: settings.salaryDay,
            rentDay: settings.rentDay,
          })
        : [];

      const custom = settings.remindersEnabled
        ? getDueReminders(getCustomReminders(), todayKey())
        : [];

      const bills = settings.remindersEnabled
        ? sortedStatuses(getBills(), now)
            .filter(
              (item) =>
                item.state === "overdue" ||
                item.state === "today" ||
                item.state === "soon"
            )
            .slice(0, 2)
        : [];

      const journey = getJourneyProgress();

      setState({
        nudge,
        reminders,
        custom,
        bills,
        streak: getPlayer().streak,
        freezes: getFreezeData().freezes,
        done: journey.completed,
        total: journey.total,
      });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "settingsUpdated",
      "languageUpdated",
      "remindersUpdated",
      "billsUpdated",
      "dailyJourneyUpdated",
      "player-updated",
    ];

    events.forEach((name) =>
      window.addEventListener(name, refresh)
    );

    return () =>
      events.forEach((name) =>
        window.removeEventListener(name, refresh)
      );
  }, [language]);

  if (!state) return null;

  const ctaLabel: Record<CoachCta, string> = {
    quickAdd: t("coachOpenQuickAdd"),
    goals: t("coachOpenGoals"),
    reports: t("coachOpenReports"),
  };

  const number = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const goldButton =
    "mt-5 inline-flex items-center rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#1F1500] transition active:scale-[0.97]";

  const renderCta = (cta?: CoachCta) => {
    if (!cta) return null;

    if (cta === "quickAdd") {
      return (
        <button
          type="button"
          onClick={onQuickAdd}
          className={goldButton}
        >
          {ctaLabel[cta]}
        </button>
      );
    }

    return (
      <Link
        href={cta === "goals" ? "/goals" : "/reports"}
        className={goldButton}
      >
        {ctaLabel[cta]}
      </Link>
    );
  };

  // Everything that needs attention today, as short rows.
  const rows: { id: string; href?: string; text: string }[] = [
    ...state.bills.map((item) => ({
      id: `bill-${item.bill.id}`,
      href: "/bills",
      text: `${t("billDueReminder", {
        name: item.bill.name,
        amount: formatCurrency(item.bill.amount),
      })} · ${
        item.state === "overdue"
          ? t("billOverdue")
          : item.state === "today"
          ? t("billDueToday")
          : t("billDueIn", { days: number(item.daysLeft) })
      }`,
    })),
    ...state.reminders.map((item) => ({
      id: item.id,
      text: t(item.key, item.params),
    })),
    ...state.custom.map((item) => ({
      id: `custom-${item.id}`,
      text:
        item.daysLeft === 0
          ? t("reminderDueToday", { title: item.title })
          : item.daysLeft === 1
          ? t("reminderDueTomorrow", { title: item.title })
          : t("reminderDueInDays", {
              days: number(item.daysLeft),
              title: item.title,
            }),
    })),
  ];

  const percent =
    state.total > 0
      ? Math.round((state.done / state.total) * 100)
      : 0;

  return (
    <section className="hero-rise alpona relative overflow-hidden rounded-[28px] bg-[var(--forest)] p-6 text-[var(--on-forest)] shadow-[0_18px_40px_rgba(11,59,46,0.28)]">
      {/* The sonali sun */}

      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,182,79,0.55) 0%, rgba(226,182,79,0.12) 45%, transparent 70%)",
        }}
      />

      <div className="relative">
        <p className="text-sm font-medium text-[var(--gold)]">
          {t("coachTitle")}
        </p>

        <p className="font-display mt-3 text-[26px] leading-[1.35] sm:text-[30px]">
          {t(state.nudge.key, state.nudge.params)}
        </p>

        {renderCta(state.nudge.cta)}

        {rows.length > 0 && (
          <div className="mt-6 space-y-2">
            {rows.map((row) => {
              const inner = (
                <>
                  <Bell
                    size={16}
                    className="mt-0.5 shrink-0 text-[var(--gold)]"
                  />

                  <span className="text-sm leading-6">
                    {row.text}
                  </span>
                </>
              );

              const className =
                "flex items-start gap-3 rounded-xl border-l-2 border-[var(--gold)] bg-black/20 px-3 py-2.5";

              return row.href ? (
                <Link
                  key={row.id}
                  href={row.href}
                  className={className}
                >
                  {inner}
                </Link>
              ) : (
                <div key={row.id} className={className}>
                  {inner}
                </div>
              );
            })}
          </div>
        )}

        {/* Streak and today's progress */}

        <div className="mt-6 grid grid-cols-[auto_auto_1fr] items-end gap-x-6 gap-y-1 border-t border-[var(--gold)]/20 pt-5">
          <div>
            <p className="font-display flex items-center gap-1.5 text-3xl leading-none">
              <Flame
                size={22}
                className="text-[var(--gold)]"
              />

              {number(state.streak)}
            </p>

            <p className="mt-1.5 text-xs text-[var(--on-forest)]/70">
              {t("heroStreak")}
            </p>
          </div>

          <div>
            <p className="font-display flex items-center gap-1.5 text-3xl leading-none">
              <Snowflake
                size={20}
                className="text-[var(--gold)]"
              />

              {number(state.freezes)}/{number(MAX_FREEZES)}
            </p>

            <p className="mt-1.5 text-xs text-[var(--on-forest)]/70">
              {t("heroFreezes")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-right text-xs text-[var(--on-forest)]/70">
              {t("heroTasks")} {number(state.done)}/
              {number(state.total)}
            </p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/25">
              <div
                className="h-full rounded-full bg-[var(--gold)] transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
