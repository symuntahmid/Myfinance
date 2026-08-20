import type { AIInsight } from "../aiInsights";
import { getSpendingAnalysis } from "../spendingAnalysis";

/* =====================================================
   HABIT INSIGHTS
===================================================== */

export function getHabitInsights(): AIInsight[] {
  const spending = getSpendingAnalysis();

  const insights: AIInsight[] = [];

  /* =================================================
     FREQUENT CATEGORY PURCHASES
  ================================================= */

  const frequentCategory =
    spending.categories
      .filter(
        (category) =>
          category.transactionCount >= 8 &&
          category.currentAmount > 0
      )
      .sort(
        (a, b) =>
          b.transactionCount -
          a.transactionCount
      )[0];

  if (frequentCategory) {
    insights.push({
      id: "frequent-category-purchases",

      type: "habit",

      title:
        `${frequentCategory.category} is becoming a frequent habit`,

      message:
        `You've made ${frequentCategory.transactionCount} ${frequentCategory.category.toLowerCase()} purchases this month, averaging about ${money(
          frequentCategory.averageTransaction
        )} each.`,

      action:
        "Small repeated purchases can become surprisingly large totals.",

      priority: 65,

      category:
        frequentCategory.category,
    });
  }

  /* =================================================
     WEEKEND SPENDING HABIT
  ================================================= */

  if (
    spending.weekendPercentage >= 35 &&
    spending.weekendExpense >= 500
  ) {
    insights.push({
      id: "weekend-spending-habit",

      type: "habit",

      title:
        "Your weekends are becoming a spending pattern",

      message:
        `${percent(
          spending.weekendPercentage
        )} of your monthly spending happened on weekends.`,

      action:
        "Review your weekend purchases and see which ones were planned versus spontaneous.",

      priority: 60,
    });
  }

  /* =================================================
     MULTIPLE SPENDING CATEGORIES
  ================================================= */

  if (
    spending.categoryCount >= 4
  ) {
    insights.push({
      id: "multiple-spending-categories",

      type: "habit",

      title:
        "You're building a clearer spending habit",

      message:
        `Your expenses are currently spread across ${spending.categoryCount} categories.`,

      action:
        "Keep tracking consistently. Patterns become much easier to spot over time.",

      priority: 50,
    });
  }

  /* =================================================
     REPEATED SMALL PURCHASES
  ================================================= */

  const repeatedSmallPurchase =
    spending.categories
      .filter(
        (category) =>
          category.transactionCount >= 5 &&
          category.averageTransaction > 0 &&
          category.averageTransaction < 500
      )
      .sort(
        (a, b) =>
          b.transactionCount -
          a.transactionCount
      )[0];

  if (repeatedSmallPurchase) {
    insights.push({
      id: "repeated-small-purchases",

      type: "habit",

      title:
        "Small purchases may be adding up",

      message:
        `${repeatedSmallPurchase.category} has ${repeatedSmallPurchase.transactionCount} transactions this month, averaging about ${money(
          repeatedSmallPurchase.averageTransaction
        )} each.`,

      action:
        "Watch the frequency, not just the amount of each purchase.",

      priority: 58,

      category:
        repeatedSmallPurchase.category,
    });
  }

  /* =================================================
     HIGH TRANSACTION FREQUENCY
  ================================================= */

  if (
    spending.transactionCount >= 20
  ) {
    insights.push({
      id: "high-transaction-frequency",

      type: "habit",

      title:
        "You're making a lot of financial decisions",

      message:
        `You've recorded ${spending.transactionCount} expense transactions this month.`,

      action:
        "The more frequently you spend, the more useful it becomes to pause before recurring purchases.",

      priority: 45,
    });
  }

  /* =================================================
     RETURN
  ================================================= */

  return insights.sort(
    (a, b) =>
      b.priority - a.priority
  );
}

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