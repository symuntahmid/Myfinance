"use client";

import { getSummary } from "../data/transactions";

export default function FinancialInsights() {
  const summary = getSummary();

  const savings = summary.income - summary.expense;

  const savingsRate =
    summary.income > 0
      ? Math.round((savings / summary.income) * 100)
      : 0;

  const insights = [];

  if (summary.income === 0) {
    insights.push(
      "Add your first income to begin tracking."
    );
  } else {

    if (savingsRate >= 50)

      insights.push(
        "Excellent! You're saving over 50% of your income."
      );


    else if (savingsRate >= 30)

      insights.push(
        "Great job! Your savings rate is healthy."
      );


    else if (savingsRate >= 10)

      insights.push(
        "You're saving consistently. Keep building momentum."
      );


    else

      insights.push(
        "Try reducing unnecessary expenses to improve savings."
      );

  }



  if (summary.investment > summary.income * 0.5)

    insights.push(
      "Your investments are becoming a major part of your wealth."
    );



  if (summary.expense > summary.income)

    insights.push(
      "Warning: Expenses are higher than your income."
    );



  return (

    <div
      className="
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-8
      shadow-sm
      "
    >


      <h2
  className="
  font-display
  text-3xl
  font-medium
  tracking-[-0.04em]
  text-[var(--foreground)]
  "
>
  Financial Insights
</h2>



      <p
  className="
  mt-3
  text-sm
  font-normal
  leading-relaxed
  tracking-tight
  text-[var(--muted)]
  "
>
  Personalized observations based on your finances.
</p>




      <div
        className="
        mt-6
        space-y-4
        "
      >


        {insights.map((item,index)=>(


          <div

            key={index}

            className="
rounded-2xl
bg-[var(--background)]
border
border-[var(--border)]
p-4
text-sm
font-normal
leading-7
tracking-tight
text-[var(--foreground)]
"

          >

            💡 {item}

          </div>


        ))}



      </div>



    </div>

  );

}