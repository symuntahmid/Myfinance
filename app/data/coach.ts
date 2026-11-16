/* ==========================================
   MONEY COACH (rules, no AI)

   Reads the person's own numbers and says what
   matters today: how much is safe to spend, what
   to pay soon, and one or two things to do next.
   Every sentence comes from a plain rule.
========================================== */

import { getNetWorthNow } from "@/app/data/overview";
import { getBalances, getAccounts } from "@/app/data/accounts";
import { getBills, sortedStatuses } from "@/app/data/bills";
import { getDebts } from "@/app/data/netWorth";
import { daysToDue } from "@/app/data/debtPlan";
import { getGoals, monthsLeft } from "@/app/data/goals";
import { getSettings } from "@/app/data/settings";
import { getTransactions } from "@/app/data/transactions";
import { computePlan, getPlan } from "@/app/data/plan";
import { buildMonthReport, monthKey } from "@/app/data/reportData";
import { buildProgress } from "@/app/data/progress";
import { formatCurrency } from "@/app/utils/currency";
import { dayOf, todayLocal } from "@/app/utils/date";
import { daysUntil, expectedSaved, upcomingOccasions } from "@/app/data/occasions";

export type Lang = "en" | "bn";

export type CoachTip = {
  id: string;
  tone: "warn" | "nudge" | "win";
  text: string;
  href: string;
  cta: string;
};

export type Afford = {
  verdict: "yes" | "tight" | "no";
  text: string;
};

export type CoachState = {
  cash: number;
  billsLeft: number;
  safe: number;
  perDay: number;
  daysLeft: number;
  tips: CoachTip[];
  afford: (amount: number) => Afford;
};

const pick = (lang: Lang, en: string, bn: string) => (lang === "bn" ? bn : en);

