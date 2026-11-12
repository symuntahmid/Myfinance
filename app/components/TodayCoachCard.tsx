"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { getSettings } from "@/app/data/settings";
import { getTransactions } from "@/app/data/transactions";
import {
  getCustomReminders,
  getDueReminders,
  type DueReminder,
} from "@/app/data/customReminders";
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

      setState({ nudge, reminders, custom });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "settingsUpdated",
      "languageUpdated",
      "remindersUpdated",
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

  const renderCta = (cta?: CoachCta) => {
    if (!cta) return null;

    const className =
      "mt-2 inline-block rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white";

    if (cta === "quickAdd") {
      return (
        <button
          type="button"
          onClick={onQuickAdd}
          className={className}
        >
          {ctaLabel[cta]}
        </button>
      );
    }

    return (
      <Link
        href={cta === "goals" ? "/goals" : "/reports"}
        className={className}
      >
        {ctaLabel[cta]}
      </Link>
    );
  };

  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--foreground)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
        <Sparkles size={16} />
        {t("coachTitle")}
      </div>

      {state.reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="mt-3 flex items-start gap-3 rounded-2xl bg-amber-500/10 p-3"
        >
          <Bell size={18} className="mt-0.5 shrink-0 text-amber-500" />

          <div>
            <p className="text-sm">
              {t(reminder.key, reminder.params)}
            </p>
            {renderCta(reminder.cta)}
          </div>
        </div>
      ))}

      {state.custom.map((item) => (
        <div
          key={item.id}
          className="mt-3 flex items-start gap-3 rounded-2xl bg-amber-500/10 p-3"
        >
          <Bell size={18} className="mt-0.5 shrink-0 text-amber-500" />

          <p className="text-sm">
            {item.daysLeft === 0
              ? t("reminderDueToday", { title: item.title })
              : item.daysLeft === 1
              ? t("reminderDueTomorrow", { title: item.title })
              : t("reminderDueInDays", {
                  days: item.daysLeft,
                  title: item.title,
                })}
          </p>
        </div>
      ))}

      <div className="mt-3">
        <p className="text-sm leading-6">
          {t(state.nudge.key, state.nudge.params)}
        </p>
        {renderCta(state.nudge.cta)}
      </div>
    </section>
  );
}
