import {
  getTransactions,
  getMonthlyReport,
  type Transaction,
} from "./transactions";

/* =====================================================
   TYPES
===================================================== */

export type SpendingCategoryAnalysis = {
  category: string;

  currentAmount: number;
  previousAmount: number;

  changeAmount: number;
  changePercentage: number;

  currentPercentage: number;

  transactionCount: number;
  averageTransaction: number;
};

export type SpendingAnalysis = {
  currentMonthExpense: number;
  previousMonthExpense: number;

  expenseChange: number;
  expenseChangePercentage: number;

  largestCategory:
    | SpendingCategoryAnalysis
    | null;

  fastestGrowingCategory:
    | SpendingCategoryAnalysis
    | null;

  biggestSavingOpportunity:
    | SpendingCategoryAnalysis
    | null;

  categories: SpendingCategoryAnalysis[];

  transactionCount: number;

  averageExpense: number;

  weekendExpense: number;
  weekdayExpense: number;
  weekendPercentage: number;

  /* AI helpers */

  income: number;
  spendingRate: number;
  totalSpending: number;
  netCashFlow: number;
  categoryCount: number;
};

/* =====================================================
   HELPERS
===================================================== */

/**
 * Return transactions for a specific month.
 */
function getMonthTransactions(
  year: number,
  month: number
): Transaction[] {
  return getTransactions().filter(
    (transaction) => {
      const date = new Date(transaction.date);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    }
  );
}

/**
 * Return the previous calendar month.
 */
function getPreviousMonthDate(
  date = new Date()
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
}

/**
 * Calculate expense totals by category.
 */
function getExpenseCategoryTotals(
  transactions: Transaction[]
): Record<string, number> {
  const totals: Record<string, number> = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .forEach((transaction) => {
      const category =
        transaction.category?.trim() ||
        "Other";

      totals[category] =
        (totals[category] || 0) +
        transaction.amount;
    });

  return totals;
}

/* =====================================================
   MAIN SPENDING ANALYSIS
===================================================== */

