import {
  getPortfolioSummary,
} from "@/app/data/investments";

/* =====================================================
   TYPES
===================================================== */

export type InvestmentInsightType =
  | "investment"
  | "warning"
  | "opportunity"
  | "achievement"
  | "motivational";

export type InvestmentInsight = {
  id: string;
  type: InvestmentInsightType;

  title: string;
  message: string;

  action?: string;

  priority: number;

  category?: string;
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
   INVESTMENT INSIGHT ENGINE
===================================================== */

export function getInvestmentInsights(): InvestmentInsight[] {
  const portfolio = getPortfolioSummary();

  const insights: InvestmentInsight[] = [];

  /* =================================================
     1. INVESTMENT PROGRESS
  ================================================= */

  if (portfolio.current > 0) {
    insights.push({
      id: "investment-progress",
      type: "investment",
      title:
        "Your money is starting to work for you",
      message:
        `Your investment portfolio is currently worth ${money(
          portfolio.current
        )}.`,
      action:
        "Focus on consistent long-term investing rather than short-term noise.",
      priority: 65,
    });
  }

  /* =================================================
     2. POSITIVE INVESTMENT RETURN
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.profit > 0
  ) {
    insights.push({
      id: "positive-investment-return",
      type: "achievement",
      title:
        "Your investments are moving in the right direction",
      message:
        `Your portfolio is currently up ${money(
          portfolio.profit
        )}.`,
      action:
        "Keep your focus on long-term growth instead of reacting to short-term movements.",
      priority: 85,
    });
  }

  /* =================================================
     3. NEGATIVE INVESTMENT RETURN
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.profit < 0
  ) {
    insights.push({
      id: "negative-investment-return",
      type: "warning",
      title:
        "Your investments are currently below cost",
      message:
        `Your portfolio is currently down ${money(
          Math.abs(portfolio.profit)
        )}.`,
      action:
        "Avoid making emotional decisions based on short-term losses. Review what you own and why you invested.",
      priority: 90,
    });
  }

  /* =================================================
     4. STRONG RETURN
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.returnPercentage >= 10
  ) {
    insights.push({
      id: "strong-investment-return",
      type: "achievement",
      title:
        "Your portfolio is showing strong growth",
      message:
        `Your current investment return is ${percent(
          portfolio.returnPercentage
        )}.`,
      action:
        "Protect the habit that created this progress and keep your strategy consistent.",
      priority: 80,
    });
  }

  /* =================================================
     5. SMALL POSITIVE RETURN
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.returnPercentage > 0 &&
    portfolio.returnPercentage < 10
  ) {
    insights.push({
      id: "positive-investment-momentum",
      type: "motivational",
      title:
        "Your investment journey is moving forward",
      message:
        `Your portfolio is currently up ${percent(
          portfolio.returnPercentage
        )}.`,
      action:
        "Small gains are still progress. Consistency matters more than chasing quick returns.",
      priority: 60,
    });
  }

  /* =================================================
     6. PORTFOLIO AT BREAK-EVEN
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.profit === 0
  ) {
    insights.push({
      id: "investment-break-even",
      type: "investment",
      title:
        "Your portfolio is currently at break-even",
      message:
        "Your investments are currently around their original value.",
      action:
        "Keep monitoring your long-term strategy rather than judging your portfolio by one moment.",
      priority: 55,
    });
  }

  /* =================================================
     7. NO INVESTMENTS
  ================================================= */

  if (portfolio.current <= 0) {
    insights.push({
      id: "no-investments",
      type: "opportunity",
      title:
        "Your money hasn't started working for you yet",
      message:
        "You currently don't have an active investment portfolio.",
      action:
        "Once your basic cash needs are covered, consider starting with a small amount you can comfortably invest.",
      priority: 75,
    });
  }

  /* =================================================
     8. LONG-TERM MINDSET
  ================================================= */

  if (
    portfolio.current > 0 &&
    portfolio.returnPercentage >= 0
  ) {
    insights.push({
      id: "long-term-investment-mindset",
      type: "motivational",
      title:
        "Consistency can become your biggest advantage",
      message:
        "Building investments is usually more about staying consistent than trying to predict every market move.",
      action:
        "Keep contributing according to a strategy you can maintain.",
      priority: 45,
    });
  }

  /* =================================================
     SORT
  ================================================= */

  return insights.sort(
    (a, b) =>
      b.priority - a.priority
  );
}

/* =====================================================
   TOP INVESTMENT INSIGHT
===================================================== */

export function getTopInvestmentInsight():
  InvestmentInsight | null {
  const insights =
    getInvestmentInsights();

  return insights.length > 0
    ? insights[0]
    : null;
}