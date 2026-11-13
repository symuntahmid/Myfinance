import { getPortfolioSummary } from "./investments";
import { addXP } from "./player";

export type Transaction = {
  id: number;

  type: "Income" | "Expense" | "Investment" | "Transfer";

  source: string;
  destination?: string;
  category?: string;
  relatedGoalId?: string;
  relatedInvestmentId?: string;

  amount: number;
  date: string;

  note?: string;
  autoRepeat?: boolean;
  repeatFrequency?: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";

  reminder?: boolean;
  reminderType?: "due" | "1day" | "3days" | "1week" | "custom";
  reminderDate?: string;
};

const STORAGE_KEY = "myfinance-transactions";

/* ==========================================
   STORAGE
========================================== */

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as Transaction[];
  } catch {
    console.error("Failed to parse transactions from storage.");
    return [];
  }
}

export function saveTransactions(
  transactions: Transaction[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

/* ==========================================
   HELPERS
========================================== */

function getCurrentMonthTransactions() {
  const transactions = getTransactions();
  const now = new Date();

  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
}

function calculateMonthlyTotals() {
  const transactions =
    getCurrentMonthTransactions();

  let income = 0;
  let expense = 0;
  let investmentSpent = 0;
  let transferIn = 0;
  let transferOut = 0;

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case "Income":
        income += transaction.amount;
        break;

      case "Expense":
        expense += transaction.amount;
        break;

      case "Investment":
        investmentSpent += transaction.amount;
        break;

      case "Transfer":
        if (
          transaction.source === "Available Cash"
        ) {
          transferOut += transaction.amount;
        }

        if (
          transaction.destination ===
          "Available Cash"
        ) {
          transferIn += transaction.amount;
        }

        break;
    }
  });

  return {
    income,
    expense,
    investmentSpent,
    transferIn,
    transferOut,
  };
}

/* ==========================================
   SUMMARY
========================================== */

export function getSummary() {
  const {
    income,
    expense,
    investmentSpent,
    transferIn,
    transferOut,
  } = calculateMonthlyTotals();

  const portfolio = getPortfolioSummary();

  const availableCash =
    income -
    expense -
    investmentSpent -
    transferOut +
    transferIn;

  return {
    income,
    expense,
    investmentSpent,
    transferOut,
    transferIn,
    availableCash,

    investment: portfolio.current,

    netWorth:
      availableCash +
      portfolio.current,
  };
}

/* ==========================================
   MONTHLY REPORT
========================================== */

export function getMonthlyReport() {
  const transactions = getCurrentMonthTransactions();

  const {
    income,
    expense,
    investmentSpent,
    transferIn,
    transferOut,
  } = calculateMonthlyTotals();

  const portfolio = getPortfolioSummary();

  /*
   * Net cash flow for the current month.
   *
   * Investment purchases and transfers out reduce
   * available cash. Transfers back into cash increase it.
   */
  const netCashFlow =
    income -
    expense -
    investmentSpent -
    transferOut +
    transferIn;

  /*
   * Savings rate is based on actual income.
   */
  const savingsRate =
    income > 0
      ? (netCashFlow / income) * 100
      : 0;

  /*
   * Investment performance.
   */
  const investmentProfit =
    portfolio.current - portfolio.invested;

  const investmentReturn =
    portfolio.invested > 0
      ? (investmentProfit / portfolio.invested) * 100
      : 0;

  /*
   * Real expense breakdown.
   */
  /*
 * Real expense breakdown.
 *
 * Only actual Expense transactions are included.
 * Investment purchases and transfers are NOT treated
 * as spending categories.
 */
const expenseByCategory: Record<string, number> = {};

transactions
  .filter(
    (transaction) =>
      transaction.type === "Expense"
  )
  .forEach((transaction) => {
    const category =
      transaction.category?.trim() ||
      "Other";

    expenseByCategory[category] =
      (expenseByCategory[category] || 0) +
      transaction.amount;
  });

/*
 * Sort categories from largest to smallest
 * and calculate each category's percentage
 * of the month's total expenses.
 */
const expenseBreakdown = Object.entries(
  expenseByCategory
)
  .map(([category, amount]) => ({
    category,
    amount,
    percentage:
      expense > 0
        ? (amount / expense) * 100
        : 0,
  }))
  .sort(
    (a, b) =>
      b.amount - a.amount
  );

  /*
   * Recent transactions.
   */
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 10);

  return {
    income,
    expense,

    investmentSpent,

    transferIn,
    transferOut,

    /*
     * Cash position generated by this month's activity.
     */
    availableCash: netCashFlow,

    netCashFlow,

    savings: netCashFlow,

    savingsRate,

    /*
     * Portfolio data.
     */
    investment: portfolio.current,
    investedAmount: portfolio.invested,

    investmentProfit,
    investmentReturn,

    totalInvestmentAssets:
      portfolio.totalAssets,

    /*
     * Overall position.
     */
    netWorth:
      netCashFlow +
      portfolio.current,

    /*
     * Activity.
     */
    totalTransactions:
      transactions.length,

    recentTransactions,

    /*
     * Actual spending categories.
     */
    expenseBreakdown,
  };
}

/* ==========================================
   SPENDING INTELLIGENCE
========================================== */

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

  largestCategory: SpendingCategoryAnalysis | null;

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

  income: number;
  spendingRate: number;
  totalSpending: number;
  netCashFlow: number;
  categoryCount: number;
};

/* ==========================================
   MONTH HELPERS
========================================== */

function getMonthTransactions(
  year: number,
  month: number
) {
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

function getPreviousMonthDate() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
}

/* ==========================================
   CATEGORY TOTALS
========================================== */

