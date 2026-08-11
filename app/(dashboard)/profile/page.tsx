"use client";

import { useEffect, useState } from "react";

import ProfileCard from "@/app/components/ProfileCard";
import AchievementCard from "@/app/components/AchievementCard";
import FinancialGoalsCard from "@/app/components/FinancialGoalsCard";
import FinancialHealthCard from "@/app/components/FinancialHealthCard";

import { resetLessons } from "@/app/data/lessons";
import {
  getDailyTasks,
  getJourneyProgress,
} from "../../data/dailyJourney";

import { getFinancialHealthScore } from "../../data/transactions";

import {
  Flame,
  Globe2,
  Trophy,
  Target,
  Coins,
  Star,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const [score, setScore] = useState(() =>
    getFinancialHealthScore()
  );

  const [tasks, setTasks] = useState(() =>
    getDailyTasks()
  );

  const [journey, setJourney] = useState(() =>
    getJourneyProgress()
  );

  useEffect(() => {
    const refreshProfile = () => {
      setScore(getFinancialHealthScore());
      setTasks(getDailyTasks());
      setJourney(getJourneyProgress());
    };

    refreshProfile();

    window.addEventListener(
      "dailyJourneyUpdated",
      refreshProfile
    );

    window.addEventListener(
      "player-updated",
      refreshProfile
    );

    window.addEventListener(
      "transactionsUpdated",
      refreshProfile
    );

    return () => {
      window.removeEventListener(
        "dailyJourneyUpdated",
        refreshProfile
      );

      window.removeEventListener(
        "player-updated",
        refreshProfile
      );

      window.removeEventListener(
        "transactionsUpdated",
        refreshProfile
      );
    };
  }, []);

  /*
   * ------------------------------------------
   * PROFILE / XP
   * ------------------------------------------
   *
   * Temporary values until we connect this
   * section to the real player/XP system.
   */

  const level = 58;
  const xp = 4610;
  const nextLevelXP = 6000;

  const xpProgress =
    Math.min((xp / nextLevelXP) * 100, 100);

  /*
   * ------------------------------------------
   * STREAK
   * ------------------------------------------
   *
   * For now this is a UI placeholder.
   * We will connect it to a real streak system.
   */

  const currentStreak = 0;
  const bestStreak = 0;

  /*
   * ------------------------------------------
   * SAVINGS
   * ------------------------------------------
   */

  const savings = 0;

  /*
   * ------------------------------------------
   * MISSION
   * ------------------------------------------
   */

  const nextTask =
    tasks.find((task) => !task.completed);

  /*
   * ------------------------------------------
   * GLOBAL COMPARISON
   *
   * These are placeholder benchmark values
   * for the first UI version.
   *
   * Later these should come from the
   * Global Benchmark engine.
   * ------------------------------------------
   */

  const globalComparison = [
    {
      category: "Food",
      user: 560,
      benchmark: 420,
    },
    {
      category: "Transport",
      user: 180,
      benchmark: 250,
    },
    {
      category: "Housing",
      user: 700,
      benchmark: 850,
    },
    {
      category: "Entertainment",
      user: 120,
      benchmark: 180,
    },
  ];

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-8">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Your financial identity, progress, habits,
          and achievements.
        </p>
      </div>


      {/* ==========================================
          PROFILE + XP
      ========================================== */}

      <section className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <ProfileCard />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-yellow-50 p-3">
              <Star
                size={22}
                className="text-yellow-500"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Level
              </p>

              <h2 className="text-2xl font-bold">
                Level {level}
              </h2>
            </div>

          </div>


          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span className="font-medium">
                XP Progress
              </span>

              <span className="text-slate-500">
                {xp.toLocaleString()} /{" "}
                {nextLevelXP.toLocaleString()} XP
              </span>

            </div>


            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{
                  width: `${xpProgress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          STREAK + GAMIFIED SAVINGS
      ========================================== */}

      <section className="grid gap-6 lg:grid-cols-2">

        {/* STREAK */}

        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-7 text-white shadow-lg">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-white/20 p-3">
              <Flame size={24} />
            </div>

            <div>
              <p className="text-sm text-white/80">
                Money Streak
              </p>

              <h2 className="text-2xl font-bold">
                Build your consistency
              </h2>
            </div>

          </div>


          <div className="mt-7 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/15 p-5">

              <p className="text-sm text-white/70">
                Current Streak
              </p>

              <p className="mt-2 text-4xl font-bold">
                {currentStreak}
              </p>

              <p className="mt-1 text-sm text-white/70">
                days
              </p>

            </div>


            <div className="rounded-2xl bg-white/15 p-5">

              <p className="text-sm text-white/70">
                Best Streak
              </p>

              <p className="mt-2 text-4xl font-bold">
                {bestStreak}
              </p>

              <p className="mt-1 text-sm text-white/70">
                days
              </p>

            </div>

          </div>

        </div>


        {/* SAVINGS */}

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-green-50 p-3">
                <Coins
                  size={24}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Gamified Savings
                </p>

                <h2 className="text-2xl font-bold">
                  {formatMoney(savings)}
                </h2>
              </div>

            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              +0%
            </span>

          </div>


          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                Savings Progress
              </span>

              <span className="font-semibold">
                0%
              </span>

            </div>


            <div className="mt-3 h-3 rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: "0%" }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          TODAY'S MISSION
      ========================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <Target
                size={22}
                className="text-teal-500"
              />

              <h2 className="text-2xl font-bold">
                Today's Mission
              </h2>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Small actions that build better financial habits.
            </p>

          </div>

          <span className="text-sm font-semibold text-teal-600">
            {journey.completed}/{journey.total}
          </span>

        </div>


        <div className="mt-6 rounded-2xl bg-slate-50 p-5">

          {nextTask ? (

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="font-semibold text-slate-800">
                  {nextTask.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Complete the action to earn{" "}
                  <span className="font-semibold text-teal-600">
                    +{nextTask.reward} XP
                  </span>
                </p>

              </div>

              <ChevronRight
                size={20}
                className="text-slate-400"
              />

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <Trophy className="text-yellow-500" />

              <div>

                <p className="font-bold">
                  Daily Journey Complete!
                </p>

                <p className="text-sm text-slate-500">
                  You completed all today's money actions.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ==========================================
          BADGES + FINANCIAL HEALTH
      ========================================== */}

      <section className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <AchievementCard />
        </div>

        <FinancialHealthCard score={score} />

      </section>


      {/* ==========================================
          FINANCIAL GOALS
      ========================================== */}

      <FinancialGoalsCard />


      {/* ==========================================
          GLOBAL COMPARISON
      ========================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-green-50 p-3">
                <Globe2
                  size={24}
                  className="text-green-600"
                />
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Global Comparison
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  See how your spending aligns with worldwide benchmarks.
                </p>

              </div>

            </div>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Benchmark
          </span>

        </div>


        <div className="mt-7 space-y-6">

          {globalComparison.map((item) => {

            const percentage =
              item.benchmark > 0
                ? (item.user / item.benchmark) * 100
                : 0;

            const above =
              item.user > item.benchmark;

            return (
              <div key={item.category}>

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-slate-700">
                    {item.category}
                  </span>

                  <div className="text-right">

                    <span className="font-bold text-slate-900">
                      {formatMoney(item.user)}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      vs {formatMoney(item.benchmark)}
                    </span>

                  </div>

                </div>


                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full ${
                      above
                        ? "bg-orange-400"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>


                <p
                  className={`mt-2 text-xs font-medium ${
                    above
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {above
                    ? `${Math.round(
                        percentage - 100
                      )}% above benchmark`
                    : `${Math.round(
                        100 - percentage
                      )}% below benchmark`}
                </p>

              </div>
            );
          })}

        </div>


        <div className="mt-7 rounded-2xl bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            🌍 Your global comparison will become more personalized
            as MyFinance learns your income, location, household
            situation, and spending patterns.
          </p>

        </div>

      </section>


      {/* ==========================================
          DEVELOPER RESET
      ========================================== */}

      <button
        onClick={() => {
          resetLessons();
          location.reload();
        }}
        className="w-full rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
      >
        🔄 Reset Academy (Developer)
      </button>

    </div>
  );
}