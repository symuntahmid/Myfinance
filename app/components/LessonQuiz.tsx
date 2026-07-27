"use client";

import { useState } from "react";

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

      <h2 className="text-3xl font-bold">
        Quiz
      </h2>

      <p className="mt-6 text-xl font-semibold">
        {question}
      </p>

      <div className="mt-8 space-y-4">

        {options.map((option, index) => {

          let style =
            "border-gray-300 hover:border-indigo-400";

          if (answered) {

            if (index === correct) {
              style =
                "border-green-500 bg-green-50";
            } else if (selected === index) {
              style =
                "border-red-500 bg-red-50";
            }

          }

          return (
            <button
              key={index}
              onClick={() => choose(index)}
              className={`w-full rounded-2xl border p-5 text-left transition ${style}`}
            >
              {option}
            </button>
          );

        })}

      </div>

      {answered && (
        <div className="mt-8 rounded-2xl bg-indigo-50 p-5">

          <h3 className="font-bold text-indigo-700">
            Explanation
          </h3>

          <p className="mt-2 text-gray-700">
            {explanation}
          </p>

        </div>
      )}

    </div>
  );
}