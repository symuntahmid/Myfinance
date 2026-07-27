"use client";

import { useEffect, useState } from "react";

import {
  Star,
  Trophy,
  Coins,
  Flame,
} from "lucide-react";

import {
  getPlayer,
  getLevel,
} from "@/app/data/player";

export default function StatsGrid() {
  const [player, setPlayer] = useState(getPlayer());

  const [level, setLevel] = useState(getLevel());

  useEffect(() => {
    function refresh() {
      setPlayer(getPlayer());
      setLevel(getLevel());
    }

    window.addEventListener(
      "player-updated",
      refresh
    );

    return () =>
      window.removeEventListener(
        "player-updated",
        refresh
      );
  }, []);

  const cards = [
    {
      title: "XP",
      value: player.xp,
      icon: Star,
      color: "bg-indigo-500",
    },
    {
      title: "Level",
      value: level.level,
      icon: Trophy,
      color: "bg-yellow-500",
    },
    {
      title: "Wealth",
      value: player.wealthScore,
      icon: Coins,
      color: "bg-emerald-500",
    },
    {
      title: "Streak",
      value: `${player.streak} Days`,
      icon: Flame,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.color} text-white`}
          >
            <card.icon size={24} />
          </div>

          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}