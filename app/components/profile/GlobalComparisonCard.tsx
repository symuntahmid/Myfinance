"use client";

import WorldMap from "react-svg-worldmap";

const comparisonData = [
  { country: "bd" as const, value: 58 },
  { country: "in" as const, value: 72 },
  { country: "us" as const, value: 84 },
  { country: "gb" as const, value: 78 },
  { country: "de" as const, value: 75 },
  { country: "jp" as const, value: 81 },
  { country: "au" as const, value: 69 },
  { country: "ca" as const, value: 77 },
];

export default function GlobalComparisonCard() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            🌍 Global Comparison
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            See how your spending aligns worldwide
          </h2>
        </div>

        <button
          className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-200"
          title="Filter comparison"
        >
          ☰
        </button>
      </div>

      {/* Map */}
      <div className="px-5 pt-3">
        <div className="overflow-hidden rounded-2xl bg-slate-50 p-3">
  <div className="flex justify-center">
    <WorldMap
      color="#79c95b"
      title="Global spending comparison"
      valueSuffix="%"
      size="lg"
      data={comparisonData}
    />
  </div>
</div>
      </div>

      {/* Comparison */}
      <div className="space-y-3 px-6 pb-6 pt-4">

        {/* Shopping */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🛍️</span>

            <span className="text-sm font-medium text-slate-700">
              Shopping
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              $120
            </span>

            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">
              -15%
            </span>
          </div>
        </div>

        {/* Food */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🍔</span>

            <span className="text-sm font-medium text-slate-700">
              Food
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              $560
            </span>

            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
              +15%
            </span>
          </div>
        </div>

        {/* Overall */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-slate-400">
                Overall spending
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                Better than 64%
              </p>
            </div>

            <div className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-600">
              GOOD
            </div>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Compared with the current demo global benchmark.
          </p>
        </div>

        {/* Button */}
        <button className="mt-1 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          View Global Comparison →
        </button>

      </div>

    </section>
  );
}