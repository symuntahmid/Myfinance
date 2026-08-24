"use client";

import Link from "next/link";

import ExpenseBreakdownChart from "@/app/components/ExpenseBreakdownChart";
import IncomeSourcesChart from "@/app/components/IncomeSourcesChart";
import FinancialHealthCard from "@/app/components/FinancialHealthCard";


export default function AnalyticsPage() {


  return (

<div
className="
mx-auto
max-w-7xl
space-y-8
"
>


{/* Header */}

<div
className="
flex
flex-wrap
items-center
justify-between
gap-4
"
>


<div>


<h1
className="
text-4xl
font-bold
tracking-tight
text-[var(--foreground)]
"
>
Money Analytics
</h1>



<p
className="
mt-2
text-lg
text-[var(--muted)]
"
>
Deep insights into your financial behavior.
</p>



</div>





<Link

href="/money"

className="
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
px-6
py-3
font-semibold
text-[var(--foreground)]
shadow-sm
transition
hover:-translate-y-0.5
hover:shadow-md
"

>
← Back
</Link>




</div>





{/* Hero */}


<div
className="
rounded-[36px]
bg-gradient-to-br
from-slate-900
via-slate-800
to-slate-900
p-8
md:p-10
text-white
shadow-2xl
"
>


<p
className="
text-sm
uppercase
tracking-[0.35em]
text-cyan-300
"
>
AI ANALYTICS
</p>




<h2
className="
mt-5
text-4xl
md:text-5xl
font-bold
leading-tight
"
>

Understand

<br />

your money.

</h2>





<p
className="
mt-5
max-w-2xl
text-lg
text-white/70
"
>
See where your income comes from, where your expenses go,
and whether your financial habits are improving every month.
</p>




</div>






{/* Charts */}


<div
className="
grid
gap-8
xl:grid-cols-2
"
>


<div>

<ExpenseBreakdownChart />

</div>



<div>

<IncomeSourcesChart />

</div>



</div>













</div>

  );

}