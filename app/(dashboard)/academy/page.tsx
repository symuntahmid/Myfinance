"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock3 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import {
  getLessons,
  getModuleProgress,
  isLessonUnlocked,
} from "../../data/lessons";

const TEXT = {
  en: {
    title: "Finance Academy",
    sub: "Short lessons. Earn XP as you learn.",
    start: "Start here",
    go: "Start lesson",
    again: "Continue",
    done: "Completed",
    soon: "Coming next",
    progress: "{a} of {b} lessons done",
    unlockHint: "Finish the lesson above to open the next one.",
  },
  bn: {
    title: "ফাইন্যান্স একাডেমি",
    sub: "ছোট ছোট পাঠ। শিখতে শিখতে XP জিতুন।",
    start: "এখান থেকে শুরু করুন",
    go: "পাঠ শুরু করুন",
    again: "চালিয়ে যান",
    done: "শেষ হয়েছে",
    soon: "এরপর আসছে",
    progress: "{b}টির মধ্যে {a}টি পাঠ শেষ",
    unlockHint: "পরেরটি খুলতে ওপরের পাঠটি শেষ করুন।",
  },
} as const;

export default function AcademyPage() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];

  const lessons = getLessons();
  const progress = getModuleProgress(1);

  const current = lessons.find(
    (lesson) => !lesson.completed && isLessonUnlocked(lesson.id)
  );
  const finished = lessons.filter((lesson) => lesson.completed);
  const later = lessons.filter(
    (lesson) => !lesson.completed && lesson.id !== current?.id
  );

  return (
    <div className="space-y-5 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      <div>
        <p className="mb-1 text-xs font-semibold text-[var(--muted)]">
          {x.progress
            .replace("{a}", String(progress.completed))
            .replace("{b}", String(progress.total))}
        </p>

        <div className="h-2 rounded-full bg-[var(--border)]">
          <div
            className="h-2 rounded-full bg-[var(--primary)]"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {current && (
        <Link
          href={`/academy/${current.id}`}
          className="block rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]"
        >
          <p className="text-xs font-semibold opacity-80">{x.start}</p>

          <h2 className="mt-1 text-2xl font-bold">{current.title}</h2>
          <p className="mt-1 text-sm opacity-80">{current.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs opacity-80">
              <Clock3 size={14} />
              {current.duration} · +{current.xp} XP
            </span>

            <span className="rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-semibold text-black">
              {progress.completed > 0 ? x.again : x.go}
            </span>
          </div>
        </Link>
      )}

      {finished.length > 0 && (
        <ul className="space-y-2">
          {finished.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/academy/${lesson.id}`}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
              >
                <CheckCircle2 className="shrink-0 text-[var(--success)]" size={22} />

                <span className="flex-1 text-sm font-semibold">
                  {lesson.title}
                </span>

                <span className="text-xs text-[var(--muted)]">{x.done}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {later.length > 0 && (
        <details className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
            {x.soon} ({later.length})
            <ChevronRight size={16} className="transition group-open:rotate-90" />
          </summary>

          <ul className="space-y-2 px-4 pb-3">
            {later.map((lesson) => (
              <li
                key={lesson.id}
                className="flex items-center justify-between text-sm text-[var(--muted)]"
              >
                <span>{lesson.title}</span>
                <span className="text-xs">{lesson.duration}</span>
              </li>
            ))}

            <li className="pt-1 text-xs text-[var(--muted)]">{x.unlockHint}</li>
          </ul>
        </details>
      )}
    </div>
  );
}
