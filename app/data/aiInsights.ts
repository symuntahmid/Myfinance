import {
  getMonthlyReport,
  getSummary,
} from "@/app/data/transactions";

import {
  getSpendingAnalysis,
} from "@/app/data/spendingAnalysis";

import {
  getPortfolioSummary,
} from "@/app/data/investments";

import {
  selectInsights,
  type InsightCandidate,
} from "@/app/data/insightRegistry";

import type {
  AIInsight,
  AIInsightType,
} from "@/app/data/types/AIInsight";


type InsightRule = {
  id: string;

  type: AIInsightType;

  priority: number;

  check: () => AIInsight | null;
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
   AI INSIGHT ENGINE
===================================================== */

export function getAIInsights(): AIInsight[] {


  /*
    Core financial data
  */

  const report =
    getMonthlyReport();


  const summary =
    getSummary();


  const portfolio =
    getPortfolioSummary();



  /*
    Spending intelligence
  */

  const spending =
    getSpendingAnalysis();




  /*
    All possible insights
    are generated here.
  */

  const rules: InsightRule[] = [


    

    /* =================================================
       CASH FLOW
    ================================================= */

    {
      id: "negative-cash-flow",

      type: "warning",

      priority: 100,

      check: () => {
        if (report.netCashFlow >= 0) {
          return null;
        }

        return {
          id: "negative-cash-flow",

          type: "warning",

          title:
            "Your spending is outrunning your income",

          message:
            `You're currently ${money(
              Math.abs(report.netCashFlow)
            )} below your monthly income.`,

          action:
            "Review your largest expenses before adding new spending.",

          priority: 100,
        };
      },
    },

    {
      id: "positive-cash-flow",

      type: "achievement",

      priority: 70,

      check: () => {
        if (report.netCashFlow <= 0) {
          return null;
        }

        return {
          id: "positive-cash-flow",

          type: "achievement",

          title:
            "Your money is moving in the right direction",

          message:
            `You've finished the month with ${money(
              report.netCashFlow
            )} of positive cash flow.`,

          action:
            "Keep protecting the gap between what you earn and what you spend.",

          priority: 70,
        };
      },
    },

    /* =================================================
       SPENDING — HIGH SPENDING RATE
    ================================================= */

    {
      id: "high-spending-rate",

      type: "warning",

      priority: 95,

      check: () => {
        if (
          spending.income <= 0 ||
          spending.spendingRate < 80
        ) {
          return null;
        }

        return {
          id: "high-spending-rate",

          type: "warning",

          title:
            "Most of your income is already spoken for",

          message:
            `You've spent about ${percent(
              spending.spendingRate
            )} of your income this month.`,

          action:
            "Look at your largest spending category before making another non-essential purchase.",

          priority: 95,
        };
      },
    },

    /* =================================================
       SPENDING — LARGEST CATEGORY
    ================================================= */

    {
      id: "largest-spending-category",

      type: "opportunity",

      priority: 88,

      check: () => {
        const category =
          spending.largestCategory;

        if (
          !category ||
          category.currentAmount <= 0
        ) {
          return null;
        }

        return {
          id: "largest-spending-category",

          type: "opportunity",

          title:
            `${category.category} is your biggest spending area`,

          message:
            `${category.category} accounts for ${percent(
              category.currentPercentage
            )} of your spending this month.`,

          action:
            "If you reduce this category slightly, you could redirect the difference toward savings or another goal.",

          priority: 88,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — DOMINANT CATEGORY
    ================================================= */

    {
      id: "dominant-spending-category",

      type: "warning",

      priority: 92,

      check: () => {
        const category =
          spending.largestCategory;

        if (
          !category ||
          category.currentPercentage < 40
        ) {
          return null;
        }

        return {
          id: "dominant-spending-category",

          type: "warning",

          title:
            `${category.category} is dominating your spending`,

          message:
            `${category.category} represents ${percent(
              category.currentPercentage
            )} of your total expenses this month.`,

          action:
            "Check whether this spending is essential, temporary, or something you can optimize.",

          priority: 92,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — CATEGORY INCREASE
    ================================================= */

    {
      id: "spending-category-increased",

      type: "warning",

      priority: 94,

      check: () => {
        const category =
          spending.fastestGrowingCategory;

        if (!category) {
          return null;
        }

        if (
          category.currentAmount <= 0 ||
          category.changeAmount <= 0 ||
          category.changePercentage < 25 ||
          category.changeAmount < 200
        ) {
          return null;
        }

        return {
          id: "spending-category-increased",

          type: "warning",

          title:
            `${category.category} spending jumped`,

          message:
            `You spent ${money(
              category.currentAmount
            )} on ${category.category} this month, compared with ${money(
              category.previousAmount
            )} last month.`,

          action:
            `That's a ${percent(
              category.changePercentage
            )} increase. Check whether this was intentional or just a spending pattern.`,

          priority: 94,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — CATEGORY DECREASE
    ================================================= */

    {
      id: "spending-category-decreased",

      type: "motivational",

      priority: 55,

      check: () => {
        const category =
          spending.categories
            .filter(
              (category) =>
                category.previousAmount > 0 &&
                category.changeAmount < 0
            )
            .sort(
              (a, b) =>
                a.changeAmount -
                b.changeAmount
            )[0];

        if (!category) {
          return null;
        }

        const reduction =
          Math.abs(
            category.changeAmount
          );

        if (reduction < 200) {
          return null;
        }

        return {
          id: "spending-category-decreased",

          type: "motivational",

          title:
            `You're getting better at ${category.category}`,

          message:
            `Your ${category.category} spending is down ${money(
              reduction
            )} compared with last month.`,

          action:
            "That's the kind of small improvement that compounds over time.",

          priority: 55,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — FREQUENT PURCHASES
    ================================================= */

    {
      id: "frequent-category-purchases",

      type: "habit",

      priority: 65,

      check: () => {
        const category =
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

        if (!category) {
          return null;
        }

        return {
          id: "frequent-category-purchases",

          type: "habit",

          title:
            `${category.category} is becoming a frequent habit`,

          message:
            `You've made ${category.transactionCount} ${category.category.toLowerCase()} purchases this month, averaging about ${money(
              category.averageTransaction
            )} each.`,

          action:
            "Small repeated purchases can become surprisingly large totals.",

          priority: 65,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — SAVING OPPORTUNITY
    ================================================= */

    {
      id: "potential-saving-opportunity",

      type: "opportunity",

      priority: 85,

      check: () => {
        const category =
          spending.biggestSavingOpportunity;

        if (!category) {
          return null;
        }

        if (
          category.currentAmount < 500
        ) {
          return null;
        }

        const potentialSaving =
          category.currentAmount * 0.1;

        return {
          id: "potential-saving-opportunity",

          type: "opportunity",

          title:
            "You may have an easy saving opportunity",

          message:
            `Reducing ${category.category} spending by just 10% could free up roughly ${money(
              potentialSaving
            )} this month.`,

          action:
            `You don't need to eliminate ${category.category}. Try reducing it slightly.`,

          priority: 85,

          category:
            category.category,
        };
      },
    },

    /* =================================================
       SPENDING — MODERATE SPENDING
    ================================================= */

    {
      id: "spending-opportunity",

      type: "opportunity",

      priority: 75,

      check: () => {
        if (
          spending.income <= 0 ||
          spending.spendingRate < 60 ||
          spending.spendingRate >= 80
        ) {
          return null;
        }

        const potential =
          spending.totalSpending * 0.1;

        if (potential < 100) {
          return null;
        }

        return {
          id: "spending-opportunity",

          type: "opportunity",

          title:
            "A small spending cut could create real progress",

          message:
            `Reducing your current spending by just 10% would free roughly ${money(
              potential
            )}.`,

          action:
            "You don't need to cut everything. Find one category where a small reduction feels realistic.",

          priority: 75,
        };
      },
    },

    /* =================================================
       SPENDING — WEEKEND
    ================================================= */

    {
      id: "weekend-spending",

      type: "habit",

      priority: 60,

      check: () => {
        if (
          spending.weekendPercentage < 35
        ) {
          return null;
        }

        if (
          spending.weekendExpense < 500
        ) {
          return null;
        }

        return {
          id: "weekend-spending",

          type: "habit",

          title:
            "Your weekends are costing more",

          message:
            `${percent(
              spending.weekendPercentage
            )} of your monthly spending happened on weekends.`,

          action:
            "Take a look at your weekend purchases and see which ones were actually planned.",

          priority: 60,
        };
      },
    },

    /* =================================================
       SPENDING — MULTIPLE CATEGORIES
    ================================================= */

    {
      id: "multiple-spending-categories",

      type: "habit",

      priority: 50,

      check: () => {
        if (
          spending.categoryCount < 4
        ) {
          return null;
        }

        return {
          id: "multiple-spending-categories",

          type: "habit",

          title:
            "You're getting a clearer picture of your spending",

          message:
            `Your expenses are currently spread across ${spending.categoryCount} categories.`,

          action:
            "Keep tracking consistently. Patterns become much easier to spot over time.",

          priority: 50,
        };
      },
    },

    /* =================================================
       SAVING
    ================================================= */

    {
      id: "strong-saving-rate",

      type: "motivational",

      priority: 80,

      check: () => {
        if (
          report.savingsRate < 20
        ) {
          return null;
        }

        return {
          id: "strong-saving-rate",

          type: "motivational",

          title:
            "You're building real financial momentum",

          message:
            `You're currently keeping ${percent(
              report.savingsRate
            )} of your income.`,

          action:
            "Consistency matters more than perfection. Keep the habit alive.",

          priority: 80,
        };
      },
    },

    {
      id: "no-savings",

      type: "opportunity",

      priority: 90,

      check: () => {
        if (
          report.income <= 0 ||
          report.savingsRate > 0
        ) {
          return null;
        }

        return {
          id: "no-savings",

          type: "opportunity",

          title:
            "Your next opportunity is hiding in your cash flow",

          message:
            "You haven't created a positive savings gap this month yet.",

          action:
            "Try setting aside even a small amount before your next expense.",

          priority: 90,
        };
      },
    },

    /* =================================================
       POSITIVE CASH FLOW + SPENDING
    ================================================= */

    {
      id: "spending-with-positive-cash-flow",

      type: "motivational",

      priority: 55,

      check: () => {
        if (
          spending.income <= 0 ||
          spending.netCashFlow <= 0 ||
          spending.totalSpending <= 0
        ) {
          return null;
        }

        return {
          id: "spending-with-positive-cash-flow",

          type: "motivational",

          title:
            "You're spending and still keeping a gap",

          message:
            `After your current spending, you still have ${money(
              spending.netCashFlow
            )} of positive cash flow.`,

          action:
            "Protect that gap. It's one of the foundations of building wealth.",

          priority: 55,
        };
      },
    },

    /* =================================================
       INVESTMENTS
    ================================================= */

    {
      id: "investment-progress",

      type: "investment",

      priority: 65,

      check: () => {
        if (
          portfolio.current <= 0
        ) {
          return null;
        }

        return {
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
        };
      },
    },

    /* =================================================
       FINANCIAL HEALTH
    ================================================= */

    {
      id: "healthy-finances",

      type: "achievement",

      priority: 60,

      check: () => {
        if (
          summary.netWorth <= 0
        ) {
          return null;
        }

        return {
          id: "healthy-finances",

          type: "achievement",

          title:
            "You're building a financial foundation",

          message:
            `Your current net worth is ${money(
              summary.netWorth
            )}.`,

          action:
            "Keep improving the small decisions that compound over time.",

          priority: 60,
        };
      },
    },

    /* =================================================
       MOTIVATIONAL
    ================================================= */

    {
      id: "keep-going",

      type: "motivational",

      priority: 35,

      check: () => {
        if (
          report.totalTransactions < 3
        ) {
          return null;
        }

        return {
          id: "keep-going",

          type: "motivational",

          title:
            "You're becoming more aware of your money",

          message:
            `You've tracked ${report.totalTransactions} financial activities this month.`,

          action:
            "Awareness comes before control. Keep tracking.",

          priority: 35,
        };
      },
    },

    /* =================================================
       EMOTIONAL
    ================================================= */

    {
      id: "difficult-month",

      type: "emotional",

      priority: 45,

      check: () => {
        if (
          report.netCashFlow >= 0
        ) {
          return null;
        }

        return {
          id: "difficult-month",

          type: "emotional",

          title:
            "A difficult month doesn't define you",

          message:
            "Money doesn't always behave the way we want it to.",

          action:
            "What matters is the next decision you make.",

          priority: 45,
        };
      },
    },

    /* =================================================
       FUNNY — GENERAL
    ================================================= */

    {
      id: "money-disappearing",

      type: "funny",

      priority: 20,

      check: () => {
        if (
          report.expense <= 0 ||
          report.income <= 0
        ) {
          return null;
        }

        if (
          report.expense <
          report.income * 0.7
        ) {
          return null;
        }

        return {
          id: "money-disappearing",

          type: "funny",

          title:
            "Your money has been unusually adventurous",

          message:
            `About ${percent(
              (report.expense /
                report.income) *
                100
            )} of your income has already found somewhere to go.`,

          action:
            "Maybe give some of it a reason to stay.",

          priority: 20,
        };
      },
    },

    /* =================================================
       FUNNY — SPENDING RATE
    ================================================= */

    {
      id: "funny-spending",

      type: "funny",

      priority: 25,

      check: () => {
        if (
          spending.income <= 0 ||
          spending.spendingRate < 70
        ) {
          return null;
        }

        return {
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
      },
    },
    ];

  /* =================================================
   BUILD INSIGHT CANDIDATES
================================================= */

const candidates: InsightCandidate[] = [];

for (const rule of rules) {
  const result = rule.check();

  if (!result) {
    continue;
  }

 let family: string | undefined;


/* =================================================
   FAMILY GROUPING

   Prevent similar financial insights
   from appearing together.
================================================= */


switch (result.id) {


  /* -----------------------------------------------
     ALL SPENDING INSIGHTS
  ------------------------------------------------ */

  case "high-spending-rate":

  case "largest-spending-category":

  case "dominant-spending-category":

  case "spending-category-increased":

  case "potential-saving-opportunity":

  case "spending-opportunity":

  case "spending-category-decreased":

  case "frequent-category-purchases":

  case "weekend-spending":

  case "multiple-spending-categories":

    family = "spending";

    break;



  /* -----------------------------------------------
   CASH FLOW
------------------------------------------------ */

case "negative-cash-flow":

  family = "cash-flow-warning";

  break;



case "positive-cash-flow":

case "strong-saving-rate":

  family = "financial-progress";

  break;



case "spending-with-positive-cash-flow":

  family = "spending-gap";

  break;


  /* -----------------------------------------------
     SAVING
  ------------------------------------------------ */

  case "strong-saving-rate":

  case "no-savings":

    family = "saving";

    break;



  /* -----------------------------------------------
     INVESTMENT
  ------------------------------------------------ */

  case "investment-progress":

    family = "investment";

    break;



  /* -----------------------------------------------
     FINANCIAL HEALTH
  ------------------------------------------------ */

  case "healthy-finances":

    family = "financial-health";

    break;



  /* -----------------------------------------------
     MOTIVATION
  ------------------------------------------------ */

  case "keep-going":

    family = "motivation";

    break;



  /* -----------------------------------------------
     EMOTIONAL
  ------------------------------------------------ */

  case "difficult-month":

    family = "emotional";

    break;



  /* -----------------------------------------------
     FUNNY
  ------------------------------------------------ */

  case "money-disappearing":

  case "funny-spending":

    family = "funny";

    break;

}



candidates.push({

  insight: result,

  priority: result.priority,

  category: result.category,

  family,

});

}



/* =================================================
   SELECT BEST INSIGHTS
================================================= */

const selected = selectInsights(

  candidates,

  {

    // Total insights after unlock
    maxInsights: 4,

    // Avoid too many same types
    maxPerType: 2,

    // Avoid duplicate category insights
    maxPerCategory: 1,

  }

);



const uniqueInsights = Array.from(

  new Map(

    selected.map(

      (item) => [

        item.id,

        item,

      ]

    )

  ).values()

);



return uniqueInsights;

}



/* =====================================================
   TOP INSIGHT
===================================================== */


export function getTopAIInsight(): AIInsight | null {

  const insights =
    getAIInsights();


  return insights.length > 0

    ? insights[0]

    : null;

}