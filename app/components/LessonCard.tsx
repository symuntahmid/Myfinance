"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  Heart,
  Target,
  Gift,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  getDailyTasks,
  completeTask,
  getJourneyProgress,
} from "@/app/data/dailyJourney";

import {
  getPlayer,
  getLevel,
  addXP,
} from "@/app/data/player";

export default function LessonCard() {
  const [tasks, setTasks] = useState(getDailyTasks());
  const [player, setPlayer] = useState(getPlayer());
  const [rewardClaimed, setRewardClaimed] = useState(false);

  function refresh() {
    setTasks(getDailyTasks());
    setPlayer(getPlayer());
  }

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener("player-updated", handleUpdate);

    return () => {
      window.removeEventListener(
        "player-updated",
        handleUpdate
      );
    };
  }, []);

  function handleCompleteTask(id: number, reward: number) {
    const task = tasks.find((task) => task.id === id);

    if (!task || task.completed) return;

    completeTask(id);

    addXP(reward);

    refresh();
  }

  function claimDailyReward() {
    const progress = getJourneyProgress();

    if (
      progress.completed !== progress.total ||
      rewardClaimed
    ) {
      return;
    }

    setRewardClaimed(true);

    // Small completion bonus
    addXP(10);

    refresh();
  }

  const progress = getJourneyProgress();
  const level = getLevel();

  const energy = 5;
  const maxEnergy = 5;

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-2xl">

      {/* Header */}

      <div className="flex flex-wrap items-start justify-between gap-6">

        <div>

          <p className="text-sm uppercase tracking-[0.25em] text-white/70">
            Your Financial Journey
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Build better money habits.
          </h2>

          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Small financial actions today can create a completely
            different future.
          </p>

        </div>

        {/* Streak */}

        <div className="rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur">

          <Flame
            className="mx-auto text-orange-300"
            size={28}
          />

          <p className="mt-1 text-3xl font-bold">
            {player.streak}
          </p>

          <p className="text-sm text-white/70">
            Day Streak
          </p>

        </div>

      </div>

      {/* Energy */}

      <div className="mt-8 rounded-2xl bg-black/10 p-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Heart
              size={20}
              className="fill-pink-300 text-pink-300"
            />

            <span className="font-semibold">
              Energy
            </span>

          </div>

          <span className="text-sm text-white/70">
            {energy}/{maxEnergy}
          </span>

        </div>

        <div className="mt-3 flex gap-2">

          {Array.from({ length: maxEnergy }).map(
            (_, index) => (

              <div
                key={index}
                className={`h-3 flex-1 rounded-full ${
                  index < energy
                    ? "bg-pink-300"
                    : "bg-white/20"
                }`}
              />

            )
          )}

        </div>

      </div>

      {/* Daily Missions */}

      <div className="mt-8">

        <div className="flex items-center gap-3">

          <Target size={24} />

          <h3 className="text-2xl font-bold">
            Today's 3 Actions
          </h3>

        </div>

        <p className="mt-1 text-white/70">
          Make one small improvement to your financial life today.
        </p>

        <div className="mt-5 space-y-3">

          {tasks.map((task) => (

            <div
              key={task.id}
              className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
            >

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  task.completed
                    ? "bg-green-400/20"
                    : "bg-white/15"
                }`}
              >

                {task.completed ? (
                  <CheckCircle2
                    size={22}
                    className="text-green-300"
                  />
                ) : (
                  <Target size={20} />
                )}

              </div>

              <div className="flex-1">

                <p className="font-bold">
                  {task.title}
                </p>

                <p className="mt-1 text-sm text-white/60">
                  {task.completed
                    ? "Completed today ✓"
                    : "Complete this small action today."}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                  +{task.reward} XP
                </span>

                {!task.completed && (

                  <button
                    onClick={() =>
                      handleCompleteTask(
                        task.id,
                        task.reward
                      )
                    }
                    className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700 transition hover:scale-105 hover:bg-indigo-50"
                  >
                    Complete
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Daily Reward */}

      <div className="mt-8 rounded-2xl bg-white p-6 text-slate-900">

        <div className="flex items-center gap-3">

          <Gift className="text-indigo-600" />

          <div>

            <p className="text-sm font-semibold text-slate-500">
              TODAY'S REWARD
            </p>

            <p className="text-2xl font-bold">
              {progress.completed === progress.total
                ? "+10 XP Bonus"
                : "Complete all 3 actions"}
            </p>

          </div>

        </div>

        <button
          onClick={claimDailyReward}
          disabled={
            progress.completed !== progress.total ||
            rewardClaimed
          }
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition ${
            progress.completed === progress.total &&
            !rewardClaimed
              ? "bg-indigo-600 text-white hover:scale-[1.02] hover:bg-indigo-700"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {rewardClaimed
            ? "✅ Reward Claimed"
            : progress.completed === progress.total
              ? "🎁 Claim Today's Reward"
              : `🔒 ${progress.completed}/3 Actions Complete`}

          {progress.completed === progress.total &&
            !rewardClaimed && (
              <ArrowRight size={18} />
            )}

        </button>

      </div>

      {/* Level Progress */}

      <div className="mt-8 rounded-2xl bg-black/10 p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-white/60">
              CURRENT LEVEL
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              Level {level.level}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-sm text-white/60">
              {level.currentXP} / {level.nextLevelXP} XP
            </p>

            <p className="font-bold">
              {level.percent}%
            </p>

          </div>

        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">

          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${level.percent}%`,
            }}
          />

        </div>

        <p className="mt-3 text-sm text-white/60">
          {level.nextLevelXP - level.currentXP} XP until your next level.
        </p>

      </div>

      {/* Come Back */}

      <div className="mt-8 text-center">

        <p className="text-lg font-bold">
          🔥 Keep your financial streak alive.
        </p>

        <p className="mt-1 text-sm text-white/60">
          Come back tomorrow and make another small improvement.
        </p>

      </div>

    </div>
  );
}