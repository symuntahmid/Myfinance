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

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}
export function getSummary() {
  const transactions = getTransactions();

  let income = 0;
  let expense = 0;
  let investment = 0;

  transactions.forEach((t) => {
    switch (t.type) {
      case "Income":
        income += t.amount;
        break;

      case "Expense":
        expense += t.amount;
        break;

      case "Investment":
        investment += t.amount;
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