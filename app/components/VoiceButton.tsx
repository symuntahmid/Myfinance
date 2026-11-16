"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Trash2, X } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { parseSpeech, type VoiceEntry } from "@/app/data/voiceParse";
import {
  quickExpenseCategories,
  quickSources,
  saveQuickTransaction,
} from "@/app/data/quickAdd";

const INCOME_CATEGORIES = [
  "💼 Salary",
  "💻 Freelancing",
  "🏢 Business",
  "💰 Pocket Money",
  "🎁 Gift",
  "🏆 Bonus",
  "↩️ Refund",
  "📦 Others",
];

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function createRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;

  const w = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };

  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;

  return Ctor ? new Ctor() : null;
}

const TEXT = {
  en: {
    button: "Say what you spent",
    hint: "For example: “rickshaw 30 taka, tea 10 taka”",
    title: "Talk to your money",
    tap: "Tap and speak",
    listening: "Listening… speak now",
    stop: "Stop",
    typeHere: "Or type here",
    placeholder: "রিকশা ৩০ টাকা, চা ১০ টাকা",
    check: "Did I hear this right?",
    nothing: "I could not find an amount yet. Say it like “tea 20 taka”.",
    save: "Save {n}",
    saved: "Saved",
    amount: "Amount",
    noMic: "Voice is not available here. Type it instead.",
    denied: "Microphone is blocked. Allow it in your browser, or type below.",
    lang: "Language",
    expense: "Spent",
    income: "Got",
  },
  bn: {
    button: "বলুন কী খরচ করলেন",
    hint: "যেমন: “রিকশা ৩০ টাকা, চা ১০ টাকা”",
    title: "টাকার সাথে কথা বলুন",
    tap: "চাপ দিয়ে বলুন",
    listening: "শুনছি… এখন বলুন",
    stop: "থামুন",
    typeHere: "অথবা এখানে লিখুন",
    placeholder: "রিকশা ৩০ টাকা, চা ১০ টাকা",
    check: "আমি কি ঠিক শুনেছি?",
    nothing: "এখনো টাকার অঙ্ক পাইনি। বলুন “চা বিশ টাকা”।",
    save: "{n}টি সেভ করুন",
    saved: "সেভ হয়েছে",
    amount: "টাকা",
    noMic: "এখানে ভয়েস চলছে না। লিখে দিন।",
    denied: "মাইক্রোফোন বন্ধ আছে। ব্রাউজারে অনুমতি দিন, বা নিচে লিখুন।",
    lang: "ভাষা",
    expense: "খরচ",
    income: "পেলাম",
  },
} as const;

const field =
  "rounded-xl border border-[var(--border)] bg-[var(--background)] px-2 py-2 text-sm font-semibold outline-none focus:border-[var(--primary)]";

