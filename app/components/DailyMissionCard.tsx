"use client";

import { useState } from "react";
import { unlockAchievement } from "../data/achievements";

import {
  Flame,
  Trophy,
  CircleCheckBig,
} from "lucide-react";

import {
  addXP,
  getPlayer,
} from "../data/player";

import {
  getMission,
  completeMission,
} from "../data/missions";

export default function DailyMissionCard() {
  const mission = getMission();

const [completed, setCompleted] = useState(
  mission.completed
);

  const completeMission = () => {
    if (completed) return;

    addXP(mission.reward);

unlockAchievement(1);

completeMission();

    window.location.reload();
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-full bg-white/20 p-3">
          <Flame size={26} />
        </div>

        <div>

          <p className="text-sm opacity-90">
            Daily Mission
          </p>

          <h2 className="text-2xl font-bold">
            Today's Challenge
          </h2>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-white/15 p-5 backdrop-blur-sm">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <CircleCheckBig size={24} />

            <div>

              <p className="font-semibold">
                {mission.title}
              </p>

              <p className="text-sm opacity-80">
                Build consistency every day.
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="text-xs opacity-80">
              Reward
            </p>

            <p className="font-bold">
              +{mission.reward} XP
            </p>

          </div>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <div>

          <p className="text-sm opacity-80">
            Progress
          </p>

          <p className="font-semibold">
            {completed ? "1 / 1 Completed" : "0 / 1 Completed"}
          </p>

        </div>

        <div className="flex items-center gap-2">

          <Trophy size={20} />

          <span className="font-semibold">
            {getPlayer().streak} Day Streak
          </span>

        </div>

      </div>

      <button
        onClick={completeMission}
        disabled={completed}
        className={`mt-8 w-full rounded-2xl py-4 font-bold transition ${
          completed
            ? "bg-green-600"
            : "bg-white text-orange-600 hover:scale-[1.02]"
        }`}
      >
        {completed
          ? "✅ Mission Completed"
          : "Complete Mission"}
      </button>

    </div>
  );
}