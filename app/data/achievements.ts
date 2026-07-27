export type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

const STORAGE_KEY = "myfinance-achievements";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "First Lesson",
    description: "Complete your first lesson.",
    icon: "🎓",
    unlocked: false,
  },
  {
    id: 2,
    title: "100 XP",
    description: "Earn your first 100 XP.",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: 3,
    title: "Daily Hero",
    description: "Complete today's journey.",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: 4,
    title: "Module Master",
    description: "Complete every lesson in Module 1.",
    icon: "🏆",
    unlocked: false,
  },
];

export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") {
    return DEFAULT_ACHIEVEMENTS;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_ACHIEVEMENTS)
    );

    return DEFAULT_ACHIEVEMENTS;
  }

  return JSON.parse(saved) as Achievement[];
}

export function saveAchievements(
  achievements: Achievement[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(achievements)
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}

export function unlockAchievement(id: number): void {
  const achievements = getAchievements();

  const achievement = achievements.find(
    (a) => a.id === id
  );

  if (!achievement) return;

  if (achievement.unlocked) return;

  achievement.unlocked = true;

  saveAchievements(achievements);
}