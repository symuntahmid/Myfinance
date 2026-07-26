"use client";

import { useState } from "react";

type QuizProps = {
  question: string;
  options: string[];
  correct: number;
  xp: number;
};

export default function LessonQuiz({
  question,
  options,
  correct,
  xp,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="text-3xl font-bold mb-8">
        Quiz
      </h2>

      <p className="mb-8 text-xl font-medium text-gray-800">
        {question}
      </p>

      <div className="space-y-4">

        {options.map((option, index) => (

          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`w-full rounded-2xl border p-5 text-left transition

            ${
              selected === index
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400"
            }`}
          >
            {option}
          </button>

        ))}

      </div>

    </div>
  );
}