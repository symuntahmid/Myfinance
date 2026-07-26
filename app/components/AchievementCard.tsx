"use client";

import { Trophy } from "lucide-react";
import { getAchievements } from "../data/achievements";

export default function AchievementCard() {
  const achievements = getAchievements();

  const unlocked = achievements.filter(
    (a) => a.unlocked
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">

      <div className="flex items-center gap-3">

        <Trophy className="text-yellow-500" />

        <h2 className="text-2xl font-bold">
          Achievements
        </h2>

      </div>

      <div className="mt-6 space-y-4">

        {unlocked.length === 0 ? (
          <p className="text-slate-500">
            No achievements yet.
          </p>
        ) : (
          unlocked.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-xl bg-yellow-50 p-4"
            >
              <h3 className="font-bold">
                🏆 {achievement.title}
              </h3>

              <p className="text-sm text-slate-600">
                {achievement.description}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}