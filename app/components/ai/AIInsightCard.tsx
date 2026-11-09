"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  Sparkles,
} from "lucide-react";

import {
  getAIInsights,
} from "@/app/data/aiInsights";

import type {
  AIInsight,
} from "@/app/data/types/AIInsight";

import {
  t,
} from "@/app/data/i18n";


type AIInsightCardProps = {
  title?: string;
};


function getInsightIcon(
  type: AIInsight["type"]
) {

  switch (type) {

    case "warning":
      return "⚠️";

    case "opportunity":
      return "💡";

    case "habit":
      return "🧠";

    case "funny":
      return "😄";

    case "emotional":
      return "❤️";

    case "investment":
      return "📈";

    default:
      return "🏆";

  }

}


export default function AIInsightCard({
  title,
}: AIInsightCardProps) {

  const [mounted, setMounted] =
    useState(false);

  const [insights, setInsights] =
    useState<AIInsight[]>([]);


  const refresh = () => {

    const allInsights =
      getAIInsights();

    setInsights(
      allInsights.slice(0, 4)
    );

  };


  useEffect(() => {

    setMounted(true);

    refresh();


    window.addEventListener(
      "transactionsUpdated",
      refresh
    );

    window.addEventListener(
      "investmentsUpdated",
      refresh
    );

    window.addEventListener(
      "player-updated",
      refresh
    );


    return () => {

      window.removeEventListener(
        "transactionsUpdated",
        refresh
      );

      window.removeEventListener(
        "investmentsUpdated",
        refresh
      );

      window.removeEventListener(
        "player-updated",
        refresh
      );

    };

  }, []);


  if (!mounted) {
    return null;
  }


  const visibleInsights = insights;


  return (

    <section
      className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-[var(--border)]
      bg-gradient-to-br
      from-violet-500/10
      via-[var(--card)]
      to-cyan-500/10
      p-5
      shadow-xl
      shadow-violet-500/10
      md:p-6
      "
    >

      {/* Glow */}

      <div
        className="
        pointer-events-none
        absolute
        -right-20
        -top-20
        h-52
        w-52
        rounded-full
        bg-violet-500/20
        blur-3xl
        "
      />

      <div
        className="
        pointer-events-none
        absolute
        -bottom-20
        -left-20
        h-52
        w-52
        rounded-full
        bg-cyan-400/20
        blur-3xl
        "
      />


      <div className="relative">

        {/* AI HEADER */}

        <div
          className="
          flex
          items-center
          justify-between
          gap-4
          "
        >

          <div
            className="
            flex
            items-center
            gap-3
            "
          >

            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-violet-500
              to-cyan-500
              text-white
              shadow-lg
              "
            >
              <Brain size={24} />
            </div>


            <div>

              <div
                className="
                flex
                items-center
                gap-2
                "
              >

                <h2
                  className="
                  font-display
                  text-xl
                  font-medium
                  tracking-[-0.04em]
                  leading-tight
                  text-[var(--foreground)]
                  "
                >
                  {title ?? t("yourSmartCFO")}
                </h2>

                <Sparkles
                  size={15}
                  className="text-violet-500"
                />

              </div>


              <p
                className="
                mt-1
                font-body
                text-xs
                tracking-[-0.01em]
                text-[var(--muted)]
                "
              >
                {t("personalAIFinancialCoach")}
              </p>

            </div>

          </div>


        </div>


        {/* INSIGHTS */}

        <div
          className="
          mt-6
          space-y-3
          "
        >

          {visibleInsights.map((insight) => (

            <div
              key={insight.id}
              className="
              rounded-3xl
              border
              border-[var(--border)]
              bg-[var(--background)]/80
              p-4
              shadow-sm
              transition
              hover:shadow-md
              "
            >

              <div
                className="
                flex
                items-start
                gap-3
                "
              >

                <div
                  className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--card)]
                  text-xl
                  shadow-sm
                  "
                >
                  {getInsightIcon(insight.type)}
                </div>


                <div className="min-w-0">

                  <p
                    className="
                    font-display
                    text-base
                    font-medium
                    tracking-[-0.035em]
                    text-[var(--foreground)]
                    "
                  >
                    {insight.title}
                  </p>


                  <p
                    className="
                    mt-2
                    font-body
                    text-sm
                    leading-6
                    tracking-[-0.015em]
                    text-[var(--muted)]
                    "
                  >
                    {insight.message}
                  </p>


                  {insight.action && (

                    <div
                      className="
                      mt-4
                      rounded-2xl
                      border
                      border-violet-500/20
                      bg-violet-500/5
                      px-3
                      py-3
                      "
                    >

                      <p
                        className="
                        text-xs
                        font-semibold
                        text-violet-600
                        dark:text-violet-400
                        "
                      >
                        💡 {t("nextAction")}
                      </p>


                      <p
                        className="
                        mt-1
                        text-xs
                        text-[var(--muted)]
                        "
                      >
                        {insight.action}
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}