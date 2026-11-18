"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { exportMyFinanceData } from "@/app/data/accountData";

const TEXT = {
  en: {
    title: "Keep your data safe",
    first: "Your records live only on this phone. Save a backup file so you never lose them.",
    again: "It has been {n} days since your last backup. Save a fresh copy.",
    button: "Save backup",
    later: "Later",
    done: "Backup saved. Keep the file in Google Drive or WhatsApp.",
  },
  bn: {
    title: "আপনার তথ্য নিরাপদ রাখুন",
    first: "আপনার হিসাব শুধু এই ফোনেই আছে। একটি ব্যাকআপ ফাইল রাখুন, যাতে কখনো হারাতে না হয়।",
    again: "শেষ ব্যাকআপের পর {n} দিন হয়েছে। নতুন একটি কপি রাখুন।",
    button: "ব্যাকআপ রাখুন",
    later: "পরে",
    done: "ব্যাকআপ হয়েছে। ফাইলটি গুগল ড্রাইভে বা হোয়াটসঅ্যাপে রেখে দিন।",
  },
} as const;

const LAST = "myfinance-last-backup";
const SNOOZE = "myfinance-backup-snooze";
const DAY = 86400000;

// null = hide, number = days since the last backup (-1 = never)
function check(): number | null {
  try {
    const tx = JSON.parse(localStorage.getItem("myfinance-transactions") || "[]");

    if (!Array.isArray(tx) || tx.length < 5) return null;

    const snooze = Number(localStorage.getItem(SNOOZE) || 0);

    if (Date.now() < snooze) return null;

    const last = Date.parse(localStorage.getItem(LAST) || "");

    if (Number.isNaN(last)) return -1;

    const days = Math.floor((Date.now() - last) / DAY);

    return days >= 14 ? days : null;
  } catch {
    return null;
  }
}

export default function BackupNudge() {
  const { language } = useLanguage();
  const x = TEXT[language === "bn" ? "bn" : "en"];

  const [days, setDays] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = () => setDays(check());

    load();

    window.addEventListener("transactionsUpdated", load);

    return () => window.removeEventListener("transactionsUpdated", load);
  }, []);

  if (saved) {
    return (
      <p className="rounded-2xl bg-[var(--primary)]/10 p-3 text-sm font-medium text-[var(--primary)]">
        {x.done}
      </p>
    );
  }

  if (days === null) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-[var(--primary)]">
          <ShieldCheck size={22} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{x.title}</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {days < 0 ? x.first : x.again.replace("{n}", days.toLocaleString(language === "bn" ? "bn-BD" : "en-US"))}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                exportMyFinanceData();
                setSaved(true);
              }}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              {x.button}
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(SNOOZE, String(Date.now() + 3 * DAY));
                } catch {}

                setDays(null);
              }}
              className="text-sm font-semibold text-[var(--muted)]"
            >
              {x.later}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