export function buildCoach(lang: Lang, now: Date = new Date()): CoachState {
  const cash = Math.max(getNetWorthNow().accounts, 0);
  const month = monthKey(now);

  /* Bills still to pay this month (and anything overdue). */
  const statuses = sortedStatuses(getBills(), now);
  const unpaid = statuses.filter(
    (item) =>
      item.state !== "paid" &&
      (item.state === "overdue" || item.dueDate.startsWith(month))
  );
  const billsLeft = unpaid.reduce((sum, item) => sum + item.bill.amount, 0);

  const daysLeft =
    new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() -
    now.getDate() +
    1;

  const safe = Math.max(cash - billsLeft, 0);
  const perDay = Math.floor(safe / Math.max(daysLeft, 1));

  const money = formatCurrency;
  const tips: CoachTip[] = [];

  /* 1. Bills */
  const overdue = unpaid.filter((item) => item.state === "overdue");

  if (overdue.length > 0) {
    tips.push({
      id: "overdue",
      tone: "warn",
      text: pick(
        lang,
        `${overdue[0].bill.name} is overdue (${money(overdue[0].bill.amount)}).${
          overdue.length > 1 ? ` ${overdue.length - 1} more are late too.` : ""
        } Pay it first.`,
        `${overdue[0].bill.name} এর তারিখ পার হয়ে গেছে (${money(overdue[0].bill.amount)})।${
          overdue.length > 1 ? ` আরও ${overdue.length - 1}টি বাকি।` : ""
        } আগে এটি দিন।`
      ),
      href: "/bills",
      cta: pick(lang, "Open bills", "বিল দেখুন"),
    });
  }

  const dueSoon = unpaid.filter(
    (item) => item.state === "today" || item.state === "soon"
  );
  const dueSoonTotal = dueSoon.reduce((sum, item) => sum + item.bill.amount, 0);

  if (dueSoon.length > 0 && cash < dueSoonTotal) {
    tips.push({
      id: "billsShort",
      tone: "warn",
      text: pick(
        lang,
        `Bills of ${money(dueSoonTotal)} are due soon, but you hold ${money(cash)}. Move money in or pay the smallest first.`,
        `${money(dueSoonTotal)} এর বিল শিগগিরই দিতে হবে, কিন্তু আছে ${money(cash)}। টাকা আনুন, বা ছোটটি আগে দিন।`
      ),
      href: "/accounts",
      cta: pick(lang, "See accounts", "অ্যাকাউন্ট দেখুন"),
    });
  } else if (dueSoon.length > 0) {
    tips.push({
      id: "billsSoon",
      tone: "nudge",
      text: pick(
        lang,
        `${dueSoon[0].bill.name} (${money(dueSoon[0].bill.amount)}) is due ${
          dueSoon[0].state === "today" ? "today" : `in ${dueSoon[0].daysLeft} day(s)`
        }.`,
        `${dueSoon[0].bill.name} (${money(dueSoon[0].bill.amount)}) ${
          dueSoon[0].state === "today" ? "আজই" : `${dueSoon[0].daysLeft} দিন পরে`
        } দিতে হবে।`
      ),
      href: "/bills",
      cta: pick(lang, "Mark paid", "পরিশোধ করুন"),
    });
  }

  /* 2. A plan category already overspent this month */
  const plan = getPlan();

  if (plan[month]) {
    const balances = getBalances();
    const total = getAccounts().reduce(
      (sum, item) => sum + (balances[item.id] ?? 0),
      0
    );

    const result = computePlan({
      month,
      plan,
      transactions: getTransactions(),
      totalBalance: total,
    });

    const over = result.rows
      .filter((row) => row.assigned > 0 && row.spent > row.assigned)
      .sort((a, b) => b.spent - b.assigned - (a.spent - a.assigned))[0];

    if (over) {
      tips.push({
        id: "overspent",
        tone: "warn",
        text: pick(
          lang,
          `${over.category} is ${money(over.spent - over.assigned)} over its plan this month. Slow down there.`,
          `${over.category} এই মাসের পরিকল্পনার চেয়ে ${money(over.spent - over.assigned)} বেশি গেছে। এখানে একটু থামুন।`
        ),
        href: "/plan",
        cta: pick(lang, "Open plan", "প্ল্যান দেখুন"),
      });
    }
  }

  /* 3. Debt payment close */
  const debt = getDebts()
    .filter((item) => item.amount > 0 && item.dueDay)
    .map((item) => ({ item, days: daysToDue(item.dueDay as number, now) }))
    .sort((a, b) => a.days - b.days)[0];

  if (debt && debt.days <= 5) {
    tips.push({
      id: "debt",
      tone: "nudge",
      text: pick(
        lang,
        `${debt.item.name} payment is due ${debt.days === 0 ? "today" : `in ${debt.days} day(s)`}. Paying on time protects you from late fees.`,
        `${debt.item.name} এর কিস্তি ${debt.days === 0 ? "আজই" : `${debt.days} দিন পরে`}। সময়মতো দিলে জরিমানা এড়ানো যায়।`
      ),
      href: "/debt-plan",
      cta: pick(lang, "Debt plan", "ঋণ পরিকল্পনা"),
    });
  }

  /* 4. Salary day passed, no income logged */
  const settings = getSettings();
  const report = buildMonthReport(month, now);

  if (
    settings.salaryDay &&
    now.getDate() >= settings.salaryDay &&
    report.income === 0
  ) {
    tips.push({
      id: "salary",
      tone: "nudge",
      text: pick(
        lang,
        `Your salary day (day ${settings.salaryDay}) has passed. Add this month's income so your numbers are right.`,
        `বেতনের দিন ছিল ${settings.salaryDay} তারিখ। এই মাসের আয় যোগ করুন, তাহলে হিসাব ঠিক থাকবে।`
      ),
      href: "/money",
      cta: pick(lang, "Add income", "আয় যোগ করুন"),
    });
  }

  /* 5. Low safety cushion */
  const progress = buildProgress(now);

  if (progress.runway !== null && progress.runway < 1) {
    tips.push({
      id: "runway",
      tone: "warn",
      text: pick(
        lang,
        `Your cash covers about ${progress.runway} month of spending. Aim for 1 month first, then 3.`,
        `আপনার নগদ টাকা প্রায় ${progress.runway} মাসের খরচ চালাবে। আগে ১ মাস, তারপর ৩ মাসের লক্ষ্য রাখুন।`
      ),
      href: "/freedom",
      cta: pick(lang, "Freedom path", "ফ্রিডম পাথ"),
    });
  }

  /* 6. A goal with a date and nothing saved */
  const goal = getGoals()
    .filter((item) => item.savedAmount <= 0 && item.targetDate)
    .map((item) => ({ item, months: monthsLeft(item.targetDate) }))
    .filter((entry) => entry.months !== null && entry.months > 0)
    .sort((a, b) => (a.months as number) - (b.months as number))[0];

  if (goal) {
    const each = Math.ceil(goal.item.targetAmount / (goal.months as number));

    tips.push({
      id: "goal",
      tone: "nudge",
      text: pick(
        lang,
        `Nothing saved for ${goal.item.title} yet. About ${money(each)} a month gets you there.`,
        `${goal.item.title} এর জন্য এখনো কিছু জমেনি। মাসে প্রায় ${money(each)} জমালে লক্ষ্যে পৌঁছাবেন।`
      ),
      href: "/goals",
      cta: pick(lang, "Add money", "টাকা যোগ করুন"),
    });
  }

  /* 6b. A festival is coming */
  const festivals = getGoals();

  upcomingOccasions(now)
    .filter((item) => daysUntil(item.date, now) <= 150)
    .slice(0, 1)
    .forEach((item) => {
      const name = {
        fitr: pick(lang, "Eid-ul-Fitr", "ঈদুল ফিতর"),
        adha: pick(lang, "Eid-ul-Adha", "ঈদুল আযহা"),
        boishakh: pick(lang, "Pohela Boishakh", "পহেলা বৈশাখ"),
      }[item.kind];

      const days = daysUntil(item.date, now);
      const made = festivals.find((goal) => goal.occasion === item.id);

      if (!made) {
        tips.push({
          id: "festival",
          tone: "nudge",
          text: pick(
            lang,
            `${name} is about ${days} days away. Plan it now and the monthly amount stays small.`,
            `${name} প্রায় ${days} দিন পরে। এখনই পরিকল্পনা করুন, মাসিক অঙ্ক ছোট থাকবে।`
          ),
          href: "/occasions",
          cta: pick(lang, "Plan it", "পরিকল্পনা করুন"),
        });

        return;
      }

      const behind =
        expectedSaved(made.targetAmount, made.createdAt, item.date, now) -
        made.savedAmount;

      if (behind > made.targetAmount * 0.2) {
        tips.push({
          id: "festivalBehind",
          tone: "warn",
          text: pick(
            lang,
            `Your ${name} fund is ${money(behind)} behind. Add some now so it does not pile up at the end.`,
            `${name} এর তহবিল ${money(behind)} পিছিয়ে। এখন কিছু যোগ করুন, শেষে চাপ কমবে।`
          ),
          href: "/goals",
          cta: pick(lang, "Add money", "টাকা যোগ করুন"),
        });
      }
    });

  /* 7. No entry for two days */
  const lastDay = getTransactions()
    .map((item) => dayOf(item.date))
    .filter(Boolean)
    .sort()
    .pop();

  if (lastDay) {
    const gap = Math.round(
      (new Date(todayLocal(now)).getTime() - new Date(lastDay).getTime()) /
        86_400_000
    );

    if (gap >= 2) {
      tips.push({
        id: "gap",
        tone: "nudge",
        text: pick(
          lang,
          `No entries for ${gap} days. Add what you spent so your numbers stay true.`,
          `${gap} দিন কোনো এন্ট্রি নেই। যা খরচ করেছেন যোগ করুন, তাহলে হিসাব ঠিক থাকবে।`
        ),
        href: "/money",
        cta: pick(lang, "Add entry", "এন্ট্রি দিন"),
      });
    }
  }

  /* 8. A good month */
  if (report.keptPct !== null && report.keptPct >= 20 && now.getDate() >= 7) {
    tips.push({
      id: "win",
      tone: "win",
      text: pick(
        lang,
        `Well done. You have kept ${report.keptPct}% of your income this month.`,
        `চমৎকার! এই মাসে আয়ের ${report.keptPct}% জমিয়েছেন।`
      ),
      href: "/reports",
      cta: pick(lang, "See report", "রিপোর্ট দেখুন"),
    });
  }

  const order = { warn: 0, nudge: 1, win: 2 } as const;

  tips.sort((a, b) => order[a.tone] - order[b.tone]);

  const afford = (amount: number): Afford => {
    if (!(amount > 0)) {
      return {
        verdict: "no",
        text: pick(lang, "Type an amount first.", "আগে টাকার অঙ্ক লিখুন।"),
      };
    }

    if (amount > cash) {
      return {
        verdict: "no",
        text: pick(
          lang,
          `No. You hold ${money(cash)}, which is ${money(amount - cash)} short.`,
          `না। আপনার কাছে ${money(cash)} আছে, ${money(amount - cash)} কম পড়ছে।`
        ),
      };
    }

    if (amount > safe) {
      return {
        verdict: "tight",
        text: pick(
          lang,
          `You can pay it, but ${money(billsLeft)} of bills are still due this month. You would have only ${money(cash - amount)} left for them. Wait if you can.`,
          `দিতে পারবেন, কিন্তু এই মাসে ${money(billsLeft)} এর বিল বাকি। তখন বিলের জন্য মাত্র ${money(cash - amount)} থাকবে। পারলে অপেক্ষা করুন।`
        ),
      };
    }

    const left = Math.floor((safe - amount) / Math.max(daysLeft, 1));

    return {
      verdict: "yes",
      text: pick(
        lang,
        `Yes. After this you still have ${money(safe - amount)} free, about ${money(left)} a day.`,
        `হ্যাঁ। এরপরও ${money(safe - amount)} খরচের জন্য থাকবে, দিনে প্রায় ${money(left)}।`
      ),
    };
  };

  return { cash, billsLeft, safe, perDay, daysLeft, tips, afford };
}

