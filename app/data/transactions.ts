import { getPortfolioSummary } from "./investments";

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
  const transactions =
    getCurrentMonthTransactions();

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

  const savingsRate =
    income === 0
      ? 0
      : (availableCash / income) * 100;

  // Only actual expenses count as expenses here.
  const expenseTransactions = transactions
    .filter(
      (transaction) =>
        transaction.type === "Expense"
    )
    .sort(
      (a, b) => b.amount - a.amount
    );

  const largestExpense =
    expenseTransactions[0] ?? null;

  return {
    income,
    expense,

    // Money allocated to investments this month
    investmentSpent,

    transferIn,
    transferOut,

    // Cash remaining after this month's activity
    availableCash,

    // Monthly savings
    savings: availableCash,

    savingsRate,

    // Current investment portfolio
    investment: portfolio.current,

    // Total amount ever invested
    totalInvested: portfolio.invested,

    // Current portfolio profit/loss
    investmentProfit: portfolio.profit,

    // Current portfolio return
    investmentReturnPercentage:
      portfolio.returnPercentage,

    // Total net worth
    netWorth:
      availableCash +
      portfolio.current,

    // Activity
    totalTransactions:
      transactions.length,

    largestExpense,
  };
}

/* ==========================================
   FINANCIAL HEALTH
========================================== */

export function getFinancialHealthScore() {
  const report = getMonthlyReport();

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
  if (report.availableCash >= 0) {
    score += 20;
  } else {
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
        completed = completeTask(1);
      }

      // Task 3:
      // Make one better money decision
      //
      // Investment OR adding money to a goal
      if (
        transaction.type === "Investment" ||
        transaction.relatedGoalId
      ) {
        completed = completeTask(3) || completed;
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