import {
  getMonthlyReport,
} from "@/app/data/transactions";

import type { AIInsight } from "../aiInsights";
import type { InsightCandidate } from "../insightRegistry";

/* =====================================================
   SAVING INSIGHTS
===================================================== */

/**
 * Saving-focused conditional AI insights.
 *
 * This file only handles:
 * - Savings rate
 * - Positive/negative saving gap
 * - Saving opportunities
 * - Saving consistency
 *
 * The final number of insights is handled by
 * the central Insight Selection Engine.
 */

/* =====================================================
   HELPERS
===================================================== */

function money(value: number) {
  return `৳${Math.round(
    value
  ).toLocaleString()}`;
}

function percent(value: number) {
  return `${Math.round(value)}%`;
}

/* =====================================================
   MAIN
===================================================== */

export function getSavingInsights(): InsightCandidate[] {
  const report =
    getMonthlyReport();

  const candidates: InsightCandidate[] = [];

  /* =================================================
     1. NO SAVINGS
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate <= 0
  ) {
    const insight: AIInsight = {
      id: "saving-no-positive-gap",

      type: "opportunity",

      title:
        "Your next financial win could be creating a savings gap",

      message:
        "You're not currently keeping any positive portion of your income this month.",

      action:
        "Try setting aside even a small amount before your next expense.",

      priority: 96,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-gap",
    });
  }

  /* =================================================
     2. VERY LOW SAVING RATE
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate > 0 &&
    report.savingsRate < 10
  ) {
    const insight: AIInsight = {
      id: "low-saving-rate",

      type: "opportunity",

      title:
        "Your savings habit has room to grow",

      message:
        `You're currently keeping about ${percent(
          report.savingsRate
        )} of your income.`,

      action:
        "Try increasing your savings slightly rather than making a drastic spending cut.",

      priority: 88,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-rate",
    });
  }

  /* =================================================
     3. HEALTHY SAVING RATE
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate >= 20
  ) {
    const insight: AIInsight = {
      id: "healthy-saving-rate",

      type: "achievement",

      title:
        "You're building a strong saving habit",

      message:
        `You're currently keeping ${percent(
          report.savingsRate
        )} of your income.`,

      action:
        "Consistency matters more than perfection. Keep protecting this saving habit.",

      priority: 86,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-rate",
    });
  }

  /* =================================================
     4. STRONG SAVING RATE
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate >= 30
  ) {
    const insight: AIInsight = {
      id: "excellent-saving-rate",

      type: "motivational",

      title:
        "You're creating serious financial momentum",

      message:
        `You're currently keeping ${percent(
          report.savingsRate
        )} of your income.`,

      action:
        "Protect this gap and give your savings a clear purpose such as an emergency fund, investment, or major goal.",

      priority: 82,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-rate",
    });
  }

  /* =================================================
     5. POSITIVE SAVINGS GAP
  ================================================= */

  if (
    report.netCashFlow > 0
  ) {
    const savedAmount =
      report.netCashFlow;

    if (savedAmount >= 500) {
      const insight: AIInsight = {
        id: "positive-saving-gap",

        type: "achievement",

        title:
          "You created a positive savings gap",

        message:
          `After your current income and expenses, you have roughly ${money(
            savedAmount
          )} left this month.`,

        action:
          "Consider protecting part of this amount instead of letting it disappear into unplanned spending.",

        priority: 78,

        category: "saving",
      };

      candidates.push({
        insight,

        priority:
          insight.priority,

        category: "saving",

        family: "saving-gap",
      });
    }
  }

  /* =================================================
     6. SMALL POSITIVE GAP
  ================================================= */

  if (
    report.income > 0 &&
    report.netCashFlow > 0 &&
    report.netCashFlow < 500
  ) {
    const insight: AIInsight = {
      id: "small-saving-gap",

      type: "motivational",

      title:
        "You're starting to create a saving habit",

      message:
        `You currently have about ${money(
          report.netCashFlow
        )} left after your expenses.`,

      action:
        "Even a small positive gap is progress. Try protecting it before your next expense.",

      priority: 70,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-gap",
    });
  }

  /* =================================================
     7. SAVING RATE IMPROVEMENT TARGET
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate >= 10 &&
    report.savingsRate < 20
  ) {
    const targetAmount =
      report.income * 0.2;

    const currentSaved =
      report.income *
      (report.savingsRate / 100);

    const additionalNeeded =
      targetAmount -
      currentSaved;

    if (
      additionalNeeded > 0
    ) {
      const insight: AIInsight = {
        id: "saving-rate-next-step",

        type: "opportunity",

        title:
          "You're closer to a stronger saving rate",

        message:
          `You're saving about ${percent(
            report.savingsRate
          )} of your income. Reaching 20% would require roughly ${money(
            additionalNeeded
          )} more.`,

        action:
          "Look for one realistic spending adjustment instead of trying to cut everything at once.",

        priority: 74,

        category: "saving",
      };

      candidates.push({
        insight,

        priority:
          insight.priority,

        category: "saving",

        family: "saving-rate-next-step",
      });
    }
  }

  /* =================================================
     8. SAVING MOMENTUM
  ================================================= */

  if (
    report.income > 0 &&
    report.savingsRate >= 20 &&
    report.netCashFlow > 0
  ) {
    const insight: AIInsight = {
      id: "saving-momentum",

      type: "motivational",

      title:
        "Your cash flow is supporting your savings",

      message:
        `You're keeping ${percent(
          report.savingsRate
        )} of your income while maintaining positive cash flow.`,

      action:
        "Keep this structure consistent and consider giving the saved money a specific job.",

      priority: 68,

      category: "saving",
    };

    candidates.push({
      insight,

      priority:
        insight.priority,

      category: "saving",

      family: "saving-momentum",
    });
  }

  return candidates;
}