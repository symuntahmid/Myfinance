"use client";

import Image from "next/image";
import { CheckCircle2, Rocket, User } from "lucide-react";
import { getPlayer, getLevel } from "@/app/data/player";
import { useEffect, useState } from "react";

type Props = {
  compact?: boolean;
};

export default function ProfileCard({
  compact = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

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

    window.addEventListener("player-updated", refreshPlayer);

    return () => {
      window.removeEventListener(
        "player-updated",
        refreshPlayer
      );
    };
  }, []);

  if (!mounted || !player || !level) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-slate-100" />

        <div className="mx-auto mt-5 h-7 w-32 animate-pulse rounded-lg bg-slate-100" />

        <div className="mx-auto mt-2 h-4 w-40 animate-pulse rounded bg-slate-100" />

        <div className="mx-auto mt-6 h-8 w-64 animate-pulse rounded-full bg-slate-100" />

        <div className="mt-8 h-4 animate-pulse rounded-full bg-slate-100" />

        <div className="mt-3 h-3 animate-pulse rounded-full bg-slate-100" />
      </section>
    );
  }

  const progress = Math.min(
    Math.max(level.percent, 0),
    100
  );

  return (
    <section
      className={`relative overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50 shadow-sm ${
        compact ? "p-5" : "p-6 md:p-8"
      }`}
    >
      {/* Decorative background */}
      {!compact && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-teal-200/30 blur-3xl" />
        </>
      )}

      <div
        className={`relative ${
          compact
            ? "flex items-center gap-4"
            : "flex flex-col items-center text-center"
        }`}
      >
        {/* Avatar */}
        <div
          className={`relative shrink-0 ${
            compact ? "h-16 w-16" : "h-28 w-28"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-teal-100 shadow-lg">
            {!avatarError ? (
              <Image
                src="/images/quokka/quokka-profile.png"
                alt="Premium quokka profile"
                fill
                sizes={compact ? "64px" : "112px"}
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                <User size={compact ? 28 : 42} />
              </div>
            )}
          </div>

          {/* Online indicator */}
          <span
            className={`absolute bottom-1 right-1 rounded-full border-2 border-white bg-emerald-500 ${
              compact ? "h-4 w-4" : "h-5 w-5"
            }`}
          />
        </div>

        {/* Identity */}
        <div
          className={
            compact
              ? "min-w-0 flex-1"
              : "mt-5"
          }
        >
          <div
            className={`flex items-center ${
              compact
                ? "justify-start"
                : "justify-center"
            } gap-2`}
          >
            <h2
              className={`font-bold tracking-tight text-slate-950 ${
                compact ? "text-lg" : "text-3xl"
              }`}
            >
              {player.name}
            </h2>

            <CheckCircle2
              size={compact ? 17 : 21}
              className="fill-cyan-500 text-white"
            />
          </div>

          <p
            className={`text-slate-500 ${
              compact
                ? "mt-0.5 text-xs"
                : "mt-1 text-sm"
            }`}
          >
            Your Personal CFO
          </p>

          {!compact && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <span>Smarter money. Bigger dreams.</span>

              <Rocket
                size={15}
                className="text-cyan-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Level */}
      <div
        className={`relative ${
          compact ? "mt-5" : "mt-7"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>

            <span className="font-bold text-slate-900">
              Level {level.level}
            </span>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
            {level.currentXP.toLocaleString()} /{" "}
            {level.nextLevelXP.toLocaleString()} XP
          </span>
        </div>

        {/* Progress track */}
        <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-teal-400 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {!compact && (
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Financial journey</span>

            <span>
              {Math.round(progress)}% complete
            </span>
          </div>
        )}
      </div>
    </section>
  );
}