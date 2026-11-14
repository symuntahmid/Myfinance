
export type LevelDefinition = {
  level: number;
  title: string;
  icon: string;
  xpRequired: number;
};


export const LEVELS: LevelDefinition[] = [
  {
    level: 1,
    title: "Financial Beginner",
    icon: "🌱",
    xpRequired: 0,
  },
  {
    level: 2,
    title: "Money Aware",
    icon: "👀",
    xpRequired: 100,
  },
  {
    level: 3,
    title: "Expense Tracker",
    icon: "📝",
    xpRequired: 250,
  },
  {
    level: 4,
    title: "Goal Setter",
    icon: "🎯",
    xpRequired: 450,
  },
  {
    level: 5,
    title: "Money Explorer",
    icon: "🧭",
    xpRequired: 700,
  },
  {
    level: 6,
    title: "Safety Builder",
    icon: "🛡️",
    xpRequired: 1000,
  },
  {
    level: 7,
    title: "Smart Saver",
    icon: "💰",
    xpRequired: 1400,
  },
  {
    level: 8,
    title: "Budget Strategist",
    icon: "📊",
    xpRequired: 1900,
  },
  {
    level: 9,
    title: "Habit Builder",
    icon: "🔥",
    xpRequired: 2500,
  },
  {
    level: 10,
    title: "Cash Flow Manager",
    icon: "🏦",
    xpRequired: 3200,
  },
  {
    level: 11,
    title: "Savings Expert",
    icon: "💎",
    xpRequired: 4000,
  },
  {
    level: 12,
    title: "Beginner Investor",
    icon: "📈",
    xpRequired: 5000,
  },
  {
    level: 13,
    title: "Money Strategist",
    icon: "🧠",
    xpRequired: 6200,
  },
  {
    level: 14,
    title: "Financial Balancer",
    icon: "⚖️",
    xpRequired: 7600,
  },
  {
    level: 15,
    title: "Wealth Builder",
    icon: "🚀",
    xpRequired: 9200,
  },
  {
    level: 16,
    title: "Financial Defender",
    icon: "🛡️",
    xpRequired: 11000,
  },
  {
    level: 17,
    title: "Investment Strategist",
    icon: "📈",
    xpRequired: 13000,
  },
  {
    level: 18,
    title: "Financial Planner",
    icon: "🧮",
    xpRequired: 15500,
  },
  {
    level: 19,
    title: "Wealth Manager",
    icon: "💼",
    xpRequired: 18500,
  },
  {
    level: 20,
    title: "Financial Expert",
    icon: "🏆",
    xpRequired: 22000,
  },
  {
    level: 21,
    title: "Wealth Strategist",
    icon: "🧠",
    xpRequired: 26000,
  },
  {
    level: 22,
    title: "Financial Master",
    icon: "👑",
    xpRequired: 30500,
  },
  {
    level: 23,
    title: "Wealth Architect",
    icon: "💎",
    xpRequired: 36000,
  },
  {
    level: 24,
    title: "Capital Builder",
    icon: "🏛️",
    xpRequired: 42000,
  },
  {
    level: 25,
    title: "Financial Visionary",
    icon: "🌎",
    xpRequired: 49000,
  },
  {
    level: 26,
    title: "Wealth Strategist",
    icon: "🔱",
    xpRequired: 57000,
  },
  {
    level: 27,
    title: "Financial Elite",
    icon: "👑",
    xpRequired: 66000,
  },
  {
    level: 28,
    title: "Master Wealth Architect",
    icon: "💠",
    xpRequired: 76000,
  },
  {
    level: 29,
    title: "Financial Legacy Builder",
    icon: "🏰",
    xpRequired: 87500,
  },
  {
    level: 30,
    title: "Financial Independence",
    icon: "🌟",
    xpRequired: 100000,
  },
];

/* Level names in Bangla (the stored title stays English). */

const LEVEL_TITLES_BN: Record<string, string> = {
  "Financial Beginner": "আর্থিক শিক্ষানবিস",
  "Money Aware": "অর্থ-সচেতন",
  "Expense Tracker": "খরচের হিসাবরক্ষক",
  "Goal Setter": "লক্ষ্য-নির্ধারক",
  "Money Explorer": "অর্থ অন্বেষক",
  "Safety Builder": "নিরাপত্তা নির্মাতা",
  "Smart Saver": "স্মার্ট সঞ্চয়ী",
  "Budget Strategist": "বাজেট কৌশলী",
  "Habit Builder": "অভ্যাস গঠনকারী",
  "Cash Flow Manager": "নগদ প্রবাহ ব্যবস্থাপক",
  "Savings Expert": "সঞ্চয় বিশেষজ্ঞ",
  "Beginner Investor": "নবীন বিনিয়োগকারী",
  "Money Strategist": "অর্থ কৌশলী",
  "Financial Balancer": "আর্থিক ভারসাম্যকারী",
  "Wealth Builder": "সম্পদ নির্মাতা",
  "Financial Defender": "আর্থিক রক্ষক",
  "Investment Strategist": "বিনিয়োগ কৌশলী",
  "Financial Planner": "আর্থিক পরিকল্পনাকারী",
  "Wealth Manager": "সম্পদ ব্যবস্থাপক",
  "Financial Expert": "আর্থিক বিশেষজ্ঞ",
  "Wealth Strategist": "সম্পদ কৌশলী",
  "Financial Master": "আর্থিক ওস্তাদ",
  "Wealth Architect": "সম্পদ স্থপতি",
  "Capital Builder": "পুঁজি নির্মাতা",
  "Financial Visionary": "আর্থিক দূরদর্শী",
  "Financial Elite": "আর্থিক অভিজাত",
  "Master Wealth": "সম্পদ সম্রাট",
  "Financial Legacy": "আর্থিক উত্তরাধিকার",
  "Financial Independence": "আর্থিক স্বাধীনতা",
};

export function levelTitle(title: string, language: string): string {
  return language === "bn" ? LEVEL_TITLES_BN[title] ?? title : title;
}
