"use client";

import { Flame, Trophy, User, TrendingUp } from "lucide-react";

import { getPlayer, getLevel } from "@/app/data/player";
import { useEffect, useState } from "react";
import Link from "next/link";


type Props = {
  compact?: boolean;
};

export default function ProfileCard({
  compact = false,
}: Props) {
  
 const [player, setPlayer] = useState(getPlayer());
const [level, setLevel] = useState(getLevel());

useEffect(() => {
  function refreshPlayer() {
    setPlayer(getPlayer());
    setLevel(getLevel());
  }

  window.addEventListener("player-updated", refreshPlayer);

  return () => {
    window.removeEventListener(
      "player-updated",
      refreshPlayer
    );
  };
}, []);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl min-h-[330px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">

      {/* Header */}

      <div className="text-center">

  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
    <User size={30} />
  </div>


  <h2 className="mt-5 text-2xl font-bold">
    {player.name}
  </h2>

  <p className="mt-1 text-slate-500">
    Your Personal CFO
  </p>

</div>

<div className="my-8 border-t border-slate-200" />

      {/* Level */}
<div className="mt-5">

  <div className="mb-3 flex items-center justify-between">

    <span className="font-semibold">
      ⭐ Level {level.level}
    </span>

    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
      {level.currentXP}/{level.nextLevelXP} XP
    </span>

  </div>

  <div className="h-3 overflow-hidden rounded-full bg-slate-200">

    <div
      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"
      style={{
        width: `${level.percent}%`,
      }}
    />

  </div>

</div>

<div className="my-5 border-t border-slate-200" />



 {/* Stats */}

{!compact && (
  <>
    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="mb-5 text-lg font-bold">
        Financial Snapshot
      </h3>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <span>💰 Net Worth</span>
          <strong>${player.netWorth.toLocaleString()}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span>📈 Monthly Cash Flow</span>
          <strong
            className={
              player.monthlyCashFlow >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {player.monthlyCashFlow >= 0 ? "+" : ""}
            ${player.monthlyCashFlow.toLocaleString()}
          </strong>
        </div>

        <div className="flex items-center justify-between">
          <span>🏦 Saving Rate</span>
          <strong>{player.savingRate}%</strong>
        </div>

        <div className="flex items-center justify-between">
          <span>📊 Investments</span>
          <strong>${player.investments.toLocaleString()}</strong>
        </div>

      </div>
    </div>

    <div className="my-5 border-t border-slate-200" />

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-2xl bg-orange-50 p-4">
        <div className="flex items-center gap-2 text-orange-600">
          <Flame size={18} />
          <span className="text-sm font-semibold">Streak</span>
        </div>

        <p className="mt-2 text-xl font-bold">
          {player.streak} Days
        </p>
      </div>

      <div className="rounded-2xl bg-yellow-50 p-4">
        <div className="flex items-center gap-2 text-yellow-600">
          <Trophy size={18} />
          <span className="text-sm font-semibold">
            Achievements
          </span>
        </div>

        <p className="mt-2 text-xl font-bold">
          {player.achievements}
        </p>
      </div>

    </div>
  </>
)}

<div className="mt-5 grid grid-cols-2 gap-4">

  <div className="rounded-2xl bg-orange-50 p-4">
    <div className="flex items-center gap-2 text-orange-600">
      <Flame size={18} />
      <span className="text-sm font-semibold">Streak</span>
    </div>

    <p className="mt-2 text-xl font-bold">
      {player.streak} Days
    </p>
  </div>

  <div className="rounded-2xl bg-emerald-50 p-4">
    <div className="flex items-center gap-2 text-emerald-600">
      <TrendingUp size={18} />
      <span className="text-sm font-semibold">
        Wealth Score
      </span>
    </div>

    <p className="mt-2 text-xl font-bold">
      {player.wealthScore}
    </p>
  </div>

</div>

{compact && (
  <Link
    href="/profile"
    className="mt-5 block rounded-2xl bg-slate-900 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
  >
    View Profile →
  </Link>
)}

    </div>
  );
}