/* ==========================================
   THE 50 / 30 / 20 CHECK

   Needs  : about 50% of income
   Wants  : about 30% of income
   Savings: about 20% of income

   Each category is a need or a want. The defaults
   can be changed by the person (kept on the phone).
========================================== */

import { getTransactions } from "@/app/data/transactions";

export type Bucket = "needs" | "wants";

export const TARGETS = { needs: 50, wants: 30, savings: 20 } as const;

const KEY = "myfinance-need-want";

const DEFAULTS: Record<string, Bucket> = {
  "🛒 Supermarket": "needs",
  "🏠 House": "needs",
  "💡 Bills": "needs",
  "📱 Mobile Recharge": "needs",
  "🚌 Transport": "needs",
  "🏥 Health": "needs",
  "📚 Education": "needs",
  "🍔 Food": "wants",
  "🎮 Entertainment": "wants",
  "📦 Others": "wants",
};

function readOverrides(): Record<string, Bucket> {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function bucketOf(category: string): Bucket {
  return readOverrides()[category] ?? DEFAULTS[category] ?? "wants";
}

export function setBucket(category: string, bucket: Bucket) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ ...readOverrides(), [category]: bucket })
  );

  window.dispatchEvent(new Event("budgetRuleUpdated"));
}

export type RuleRow = {
  raw: string;
  amount: number;
  bucket: Bucket;
};

export type RuleResult = {
  month: string; // yyyy-mm
  income: number;
  needs: number;
  wants: number;
  savings: number; // what is left: kept plus invested
  rows: RuleRow[];
  suggestion: { raw: string; bucket: Bucket; cut: number } | null;
};

function sumMonth(month: string, type: string) {
  return getTransactions().filter(
    (item) =>
      item.type === type &&
      item.amount > 0 &&
      (() => {
        const date = new Date(item.date);

        return (
          !Number.isNaN(date.getTime()) &&
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` ===
            month
        );
      })()
  );
}

export function computeRule(now: Date = new Date()): RuleResult | null {
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const candidates = [
    key(now),
    key(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
  ];

  const month = candidates.find((m) =>
    sumMonth(m, "Income").some((item) => item.amount > 0)
  );

  if (!month) return null;

  const income = sumMonth(month, "Income").reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const byCategory = new Map<string, number>();

  sumMonth(month, "Expense").forEach((item) => {
    const raw = item.category?.trim() || "📦 Others";

    byCategory.set(raw, (byCategory.get(raw) ?? 0) + item.amount);
  });

  const rows: RuleRow[] = [...byCategory.entries()]
    .map(([raw, amount]) => ({ raw, amount, bucket: bucketOf(raw) }))
    .sort((a, b) => b.amount - a.amount);

  const needs = rows
    .filter((row) => row.bucket === "needs")
    .reduce((sum, row) => sum + row.amount, 0);

  const wants = rows
    .filter((row) => row.bucket === "wants")
    .reduce((sum, row) => sum + row.amount, 0);

  const savings = income - needs - wants;

  /* One clear suggestion: trim the bucket that is furthest over. */

  let suggestion: RuleResult["suggestion"] = null;

  if (savings < (income * TARGETS.savings) / 100) {
    const overNeeds = needs - (income * TARGETS.needs) / 100;
    const overWants = wants - (income * TARGETS.wants) / 100;
    const bucket: Bucket = overNeeds >= overWants ? "needs" : "wants";
    const over = Math.max(overNeeds, overWants);
    const top = rows.find((row) => row.bucket === bucket);

    if (top && over > 0) {
      suggestion = {
        raw: top.raw,
        bucket,
        cut: Math.round(Math.min(over, top.amount)),
      };
    }
  }

  return { month, income, needs, wants, savings, rows, suggestion };
}
