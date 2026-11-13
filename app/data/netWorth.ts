/* ==========================================
   NET WORTH (Monarch style)

   Net worth = everything you own - everything you owe.

   Owned:  account balances + goal savings + investments
   Owed:   debts you add yourself (loans, DPS you owe, etc.)

   A small monthly snapshot is kept so the page can say
   whether it went up or down since last month.
========================================== */

export const DEBTS_KEY = "myfinance-debts";
export const NETWORTH_HISTORY_KEY = "myfinance-networth-history";

export type Debt = {
  id: string;
  name: string;
  emoji: string;
  amount: number; // how much is still owed
};

export type NetWorth = {
  accounts: number;
  goals: number;
  investments: number;
  assets: number;
  debts: number;
  netWorth: number;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeNetWorth(input: {
  accounts: number;
  goals: number;
  investments: number;
  debts: Debt[];
}): NetWorth {
  const owed = input.debts.reduce(
    (sum, item) => sum + Math.max(item.amount, 0),
    0
  );

  const assets =
    input.accounts + input.goals + input.investments;

  return {
    accounts: round2(input.accounts),
    goals: round2(input.goals),
    investments: round2(input.investments),
    assets: round2(assets),
    debts: round2(owed),
    netWorth: round2(assets - owed),
  };
}


/* ==========================================
   DEBTS
========================================== */

export function getDebts(): Debt[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      localStorage.getItem(DEBTS_KEY) || "[]"
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDebts(list: Debt[]) {
  localStorage.setItem(DEBTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("debtsUpdated"));
}

export function addDebt(input: Omit<Debt, "id">) {
  saveDebts([
    ...getDebts(),
    {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    },
  ]);
}

export function updateDebtAmount(id: string, amount: number) {
  saveDebts(
    getDebts().map((item) =>
      item.id === id ? { ...item, amount } : item
    )
  );
}

export function deleteDebt(id: string) {
  saveDebts(getDebts().filter((item) => item.id !== id));
}


/* ==========================================
   MONTHLY SNAPSHOTS
========================================== */

export function getHistory(): Record<string, number> {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(
      localStorage.getItem(NETWORTH_HISTORY_KEY) || "{}"
    );

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Remember this month's latest number.
export function recordSnapshot(month: string, value: number) {
  const history = getHistory();

  if (history[month] === value) return;

  localStorage.setItem(
    NETWORTH_HISTORY_KEY,
    JSON.stringify({ ...history, [month]: value })
  );
}

// The most recent snapshot from an earlier month, or null.
export function previousSnapshot(
  month: string
): { month: string; value: number } | null {
  const history = getHistory();

  const earlier = Object.keys(history)
    .filter((key) => key < month)
    .sort();

  const key = earlier[earlier.length - 1];

  return key ? { month: key, value: history[key] } : null;
}
