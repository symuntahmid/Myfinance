"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  Circle,
} from "lucide-react";

import {
  getLessons,
  isLessonUnlocked,
} from "@/app/data/lessons";

export default function LearningRoadmap() {
  const lessons = getLessons();

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-10 text-3xl font-bold">
        🚀 Learning Journey
      </h2>

      <div className="space-y-8">

        {lessons.map((lesson) => {

          const unlocked = isLessonUnlocked(lesson.id);

          return (

            <div
              key={lesson.id}
              className="flex items-center gap-6"
            >

              <div>

                {lesson.completed ? (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">

                    <CheckCircle2 />

                  </div>

                ) : unlocked ? (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white">

                    <Circle />

                  </div>

                ) : (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-gray-600">

                    <Lock size={20} />

                  </div>

                )}

              </div>

              <div className="flex-1">

                <h3 className="font-bold">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-500">
                  +{lesson.xp} XP
                </p>

              </div>

              {unlocked && (
                <Link
                  href={`/academy/${lesson.id}`}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                >
                  Open
                </Link>
              )}

            </div>

          );

        })}

      </div>

    </div>
  );
}