export default function VoiceButton() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<"bn-BD" | "en-US">(
    lang === "bn" ? "bn-BD" : "en-US"
  );
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<VoiceEntry[]>([]);
  const [message, setMessage] = useState("");
  const [supported, setSupported] = useState(true);

  const recognition = useRef<Recognition | null>(null);

  useEffect(() => {
    const check = () => setSupported(createRecognition() !== null);

    check();
  }, []);

  const update = (value: string) => {
    setText(value);
    setEntries(parseSpeech(value));
  };

  const stop = () => {
    recognition.current?.stop();
    setListening(false);
  };

  const close = () => {
    stop();
    setOpen(false);
    setText("");
    setEntries([]);
    setMessage("");
  };

  const start = () => {
    const rec = createRecognition();

    if (!rec) {
      setMessage(x.noMic);
      return;
    }

    setMessage("");

    rec.lang = speechLang;
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let heard = "";

      for (let i = 0; i < event.results.length; i += 1) {
        heard += event.results[i][0].transcript + " ";
      }

      update(heard.trim());
    };

    rec.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMessage(x.denied);
      }
    };

    rec.onend = () => setListening(false);

    recognition.current = rec;
    setListening(true);
    rec.start();
  };

  const patch = (index: number, change: Partial<VoiceEntry>) =>
    setEntries((list) =>
      list.map((entry, i) => (i === index ? { ...entry, ...change } : entry))
    );

  const save = () => {
    entries.forEach((entry) =>
      saveQuickTransaction({
        type: entry.type,
        amount: entry.amount,
        category: entry.category,
        source: entry.source,
        note: entry.note || undefined,
      })
    );

    setMessage(`${x.saved} ✓`);

    window.setTimeout(close, 900);
  };

  const label = (value: string) => {
    const found = quickExpenseCategories.find((item) => item.value === value);

    return found ? `${found.emoji} ${found[lang]}` : value;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
          <Mic size={18} />
        </span>

        <span className="min-w-0">
          <span className="block text-sm font-bold">{x.button}</span>
          <span className="block truncate text-xs text-[var(--muted)]">{x.hint}</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[950] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden />

          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-[var(--card)] p-5 pb-8 sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">{x.title}</h2>

              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-full p-2 text-[var(--muted)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={listening ? stop : start}
                disabled={!supported}
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 ${
                  listening ? "animate-pulse bg-[var(--sun)]" : "bg-[var(--primary)]"
                }`}
                aria-label={listening ? x.stop : x.tap}
              >
                <Mic size={26} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {supported ? (listening ? x.listening : x.tap) : x.noMic}
                </p>

                <div className="mt-2 flex gap-2" role="group" aria-label={x.lang}>
                  {(["bn-BD", "en-US"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSpeechLang(code)}
                      aria-pressed={speechLang === code}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        speechLang === code
                          ? "border-[var(--forest)] bg-[var(--forest)] text-[var(--on-forest)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {code === "bn-BD" ? "বাংলা" : "English"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {message && (
              <p role="status" className="mt-3 rounded-xl bg-[var(--gold-soft)] px-3 py-2 text-sm font-semibold">
                {message}
              </p>
            )}

            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{x.typeHere}</span>
              <textarea
                value={text}
                onChange={(e) => update(e.target.value)}
                placeholder={x.placeholder}
                rows={2}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-base outline-none focus:border-[var(--primary)]"
              />
            </label>

            {text.trim() !== "" && entries.length === 0 && (
              <p className="mt-3 text-sm text-[var(--muted)]">{x.nothing}</p>
            )}

            {entries.length > 0 && (
              <section className="mt-4">
                <h3 className="text-sm font-bold">{x.check}</h3>

                <ul className="mt-2 space-y-2">
                  {entries.map((entry, index) => (
                    <li
                      key={index}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3"
                    >
                      <div className="flex items-center gap-2">
                        <select
                          value={entry.type}
                          onChange={(e) => {
                            const type = e.target.value as VoiceEntry["type"];

                            patch(index, {
                              type,
                              category: type === "Income" ? "📦 Others" : "📦 Others",
                            });
                          }}
                          aria-label="Type"
                          className={field}
                        >
                          <option value="Expense">{x.expense}</option>
                          <option value="Income">{x.income}</option>
                        </select>

                        <input
                          inputMode="decimal"
                          value={String(entry.amount)}
                          onChange={(e) =>
                            patch(index, { amount: Number(e.target.value.replace(/[^\d.]/g, "")) || 0 })
                          }
                          aria-label={x.amount}
                          className={`${field} w-28 text-right`}
                        />

                        <span className="flex-1 text-right text-xs text-[var(--muted)]">
                          {formatCurrency(entry.amount)}
                        </span>

                        <button
                          type="button"
                          onClick={() => setEntries((list) => list.filter((_, i) => i !== index))}
                          aria-label="Remove"
                          className="rounded-full p-2 text-[var(--muted)]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-2 flex gap-2">
                        <select
                          value={entry.category}
                          onChange={(e) => patch(index, { category: e.target.value })}
                          aria-label="Category"
                          className={`${field} min-w-0 flex-1`}
                        >
                          {(entry.type === "Income"
                            ? INCOME_CATEGORIES.map((value) => ({ value, text: value }))
                            : quickExpenseCategories.map((item) => ({
                                value: item.value,
                                text: label(item.value),
                              }))
                          ).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                        </select>

                        <select
                          value={entry.source}
                          onChange={(e) => patch(index, { source: e.target.value })}
                          aria-label="Source"
                          className={`${field} min-w-0 flex-1`}
                        >
                          {quickSources.map((source) => (
                            <option key={source.value} value={source.value}>
                              {source[lang]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={save}
                  disabled={entries.some((entry) => !(entry.amount > 0))}
                  className="mt-4 w-full rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {x.save.replace("{n}", String(entries.length))}
                </button>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
