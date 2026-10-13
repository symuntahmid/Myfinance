"use client";

import {
  HeartPulse,
} from "lucide-react";

import {
  useLanguage,
} from "@/app/context/LanguageContext";


type FinancialHealthCardProps = {
  score: number;
};


export default function FinancialHealthCard({
  score,
}: FinancialHealthCardProps) {

  const { t } =
    useLanguage();


  let label =
    t("critical");

  let color =
    "bg-red-500";


  if (score >= 80) {

    label =
      t("excellent");

    color =
      "bg-green-500";

  } else if (score >= 60) {

    label =
      t("good");

    color =
      "bg-yellow-500";

  } else if (score >= 40) {

    label =
      t("fair");

    color =
      "bg-orange-500";

  }


  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-6
      shadow-xl
      "
    >

      {/* Header */}

      <div
        className="
        flex
        items-center
        gap-3
        "
      >

        <HeartPulse
          className="
          text-red-500
          "
        />


        <h2
          className="
          font-display
          text-3xl
          font-medium
          tracking-[-0.04em]
          text-[var(--foreground)]
          "
        >
          {t("financialHealth")}
        </h2>

      </div>


      {/* Score */}

      <div
        className="
        mt-8
        text-center
        "
      >

        <div
          className="
          font-display
          text-7xl
          font-medium
          tracking-[-0.05em]
          text-[var(--foreground)]
          "
        >
          {score}
        </div>


        <p
          className="
          mt-3
          font-body
          text-sm
          font-medium
          uppercase
          tracking-[0.12em]
          text-[var(--muted)]
          "
        >
          {label}
        </p>

      </div>


      {/* Progress Bar */}

      <div
        className="
        mt-8
        h-4
        overflow-hidden
        rounded-full
        bg-[var(--background)]
        "
      >

        <div
          className={`
          h-full
          ${color}
          transition-all
          duration-700
          `}
          style={{
            width: `${score}%`,
          }}
        />

      </div>


      {/* Description */}

      <p
        className="
        mt-5
        text-center
        font-body
        text-sm
        leading-relaxed
        tracking-tight
        text-[var(--muted)]
        "
      >
        {t("financialHealthDescription")}
      </p>

    </div>

  );

}