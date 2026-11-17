"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ChevronRight, Flame, Sparkles } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import DailyJourneyCard from "@/app/components/DailyJourneyCard";
import { buildCoach, type CoachTip } from "@/app/data/coach";
import { getGoals, type Goal } from "@/app/data/goals";
import { getBills, sortedStatuses, type BillStatus } from "@/app/data/bills";
import { getDailyTasks, type DailyTask } from "@/app/data/dailyJourney";

const TEXT = {
  en: {
    allGood: "You're on track today. Log each spend to keep it that way.",
    goal: "{p}% · {x} to go",
    add: "Add money",
    today: "today",
    overdue: "overdue",
    inDays: "in {n} days",
    tomorrow: "tomorrow",
    noBills: "Add rent or internet so you never miss a payment.",
    addReminder: "Add reminder",
    journey: "Today's journey",
    progress: "{a} of {b} done",
    xp: "+{n} XP to earn",
    allDone: "All done today",
  },
  bn: {
    allGood: "আজ আপনি ঠিক পথে আছেন। প্রতিটি খরচ লিখে রাখুন।",
    goal: "{p}% · আর {x}",
    add: "টাকা যোগ করুন",
    today: "আজ",
    overdue: "দেরি হয়েছে",
    inDays: "{n} দিন পরে",
    tomorrow: "কাল",
    noBills: "বাসা ভাড়া বা ইন্টারনেট যোগ করুন, কোনো পেমেন্ট মিস হবে না।",
    addReminder: "রিমাইন্ডার দিন",
    journey: "আজকের যাত্রা",
    progress: "{b} এর মধ্যে {a} শেষ",
    xp: "আরও +{n} XP পাবেন",
    allDone: "আজ সব শেষ",
  },
} as const;

const row = "flex items-center gap-3 px-3.5 py-3";
const icon =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--primary)]";

export default function HomeToday() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];
  const loc = lang === "bn" ? "bn-BD" : "en-US";
  const num = (n: number) => n.toLocaleString(loc);

  const [ready, setReady] = useState(false);
  const [tip, setTip] = useState<CoachTip | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [bill, setBill] = useState<BillStatus | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      const now = new Date();
      const coach = buildCoach(lang, now);

      // The payment and goal rows below already cover these, so skip them here.
      const rest = coach.tips.filter(
        (item) => !["billsSoon", "overdue", "goal"].includes(item.id)
      );

      setTip(rest.find((item) => item.tone === "warn") ?? rest[0] ?? null);

      const goals = getGoals()
        .filter((g) => g.targetAmount > 0 && g.savedAmount < g.targetAmount)
        .sort((a, b) => b.savedAmount / b.targetAmount - a.savedAmount / a.targetAmount);

      setGoal(goals[0] ?? null);

      setBill(
        sortedStatuses(getBills(), now).find((item) => item.state !== "paid") ?? null
      );

      setTasks(getDailyTasks());
      setReady(true);
    };

    load();

    const events = [
      "transactionsUpdated",
      "goalsUpdated",
      "billsUpdated",
      "accountsUpdated",
      "dailyJourneyUpdated",
      "languageUpdated",
      "currencyUpdated",
    ];

    events.forEach((e) => window.addEventListener(e, load));

    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, [lang]);

  if (!ready) return null;

  const done = tasks.filter((task) => task.completed).length;
  const xpLeft = tasks.filter((task) => !task.completed).reduce((sum, task) => sum + task.reward, 0);

  const when = (item: BillStatus) =>
    item.state === "overdue"
      ? x.overdue
      : item.state === "today"
      ? x.today
      : item.daysLeft === 1
      ? x.tomorrow
      : x.inDays.replace("{n}", num(item.daysLeft));

  return (
    <section className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      {/* 1. One coach line */}
      <Link href={tip ? tip.href : "/coach"} className={row}>
        <span className={icon}>
          <Sparkles size={18} />
        </span>

        <span className="min-w-0 flex-1 text-sm leading-snug">{tip ? tip.text : x.allGood}</span>

        {tip && (
          <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">{tip.cta}</span>
        )}
      </Link>

      {/* 2. Closest goal */}
      {goal && (
        <Link href="/goals" className={row}>
          <span className={`${icon} text-xl`}>{goal.emoji}</span>

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2 text-sm">
              <b className="truncate font-semibold">{goal.title}</b>
              <span className="shrink-0 text-xs text-[var(--muted)]">
                {x.goal
                  .replace("{p}", num(Math.floor((goal.savedAmount / goal.targetAmount) * 100)))
                  .replace("{x}", formatCurrency(goal.targetAmount - goal.savedAmount))}
              </span>
            </span>

            <span className="mt-1.5 block h-1.5 rounded-full bg-[var(--border)]">
              <span
                className="block h-1.5 rounded-full bg-[var(--primary)]"
                style={{ width: `${Math.round((goal.savedAmount / goal.targetAmount) * 100)}%` }}
              />
            </span>
          </span>

          <ChevronRight size={16} className="shrink-0 text-[var(--muted)]" />
        </Link>
      )}

      {/* 3. Next payment */}
      <Link href="/reminders" className={row}>
        <span className={icon}>
          <Bell size={18} />
        </span>

        {bill ? (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{bill.bill.name}</span>

            <span className="shrink-0 text-right text-xs">
              <b className="block text-sm font-semibold">{formatCurrency(bill.bill.amount)}</b>
              <span className={bill.state === "overdue" ? "text-red-600" : "text-[var(--muted)]"}>
                {when(bill)}
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1 text-sm text-[var(--muted)]">{x.noBills}</span>
            <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">{x.addReminder}</span>
          </>
        )}
      </Link>

      {/* 4. Daily journey, small until opened */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`${row} w-full text-left`}
      >
        <span className={icon}>
          <Flame size={18} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{x.journey}</span>
          <span className="block text-xs text-[var(--muted)]">
            {done === tasks.length && tasks.length > 0
              ? x.allDone
              : `${x.progress.replace("{a}", num(done)).replace("{b}", num(tasks.length))} · ${x.xp.replace("{n}", num(xpLeft))}`}
          </span>
        </span>

        <span className="flex shrink-0 gap-1">
          {tasks.map((task) => (
            <span
              key={task.id}
              className={`h-2 w-2 rounded-full ${task.completed ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
            />
          ))}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="p-3">
          <DailyJourneyCard />
        </div>
      )}
    </section>
  );
}
