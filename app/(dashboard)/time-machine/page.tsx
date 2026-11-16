"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  RATES,
  addMonths,
  averageSaving,
  buildRoad,
  gatherInputs,
  type Inputs,
  type Stage,
  type StageId,
} from "@/app/data/timeMachine";

const KEY = "myfinance-time-machine";
const MAX_EXTRA = 20000;

type Saved = { saving?: string; cost?: string; age?: string };

const META: Record<
  StageId,
  { emoji: string; en: [string, string]; bn: [string, string] }
> = {
  starter: {
    emoji: "🌱",
    en: ["Starter cushion", "One month of living costs saved"],
    bn: ["শুরুর জমানো টাকা", "এক মাসের খরচের সমান জমা"],
  },
  debt: {
    emoji: "🔓",
    en: ["Debt-free", "Every loan paid off"],
    bn: ["ঋণমুক্ত", "সব ঋণ শোধ"],
  },
  safety: {
    emoji: "🛡️",
    en: ["Safety cushion", "Three months of living costs saved"],
    bn: ["নিরাপত্তার জমানো টাকা", "তিন মাসের খরচের সমান জমা"],
  },
  home: {
    emoji: "🏠",
    en: ["Home down payment", "Cash ready for your home"],
    bn: ["বাড়ির ডাউন পেমেন্ট", "বাড়ির জন্য নগদ প্রস্তুত"],
  },
  freedom: {
    emoji: "🕊️",
    en: ["Free to choose your work", "Investments can cover your living costs"],
    bn: ["কাজ বেছে নেওয়ার স্বাধীনতা", "বিনিয়োগ থেকেই খরচ চলবে"],
  },
};

const TEXT = {
  en: {
    title: "Money Time Machine",
    sub: "See your life road. Drag the slider and watch it change.",
    next: "At this pace",
    freeBy: "You are free to choose your work in {d}",
    atAge: "at age {a}",
    setCost: "Tell me your monthly living cost below and I will draw your road.",
    road: "Your road",
    now: "Now",
    slider: "Save {x} more every month",
    saving: "I save about (per month)",
    cost: "My monthly living cost",
    age: "My age (optional)",
    done: "Done",
    never: "Not reachable yet",
    sooner: "{t} sooner",
    reach: "Now reachable",
    y: "y",
    m: "m",
    rule: "Every taka does one job at a time, in this order: starter cushion, debts, safety cushion, home, then freedom. Rough estimate: savings grow {s}% a year and investments {i}% a year. Not financial advice.",
  },
  bn: {
    title: "মানি টাইম মেশিন",
    sub: "আপনার জীবনের পথ দেখুন। স্লাইডার টানুন, পথ বদলে যাবে।",
    next: "এই গতিতে",
    freeBy: "{d} নাগাদ আপনি কাজ বেছে নেওয়ার স্বাধীনতা পাবেন",
    atAge: "বয়স {a}",
    setCost: "নিচে আপনার মাসিক খরচ লিখুন, আমি আপনার পথ এঁকে দেব।",
    road: "আপনার পথ",
    now: "এখন",
    slider: "প্রতি মাসে আরও {x} জমান",
    saving: "আমি মাসে প্রায় জমাই",
    cost: "আমার মাসিক খরচ",
    age: "আমার বয়স (ঐচ্ছিক)",
    done: "হয়ে গেছে",
    never: "এখনো পৌঁছানো যাচ্ছে না",
    sooner: "{t} আগে",
    reach: "এখন পৌঁছানো সম্ভব",
    y: "বছর",
    m: "মাস",
    rule: "প্রতিটি টাকা একবারে একটি কাজ করে, এই ক্রমে: শুরুর জমা, ঋণ, নিরাপত্তার জমা, বাড়ি, তারপর স্বাধীনতা। মোটামুটি হিসাব: সঞ্চয় বছরে {s}% ও বিনিয়োগ {i}% বাড়ে ধরা হয়েছে। আর্থিক পরামর্শ নয়।",
  },
} as const;

function readSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Saved;
  } catch {
    return {};
  }
}

const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--primary)]";

export default function TimeMachinePage() {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const x = TEXT[lang];

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState("");
  const [cost, setCost] = useState("");
  const [age, setAge] = useState("");
  const [extra, setExtra] = useState(2000);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const load = () => {
      const saved = readSaved();

      setSaving(saved.saving ?? String(averageSaving()));
      setCost(saved.cost ?? "");
      setAge(saved.age ?? "");
      setReady(true);
    };

    load();

    const bump = () => setTick((v) => v + 1);
    const events = ["transactionsUpdated", "accountsUpdated", "debtsUpdated", "investmentsUpdated", "homePlanUpdated", "currencyUpdated"];

    events.forEach((name) => window.addEventListener(name, bump));

    return () => events.forEach((name) => window.removeEventListener(name, bump));
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(KEY, JSON.stringify({ saving, cost, age }));
    } catch {
      /* fine */
    }
  }, [ready, saving, cost, age]);

  const inputs: Inputs | null = useMemo(() => {
    if (!ready) return null;

    void tick;

    return gatherInputs(Number(saving) || 0, Number(cost) || undefined);
  }, [ready, saving, cost, tick]);

  if (!inputs) return null;

  const road = buildRoad(inputs, extra);
  const base = buildRoad(inputs, 0);
  const present = road.filter((stage) => stage.present);

  const finite = base
    .map((stage) => stage.months)
    .filter((m): m is number => m !== null && m > 0);

  const horizon = Math.min(Math.max(...finite, 24), 60 * 12);

  const posOf = (months: number | null) =>
    months === null
      ? 95
      : 4 + Math.sqrt(Math.min(months, horizon) / horizon) * 91;

  const dateText = (months: number) =>
    addMonths(months).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      month: "short",
      year: "numeric",
    });

  const spanText = (months: number) => {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const n = (v: number) => v.toLocaleString(lang === "bn" ? "bn-BD" : "en-US");

    return [years > 0 ? `${n(years)} ${x.y}` : "", rest > 0 ? `${n(rest)} ${x.m}` : ""]
      .filter(Boolean)
      .join(" ");
  };

  /* Keep the emoji bubbles from sitting on top of each other. */
  const lastIn = { up: -100, down: -100 };

  const placed = present.map((stage) => {
    const left = posOf(stage.months);
    const lane: "up" | "down" =
      left - lastIn.up >= left - lastIn.down ? "up" : "down";
    const shown = Math.min(Math.max(left, lastIn[lane] + 13), 95);

    lastIn[lane] = shown;

    return { stage, left, shown, lane };
  });

  const freedom = road.find((stage) => stage.id === "freedom");
  const ageNumber = Number(age) || 0;

  const ticks = [1, 5, 10, 20, 40].filter((years) => years * 12 <= horizon);

  const detail = (stage: Stage, before: Stage) => {
    if (stage.months === null) return { when: x.never, chip: "" };

    const when = stage.months === 0 ? `✓ ${x.done}` : dateText(stage.months);

    if (extra > 0 && before.months === null) {
      return { when, chip: x.reach };
    }

    if (
      extra > 0 &&
      before.months !== null &&
      before.months > stage.months
    ) {
      return {
        when,
        chip: x.sooner.replace("{t}", spanText(before.months - stage.months)),
      };
    }

    return { when, chip: "" };
  };

  return (
    <div className="space-y-4 pb-24">
      <header>
        <h1 className="text-xl font-bold">{x.title}</h1>
        <p className="text-sm text-[var(--muted)]">{x.sub}</p>
      </header>

      <div className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
        <p className="text-xs font-semibold opacity-80">{x.next}</p>

        {freedom && freedom.present && freedom.months !== null ? (
          <>
            <p className="font-hand mt-1 text-3xl leading-tight">
              {x.freeBy.replace("{d}", dateText(freedom.months))}
            </p>

            {ageNumber > 0 && (
              <p className="mt-1 text-sm opacity-80">
                {x.atAge.replace("{a}", String(Math.round(ageNumber + freedom.months / 12)))}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm">
            {freedom && freedom.present ? x.never : x.setCost}
          </p>
        )}
      </div>

      {/* The road */}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold">{x.road}</h2>

        <div className="relative mt-2 h-36">
          <div className="absolute inset-x-0 top-[72px] border-t-2 border-dashed border-[var(--border)]" />

          {placed.map(({ stage, left, shown, lane }) => {
            const original = base.find((item) => item.id === stage.id) as Stage;
            const reachable = stage.months !== null;

            return (
              <div key={stage.id}>
                {extra > 0 && (
                  <span
                    className="absolute top-[67px] h-2.5 w-2.5 rounded-full border border-[var(--muted)] bg-[var(--card)] opacity-60"
                    style={{ left: `calc(${posOf(original.months)}% - 5px)` }}
                  />
                )}

                <span
                  className={`absolute top-[67px] h-2.5 w-2.5 rounded-full transition-[left] duration-500 motion-reduce:transition-none ${
                    reachable ? "bg-[var(--forest)]" : "bg-[var(--muted)] opacity-50"
                  }`}
                  style={{ left: `calc(${left}% - 5px)` }}
                />

                <span
                  className={`absolute flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[var(--card)] text-xl transition-[left] duration-500 motion-reduce:transition-none ${
                    reachable
                      ? "border-[var(--forest)]"
                      : "border-dashed border-[var(--muted)] opacity-50"
                  }`}
                  style={{
                    left: `calc(${shown}% - 20px)`,
                    top: lane === "up" ? 8 : 96,
                  }}
                >
                  {META[stage.id].emoji}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative h-4 text-[10px] text-[var(--muted)]">
          <span className="absolute left-0">{x.now}</span>

          {ticks.map((years) => (
            <span
              key={years}
              className="absolute -translate-x-1/2"
              style={{ left: `${posOf(years * 12)}%` }}
            >
              {years}
              {lang === "bn" ? "বছর" : "y"}
            </span>
          ))}
        </div>
      </section>

      {/* The slider */}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="font-hand text-2xl leading-tight">
          <span className="hl">{x.slider.replace("{x}", formatCurrency(extra))}</span>
        </p>

        <input
          type="range"
          min={0}
          max={MAX_EXTRA}
          step={500}
          value={extra}
          onChange={(e) => setExtra(Number(e.target.value))}
          aria-label={x.slider.replace("{x}", formatCurrency(extra))}
          className="mt-4 w-full accent-[var(--primary)]"
        />

        <div className="mt-1 flex justify-between text-[10px] text-[var(--muted)]">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(MAX_EXTRA)}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{x.saving}</span>
            <input
              inputMode="decimal"
              value={saving}
              onChange={(e) => setSaving(e.target.value.replace(/[^\d.]/g, ""))}
              className={field}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{x.cost}</span>
            <input
              inputMode="decimal"
              value={cost}
              placeholder={inputs.cost > 0 ? String(inputs.cost) : ""}
              onChange={(e) => setCost(e.target.value.replace(/[^\d.]/g, ""))}
              className={field}
            />
          </label>

          <label className="col-span-2 block">
            <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">{x.age}</span>
            <input
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))}
              className={field}
            />
          </label>
        </div>
      </section>

      {/* The stops */}

      <ul className="space-y-2">
        {present.map((stage) => {
          const before = base.find((item) => item.id === stage.id) as Stage;
          const info = detail(stage, before);
          const meta = META[stage.id][lang];

          return (
            <li
              key={stage.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-2xl">
                {META[stage.id].emoji}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{meta[0]}</p>
                <p className="text-xs text-[var(--muted)]">{meta[1]}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">{info.when}</p>

                {info.chip && (
                  <p className="mt-0.5 rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] font-semibold">
                    {info.chip}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-[var(--muted)]">
        {x.rule.replace("{s}", String(RATES.save)).replace("{i}", String(RATES.invest))}
      </p>
    </div>
  );
}
