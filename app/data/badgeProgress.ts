import { badges, Badge } from "./badges";
import { getTransactions } from "./transactions";
import { getPlayer, addXP } from "./player";
import { getPortfolioSummary } from "./investments";
import {
  hasClaimedBadgeReward,
  claimBadgeReward,
} from "./badgeRewards";

export type BadgeProgress = {
  badge: Badge;
  current: number;
  target: number;
  progress: number;
  unlocked: boolean;
};

function getMonthKey(date: string) {
  const value = new Date(date);

  return `${value.getFullYear()}-${String(
    value.getMonth() + 1
  ).padStart(2, "0")}`;
}

/* ==========================================
   SAVING
========================================== */

function getTotalSaved() {
  const transactions = getTransactions();

  const monthlySavings: Record<string, number> = {};

  transactions.forEach((transaction) => {
    const month = getMonthKey(transaction.date);

    if (!monthlySavings[month]) {
      monthlySavings[month] = 0;
    }

    if (transaction.type === "Income") {
      monthlySavings[month] += transaction.amount;
    }

    if (transaction.type === "Expense") {
      monthlySavings[month] -= transaction.amount;
    }

    /*
     * Investment purchases are not counted as savings.
     * They are handled by the Investment badge system.
     */
    if (transaction.type === "Investment") {
      return;
    }
  });

  /*
   * Only positive monthly savings count.
   *
   * Example:
   *
   * January: +$300 → $300 saved
   * February: -$100 → $0 saved
   * March: +$500 → $500 saved
   *
   * Total saved = $800
   */
  return Object.values(monthlySavings).reduce(
    (total, amount) =>
      total + Math.max(amount, 0),
    0
  );
}

/* ==========================================
   SAVING STREAK
========================================== */

