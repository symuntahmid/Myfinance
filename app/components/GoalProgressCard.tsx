"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Goal,
  getGoals,
} from "@/app/data/goals";

export default function GoalProgressCard() {
  const [goal, setGoal] =
    useState<Goal | null>(null);

  useEffect(() => {
    function refresh() {
      const goals = getGoals();

      const activeGoal =
        goals.find((g) => !g.completed) ??
        null;

      setGoal(activeGoal);
    }

    refresh();

    window.addEventListener(
      "goalsUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "goalsUpdated",
        refresh
      );
    };
  }, []);

  if (!goal) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-3">
            <Target className="text-cyan-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Goal Progress
            </h2>

            <p className="text-slate-500">
              No goals created yet.
            </p>
          </div>
        </div>

        <Link
          href="/goals"
          className="mt-6 inline-block rounded-2xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          + Add Goal
        </Link>
      </div>
    );
  }

  const progress =
    goal.targetAmount === 0
      ? 0
      : (goal.savedAmount /
          goal.targetAmount) *
        100;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Goal Progress
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {goal.icon} {goal.title}
          </h2>
        </div>

        <Target
          className="text-cyan-600"
          size={32}
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-semibold">
          <span>
            $
            {goal.savedAmount.toLocaleString()}
          </span>

          <span>
            $
            {goal.targetAmount.toLocaleString()}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                progress,
                100
              )}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-bold text-cyan-600">
            {progress.toFixed(0)}%
          </p>

          <Link
            href="/goals"
            className="font-semibold text-cyan-600 hover:underline"
          >
            View Goals →
          </Link>
        </div>
      </div>
    </div>
  );
}