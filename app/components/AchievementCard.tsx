"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

import {
  getAchievements,
  type Achievement,
} from "@/app/data/achievements";

export default function AchievementCard() {
  const [achievements, setAchievements] = useState<Achievement[]>(
    getAchievements()
  );

  useEffect(() => {
    function refresh() {
      setAchievements(getAchievements());
    }

    window.addEventListener("player-updated", refresh);

    return () => {
      window.removeEventListener("player-updated", refresh);
    };
  }, []);

  const unlocked = achievements.filter((a) => a.unlocked);

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
          <p className="text-gray-500">
            Complete lessons to unlock achievements.
          </p>
        ) : (
          unlocked.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-2xl bg-yellow-50 p-4"
            >
              <div className="text-3xl">
                {achievement.icon}
              </div>

              <h3 className="mt-2 font-bold">
                {achievement.title}
              </h3>

              <p className="text-sm text-gray-600">
                {achievement.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}