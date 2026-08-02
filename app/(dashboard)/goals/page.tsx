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
import {
  getGoals,
  deleteGoal,
  Goal,
} from "@/app/data/goals";

export default function GoalsPage() {

  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
const [editGoalOpen, setEditGoalOpen] = useState(false);

const [selectedGoal, setSelectedGoal] =
  useState<Goal | null>(null);

  const [addMoneyOpen, setAddMoneyOpen] = useState(false);

const [moneyGoal, setMoneyGoal] =
  useState<Goal | null>(null);
const [withdrawGoal, setWithdrawGoal] =
  useState<Goal | null>(null);

const [withdrawOpen, setWithdrawOpen] =
  useState(false);

  useEffect(() => {
    function refreshGoals() {
      setGoals(getGoals());
    }

    refreshGoals();

    window.addEventListener("goalsUpdated", refreshGoals);

    return () => {
      window.removeEventListener(
        "goalsUpdated",
        refreshGoals
      );
    };
  }, []);

  return (
    <>
      <div className="space-y-8">

        {/* Hero */}

        {/* Hero */}

<div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 p-8 text-white shadow-xl">

  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

  <div className="flex items-start justify-between">

    <div>

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">

        <Target size={24} />

      </div>

      <h1 className="text-4xl font-bold">
        Financial Goals
      </h1>

      <p className="mt-4 max-w-xs text-sm leading-7 text-cyan-100">
        Every dollar you save today brings you
        one step closer to the life you truly
        want.
      </p>

    </div>

    <button
      onClick={() => setGoalModalOpen(true)}
      className="rounded-2xl bg-white px-5 py-4 text-sm font-bold text-cyan-700 shadow-lg transition hover:scale-105"
    >
      Add Goal
    </button>

  </div>

</div>

        {/* Summary */}

<div className="grid gap-4 md:grid-cols-4">

  <div className="rounded-3xl bg-white p-6 shadow-sm">

    <p className="text-sm text-slate-500">
      Active Goals
    </p>

    <div className="mt-3 flex items-center justify-between">

      <h2 className="text-4xl font-bold">
        {
          goals.filter(
            (g) =>
              g.savedAmount <
              g.targetAmount
          ).length
        }
      </h2>

      <div className="rounded-2xl bg-cyan-100 p-3">
        <Target
          className="text-cyan-600"
          size={22}
        />
      </div>

    </div>

  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">

    <p className="text-sm text-slate-500">
      Completed
    </p>

    <div className="mt-3 flex items-center justify-between">

      <h2 className="text-4xl font-bold">
        {
          goals.filter(
            (g) =>
              g.savedAmount >=
              g.targetAmount
          ).length
        }
      </h2>

      <div className="rounded-2xl bg-green-100 p-3 text-green-600">
        🏆
      </div>

    </div>

  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">

    <p className="text-sm text-slate-500">
      Saved
    </p>

    <div className="mt-3 flex items-center justify-between">

      <h2 className="text-3xl font-bold">
        $
        {goals
          .reduce(
            (sum, g) =>
              sum + g.savedAmount,
            0
          )
          .toLocaleString()}
      </h2>

      <div className="rounded-2xl bg-cyan-100 p-3">
        💰
      </div>

    </div>

  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">

    <p className="text-sm text-slate-500">
      Goal Completion
    </p>

    <h2 className="mt-3 text-3xl font-bold text-cyan-600">
      {goals.length === 0
        ? 0
        : Math.round(
            goals.reduce(
              (sum, g) =>
                sum +
                (g.savedAmount /
                  g.targetAmount) *
                  100,
              0
            ) / goals.length
          )}
      %
    </h2>

    <div className="mt-4 h-3 rounded-full bg-slate-200">

      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
        style={{
          width: `${
            goals.length === 0
              ? 0
              : Math.round(
                  goals.reduce(
                    (sum, g) =>
                      sum +
                      (g.savedAmount /
                        g.targetAmount) *
                        100,
                    0
                  ) / goals.length
                )
          }%`,
        }}
      />

    </div>

  </div>

</div>

{/* Empty */}

{goals.length === 0 ? (


          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

            <Target
              size={48}
              className="mx-auto text-cyan-500"
            />

            <h2 className="mt-6 text-3xl font-bold">
              No goals yet
            </h2>

            <p className="mt-3 text-slate-500">
              Create your first financial goal.
            </p>

            <button
              onClick={() => setGoalModalOpen(true)}
              className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white"
            >
              Create Goal
            </button>

          </div>

        ) : (

          <div className="grid gap-6 lg:grid-cols-2">

            {goals.map((goal) => (

              <div
                key={goal.id}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-700 p-7 text-white shadow-xl"
              >

                {/* 3 DOT MENU */}

                <div className="absolute right-5 top-5">

                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === goal.id
                          ? null
                          : goal.id
                      )
                    }
                    className="rounded-xl p-2 transition hover:bg-slate-100"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === goal.id && (

                    <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                      <button
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
  onClick={() => {
    if (!confirm("Delete this goal?")) return;

    deleteGoal(goal.id);

    setGoals(getGoals());

    setOpenMenuId(null);
  }}
  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
>
  <Trash2 size={18} />
  Delete Goal
</button>

                    </div>

                  )}

                </div>

                {/* Emoji */}

                <div className="flex items-center justify-between">

  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl backdrop-blur">

    {goal.emoji}

  </div>

  <div className="text-right">

    <p className="text-sm text-cyan-100">
      Progress
    </p>

    <h2 className="text-3xl font-bold">
      {Math.round(
        (goal.savedAmount /
          goal.targetAmount) *
          100
      )}
      %
    </h2>

  </div>

</div>

                {/* Title */}

                <h2 className="mt-6 text-3xl font-bold">
                  {goal.title}
                </h2>

                {/* Saved */}

                <p className="mt-3 text-cyan-100">
                  <p className="mt-3 text-cyan-100">
  Saved $
  {goal.savedAmount.toLocaleString()}
  {" "}of $
  {goal.targetAmount.toLocaleString()}
</p>

{goal.savedAmount >= goal.targetAmount && (
  <div className="mt-4 rounded-2xl bg-green-100 px-4 py-3 text-center font-semibold text-green-700">
    🎉 Goal Completed!
  </div>
)}
                </p>

                {/* Progress */}

                <div className="mt-4 h-3 rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${Math.min(
                        (goal.savedAmount /
                          goal.targetAmount) *
                          100,
                        100
                      )}%`,
                    }}
                  />


                </div>
                <div className="mt-6">

                  <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">

  <div>

    <p className="text-xs text-cyan-100">
      Saved
    </p>

    <h3 className="mt-1 font-bold text-green-300">
      ${goal.savedAmount.toLocaleString()}
    </h3>

  </div>

  <div>

    <p className="text-xs text-cyan-100">
      Goal
    </p>

    <h3 className="mt-1 font-bold">
      ${goal.targetAmount.toLocaleString()}
    </h3>

  </div>

  <div>

    <p className="text-xs text-cyan-100">
      Remaining
    </p>

    <h3 className="mt-1 font-bold text-orange-300">
      $
      {(
        goal.targetAmount -
        goal.savedAmount
      ).toLocaleString()}
    </h3>

  </div>

</div>
  <button
    onClick={() => {
      if (goal.savedAmount >= goal.targetAmount) return;

      setMoneyGoal(goal);
      setAddMoneyOpen(true);
    }}
    disabled={goal.savedAmount >= goal.targetAmount}
    className={`w-full rounded-2xl py-3 font-semibold text-white transition ${
      goal.savedAmount >= goal.targetAmount
        ? "cursor-not-allowed bg-green-600"
        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02]"
    }`}
  >
    {goal.savedAmount >= goal.targetAmount
      ? "✅ Completed"
      : "Add Money"}
  </button>

  <button
  onClick={() => {
    setWithdrawGoal(goal);
    setWithdrawOpen(true);
  }}
  className="mt-3 w-full rounded-2xl border border-red-500 py-3 font-semibold text-red-600 transition hover:bg-red-50"
>
  Withdraw Money
</button>
</div>

              </div>

            ))}
          

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