"use client";

import { unlockAchievement } from "../data/achievements";

import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
} from "lucide-react";

import {
  getDailyTasks,
  getJourneyProgress,
} from "../data/dailyJourney";

import { useEffect, useState } from "react";

export default function DailyJourneyCard() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const updateJourney = () => {
      const progress = getJourneyProgress();

      // Daily Hero achievement
      if (
        progress.total > 0 &&
        progress.completed >= progress.total
      ) {
        unlockAchievement(3);
      }

      forceUpdate((n) => n + 1);
    };

    // Update when a real financial action
    // completes a Daily Journey task.
    window.addEventListener(
      "dailyJourneyUpdated",
      updateJourney
    );

    // Also update when player data changes.
    window.addEventListener(
      "player-updated",
      updateJourney
    );

    // Update when transactions change.
    window.addEventListener(
      "transactionsUpdated",
      updateJourney
    );

    return () => {
      window.removeEventListener(
        "dailyJourneyUpdated",
        updateJourney
      );

      window.removeEventListener(
        "player-updated",
        updateJourney
      );

      window.removeEventListener(
        "transactionsUpdated",
        updateJourney
      );
    };
  }, []);

  const updatedTasks = getDailyTasks();
  const updatedProgress = getJourneyProgress();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-xl">

      {/* Header */}

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

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-3 flex justify-between">

          <span>
            Progress
          </span>

          <span className="font-semibold">
            {updatedProgress.completed}/
            {updatedProgress.total}
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

      {/* Tasks */}

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
                <Circle
                  className="text-white/70"
                  size={24}
                />
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

            {/* Status instead of manual Complete button */}

            {task.completed ? (

              <span className="rounded-xl bg-green-400/20 px-4 py-2 text-sm font-semibold text-green-100">
                ✓ Completed
              </span>

            ) : (

              <span className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white/70">
                Complete through activity
              </span>

            )}

          </div>

        ))}

      </div>

      {/* Completed */}

      {updatedProgress.completed ===
        updatedProgress.total &&
        updatedProgress.total > 0 && (

        <div className="mt-8 rounded-2xl bg-white/20 p-5">

          <div className="flex items-center gap-3">

            <Trophy />

            <div>

              <h3 className="text-xl font-bold">
                Daily Journey Complete!
              </h3>

              <p>
                Great job! You completed all
                today's money actions.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}