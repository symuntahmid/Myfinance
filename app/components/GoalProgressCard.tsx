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


export default function GoalProgressCard() {


  const [goals,setGoals] =
    useState<Goal[]>([]);

const [, forceCurrencyUpdate] =
  useState(0);

  useEffect(()=>{


function refreshGoals(){

  setGoals(
    getGoals()
  );

}


const currencyListener = () => {

  forceCurrencyUpdate(
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



return () => {

window.removeEventListener(
  "goalsUpdated",
  refreshGoals
);


window.removeEventListener(
  "currencyUpdated",
  currencyListener
);


};


},[]);





  const totalSaved =
    goals.reduce(
      (sum,goal)=>
        sum + goal.savedAmount,
      0
    );



  const totalTarget =
    goals.reduce(
      (sum,goal)=>
        sum + goal.targetAmount,
      0
    );



  const progress =
    totalTarget === 0
      ? 0
      : (totalSaved / totalTarget) * 100;





  return (

<Link href="/goals">

<div
className="
group
relative
overflow-hidden
cursor-pointer
rounded-[32px]
border
border-[var(--border)]
bg-gradient-to-br
from-[var(--card)]
via-[var(--card)]
to-cyan-500/10
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
bg-cyan-400/20
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
text-xs
font-bold
uppercase
tracking-wider
text-[var(--muted)]
"
>

🎯 My Future Goals

</p>



<h2
className="
mt-2
text-2xl
font-black
text-[var(--foreground)]
"
>


{
goals.length === 0

?

"Start your journey"

:

`${goals.length} milestone${
goals.length > 1
? "s"
: ""
} in progress`

}


</h2>




<p
className="
mt-2
text-sm
text-[var(--muted)]
"
>


{
goals.length === 0

?

"Create your first savings goal and build your future."

:

`${formatCurrency(totalSaved)} saved of ${formatCurrency(totalTarget)}`

}


</p>


</div>





<div
className="
rounded-2xl
bg-cyan-500/10
p-4
transition
group-hover:scale-110
"
>


<Target
className="
h-8
w-8
text-cyan-500
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
text-sm
font-semibold
text-[var(--muted)]
"
>
Your progress
</span>



<span
className="
rounded-full
bg-cyan-500/10
px-3
py-1
text-xs
font-black
text-cyan-600
dark:text-cyan-400
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
from-cyan-500
to-blue-600
transition-all
duration-700
"

style={{
width:`${Math.min(progress,100)}%`,
}}

/>


</div>




<p
className="
mt-3
text-xs
font-medium
text-[var(--muted)]
"
>


{
progress >= 100

?

"🎉 Goal completed! Amazing work."

:

"🚀 Keep going, your future is getting closer."

}


</p>



</div>





</div>


</div>


</Link>

);

}