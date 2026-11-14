"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Download, Eye, EyeOff, Share2 } from "lucide-react";

import NetWorthChart from "../../components/NetWorthChart";
import FinancialInsights from "../../components/FinancialInsights";
import IncomeExpenseChart from "../../components/IncomeExpenseChart";
import InvestmentPieChart from "../../components/InvestmentPieChart";

import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import {
  RATE_TARGET,
  RUNWAY_TARGET,
  buildProgress,
  type Progress,
} from "@/app/data/progress";
import { freedomNumber, getMonthlyCost } from "@/app/data/lifeGoals";
import { getNetWorthNow } from "@/app/data/overview";
import {
  renderMilestoneImage,
  type MilestoneChart,
  type MilestoneTheme,
} from "@/app/utils/flexImage";

const HIDE_KEY = "myfinance-hide-amounts";
const DISPLAY = { fontFamily: "var(--font-tiro), Georgia, serif" } as const;

type Spec = {
  label: string;
  big: string;
  sub: string;
  chart?: MilestoneChart;
  theme: MilestoneTheme;
};

/* ---------- small charts ---------- */

function Line({ values }: { values: number[] }) {
  const W = 300;
  const H = 84;
  const PAD = 6;

  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;

  const x = (i: number) => PAD + ((W - PAD * 2) * i) / (values.length - 1);
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2);

  const path = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" aria-hidden>
      <line
        x1={PAD}
        x2={W - PAD}
        y1={y(0)}
        y2={y(0)}
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      <path
        d={`${path} L${x(values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`}
        fill="var(--primary)"
        opacity="0.12"
      />

      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <circle
        cx={x(values.length - 1)}
        cy={y(values[values.length - 1])}
        r="4"
        fill="var(--primary)"
      />
    </svg>
  );
}

