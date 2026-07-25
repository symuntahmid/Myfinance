export type Achievement = {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
};

const STORAGE_KEY = "myfinance-achievements";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "First Step",
    description: "Complete your first daily mission.",
    unlocked: false,
  },
  {
    id: 2,
    title: "Money Tracker",
    description: "Add your first expense.",
    unlocked: false,
  },
  {
    id: 3,
    title: "Investor",
    description: "Add your first investment.",
    unlocked: false,
  },
  {
    id: 4,
    title: "Income Earner",
    description: "Add your first income.",
    unlocked: false,
  },
];

export function getAchievements(): Achievement[] {
  if (typeof window === "undefined")
    return DEFAULT_ACHIEVEMENTS;

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    saveAchievements(DEFAULT_ACHIEVEMENTS);
    return DEFAULT_ACHIEVEMENTS;
  }

  return JSON.parse(data);
}

export function saveAchievements(
  achievements: Achievement[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(achievements)
  );
}

export function unlockAchievement(id: number) {
  const achievements = getAchievements();

  const achievement = achievements.find(
    (a) => a.id === id
  );

  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;

    saveAchievements(achievements);

    return achievement;
  }

  return null;
}