"use client";

import Link from "next/link";

import {
  BookOpen,
  CheckCircle2,
  Lock,
  Clock3,
  Star,
} from "lucide-react";

import {
  getLessons,
  getModuleProgress,
  isLessonUnlocked,
} from "../../data/lessons";

export default function AcademyPage() {
  const lessons = getLessons();

  const progress = getModuleProgress(1);

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Finance Academy
        </h1>

        <p className="mt-2 text-slate-500">
          Complete lessons, earn XP and become financially smarter.
        </p>

      </div>

      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-widest opacity-80">
              Module 1
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              Money Fundamentals
            </h2>

          </div>

          <div className="rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">

            <p className="text-sm">
              Progress
            </p>

            <h3 className="text-2xl font-bold">
              {progress.completed}/{progress.total}
            </h3>

          </div>

        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/20">

          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${progress.percent}%`,
            }}
          />

        </div>

      </div>

      <div className="space-y-5">

        {lessons.map((lesson) => {

          const unlocked =
            isLessonUnlocked(lesson.id);

          return (

            <Link
              key={lesson.id}
              href={
                unlocked
                  ? `/academy/${lesson.id}`
                  : "#"
              }
            >

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-5">

                    <div className="rounded-2xl bg-indigo-100 p-4">

                      <BookOpen className="text-indigo-600" />

                    </div>

                    <div>

                      <h3 className="text-xl font-bold">
                        {lesson.title}
                      </h3>

                      <p className="mt-1 text-slate-500">
                        {lesson.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm">

                          <Clock3 size={14} />

                          {lesson.duration}

                        </span>

                        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">

                          <Star size={14} />

                          {lesson.difficulty}

                        </span>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">

                          +{lesson.xp} XP

                        </span>

                      </div>

                    </div>

                  </div>

                  <div>

                    {lesson.completed ? (

                      <CheckCircle2
                        className="text-green-500"
                        size={32}
                      />

                    ) : unlocked ? (

                      <div className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">

                        Continue

                      </div>

                    ) : (

                      <Lock
                        className="text-slate-400"
                        size={26}
                      />

                    )}

                  </div>

                </div>

              </div>

            </Link>

          );

        })}

      </div>

    </div>
  );
}