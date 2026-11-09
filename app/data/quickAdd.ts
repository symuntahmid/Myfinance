import {
  addTransaction,
  getTransactions,
  type Transaction,
} from "./transactions";

import { todayLocal } from "./mobileMoneySms";

/* ==========================================
   QUICK ADD (Bangladesh defaults)

   The `value` of each category is the exact text
   stored on the transaction, so reports and charts
   keep working the same way as the normal form.
========================================== */

export type QuickCategory = {
  value: string;
  emoji: string;
  en: string;
  bn: string;
};

export const quickExpenseCategories: QuickCategory[] = [
  { value: "🛒 Supermarket", emoji: "🛒", en: "Bazar", bn: "বাজার" },
  { value: "🍔 Food", emoji: "🍔", en: "Food", bn: "খাবার" },
  { value: "🚌 Transport", emoji: "🚌", en: "Transport", bn: "যাতায়াত" },
  { value: "🏠 House", emoji: "🏠", en: "Rent", bn: "বাসা ভাড়া" },
  { value: "💡 Bills", emoji: "💡", en: "Bills", bn: "বিল" },
  { value: "📱 Mobile Recharge", emoji: "📱", en: "Recharge", bn: "রিচার্জ" },
  { value: "📚 Education", emoji: "📚", en: "Tuition", bn: "পড়াশোনা" },
  { value: "🏥 Health", emoji: "🏥", en: "Health", bn: "চিকিৎসা" },
  { value: "🎮 Entertainment", emoji: "🎮", en: "Fun", bn: "বিনোদন" },
  { value: "📦 Others", emoji: "📦", en: "Other", bn: "অন্যান্য" },
];

export const quickSources = [
  { value: "💵 Cash", en: "Cash", bn: "নগদ" },
  { value: "📱 Mobile Banking", en: "bKash / Nagad", bn: "বিকাশ / নগদ" },
  { value: "🏦 Bank", en: "Bank", bn: "ব্যাংক" },
];

/* ==========================================
   TEXT (English + Bangla)
========================================== */

export const quickText = {
  en: {
    menuTitle: "Quick Add",
    menuSubtitle: "Amount + one tap, or paste a bKash/Nagad SMS",
    title: "Quick Add",
    tabQuick: "Quick",
    tabSms: "Paste SMS",
    amountLabel: "How much did you spend?",
    categoryLabel: "What for?",
    sourceLabel: "Paid with",
    save: "Save",
    saved: "Saved",
    smsHint: "Paste the bKash, Nagad, Rocket or bank message here.",
    smsPlaceholder:
      "You have sent Tk 500.00 to 01XXXXXXXXX. Fee Tk 0.00. Balance Tk 1,000.00. TrxID ...",
    pasteButton: "Paste from clipboard",
    readButton: "Read message",
    privacy: "Your message is read on this device only.",
    income: "Income",
    expense: "Expense",
    dateLabel: "Date",
    sourceShort: "Source",
    saveThis: "Save this",
    duplicate: "This TrxID is already saved. Nothing to add.",
    errEmpty: "Paste a message first.",
    errNoAmount: "Could not find an amount in this message.",
    errUnknown:
      "Could not tell if this money came in or went out. Use the Quick tab instead.",
    errOwnMoney:
      "This only moves your own money (like Cash In), so there is nothing to record.",
    clipboardFail: "Could not read the clipboard. Paste it in the box.",
    close: "Close",
  },
  bn: {
    menuTitle: "দ্রুত যোগ করুন",
    menuSubtitle: "টাকার পরিমাণ + এক ট্যাপ, অথবা বিকাশ/নগদ SMS পেস্ট করুন",
    title: "দ্রুত যোগ করুন",
    tabQuick: "দ্রুত",
    tabSms: "SMS পেস্ট",
    amountLabel: "কত টাকা খরচ করেছেন?",
    categoryLabel: "কীসের জন্য?",
    sourceLabel: "কীভাবে দিয়েছেন",
    save: "সংরক্ষণ",
    saved: "সংরক্ষিত",
    smsHint: "বিকাশ, নগদ, রকেট বা ব্যাংকের মেসেজ এখানে পেস্ট করুন।",
    smsPlaceholder:
      "You have sent Tk 500.00 to 01XXXXXXXXX. Fee Tk 0.00. Balance Tk 1,000.00. TrxID ...",
    pasteButton: "ক্লিপবোর্ড থেকে পেস্ট",
    readButton: "মেসেজ পড়ুন",
    privacy: "আপনার মেসেজ শুধু এই ডিভাইসেই পড়া হয়।",
    income: "আয়",
    expense: "খরচ",
    dateLabel: "তারিখ",
    sourceShort: "মাধ্যম",
    saveThis: "এটি সংরক্ষণ করুন",
    duplicate: "এই TrxID আগেই সংরক্ষিত আছে। নতুন কিছু যোগ হবে না।",
    errEmpty: "আগে একটি মেসেজ পেস্ট করুন।",
    errNoAmount: "এই মেসেজে টাকার পরিমাণ খুঁজে পাওয়া যায়নি।",
    errUnknown:
      "টাকা এসেছে নাকি গেছে বোঝা যায়নি। দ্রুত ট্যাব ব্যবহার করুন।",
    errOwnMoney:
      "এটি শুধু আপনার নিজের টাকা সরানো (যেমন ক্যাশ ইন), তাই কিছু যোগ করার নেই।",
    clipboardFail: "ক্লিপবোর্ড পড়া যায়নি। বক্সে পেস্ট করুন।",
    close: "বন্ধ করুন",
  },
} as const;

/* ==========================================
   SAVE
========================================== */

// Date.now() alone can collide, so add a random part.
function newId(): number {
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}

export function saveQuickTransaction(input: {
  type: "Income" | "Expense";
  amount: number;
  category: string;
  source: string;
  date?: string;
  note?: string;
}): Transaction {
  const transaction: Transaction = {
    id: newId(),
    type: input.type,
    source: input.source,
    category: input.category,
    amount: input.amount,
    date: input.date ?? todayLocal(),
    note: input.note,
  };

  addTransaction(transaction);

  return transaction;
}

/* ==========================================
   DUPLICATES (same mobile money TrxID)
========================================== */

export function hasTransactionWithTrxId(
  trxId: string | undefined
): boolean {
  if (!trxId) return false;

  return getTransactions().some((transaction) =>
    transaction.note?.toUpperCase().includes(trxId.toUpperCase())
  );
}
