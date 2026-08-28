"use client";
import AddMoneyModal from "@/app/components/AddMoneyModal";
import EditGoalModal from "@/app/components/EditGoalModal";
import WithdrawMoneyModal from "@/app/components/WithdrawMoneyModal";
import { useEffect, useState } from "react";
import {
  Plus,
  Target,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import AddGoalModal from "@/app/components/AddGoalModal";
import { formatCurrency } from "@/app/utils/currency";

import {
  getGoals,
  deleteGoal,
  Goal,
} from "@/app/data/goals";

// A target of 0 would otherwise produce NaN/Infinity in every percentage
// calculation below — this keeps those cases safely at 0%.
function getProgressPercent(saved: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.min(100, (saved / target) * 100);
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [moneyGoal, setMoneyGoal] = useState<Goal | null>(null);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawGoal, setWithdrawGoal] = useState<Goal | null>(null);

  const [, forceCurrencyUpdate] = useState(0);

  useEffect(() => {
  function refreshGoals() {
    setGoals(getGoals());
  }

  function refreshCurrency() {
    forceCurrencyUpdate(
      value => value + 1
    );
  }

  refreshGoals();

  window.addEventListener(
    "goalsUpdated",
    refreshGoals
  );

  window.addEventListener(
    "currencyUpdated",
    refreshCurrency
  );

  return () => {
    window.removeEventListener(
      "goalsUpdated",
      refreshGoals
    );

    window.removeEventListener(
      "currencyUpdated",
      refreshCurrency
    );
  };

}, []);

  const activeGoalsCount = goals.filter(
    (g) => g.savedAmount < g.targetAmount
  ).length;

  const completedGoalsCount = goals.filter(
    (g) => g.savedAmount >= g.targetAmount
  ).length;

  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  const averageCompletion =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce(
            (sum, g) => sum + getProgressPercent(g.savedAmount, g.targetAmount),
            0
          ) / goals.length
        );

  return (
    <>
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 p-8 text-white shadow-xl">
          {/* Decorative only — pointer-events-none keeps it from
              intercepting clicks meant for the content below it. */}
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="flex items-start justify-between">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Target size={24} />
              </div>

  <h1
className="
font-display
text-5xl
font-medium
tracking-[-0.05em]
md:text-6xl
"
>
Financial Goals
</h1>

<p
className="
mt-4
max-w-md
font-body
text-sm
leading-relaxed
tracking-tight
text-cyan-100
"
>
                Every dollar you save today brings you one step closer to
                the life you truly want.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setGoalModalOpen(true)}
              className="relative z-10 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-cyan-700 shadow-lg transition hover:scale-105"
            >
              Add Goal
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm">
           <p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-[var(--muted)]
"
>
Active Goals
</p>

            <div className="mt-3 flex items-center justify-between">
              <h2
className="
mt-3
font-display
text-4xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>{activeGoalsCount}</h2>

              <div className="rounded-2xl bg-cyan-100 p-3">
                <Target className="text-cyan-600" size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm">
            <p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-[var(--muted)]
"
>
Completed</p>

            <div className="mt-3 flex items-center justify-between">
              <h2
className="
mt-3
font-display
text-4xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>{completedGoalsCount}</h2>

              <div className="rounded-2xl bg-green-100 p-3 text-green-600">
                🏆
              </div>
            </div>
          </div>

          <div className="
rounded-3xl
bg-[var(--card)]
border border-[var(--border)]
p-6
shadow-sm
">

  <p className="
  text-sm
  text-[var(--muted)]
  ">
    Saved
  </p>

  <div className="
  mt-3
  flex
  items-center
  justify-between
  ">

    <h2 className="
    text-3xl
    font-bold
    text-[var(--foreground)]
    ">
      {formatCurrency(totalSaved)}
    </h2>

    <div className="
    rounded-2xl
    bg-cyan-100
    p-3
    ">
      💰
    </div>

  </div>

