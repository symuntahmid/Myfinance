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
    title: "3 Day Streak",
    description: "Complete your Daily Journey for 3 days in a row.",
    icon: "🔥",
    unlocked: false,
  },

  {
    id: 5,
    title: "7 Day Streak",
    description: "Maintain a 7 day money habit streak.",
    icon: "⚡",
    unlocked: false,
  },

  {
    id: 6,
    title: "30 Day Streak",
    description: "Become a Smart CFO with a 30 day streak.",
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