"use client";

import {
  Lightbulb,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import {
  getAllocation,
  getPortfolioSummary,
} from "@/app/data/investments";


export default function AIInvestmentInsights() {

  const summary = getPortfolioSummary();
  const allocation = getAllocation();


  const total = summary.current;


  const sortedAssets =
    Object.entries(allocation).sort(
      (a, b) => b[1] - a[1]
    );


  const largestAsset =
    sortedAssets[0];


  const largestPercentage =
    total > 0 && largestAsset
      ? (largestAsset[1] / total) * 100
      : 0;



  let health = "Excellent";


  if(summary.current === 0){

    health = "No Data";

  }
  else if(summary.returnPercentage < 0){

    health = "Needs Attention";

  }
  else if(summary.returnPercentage < 10){

    health = "Average";

  }



  return (

<div className="
rounded-3xl
border border-[var(--border)]
bg-gradient-to-br
from-cyan-50
via-[var(--card)]
to-[var(--card)]
p-8
shadow-sm
">


{/* Header */}

<div className="
flex
items-center
gap-3
">


<div className="
rounded-2xl
bg-cyan-100
p-3
">

<Lightbulb
className="h-6 w-6 text-cyan-700"
/>

</div>



<div>

<h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
AI Portfolio Insights
</h2>


<p
className="
mt-2
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>
Personalized recommendations based on your portfolio.
</p>


</div>


</div>







<div className="
mt-8
space-y-5
">



{/* Health */}

<div className="
flex
items-start
gap-3
">


<ShieldCheck
className="
mt-1
h-5 w-5
text-green-600
"
/>


<div>

<h3
className="
font-display
text-xl
font-medium
tracking-[-0.03em]
text-[var(--foreground)]
"
>

Portfolio Health

</h3>


<p
className="
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>

Your current portfolio health is

<span
className="
font-body
font-semibold
text-cyan-700
"
>

{" "}
{health}

</span>.

</p>


</div>


</div>







{/* Largest Holding */}

<div className="
flex
items-start
gap-3
">


<TrendingUp
className="
mt-1
h-5 w-5
text-cyan-600
"
/>


<div>

<h3
className="
font-display
text-xl
font-medium
tracking-[-0.03em]
text-[var(--foreground)]
"
>

Largest Holding

</h3>


<p
className="
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>

{
largestAsset

?

`${largestAsset[0]} represents ${largestPercentage.toFixed(1)}% of your portfolio.`

:

"No investments yet."

}

</p>


</div>


</div>







{/* Recommendation */}

<div className="
rounded-2xl
bg-cyan-50
p-5
">


<h3
className="
font-display
text-xl
font-medium
tracking-[-0.03em]
text-[var(--foreground)]
"
>

AI Recommendation

</h3>


<p
className="
mt-3
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>

{
largestPercentage > 70

?

"Your portfolio is highly concentrated in one asset. Consider diversifying into ETFs, Gold, or Bonds to reduce risk."

:

"Your portfolio is reasonably diversified. Continue investing consistently and review allocations monthly."

}

</p>


</div>



</div>



</div>


  );

}