</div>

          <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Goal Completion</p>

            <h2 className="mt-3 text-3xl font-bold text-cyan-600">
              {averageCompletion}%
            </h2>

            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                style={{ width: `${averageCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Empty */}
        {goals.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <Target size={48} className="mx-auto text-cyan-500" />

            <h2 className="mt-6 text-3xl font-bold">No goals yet</h2>

            <p className="mt-3 text-slate-500">
              Create your first financial goal.
            </p>

            <button
              type="button"
              onClick={() => setGoalModalOpen(true)}
              className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div
className="
grid
gap-6
md:grid-cols-2
"
>
            {goals.map((goal) => {
              const progressPercent = getProgressPercent(
                goal.savedAmount,
                goal.targetAmount
              );
              const isCompleted = goal.savedAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#06b6d4_0%,#0ea5e9_45%,#2563eb_78%,#4f46e5_100%)] p-6
sm:p-8 text-white shadow-[0_20px_45px_rgba(37,99,235,.28)]"
                >
                  {/* Lighting effect */}
                  <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />

                  {/* Emoji */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/25 backdrop-blur-md border border-white/30 shadow-lg text-4xl">
                      {goal.emoji}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* 3 DOT MENU */}
                      <div className="relative z-10">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === goal.id ? null : goal.id
                            )
                          }
                          aria-label="Goal options"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenuId === goal.id && (
                          <>
                            {/* Invisible overlay so clicking anywhere else
                                closes the menu. */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />

<div
className="
absolute
right-0
z-20
mt-2
w-40
sm:w-44
"
>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedGoal(goal);
                                  setEditGoalOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                              >
                                <Pencil size={18} />
                                Edit Goal
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (!confirm("Delete this goal?")) return;
                                  deleteGoal(goal.id);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={18} />
                                Delete Goal
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="text-right">
 <p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-cyan-100/80
"
>
Progress
</p>
<h2
className="
font-display
text-5xl
font-medium
tracking-[-0.05em]
"
>
                          {Math.round(progressPercent)}%
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2
className="
mt-6
font-display
text-4xl
font-medium
tracking-[-0.04em]
"
>{goal.title}</h2>

                  {/* Saved */}
                  <div className="mt-3 text-cyan-100">
                    <p className="mt-3 text-base text-cyan-100">
                      <span className="font-semibold">
                        {formatCurrency(goal.savedAmount)}
                      </span>

                      {" "}saved of{" "}

                      <span className="font-semibold">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </p>

                    {isCompleted && (
                      <div className="mt-5 inline-flex items-center rounded-full bg-green-400/20 px-5 py-2 text-sm font-semibold text-green-100 border border-green-300/20">
                        ✨ Goal Completed
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mt-6 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,.8)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="mt-8 grid grid-cols-3 gap-4 rounded-3xl bg-white/14 border border-white/15 p-4 backdrop-blur">
                      <div>
  <p className="text-xs text-cyan-100">
    Saved
  </p>

  <h3 className="mt-1 font-bold text-green-300">
    {formatCurrency(goal.savedAmount)}
  </h3>
</div>

<div>
  <p className="text-xs text-cyan-100">
    Goal
  </p>

  <h3 className="mt-1 font-bold">
    {formatCurrency(goal.targetAmount)}
  </h3>
</div>

                      <div>
                        <p className="text-xs text-cyan-100">Remaining</p>
                        <h3 className="mt-1 font-bold text-orange-300">
                          {formatCurrency(
  Math.max(
    goal.targetAmount - goal.savedAmount,
    0
  )
)}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) return;
                        setMoneyGoal(goal);
                        setAddMoneyOpen(true);
                      }}
                      disabled={isCompleted}
                      className={`mt-6 w-full rounded-2xl py-4 font-bold shadow-lg transition ${
                        isCompleted
                          ? "cursor-not-allowed bg-green-600 text-white"
                          : "bg-white text-blue-700 hover:scale-[1.02]"
                      }`}
                    >
                      {isCompleted ? "✅ Completed" : "💰 Add Money"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawGoal(goal);
                        setWithdrawOpen(true);
                      }}
                      disabled={goal.savedAmount <= 0}
                      className={`mt-4 w-full rounded-2xl border py-4 font-bold backdrop-blur transition ${
                        goal.savedAmount <= 0
                          ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                          : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      Withdraw Money
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddGoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
      />
      <EditGoalModal
        open={editGoalOpen}
        goal={selectedGoal}
        onClose={() => {
          setEditGoalOpen(false);
          setSelectedGoal(null);
        }}
      />
      <AddMoneyModal
        open={addMoneyOpen}
        goal={moneyGoal}
        onClose={() => {
          setAddMoneyOpen(false);
          setMoneyGoal(null);
        }}
      />
      <WithdrawMoneyModal
        open={withdrawOpen}
        goal={withdrawGoal}
        onClose={() => {
          setWithdrawOpen(false);
          setWithdrawGoal(null);
        }}
      />
    </>
  );
}