export function getSpendingAnalysis(): SpendingAnalysis {
  const now = new Date();

  const report =
    getMonthlyReport();

  const previousMonth =
    getPreviousMonthDate(now);

  /* -----------------------------------------------------
     TRANSACTIONS
  ----------------------------------------------------- */

  const currentTransactions =
    getMonthTransactions(
      now.getFullYear(),
      now.getMonth()
    );

  const previousTransactions =
    getMonthTransactions(
      previousMonth.getFullYear(),
      previousMonth.getMonth()
    );

  /* -----------------------------------------------------
     EXPENSE TRANSACTIONS
  ----------------------------------------------------- */

  const currentExpenses =
    currentTransactions.filter(
      (transaction) =>
        transaction.type === "Expense"
    );

  const previousExpenses =
    previousTransactions.filter(
      (transaction) =>
        transaction.type === "Expense"
    );

  /* -----------------------------------------------------
     TOTAL EXPENSES
  ----------------------------------------------------- */

  const currentMonthExpense =
    currentExpenses.reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const previousMonthExpense =
    previousExpenses.reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const expenseChange =
    currentMonthExpense -
    previousMonthExpense;

  const expenseChangePercentage =
    previousMonthExpense > 0
      ? (expenseChange /
          previousMonthExpense) *
        100
      : 0;

  /* -----------------------------------------------------
     CATEGORY TOTALS
  ----------------------------------------------------- */

  const currentCategories =
    getExpenseCategoryTotals(
      currentTransactions
    );

  const previousCategories =
    getExpenseCategoryTotals(
      previousTransactions
    );

  const allCategories =
    new Set([
      ...Object.keys(
        currentCategories
      ),
      ...Object.keys(
        previousCategories
      ),
    ]);

  const categories: SpendingCategoryAnalysis[] =
    Array.from(allCategories)
      .map((category) => {
        const currentAmount =
          currentCategories[category] ||
          0;

        const previousAmount =
          previousCategories[category] ||
          0;

        const changeAmount =
          currentAmount -
          previousAmount;

        const changePercentage =
          previousAmount > 0
            ? (changeAmount /
                previousAmount) *
              100
            : currentAmount > 0
            ? 100
            : 0;

        const categoryTransactions =
          currentExpenses.filter(
            (transaction) =>
              (
                transaction.category?.trim() ||
                "Other"
              ) === category
          );

        const transactionCount =
          categoryTransactions.length;

        const averageTransaction =
          transactionCount > 0
            ? currentAmount /
              transactionCount
            : 0;

        return {
          category,

          currentAmount,
          previousAmount,

          changeAmount,
          changePercentage,

          currentPercentage:
            currentMonthExpense > 0
              ? (currentAmount /
                  currentMonthExpense) *
                100
              : 0,

          transactionCount,

          averageTransaction,
        };
      })
      .sort(
        (a, b) =>
          b.currentAmount -
          a.currentAmount
      );

  /* -----------------------------------------------------
     LARGEST CATEGORY
  ----------------------------------------------------- */

  const largestCategory =
    categories.length > 0
      ? categories[0]
      : null;

  /* -----------------------------------------------------
     FASTEST GROWING CATEGORY
  ----------------------------------------------------- */

  const growingCategories =
    categories
      .filter(
        (category) =>
          category.currentAmount > 0 &&
          category.changeAmount > 0
      )
      .sort(
        (a, b) =>
          b.changePercentage -
          a.changePercentage
      );

  const fastestGrowingCategory =
    growingCategories.length > 0
      ? growingCategories[0]
      : null;

  /* -----------------------------------------------------
     BIGGEST SAVING OPPORTUNITY
  ----------------------------------------------------- */

  const savingCandidates =
    [...categories]
      .filter(
        (category) =>
          category.currentAmount > 0
      )
      .sort(
        (a, b) =>
          b.currentAmount -
          a.currentAmount
      );

  const biggestSavingOpportunity =
    savingCandidates.length > 0
      ? savingCandidates[0]
      : null;

  /* -----------------------------------------------------
     WEEKEND VS WEEKDAY
  ----------------------------------------------------- */

  let weekendExpense = 0;
  let weekdayExpense = 0;

  currentExpenses.forEach(
    (transaction) => {
      const date =
        new Date(transaction.date);

      const day =
        date.getDay();

      if (
        day === 0 ||
        day === 6
      ) {
        weekendExpense +=
          transaction.amount;
      } else {
        weekdayExpense +=
          transaction.amount;
      }
    }
  );

  const weekendPercentage =
    currentMonthExpense > 0
      ? (weekendExpense /
          currentMonthExpense) *
        100
      : 0;

  /* -----------------------------------------------------
     AVERAGE EXPENSE
  ----------------------------------------------------- */

  const averageExpense =
    currentExpenses.length > 0
      ? currentMonthExpense /
        currentExpenses.length
      : 0;

  /* -----------------------------------------------------
     AI HELPERS
  ----------------------------------------------------- */

  const income =
    report.income;

  const spendingRate =
    income > 0
      ? (currentMonthExpense /
          income) *
        100
      : 0;

  const totalSpending =
    currentMonthExpense;

  const netCashFlow =
    report.netCashFlow;

  const categoryCount =
    categories.length;

  /* -----------------------------------------------------
     RETURN
  ----------------------------------------------------- */

  return {
    currentMonthExpense,

    previousMonthExpense,

    expenseChange,

    expenseChangePercentage,

    largestCategory,

    fastestGrowingCategory,

    biggestSavingOpportunity,

    categories,

    transactionCount:
      currentExpenses.length,

    averageExpense,

    weekendExpense,

    weekdayExpense,

    weekendPercentage,

    /* AI */

    income,

    spendingRate,

    totalSpending,

    netCashFlow,

    categoryCount,
  };
}