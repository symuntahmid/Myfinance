import {
  getSummary,
  getMonthlyReport,
  getFinancialHealthScore,
} from "@/app/data/transactions";

import {
  getPortfolioSummary,
} from "@/app/data/investments";

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

  const basePlayer = saved
    ? {
        ...DEFAULT_PLAYER,
        ...JSON.parse(saved),
      }
    : DEFAULT_PLAYER;

  const summary = getSummary();
  const report = getMonthlyReport();
  const portfolio = getPortfolioSummary();

  return {
    ...basePlayer,

    /* --------------------------------------
       LIVE MONEY DATA
    -------------------------------------- */

    // getSummary().netWorth already includes
    // the current investment portfolio.
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
  const player = getPlayer();

  player.xp += amount;

  savePlayer(player);
}


/* ==========================================
   LEVEL
========================================== */

export function getLevel() {
  const player = getPlayer();

  const level =
    Math.floor(player.xp / 100) + 1;

  const currentXP =
    player.xp % 100;

  return {
    level,
    currentXP,
    nextLevelXP: 100,
    percent: currentXP,
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
   *
   * If the user has no financial activity yet,
   * return 0 and let the UI explain that there
   * is not enough data.
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