"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { updateProfile } from "@/app/data/profile";
import { updateSettings } from "@/app/data/settings";
import { setCurrentBalance } from "@/app/data/accounts";

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
    }

    try {
      localStorage.setItem(FLAG, "done");
    } catch {}

    window.dispatchEvent(new Event("accountsUpdated"));
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
          {x.step.replace("{a}", String(step + 1))}
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
            </>
          )}
        </div>

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
      </div>
    </div>
  );
}
