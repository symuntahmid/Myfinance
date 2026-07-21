export type Transaction = {
  id: number;
  type: "Income" | "Expense" | "Investment";
  source: string;
  amount: number;
};

const STORAGE_KEY = "myfinance-transactions";

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

export function getSummary(): {
  income: number;
  expense: number;
  investment: number;
  netWorth: number;
} {
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