"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type QuizProps = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  onCorrect: () => void;
};

export default function LessonQuiz({
  question,
  options,
  correct,
  explanation,
  onCorrect,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  function choose(index: number) {
    if (answered) return;

    setSelected(index);
    setAnswered(true);

    if (index === correct) {
      onCorrect();
    }
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="text-3xl font-bold text-slate-900">
        Quiz
      </h2>

      <p className="mt-6 text-xl font-semibold text-slate-800">
        {question}
      </p>

      <div className="mt-8 space-y-4">
        {options.map((option, index) => {

          let style =
            "border-slate-200 bg-white hover:border-cyan-400 hover:bg-cyan-50 text-slate-800";

          if (answered) {
            if (index === correct) {
              style =
                "border-green-500 bg-green-100 text-green-900";
            } else if (selected === index) {
              style =
                "border-red-500 bg-red-100 text-red-900";
            }
          }

          return (
            <button
              key={index}
              onClick={() => choose(index)}
              className={`
                w-full
                rounded-2xl
                border-2
                px-6
                py-5
                text-left
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-95
                font-medium
                ${style}
              `}
            >
              <div className="flex items-center justify-between">

                <span className="text-lg">
                  {option}
                </span>

                {answered && index === correct && (
                  <CheckCircle2
                    size={24}
                    className="animate-bounce text-green-600"
                  />
                )}

                {answered &&
                  selected === index &&
                  index !== correct && (
                    <XCircle
                      size={24}
                      className="animate-pulse text-red-600"
                    />
                  )}
              </div>
            </button>
          );

        })}
      </div>

      {answered && (
        <>
          <div
            className={`mt-8 rounded-2xl p-5 ${
              selected === correct
                ? "border border-green-300 bg-green-100"
                : "border border-red-300 bg-red-100"
            }`}
          >
            <h3
              className={`text-xl font-bold ${
                selected === correct
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {selected === correct
                ? "🎉 Correct!"
                : "❌ Not Quite"}
            </h3>

            <p className="mt-2 text-slate-700">
              {selected === correct
                ? "Excellent! You earned XP. Read the explanation below before claiming your reward."
                : "Don't worry! Read the explanation below and you'll get it next time."}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">

            <h3 className="font-bold text-indigo-700">
              Explanation
            </h3>

            <p className="mt-3 leading-7 text-slate-700">
              {explanation}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                disabled
                className="cursor-default rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-white opacity-70"
              >
                Return above to Claim Reward ↑
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}