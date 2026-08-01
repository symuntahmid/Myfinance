"use client";

import { Calendar, PiggyBank } from "lucide-react";

import type { Goal } from "@/app/data/goals";

type GoalCardProps = {
  goal: Goal;
  onAddMoney?: () => void;
};

export default function GoalCard({
  goal,
  onAddMoney,
}: GoalCardProps) {
  const progress =
    goal.targetAmount === 0
      ? 0
      : (goal.savedAmount / goal.targetAmount) * 100;

  const remaining =
    goal.targetAmount - goal.savedAmount;

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Top */}

      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-5xl">
              {goal.emoji ?? "🎯"}
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              {goal.title}
            </h2>

          </div>

          <div className="text-right">

            <p className="text-sm text-cyan-100">
              Progress
            </p>

            <h3 className="text-4xl font-bold">
              {progress.toFixed(0)}%
            </h3>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-6 p-6">

        {/* Progress */}

        <div>

          <div className="mb-2 flex justify-between text-sm">

            <span className="font-medium text-slate-500">
              Goal Progress
            </span>

            <span className="font-semibold text-cyan-600">
              {progress.toFixed(1)}%
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />

          </div>

        </div>

        {/* Numbers */}

        <div className="grid grid-cols-3 gap-4">

          <div>

            <p className="text-sm text-slate-500">
              Saved
            </p>

            <h3 className="mt-2 text-xl font-bold text-green-600">
              ${goal.savedAmount.toLocaleString()}
            </h3>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Goal
            </p>

            <h3 className="mt-2 text-xl font-bold">
              ${goal.targetAmount.toLocaleString()}
            </h3>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Remaining
            </p>

            <h3 className="mt-2 text-xl font-bold text-orange-500">
              ${remaining.toLocaleString()}
            </h3>

          </div>

        </div>

        {/* Date */}

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

          <Calendar
            size={20}
            className="text-cyan-600"
          />

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Target Date
            </p>

            <p className="font-semibold">
              {goal.targetDate}
            </p>

          </div>

        </div>

        {/* Button */}

        <button
          onClick={onAddMoney}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.02]"
        >

          <PiggyBank size={20} />

          Add Money

        </button>

      </div>

    </div>
  );
}