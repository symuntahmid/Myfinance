import { formatCurrency } from "@/app/utils/currency";
import { buildCoach, type Lang } from "./coach";
import { getTransactions } from "./transactions";
import { getAccounts, getBalances } from "./accounts";
import { computePlan, getCustomCategories, getPlan } from "./plan";
import { categoryLabel } from "./categoryLabel";

export type EntryNote = { tone: "good" | "watch" | "calm"; text: string };

const monthKey = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// One short, kind line shown right after an expense is saved.
// Wins first, warnings soft. It never scolds.
export function entryFeedback(category: string, lang: Lang): EntryNote {
  const bn = lang === "bn";
  const money = (v: number) => formatCurrency(Math.round(v));

  try {
    const balances = getBalances();
    const total = getAccounts().reduce((sum, a) => sum + (balances[a.id] ?? 0), 0);

    const plan = computePlan({
      month: monthKey(),
      plan: getPlan(),
      transactions: getTransactions(),
      totalBalance: total,
      customCategories: getCustomCategories().map((c) => c.value),
    });

    const row = plan.rows.find((r) => r.category === category);
    const name = categoryLabel(category, lang);

    if (row && row.assigned > 0) {
      if (row.available < 0) {
        return {
          tone: "watch",
          text: bn
            ? `${name} বাজেটের চেয়ে ${money(-row.available)} বেশি। পরের খরচে একটু সাবধান।`
            : `${name} is ${money(-row.available)} over. Go easy on the next one.`,
        };
      }

      if (row.available <= row.assigned * 0.2) {
        return {
          tone: "watch",
          text: bn
            ? `${name} বাজেটে ${money(row.available)} বাকি আছে।`
            : `${money(row.available)} left in ${name}.`,
        };
      }

      return {
        tone: "good",
        text: bn
          ? `ঠিক পথে আছেন। ${name} বাজেটে ${money(row.available)} বাকি।`
          : `On track. ${money(row.available)} left in ${name}.`,
      };
    }

    const coach = buildCoach(lang);

    if (coach.perDay > 0) {
      return {
        tone: "good",
        text: bn
          ? `আজ থেকে প্রতিদিন ${money(coach.perDay)} খরচ করতে পারবেন।`
          : `You can spend ${money(coach.perDay)} a day from here.`,
      };
    }
  } catch {}

  return {
    tone: "calm",
    text: bn ? "লিখে রাখা হলো। প্রতিটি এন্ট্রি আপনাকে এগিয়ে রাখে।" : "Logged. Every entry keeps you ahead.",
  };
}
