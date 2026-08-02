"use client";
import AddMoneyModal from "@/app/components/AddMoneyModal";
import EditGoalModal from "@/app/components/EditGoalModal";
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

        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-600 p-10 text-white">
          <div className="flex items-center justify-between">

            <div>
              <Target size={36} />

              <h1 className="mt-4 text-4xl font-bold">
                Financial Goals
              </h1>

              <p className="mt-3 text-cyan-100">
                Build your future one goal at a time.
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
                className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
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

                <div className="text-5xl">
                  {goal.emoji}
                </div>

                {/* Title */}

                <h2 className="mt-4 text-2xl font-bold">
                  {goal.title}
                </h2>

                {/* Saved */}

                <p className="mt-4 text-slate-500">
                  Saved $
                  {goal.savedAmount.toLocaleString()}
                  {" "}of $
                  {goal.targetAmount.toLocaleString()}
                </p>

                {/* Progress */}

                <div className="mt-4 h-3 rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-cyan-500"
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
  <button
    onClick={() => {
      setMoneyGoal(goal);
      setAddMoneyOpen(true);
    }}
    className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02]"
  >
    Add Money
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
    </>
  );
}