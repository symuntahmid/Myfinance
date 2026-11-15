/* ==========================================
   DEBT PLANNER

   Pay the minimums on everything, then put all
   the extra money on one debt at a time.

   avalanche: highest interest first (pays least)
   snowball : smallest balance first (quick wins)
========================================== */

import {
  addBill,
  deleteBill,
  getBills,
  monthKeyOf,
  updateBill,
} from "@/app/data/bills";
import { getAccounts } from "@/app/data/accounts";
import { addTransaction } from "@/app/data/transactions";
import {
  getDebts,
  recordDebtPayment,
  updateDebt,
  type Debt,
} from "@/app/data/netWorth";

export type Strategy = "avalanche" | "snowball";

export type DebtPlanState = {
  answer: "none" | "owe" | null;
  extra: string;
  strategy: Strategy;
};

export const DEBT_KEY = "myfinance-debt-plan";

export const DEFAULT_DEBT_PLAN: DebtPlanState = {
  answer: null,
  extra: "",
  strategy: "avalanche",
};

export function getDebtPlan(): DebtPlanState {
  if (typeof window === "undefined") return DEFAULT_DEBT_PLAN;

  try {
    return {
      ...DEFAULT_DEBT_PLAN,
      ...JSON.parse(localStorage.getItem(DEBT_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_DEBT_PLAN;
  }
}

export function saveDebtPlan(state: DebtPlanState) {
  localStorage.setItem(DEBT_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("debtPlanUpdated"));
}

export type Payoff = {
  months: number;
  interest: number;
  paid: number;
  never: boolean;
  cleared: { id: string; month: number }[];
};

const MAX_MONTHS = 600;

export function simulate(
  debts: Pick<Debt, "id" | "amount" | "rate" | "minPay">[],
  extra: number,
  strategy: Strategy
): Payoff {
  const live = debts
    .filter((d) => d.amount > 0)
    .map((d) => ({
      id: d.id,
      balance: d.amount,
      rate: Math.max(d.rate ?? 0, 0) / 100 / 12,
      min: Math.max(d.minPay ?? 0, 0),
      yearly: Math.max(d.rate ?? 0, 0),
    }));

  const budget = live.reduce((sum, d) => sum + d.min, 0) + Math.max(extra, 0);
  const cleared: Payoff["cleared"] = [];

  let interest = 0;
  let paid = 0;
  let month = 0;

  if (live.length === 0) {
    return { months: 0, interest: 0, paid: 0, never: false, cleared };
  }

  if (budget <= 0) {
    return { months: 0, interest: 0, paid: 0, never: true, cleared };
  }

  while (live.some((d) => d.balance > 0.005) && month < MAX_MONTHS) {
    month += 1;

    live.forEach((d) => {
      if (d.balance <= 0) return;

      const charge = d.balance * d.rate;

      d.balance += charge;
      interest += charge;
    });

    let left = budget;

    live.forEach((d) => {
      if (d.balance <= 0) return;

      const pay = Math.min(d.min, d.balance, left);

      d.balance -= pay;
      left -= pay;
      paid += pay;
    });

    const order = live
      .filter((d) => d.balance > 0.005)
      .sort((a, b) =>
        strategy === "avalanche"
          ? b.yearly - a.yearly || a.balance - b.balance
          : a.balance - b.balance
      );

    for (const d of order) {
      if (left <= 0) break;

      const pay = Math.min(left, d.balance);

      d.balance -= pay;
      left -= pay;
      paid += pay;
    }

    live.forEach((d) => {
      if (d.balance <= 0.005 && !cleared.some((c) => c.id === d.id)) {
        d.balance = 0;
        cleared.push({ id: d.id, month });
      }
    });
  }

  const never = live.some((d) => d.balance > 0.005);

  return { months: month, interest, paid, never, cleared };
}

/* One loan, one steady payment: used by the story. */
export function storyNumbers() {
  const loan = [{ id: "k", amount: 50000, rate: 24, minPay: 2000 }];
  const slow = simulate(loan, 0, "avalanche");
  const fast = simulate(loan, 1000, "avalanche");

  return {
    amount: 50000,
    rate: 24,
    pay: 2000,
    extra: 1000,
    months: slow.months,
    total: Math.round(slow.paid),
    interest: Math.round(slow.interest),
    monthsSooner: slow.months - fast.months,
    interestSaved: Math.round(slow.interest - fast.interest),
  };
}


/* What to pay each debt THIS month: the minimums, then the extra
   on the debt the strategy says comes first. */
export function allocation(
  debts: Pick<Debt, "id" | "amount" | "rate" | "minPay">[],
  extra: number,
  strategy: Strategy
): Record<string, number> {
  const open = debts.filter((d) => d.amount > 0);
  const out: Record<string, number> = {};

  open.forEach((d) => {
    out[d.id] = Math.min(Math.max(d.minPay ?? 0, 0), d.amount);
  });

  let left = Math.max(extra, 0);

  [...open]
    .sort((a, b) =>
      strategy === "avalanche"
        ? (b.rate ?? 0) - (a.rate ?? 0) || a.amount - b.amount
        : a.amount - b.amount
    )
    .forEach((d) => {
      const room = d.amount - out[d.id];
      const add = Math.min(room, left);

      out[d.id] += add;
      left -= add;
    });

  return out;
}

/* Days until the next due day (0 = today). */
export function daysToDue(day: number, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastThis = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let due = new Date(now.getFullYear(), now.getMonth(), Math.min(day, lastThis));

  if (due < today) {
    const lastNext = new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();

    due = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(day, lastNext));
  }

  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/* Make or refresh one monthly reminder (a Bill) per debt. */
export function syncReminders(alloc: Record<string, number>): number {
  const account = getAccounts()[0]?.source ?? "";
  let count = 0;

  getDebts().forEach((debt) => {
    const amount = Math.round(alloc[debt.id] ?? 0);

    if (!debt.dueDay || debt.amount <= 0 || amount <= 0) return;

    const bill = debt.billId
      ? getBills().find((b) => b.id === debt.billId)
      : undefined;

    if (bill) {
      updateBill(bill.id, { amount, day: debt.dueDay, name: debt.name });
    } else {
      const id = addBill({
        name: debt.name,
        emoji: "💳",
        amount,
        day: debt.dueDay,
        category: "💳 Debt payment",
        source: account,
      });

      updateDebt(debt.id, { billId: id });
    }

    count += 1;
  });

  return count;
}

/* Log a payment: lowers the debt, saves a real expense, and ticks
   this month's reminder off. */
export function payDebt(id: string, amount: number, now: Date = new Date()) {
  const debt = getDebts().find((d) => d.id === id);
  const pay = Math.min(Math.max(amount, 0), debt?.amount ?? 0);

  if (!debt || pay <= 0) return;

  const date = `${monthKeyOf(now)}-${String(now.getDate()).padStart(2, "0")}`;
  const txId = Date.now() + Math.floor(Math.random() * 1000);

  addTransaction({
    id: txId,
    type: "Expense",
    source: getAccounts()[0]?.source ?? "",
    category: "💳 Debt payment",
    amount: pay,
    date,
    note: `Debt: ${debt.name}`,
  });

  window.dispatchEvent(new CustomEvent("transactionsUpdated"));

  const bill = debt.billId
    ? getBills().find((b) => b.id === debt.billId)
    : undefined;

  recordDebtPayment(id, pay, date);

  if (bill) {
    if (debt.amount - pay <= 0.005) {
      deleteBill(bill.id);
      updateDebt(id, { billId: undefined });
    } else if (!bill.paid[monthKeyOf(now)]) {
      updateBill(bill.id, {
        paid: { ...bill.paid, [monthKeyOf(now)]: txId },
      });
    }
  }
}
