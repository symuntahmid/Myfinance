/* ==========================================
   ACCOUNTS (Monarch / YNAB style)

   An account is a place your money sits:
   Cash, bKash, Nagad, a bank...

   Each account has a `source` label. A transaction
   belongs to an account when its `source` is the same
   label, so all your OLD transactions already work.

   Balance = opening balance
           + income      into the account
           - expenses    out of the account
           - transfers   out of it
           + transfers   into it

   A transfer (like bKash -> Cash) is NOT an expense.
   Only its fee is.
========================================== */

import {
  getTransactions,
  saveTransactions,
  type Transaction,
} from "./transactions";

export const ACCOUNTS_KEY = "myfinance-accounts";

export type Account = {
  id: string;
  name: string;
  names?: { en: string; bn: string };
  emoji: string;
  source: string;
  openingBalance: number;
};

export const CASH_SOURCE = "💵 Cash";

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "cash",
    name: "Cash",
    names: { en: "Cash", bn: "নগদ টাকা" },
    emoji: "💵",
    source: CASH_SOURCE,
    openingBalance: 0,
  },
  {
    id: "mobile",
    name: "bKash / Nagad",
    names: { en: "bKash / Nagad", bn: "বিকাশ / নগদ" },
    emoji: "📱",
    source: "📱 Mobile Banking",
    openingBalance: 0,
  },
  {
    id: "bank",
    name: "Bank",
    names: { en: "Bank", bn: "ব্যাংক" },
    emoji: "🏦",
    source: "🏦 Bank",
    openingBalance: 0,
  },
];

export function accountName(
  account: Account,
  language: "en" | "bn"
): string {
  return account.names?.[language] ?? account.name;
}

// "Available Cash" is what goals use for the cash account.
export function normalizeSource(source?: string): string {
  if (!source) return "";

  if (/^(?:💵\s*)?available cash$/i.test(source.trim())) {
    return CASH_SOURCE;
  }

  return source;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}


/* ==========================================
   STORAGE
========================================== */

export function getAccounts(): Account[] {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNTS.map((item) => ({ ...item }));
  }

  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);

    if (!saved) {
      return DEFAULT_ACCOUNTS.map((item) => ({ ...item }));
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ACCOUNTS.map((item) => ({ ...item }));
    }

    return parsed as Account[];
  } catch {
    return DEFAULT_ACCOUNTS.map((item) => ({ ...item }));
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event("accountsUpdated"));
}

export function addAccount(input: {
  name: string;
  emoji: string;
  openingBalance: number;
}): Account {
  const accounts = getAccounts();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const account: Account = {
    id,
    name: input.name.trim(),
    emoji: input.emoji || "💼",
    // A unique label so only this account's transactions match.
    source: `${input.emoji || "💼"} ${input.name.trim()}`,
    openingBalance: input.openingBalance,
  };

  saveAccounts([...accounts, account]);

  return account;
}

export function renameAccount(id: string, name: string) {
  saveAccounts(
    getAccounts().map((item) =>
      item.id === id
        ? { ...item, name: name.trim(), names: undefined }
        : item
    )
  );
}

export function deleteAccount(id: string) {
  const left = getAccounts().filter((item) => item.id !== id);

  saveAccounts(left);
}


/* ==========================================
   BALANCES
========================================== */

export function computeBalances(
  accounts: Account[],
  transactions: Transaction[]
): Record<string, number> {
  const bySource = new Map<string, Account>();

  accounts.forEach((account) =>
    bySource.set(account.source, account)
  );

  const balance: Record<string, number> = {};

  accounts.forEach((account) => {
    balance[account.id] = account.openingBalance;
  });

  const add = (source: string | undefined, amount: number) => {
    const account = bySource.get(normalizeSource(source));

    if (account) balance[account.id] += amount;
  };

  transactions.forEach((tx) => {
    switch (tx.type) {
      case "Income":
        add(tx.source, tx.amount);
        break;

      case "Expense":
      case "Investment":
        add(tx.source, -tx.amount);
        break;

      case "Transfer":
        add(tx.source, -tx.amount);
        add(tx.destination, tx.amount);
        break;
    }
  });

  Object.keys(balance).forEach((id) => {
    balance[id] = round2(balance[id]);
  });

  return balance;
}

export function getBalances(): Record<string, number> {
  return computeBalances(getAccounts(), getTransactions());
}

// Set the account's balance to a number the user knows is true.
export function setCurrentBalance(id: string, target: number) {
  const accounts = getAccounts();
  const account = accounts.find((item) => item.id === id);

  if (!account) return;

  const current = computeBalances(accounts, getTransactions())[id];

  saveAccounts(
    accounts.map((item) =>
      item.id === id
        ? {
            ...item,
            openingBalance: round2(
              item.openingBalance + (target - current)
            ),
          }
        : item
    )
  );
}

// First account whose name or label looks like the provider
// ("bKash", "Nagad"), otherwise the generic mobile account.
export function accountForProvider(
  accounts: Account[],
  provider: string
): Account | undefined {
  const lower = provider.toLowerCase();

  const exact = accounts.find(
    (item) =>
      lower !== "mobile money" &&
      lower !== "bank" &&
      !DEFAULT_ACCOUNTS.some((base) => base.id === item.id) &&
      item.name.toLowerCase().includes(lower)
  );

  if (exact) return exact;

  if (lower === "bank") {
    return accounts.find((item) => item.source === "🏦 Bank");
  }

  return accounts.find((item) => item.source === "📱 Mobile Banking");
}


/* ==========================================
   TRANSFER
========================================== */

function newId(): number {
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}

export function transferBetween(input: {
  from: Account;
  to: Account;
  amount: number;
  fee?: number;
  date?: string;
  note?: string;
}) {
  const { from, to, amount } = input;
  const fee = input.fee && input.fee > 0 ? input.fee : 0;

  if (!(amount > 0) || from.id === to.id) return false;

  const date = input.date ?? new Date().toISOString();

  const entries: Transaction[] = [
    {
      id: newId(),
      type: "Transfer",
      source: from.source,
      destination: to.source,
      amount,
      date,
      note: input.note ?? `${from.name} → ${to.name}`,
    },
  ];

  if (fee > 0) {
    entries.push({
      id: newId(),
      type: "Expense",
      source: from.source,
      category: "📦 Others",
      amount: fee,
      date,
      note: `Transfer fee (${from.name} → ${to.name})`,
    });
  }

  // Saved directly so a fee does not give daily-task XP.
  saveTransactions([...entries, ...getTransactions()]);

  window.dispatchEvent(new CustomEvent("transactionsUpdated"));

  return true;
}
