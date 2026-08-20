import type { AIInsight } from "../aiInsights";
import type { SpendingAnalysis } from "../spendingAnalysis";

/* =====================================================
   SPENDING INSIGHT RULE
===================================================== */

export type SpendingInsightRule = {
  id: string;
  type: AIInsight["type"];
  priority: number;

  check: (
    spending: SpendingAnalysis
  ) => AIInsight | null;
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
   SPENDING INSIGHTS
===================================================== */

export const spendingInsightRules: SpendingInsightRule[] = [

  /* =================================================
     HIGH SPENDING RATE
  ================================================= */

  {
    id: "high-spending-rate",

    type: "warning",

    priority: 95,

    check: (spending) => {
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
     LARGEST SPENDING CATEGORY
  ================================================= */

  {
    id: "largest-spending-category",

    type: "opportunity",

    priority: 88,

    check: (spending) => {
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
     DOMINANT SPENDING CATEGORY
  ================================================= */

  {
    id: "dominant-spending-category",

    type: "warning",

    priority: 92,

    check: (spending) => {
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
     CATEGORY SPENDING INCREASE
  ================================================= */

  {
    id: "spending-category-increased",

    type: "warning",

    priority: 94,

    check: (spending) => {
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
     CATEGORY SPENDING DECREASE
  ================================================= */

  {
    id: "spending-category-decreased",

    type: "motivational",

    priority: 55,

    check: (spending) => {
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
     FREQUENT PURCHASES
  ================================================= */

  {
    id: "frequent-category-purchases",

    type: "habit",

    priority: 65,

    check: (spending) => {
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
     POTENTIAL SAVING OPPORTUNITY
  ================================================= */

  {
    id: "potential-saving-opportunity",

    type: "opportunity",

    priority: 85,

    check: (spending) => {
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
     MODERATE SPENDING OPPORTUNITY
  ================================================= */

  {
    id: "spending-opportunity",

    type: "opportunity",

    priority: 75,

    check: (spending) => {
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
     WEEKEND SPENDING
  ================================================= */

  {
    id: "weekend-spending",

    type: "habit",

    priority: 60,

    check: (spending) => {
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
     MULTIPLE SPENDING CATEGORIES
  ================================================= */

  {
    id: "multiple-spending-categories",

    type: "habit",

    priority: 50,

    check: (spending) => {
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
];