export type Transaction = {
  id: number;

  type: "Income" | "Expense" | "Investment";

  source: string;

  category?: string;

  amount: number;

  date: string;

  note?: string;

  /* Auto Repeat */
  autoRepeat?: boolean;

  repeatFrequency?:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "yearly";

  /* Reminder */
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

/* -------------------------------- */
/* Storage                          */
/* -------------------------------- */

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveTransactions(
  transactions: Transaction[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

/* -------------------------------- */
/* Summary                          */
/* -------------------------------- */

export function getSummary() {
  const transactions = getTransactions();

  let income = 0;
  let expense = 0;
  let investment = 0;

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case "Income":
        income += transaction.amount;
        break;

      case "Expense":
        expense += transaction.amount;
        break;

      case "Investment":
        investment += transaction.amount;
        break;
    }
  });

  return {
    income,
    expense,
    investment,
    netWorth: income - expense + investment,
  };
}

/* -------------------------------- */
/* Monthly Report                   */
/* -------------------------------- */

export function getMonthlyReport() {
  const transactions = getTransactions();

  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const investment = transactions
    .filter((t) => t.type === "Investment")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = income - expense;

  const savingsRate =
    income === 0 ? 0 : (savings / income) * 100;

  const largestExpense =
    transactions
      .filter((t) => t.type === "Expense")
      .sort((a, b) => b.amount - a.amount)[0] || null;

  const investmentCategories =
    transactions.filter(
      (t) => t.type === "Investment"
    );

  const categoryTotals =
    investmentCategories.reduce(
      (acc, t) => {
        const category =
          t.category || "Other";

        acc[category] =
          (acc[category] || 0) + t.amount;

        return acc;
      },
      {} as Record<string, number>
    );

  const topInvestmentCategory =
    Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "None";

  return {
    income,
    expense,
    investment,
    savings,
    savingsRate,
    totalTransactions:
      transactions.length,
    largestExpense,
    topInvestmentCategory,
  };
}

/* -------------------------------- */
/* Financial Health                 */
/* -------------------------------- */

export function getFinancialHealthScore() {
  const report = getMonthlyReport();

  let score = 0;

  score += Math.min(
    report.savingsRate,
    40
  );

  if (report.investment > 0) {
    score += 20;
  }

  if (report.expense <= report.income) {
    score += 20;
  } else {
    score += 10;
  }

  score += Math.min(
    report.totalTransactions,
    20
  );

  return Math.min(
    Math.round(score),
    100
  );
}

/* -------------------------------- */
/* CRUD                             */
/* -------------------------------- */

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

export function deleteTransaction(
  id: number
) {
  const transactions =
    getTransactions().filter(
      (t) => t.id !== id
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