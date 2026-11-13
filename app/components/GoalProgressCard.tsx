"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getGoals,
  Goal,
} from "@/app/data/goals";

import {
  formatCurrency,
} from "@/app/utils/currency";

import { t } from "@/app/data/i18n";


export default function GoalProgressCard() {

  const [goals, setGoals] =
    useState<Goal[]>([]);


  const [, forceCurrencyUpdate] =
    useState(0);


  const [, refreshLanguage] =
    useState(0);


  useEffect(() => {

    function refreshGoals() {

      setGoals(
        getGoals()
      );

    }


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    const languageListener = () => {

      refreshLanguage(
        value => value + 1
      );

    };


    refreshGoals();


    window.addEventListener(
      "goalsUpdated",
      refreshGoals
    );


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    window.addEventListener(
      "languageUpdated",
      languageListener
    );


    return () => {

      window.removeEventListener(
        "goalsUpdated",
        refreshGoals
      );


      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );


      window.removeEventListener(
        "languageUpdated",
        languageListener
      );

    };

  }, []);


  const totalSaved =
    goals.reduce(
      (sum, goal) =>
        sum + goal.savedAmount,
      0
    );


  const totalTarget =
    goals.reduce(
      (sum, goal) =>
        sum + goal.targetAmount,
      0
    );


  const progress =
    totalTarget === 0
      ? 0
      : (totalSaved / totalTarget) * 100;


  const milestoneText =
    t("milestonesInProgress")
      .replace(
        "{count}",
        String(goals.length)
      )
      .replace(
        "{plural}",
        goals.length > 1
          ? "s"
          : ""
      );


  const savedText =
    t("savedOf")
      .replace(
        "{saved}",
        formatCurrency(totalSaved)
      )
      .replace(
        "{target}",
        formatCurrency(totalTarget)
      );


  return (

    <Link href="/goals">

      <div
        className="
          group
          relative
          cursor-pointer
          overflow-hidden
          rounded-[32px]
          border
          border-[var(--border)]
          bg-gradient-to-br
          from-[var(--card)]
          via-[var(--card)]
          to-emerald-500/10
          p-6
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >

        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-emerald-400/20
            blur-3xl
          "
        />


        <div className="relative">

          {/* Header */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

              <p
                className="
                  flex
                  items-center
                  gap-2
                  font-body
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-[var(--muted)]
                "
              >
                🎯 {t("myFutureGoals")}
              </p>


              <h2
                className="
                  mt-2
                  font-display
                  text-3xl
                  font-medium
                  leading-tight
                  tracking-[-0.055em]
                  text-[var(--foreground)]
                "
              >

                {
                  goals.length === 0
                    ? t("startYourJourney")
                    : milestoneText
                }

              </h2>


              <p
                className="
                  mt-3
                  font-body
                  text-sm
                  font-normal
                  tracking-[-0.015em]
                  text-[var(--muted)]
                "
              >

                {
                  goals.length === 0
                    ? t("createFirstSavingsGoal")
                    : savedText
                }

              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-emerald-500/10
                p-4
                transition
                group-hover:scale-110
              "
            >

              <Target
                className="
                  h-8
                  w-8
                  text-emerald-500
                "
              />

            </div>

          </div>


          {/* Progress */}

          <div
            className="
              mt-7
              rounded-2xl
              bg-[var(--background)]
              p-4
            "
          >

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  font-body
                  text-sm
                  font-normal
                  tracking-[-0.015em]
                  text-[var(--muted)]
                "
              >
                {t("yourProgress")}
              </span>


              <span
                className="
                  rounded-full
                  bg-emerald-500/10
                  px-3
                  py-1
                  font-body
                  text-xs
                  font-medium
                  tracking-tight
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                {progress.toFixed(0)}%
              </span>

            </div>


            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-[var(--border)]
              "
            >

              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-500
                  to-[var(--gold)]
                  transition-all
                  duration-700
                "
                style={{
                  width:
                    `${Math.min(progress, 100)}%`,
                }}
              />

            </div>


            <p
              className="
                mt-3
                font-body
                text-xs
                font-normal
                leading-5
                tracking-[-0.015em]
                text-[var(--muted)]
              "
            >

              {
                progress >= 100
                  ? t("goalCompleted")
                  : t("keepGoingFuture")
              }

            </p>

          </div>

        </div>

      </div>

    </Link>

  );

}