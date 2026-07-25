"use client";

import {
  Flame,
  Trophy,
  Star,
  User,
} from "lucide-react";

import { getPlayer } from "../data/player";

export default function ProfileCard() {
  const player = getPlayer();

  const xp = player.xp;
  const level = player.level;
  const nextLevel = level * 100;

  const progress = (xp / nextLevel) * 100;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">

            <User size={30} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {player.name}
            </h2>

            <p className="text-slate-500">
              {player.rank}
            </p>

          </div>

        </div>

        <div className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-700">

          Level {level}

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">

          <span>
            XP Progress
          </span>

          <span className="font-semibold">
            {xp} / {nextLevel}
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-1000"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-orange-50 p-5">

          <div className="flex items-center gap-3">

            <Flame className="text-orange-500" />

            <div>

              <p className="text-sm text-slate-500">
                Streak
              </p>

              <h3 className="text-xl font-bold">
                {player.streak} Days
              </h3>

            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-yellow-50 p-5">

          <div className="flex items-center gap-3">

            <Trophy className="text-yellow-500" />

            <div>

              <p className="text-sm text-slate-500">
                Achievements
              </p>

              <h3 className="text-xl font-bold">
                {player.achievements}
              </h3>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-white">

        <div className="flex items-center gap-3">

          <Star />

          <div>

            <p className="text-sm opacity-80">
              Current Rank
            </p>

            <h3 className="text-2xl font-bold">
              {player.rank}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}