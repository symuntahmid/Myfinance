"use client";

import InvestmentMindMap from "@/app/components/InvestmentMindMap";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import AddInvestmentModal from "@/app/components/AddInvestmentModal";
import EditInvestmentModal from "@/app/components/EditInvestmentModal";
import RemoveSheet from "@/app/components/invest/RemoveSheet";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/currency";
import { TYPE_INFO } from "@/app/data/investLearn";
import {
  getInvestments,
  getPortfolioSummary,
  type Investment,
} from "@/app/data/investments";

export default function PortfolioTab({ onGrow }: { onGrow: () => void }) {
  const { t, language } = useLanguage();

  const [items, setItems] = useState<Investment[]>([]);
  const [summary, setSummary] = useState({ invested: 0, current: 0, profit: 0, returnPercentage: 0 });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Investment | null>(null);
  const [, bump] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setItems(getInvestments());
      setSummary(getPortfolioSummary());
    };
    const redraw = () => bump((v) => v + 1);

    refresh();

    window.addEventListener("investmentsUpdated", refresh);
    window.addEventListener("currencyUpdated", redraw);
    window.addEventListener("languageUpdated", redraw);

    return () => {
      window.removeEventListener("investmentsUpdated", refresh);
      window.removeEventListener("currencyUpdated", redraw);
      window.removeEventListener("languageUpdated", redraw);
    };
  }, []);

  const locale = language === "bn" ? "bn-BD" : "en-US";
  const typeName = (type: Investment["type"]) =>
    TYPE_INFO[type]?.[language] ?? type;

  // Share of the portfolio by type, biggest first.
  const byType = new Map<Investment["type"], number>();

  items.forEach((item) =>
    byType.set(item.type, (byType.get(item.type) ?? 0) + (Number(item.currentValue) || 0))
  );

  const total = [...byType.values()].reduce((sum, v) => sum + v, 0);
  const mix = [...byType.entries()]
    .map(([type, value]) => ({ type, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value);

  const heavy = mix[0] && mix[0].pct > 60 ? mix[0] : null;
  const gainUp = summary.profit >= 0;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <p className="text-lg font-bold">{t("ivNoneTitle")}</p>

          <p className="mt-1 text-sm text-[var(--muted)]">{t("ivNoneText")}</p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-full bg-[var(--primary)] py-3 text-sm font-bold text-white"
            >
              {t("ivAdd")}
            </button>

            <button
              type="button"
              onClick={onGrow}
              className="rounded-full border border-[var(--border)] py-3 text-sm font-semibold"
            >
              {t("ivTabGrow")}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-3xl bg-[var(--forest)] p-5 text-[var(--on-forest)]">
            <p className="text-sm opacity-80">{t("ivValue")}</p>

            <p className="mt-1 text-4xl font-bold tracking-tight">
              {formatCurrency(summary.current)}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
              <div>
                <p className="text-xs opacity-70">{t("ivInvestedLbl")}</p>
                <p className="text-base font-semibold">{formatCurrency(summary.invested)}</p>
              </div>

              <div>
                <p className="text-xs opacity-70">{t("ivGain")}</p>
                <p className={`text-base font-semibold ${gainUp ? "text-[var(--gold)]" : "text-[var(--sun)]"}`}>
                  {gainUp ? "+" : "-"}
                  {formatCurrency(Math.abs(summary.profit))} ·{" "}
                  {Math.abs(Math.round(summary.returnPercentage * 10) / 10).toLocaleString(locale)}%
                </p>
              </div>
            </div>
          </section>

          <InvestmentMindMap />

          {heavy && (
            <p className="rounded-xl bg-[var(--gold-soft)] px-3 py-2 text-xs font-semibold">
              {t("ivSpread", { pct: heavy.pct.toLocaleString(locale), type: typeName(heavy.type) })}
            </p>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-[var(--muted)]">{t("ivHoldings")}</h2>

              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
              >
                <Plus size={14} />
                {t("ivAdd")}
              </button>
            </div>

            <ul className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {items.map((item, index) => {
                const gain = (Number(item.currentValue) || 0) - (Number(item.investedAmount) || 0);
                const pct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
                const open = openId === item.id;

                return (
                  <li key={item.id} className={index > 0 ? "border-t border-[var(--border)]" : ""}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-lg">
                        {TYPE_INFO[item.type]?.emoji ?? "💼"}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.name}</span>
                        <span className="block truncate text-xs text-[var(--muted)]">{typeName(item.type)}</span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-bold">{formatCurrency(item.currentValue)}</span>
                        <span
                          className={`block text-xs font-semibold ${
                            gain >= 0 ? "text-[var(--success)]" : "text-[var(--sun)]"
                          }`}
                        >
                          {gain >= 0 ? "▲" : "▼"} {Math.abs(Math.round(pct * 10) / 10).toLocaleString(locale)}%
                        </span>
                      </span>
                    </button>

                    {open && (
                      <div className="flex gap-2 px-4 pb-3">
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] py-2 text-sm font-semibold"
                        >
                          <Pencil size={14} />
                          {t("txEdit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRemoving(item);
                            setOpenId(null);
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 py-2 text-sm font-semibold text-red-600"
                        >
                          <Trash2 size={14} />
                          {t("txDelete")}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {removing && <RemoveSheet investment={removing} onClose={() => setRemoving(null)} />}

      <AddInvestmentModal open={adding} onClose={() => setAdding(false)} />

      <EditInvestmentModal
        open={editing !== null}
        investment={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
