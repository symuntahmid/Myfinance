"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy, Lock } from "lucide-react";

import { badges } from "@/app/data/badges";
import { getPlayer } from "@/app/data/player";

function BadgesCard() {
  const player = getPlayer();

  /*
   * For now, only XP-based badges are unlocked
   * directly from the player's XP.
   *
   * Saving / Investment / Psychology badges will be
   * connected to their real progress separately.
   */
  const unlockedBadges = badges.filter((badge) => {
    if (badge.category === "Points") {
      return player.xp >= badge.target;
    }

    return false;
  });

  const visibleBadges = unlockedBadges.slice(0, 3);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Your Badges
        </h2>

        <Link
  href="/profile/badges"
          className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-900"
        >
          Show more
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* BADGES */}
      <div className="mt-5 grid grid-cols-3 gap-3">

        {visibleBadges.length > 0 ? (
          visibleBadges.map((badge) => (
            <div
              key={badge.id}
              className="text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-4xl shadow-sm">
                {badge.icon}
              </div>

              <p className="mt-2 text-xs font-semibold text-slate-900">
                {badge.name}
              </p>

              <p className="mt-1 text-[10px] text-purple-500">
                {badge.requirement}
              </p>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="col-span-3 flex flex-col items-center justify-center py-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <Lock size={25} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No badges unlocked yet
            </p>

            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Keep learning and improving your money habits
              to unlock your first badge.
            </p>
          </div>
        )}

      </div>

      {/* BADGE PROGRESS */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 p-4">

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-yellow-500 shadow-sm">
          <Trophy size={32} />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              Badge Progress
            </h3>

            <span className="text-xs font-semibold text-slate-400">
              {unlockedBadges.length}/{badges.length}
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {unlockedBadges.length === 0
              ? "Your journey starts here."
              : `${unlockedBadges.length} badge${
                  unlockedBadges.length === 1 ? "" : "s"
                } unlocked`}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Continue your financial journey to unlock more.
          </p>

        </div>

      </div>

    </section>
  );
}

export { BadgesCard };
export default BadgesCard;