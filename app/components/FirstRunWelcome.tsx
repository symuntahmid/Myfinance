"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { updateProfile } from "@/app/data/profile";
import { updateSettings } from "@/app/data/settings";
import { setCurrentBalance } from "@/app/data/accounts";
import { setAssigned } from "@/app/data/plan";
import { formatCurrency } from "@/app/utils/currency";

type Goal = "save" | "control" | "track";

// Share of income for each category. The rest is left as savings.
const SHARES: Record<Goal, Record<string, number>> = {
  save: { "🛒 Supermarket": 18, "🍔 Food": 8, "🚌 Transport": 7, "🏠 House": 25, "💡 Bills": 6, "📱 Mobile Recharge": 3, "📚 Education": 4, "🏥 Health": 3, "🎮 Entertainment": 2, "📦 Others": 2 },
  control: { "🛒 Supermarket": 20, "🍔 Food": 10, "🚌 Transport": 8, "🏠 House": 25, "💡 Bills": 6, "📱 Mobile Recharge": 3, "📚 Education": 4, "🏥 Health": 4, "🎮 Entertainment": 3, "📦 Others": 3 },
  track: { "🛒 Supermarket": 20, "🍔 Food": 10, "🚌 Transport": 8, "🏠 House": 25, "💡 Bills": 7, "📱 Mobile Recharge": 3, "📚 Education": 5, "🏥 Health": 4, "🎮 Entertainment": 5, "📦 Others": 4 },
};

const currentMonthKey = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const FLAG = "myfinance-welcome";

const TEXT = {
  en: {
    hello: "Hello! Let's set up your money in 1 minute.",
    helloSub: "Three quick questions. You can change everything later.",
    name: "What should I call you?",
    namePh: "Your first name",
    balTitle: "How much money do you have right now?",
    balSub: "A rough number is fine. It makes your whole app useful from day one.",
    cash: "Cash in hand",
    mobile: "bKash / Nagad",
    bank: "Bank",
    incTitle: "How much do you earn in a normal month?",
    incSub: "I use this to build your plan. Skip it if it changes a lot.",
    income: "Monthly income",
    day: "Salary day of the month (optional)",
    next: "Next",
    back: "Back",
    skip: "Skip for now",
    done: "Open my app",
    step: "Step {a} of 3",
    goalTitle: "What matters most to you?",
    goalSave: "Save more",
    goalControl: "Spend less",
    goalTrack: "Just see where it goes",
    readyTitle: "Your plan is ready",
    readySub: "I made a starting budget from your income. Change any amount later.",
    readyBudget: "Monthly budget",
    readySave: "You keep",
    readyPerDay: "A day to spend",
    readyNoIncome: "Add your income any time and I will build your budget.",
  },
  bn: {
    hello: "স্বাগতম! ১ মিনিটে আপনার টাকার হিসাব সাজাই।",
    helloSub: "তিনটি ছোট প্রশ্ন। পরে সবকিছু বদলানো যাবে।",
    name: "আপনাকে কী নামে ডাকব?",
    namePh: "আপনার নামের প্রথম অংশ",
    balTitle: "এখন আপনার কাছে কত টাকা আছে?",
    balSub: "মোটামুটি হলেই চলবে। এতে প্রথম দিন থেকেই অ্যাপ কাজে লাগবে।",
    cash: "হাতে নগদ",
    mobile: "বিকাশ / নগদ",
    bank: "ব্যাংক",
    incTitle: "সাধারণ মাসে আপনি কত আয় করেন?",
    incSub: "এটা দিয়ে আপনার প্ল্যান বানাব। আয় বদলালে বাদ দিতে পারেন।",
    income: "মাসিক আয়",
    day: "মাসের কত তারিখে বেতন পান (ঐচ্ছিক)",
    next: "পরের ধাপ",
    back: "পিছনে",
    skip: "এখন থাক",
    done: "আমার অ্যাপ খুলুন",
    step: "ধাপ {a} / ৩",
    goalTitle: "আপনার কাছে সবচেয়ে জরুরি কী?",
    goalSave: "বেশি সঞ্চয়",
    goalControl: "কম খরচ",
    goalTrack: "শুধু হিসাব দেখা",
    readyTitle: "আপনার প্ল্যান তৈরি",
    readySub: "আপনার আয় দেখে একটি শুরুর বাজেট বানিয়েছি। পরে যেকোনো অঙ্ক বদলাতে পারবেন।",
    readyBudget: "মাসিক বাজেট",
    readySave: "আপনার সঞ্চয়",
    readyPerDay: "প্রতিদিন খরচ করতে পারবেন",
    readyNoIncome: "আয় যোগ করলেই আমি বাজেট বানিয়ে দেব।",
  },
} as const;

function alreadySetUp() {
  try {
    if (localStorage.getItem(FLAG)) return true;

    const tx = JSON.parse(localStorage.getItem("myfinance-transactions") || "[]");
    if (Array.isArray(tx) && tx.length > 0) return true;

    if (localStorage.getItem("myfinance-accounts")) return true;

    const profile = JSON.parse(localStorage.getItem("myfinance-profile") || "{}");
    if (profile.displayName || profile.firstName) return true;

    return false;
  } catch {
    return true;
  }
}

