"use client";

import {
  updateSettings,
} from "@/app/data/settings";

import { countries } from "@/app/data/countries";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Search } from "lucide-react";

export default function CountryPage() {
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") {
      return "BD";
    }

    return (
      localStorage.getItem("myfinance-country") ||
      "BD"
    );
  });

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return countries;
    }

    return countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSelect = (code: string) => {
    const selectedCountry = countries.find(
      (country) => country.code === code
    );

    if (!selectedCountry) {
      return;
    }

    setSelected(code);

    /*
     * Save country code separately.
     * Useful for future country-specific features.
     */
    localStorage.setItem(
      "myfinance-country",
      selectedCountry.code
    );

    /*
     * Update the main MyFinance settings.
     *
     * Settings page reads:
     * getSettings().country
     *
     * Therefore we save the COUNTRY NAME here,
     * not only the country code.
     */
    updateSettings({
      country: selectedCountry.name,
    });

    /*
     * Return to Settings after selection.
     */
    window.location.href = "/settings";
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
            Country
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Choose your country for a more personalized experience.
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
            placeholder="Search country..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>
      </div>

      {/* COUNTRY COUNT */}
      <div className="mb-3 px-2 text-xs text-slate-400">
        {filteredCountries.length}{" "}
        {filteredCountries.length === 1
          ? "country"
          : "countries"}
      </div>

      {/* COUNTRY LIST */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {filteredCountries.map(
          (country, index) => {
            const isSelected =
              selected === country.code;

            return (
              <div key={country.code}>
                <button
                  type="button"
                  onClick={() =>
                    handleSelect(country.code)
                  }
                  className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
                    isSelected
                      ? "bg-cyan-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* FLAG */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                    {country.flag}
                  </span>

                  {/* COUNTRY NAME */}
                  <span className="flex-1 text-sm font-semibold text-slate-900">
                    {country.name}
                  </span>

                  {/* SELECTED */}
                  {isSelected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                      <Check size={16} />
                    </span>
                  )}
                </button>

                {index <
                  filteredCountries.length - 1 && (
                  <div className="ml-[68px] border-t border-slate-100" />
                )}
              </div>
            );
          }
        )}

        {/* NO RESULTS */}
        {filteredCountries.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No countries found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try searching for another country.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}