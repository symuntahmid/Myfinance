"use client";

import {
  Flame,
  Trophy,
  Star,
  User,
  Coins,
} from "lucide-react";

import { getPlayer } from "../data/player";

export default function ProfileCard() {
  const player = getPlayer();

  const nextLevelXP = player.level * 100;

  const progress = Math.min(
    (player.xp / nextLevelXP) * 100,
    100
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl min-h-[330px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">

          <User size={30} />

        </div>

        <div>

          <h2 className="text-2xl font-bold">
            {player.name}
          </h2>

          <p className="text-slate-500">
            Financial Explorer
          </p>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <span className="font-semibold">
          Level {player.level}
        </span>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
          {player.xp}/{nextLevelXP} XP
        </span>

      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-orange-50 p-4">

          <div className="flex items-center gap-2 text-orange-600">

            <Flame size={18} />

            <span className="text-sm font-semibold">
              Streak
            </span>

          </div>

          <p className="mt-2 text-2xl font-bold">
            {player.streak} Days
          </p>

        </div>

        <div className="rounded-2xl bg-amber-50 p-4">

          <div className="flex items-center gap-2 text-amber-600">

            <Trophy size={18} />

            <span className="text-sm font-semibold">
              Badges
            </span>

          </div>

          <p className="mt-2 text-2xl font-bold">
            {player.achievements}
          </p>

        </div>

      </div>

      <div className="mt-4 rounded-2xl bg-emerald-50 p-4">

        <div className="flex items-center gap-2 text-emerald-700">

          <Coins size={18} />

          <span className="font-semibold">
            Wealth Score
          </span>

        </div>

        <p className="mt-2 text-3xl font-bold">
          {player.wealthScore.toLocaleString()}
        </p>

      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-indigo-50 p-4 text-indigo-700">

        <Star size={18} />

        <span className="font-semibold">
          Financial Explorer
        </span>

      </div>

    </div>
  );
}