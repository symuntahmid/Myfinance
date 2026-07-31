import { getPortfolioSummary } from "./investments";

export type Transaction = {
  id: number;

  type: "Income" | "Expense" | "Investment";

  source: string;

  category?: string;

  amount: number;

  date: string;

  note?: string;

  autoRepeat?: boolean;

  repeatFrequency?:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "yearly";

  reminder?: boolean;

  reminderType?:
    | "due"
    | "1day"
    | "3days"
    | "1week"
    | "custom";

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

  const saved =
    localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

export function saveTransactions(
  transactions: Transaction[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

/* ==========================================
   HELPERS
========================================== */

function getCurrentMonthTransactions() {
  const transactions =
    getTransactions();

  const now = new Date();

  return transactions.filter((t) => {
    const d = new Date(t.date);

    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
}

function calculateMonthlyTotals() {
  const transactions =
    getCurrentMonthTransactions();

  let income = 0;
  let expense = 0;
  let investmentSpent = 0;

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
    }
  });

  return {
    income,
    expense,
    investmentSpent,
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
  } = calculateMonthlyTotals();

  const portfolio =
    getPortfolioSummary();

  const availableCash =
    income -
    expense -
    investmentSpent;

  return {
    income,

    expense,

    investmentSpent,

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
  } = calculateMonthlyTotals();

  const portfolio =
    getPortfolioSummary();

  const availableCash =
    income -
    expense -
    investmentSpent;

  const savingsRate =
    income === 0
      ? 0
      : (availableCash / income) * 100;

  const largestExpense =
    transactions
      .filter(
        (t) =>
          t.type === "Expense" ||
          t.type === "Investment"
      )
      .sort(
        (a, b) =>
          b.amount - a.amount
      )[0] ?? null;

  return {
    income,

    expense,

    investmentSpent,

    availableCash,

    savings:
      availableCash,

    savingsRate,

    investment:
      portfolio.current,

    netWorth:
      availableCash +
      portfolio.current,

    totalTransactions:
      transactions.length,

    largestExpense,

    topInvestmentCategory:
      portfolio.totalAssets > 0
        ? "Portfolio"
        : "None",
  };
}
/* ==========================================
   FINANCIAL HEALTH
========================================== */

export function getFinancialHealthScore() {
  const report = getMonthlyReport();

  let score = 0;

  // Savings (40 pts)

  score += Math.min(
    Math.max(report.savingsRate, 0),
    40
  );

  // Investments (20 pts)

  if (report.investment > 0) {
    score += 20;
  }

  // Cash Flow (20 pts)

  if (report.availableCash >= 0) {
    score += 20;
  } else {
    score += 10;
  }

  // Activity (20 pts)

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
  const transactions =
    getTransactions();

  transactions.unshift(transaction);

  saveTransactions(transactions);

  window.dispatchEvent(
    new Event("transactionsUpdated")
  );
}

export function updateTransaction(
  updatedTransaction: Transaction
) {
  const transactions =
    getTransactions();

  const updated =
    transactions.map((transaction) =>
      transaction.id ===
      updatedTransaction.id
        ? updatedTransaction
        : transaction
    );

  saveTransactions(updated);

  window.dispatchEvent(
    new Event("transactionsUpdated")
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
    new Event("transactionsUpdated")
  );
}

export function clearTransactions() {
  saveTransactions([]);

  window.dispatchEvent(
    new Event("transactionsUpdated")
  );
}