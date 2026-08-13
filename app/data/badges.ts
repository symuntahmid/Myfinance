export type BadgeCategory =
  | "Points"
  | "Saving"
  | "Investment"
  | "Psychology"
  | "Premium";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirement: string;

  // Value needed to unlock the badge.
  // The meaning depends on the category.
  target: number;

  premium: boolean;
};

export const badges: Badge[] = [

  /* ==========================================
     POINTS
  ========================================== */

  {
    id: "getting-started",
    name: "Getting Started",
    description:
      "You took your first step on your financial journey.",
    icon: "🌱",
    category: "Points",
    requirement: "Earn 100 XP",
    target: 100,
    premium: false,
  },

  {
    id: "momentum",
    name: "Momentum",
    description:
      "You're building consistency and gaining financial momentum.",
    icon: "⚡",
    category: "Points",
    requirement: "Earn 500 XP",
    target: 500,
    premium: false,
  },

  {
    id: "money-master",
    name: "Money Master",
    description:
      "Your financial knowledge and habits are becoming stronger.",
    icon: "🏆",
    category: "Points",
    requirement: "Earn 1,000 XP",
    target: 1000,
    premium: false,
  },

  {
    id: "financial-champion",
    name: "Financial Champion",
    description:
      "You've reached an elite milestone in your financial journey.",
    icon: "👑",
    category: "Points",
    requirement: "Earn 5,000 XP",
    target: 5000,
    premium: false,
  },


  /* ==========================================
     SAVING
  ========================================== */

  {
    id: "first-saver",
    name: "First Saver",
    description:
      "You started building the habit of paying yourself first.",
    icon: "🐿️",
    category: "Saving",
    requirement: "Save your first $100",
    target: 100,
    premium: false,
  },

  {
    id: "safety-builder",
    name: "Safety Builder",
    description:
      "You're creating a stronger financial safety net.",
    icon: "🛡️",
    category: "Saving",
    requirement: "Save $1,000",
    target: 1000,
    premium: false,
  },

  {
    id: "saving-streak",
    name: "Saving Streak",
    description:
      "Consistency is becoming part of your financial identity.",
    icon: "🔥",
    category: "Saving",
    requirement: "Save money for 3 consecutive months",
    target: 3,
    premium: false,
  },

  {
    id: "emergency-ready",
    name: "Emergency Ready",
    description:
      "You've built a meaningful financial buffer for unexpected moments.",
    icon: "🏦",
    category: "Saving",
    requirement: "Reach your emergency-fund target",
    target: 1,
    premium: false,
  },


  /* ==========================================
     INVESTMENT
  ========================================== */

  {
    id: "first-investor",
    name: "First Investor",
    description:
      "You made your first move toward growing your wealth.",
    icon: "🌱",
    category: "Investment",
    requirement: "Make your first investment",
    target: 1,
    premium: false,
  },

  {
    id: "portfolio-builder",
    name: "Portfolio Builder",
    description:
      "You're moving from saving money to growing it.",
    icon: "📊",
    category: "Investment",
    requirement: "Invest a total of $1,000",
    target: 1000,
    premium: false,
  },

  {
    id: "long-term-thinker",
    name: "Long-Term Thinker",
    description:
      "You understand that wealth building takes patience.",
    icon: "🧠",
    category: "Investment",
    requirement: "Maintain an investment for 12 months",
    target: 12,
    premium: false,
  },

  {
    id: "diversifier",
    name: "Diversifier",
    description:
      "You're learning not to put all your financial eggs in one basket.",
    icon: "💎",
    category: "Investment",
    requirement: "Invest across 3 asset types",
    target: 3,
    premium: false,
  },


  /* ==========================================
     PSYCHOLOGY / BEHAVIOR
  ========================================== */

  {
    id: "goal-focused",
    name: "Goal Focused",
    description:
      "You consistently make financial decisions with a goal in mind.",
    icon: "🎯",
    category: "Psychology",
    requirement: "Maintain a financial goal for 30 days",
    target: 30,
    premium: false,
  },

  {
    id: "mindful-spender",
    name: "Mindful Spender",
    description:
      "You're becoming more intentional about where your money goes.",
    icon: "🧘",
    category: "Psychology",
    requirement: "Track spending consistently for 30 days",
    target: 30,
    premium: false,
  },

  {
    id: "habit-builder",
    name: "Habit Builder",
    description:
      "Small financial actions are becoming consistent habits.",
    icon: "🔄",
    category: "Psychology",
    requirement: "Record financial activity for 14 consecutive days",
    target: 14,
    premium: false,
  },

  {
    id: "impulse-controller",
    name: "Impulse Controller",
    description:
      "You are learning to pause before making unnecessary purchases.",
    icon: "🛑",
    category: "Psychology",
    requirement: "Maintain an intentional spending streak",
    target: 30,
    premium: false,
  },

  {
    id: "growth-mindset",
    name: "Growth Mindset",
    description:
      "Your financial behavior continues to improve over time.",
    icon: "🌿",
    category: "Psychology",
    requirement: "Improve your financial score for 3 consecutive months",
    target: 3,
    premium: false,
  },


  /* ==========================================
     PREMIUM
  ========================================== */

  {
    id: "wealth-architect",
    name: "Wealth Architect",
    description:
      "Build a strong combination of saving, investing, and financial consistency.",
    icon: "🏛️",
    category: "Premium",
    requirement:
      "Reach strong milestones across saving and investing",
    target: 1,
    premium: true,
  },

  {
    id: "financial-strategist",
    name: "Financial Strategist",
    description:
      "Your financial decisions show consistency across multiple areas.",
    icon: "♟️",
    category: "Premium",
    requirement:
      "Maintain strong saving, investment, and goal habits",
    target: 1,
    premium: true,
  },

  {
    id: "money-psychology-master",
    name: "Money Psychology Master",
    description:
      "You've developed sustained, intentional financial behavior.",
    icon: "🧠",
    category: "Premium",
    requirement:
      "Maintain healthy financial habits over an extended period",
    target: 1,
    premium: true,
  },

];