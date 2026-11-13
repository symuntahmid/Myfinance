import type { AIInsight } from "../insightTypes";

/* =====================================================
   SAVING INSIGHTS
===================================================== */

/**
 * Saving insights focus only on:
 *
 * - Positive savings
 * - Strong savings rate
 * - No savings
 * - Savings improvement
 * - Savings opportunity
 *
 * This file should remain independent from:
 *
 * - Spending
 * - Investments
 * - Goals
 * - Habits
 * - Emotional insights
 * - Funny insights
 */

/* =====================================================
   TYPES
===================================================== */

export type SavingInsightContext = {
  income: number;
  expense: number;
  netCashFlow: number;
  savings: number;
  savingsRate: number;

  previousSavings?: number;
  previousSavingsRate?: number;
};

/* =====================================================
   HELPERS
===================================================== */

function money(value: number) {
  return `৳${Math.round(value).toLocaleString()}`;
}

function percent(value: number) {
  return `${Math.round(value)}%`;
}

/* =====================================================
   SAVING RULES
===================================================== */

export function getSavingInsights(
  context: SavingInsightContext
): AIInsight[] {
  const {
    income,
    expense,
    netCashFlow,
    savings,
    savingsRate,
    previousSavings = 0,
    previousSavingsRate = 0,
  } = context;

  const insights: AIInsight[] = [];

  /* =================================================
     STRONG SAVINGS RATE
  ================================================= */

  if (income > 0 && savingsRate >= 20) {
    insights.push({
      id: "strong-saving-rate",

      type: "achievement",

      title:
        "You're building real financial momentum",

      message:
        `You're currently keeping ${percent(
          savingsRate
        )} of your income.`,

      action:
        "Consistency matters more than perfection. Keep protecting this saving habit.",

      priority: 85,
    });
  }

  /* =================================================
     EXCELLENT SAVINGS RATE
  ================================================= */

  if (income > 0 && savingsRate >= 30) {
    insights.push({
      id: "excellent-saving-rate",

      type: "achievement",

      title:
        "You're saving at a strong rate",

      message:
        `${percent(
          savingsRate
        )} of your income is currently staying with you instead of being spent.`,

      action:
        "Keep this rate sustainable and consider directing part of the savings toward long-term goals.",

      priority: 90,
    });
  }

  /* =================================================
     POSITIVE SAVINGS
  ================================================= */

  if (
    income > 0 &&
    savings > 0 &&
    savingsRate > 0 &&
    savingsRate < 20
  ) {
    insights.push({
      id: "positive-savings",

      type: "achievement",

      title:
        "You're creating a savings gap",

      message:
        `You've kept ${money(
          savings
        )} from your income this month.`,

      action:
        "Even a small positive savings gap can become meaningful when you repeat it consistently.",

      priority: 70,
    });
  }

  /* =================================================
     NO SAVINGS
  ================================================= */

  if (
    income > 0 &&
    savingsRate <= 0 &&
    netCashFlow <= 0
  ) {
    insights.push({
      id: "no-savings",

      type: "opportunity",

      title:
        "Your next opportunity is hiding in your cash flow",

      message:
        "You haven't created a positive savings gap this month yet.",

      action:
        "Try setting aside even a small amount before your next expense.",

      priority: 92,
    });
  }

  /* =================================================
     LOW SAVINGS RATE
  ================================================= */

  if (
    income > 0 &&
    savingsRate > 0 &&
    savingsRate < 10
  ) {
    insights.push({
      id: "low-saving-rate",

      type: "opportunity",

      title:
        "A small saving habit could make a difference",

      message:
        `You're currently keeping about ${percent(
          savingsRate
        )} of your income.`,

      action:
        "Try increasing your savings slightly rather than making a drastic cut to your lifestyle.",

      priority: 78,
    });
  }

  /* =================================================
     SAVINGS IMPROVED
  ================================================= */

  if (
    income > 0 &&
    previousSavings > 0 &&
    savings > previousSavings &&
    savings - previousSavings >= 100
  ) {
    const increase =
      savings - previousSavings;

    insights.push({
      id: "saving-improved",

      type: "motivational",

      title:
        "Your saving habit is improving",

      message:
        `You've saved ${money(
          increase
        )} more than you did last month.`,

      action:
        "Keep repeating the behavior that created this improvement.",

      priority: 82,
    });
  }

  /* =================================================
     SAVINGS RATE IMPROVED
  ================================================= */

  if (
    income > 0 &&
    previousSavingsRate > 0 &&
    savingsRate >
      previousSavingsRate + 5
  ) {
    const improvement =
      savingsRate -
      previousSavingsRate;

    insights.push({
      id: "saving-rate-improved",

      type: "motivational",

      title:
        "Your savings rate is moving up",

      message:
        `Your savings rate improved by about ${percent(
          improvement
        )} compared with last month.`,

      action:
        "Small improvements in your saving rate can compound into significant progress over time.",

      priority: 80,
    });
  }

  /* =================================================
     SAVINGS FALLING
  ================================================= */

  if (
    previousSavings > 0 &&
    savings < previousSavings &&
    previousSavings - savings >= 200
  ) {
    const decrease =
      previousSavings - savings;

    insights.push({
      id: "saving-decreased",

      type: "warning",

      title:
        "Your savings dropped this month",

      message:
        `You saved ${money(
          decrease
        )} less than you did last month.`,

      action:
        "Check whether the change came from a temporary expense or a spending pattern you can adjust.",

      priority: 88,
    });
  }

  /* =================================================
     SAVING FROM POSITIVE CASH FLOW
  ================================================= */

  if (
    income > 0 &&
    netCashFlow > 0 &&
    savings > 0
  ) {
    insights.push({
      id: "positive-cash-flow-saving",

      type: "achievement",

      title:
        "You're turning cash flow into savings",

      message:
        `After your expenses, you still have ${money(
          netCashFlow
        )} of positive cash flow.`,

      action:
        "Protect this gap and make saving part of your normal monthly routine.",

      priority: 75,
    });
  }

  /* =================================================
     SAVINGS OPPORTUNITY
  ================================================= */

  if (
    income > 0 &&
    savingsRate > 0 &&
    savingsRate < 20
  ) {
    const additionalSaving =
      income * 0.05;

    insights.push({
      id: "five-percent-saving-opportunity",

      type: "opportunity",

      title:
        "You could strengthen your savings with a small increase",

      message:
        `Saving an additional 5% of your income would add roughly ${money(
          additionalSaving
        )} to your monthly savings.`,

      action:
        "You don't need to find the entire amount at once. Start with one small recurring change.",

      priority: 72,
    });
  }

  /* =================================================
     ZERO EXPENSE / HIGH SAVINGS
  ================================================= */

  if (
    income > 0 &&
    expense === 0 &&
    savings > 0
  ) {
    insights.push({
      id: "zero-expense-saving",

      type: "achievement",

      title:
        "You've kept your spending extremely low",

      message:
        `You've kept ${money(
          savings
        )} from your income so far this month.`,

      action:
        "Make sure this level of saving is sustainable rather than temporary.",

      priority: 68,
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