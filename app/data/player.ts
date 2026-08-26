import {
  getSummary,
  getMonthlyReport,
  getFinancialHealthScore,
} from "@/app/data/transactions";

import { getPortfolioSummary } from "@/app/data/investments";

import { LEVELS } from "@/app/data/levels";

export type Player = {
  name: string;

  xp: number;

  wealthScore: number;

  streak: number;

  achievements: number;

  netWorth: number;

  monthlyCashFlow: number;

  savingRate: number;

  investments: number;
};

const STORAGE_KEY = "myfinance-player";

const DEFAULT_PLAYER: Player = {
  name: "Symun",

  xp: 0,

  wealthScore: 0,

  streak: 1,

  achievements: 0,

  netWorth: 0,

  monthlyCashFlow: 0,

  savingRate: 0,

  investments: 0,
};

/* ==========================================
   PLAYER
========================================== */

export function getPlayer(): Player {
  if (typeof window === "undefined") {
    return DEFAULT_PLAYER;
  }

  const saved = localStorage.getItem(
    STORAGE_KEY
  );

  let basePlayer: Player;

  try {
    basePlayer = saved
      ? {
          ...DEFAULT_PLAYER,
          ...JSON.parse(saved),
        }
      : DEFAULT_PLAYER;
  } catch {
    basePlayer = DEFAULT_PLAYER;
  }

  const summary = getSummary();
  const report = getMonthlyReport();
  const portfolio = getPortfolioSummary();

  return {
    ...basePlayer,

    /* --------------------------------------
       LIVE MONEY DATA
    -------------------------------------- */

    netWorth: summary.netWorth,

    monthlyCashFlow:
      report.savings,

    savingRate: Math.round(
      report.savingsRate
    ),

    /* --------------------------------------
       LIVE INVESTMENT DATA
    -------------------------------------- */

    investments:
      portfolio.current,

    /* --------------------------------------
       COMBINED WEALTH SCORE
    -------------------------------------- */

    wealthScore: Math.round(
      Math.min(
        getFinancialHealthScore() +
          portfolio.returnPercentage / 5,
        100
      )
    ),
  };
}


/* ==========================================
   SAVE PLAYER
========================================== */

export function savePlayer(
  player: Player
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(player)
  );

  window.dispatchEvent(
    new Event("player-updated")
  );
}


/* ==========================================
   XP
========================================== */

export function addXP(amount: number) {

  if (amount <= 0) {
    return;
  }

  const player = getPlayer();

  player.xp += amount;

  savePlayer(player);
}


/* ==========================================
   STREAK
========================================== */

export function updateStreak(
  streak: number
) {

  if (streak < 0) {
    return;
  }

  const player = getPlayer();

  player.streak = streak;

  savePlayer(player);
}


/* ==========================================
   LEVEL
========================================== */

export function getLevel() {
  const player = getPlayer();

  /*
   * Find the highest level whose XP requirement
   * has been reached.
   */

  let currentLevel = LEVELS[0];

  for (const level of LEVELS) {
    if (player.xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }

  /*
   * Find the next level.
   */

  const currentIndex =
    LEVELS.findIndex(
      (level) =>
        level.level === currentLevel.level
    );

  const nextLevel =
    LEVELS[currentIndex + 1] ?? null;

  /*
   * XP progress inside the current level.
   */

  const currentLevelXP =
    player.xp - currentLevel.xpRequired;

  const xpNeededForNextLevel =
    nextLevel
      ? nextLevel.xpRequired -
        currentLevel.xpRequired
      : 0;

  const percent =
    nextLevel && xpNeededForNextLevel > 0
      ? Math.min(
          Math.round(
            (currentLevelXP /
              xpNeededForNextLevel) *
              100
          ),
          100
        )
      : 100;

  return {
    level: currentLevel.level,

    title: currentLevel.title,

    icon: currentLevel.icon,

    currentXP: currentLevelXP,

    totalXP: player.xp,

    nextLevelXP:
      nextLevel?.xpRequired ?? currentLevel.xpRequired,

    xpToNextLevel: nextLevel
      ? Math.max(
          nextLevel.xpRequired -
            player.xp,
          0
        )
      : 0,

    percent,

    isMaxLevel:
      nextLevel === null,
  };
}


/* ==========================================
   FINANCIAL HEALTH
========================================== */

export function getFinancialHealth() {
  const player = getPlayer();

  /*
   * A completely new account should not be
   * classified as "Critical".
   */

  const hasFinancialData =
    player.monthlyCashFlow !== 0 ||
    player.savingRate !== 0 ||
    player.investments !== 0 ||
    player.netWorth !== 0 ||
    player.xp !== 0;

  if (!hasFinancialData) {
    return 0;
  }

  let score = 0;

  /* --------------------------------------
     SAVING RATE — 25 POINTS
  -------------------------------------- */

  score += Math.min(
    Math.max(player.savingRate, 0),
    25
  );

  /* --------------------------------------
     POSITIVE CASH FLOW — 20 POINTS
  -------------------------------------- */

  if (player.monthlyCashFlow > 0) {
    score += 20;
  }

  /* --------------------------------------
     INVESTMENT SIZE — 20 POINTS
  -------------------------------------- */

  score += Math.min(
    player.investments / 1000,
    20
  );

  /* --------------------------------------
     NET WORTH — 20 POINTS
  -------------------------------------- */

  score += Math.min(
    Math.max(player.netWorth, 0) / 5000,
    20
  );

  /* --------------------------------------
     XP / FINANCIAL HABIT ACTIVITY — 15 POINTS
  -------------------------------------- */

  score += Math.min(
    player.xp / 10,
    15
  );

  return Math.round(
    Math.min(score, 100)
  );
}