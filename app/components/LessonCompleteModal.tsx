"use client";

import Link from "next/link";
import { Award, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  xp: number;
  hasNextLesson: boolean;
};

export default function LessonCompleteModal({
  open,
  xp,
  hasNextLesson,
}: Props) {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [wealthScore, setWealthScore] = useState(0);

  useEffect(() => {
    if (!open) return;

    setAnimatedXP(0);
    setWealthScore(0);

    const xpSteps = [1, 3, 6, xp];

    let index = 0;

    const xpTimer = setInterval(() => {
      setAnimatedXP(xpSteps[index]);

      index++;

      if (index >= xpSteps.length) {
        clearInterval(xpTimer);
      }
    }, 250);

    let wealth = 0;

    const wealthTimer = setInterval(() => {
      wealth += 15;

      if (wealth >= 150) {
        wealth = 150;
        clearInterval(wealthTimer);
      }

      setWealthScore(wealth);
    }, 40);

    return () => {
      clearInterval(xpTimer);
      clearInterval(wealthTimer);
    };
  }, [open, xp]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">

        <Award
          size={70}
          className="mx-auto text-yellow-500 animate-bounce"
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

    <strong className="text-2xl text-indigo-700">
      +{animatedXP}
    </strong>
  </div>

  <div className="mt-5 flex items-center justify-between">
    <span>Wealth Score</span>

    <strong className="flex items-center gap-2 text-green-600">
      <TrendingUp size={18} />
      +{wealthScore}
    </strong>
  </div>

</div>

<div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">

  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
    Next Step
  </p>

  <h3 className="mt-2 text-xl font-bold">
    Continue your Finance Academy journey
  </h3>

  <p className="mt-2 text-slate-600">
    Your next lesson is ready. Keep your learning streak alive and continue building your Financial Mastery.
  </p>

</div>

<div className="mt-8 flex gap-4">

  <Link
    href={hasNextLesson ? "/academy" : "/dashboard"}
    className="flex-1 rounded-2xl bg-indigo-600 py-4 text-center font-bold text-white transition hover:scale-105 hover:bg-indigo-700"
  >
    {hasNextLesson
      ? "Continue Learning →"
      : "Go to Dashboard →"}
  </Link>

  {hasNextLesson && (
    <Link
      href="/dashboard"
      className="flex-1 rounded-2xl border border-slate-300 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-100"
    >
      Dashboard
    </Link>
  )}

</div>

      </div>

    </div>
  );
}