function getExpenseCategoryTotals(
  transactions: Transaction[]
) {
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

/* ==========================================
   SPENDING ANALYSIS
========================================== */

export function getSpendingAnalysis(): SpendingAnalysis {
  const now = new Date();

  const report = getMonthlyReport();

  const previousMonth =
    getPreviousMonthDate();

  /* ------------------------------------------
     MONTH TRANSACTIONS
  ------------------------------------------ */

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

  /* ------------------------------------------
     EXPENSE TRANSACTIONS
  ------------------------------------------ */

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

  /* ------------------------------------------
     TOTAL EXPENSES
  ------------------------------------------ */

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

  /* ------------------------------------------
     CATEGORY TOTALS
  ------------------------------------------ */

  const currentCategories =
    getExpenseCategoryTotals(
      currentTransactions
    );

  const previousCategories =
    getExpenseCategoryTotals(
      previousTransactions
    );

  const allCategories = new Set([
    ...Object.keys(currentCategories),
    ...Object.keys(previousCategories),
  ]);

  const categories: SpendingCategoryAnalysis[] =
    Array.from(allCategories)
      .map((category) => {
        const currentAmount =
          currentCategories[category] || 0;

        const previousAmount =
          previousCategories[category] || 0;

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

  /* ------------------------------------------
     LARGEST CATEGORY
  ------------------------------------------ */

  const largestCategory =
    categories.length > 0
      ? categories[0]
      : null;

  /* ------------------------------------------
     FASTEST GROWING CATEGORY
  ------------------------------------------ */

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

  /* ------------------------------------------
     BIGGEST SAVING OPPORTUNITY
  ------------------------------------------ */

  const savingCandidates =
    categories
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

  /* ------------------------------------------
     WEEKEND VS WEEKDAY
  ------------------------------------------ */

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

  /* ------------------------------------------
     AVERAGE EXPENSE
  ------------------------------------------ */

  const averageExpense =
    currentExpenses.length > 0
      ? currentMonthExpense /
        currentExpenses.length
      : 0;

  /* ------------------------------------------
     AI INSIGHT HELPERS
  ------------------------------------------ */

  const income =
    report.income;

  const spendingRate =
    income > 0
      ? (currentMonthExpense / income) *
        100
      : 0;

  const totalSpending =
    currentMonthExpense;

  const netCashFlow =
    report.netCashFlow;

  const categoryCount =
    categories.length;

  /* ------------------------------------------
     FINAL RESULT
  ------------------------------------------ */

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

    /* ----------------------------------------
       AI INSIGHT HELPERS
    ---------------------------------------- */

    income,

    spendingRate,

    totalSpending,

    netCashFlow,

    categoryCount,
  };
}



/* ==========================================
   FINANCIAL HEALTH
========================================== */

export function getFinancialHealthScore() {
  const report = getMonthlyReport();

  // No financial activity yet.
  // Do not classify a brand-new account as "Critical".
  if (
    report.totalTransactions === 0 &&
    report.investment === 0 &&
    report.income === 0 &&
    report.expense === 0
  ) {
    return 0;
  }

  let score = 0;

  // Savings — 40 points
  score += Math.min(
    Math.max(report.savingsRate, 0),
    40
  );

  // Investments — 20 points
  if (report.investment > 0) {
    score += 20;
  }

  // Cash Flow — 20 points
  if (report.availableCash > 0) {
    score += 20;
  } else if (report.availableCash === 0) {
    score += 10;
  }

  // Financial activity — 20 points
  score += Math.min(
    report.totalTransactions,
    20
  );

  return Math.min(
    Math.round(score),
    100
  );
}

/* ==========================================
   CRUD
========================================== */

export function addTransaction(
  transaction: Transaction
) {
  const transactions = getTransactions();

  transactions.unshift(transaction);

  saveTransactions(transactions);

  /* ------------------------------------------
     DAILY JOURNEY
  ------------------------------------------ */

  import("./dailyJourney").then(
    ({ completeTask }) => {

      let completed = false;

      // Task 1:
      // Track one expense automatically
      if (transaction.type === "Expense") {
        const taskCompleted = completeTask(1);

        if (taskCompleted) {
          addXP(15);
          completed = true;
        }
      }

      // Task 3:
      // Make one better money decision
      //
      // Investment OR adding money to a goal
      if (
        transaction.type === "Investment" ||
        transaction.relatedGoalId
      ) {
        const taskCompleted = completeTask(3);

        if (taskCompleted) {
          addXP(20);
          completed = true;
        }
      }

      if (completed) {
        window.dispatchEvent(
          new Event("dailyJourneyUpdated")
        );
      }
    }
  );

  /* ------------------------------------------
     UPDATE DASHBOARD
  ------------------------------------------ */

  window.dispatchEvent(
    new CustomEvent("transactionsUpdated")
  );
}

export function updateTransaction(
  updatedTransaction: Transaction
) {
  const transactions =
    getTransactions();

  const updated = transactions.map(
    (transaction) =>
      transaction.id ===
      updatedTransaction.id
        ? updatedTransaction
        : transaction
  );

  saveTransactions(updated);

  window.dispatchEvent(
    new CustomEvent("transactionsUpdated")
  );
}

export function deleteTransaction(
  id: number
) {
  const transactions =
    getTransactions().filter(
      (transaction) =>
        transaction.id !== id
    );

  saveTransactions(transactions);

  window.dispatchEvent(
    new CustomEvent("transactionsUpdated")
  );
}

export function clearTransactions() {
  saveTransactions([]);

  window.dispatchEvent(
    new CustomEvent("transactionsUpdated")
  );
}