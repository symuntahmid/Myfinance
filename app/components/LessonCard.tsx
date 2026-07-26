"use client";

import {
  BookOpen,
  ArrowRight,
  Clock3,
  Star,
  Award,
} from "lucide-react";

import Link from "next/link";

import { getTodayLesson } from "../data/lessons";

export default function LessonCard() {
  const lesson = getTodayLesson();

if (lesson.completed) {
  return (
  <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white shadow-xl">

    <h2 className="text-3xl font-bold">
      🎉 Today's Lesson Completed
    </h2>

    <p className="mt-3 text-white/90">
      Great job! Come back tomorrow for another lesson.
    </p>

    <div className="mt-8 flex gap-4">

      <Link
        href="/academy"
        className="rounded-2xl bg-white px-6 py-3 font-bold text-emerald-700"
      >
        View Academy
      </Link>

      <button
        onClick={() => {
          localStorage.removeItem("myfinance-lessons");

          window.location.reload();
        }}
        className="rounded-2xl bg-white/20 px-6 py-3 font-bold"
      >
        Reset Lessons (Dev)
      </button>

    </div>

  </div>
);
}

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl">

      <div className="p-8">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-white/20 p-4">
              <BookOpen size={30} />
            </div>

            <div>

              <p className="text-sm uppercase tracking-widest text-white/80">
                Finance Academy
              </p>

              <h2 className="text-4xl font-bold">
                Today's Lesson
              </h2>

            </div>

          </div>

          <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
            +{lesson.xp} XP
          </div>

        </div>

        <div className="mt-10">

          <h3 className="text-3xl font-bold">
            {lesson.title}
          </h3>

          <p className="mt-3 max-w-xl text-lg text-white/80">
            {lesson.description}
          </p>

        </div>

        <div className="mt-8 flex flex-wrap gap-3">

          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

            <Clock3 size={16} />

            <span>{lesson.duration}</span>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

            <Star size={16} />

            <span>{lesson.difficulty}</span>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

            <Award size={16} />

            <span>{lesson.category}</span>

          </div>

        </div>

        <div className="mt-10 flex items-center justify-between">

          <div>

            <p className="text-sm text-white/70">
              Continue your financial journey
            </p>

            <p className="mt-1 text-xl font-semibold">
              Lesson Reward: +{lesson.xp} XP
            </p>

          </div>

          <Link
            href="/academy"
            className="flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-indigo-700 transition hover:scale-105"
          >
            Continue

            <ArrowRight size={20} />
          </Link>

        </div>

      </div>

    </div>
  );
}