"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trophy, Wallet } from "lucide-react";

import AddGoalModal from "@/app/components/AddGoalModal";
import GoalCard from "@/app/components/GoalCard";
import { getGoals, Goal } from "@/app/data/goals";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  useEffect(() => {
    const refreshGoals = () => {
      setGoals(getGoals());
    };

    refreshGoals();

    window.addEventListener("goalsUpdated", refreshGoals);

    return () => {
      window.removeEventListener(
        "goalsUpdated",
        refreshGoals
      );
    };
  }, []);

  const activeGoals = goals.filter(
    (goal) => goal.savedAmount < goal.targetAmount
  );

  const completedGoals = goals.filter(
    (goal) => goal.savedAmount >= goal.targetAmount
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.savedAmount,
    0
  );

  const totalTarget = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const completion =
    totalTarget === 0
      ? 0
      : (totalSaved / totalTarget) * 100;

  return (
    <>
      <div className="space-y-8">

        {/* HERO */}

        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 p-10 text-white shadow-xl">
          <div className="flex items-start justify-between">

            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Target size={30} />
              </div>

              <h1 className="text-4xl font-bold">
                Financial Goals
              </h1>

              <p className="mt-4 max-w-xl text-lg text-cyan-100">
                Every dollar you save today brings you one step closer to the
                life you truly want.
              </p>
            </div>

            <button
              onClick={() => setGoalModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-cyan-700 transition hover:scale-105"
            >
              <Plus size={18} />
              Add Goal
            </button>

          </div>
        </div>

        {/* STATS */}

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Active Goals
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {activeGoals.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-cyan-100 p-3">
                <Target className="text-cyan-600" />
              </div>

            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {completedGoals.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-green-100 p-3">
                <Trophy className="text-green-600" />
              </div>

            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Saved
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ${totalSaved.toLocaleString()}
                </h2>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3">
                <Wallet className="text-emerald-600" />
              </div>

            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div>
              <p className="text-sm text-slate-500">
                Goal Completion
              </p>

              <h2 className="mt-2 text-3xl font-bold text-cyan-600">
                {completion.toFixed(0)}%
              </h2>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
                style={{
                  width: `${Math.min(completion, 100)}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* GOALS */}

        {goals.length === 0 ? (

          <div className="rounded-[32px] bg-white p-16 text-center shadow-sm">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100">
              <Target
                size={42}
                className="text-cyan-600"
              />
            </div>

            <h2 className="mt-8 text-3xl font-bold">
              Your first goal starts here
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-lg text-slate-500">
              Whether it's a Japan trip, buying your dream home,
              building an emergency fund, or retiring early—
              create a goal and start tracking your progress.
            </p>

            <button
              onClick={() => setGoalModalOpen(true)}
              className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:scale-105"
            >
              Create Your First Goal
            </button>

          </div>

        ) : (

          <div className="grid gap-6 lg:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
              />
            ))}
          </div>

        )}

      </div>

      <AddGoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
      />
    </>
  );
}