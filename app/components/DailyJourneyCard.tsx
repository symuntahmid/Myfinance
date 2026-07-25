"use client";

import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
} from "lucide-react";

import {
  getDailyTasks,
  getJourneyProgress,
  completeTask,
} from "../data/dailyJourney";

import { addXP } from "../data/player";

import { useState } from "react";

export default function DailyJourneyCard() {
  const [, forceUpdate] = useState(0);

  const tasks = getDailyTasks();

  const progress = getJourneyProgress();

  const finishTask = (id: number, reward: number) => {
    completeTask(id);

    addXP(reward);

    forceUpdate((n) => n + 1);
  };

  const updatedTasks = getDailyTasks();
  const updatedProgress = getJourneyProgress();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-full bg-white/20 p-3">
          <Flame size={26} />
        </div>

        <div>

          <p className="text-sm opacity-90">
            Daily Journey
          </p>

          <h2 className="text-3xl font-bold">
            Build Better Money Habits
          </h2>

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-3 flex justify-between">

          <span>
            Progress
          </span>

          <span className="font-semibold">
            {updatedProgress.completed}/{updatedProgress.total}
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/20">

          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${updatedProgress.percent}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {updatedTasks.map((task) => (

          <div
            key={task.id}
            className="flex items-center justify-between rounded-2xl bg-white/15 p-5 backdrop-blur-sm"
          >

            <div className="flex items-center gap-4">

              {task.completed ? (
                <CheckCircle2
                  className="text-green-300"
                  size={24}
                />
              ) : (
                <Circle size={24} />
              )}

              <div>

                <p className="font-semibold">
                  {task.title}
                </p>

                <p className="text-sm opacity-80">
                  +{task.reward} XP
                </p>

              </div>

            </div>

            {!task.completed && (
              <button
                onClick={() =>
                  finishTask(task.id, task.reward)
                }
                className="rounded-xl bg-white px-5 py-2 font-semibold text-orange-600 transition hover:scale-105"
              >
                Complete
              </button>
            )}

          </div>

        ))}

      </div>

      {updatedProgress.completed ===
        updatedProgress.total && (

        <div className="mt-8 rounded-2xl bg-white/20 p-5">

          <div className="flex items-center gap-3">

            <Trophy />

            <div>

              <h3 className="text-xl font-bold">
                Daily Journey Complete!
              </h3>

              <p>
                Tomorrow a new journey begins.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}