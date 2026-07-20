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