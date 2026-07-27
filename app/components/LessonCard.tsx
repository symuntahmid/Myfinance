"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  Clock3,
  Star,
  ArrowRight,
} from "lucide-react";

import {
  getTodayLesson,
  getLessons,
} from "@/app/data/lessons";

export default function LessonCard() {
  const lesson = getTodayLesson();


  const lessons = getLessons();

  const completed = lessons.filter(
    (l) => l.completed
  ).length;

  const progress =
    (completed / lessons.length) * 100;

  return (
    <div
  className={`overflow-hidden rounded-3xl p-8 text-white transition-all duration-700 ${
    lesson.completed
      ? "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-[0_0_50px_rgba(34,197,94,0.45)] scale-[1.02]"
      : "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl"
  }`}
>

      <p className="text-sm uppercase tracking-[0.25em] text-white/80">
  {lesson.completed ? "✨ Lesson Complete" : "Today's Lesson"}
</p>

      <h2 className="mt-3 text-4xl font-bold">
  {lesson.completed
    ? "Congratulations!"
    : lesson.title}
</h2>

      <p className="mt-4 max-w-2xl text-lg text-white/90">
  {lesson.completed
    ? "You completed today's lesson. Your financial skills just leveled up."
    : lesson.description}
</p>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">

          <span>
            Course Progress
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/20">

          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-4">

        <div className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3">

          <Clock3 size={18} />

          {lesson.duration}

        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3">

          <Star size={18} />

          +{lesson.xp} XP

        </div>

        <div className="rounded-full bg-white/15 px-5 py-3">

          {lesson.difficulty}

        </div>

      </div>

      <div className="mt-10 flex flex-wrap gap-4">

        {lesson.completed ? (

  <div className="w-full rounded-2xl bg-green-500/20 border border-green-300/30 p-6">

    <h3 className="text-2xl font-bold">
      🎉 Congratulations!
    </h3>

    <p className="mt-2 text-white/90">
      You completed today's lesson.
      Come back tomorrow for a new one.
    </p>

  </div>

) : (

  <>
    <Link
      href={`/academy/${lesson.id}`}
      className="flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-indigo-700 transition hover:scale-105"
    >
      Continue Learning
      <ArrowRight size={20} />
    </Link>

    <Link
      href="/academy"
      className="rounded-2xl border border-white/30 px-7 py-4 font-semibold transition hover:bg-white/10"
    >
      View Full Journey
    </Link>
  </>

)}

      </div>

    </div>
  );
}