"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    question:
      "What is the primary purpose of an emergency fund?",
    options: [
      "Buy luxury items",
      "Handle unexpected expenses",
      "Invest in stocks",
      "Pay monthly subscriptions",
    ],
    answer: 1,
  },

  {
    question:
      "How many months of expenses do experts recommend saving?",
    options: [
      "1 Month",
      "2 Months",
      "3–6 Months",
      "12 Months",
    ],
    answer: 2,
  },

  {
    question:
      "Which expense should NOT come from your emergency fund?",
    options: [
      "Medical emergency",
      "Job loss",
      "Vacation",
      "Car repair",
    ],
    answer: 2,
  },
];

type Props = {
  onPass: () => void;
};

export default function LessonQuiz({
  onPass,
}: Props) {
  const [current, setCurrent] = useState(0);

  const [score, setScore] = useState(0);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [finished, setFinished] =
    useState(false);

  const question = QUESTIONS[current];

  function nextQuestion() {
    let newScore = score;

    if (selected === question.answer) {
      newScore++;
      setScore(newScore);
    }

    if (current === QUESTIONS.length - 1) {
      setFinished(true);

      if (newScore >= 2) {
        onPass();
      }

      return;
    }

    setCurrent(current + 1);
    setSelected(null);
  }

  if (finished) {
    const passed = score >= 2;

    return (
      <div className="mt-10 rounded-3xl bg-white p-8 shadow">

        <h2 className="text-3xl font-bold">

          {passed
            ? "🎉 Quiz Passed!"
            : "❌ Try Again"}

        </h2>

        <p className="mt-4 text-lg">
          Score: {score} / {QUESTIONS.length}
        </p>

        {passed ? (
          <p className="mt-4 text-green-600 font-semibold">
            Great job! You earned your XP.
          </p>
        ) : (
          <button
            onClick={() => {
              setCurrent(0);
              setScore(0);
              setSelected(null);
              setFinished(false);
            }}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white"
          >
            Retry Quiz
          </button>
        )}

      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Quiz
      </h2>

      <p className="mt-6 text-xl font-semibold">
        {question.question}
      </p>

      <div className="mt-6 space-y-4">

        {question.options.map(
          (option, index) => (
            <button
              key={index}
              onClick={() =>
                setSelected(index)
              }
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected === index
                  ? "border-indigo-600 bg-indigo-50"
                  : "hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          )
        )}

      </div>

      <button
        disabled={selected === null}
        onClick={nextQuestion}
        className="mt-8 rounded-2xl bg-indigo-600 px-8 py-3 font-bold text-white disabled:opacity-40"
      >
        {current === QUESTIONS.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>

    </div>
  );
}