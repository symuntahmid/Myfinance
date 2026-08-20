
import {
  getMonthlyReport,
  getSummary,
} from "@/app/data/transactions";

import {
  getSpendingAnalysis,
} from "@/app/data/spendingAnalysis";

import type { InsightCandidate } from "@/app/data/insightRegistry";

/* =====================================================
   EMOTIONAL INSIGHTS
===================================================== */

/**
 * Emotional insights are designed to acknowledge
 * the user's financial situation without sounding
 * judgmental, overly positive, or repetitive.
 *
 * These insights should feel human:
 *
 * - difficult month
 * - financial pressure
 * - small progress
 * - rebuilding confidence
 * - consistency
 * - awareness
 *
 * They are intentionally different from:
 *
 * warning      -> tells the user about a problem
 * opportunity  -> suggests an action
 * motivational -> encourages progress
 * achievement  -> celebrates a result
 * ===================================================== */

export function getEmotionalInsights(): InsightCandidate[] {
  const report = getMonthlyReport();
  const summary = getSummary();
  const spending = getSpendingAnalysis();

  const candidates: InsightCandidate[] = [];

  /* =================================================
     DIFFICULT MONTH
  ================================================= */

  if (report.netCashFlow < 0) {
    candidates.push({
      insight: {
        id: "emotional-difficult-month",
        type: "emotional",

        title:
          "A difficult month doesn't define you",

        message:
          "Money doesn't always behave the way we want it to. One difficult month doesn't determine your financial future.",

        action:
          "Focus on the next decision rather than judging yourself for the past.",

        priority: 82,
      },

      priority: 82,

      family: "financial-pressure",
    });
  }

  /* =================================================
     SPENDING PRESSURE
  ================================================= */

  if (
    spending.income > 0 &&
    spending.spendingRate >= 80 &&
    report.netCashFlow >= 0
  ) {
    candidates.push({
      insight: {
        id: "emotional-spending-pressure",
        type: "emotional",

        title:
          "It can feel like your money disappears quickly",

        message:
          `You've already used about ${Math.round(
            spending.spendingRate
          )}% of your income this month.`,

        action:
          "Don't try to fix everything at once. One intentional change is enough to start.",

        priority: 70,
      },

      priority: 70,

      family: "financial-pressure",
    });
  }

  /* =================================================
     NO POSITIVE SAVINGS GAP
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate <= 0 &&
    report.netCashFlow >= 0
  ) {
    candidates.push({
      insight: {
        id: "emotional-no-savings-gap",
        type: "emotional",

        title:
          "It's okay to start small",

        message:
          "Not having much left to save doesn't mean you're failing. It simply shows where your current cash flow is going.",

        action:
          "Start with an amount that feels almost too easy to save, then build from there.",

        priority: 68,
      },

      priority: 68,

      family: "savings-emotion",
    });
  }

  /* =================================================
     POSITIVE CASH FLOW
  ================================================= */

  if (
    report.netCashFlow > 0 &&
    report.savingsRate > 0
  ) {
    candidates.push({
      insight: {
        id: "emotional-financial-progress",
        type: "emotional",

        title:
          "You're creating breathing room",

        message:
          `After your current income and expenses, you still have a positive financial gap of ${money(
            report.netCashFlow
          )}.`,

        action:
          "Protect that breathing room. Financial confidence grows when small gaps become consistent habits.",

        priority: 64,
      },

      priority: 64,

      family: "financial-progress",
    });
  }

  /* =================================================
     FIRST FINANCIAL FOUNDATION
  ================================================= */

  if (
    summary.netWorth > 0 &&
    report.totalTransactions >= 3
  ) {
    candidates.push({
      insight: {
        id: "emotional-financial-foundation",
        type: "emotional",

        title:
          "You're starting to build something real",

        message:
          `Your current net worth is ${money(
            summary.netWorth
          )}. Even small financial foundations can become meaningful over time.`,

        action:
          "Keep making decisions you can repeat, not decisions that only work once.",

        priority: 62,
      },

      priority: 62,

      family: "financial-progress",
    });
  }

  /* =================================================
     FINANCIAL AWARENESS
  ================================================= */

  if (report.totalTransactions >= 5) {
    candidates.push({
      insight: {
        id: "emotional-financial-awareness",
        type: "emotional",

        title:
          "You're becoming more aware of your money",

        message:
          `You've tracked ${report.totalTransactions} financial activities this month. Awareness is often the first step toward changing a pattern.`,

        action:
          "Keep observing your behavior without judging yourself for it.",

        priority: 58,
      },

      priority: 58,

      family: "financial-awareness",
    });
  }

  /* =================================================
     RECENT SPENDING REDUCTION
  ================================================= */

  const improvedCategory =
    spending.categories
      .filter(
        (category) =>
          category.previousAmount > 0 &&
          category.changeAmount < 0
      )
      .sort(
        (a, b) =>
          a.changeAmount - b.changeAmount
      )[0];

  if (improvedCategory) {
    const reduction =
      Math.abs(
        improvedCategory.changeAmount
      );

    if (reduction >= 200) {
      candidates.push({
        insight: {
          id: "emotional-small-win",
          type: "emotional",

          title:
            "Small changes are already showing up",

          message:
            `Your ${improvedCategory.category} spending is down ${money(
              reduction
            )} compared with last month.`,

          action:
            "Notice the improvement instead of waiting for a perfect financial month.",

          priority: 60,
        },

        priority: 60,

        category:
          improvedCategory.category,

        family: "small-financial-wins",
      });
    }
  }

  return candidates;
}

/* =====================================================
   MONEY FORMATTER
===================================================== */

function money(value: number): string {
  return `৳${Math.round(
    value
  ).toLocaleString()}`;
}