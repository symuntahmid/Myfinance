"use client";

import Link from "next/link";
import { Trophy, ArrowUpRight } from "lucide-react";

const badges = [
  {
    id: 1,
    icon: "😎",
    level: "Level 4",
    description: "$100 Saved",
  },
  {
    id: 2,
    icon: "☕",
    level: "10 Cups",
    description: "$30 Saved",
  },
  {
    id: 3,
    icon: "🐷",
    level: "Grocery Guru",
    description: "$60 Saved",
  },
];

function BadgesCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

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

      <div className="mt-5 grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-4xl shadow-sm">
              {badge.icon}
            </div>

            <p className="mt-2 text-xs font-semibold text-slate-900">
              {badge.level}
            </p>

            <p className="mt-1 text-[10px] text-purple-500">
              {badge.description}
            </p>

          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 p-4">

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-yellow-500 shadow-sm">
          <Trophy size={32} />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              #1 March Savings
            </h3>

            <span className="text-slate-400">
              ↗
            </span>
          </div>

          <p className="mt-1 text-xl font-bold text-slate-900">
            $240.00
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            02 March – 31 March · 12 days
          </p>

        </div>

      </div>

    </section>
  );
}

export { BadgesCard };
export default BadgesCard;