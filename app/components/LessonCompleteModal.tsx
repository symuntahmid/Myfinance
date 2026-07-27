"use client";

import Link from "next/link";
import { Award, TrendingUp } from "lucide-react";

type Props = {
  open: boolean;
  xp: number;
};

export default function LessonCompleteModal({
  open,
  xp,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">

        <Award
          size={70}
          className="mx-auto text-yellow-500"
        />

        <h1 className="mt-5 text-4xl font-bold">
          Lesson Complete!
        </h1>

        <p className="mt-3 text-gray-600">
          Great job. Keep learning every day.
        </p>

        <div className="mt-10 rounded-2xl bg-indigo-50 p-6">

          <div className="flex items-center justify-between">

            <span>XP Earned</span>

            <strong>+{xp}</strong>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <span>Wealth Score</span>

            <strong className="flex items-center gap-2">
              <TrendingUp size={18}/>
              +150
            </strong>

          </div>

        </div>

        <Link
          href="/dashboard"
          className="mt-8 block rounded-2xl bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700"
        >
          Continue
        </Link>

      </div>

    </div>
  );
}