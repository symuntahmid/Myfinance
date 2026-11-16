"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Trash2 } from "lucide-react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { todayLocal } from "@/app/utils/date";
import {
  EVENT,
  collected,
  getSomitis,
  monthFromIndex,
  monthIndex,
  nextTurnMonth,
  paidIds,
  potOf,
  roundOf,
  saveSomitis,
  takerOf,
  togglePaid,
  unpaid,
  type Somiti,
} from "@/app/data/somiti";

const TEXT = {
  en: {
    title: "Somiti",
    sub: "Keep your savings group in order. Who paid, whose turn, how much.",
    empty: "No somiti yet. Make one in a minute.",
    make: "Make a somiti",
    name: "Group name",
    namePh: "Neighbours' somiti",
    amount: "Each member pays a month",
    amountPh: "1000",
    members: "Members (one name per line, in turn order)",
    membersPh: "Rahim\nKarim\nSalma",
    start: "First turn month",
    save: "Save somiti",
    errName: "Give the group a name.",
    errAmount: "Enter the monthly amount.",
    errMembers: "Add at least 2 members, one name per line.",
    members_n: "{n} members",
    pot: "Pot",
    month: "Month",
    notStarted: "This somiti starts in {m}.",
    takes: "Takes the pot",
    collected: "Collected {a} of {b}",
    pays: "Who paid",
    paidAll: "Everyone has paid.",
    handed: "Pot handed over",
    hand: "Mark pot handed over",
    undo: "Undo",
    remind: "Copy reminder for the unpaid",
    copied: "Copied. Paste it in WhatsApp or Messenger.",
    order: "Turn order",
    now: "this month",
    done: "done",
    del: "Delete this somiti",
    sure: "Tap again to delete for good.",
    back: "All somitis",
    round: "Round {r} of {n}",
    msg: "Reminder: {name} somiti for {m}. {a} is due. Not paid yet: {who}.",
    note: "This lives on your phone only. Members cannot see it unless you send them the reminder.",
  },
  bn: {
    title: "সমিতি",
    sub: "সমিতির হিসাব গুছিয়ে রাখুন। কে দিল, কার পালা, কত টাকা।",
    empty: "এখনো কোনো সমিতি নেই। এক মিনিটে বানিয়ে ফেলুন।",
    make: "সমিতি বানান",
    name: "দলের নাম",
    namePh: "পাড়ার সমিতি",
    amount: "প্রতি সদস্য মাসে দেবে",
    amountPh: "১০০০",
    members: "সদস্য (এক লাইনে এক নাম, পালার ক্রমে)",
    membersPh: "রহিম\nকরিম\nসালমা",
    start: "প্রথম পালার মাস",
    save: "সমিতি সেভ করুন",
    errName: "দলের একটি নাম দিন।",
    errAmount: "মাসিক টাকার অঙ্ক দিন।",
    errMembers: "কমপক্ষে ২ জন সদস্য দিন, এক লাইনে এক নাম।",
    members_n: "{n} জন সদস্য",
    pot: "মোট জমা",
    month: "মাস",
    notStarted: "এই সমিতি শুরু হবে {m} মাসে।",
    takes: "টাকা পাবেন",
    collected: "{b} এর মধ্যে {a} উঠেছে",
    pays: "কে দিয়েছে",
    paidAll: "সবাই দিয়েছে।",
    handed: "টাকা দেওয়া হয়েছে",
    hand: "টাকা দেওয়া হয়েছে চিহ্ন দিন",
    undo: "ফিরিয়ে নিন",
    remind: "যারা দেয়নি তাদের জন্য মেসেজ কপি করুন",
    copied: "কপি হয়েছে। হোয়াটসঅ্যাপ বা মেসেঞ্জারে পেস্ট করুন।",
    order: "পালার ক্রম",
    now: "এই মাস",
    done: "শেষ",
    del: "এই সমিতি মুছুন",
    sure: "চিরতরে মুছতে আবার চাপ দিন।",
    back: "সব সমিতি",
    round: "{n} এর মধ্যে {r} নম্বর পালা",
    msg: "মনে করিয়ে দিচ্ছি: {name} সমিতির {m} মাসের {a} দেওয়ার কথা। এখনো দেননি: {who}।",
    note: "এটি শুধু আপনার ফোনে থাকে। মেসেজ পাঠালে তবেই সদস্যরা জানবে।",
  },
} as const;

