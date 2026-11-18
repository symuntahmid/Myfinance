"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Zap, ClipboardPaste, Check, Mic, Camera } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";

import {
  parseMobileMoneySms,
  type SmsParseResult,
} from "@/app/data/mobileMoneySms";

import { getCustomCategories } from "@/app/data/plan";
import { entryFeedback, type EntryNote } from "@/app/data/entryFeedback";
import { getTransactions } from "@/app/data/transactions";
import { parseSpeech } from "@/app/data/voiceParse";
import { createRecognition, type Recognition } from "@/app/components/VoiceButton";
import { saveReceipt, shrinkPhoto } from "@/app/data/receipts";
import { readReceiptPhoto } from "@/app/data/receiptRead";

import {
  accountForProvider,
  accountName,
  CASH_SOURCE,
  getAccounts,
  transferBetween,
} from "@/app/data/accounts";

import {
  quickExpenseCategories,
  quickText,
  saveQuickTransaction,
  hasTransactionWithTrxId,
} from "@/app/data/quickAdd";

interface Props {
  open: boolean;
  onClose: () => void;
  // A message to read right away (from the automatic SMS link).
  initialSms?: string;
}

type Kind = "expense" | "income" | "transfer";

const INCOME_CATEGORIES = [
  { value: "💼 Salary", emoji: "💼", en: "Salary", bn: "বেতন" },
  { value: "🏪 Business", emoji: "🏪", en: "Business", bn: "ব্যবসা" },
  { value: "🎁 Gift", emoji: "🎁", en: "Gift", bn: "উপহার" },
  { value: "📦 Others", emoji: "📦", en: "Other", bn: "অন্যান্য" },
];

const ACCENT: Record<Kind, string> = {
  expense: "#0f766e",
  income: "#16a34a",
  transfer: "#2563eb",
};

const KIND_TEXT = {
  en: {
    expense: "Expense",
    income: "Income",
    transfer: "Transfer",
    sms: "Paste SMS",
    voice: "Speak",
    listening: "Listening…",
    camera: "Photo",
    heard: "Heard",
    reading: "Reading the receipt… the first time takes a little longer",
    readOk: "Read from your photo: {x}. Please check it.",
    readFail: "Could not read the total. Type the amount.",
    noHear: "Could not hear an amount. Try “tea 20 taka”.",
    noMic: "Voice is not available on this browser.",
    to: "To",
    sameAcc: "Pick two different accounts",
    q: {
      expense: "How much did you spend?",
      income: "How much did you get?",
      transfer: "How much are you moving?",
    },
    what: { expense: "What for?", income: "From where?", transfer: "" },
    where: { expense: "Paid with", income: "Received in", transfer: "From" },
    more: "More",
    less: "Less",
    incomeNote: "Added. Your money grew.",
    transferNote: "Moved. Your total money stays the same.",
  },
  bn: {
    expense: "খরচ",
    income: "আয়",
    transfer: "ট্রান্সফার",
    sms: "SMS পেস্ট",
    voice: "বলুন",
    listening: "শুনছি…",
    camera: "ছবি",
    heard: "শুনেছি",
    reading: "রসিদ পড়ছি… প্রথমবার একটু সময় লাগে",
    readOk: "ছবি থেকে পেয়েছি: {x}। একবার দেখে নিন।",
    readFail: "মোট টাকা পড়া যায়নি। অঙ্কটি লিখে দিন।",
    noHear: "টাকার অঙ্ক শুনতে পাইনি। বলুন “চা বিশ টাকা”।",
    noMic: "এই ব্রাউজারে ভয়েস চলছে না।",
    to: "কোথায়",
    sameAcc: "দুটি আলাদা অ্যাকাউন্ট বেছে নিন",
    q: {
      expense: "কত টাকা খরচ করেছেন?",
      income: "কত টাকা পেয়েছেন?",
      transfer: "কত টাকা সরাচ্ছেন?",
    },
    what: { expense: "কীসের জন্য?", income: "কোথা থেকে?", transfer: "" },
    where: { expense: "কীভাবে দিয়েছেন", income: "কোথায় পেয়েছেন", transfer: "কোথা থেকে" },
    more: "আরও",
    less: "কম",
    incomeNote: "যোগ হয়েছে। আপনার টাকা বাড়ল।",
    transferNote: "সরানো হয়েছে। আপনার মোট টাকা একই আছে।",
  },
} as const;

const LAST_KEY = "myfinance-quick-last";

function readLast(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLast(patch: Record<string, string>) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ ...readLast(), ...patch }));
  } catch {}
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

