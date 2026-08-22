import {
  getMonthlyReport,
  getSummary,
} from "@/app/data/transactions";

import {
  getPortfolioSummary,
} from "@/app/data/investments";

import type { AIInsight } from "@/app/data/types/AIInsight";


/* =====================================================
   ACHIEVEMENT INSIGHTS
===================================================== */


function money(value: number) {
  return `৳${Math.round(value).toLocaleString()}`;
}


function percent(value: number) {
  return `${Math.round(value)}%`;
}


/* =====================================================
   TYPES
===================================================== */

export type AchievementInsightRule = {
  id: string;

  priority: number;

  check: () => AIInsight | null;
};


/* =====================================================
   ACHIEVEMENT RULES
===================================================== */

export const achievementInsightRules: AchievementInsightRule[] = [

  {
    id: "achievement-positive-cash-flow",

    priority: 80,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.netCashFlow <= 0) {
        return null;
      }


      return {
        id: "achievement-positive-cash-flow",

        type: "achievement",

        title:
          "You're ending the month in the green",

        message:
          `You currently have ${money(
            report.netCashFlow
          )} of positive cash flow this month.`,

        action:
          "Protect this gap and keep building on it.",

        priority: 80,

        category:
          "cash-flow",
      };
    },
  },


  {
    id: "achievement-saving-rate",

    priority: 85,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.savingsRate < 20) {
        return null;
      }


      return {
        id: "achievement-saving-rate",

        type: "achievement",

        title:
          "You're building a strong saving habit",

        message:
          `You're currently keeping about ${percent(
            report.savingsRate
          )} of your income.`,

        action:
          "Consistency is what turns saving into long-term financial progress.",

        priority: 85,

        category:
          "saving",
      };
    },
  },


  {
    id: "achievement-excellent-saving-rate",

    priority: 95,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.savingsRate < 30) {
        return null;
      }


      return {
        id: "achievement-excellent-saving-rate",

        type: "achievement",

        title:
          "You're saving a significant part of your income",

        message:
          `About ${percent(
            report.savingsRate
          )} of your income is currently staying with you.`,

        action:
          "Keep this habit sustainable rather than trying to make it perfect.",

        priority: 95,

        category:
          "saving",
      };
    },
  },


  {
    id: "achievement-positive-net-worth",

    priority: 65,

    check: () => {

      const summary =
        getSummary();


      if (summary.netWorth <= 0) {
        return null;
      }


      return {
        id: "achievement-positive-net-worth",

        type: "achievement",

        title:
          "You're building a financial foundation",

        message:
          `Your current net worth is ${money(
            summary.netWorth
          )}.`,

        action:
          "Keep improving the decisions that strengthen your financial position over time.",

        priority: 65,

        category:
          "net-worth",
      };
    },
  },


  {
    id: "achievement-investment-progress",

    priority: 70,

    check: () => {

      const portfolio =
        getPortfolioSummary();


      if (portfolio.current <= 0) {
        return null;
      }


      return {
        id: "achievement-investment-progress",

        type: "achievement",

        title:
          "Your money is starting to work for you",

        message:
          `Your investment portfolio is currently worth ${money(
            portfolio.current
          )}.`,

        action:
          "Focus on consistent long-term investing rather than short-term noise.",

        priority: 70,

        category:
          "investment",
      };
    },
  },


  {
    id: "achievement-tracking-consistency",

    priority: 50,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.totalTransactions < 5) {
        return null;
      }


      return {
        id: "achievement-tracking-consistency",

        type: "achievement",

        title:
          "You're becoming more aware of your money",

        message:
          `You've tracked ${report.totalTransactions} financial activities this month.`,

        action:
          "Keep tracking consistently. Awareness is the first step toward control.",

        priority: 50,

        category:
          "tracking",
      };
    },
  },


  {
    id: "achievement-strong-tracking",

    priority: 60,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.totalTransactions < 15) {
        return null;
      }


      return {
        id: "achievement-strong-tracking",

        type: "achievement",

        title:
          "You're taking your financial tracking seriously",

        message:
          `You've recorded ${report.totalTransactions} financial activities this month.`,

        action:
          "Keep the habit alive. Better data creates better financial decisions.",

        priority: 60,

        category:
          "tracking",
      };
    },
  },


  {
    id: "achievement-income",

    priority: 45,

    check: () => {

      const report =
        getMonthlyReport();


      if (report.income <= 0) {
        return null;
      }


      return {
        id: "achievement-income",

        type: "achievement",

        title:
          "You've created income this month",

        message:
          `You've brought in ${money(
            report.income
          )} this month.`,

        action:
          "Give every part of that income a clear purpose before it disappears into spending.",

        priority: 45,

        category:
          "income",
      };
    },
  },


  {
    id: "achievement-financial-foundation",

    priority: 55,

    check: () => {

      const summary =
        getSummary();

      const report =
        getMonthlyReport();


      if (
        summary.netWorth <= 0 ||
        report.netCashFlow <= 0
      ) {
        return null;
      }


      return {
        id: "achievement-financial-foundation",

        type: "achievement",

        title:
          "You're strengthening your financial foundation",

        message:
          `You currently have positive net worth and ${money(
            report.netCashFlow
          )} of positive monthly cash flow.`,

        action:
          "Keep protecting both your assets and your monthly cash-flow gap.",

        priority: 55,

        category:
          "financial-health",
      };
    },
  },

];