const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base outline-none focus:border-[var(--primary)]";

function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export default function SomitiPage() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];
  const loc = lang === "bn" ? "bn-BD" : "en-GB";

  const [ready, setReady] = useState(false);
  const [list, setList] = useState<Somiti[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [month, setMonth] = useState(todayLocal().slice(0, 7));
  const [copied, setCopied] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const [start, setStart] = useState(todayLocal().slice(0, 7));
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      setList(getSomitis());
      setReady(true);
    };

    load();
    window.addEventListener(EVENT, load);

    return () => window.removeEventListener(EVENT, load);
  }, []);

  if (!ready) return null;

  const monthText = (m: string) =>
    new Date(`${m}-15T12:00:00`).toLocaleDateString(loc, {
      month: "long",
      year: "numeric",
    });

  const num = (n: number) => n.toLocaleString(loc);

  const create = () => {
    const names = people
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    const value = Number(amount.replace(/[^\d.]/g, ""));

    if (!name.trim()) return setError(x.errName);
    if (!value || value <= 0) return setError(x.errAmount);
    if (names.length < 2) return setError(x.errMembers);

    const made: Somiti = {
      id: newId(),
      name: name.trim(),
      amount: value,
      members: names.map((n) => ({ id: newId(), name: n })),
      start,
      paid: {},
      handed: {},
    };

    saveSomitis([...list, made]);
    setOpenId(made.id);
    setMonth(start > todayLocal().slice(0, 7) ? start : todayLocal().slice(0, 7));
    setCreating(false);
    setName("");
    setAmount("");
    setPeople("");
    setError("");
  };

  const update = (next: Somiti) =>
    saveSomitis(list.map((s) => (s.id === next.id ? next : s)));

  const current = list.find((s) => s.id === openId) ?? null;

  /* ---------- Make a somiti ---------- */
  if (creating) {
    return (
      <div className="space-y-4 pb-24">
        <button
          type="button"
          onClick={() => setCreating(false)}
          className="flex items-center gap-1 text-sm font-semibold text-[var(--muted)]"
        >
          <ChevronLeft size={16} /> {x.back}
        </button>

        <h1 className="text-xl font-bold">{x.make}</h1>

        <label className="block space-y-1 text-sm font-semibold">
          {x.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={x.namePh}
            className={field}
          />
        </label>

        <label className="block space-y-1 text-sm font-semibold">
          {x.amount}
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={x.amountPh}
            className={field}
          />
        </label>

        <label className="block space-y-1 text-sm font-semibold">
          {x.members}
          <textarea
            rows={5}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder={x.membersPh}
            className={field}
          />
        </label>

        <label className="block space-y-1 text-sm font-semibold">
          {x.start}
          <input
            type="month"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={field}
          />
        </label>

        {error && <p className="text-sm font-semibold text-[var(--sun)]">{error}</p>}

        <button
          type="button"
          onClick={create}
          className="w-full rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white"
        >
          {x.save}
        </button>
      </div>
    );
  }

  /* ---------- One somiti ---------- */
  if (current) {
    const s = current;
    const taker = takerOf(s, month);
    const pot = potOf(s);
    const got = collected(s, month);
    const late = unpaid(s, month);
    const paid = new Set(paidIds(s, month));
    const round = roundOf(s, month);
    const nowMonth = todayLocal().slice(0, 7);
    const shift = (d: number) => setMonth(monthFromIndex(monthIndex(month) + d));

    const copyReminder = async () => {
      const text = x.msg
        .replace("{name}", s.name)
        .replace("{m}", monthText(month))
        .replace("{a}", formatCurrency(s.amount))
        .replace("{who}", late.map((m) => m.name).join(", "));

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* the message is still shown below */
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    };

    return (
      <div className="space-y-4 pb-24">
        <button
          type="button"
          onClick={() => {
            setOpenId(null);
            setConfirmDel(false);
          }}
          className="flex items-center gap-1 text-sm font-semibold text-[var(--muted)]"
        >
          <ChevronLeft size={16} /> {x.back}
        </button>

        <header>
          <h1 className="text-xl font-bold">{s.name}</h1>
          <p className="text-sm text-[var(--muted)]">
            {x.members_n.replace("{n}", num(s.members.length))} · {formatCurrency(s.amount)} · {x.pot}{" "}
            {formatCurrency(pot)}
          </p>
        </header>

        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-2 py-2">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="p-2">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold">
            {monthText(month)}
            {month === nowMonth ? ` (${x.now})` : ""}
          </span>
          <button type="button" onClick={() => shift(1)} aria-label="Next month" className="p-2">
            <ChevronRight size={20} />
          </button>
        </div>

        {!taker ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            {x.notStarted.replace("{m}", monthText(s.start))}
          </p>
        ) : (
          <>
            <section className="rounded-2xl bg-[var(--forest)] p-4 text-[var(--on-forest)]">
              <p className="text-xs opacity-80">{x.takes}</p>
              <p className="text-2xl font-bold">{taker.name}</p>
              <p className="text-sm opacity-90">
                {formatCurrency(pot)} · {x.round.replace("{r}", num(round + 1)).replace("{n}", num(s.members.length))}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {x.collected.replace("{a}", formatCurrency(got)).replace("{b}", formatCurrency(pot))}
              </p>
              <div className="mt-2 h-2 rounded-full bg-white/25">
                <div
                  className="h-2 rounded-full bg-[var(--gold)]"
                  style={{ width: `${Math.round((got / pot) * 100)}%` }}
                />
              </div>
            </section>

            <section>
              <p className="mb-2 text-sm font-bold">{x.pays}</p>

              <ul className="space-y-2">
                {s.members.map((m) => {
                  const yes = paid.has(m.id);

                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => update(togglePaid(s, month, m.id))}
                        aria-pressed={yes}
                        className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-left"
                      >
                        <span className="text-sm font-semibold">{m.name}</span>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                            yes
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                              : "border-[var(--border)]"
                          }`}
                        >
                          {yes && <Check size={16} />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {late.length === 0 ? (
              <p className="text-sm font-semibold text-[var(--success)]">{x.paidAll}</p>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={copyReminder}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] py-2.5 text-sm font-semibold"
                >
                  <Copy size={16} /> {x.remind}
                </button>
                {copied && <p className="mt-2 text-xs text-[var(--muted)]">{x.copied}</p>}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                update({ ...s, handed: { ...s.handed, [month]: !s.handed[month] } })
              }
              className={`w-full rounded-full py-3 text-sm font-semibold ${
                s.handed[month]
                  ? "border border-[var(--border)]"
                  : "bg-[var(--primary)] text-white"
              }`}
            >
              {s.handed[month] ? `✓ ${x.handed} · ${x.undo}` : x.hand}
            </button>
          </>
        )}

        <section>
          <p className="mb-2 text-sm font-bold">{x.order}</p>

          <ol className="space-y-1.5">
            {s.members.map((m, i) => {
              const turn = nextTurnMonth(s, m.id, nowMonth);
              const past = roundOf(s, nowMonth) > i && roundOf(s, nowMonth) < s.members.length
                ? !!s.handed[monthFromIndex(monthIndex(s.start) + i)]
                : false;

              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-xl bg-[var(--card)] px-4 py-2 text-sm"
                >
                  <span>
                    {num(i + 1)}. {m.name}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {past ? x.done : turn ? monthText(turn) : ""}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <button
          type="button"
          onClick={() => {
            if (!confirmDel) return setConfirmDel(true);
            saveSomitis(list.filter((item) => item.id !== s.id));
            setOpenId(null);
            setConfirmDel(false);
          }}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--sun)]"
        >
          <Trash2 size={16} /> {confirmDel ? x.sure : x.del}
        </button>

        <p className="text-xs text-[var(--muted)]">{x.note}</p>
      </div>
    );
  }

  /* ---------- List ---------- */
  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">{x.empty}</p>
      ) : (
        <ul className="space-y-3">
          {list.map((s) => {
            const nowMonth = todayLocal().slice(0, 7);
            const taker = takerOf(s, nowMonth);

            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(s.id);
                    setMonth(nowMonth);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-left"
                >
                  <span>
                    <span className="block text-sm font-bold">{s.name}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {x.members_n.replace("{n}", num(s.members.length))} · {formatCurrency(s.amount)}
                      {taker ? ` · ${x.takes}: ${taker.name}` : ""}
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-[var(--muted)]" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setCreating(true)}
        className="w-full rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-white"
      >
        {x.make}
      </button>

      <p className="text-xs text-[var(--muted)]">{x.note}</p>
    </div>
  );
}