// Accept digits typed on a Bangla keyboard too.
function cleanAmountInput(value: string): string {
  const latin = value.replace(/[০-৯]/g, (digit) =>
    String(BANGLA_DIGITS.indexOf(digit))
  );

  const filtered = latin.replace(/[^0-9.]/g, "");
  const firstDot = filtered.indexOf(".");

  if (firstDot === -1) return filtered;

  return (
    filtered.slice(0, firstDot + 1) +
    filtered.slice(firstDot + 1).replace(/\./g, "")
  );
}

// The panel only exists while the sheet is open, so every time it opens
// it starts with empty fields.
export default function QuickAddSheet({
  open,
  onClose,
  initialSms,
}: Props) {
  if (!open || typeof document === "undefined") return null;

  return <QuickAddPanel onClose={onClose} initialSms={initialSms} />;
}

function QuickAddPanel({
  onClose,
  initialSms,
}: {
  onClose: () => void;
  initialSms?: string;
}) {
  const { language, t } = useLanguage();
  const text = quickText[language];
  const kx = KIND_TEXT[language];

  // When opened from the automatic SMS link, read the message at once.
  const [initial] = useState(() =>
    initialSms
      ? {
          text: initialSms,
          result: parseMobileMoneySms(initialSms),
        }
      : null
  );

  const [tab, setTab] = useState<"quick" | "sms">(
    initial ? "sms" : "quick"
  );

  const [kind, setKind] = useState<Kind>("expense");
  const [showAll, setShowAll] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(() => readLast().expense ?? "");
  const [dest, setDest] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [voiceMsg, setVoiceMsg] = useState("");
  const [reading, setReading] = useState<number | null>(null);
  const [readMsg, setReadMsg] = useState("");
  const rec = useRef<Recognition | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [accounts] = useState(() => getAccounts());

  // The built-in categories plus the ones the user made in Plan.
  const [categoryList] = useState(() => [
    ...quickExpenseCategories,
    ...getCustomCategories().map((item) => ({
      value: item.value,
      emoji: item.emoji,
      en: item.name,
      bn: item.name,
    })),
  ]);
  const [source, setSource] = useState(() => {
    const last = readLast().source;
    const all = getAccounts();

    return all.find((a) => a.source === last)?.source ?? all[0]?.source ?? CASH_SOURCE;
  });

  // Most-used expense categories first.
  const [usage] = useState(() => {
    const counts: Record<string, number> = {};

    getTransactions().forEach((tx) => {
      if (tx.type === "Expense" && tx.category) {
        counts[tx.category] = (counts[tx.category] ?? 0) + 1;
      }
    });

    return counts;
  });

  const [smsText, setSmsText] = useState(initial?.text ?? "");
  const [parsed, setParsed] = useState<SmsParseResult | null>(
    initial?.result ?? null
  );
  const [smsCategory, setSmsCategory] = useState(
    initial?.result.ok ? initial.result.data.category : ""
  );
  const [duplicate, setDuplicate] = useState(
    initial?.result.ok
      ? hasTransactionWithTrxId(initial.result.data.trxId)
      : false
  );
  const [cashMode, setCashMode] =
    useState<"move" | "full" | "fee">("move");
  const [clipboardFailed, setClipboardFailed] = useState(false);

  const [savedAmount, setSavedAmount] = useState<string | null>(null);
  const [note, setNote] = useState<EntryNote | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const focusTimer = setTimeout(
      () => amountRef.current?.focus(),
      150
    );

    return () => {
      clearTimeout(focusTimer);

      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const amountValue = Number(amount);
  const canSaveQuick = amountValue > 0;

  // Where the money goes: the chosen account, or the first one that is not the source.
  const toSource =
    accounts.find((a) => a.source === dest && a.source !== source)?.source ??
    accounts.find((a) => a.source !== source)?.source ??
    "";

  function startVoice() {
    if (listening) {
      rec.current?.stop();
      setListening(false);

      return;
    }

    const r = createRecognition();

    if (!r) {
      setVoiceMsg(kx.noMic);

      return;
    }

    setVoiceMsg("");
    setHeard("");

    r.lang = language === "bn" ? "bn-BD" : "en-US";
    r.interimResults = true;
    r.continuous = false;

    r.onresult = (event) => {
      let said = "";

      for (let i = 0; i < event.results.length; i += 1) {
        said += event.results[i][0].transcript + " ";
      }

      said = said.trim();
      setHeard(said);

      const first = parseSpeech(said)[0];

      if (first) {
        const next: Kind = first.type === "Income" ? "income" : "expense";

        setKind(next);
        setTab("quick");
        setAmount(String(first.amount));
        setCategory(first.category);

        if (accounts.some((a) => a.source === first.source)) setSource(first.source);

        setVoiceMsg("");
      }
    };

    r.onerror = () => {
      setListening(false);
      setVoiceMsg(kx.noMic);
    };

    r.onend = () => setListening(false);

    rec.current = r;
    setListening(true);
    r.start();
  }

  async function pickPhoto(file: File | undefined) {
    if (!file) return;

    try {
      const small = await shrinkPhoto(file);
      const sharp = await shrinkPhoto(file, 1400, 0.85);

      setPhoto(small);
      setReadMsg("");
      setReading(0);

      // Read the photo on this phone and fill in the total.
      try {
        const found = await readReceiptPhoto(sharp, (percent) => setReading(percent));

        if (found) {
          setAmount(String(found));
          setReadMsg(kx.readOk.replace("{x}", formatCurrency(found)));
        } else {
          setReadMsg(kx.readFail);
        }
      } catch {
        setReadMsg(kx.readFail);
      } finally {
        setReading(null);
      }
    } catch {}
  }

  function finish(savedValue: number, savedCategory?: string) {
    setSavedAmount(formatCurrency(savedValue));

    if (savedCategory) setNote(entryFeedback(savedCategory, language));

    closeTimer.current = setTimeout(
      () => {
        onClose();
      },
      savedCategory ? 2200 : 900
    );
  }

  function saveQuick() {
    if (!canSaveQuick) return;

    if (kind !== "transfer") writeLast({ source });

    if (kind === "transfer") {
      const from = accounts.find((item) => item.source === source);
      const to = accounts.find((item) => item.source === toSource);

      if (!from || !to || from.id === to.id) {
        setVoiceMsg(kx.sameAcc);

        return;
      }

      transferBetween({ from, to, amount: amountValue });
      writeLast({ source });
      finish(amountValue);
      setNote({ tone: "calm", text: kx.transferNote });

      return;
    }

    if (kind === "income") {
      const transaction = saveQuickTransaction({
        type: "Income",
        amount: amountValue,
        category: category || "📦 Others",
        source,
      });

      writeLast({ income: category });
      if (photo) saveReceipt(transaction.id, photo);
      finish(transaction.amount);
      setNote({ tone: "good", text: kx.incomeNote });

      return;
    }

    const transaction = saveQuickTransaction({
      type: "Expense",
      amount: amountValue,
      category: category || "📦 Others",
      source,
    });

    writeLast({ expense: category });
    if (photo) saveReceipt(transaction.id, photo);
    finish(transaction.amount, transaction.category);
  }

  function readMessage(message: string) {
    const result = parseMobileMoneySms(message);

    setParsed(result);
    setCashMode("move");

    if (result.ok) {
      setSmsCategory(result.data.category);
      setDuplicate(hasTransactionWithTrxId(result.data.trxId));
    } else {
      setDuplicate(false);
    }
  }

  async function pasteFromClipboard() {
    setClipboardFailed(false);

    try {
      const clip = await navigator.clipboard.readText();

      setSmsText(clip);
      readMessage(clip);
    } catch {
      setClipboardFailed(true);
    }
  }

  function saveParsed() {
    if (!parsed || !parsed.ok || duplicate) return;

    const data = parsed.data;

    // Which of the user's accounts this message belongs to.
    const account =
      data.source === "💳 Card"
        ? undefined
        : accountForProvider(accounts, data.provider);

    const source = account?.source ?? data.source;

    /* Cash out: move the money to the Cash account. */

    if (data.cashOut && cashMode === "move") {
      const cash = accounts.find(
        (item) => item.source === CASH_SOURCE
      );

      if (account && cash && account.id !== cash.id) {
        transferBetween({
          from: account,
          to: cash,
          amount: data.cashOut.withdrawn,
          fee: data.cashOut.fee,
          date: data.date,
          note: data.note,
        });

        finish(data.cashOut.withdrawn);
        return;
      }
    }

    const feeOnly = !!data.cashOut && cashMode === "fee";

    const transaction = saveQuickTransaction({
      type: data.type,
      amount: feeOnly ? data.cashOut!.fee : data.amount,
      category: smsCategory || data.category,
      source,
      date: data.date,
      note: feeOnly
        ? `${data.note} (fee only)`
        : data.note,
    });

    finish(transaction.amount, transaction.category);
  }

  function failureMessage(): string | null {
    if (!parsed || parsed.ok) return null;

    switch (parsed.reason) {
      case "empty":
        return text.errEmpty;
      case "no_amount":
        return text.errNoAmount;
      case "own_money_move":
        return text.errOwnMoney;
      default:
        return text.errUnknown;
    }
  }

  const switchKind = (next: Kind) => {
    setKind(next);
    setTab("quick");
    setShowAll(false);
    setCategory(next === "transfer" ? "" : readLast()[next] ?? "");
  };

  const sortedExpense = [...categoryList].sort(
    (a, b) => (usage[b.value] ?? 0) - (usage[a.value] ?? 0)
  );

  const shownList =
    kind === "income"
      ? INCOME_CATEGORIES
      : showAll
      ? sortedExpense
      : sortedExpense.slice(0, 8);

  const chip = (selected: boolean) =>
    `rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
      selected
        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
        : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]"
    }`;

  const parsedOk = parsed && parsed.ok ? parsed.data : null;

  const shownAmount =
    parsedOk?.cashOut && cashMode === "fee"
      ? parsedOk.cashOut.fee
      : parsedOk?.cashOut && cashMode === "move"
      ? parsedOk.cashOut.withdrawn
      : parsedOk?.amount ?? 0;

  return createPortal(
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-[990] bg-black/30 backdrop-blur-sm"
      />

      {/* Sheet */}

      <div
        className="
          fixed inset-x-0 bottom-0 z-[1000]
          mx-auto max-h-[92vh] max-w-xl overflow-y-auto
          rounded-t-[34px]
          bg-[var(--card)] text-[var(--foreground)]
          shadow-[0_-30px_80px_rgba(0,0,0,.18)]
        "
        style={{ ["--primary" as string]: ACCENT[kind] }}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-14 rounded-full bg-slate-300" />
        </div>

        {/* Header */}

        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--forest)] text-white">
              <Zap size={22} />
            </div>

            <h2 className="text-2xl font-bold">{text.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={text.close}
            className="rounded-full p-2 transition hover:bg-black/5"
          >
            <X size={22} />
          </button>
        </div>

        {/* Type switch */}

        <div className="mx-6 mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--background)] p-1">
          {(
            [
              ["expense", kx.expense],
              ["income", kx.income],
              ["transfer", kx.transfer],
            ] as [Kind, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchKind(id)}
              className={`rounded-xl py-2.5 text-sm font-bold transition ${
                tab === "quick" && kind === id
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                  : "text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Voice, photo and SMS */}

        <div className="mx-6 mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startVoice}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold ${
              listening
                ? "border-red-500 bg-red-500/10 text-red-600"
                : "border-[var(--border)]"
            }`}
          >
            <Mic size={16} />
            {listening ? kx.listening : kx.voice}
          </button>

          {kind !== "transfer" && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm font-semibold"
            >
              <Camera size={16} />
              {kx.camera}
            </button>
          )}

          <button
            type="button"
            onClick={() => setTab("sms")}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold ${
              tab === "sms" ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--border)]"
            }`}
          >
            <ClipboardPaste size={16} />
            {kx.sms}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(event) => {
              pickPhoto(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        {(heard || voiceMsg) && tab === "quick" && (
          <p className="mx-6 mt-2 text-xs text-[var(--muted)]">
            {voiceMsg ? voiceMsg : `${kx.heard}: “${heard}”`}
          </p>
        )}


        {/* Saved message */}

        {savedAmount ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={34} strokeWidth={3} />
            </div>

            <p className="text-lg font-bold">
              {text.saved} · {savedAmount}
            </p>

            {note && (
              <p
                className={`max-w-xs text-center text-sm font-medium ${
                  note.tone === "watch" ? "text-amber-600" : "text-[var(--muted)]"
                }`}
              >
                {note.text}
              </p>
            )}
          </div>
        ) : tab === "quick" ? (
          <div className="px-6 pb-8 pt-6">
            <label className="text-sm font-semibold text-[var(--muted)]">
              {kx.q[kind]}
            </label>

            <input
              ref={amountRef}
              value={amount}
              onChange={(event) =>
                setAmount(cleanAmountInput(event.target.value))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") saveQuick();
              }}
              inputMode="decimal"
              placeholder="0"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-3xl font-bold outline-none focus:border-[var(--primary)]"
            />

            {kind !== "transfer" && (
              <>
                <p className="mt-5 text-sm font-semibold text-[var(--muted)]">
                  {kx.what[kind]}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {shownList.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      className={chip(category === item.value)}
                    >
                      {item.emoji} {item[language]}
                    </button>
                  ))}

                  {kind === "expense" && sortedExpense.length > 8 && (
                    <button
                      type="button"
                      onClick={() => setShowAll(!showAll)}
                      className="rounded-2xl px-3 py-2 text-sm font-semibold text-[var(--muted)]"
                    >
                      {showAll ? kx.less : kx.more}
                    </button>
                  )}
                </div>
              </>
            )}

            <p className="mt-5 text-sm font-semibold text-[var(--muted)]">
              {kx.where[kind]}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {accounts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSource(item.source)}
                  className={chip(source === item.source)}
                >
                  {item.emoji} {accountName(item, language)}
                </button>
              ))}
            </div>

            {kind === "transfer" && (
              <>
                <p className="mt-5 text-sm font-semibold text-[var(--muted)]">{kx.to}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {accounts
                    .filter((item) => item.source !== source)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDest(item.source)}
                        className={chip(toSource === item.source)}
                      >
                        {item.emoji} {accountName(item, language)}
                      </button>
                    ))}
                </div>
              </>
            )}

            {(reading !== null || readMsg) && (
              <p className="mt-3 text-xs font-medium text-[var(--muted)]">
                {reading !== null ? `${kx.reading} ${reading > 0 ? reading + "%" : ""}` : readMsg}
              </p>
            )}

            {photo && (
              <div className="mt-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-14 w-14 rounded-xl object-cover" />

                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="text-xs font-semibold text-[var(--muted)]"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={saveQuick}
              disabled={!canSaveQuick}
              className="mt-7 w-full rounded-2xl bg-gradient-to-br from-[var(--forest)] to-[var(--primary)] py-4 text-base font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {text.save}
            </button>
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6">
            <p className="text-sm text-[var(--muted)]">
              {text.smsHint}
            </p>

            <textarea
              value={smsText}
              onChange={(event) => {
                setSmsText(event.target.value);
                setParsed(null);
                setDuplicate(false);
              }}
              rows={4}
              placeholder={text.smsPlaceholder}
              className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={pasteFromClipboard}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] py-3 text-sm font-bold transition hover:border-[var(--primary)]"
              >
                <ClipboardPaste size={16} />
                {text.pasteButton}
              </button>

              <button
                type="button"
                onClick={() => readMessage(smsText)}
                className="rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
              >
                {text.readButton}
              </button>
            </div>

            {clipboardFailed && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                {text.clipboardFail}
              </p>
            )}

            <p className="mt-2 text-xs text-[var(--muted)]">
              🔒 {text.privacy}
            </p>

            <Link
              href="/sms-setup"
              onClick={onClose}
              className="mt-2 inline-block text-xs font-semibold text-[var(--primary)]"
            >
              ⚡ {t("smsAutoTitle")}
            </Link>

            {failureMessage() && (
              <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
                {failureMessage()}
              </p>
            )}

            {parsedOk && (
              <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      parsedOk.type === "Income"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-red-500/15 text-red-600"
                    }`}
                  >
                    {parsedOk.type === "Income"
                      ? text.income
                      : text.expense}
                  </span>

                  <span className="text-2xl font-bold">
                    {formatCurrency(shownAmount)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[var(--muted)]">
                  {text.dateLabel}: {parsedOk.date} ·{" "}
                  {text.sourceShort}: {parsedOk.source}
                </p>

                {parsedOk.cashOut && parsedOk.cashOut.fee > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["move", t("cashMoveToCash")],
                          ["full", text.cashFull],
                          ["fee", text.cashFeeOnly],
                        ] as const
                      ).map(([mode, label]) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setCashMode(mode)}
                          className={chip(cashMode === mode)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {cashMode === "move" ? t("cashMoveHint") : text.cashHint}
                    </p>
                  </div>
                )}

                {parsedOk.type === "Expense" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categoryList.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSmsCategory(item.value)}
                        className={chip(smsCategory === item.value)}
                      >
                        {item.emoji} {item[language]}
                      </button>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs text-[var(--muted)]">
                  {parsedOk.note}
                </p>

                {duplicate && (
                  <p className="mt-3 rounded-2xl bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600">
                    {text.duplicate}
                  </p>
                )}

                <button
                  type="button"
                  onClick={saveParsed}
                  disabled={duplicate}
                  className="mt-4 w-full rounded-2xl bg-gradient-to-br from-[var(--forest)] to-[var(--primary)] py-3.5 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {text.saveThis}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
