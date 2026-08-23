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

  title = "Your Smart CFO Insights",

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




  /* ==========================================
     REFRESH DATA
  ========================================== */

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






  /* ==========================================
     LOAD
  ========================================== */


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








  /* ==========================================
     UNLOCK
  ========================================== */


  const handleUnlock = () => {


    console.log(
      "CLICKED UNLOCK"
    );



    const success =
      unlockAIInsights();



    console.log(
      "UNLOCK SUCCESS:",
      success
    );



    if(!success){


      setShowEnergy(true);


      return;

    }



    refresh();


  };








  if(!mounted){

    return null;

  }







  const visibleInsights = unlocked

    ? insights.slice(0,4)

    : insights.slice(0,1);



  const lockedCount = unlocked

    ? 0

    : 3;





  return (

<section className="
relative overflow-hidden rounded-[28px]
border border-[var(--border)]
bg-[var(--card)]
p-5 shadow-sm md:p-6
">


<div className="
pointer-events-none absolute
-right-16 -top-16
h-40 w-40 rounded-full
bg-[var(--primary)]/10 blur-3xl
"/>



<div className="relative">





<div className="
flex items-start justify-between gap-4
">



<div className="
flex items-center gap-3
">


<div className="
flex h-11 w-11 items-center justify-center
rounded-2xl bg-[var(--background)] text-[var(--primary)] shadow-sm
">

<Brain size={22}/>

</div>




<div>


<div className="
flex items-center gap-2
">


<h2 className="
text-sm font-bold text-[var(--foreground)]
">

{title}

</h2>


<Sparkles
size={15}
className="text-violet-500"
/>


</div>



<p className="
mt-0.5 text-[11px]
text-[var(--muted)]
">

{
unlocked

?

"4 Smart CFO insights unlocked ✨"

:

"Your first Smart CFO insight is free today ✨"

}


</p>


</div>


</div>






<div className="
flex items-center gap-1.5
rounded-full
border border-[var(--border)]
bg-[var(--background)]
px-3 py-1.5
text-xs font-bold
text-[var(--primary)]
shadow-sm
">


<Zap
size={13}
className="fill-cyan-400 text-cyan-500"
/>


{credits}


</div>



</div>









<div className="
mt-5 space-y-3
">


{visibleInsights.map((insight)=>(


<div
key={insight.id}
className="
rounded-2xl border border-[var(--border)]
bg-[var(--background)]
p-4 shadow-sm
"
>


<div className="
flex items-start gap-3
">


<div className="text-xl">

{getInsightIcon(insight.type)}

</div>




<div className="min-w-0">


<p className="
text-sm font-bold text-[var(--foreground)]
">

{insight.title}

</p>



<p className="
mt-1 text-sm leading-5 text-[var(--muted)]
">

{insight.message}

</p>




{insight.action && (

<p className="
mt-3
rounded-xl
border border-[var(--border)]
bg-[var(--card)]
px-3
py-2
text-xs
text-[var(--muted)]
">

{insight.action}

</p>

)}



</div>


</div>


</div>


))}








{!unlocked && (


<div className="
rounded-2xl border border-[var(--border)]
bg-[var(--background)] p-4
">


<div className="
flex items-center gap-3
">


<Lock
size={18}
className="text-[var(--muted)]"
/>



<div>


<p className="
text-sm font-bold text-[var(--foreground)]
">

{lockedCount} more insights locked

</p>



<p className="
text-xs text-[var(--muted)]
">

Watch 2 ads and use 10 Energy to unlock them

</p>



</div>



</div>


</div>


)}



</div>









{!unlocked && (


<div className="mt-4">


{

showEnergy


?


<AIInsightEnergy />


:


<button
type="button"
onClick={handleUnlock}
className="
flex w-full items-center justify-center
gap-2 rounded-xl bg-slate-950
px-4 py-3 text-xs font-bold
text-white transition hover:bg-slate-800
"
>


<Sparkles size={14}/>


Unlock 3 More Insights · 10 Energy


</button>


}


</div>


)}



</div>


</section>


  );

}