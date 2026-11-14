"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, Sparkles } from "lucide-react";

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
import { todayKey } from "@/app/data/streakFreeze";
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

      setState({ nudge, reminders, custom, bills });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "settingsUpdated",
      "languageUpdated",
      "remindersUpdated",
      "billsUpdated",
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

  // Day and custom reminders. Bills have their own row in the
  // money list, so they are not repeated here.
  const rows: { id: string; href?: string; text: string }[] = [
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

  const cta = state.nudge.cta;

  const action =
    cta === "quickAdd" ? (
      <button
        type="button"
        onClick={onQuickAdd}
        className="shrink-0 rounded-full bg-[var(--gold)] px-3.5 py-1.5 text-xs font-semibold text-[#1F1500] active:scale-95"
      >
        {ctaLabel.quickAdd}
      </button>
    ) : cta ? (
      <Link
        href={cta === "goals" ? "/goals" : "/reports"}
        className="flex shrink-0 items-center text-xs font-semibold text-[var(--primary)]"
      >
        {ctaLabel[cta]}
        <ChevronRight size={14} />
      </Link>
    ) : null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center gap-3 p-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold)]">
          <Sparkles size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] text-[var(--muted)]">
            {t("coachTitle")}
          </p>

          <p className="text-[14px] font-medium leading-5 text-[var(--foreground)]">
            {t(state.nudge.key, state.nudge.params)}
          </p>
        </div>

        {action}
      </div>

      {rows.map((row) => {
        const inner = (
          <>
            <Bell
              size={14}
              className="mt-0.5 shrink-0 text-[var(--gold)]"
            />

            <span className="text-[13px] leading-5 text-[var(--foreground)]">
              {row.text}
            </span>
          </>
        );

        const className =
          "flex items-start gap-2.5 border-t border-[var(--border)] px-3.5 py-2.5";

        return row.href ? (
          <Link key={row.id} href={row.href} className={className}>
            {inner}
          </Link>
        ) : (
          <div key={row.id} className={className}>
            {inner}
          </div>
        );
      })}
    </section>
  );
}
