import { quickExpenseCategories } from "@/app/data/quickAdd";

/* Names the app makes itself, which are stored in English. */
const SYSTEM: Record<string, { en: string; bn: string }> = {
  "Debt payment": { en: "Debt payment", bn: "ঋণ পরিশোধ" },
  Gift: { en: "Gifts", bn: "উপহার" },
  Salary: { en: "Salary", bn: "বেতন" },
  Freelance: { en: "Freelance", bn: "ফ্রিল্যান্স" },
  Business: { en: "Business", bn: "ব্যবসা" },
  Investment: { en: "Investment", bn: "বিনিয়োগ" },
  Savings: { en: "Savings", bn: "সঞ্চয়" },
  Insurance: { en: "Insurance", bn: "বীমা" },
  Shopping: { en: "Shopping", bn: "কেনাকাটা" },
  Travel: { en: "Travel", bn: "ভ্রমণ" },
  Subscriptions: { en: "Subscriptions", bn: "সাবস্ক্রিপশন" },
};

/* A readable name for a stored category, in the person's language. */
export function categoryLabel(category: string, lang: "en" | "bn"): string {
  const found = quickExpenseCategories.find((item) => item.value === category);

  if (found) return found[lang];

  const plain = category.replace(/^[^\p{L}\p{N}]+/u, "");

  return SYSTEM[plain]?.[lang] ?? plain;
}
