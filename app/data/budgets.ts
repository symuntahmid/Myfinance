export type BudgetCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Travel"
  | "Other";

export type Budget = {
  id: string;
  category: BudgetCategory;
  amount: number;
  month: string;
};

const STORAGE_KEY = "myfinance-budgets";

/* ===========================
   STORAGE
=========================== */

export function getBudgets(): Budget[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function saveBudgets(
  budgets: Budget[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(budgets)
  );

  window.dispatchEvent(
    new Event("budgetsUpdated")
  );
}

/* ===========================
   CRUD
=========================== */

export function addBudget(
  budget: Budget
) {
  const budgets = getBudgets();

  budgets.unshift(budget);

  saveBudgets(budgets);
}

export function updateBudget(
  updatedBudget: Budget
) {
  const budgets = getBudgets().map(
    (budget) =>
      budget.id === updatedBudget.id
        ? updatedBudget
        : budget
  );

  saveBudgets(budgets);
}

export function deleteBudget(
  id: string
) {
  const budgets = getBudgets().filter(
    (budget) => budget.id !== id
  );

  saveBudgets(budgets);
}

export function clearBudgets() {
  saveBudgets([]);
}