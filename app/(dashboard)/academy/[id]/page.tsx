"use client";
import LessonQuiz from "@/app/components/LessonQuiz";
import { useState } from "react";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
} from "lucide-react";

import {
  getTodayLesson,
  completeLesson,
} from "@/app/data/lessons";

import { addXP } from "@/app/data/player";

import { useRouter } from "next/navigation";

export default function LessonPage() {
  const lesson = getTodayLesson();
  const router = useRouter();
  const [lessonPassed, setLessonPassed] = useState(false);


  const handleCompleteLesson = () => {
    completeLesson(lesson.id);
    addXP(lesson.xp);
    router.push("/dashboard");
router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl">

      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl">

        <div className="p-10">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-white/20 p-3">
              <BookOpen size={28} />
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest opacity-80">
                Finance Academy
              </p>

              <h1 className="text-4xl font-bold">
                {lesson.title}
              </h1>
            </div>

          </div>

          <p className="mt-6 text-lg text-white/90">
            {lesson.description}
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-3xl bg-white p-8 shadow">

        <h2 className="mb-5 text-2xl font-bold">
          Lesson
        </h2>

        <div className="space-y-6 leading-8 text-slate-700">

          <p>
            Imagine losing your job tomorrow.
            Would you still be able to pay your rent,
            buy groceries and cover your bills?
          </p>

          <p>
            An emergency fund is money you set aside
            only for unexpected situations like losing
            your job, medical emergencies, or urgent repairs.
          </p>

          <p>
            Financial experts recommend saving
            between <strong>3–6 months</strong> of living expenses.
          </p>

          <p>
            Even starting with your first
            <strong> $500</strong> creates peace of mind.
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">

        <div className="flex items-center gap-3">

          <CheckCircle2
            className="text-emerald-600"
            size={28}
          />

          <h2 className="text-2xl font-bold">
            Key Takeaway
          </h2>

        </div>

        <p className="mt-5 text-lg text-slate-700">
          Build your emergency fund before making
          risky investments. It protects your future.
        </p>

      </div>

      <div className="mt-8 flex items-center justify-between rounded-3xl bg-slate-900 p-8 text-white">

        <div>

          <div className="flex items-center gap-2">

            <Award className="text-yellow-400" />

            <p className="font-semibold">
              Lesson Reward
            </p>

          </div>

          <h2 className="mt-2 text-3xl font-bold">
            +{lesson.xp} XP
          </h2>

        </div>

        <button
  disabled={!lessonPassed}
  onClick={() => {
    completeLesson(lesson.id);

    addXP(lesson.xp);

    router.push("/dashboard");
    router.refresh();
  }}
  className={`rounded-2xl px-8 py-4 text-lg font-bold transition ${
    lessonPassed
      ? "bg-emerald-500 hover:scale-105 hover:bg-emerald-600 text-white"
      : "bg-slate-300 text-slate-500 cursor-not-allowed"
  }`}
>
  {lessonPassed ? "Complete Lesson" : "Pass Quiz First"}
</button>

      </div>

<LessonQuiz
  onPass={() => {
    setLessonPassed(true);
  }}
/>
    </div>
  );
}