function getSavingStreakMonths() {
  const transactions = getTransactions();

  const monthlySavings: Record<string, number> = {};

  transactions.forEach((transaction) => {
    const month = getMonthKey(transaction.date);

    if (!monthlySavings[month]) {
      monthlySavings[month] = 0;
    }

    if (transaction.type === "Income") {
      monthlySavings[month] += transaction.amount;
    }

    if (transaction.type === "Expense") {
      monthlySavings[month] -= transaction.amount;
    }
  });

  const positiveMonths = Object.entries(
    monthlySavings
  )
    .filter(([, amount]) => amount > 0)
    .map(([month]) => month)
    .sort();

  if (positiveMonths.length === 0) {
    return 0;
  }

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < positiveMonths.length; i++) {
    const previous = new Date(
      `${positiveMonths[i - 1]}-01`
    );

    const current = new Date(
      `${positiveMonths[i]}-01`
    );

    const monthDifference =
      (current.getFullYear() -
        previous.getFullYear()) *
        12 +
      (current.getMonth() -
        previous.getMonth());

    if (monthDifference === 1) {
      currentStreak++;
      longestStreak = Math.max(
        longestStreak,
        currentStreak
      );
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/* ==========================================
   INVESTMENT
========================================== */

function getInvestmentProgress() {
  const transactions = getTransactions();
  const portfolio = getPortfolioSummary();

  const investmentTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "Investment"
    );

  /*
   * Total amount invested.
   */
  const totalInvested =
    investmentTransactions.reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  /*
   * Has the user ever invested?
   */
  const firstInvestment =
    investmentTransactions.length > 0
      ? 1
      : 0;

  /*
   * We cannot calculate diversification
   * from getPortfolioSummary() because it only
   * returns summary values, not individual assets.
   *
   * For now, use investment categories from
   * transactions when available.
   */
  const assetTypes = new Set<string>();

  investmentTransactions.forEach(
    (transaction) => {
      const type =
        transaction.category?.trim();

      if (type) {
        assetTypes.add(type);
      }

      /*
       * Some transactions may use source
       * as the investment type.
       */
      if (
        transaction.source &&
        transaction.source !== "Available Cash"
      ) {
        assetTypes.add(
          transaction.source.trim()
        );
      }
    }
  );

  return {
    totalInvested,

    firstInvestment,

    assetTypes: assetTypes.size,

    portfolioValue:
      portfolio.current,
  };
}

/* ==========================================
   PSYCHOLOGY
========================================== */

function getPsychologyProgress() {
  const transactions = getTransactions();

  /*
   * Number of different days with financial activity.
   */
  const activeDays = new Set(
    transactions.map(
      (transaction) =>
        transaction.date
    )
  );

  /*
   * Longest consecutive financial-activity streak.
   */
  const sortedDays = [...activeDays].sort();

  let longestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const previous = new Date(
        sortedDays[i - 1]
      );

      const current = new Date(
        sortedDays[i]
      );

      const difference =
        Math.round(
          (current.getTime() -
            previous.getTime()) /
            (1000 * 60 * 60 * 24)
        );

      if (difference === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(
      longestStreak,
      currentStreak
    );
  }

  /*
   * Number of months where the user
   * had financial activity.
   */
  const activeMonths = new Set(
    transactions.map(
      (transaction) =>
        getMonthKey(transaction.date)
    )
  );

  /*
   * Monthly financial health improvement
   * will be connected later when we store
   * historical health scores.
   */
  const improvingMonths = 0;

  return {
    activeDays: activeDays.size,
    activeMonths: activeMonths.size,
    longestStreak,
    improvingMonths,
  };
}

/* ==========================================
   GET ALL BADGE PROGRESS
========================================== */

export function getBadgeProgress(): BadgeProgress[] {
  const player = getPlayer();

  const totalSaved =
    getTotalSaved();

  const savingStreak =
    getSavingStreakMonths();

  const investment =
    getInvestmentProgress();

  const psychology =
    getPsychologyProgress();

  return badges.map((badge) => {
    let current = 0;

    switch (badge.id) {
      /* POINTS */

      case "getting-started":
      case "momentum":
      case "money-master":
      case "financial-champion":
        current = player.xp;
        break;

      /* SAVING */

      case "first-saver":
      case "safety-builder":
        current = totalSaved;
        break;

      case "saving-streak":
        current = savingStreak;
        break;

      case "emergency-ready":
        /*
         * Emergency fund tracking will be connected
         * when the emergency-fund feature exists.
         */
        current = 0;
        break;

      /* INVESTMENT */

      case "first-investor":
        current =
          investment.firstInvestment;
        break;

      case "portfolio-builder":
        current =
          investment.totalInvested;
        break;

      case "long-term-thinker":
        /*
         * Investment age tracking will be connected
         * from investment purchase dates next.
         */
        current = 0;
        break;

      case "diversifier":
        current =
          investment.assetTypes;
        break;

      /* PSYCHOLOGY */

      case "goal-focused":
        /*
         * Goal tracking will be connected
         * when goal history is available.
         */
        current = 0;
        break;

      case "mindful-spender":
        current =
          psychology.activeDays;
        break;

      case "habit-builder":
        current =
          psychology.longestStreak;
        break;

      case "impulse-controller":
        current =
          psychology.longestStreak;
        break;

      case "growth-mindset":
        current =
          psychology.improvingMonths;
        break;

      /* PREMIUM */

      case "wealth-architect":
        current =
          Number(
            totalSaved >= 1000 &&
            investment.totalInvested >= 1000
          );
        break;

      case "financial-strategist":
        current =
          Number(
            totalSaved >= 1000 &&
            investment.totalInvested >= 1000 &&
            psychology.longestStreak >= 14
          );
        break;

      case "money-psychology-master":
        current =
          Number(
            psychology.longestStreak >= 30 &&
            psychology.activeMonths >= 3
          );
        break;

      default:
        current = 0;
    }

    const target = badge.target;

    const progress =
      target > 0
        ? Math.min(
            (current / target) * 100,
            100
          )
        : 0;

    return {
      badge,
      current,
      target,
      progress,
      unlocked:
        current >= target,
    };
  });
}