"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Search,
} from "lucide-react";

import { currencies } from "@/app/data/currencies";

import {
  getSettings,
  updateSettings,
} from "@/app/data/settings";

export default function CurrencyPage() {
  const [search, setSearch] = useState("");

  /*
   * Currency code is the single source of truth.
   *
   * Example:
   * USD
   * BDT
   * KZT
   * EUR
   */
  const [selected, setSelected] = useState(() => {
    const settings = getSettings();

    return settings.currency || "USD";
  });

  const filteredCurrencies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return currencies;
    }

    return currencies.filter(
      (currency) =>
        currency.name
          .toLowerCase()
          .includes(query) ||
        currency.code
          .toLowerCase()
          .includes(query) ||
        currency.symbol
          .toLowerCase()
          .includes(query)
    );
  }, [search]);

  const handleSelect = (
    currency: (typeof currencies)[number]
  ) => {
    /*
     * Select exactly ONE currency.
     */
    setSelected(currency.code);

    /*
     * Save currency code into MyFinance settings.
     */
    updateSettings({
      currency: currency.code,
    });

    window.dispatchEvent(
      new Event("currencyUpdated")
    );
  };

  return (
    <div className="mx-auto max-w-3xl pb-10">

      {/* HEADER */}

      <div className="mb-7 flex items-center gap-3">

        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Currency
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Choose the currency you want to use in MyFinance.
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search currency..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />

        </div>

      </div>

      {/* COUNT */}

      <div className="mb-3 px-2 text-xs text-slate-400">
        {filteredCurrencies.length}{" "}
        {filteredCurrencies.length === 1
          ? "currency"
          : "currencies"}
      </div>

      {/* CURRENCY LIST */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {filteredCurrencies.map(
          (currency, index) => {

            const isSelected =
              selected === currency.code;

            return (
              <div
                key={currency.code}
              >

                <button
                  type="button"
                  onClick={() =>
                    handleSelect(currency)
                  }
                  className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
                    isSelected
                      ? "bg-cyan-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >

                  {/* FLAG */}

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                    {currency.flag}
                  </span>

                  {/* NAME */}

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-900">
                      {currency.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {currency.code} · {currency.symbol}
                    </p>

                  </div>

                  {/* SELECTED */}

                  {isSelected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                      <Check size={16} />
                    </span>
                  )}

                </button>

                {index <
                  filteredCurrencies.length - 1 && (
                  <div className="ml-[68px] border-t border-slate-100" />
                )}

              </div>
            );
          }
        )}

        {/* NO RESULTS */}

        {filteredCurrencies.length === 0 && (
          <div className="px-6 py-12 text-center">

            <p className="text-sm font-semibold text-slate-700">
              No currencies found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try searching for another currency.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}