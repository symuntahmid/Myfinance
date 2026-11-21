"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { accountName, getAccounts, getBalances, normalizeSource } from "@/app/data/accounts";
import { formatCurrency } from "@/app/utils/currency";

// Chips to choose an account, with the balance shown on each. Cash is the usual default.
export const CASH = () => normalizeSource("Available Cash");

export default function AccountPicker({
  label,
  value,
  onChange,
  showBalance = true,
}: {
  label: string;
  value: string;
  onChange: (source: string) => void;
  showBalance?: boolean;
}) {
  const { language } = useLanguage();
  const lang = language === "bn" ? "bn" : "en";
  const balances = getBalances();

  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-[var(--muted)]">{label}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {getAccounts().map((account) => {
          const on = account.source === value;

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onChange(account.source)}
              className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold ${
                on
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)]"
              }`}
            >
              <span className="block">
                {account.emoji} {accountName(account, lang)}
              </span>

              {showBalance && (
                <span className={`block text-[11px] font-normal ${on ? "opacity-85" : "text-[var(--muted)]"}`}>
                  {formatCurrency(balances[account.id] ?? 0)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
