"use client";

import { HeartPulse } from "lucide-react";

type FinancialHealthCardProps = {
  score: number;
};


export default function FinancialHealthCard({
  score,
}: FinancialHealthCardProps) {


  let label = "Critical";
  let color = "bg-red-500";


  if (score >= 80) {

    label = "Excellent";
    color = "bg-green-500";

  } else if (score >= 60) {

    label = "Good";
    color = "bg-yellow-500";

  } else if (score >= 40) {

    label = "Fair";
    color = "bg-orange-500";

  }



  return (

    <div
      className="
      rounded-3xl
      border border-[var(--border)]
      bg-[var(--card)]
      p-6
      shadow-xl
      "
    >


      {/* Header */}

      <div className="flex items-center gap-3">


        <HeartPulse
          className="text-red-500"
        />


        <h2
          className="
          text-2xl
          font-bold
          text-[var(--foreground)]
          "
        >
          Financial Health
        </h2>


      </div>





      {/* Score */}


      <div className="mt-8 text-center">


        <div
          className="
          text-6xl
          font-extrabold
          text-[var(--foreground)]
          "
        >
          {score}
        </div>



        <p
          className="
          mt-2
          text-lg
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
        mt-4
        text-center
        text-sm
        text-[var(--muted)]
        "
      >
        Based on your actual income, expenses, savings,
        investments and financial activity this month.
      </p>



    </div>

  );

}