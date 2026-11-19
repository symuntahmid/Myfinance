"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  addGoal,
  getGoals,
  updateGoal,
  type Goal,
} from "@/app/data/goals";
import {
  LINES,
  OCCASION_META,
  daysUntil,
  expectedSaved,
  isoDay,
  monthlyNeed,
  monthsToSave,
  upcomingOccasions,
  type Occasion,
} from "@/app/data/occasions";

const KEY = "myfinance-occasions";

type Draft = Record<string, Record<string, string>>;

const NAME = OCCASION_META;

const TEXT = {
  en: {
    title: "Eid and festivals",
    sub: "Save a little each month so the big days never hurt.",
    days: "{n} days to go",
    today: "Today",
    about: "about",
    plan: "What do you want to spend?",
    total: "Total",
    each: "Put aside about {x} a month for {m} month(s)",
    start: "Start saving",
    update: "Update goal to {x}",
    saved: "{a} of {b} saved",
    onTrack: "On track",
    behind: "Behind by {x}",
    add: "Add money",
    note: "Festival dates are about. Eid, Puja and Purnima follow the moon, so the real day can differ by a day or two.",
    left: "{x} a month to finish",
  },
  bn: {
    title: "ঈদ ও উৎসব",
    sub: "প্রতি মাসে অল্প অল্প জমান, বড় দিনে যেন চাপ না পড়ে।",
    days: "আর {n} দিন",
    today: "আজ",
    about: "প্রায়",
    plan: "কত খরচ করতে চান?",
    total: "মোট",
    each: "{m} মাস ধরে মাসে প্রায় {x} আলাদা করে রাখুন",
    start: "জমানো শুরু করুন",
    update: "লক্ষ্য {x} করুন",
    saved: "{b} এর মধ্যে {a} জমেছে",
    onTrack: "ঠিক পথে",
    behind: "{x} পিছিয়ে",
    add: "টাকা যোগ করুন",
    note: "উৎসবের তারিখ আনুমানিক। ঈদ, পূজা ও পূর্ণিমা চাঁদের ওপর নির্ভর করে, তাই আসল দিন এক-দুই দিন বদলাতে পারে।",
    left: "শেষ করতে মাসে {x}",
  },
} as const;

function readDraft(): Draft {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Draft;
  } catch {
    return {};
  }
}

const field =
  "w-24 rounded-xl border border-[var(--border)] bg-[var(--background)] px-2 py-2 text-right text-base font-semibold outline-none focus:border-[var(--primary)]";

