"use client";

import { User } from "lucide-react";
import { getPlayer, getLevel } from "@/app/data/player";
import { useEffect, useState } from "react";

type Props = {
  compact?: boolean;
};

export default function ProfileCard({
  compact = false,
}: Props) {
  const [mounted, setMounted] = useState(false);

  const [player, setPlayer] = useState<ReturnType<
    typeof getPlayer
  > | null>(null);

  const [level, setLevel] = useState<ReturnType<
    typeof getLevel
  > | null>(null);

  useEffect(() => {
    setMounted(true);

    const refreshPlayer = () => {
      setPlayer(getPlayer());
      setLevel(getLevel());
    };

    refreshPlayer();

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

  if (!mounted || !player || !level) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-3xl bg-slate-100" />

        <div className="mx-auto mt-5 h-6 w-32 animate-pulse rounded bg-slate-100" />

        <div className="mx-auto mt-2 h-4 w-40 animate-pulse rounded bg-slate-100" />

        <div className="mt-8 h-4 animate-pulse rounded bg-slate-100" />

        <div className="mt-3 h-3 animate-pulse rounded-full bg-slate-100" />
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">

      {/* Profile */}

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
          <User size={30} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          {player.name}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your Personal CFO
        </p>

      </div>


      <div className="my-7 border-t border-slate-200" />


      {/* Level */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <span className="font-semibold text-slate-900">
            ⭐ Level {level.level}
          </span>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
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

    </section>
  );
}