/* ==========================================
   RECURRING BILLS (Monarch style)

   A bill repeats on the same day every month:
   rent, internet, school fee, DPS instalment...

   "Mark paid" saves a real expense, so reports and
   account balances stay correct. "Undo" removes it.
========================================== */

import {
  getTransactions,
  saveTransactions,
  type Transaction,
} from "./transactions";

export const BILLS_KEY = "myfinance-bills";

export type Bill = {
  id: string;
  name: string;
  emoji: string;
  amount: number;
  day: number; // day of the month, 1-31
  category: string; // stored category, like "💡 Bills"
  source: string; // account label the money comes from
  paid: Record<string, number>; // "yyyy-mm" -> id of the expense saved
};

export type BillState =
  | "paid"
  | "overdue"
  | "today"
  | "soon"
  | "upcoming";

export type BillStatus = {
  bill: Bill;
  state: BillState;
  dueDate: string; // yyyy-mm-dd
  daysLeft: number; // negative when overdue
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function monthKeyOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function dateKeyOf(date: Date): string {
  return `${monthKeyOf(date)}-${pad(date.getDate())}`;
}

// The bill's due date in a given month (short months handled).
export function dueDateIn(bill: Bill, month: string): string {
  const [year, m] = month.split("-").map(Number);
  const last = new Date(year, m, 0).getDate();

  return `${month}-${pad(Math.min(bill.day, last))}`;
}

function daysBetween(from: string, to: string): number {
  const f = from.split("-").map(Number);
  const t = to.split("-").map(Number);

  return Math.round(
    (Date.UTC(t[0], t[1] - 1, t[2]) -
      Date.UTC(f[0], f[1] - 1, f[2])) /
      86_400_000
  );
}

export function billStatus(bill: Bill, today: Date): BillStatus {
  const month = monthKeyOf(today);
  const dueDate = dueDateIn(bill, month);
  const daysLeft = daysBetween(dateKeyOf(today), dueDate);

  let state: BillState;

  if (bill.paid[month]) state = "paid";
  else if (daysLeft < 0) state = "overdue";
  else if (daysLeft === 0) state = "today";
  else if (daysLeft <= 3) state = "soon";
  else state = "upcoming";

  return { bill, state, dueDate, daysLeft };
}

const ORDER: Record<BillState, number> = {
  overdue: 0,
  today: 1,
  soon: 2,
  upcoming: 3,
  paid: 4,
};

export function sortedStatuses(
  bills: Bill[],
  today: Date
): BillStatus[] {
  return bills
    .map((bill) => billStatus(bill, today))
    .sort(
      (a, b) =>
        ORDER[a.state] - ORDER[b.state] ||
        a.daysLeft - b.daysLeft
    );
}


/* ==========================================
   STORAGE
========================================== */

export function getBills(): Bill[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      localStorage.getItem(BILLS_KEY) || "[]"
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBills(bills: Bill[]) {
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  window.dispatchEvent(new Event("billsUpdated"));
}

export function addBill(input: Omit<Bill, "id" | "paid">) {
  saveBills([
    ...getBills(),
    {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      paid: {},
    },
  ]);
}

export function deleteBill(id: string) {
  saveBills(getBills().filter((item) => item.id !== id));
}

export function markBillPaid(id: string, today = new Date()) {
  const bills = getBills();
  const bill = bills.find((item) => item.id === id);
  const month = monthKeyOf(today);

  if (!bill || bill.paid[month]) return;

  const txId = Date.now() + Math.floor(Math.random() * 1000);

  const expense: Transaction = {
    id: txId,
    type: "Expense",
    source: bill.source,
    category: bill.category,
    amount: bill.amount,
    date: dateKeyOf(today),
    note: `Bill: ${bill.name}`,
  };

  saveTransactions([expense, ...getTransactions()]);

  saveBills(
    bills.map((item) =>
      item.id === id
        ? { ...item, paid: { ...item.paid, [month]: txId } }
        : item
    )
  );

  window.dispatchEvent(new CustomEvent("transactionsUpdated"));
}

export function undoBillPaid(id: string, today = new Date()) {
  const bills = getBills();
  const bill = bills.find((item) => item.id === id);
  const month = monthKeyOf(today);

  if (!bill || !bill.paid[month]) return;

  const txId = bill.paid[month];

  saveTransactions(
    getTransactions().filter((item) => item.id !== txId)
  );

  const rest = { ...bill.paid };
  delete rest[month];

  saveBills(
    bills.map((item) =>
      item.id === id ? { ...item, paid: rest } : item
    )
  );

  window.dispatchEvent(new CustomEvent("transactionsUpdated"));
}
