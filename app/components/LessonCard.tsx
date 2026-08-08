"use client";

import { useState } from "react";
import {
  Flame,
  Heart,
  Target,
  Zap,
  Gift,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LessonCard() {
  const [completed, setCompleted] = useState(false);

  const streak = 12;
  const energy = 5;
  const maxEnergy = 5;

  const dailyActions = [
    {
      id: 1,
      title: "Track one expense",
      description: "Add any expense from today.",
      xp: 10,
    },
    {
      id: 2,
      title: "Review your spending",
      description: "Take a quick look at where your money went.",
      xp: 10,
    },
    {
      id: 3,
      title: "Make one better decision",
      description: "Save, avoid, transfer, or plan one small amount.",
      xp: 15,
    },
  ];

  const totalXP = dailyActions.reduce(
    (total, action) => total + action.xp,
    0
  );

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
            Small financial actions today can create a completely different
            future.
          </p>

        </div>

        {/* Streak */}

        <div className="rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur">

          <Flame
            className="mx-auto text-orange-300"
            size={28}
          />

          <p className="mt-1 text-3xl font-bold">
            {streak}
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

          {Array.from({ length: maxEnergy }).map((_, index) => (

            <div
              key={index}
              className={`h-3 flex-1 rounded-full ${
                index < energy
                  ? "bg-pink-300"
                  : "bg-white/20"
              }`}
            />

          ))}

        </div>

      </div>

      {/* Today's Actions */}

      <div className="mt-8">

        <div className="flex items-center gap-3">

          <Target size={24} />

          <h3 className="text-2xl font-bold">
            Today's 3 Actions
          </h3>

        </div>

        <p className="mt-1 text-white/70">
          You don't need to be perfect. Just make one small improvement today.
        </p>

        <div className="mt-5 space-y-3">

          {dailyActions.map((action) => (

            <button
              key={action.id}
              onClick={() => setCompleted(true)}
              className="group flex w-full items-center gap-4 rounded-2xl bg-white/10 p-5 text-left transition hover:bg-white/20"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">

                {completed ? (
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
                  {action.title}
                </p>

                <p className="mt-1 text-sm text-white/60">
                  {action.description}
                </p>

              </div>

              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                +{action.xp} XP
              </span>

            </button>

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
              +{totalXP} XP
            </p>

          </div>

        </div>

        <button
          disabled={!completed}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition ${
            completed
              ? "bg-indigo-600 text-white hover:scale-[1.02] hover:bg-indigo-700"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {completed
            ? "🎁 Claim Today's Reward"
            : "🔒 Complete an action first"}

          {completed && <ArrowRight size={18} />}

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
              Money Apprentice
            </h3>

          </div>

          <div className="text-right">

            <p className="text-sm text-white/60">
              420 / 500 XP
            </p>

            <p className="font-bold">
              80%
            </p>

          </div>

        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">

          <div
            className="h-full rounded-full bg-white"
            style={{ width: "80%" }}
          />

        </div>

        <p className="mt-3 text-sm text-white/60">
          80 XP until your next level: Money Planner
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