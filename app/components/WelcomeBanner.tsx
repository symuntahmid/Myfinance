"use client";

import { getPlayer, getLevel } from "@/app/data/player";
import { getTodayLesson } from "@/app/data/lessons";

export default function WelcomeBanner() {
  const player = getPlayer();
  const level = getLevel();
  const lesson = getTodayLesson();

  let message =
    `Continue today's lesson and earn +${lesson.xp} XP.`;

  if (level.nextLevelXP - level.currentXP <= 20) {
    message = `Only ${
      level.nextLevelXP - level.currentXP
    } XP until Level ${level.level + 1}!`;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold">
        Welcome back, {player.name} 👋
      </h2>

      <p className="mt-2 text-slate-500">
        {message}
      </p>
    </div>
  );
}