export default function OccasionsPage() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      setDraft(readDraft());
      setGoals(getGoals());
      setReady(true);
    };

    load();

    const refresh = () => setGoals(getGoals());

    window.addEventListener("goalsUpdated", refresh);
    window.addEventListener("currencyUpdated", refresh);

    return () => {
      window.removeEventListener("goalsUpdated", refresh);
      window.removeEventListener("currencyUpdated", refresh);
    };
  }, []);

  if (!ready) return null;

  const occasions = upcomingOccasions();
  const current = open ?? occasions[0]?.id ?? null;

  const setLine = (id: string, line: string, value: string) => {
    const next: Draft = {
      ...draft,
      [id]: { ...(draft[id] ?? {}), [line]: value.replace(/[^\d.]/g, "") },
    };

    setDraft(next);

    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* fine */
    }
  };

  const dateText = (item: Occasion) =>
    item.date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const num = (value: number) =>
    value.toLocaleString(lang === "bn" ? "bn-BD" : "en-US");

  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      <ul className="space-y-3">
        {occasions.map((item) => {
          const meta = NAME[item.kind];
          const lines = LINES[item.kind];
          const values = draft[item.id] ?? {};
          const total = lines.reduce((sum, line) => sum + (Number(values[line.id]) || 0), 0);
          const goal = goals.find((g) => g.occasion === item.id);
          const days = daysUntil(item.date);
          const months = monthsToSave(item.date);
          const expanded = current === item.id;
          const islamic = item.kind !== "boishakh" && item.kind !== "christmas";

          const target = goal ? goal.targetAmount : total;
          const saved = goal ? goal.savedAmount : 0;
          const behind = goal
            ? expectedSaved(goal.targetAmount, goal.createdAt, item.date) - goal.savedAmount
            : 0;

          const start = () => {
            if (total <= 0) return;

            addGoal({
              id: `${item.id}-${Date.now()}`,
              title: `${meta[lang]} ${item.year}`,
              emoji: meta.emoji,
              targetAmount: total,
              savedAmount: 0,
              targetDate: isoDay(item.date),
              createdAt: new Date().toISOString(),
              term: months <= 12 ? "short" : "medium",
              occasion: item.id,
            });
          };

          return (
            <li key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <button
                type="button"
                onClick={() => setOpen(expanded ? "" : item.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-2xl">
                  {meta.emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{meta[lang]}</span>
                  <span className="block text-xs text-[var(--muted)]">
                    {islamic ? `${x.about} ` : ""}
                    {dateText(item)}
                  </span>
                </span>

                <span className="shrink-0 rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs font-semibold">
                  {days <= 0 ? x.today : x.days.replace("{n}", num(days))}
                </span>
              </button>

              {expanded && (
                <div className="border-t border-[var(--border)] p-4">
                  {goal && (
                    <div className="mb-4">
                      <div className="flex items-baseline justify-between text-sm font-semibold">
                        <span>
                          {x.saved
                            .replace("{a}", formatCurrency(saved))
                            .replace("{b}", formatCurrency(target))}
                        </span>

                        <span
                          className={`text-xs ${behind > 0 ? "text-[var(--sun)]" : "text-[var(--success)]"}`}
                        >
                          {behind > 0
                            ? x.behind.replace("{x}", formatCurrency(behind))
                            : x.onTrack}
                        </span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-[var(--border)]">
                        <div
                          className="h-2 rounded-full bg-[var(--primary)]"
                          style={{ width: `${Math.min(100, Math.round((saved / Math.max(target, 1)) * 100))}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {x.left.replace("{x}", formatCurrency(monthlyNeed(target, saved, months)))}
                      </p>

                      <Link
                        href="/goals"
                        className="mt-3 inline-block rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white"
                      >
                        {x.add}
                      </Link>
                    </div>
                  )}

                  <p className="mb-2 text-sm font-bold">{x.plan}</p>

                  <ul className="space-y-2">
                    {lines.map((line) => (
                      <li key={line.id} className="flex items-center justify-between gap-3">
                        <span className="text-sm">
                          {line.emoji} {line[lang]}
                        </span>

                        <input
                          inputMode="decimal"
                          value={values[line.id] ?? ""}
                          onChange={(e) => setLine(item.id, line.id, e.target.value)}
                          placeholder="0"
                          aria-label={line[lang]}
                          className={field}
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm font-bold">
                    <span>{x.total}</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {!goal && total > 0 && (
                    <p className="mt-2 text-sm">
                      {x.each
                        .replace("{x}", formatCurrency(monthlyNeed(total, 0, months)))
                        .replace("{m}", num(months))}
                    </p>
                  )}

                  {!goal && (
                    <button
                      type="button"
                      onClick={start}
                      disabled={total <= 0}
                      className="mt-3 w-full rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white disabled:opacity-40"
                    >
                      {x.start}
                    </button>
                  )}

                  {goal && total > 0 && total !== goal.targetAmount && (
                    <button
                      type="button"
                      onClick={() => updateGoal({ ...goal, targetAmount: total })}
                      className="mt-3 w-full rounded-full border border-[var(--border)] py-2.5 text-sm font-semibold"
                    >
                      {x.update.replace("{x}", formatCurrency(total))}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-[var(--muted)]">{x.note}</p>
    </div>
  );
}
