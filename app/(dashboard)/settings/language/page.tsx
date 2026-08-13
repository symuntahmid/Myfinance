"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Search,
} from "lucide-react";

import { languages } from "@/app/data/languages";

import {
  getSettings,
  updateSettings,
} from "@/app/data/settings";

export default function LanguagePage() {
  const [search, setSearch] = useState("");

  /*
   * Store the UNIQUE language code as the selected value.
   *
   * Example:
   * English -> EN
   * Bangla  -> BN
   * Kazakh  -> KK
   */
  const [selected, setSelected] = useState(() => {
    const settings = getSettings();

    const currentLanguage =
      settings.language || "English";

    const matchedLanguage = languages.find(
      (language) =>
        language.name === currentLanguage
    );

    return (
      matchedLanguage?.code ||
      languages[0]?.code ||
      "EN"
    );
  });

  /*
   * SEARCH
   */
  const filteredLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return languages;
    }

    return languages.filter(
      (language) =>
        language.name
          .toLowerCase()
          .includes(query) ||
        language.nativeName
          .toLowerCase()
          .includes(query)
    );
  }, [search]);

  /*
   * SELECT LANGUAGE
   */
  const handleSelect = (
    language: (typeof languages)[number]
  ) => {
    /*
     * Only ONE code can be selected.
     */
    setSelected(language.code);

    /*
     * Save the human-readable language name
     * inside the main MyFinance settings.
     */
    updateSettings({
      language: language.name,
    });

    /*
     * Optional event for other language-related
     * components.
     */
    window.dispatchEvent(
      new Event("languageUpdated")
    );
  };

  return (
    <div className="mx-auto max-w-3xl pb-10">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-7 flex items-center gap-3">

        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Language
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Choose your preferred language for MyFinance.
          </p>
        </div>

      </div>

      {/* =========================================
          SEARCH
      ========================================= */}

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
            placeholder="Search language..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />

        </div>

      </div>

      {/* =========================================
          COUNT
      ========================================= */}

      <div className="mb-3 px-2 text-xs text-slate-400">
        {filteredLanguages.length}{" "}
        {filteredLanguages.length === 1
          ? "language"
          : "languages"}
      </div>

      {/* =========================================
          LANGUAGE LIST
      ========================================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {filteredLanguages.map(
          (language, index) => {

            /*
             * IMPORTANT:
             *
             * Compare CODE with CODE.
             *
             * This makes the list strictly
             * single-select.
             */
            const isSelected =
              selected === language.code;

            return (
              <div
                key={language.code}
              >

                <button
                  type="button"
                  onClick={() =>
                    handleSelect(language)
                  }
                  className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
                    isSelected
                      ? "bg-cyan-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >

                  {/* FLAG */}

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                    {language.flag}
                  </span>

                  {/* LANGUAGE */}

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-slate-900">
                      {language.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {language.nativeName}
                    </p>

                  </div>

                  {/* CHECK */}

                  {isSelected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                      <Check size={16} />
                    </span>
                  )}

                </button>

                {index <
                  filteredLanguages.length - 1 && (
                  <div className="ml-[68px] border-t border-slate-100" />
                )}

              </div>
            );
          }
        )}

        {/* =======================================
            NO RESULTS
        ======================================= */}

        {filteredLanguages.length === 0 && (
          <div className="px-6 py-12 text-center">

            <p className="text-sm font-semibold text-slate-700">
              No languages found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try searching for another language.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}