"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import AddGoalModal from "@/app/components/AddGoalModal";
import EditGoalModal from "@/app/components/EditGoalModal";
import AddMoneyModal from "@/app/components/AddMoneyModal";
import WithdrawMoneyModal from "@/app/components/WithdrawMoneyModal";
import {
  GOAL_TERMS,
  deleteGoal,
  getGoals,
  monthsLeft,
  termOf,
  type Goal,
  type GoalTerm,
} from "@/app/data/goals";

const TEXT = {
  short: ["gtShort", "gtShortRange", "gtEmptyShort"],
  medium: ["gtMedium", "gtMediumRange", "gtEmptyMedium"],
  long: ["gtLong", "gtLongRange", "gtEmptyLong"],
} as const;

const percent = (saved: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

export default function GoalsPage() {
  const { t, language } = useLanguage();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<GoalTerm | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [adding, setAdding] = useState<Goal | null>(null);
  const [withdrawing, setWithdrawing] = useState<Goal | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [, bump] = useState(0);

  useEffect(() => {
    const refresh = () => setGoals(getGoals());
    const money = () => bump((v) => v + 1);

    refresh();

    window.addEventListener("goalsUpdated", refresh);
    window.addEventListener("currencyUpdated", money);
    window.addEventListener("languageUpdated", money);

    return () => {
      window.removeEventListener("goalsUpdated", refresh);
      window.removeEventListener("currencyUpdated", money);
      window.removeEventListener("languageUpdated", money);
    };
  }, []);

  const num = (value: number) =>
    value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");

  const byTerm = useMemo(() => {
    const map: Record<GoalTerm, Goal[]> = { short: [], medium: [], long: [] };

    goals.forEach((goal) => map[termOf(goal)].push(goal));

    // Nearest date first, goals without a date last.
    GOAL_TERMS.forEach((term) =>
      map[term].sort(
        (a, b) =>
          (a.targetDate ? new Date(a.targetDate).getTime() : Infinity) -
          (b.targetDate ? new Date(b.targetDate).getTime() : Infinity)
      )
    );

    return map;
  }, [goals]);

  // Open on the first part that has something in it.
  const active: GoalTerm =
    tab ?? GOAL_TERMS.find((term) => byTerm[term].length > 0) ?? "short";

  const list = byTerm[active];
  const target = list.reduce((sum, g) => sum + g.targetAmount, 0);
  const saved = list.reduce(
    (sum, g) => sum + Math.min(g.savedAmount, g.targetAmount),
    0
  );

  const timeText = (goal: Goal) => {
    const months = monthsLeft(goal.targetDate);

    if (months === null) return t("gtNoDate");
    if (months < 0) return t("gtPastDue");
    if (months === 0) return t("gtDueNow");

    return months >= 12
      ? `${num(Math.round((months / 12) * 10) / 10)} ${
          language === "bn" ? "বছর" : "yr"
        }`
      : t("gtMonthsLeft", { n: num(months) });
  };

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{t("goalsTitle")}</h1>
          <p className="text-sm text-[var(--muted)]">{t("goalsSubtitle")}</p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {t("addGoal")}
        </button>
      </header>

      {/* The three parts */}

      <div className="grid grid-cols-3 gap-2">
        {GOAL_TERMS.map((term) => {
          const items = byTerm[term];
          const on = term === active;

          return (
            <button
              key={term}
              type="button"
              onClick={() => setTab(term)}
              aria-pressed={on}
              className={`rounded-2xl border px-2 py-3 text-left transition ${
                on
                  ? "border-[var(--forest)] bg-[var(--forest)] text-[var(--on-forest)]"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <span className="block text-sm font-bold">
                {t(TEXT[term][0])}
              </span>

              <span
                className={`block text-[11px] ${
                  on ? "opacity-80" : "text-[var(--muted)]"
                }`}
              >
                {t(TEXT[term][1])}
              </span>

              <span className="mt-2 block text-xs font-semibold">
                {t("gtGoalsCount", { n: num(items.length) })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Totals for this part */}

      {list.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold">
              {t("gtTotalSaved", {
                saved: formatCurrency(saved),
                target: formatCurrency(target),
              })}
            </p>

            <p className="text-sm font-bold text-[var(--primary)]">
              {num(percent(saved, target))}%
            </p>
          </div>

          <div className="mt-2 h-2 rounded-full bg-[var(--border)]">
            <div
              className="h-2 rounded-full bg-[var(--primary)]"
              style={{ width: `${percent(saved, target)}%` }}
            />
          </div>
        </div>
      )}

      {/* Goals */}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <p className="text-sm text-[var(--muted)]">{t(TEXT[active][2])}</p>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-4 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white"
          >
            {t("gtAddHere")}
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((goal) => {
            const pct = percent(goal.savedAmount, goal.targetAmount);
            const done = goal.savedAmount >= goal.targetAmount;
            const left = Math.max(goal.targetAmount - goal.savedAmount, 0);
            const months = monthsLeft(goal.targetDate);
            const monthly =
              !done && months !== null && months > 0
                ? Math.ceil(left / months)
                : 0;

            return (
              <li
                key={goal.id}
                className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-2xl">
                    {goal.emoji}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{goal.title}</p>

                    <p className="text-xs text-[var(--muted)]">
                      {timeText(goal)}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-[var(--primary)]">
                    {done ? "✓" : `${num(pct)}%`}
                  </p>

                  <button
                    type="button"
                    aria-label={t("goalOptions")}
                    onClick={() =>
                      setMenuId(menuId === goal.id ? null : goal.id)
                    }
                    className="-mr-1 rounded-full p-1 text-[var(--muted)]"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                {menuId === goal.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuId(null)}
                    />

                    <div className="absolute right-3 top-12 z-20 w-40 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(goal);
                          setMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm"
                      >
                        <Pencil size={16} />
                        {t("editGoal")}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuId(null);

                          if (confirm(t("deleteGoalConfirm"))) {
                            deleteGoal(goal.id);
                          }
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600"
                      >
                        <Trash2 size={16} />
                        {t("deleteGoal")}
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-3 h-2 rounded-full bg-[var(--border)]">
                  <div
                    className="h-2 rounded-full bg-[var(--primary)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[var(--muted)]">
                  {t("savedOf", {
                    saved: formatCurrency(goal.savedAmount),
                    target: formatCurrency(goal.targetAmount),
                  })}
                </p>

                {monthly > 0 && (
                  <p className="mt-1 text-xs font-semibold text-[var(--foreground)]">
                    {t("gtPerMonth", { amount: formatCurrency(monthly) })}
                  </p>
                )}

                {done ? (
                  <p className="mt-3 text-xs font-semibold text-[var(--primary)]">
                    ✨ {t("goalReached")}
                  </p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdding(goal)}
                      className="flex-1 rounded-full bg-[var(--primary)] py-2 text-sm font-semibold text-white"
                    >
                      {t("addMoney")}
                    </button>

                    {goal.savedAmount > 0 && (
                      <button
                        type="button"
                        onClick={() => setWithdrawing(goal)}
                        className="flex-1 rounded-full border border-[var(--border)] py-2 text-sm font-semibold"
                      >
                        {t("withdrawMoney")}
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {active === "long" && (
        <Link
          href="/profile"
          className="block rounded-2xl bg-[var(--gold-soft)] px-4 py-3 text-sm font-semibold"
        >
          {t("gtLifeLink")}
        </Link>
      )}

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} />

      <EditGoalModal
        open={editing !== null}
        goal={editing}
        onClose={() => setEditing(null)}
      />

      <AddMoneyModal
        open={adding !== null}
        goal={adding}
        onClose={() => setAdding(null)}
      />

      <WithdrawMoneyModal
        open={withdrawing !== null}
        goal={withdrawing}
        onClose={() => setWithdrawing(null)}
      />
    </div>
  );
}
