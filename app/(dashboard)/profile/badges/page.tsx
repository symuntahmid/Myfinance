"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { badges } from "@/app/data/badges";

export default function BadgesPage() {
  const categories = [
    "Points",
    "Saving",
    "Investment",
    "Psychology",
    "Premium",
  ];

  return (
    <div className="mx-auto max-w-4xl pb-10">

      {/* HEADER */}
      <div className="mb-8 flex items-start gap-3">

        <Link
          href="/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Badges
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your financial achievements, habits, and milestones.
          </p>
        </div>

      </div>

      {/* SUMMARY */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Total Badges
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {badges.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Unlocked
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            0
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Premium
          </p>

          <p className="mt-2 text-2xl font-bold text-violet-600">
            {badges.filter(
              (badge) => badge.premium
            ).length}
          </p>
        </div>

      </div>

      {/* CATEGORIES */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            {category}
          </button>
        ))}

      </div>

      {/* BADGE GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {badges.map((badge) => (

          <div
            key={badge.id}
            className={`relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition ${
              badge.premium
                ? "border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-fuchsia-50/40"
                : "border-slate-200"
            }`}
          >

            {/* PREMIUM */}
            {badge.premium && (
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                <Sparkles size={11} />
                PREMIUM
              </div>
            )}

            {/* ICON */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
                badge.premium
                  ? "bg-violet-100"
                  : "bg-slate-100"
              }`}
            >
              {badge.icon}
            </div>

            {/* NAME */}
            <h2 className="mt-5 text-base font-bold text-slate-950">
              {badge.name}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {badge.description}
            </p>

            {/* REQUIREMENT */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Requirement
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {badge.requirement}
              </p>

            </div>

            {/* STATUS */}
            <div className="mt-4 flex items-center gap-2">

              {badge.premium ? (
                <>
                  <Lock
                    size={15}
                    className="text-violet-500"
                  />

                  <span className="text-xs font-semibold text-violet-600">
                    Premium badge
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={15}
                    className="text-slate-300"
                  />

                  <span className="text-xs font-semibold text-slate-400">
                    Locked
                  </span>
                </>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}