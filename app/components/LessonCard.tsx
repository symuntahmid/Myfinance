"use client";

import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTodayLesson } from "../data/lessons";

export default function LessonCard() {
  const lesson = getTodayLesson();

  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl">

      <div className="p-8">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-white/20 p-3">
            <BookOpen size={28} />
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest opacity-80">
              Finance Academy
            </p>

            <h2 className="text-3xl font-bold">
              Today's Lesson
            </h2>
          </div>

        </div>

        <div className="mt-8">

          <h3 className="text-2xl font-bold">
            {lesson.title}
          </h3>

          <p className="mt-3 text-white/80">
            {lesson.description}
          </p>

        </div>

        <div className="mt-8 flex items-center justify-between">

          <div>

            <p className="text-sm opacity-80">
              Reward
            </p>

            <p className="text-2xl font-bold">
              +{lesson.xp} XP
            </p>

          </div>

          <Link
            href={`/academy/${lesson.id}`}
            className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-indigo-700 transition hover:scale-105"
          >
            Start Lesson

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

    </div>
  );
}