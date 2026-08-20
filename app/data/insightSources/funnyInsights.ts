import type { AIInsight } from "../aiInsights";
import type { InsightCandidate } from "../insightRegistry";
import {
  getMonthlyReport,
} from "@/app/data/transactions";
import {
  getSpendingAnalysis,
} from "@/app/data/spendingAnalysis";

/* =====================================================
   HELPERS
===================================================== */

function percent(value: number) {
  return `${Math.round(value)}%`;
}

/* =====================================================
   FUNNY INSIGHTS
===================================================== */

export function getFunnyInsights(): InsightCandidate[] {
  const report = getMonthlyReport();
  const spending = getSpendingAnalysis();

  const candidates: InsightCandidate[] = [];

  /* =================================================
     FUNNY — MONEY DISAPPEARING
  ================================================= */

  if (
    report.expense > 0 &&
    report.income > 0 &&
    report.expense >= report.income * 0.7
  ) {
    const insight: AIInsight = {
      id: "money-disappearing",
      type: "funny",

      title:
        "Your money has been unusually adventurous",

      message:
        `About ${percent(
          (report.expense / report.income) * 100
        )} of your income has already found somewhere to go.`,

      action:
        "Maybe give some of it a reason to stay.",

      priority: 20,
    };

    candidates.push({
      insight,
      priority: insight.priority,
      family: "high-spending-humor",
    });
  }

  /* =================================================
     FUNNY — HIGH SPENDING RATE
  ================================================= */

  if (
    spending.income > 0 &&
    spending.spendingRate >= 70
  ) {
    const insight: AIInsight = {
      id: "funny-spending",
      type: "funny",

      title:
        "Your money has been busy",

      message:
        `About ${percent(
          spending.spendingRate
        )} of your income has already found somewhere to go.`,

      action:
        "Maybe invite some of it to stay for a while. 😄",

      priority: 25,
    };

    candidates.push({
      insight,
      priority: insight.priority,
      family: "high-spending-humor",
    });
  }

  /* =================================================
     RETURN
  ================================================= */

  return candidates;
}