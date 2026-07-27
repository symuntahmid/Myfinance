"use client";

import { Flame, Trophy, User, TrendingUp } from "lucide-react";

import { getPlayer, getLevel } from "@/app/data/player";
import { useEffect, useState } from "react";


export default function ProfileCard() {
  const [player, setPlayer] = useState(getPlayer());
const [level, setLevel] = useState(getLevel());

useEffect(() => {
  function refreshPlayer() {
    setPlayer(getPlayer());
    setLevel(getLevel());
  }

  window.addEventListener(
    "player-updated",
    refreshPlayer
  );

  return () => {
    window.removeEventListener(
      "player-updated",
      refreshPlayer
    );
  };
}, []);

  useEffect(() => {
    const handlePlayerUpdated = () => {
      setPlayer(getPlayer());
      setLevel(getLevel());
    };

    window.addEventListener("player-updated", handlePlayerUpdated);

    return () => {
      window.removeEventListener("player-updated", handlePlayerUpdated);
    };
  }, []);


  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl min-h-[330px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
          <User size={30} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            My Profile
          </h2>

          <p className="text-slate-500">
            Financial Explorer
          </p>
        </div>

      </div>

      {/* Level */}

      <div className="mt-8">

        <div className="flex justify-between text-sm font-semibold">

          <span>
            Level {level.level}
          </span>

          <span>
            {level.currentXP} / {level.nextLevelXP} XP
          </span>

        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"
            style={{
              width: `${level.percent}%`,
            }}
          />

        </div>

      </div>

      {/* Stats */}

      <div className="mt-8 grid grid-cols-2 gap-4">

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
            0
          </p>

        </div>

      </div>

      {/* Wealth Score */}

      <div className="mt-6 rounded-2xl bg-emerald-50 p-4">

        <div className="flex items-center gap-2 text-emerald-600">

          <TrendingUp size={18} />

          <span className="text-sm font-semibold">
            Wealth Score
          </span>

        </div>

        <p className="mt-2 text-3xl font-bold">
          {player.wealthScore}
        </p>

      </div>

    </div>
  );
}