const toNumber = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function FirstRunWelcome() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];

  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [cash, setCash] = useState("");
  const [mobile, setMobile] = useState("");
  const [bank, setBank] = useState("");
  const [income, setIncome] = useState("");
  const [day, setDay] = useState("");
  const [goal, setGoal] = useState<Goal>("control");
  const [made, setMade] = useState<{ budget: number; save: number; perDay: number } | null>(null);

  useEffect(() => {
    const load = () => setShow(!alreadySetUp());
    load();
  }, []);

  if (!show) return null;

  const finish = (save: boolean) => {
    if (save) {
      if (name.trim()) {
        updateProfile({
          firstName: name.trim(),
          displayName: name.trim(),
        });
      }

      const balances: [string, string][] = [
        ["cash", cash],
        ["mobile", mobile],
        ["bank", bank],
      ];

      balances.forEach(([id, value]) => {
        if (toNumber(value) > 0) setCurrentBalance(id, toNumber(value));
      });

      const dayNumber = Math.round(toNumber(day));

      updateSettings({
        monthlyIncome: toNumber(income) || null,
        salaryDay: dayNumber >= 1 && dayNumber <= 31 ? dayNumber : null,
      });

      const earn = toNumber(income);

      if (earn > 0) {
        const month = currentMonthKey();
        let budget = 0;

        Object.entries(SHARES[goal]).forEach(([category, pct]) => {
          const amount = Math.max(100, Math.round((earn * pct) / 100 / 100) * 100);

          budget += amount;
          setAssigned(month, category, amount);
        });

        const now = new Date();
        const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;

        try {
          localStorage.setItem(FLAG, "done");
        } catch {}

        window.dispatchEvent(new Event("accountsUpdated"));
        window.dispatchEvent(new Event("planUpdated"));
        setMade({ budget, save: Math.max(0, earn - budget), perDay: Math.round(budget / daysLeft) });
        setStep(3);

        return;
      }
    }

    try {
      localStorage.setItem(FLAG, "done");
    } catch {}

    window.dispatchEvent(new Event("accountsUpdated"));
    window.dispatchEvent(new Event("transactionsUpdated"));
    setShow(false);
  };

  const close = () => {
    window.dispatchEvent(new Event("transactionsUpdated"));
    setShow(false);
  };

  const field =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-base font-semibold outline-none focus:border-[var(--primary)]";

  const num = (label: string, value: string, set: (v: string) => void) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
        {label}
      </span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => set(e.target.value.replace(/[^0-9.]/g, ""))}
        className={field}
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[var(--background)]">
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-8">
        <p className="mb-3 text-xs font-semibold text-[var(--muted)]">
          {step < 3 ? x.step.replace("{a}", String(step + 1)) : "✓"}
        </p>

        <div className="paper rounded-3xl p-6">
          {step === 0 && (
            <>
              <h1 className="font-hand text-3xl leading-tight">
                <span className="hl">{x.hello}</span>
              </h1>
              <p className="mt-3 text-sm text-[var(--muted)]">{x.helloSub}</p>

              <label className="mt-6 block">
                <span className="mb-1 block text-sm font-semibold">{x.name}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={x.namePh}
                  className={field}
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-hand text-3xl leading-tight">
                <span className="hl">{x.balTitle}</span>
              </h1>
              <p className="mt-3 text-sm text-[var(--muted)]">{x.balSub}</p>

              <div className="mt-5 space-y-3">
                {num(`💵 ${x.cash}`, cash, setCash)}
                {num(`📱 ${x.mobile}`, mobile, setMobile)}
                {num(`🏦 ${x.bank}`, bank, setBank)}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-hand text-3xl leading-tight">
                <span className="hl">{x.incTitle}</span>
              </h1>
              <p className="mt-3 text-sm text-[var(--muted)]">{x.incSub}</p>

              <div className="mt-5 space-y-3">
                {num(x.income, income, setIncome)}
                {num(x.day, day, setDay)}
              </div>

              <p className="mt-5 text-sm font-semibold">{x.goalTitle}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["save", x.goalSave],
                    ["control", x.goalControl],
                    ["track", x.goalTrack],
                  ] as [Goal, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setGoal(id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      goal === id
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && made && (
            <>
              <h1 className="font-hand text-3xl leading-tight">
                <span className="hl">{x.readyTitle}</span>
              </h1>
              <p className="mt-3 text-sm text-[var(--muted)]">{x.readySub}</p>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  [x.readyBudget, made.budget],
                  [x.readySave, made.save],
                  [x.readyPerDay, made.perDay],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-baseline justify-between border-b border-[var(--border)] pb-2">
                    <dt className="text-[var(--muted)]">{label}</dt>
                    <dd className="text-lg font-semibold">{formatCurrency(value as number)}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        {step === 3 ? (
          <button
            type="button"
            onClick={close}
            className="mt-5 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white"
          >
            {x.done}
          </button>
        ) : (
        <>
        <div className="mt-5 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold"
            >
              {x.back}
            </button>
          )}

          <button
            type="button"
            onClick={() => (step < 2 ? setStep(step + 1) : finish(true))}
            className="flex-1 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white"
          >
            {step < 2 ? x.next : x.done}
          </button>
        </div>

        <button
          type="button"
          onClick={() => finish(step > 0 || name.trim() !== "")}
          className="mt-4 text-center text-sm font-semibold text-[var(--muted)]"
        >
          {x.skip}
        </button>
        </>
        )}
      </div>
    </div>
  );
}