function Bars({ values, target }: { values: number[]; target: number }) {
  const max = Math.max(target, ...values, 1);

  return (
    <div className="relative flex h-24 items-end gap-2">
      <div
        className="absolute inset-x-0 border-t border-dashed border-[var(--gold)]"
        style={{ bottom: `${(target / max) * 100}%` }}
      />

      {values.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-t ${
            index >= values.length - 3
              ? "bg-[var(--primary)]"
              : "bg-[var(--border)]"
          }`}
          style={{ height: `${Math.max((Math.max(value, 0) / max) * 100, 3)}%` }}
        />
      ))}
    </div>
  );
}

function Meter({
  value,
  max,
  marks,
}: {
  value: number;
  max: number;
  marks: number[];
}) {
  const ratio = Math.min(Math.max(value / max, 0), 1) * 100;

  return (
    <div className="pt-1">
      <div className="relative h-3 rounded-full bg-[var(--background)]">
        <div
          className="h-full rounded-full bg-[var(--primary)]"
          style={{ width: `${Math.max(ratio, 2)}%` }}
        />

        {marks.map((mark) => (
          <span
            key={mark}
            className="absolute -top-1 h-5 w-px bg-[var(--foreground)]/50"
            style={{ left: `${(mark / max) * 100}%` }}
          />
        ))}
      </div>

      <div className="relative mt-1.5 h-4 text-[11px] text-[var(--muted)]">
        {marks.map((mark) => (
          <span
            key={mark}
            className="absolute -translate-x-1/2"
            style={{ left: `${Math.min((mark / max) * 100, 96)}%` }}
          >
            {mark}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- card ---------- */

function Metric({
  title,
  big,
  sub,
  delta,
  deltaTone,
  note,
  children,
  onShare,
  onSave,
  shareLabel,
  saveLabel,
}: {
  title: string;
  big: string;
  sub?: string;
  delta?: string;
  deltaTone?: "good" | "bad";
  note?: string;
  children?: ReactNode;
  onShare?: () => void;
  onSave?: () => void;
  shareLabel: string;
  saveLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--muted)]">{title}</h2>

        {onShare && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={shareLabel}
              onClick={onShare}
              className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]"
            >
              <Share2 size={16} />
            </button>

            <button
              type="button"
              aria-label={saveLabel}
              onClick={onSave}
              className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]"
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>

      {big && (
        <p
          style={DISPLAY}
          className="mt-1 text-[34px] font-bold leading-none tracking-tight"
        >
          {big}
        </p>
      )}

      {sub && (
        <p
          className={`text-sm text-[var(--muted)] ${big ? "mt-1.5" : "mt-1"}`}
        >
          {sub}
        </p>
      )}

      {delta && (
        <p
          className={`mt-0.5 text-sm font-semibold ${
            deltaTone === "bad" ? "text-[var(--sun)]" : "text-[var(--primary)]"
          }`}
        >
          {delta}
        </p>
      )}

      {children && <div className="mt-3">{children}</div>}

      {note && <p className="mt-3 text-xs text-[var(--muted)]">{note}</p>}
    </section>
  );
}

/* ---------- page ---------- */

export default function InsightsPage() {
  const { t, language } = useLanguage();

  const [p, setP] = useState<Progress | null>(null);
  const [freedom, setFreedom] = useState({ target: 0, worth: 0 });
  const [hide, setHide] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [deepOpen, setDeepOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      try {
        setHide(localStorage.getItem(HIDE_KEY) === "1");
      } catch {
        /* storage not available: keep amounts visible */
      }

      setP(buildProgress());
      setFreedom({
        target: freedomNumber(getMonthlyCost()),
        worth: Math.max(getNetWorthNow().netWorth, 0),
      });
    };

    refresh();

    const events = [
      "transactionsUpdated",
      "investmentsUpdated",
      "accountsUpdated",
      "lifeGoalsUpdated",
      "currencyUpdated",
      "languageUpdated",
    ];

    events.forEach((name) => window.addEventListener(name, refresh));

    return () =>
      events.forEach((name) => window.removeEventListener(name, refresh));
  }, []);

  const toggleHide = () => {
    const next = !hide;

    setHide(next);

    try {
      localStorage.setItem(HIDE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const number = useCallback(
    (value: number) =>
      value.toLocaleString(language === "bn" ? "bn-BD" : "en-US"),
    [language]
  );

  // Amounts can be hidden, so a screenshot shows progress, not balances.
  const money = useCallback(
    (value: number) => (hide ? "•••••" : formatCurrency(value)),
    [hide]
  );

  if (!p) {
    return <div className="h-72 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  const locale = language === "bn" ? "bn-BD" : "en-US";
  const first = p.months[0];
  const last = p.months[p.months.length - 1];

  const monthName = (year: number, month: number) =>
    new Date(year, month, 1).toLocaleDateString(locale, { month: "short" });

  const period = first
    ? `${monthName(first.year, first.month)} – ${monthName(last.year, last.month)} ${last.year}`
    : "";

  /* ---- sharing ---- */

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "myfinance-progress.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const flash = (id: string) => {
    setDone(id);
    setTimeout(() => setDone(null), 1600);
  };

  const draw = (spec: Spec) =>
    renderMilestoneImage({ ...spec, period, footer: window.location.host });

  const share = async (id: string, spec: Spec) => {
    try {
      const blob = await draw(spec);
      const file = new File([blob], "myfinance-progress.png", {
        type: "image/png",
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }

      download(blob);
      flash(id);
    } catch {
      /* person closed the share sheet */
    }
  };

  const save = async (id: string, spec: Spec) => {
    try {
      download(await draw(spec));
      flash(id);
    } catch {
      /* ignore */
    }
  };

  const labels = { shareLabel: t("fxShare"), saveLabel: t("fxSave") };
  const monthsCount = p.months.length;

  /* ---- headline ---- */

  const headline = !p.hasData
    ? t("pgHeadNone")
    : p.keptTotal >= 0
      ? t("pgHeadKept", {
          amount: money(p.keptTotal),
          months: number(monthsCount),
        })
      : t("pgHeadLost", {
          amount: money(Math.abs(p.keptTotal)),
          months: number(monthsCount),
        });

  /* ---- the four numbers ---- */

  const signed = `${p.keptTotal >= 0 ? "+" : "−"}${money(Math.abs(p.keptTotal))}`;

  const wealth: Spec = {
    label: t("pgWealthTitle"),
    big: signed,
    sub: t("pgOverMonths", { months: number(monthsCount) }),
    chart:
      p.cumulative.length >= 2
        ? { kind: "line", values: p.cumulative }
        : undefined,
    theme: "ivory",
  };

  const rateDiff =
    p.rateNow !== null && p.ratePrev !== null ? p.rateNow - p.ratePrev : null;

  const rateDelta =
    rateDiff !== null
      ? t("pgPoints", {
          points: `${rateDiff > 0 ? "+" : rateDiff < 0 ? "−" : ""}${number(Math.abs(rateDiff))}`,
        })
      : undefined;

  const rate: Spec = {
    label: t("pgRateTitle"),
    big: p.rateNow !== null ? `${number(p.rateNow)}%` : "–",
    sub: rateDelta ?? t("pgLast3"),
    chart: { kind: "bars", values: p.rates, target: RATE_TARGET },
    theme: "ink",
  };

  const runway: Spec = {
    label: t("pgRunwayTitle"),
    big:
      p.runway !== null ? t("pgRunwayValue", { months: number(p.runway) }) : "–",
    sub: t("pgRunwayLine"),
    chart:
      p.runway !== null
        ? { kind: "meter", value: p.runway, max: RUNWAY_TARGET, marks: [3, 6] }
        : undefined,
    theme: "ivory",
  };

  const independence: Spec = {
    label: t("pgFreeTitle"),
    big: p.coverage !== null ? `${number(p.coverage)}%` : "–",
    sub: t("pgFreeCover"),
    chart:
      p.coverage !== null
        ? { kind: "meter", value: Math.min(p.coverage, 100), max: 100, marks: [50, 100] }
        : undefined,
    theme: "ink",
  };

  const freedomPercent =
    freedom.target > 0
      ? Math.min(Math.round((freedom.worth / freedom.target) * 100), 100)
      : null;

  const wire = (id: string, spec: Spec, enabled: boolean) =>
    enabled
      ? {
          onShare: () => share(id, spec),
          onSave: () => save(id, spec),
        }
      : {};

  return (
    <div className="mx-auto max-w-3xl space-y-3 overflow-x-clip pb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {t("pgTitle")}
          </h1>

          <p className="mt-0.5 text-sm text-[var(--muted)]">{t("pgSub")}</p>
        </div>

        <button
          type="button"
          onClick={toggleHide}
          aria-label={hide ? t("fxShow") : t("fxHide")}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
        >
          {hide ? <EyeOff size={13} /> : <Eye size={13} />}
          {hide ? t("fxShow") : t("fxHide")}
        </button>
      </div>

      <p
        style={DISPLAY}
        className="py-3 text-[26px] font-bold leading-[1.2] tracking-tight"
      >
        {headline}
      </p>

      {p.hasData && (
        <>
          {/* 1. MONEY KEPT */}
          <Metric
            title={t("pgWealthTitle")}
            big={wealth.big}
            sub={wealth.sub}
            deltaTone={p.keptTotal < 0 ? "bad" : "good"}
            note={t("pgWealthSub")}
            {...labels}
            {...wire("wealth", wealth, true)}
          >
            {p.cumulative.length >= 2 ? (
              <Line values={p.cumulative} />
            ) : (
              <p className="text-xs text-[var(--muted)]">{t("pgNeedData")}</p>
            )}
          </Metric>

          {/* 2. SAVINGS RATE */}
          <Metric
            title={t("pgRateTitle")}
            big={rate.big}
            sub={t("pgLast3")}
            delta={rateDelta}
            deltaTone={rateDiff !== null && rateDiff < 0 ? "bad" : "good"}
            note={t("pgTarget", { percent: number(RATE_TARGET) })}
            {...labels}
            {...wire("rate", rate, p.rateNow !== null)}
          >
            {p.rateNow !== null ? (
              <Bars values={p.rates} target={RATE_TARGET} />
            ) : (
              <p className="text-xs text-[var(--muted)]">{t("pgNeedData")}</p>
            )}
          </Metric>

          {/* 3. SAFETY RUNWAY */}
          <Metric
            title={t("pgRunwayTitle")}
            big={p.runway !== null ? runway.big : ""}
            sub={p.runway !== null ? t("pgRunwayLine") : t("pgNoCash")}
            note={
              p.runway !== null
                ? p.runway >= 3
                  ? t("pgRunwayGood")
                  : t("pgRunwayBuild")
                : undefined
            }
            {...labels}
            {...wire("runway", runway, p.runway !== null)}
          >
            {p.runway !== null && (
              <Meter value={p.runway} max={RUNWAY_TARGET} marks={[3, 6]} />
            )}
          </Metric>

          {/* 4. INDEPENDENCE */}
          <Metric
            title={t("pgFreeTitle")}
            big={p.coverage !== null ? independence.big : ""}
            sub={p.coverage !== null ? t("pgFreeCover") : t("pgNoInvest")}
            note={p.coverage !== null ? t("pgFreeNote") : undefined}
            {...labels}
            {...wire("free", independence, p.coverage !== null)}
          >
            {p.coverage !== null && (
              <Meter value={Math.min(p.coverage, 100)} max={100} marks={[50, 100]} />
            )}

            {freedomPercent !== null && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                {t("inFreedomLine", { percent: number(freedomPercent) })}
              </p>
            )}
          </Metric>
        </>
      )}

      {done && (
        <p className="text-center text-xs font-semibold text-[var(--primary)]">
          {t("fxSaved")}
        </p>
      )}

      {/* DEEP DIVE */}
      <button
        type="button"
        onClick={() => setDeepOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold"
      >
        {t("inDeepDive")}

        <ChevronDown
          size={16}
          className={`transition ${deepOpen ? "rotate-180" : ""}`}
        />
      </button>

      {deepOpen && (
        <div className="space-y-3">
          <div className="min-w-0">
            <NetWorthChart />
          </div>

          <div className="min-w-0">
            <FinancialInsights />
          </div>

          <div className="min-w-0">
            <IncomeExpenseChart />
          </div>

          <div className="min-w-0">
            <InvestmentPieChart />
          </div>
        </div>
      )}
    </div>
  );
}
