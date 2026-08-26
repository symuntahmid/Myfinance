"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  Lock,
  Sparkles,
  Zap,
  ChevronRight,
} from "lucide-react";

import {
  getAIWallet,
  unlockAIInsights,
  hasUnlockedInsights,
} from "@/app/data/aiWallet";

import {
  getAIInsights,
} from "@/app/data/aiInsights";

import type {
  AIInsight,
} from "@/app/data/types/AIInsight";

import AIInsightEnergy from "./AIInsightEnergy";



type AIInsightCardProps = {
  title?: string;
};



function getInsightIcon(
  type: AIInsight["type"]
) {

  switch(type) {

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

  title = "Your Smart CFO",

}: AIInsightCardProps) {


  const [mounted,setMounted] =
    useState(false);


  const [credits,setCredits] =
    useState(0);


  const [insights,setInsights] =
    useState<AIInsight[]>([]);


  const [unlocked,setUnlocked] =
    useState(false);


  const [showEnergy,setShowEnergy] =
    useState(false);





  const refresh = () => {


    const wallet =
      getAIWallet();


    setCredits(
      wallet.credits
    );


    const allInsights =
      getAIInsights();


    setInsights(
      allInsights.slice(0,4)
    );


    setUnlocked(
      hasUnlockedInsights()
    );

  };






  useEffect(()=>{


    setMounted(true);


    refresh();



    window.addEventListener(
      "aiWalletUpdated",
      refresh
    );


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



    return()=>{


      window.removeEventListener(
        "aiWalletUpdated",
        refresh
      );


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


  },[]);






  const handleUnlock = () => {


    const success =
      unlockAIInsights();


    if(!success){

      setShowEnergy(true);

      return;

    }


    refresh();

  };






  if(!mounted){

    return null;

  }





  const visibleInsights =
    unlocked
    ? insights.slice(0,4)
    : insights.slice(0,1);



  const lockedCount =
    unlocked
    ? 0
    : 3;




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

<Brain size={24}/>

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
tracking-tight
text-[var(--foreground)]
"
>
{title}
</h2>


<Sparkles
size={15}
className="text-violet-500"
/>


</div>



<p
className="
mt-1
text-xs
text-[var(--muted)]
"
>

Your personal AI financial coach

</p>



</div>


</div>





<div
className="
flex
items-center
gap-2
rounded-full
border
border-[var(--border)]
bg-[var(--background)]
px-3
py-2
"
>


<Zap
size={14}
className="
fill-yellow-400
text-yellow-500
"
/>


<div>

<p
className="
text-sm
font-semibold
tracking-tight
text-[var(--foreground)]
"
>
{credits}
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


{visibleInsights.map((insight)=>(


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




<div
className="
min-w-0
"
>


<p
className="
text-sm
font-semibold
tracking-tight
text-[var(--foreground)]
"
>
{insight.title}
</p>




<p
className="
mt-2
text-sm
leading-6
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

💡 Next Action

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







{/* LOCKED INSIGHTS */}


{!unlocked && (


<div
className="
mt-4
rounded-3xl
border
border-violet-500/20
bg-gradient-to-br
from-violet-500/10
to-cyan-500/10
p-5
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
rounded-2xl
bg-violet-500/10
p-3
"
>

<Lock
size={20}
className="
text-violet-500
"
/>


</div>



<div>


<h3
className="
font-display
text-lg
font-medium
tracking-tight
text-[var(--foreground)]
"
>
{lockedCount} AI opportunities discovered
</h3>



<p
className="
mt-1
text-xs
leading-5
text-[var(--muted)]
"
>

Unlock your complete Smart CFO analysis
and discover hidden money patterns.

</p>


</div>



</div>


</div>


)}




{/* ACTION BUTTON */}


{!unlocked && (


<div
className="
mt-5
"
>


{


showEnergy


?


<AIInsightEnergy />


:


<button

type="button"

onClick={handleUnlock}

className="
group
flex
w-full
items-center
justify-center
gap-2
rounded-2xl
bg-gradient-to-r
from-violet-600
to-cyan-600
px-5
py-4
text-sm
font-semibold
text-white
shadow-lg
shadow-violet-500/20
transition
hover:scale-[1.01]
"

>


<Sparkles
size={16}
/>


Unlock AI Insights


<ChevronRight
size={16}
className="
transition
group-hover:translate-x-1
"
/>


</button>


}



</div>


)}





{/* UNLOCKED STATE */}


{unlocked && (


<div
className="
mt-5
flex
items-center
justify-center
gap-2
rounded-2xl
bg-emerald-500/10
px-4
py-3
text-sm
font-bold
text-emerald-600
dark:text-emerald-400
"
>


<Sparkles size={16}/>


All Smart CFO insights unlocked


</div>


)}





</div>


</section>


  );

}