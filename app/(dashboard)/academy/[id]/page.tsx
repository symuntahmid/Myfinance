"use client";
import { useState } from "react";

import LessonQuiz from "@/app/components/LessonQuiz";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  getLessonById,
} from "@/app/data/lessons";

export default function LessonPage() {
  const [quizPassed, setQuizPassed] = useState(false);

const params = useParams();

const lesson = getLessonById(Number(params.id));

const [showExample, setShowExample] = useState(false);

  if (!lesson) {

    return (
      <div className="p-10">
        Lesson not found.
      </div>
    );

  }

  return (

    <main className="mx-auto max-w-5xl p-10">

      <Link
        href="/dashboard"
        className="text-indigo-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white shadow-2xl">

        <p className="text-sm uppercase tracking-widest opacity-80">
          Finance Academy
        </p>

        <h1 className="mt-2 text-5xl font-bold">
          {lesson.title}
        </h1>

        <p className="mt-5 text-xl text-white/80">
          {lesson.description}
        </p>

        <div className="mt-8 flex gap-4">

          <span className="rounded-full bg-white/20 px-4 py-2">
            ⏱ {lesson.duration}
          </span>

          <span className="rounded-full bg-white/20 px-4 py-2">
            ⭐ {lesson.difficulty}
          </span>

          <span className="rounded-full bg-white/20 px-4 py-2">
            📚 {lesson.category}
          </span>

          <span className="rounded-full bg-white/20 px-4 py-2">
            +{lesson.xp} XP
          </span>

        </div>

      </div>

      <div className="mt-8 space-y-6">

  {/* Lesson */}

  <div className="rounded-3xl bg-white p-8 shadow-xl">

    <h2 className="text-3xl font-bold">
      📖 Lesson
    </h2>

    <p className="mt-6 text-lg leading-9 text-gray-700">
      {lesson.content}
    </p>

  </div>

  {/* Key Takeaway */}

  <div className="rounded-3xl border border-green-200 bg-green-50 p-8">

    <div className="flex items-center gap-3">

      <CheckCircle2
        className="text-green-600"
        size={30}
      />

      <h2 className="text-3xl font-bold">
        Key Takeaway
      </h2>

    </div>

    <p className="mt-5 text-lg text-gray-700">
      {lesson.keyTakeaway}
    </p>

  </div>

  {/* Expandable Example */}

  <div className="rounded-3xl border bg-white shadow">

    <button
      onClick={() => setShowExample(!showExample)}
      className="flex w-full items-center justify-between p-7"
    >

      <div>

        <h2 className="text-2xl font-bold">
          📊 Real-Life Example
        </h2>

        <p className="mt-1 text-gray-500">
          See how this lesson works in practice.
        </p>

      </div>

      {showExample ? (
        <ChevronUp size={26} />
      ) : (
        <ChevronDown size={26} />
      )}

    </button>

    {showExample && (

      <div className="border-t p-8">

        <div className="rounded-2xl bg-indigo-50 p-6">

          <h3 className="text-xl font-bold">
            {lesson.example.title}
          </h3>

          <p className="text-gray-700">
  {lesson.example.description}
</p>
        </div>

      </div>

    )}

  </div>

  {/* Reward */}

  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">

    <p className="text-sm uppercase tracking-widest text-yellow-400">
      Lesson Reward
    </p>

    <div className="mt-3 flex items-center justify-between">

      <h2 className="text-5xl font-bold">
        +{lesson.xp} XP
      </h2>

      <button
  disabled={!quizPassed}
  className={`rounded-2xl px-8 py-4 font-bold transition ${
    quizPassed
      ? "bg-green-500 text-white hover:bg-green-600"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
>
  {quizPassed ? "🎉 Claim +10 XP" : "🔒 Pass Quiz First"}
</button>

    </div>
    <LessonQuiz
  question="What is the primary purpose of an emergency fund?"
  options={[
    "Buy luxury items",
    "Handle unexpected expenses",
    "Invest in stocks",
    "Pay monthly subscriptions",
  ]}
  correct={1}
  explanation="An emergency fund protects you against unexpected events like losing your job, medical bills, or urgent repairs."
  onCorrect={() => setQuizPassed(true)}
/>

  </div>

</div>
    </main>

  );

}