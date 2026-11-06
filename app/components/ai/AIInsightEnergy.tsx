"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Play,
  Zap,
  Sparkles,
} from "lucide-react";

import {
  getAIWallet,
  rewardAIAd,
  unlockAIInsights,
} from "@/app/data/aiWallet";


type AIInsightEnergyProps = {
  requiredEnergy?: number;
};



export default function AIInsightEnergy({

  requiredEnergy = 10,

}: AIInsightEnergyProps) {


  const [mounted,setMounted] =
    useState(false);


  const [energy,setEnergy] =
    useState(0);


  const [adsCompleted,setAdsCompleted] =
    useState(0);



  const refresh = () => {

    const wallet =
      getAIWallet();



    setEnergy(
      wallet.credits
    );



    setAdsCompleted(
      wallet.adsWatchedTotal % 2
    );

  };




  useEffect(()=>{


    setMounted(true);


    refresh();



    window.addEventListener(
      "aiWalletUpdated",
      refresh
    );



    return()=>{


      window.removeEventListener(
        "aiWalletUpdated",
        refresh
      );


    };


  },[]);




  if(!mounted){

    return null;

  }





  const canUnlock =
    energy >= requiredEnergy;




  const adsRemaining =
    Math.max(
      2 - adsCompleted,
      0
    );





  const handleWatchAd = () => {

    rewardAIAd();

  };





  const handleUnlock = () => {


    const success =
      unlockAIInsights();



    if(success){

      refresh();

    }


  };





return (

<div className="
mt-4 overflow-hidden rounded-2xl
border border-slate-200
bg-white shadow-sm
">


<div className="p-4">





{/* ENERGY STATUS */}

<div className="
flex items-center justify-between
rounded-xl bg-slate-50
px-3 py-3
">


<div className="
flex items-center gap-2
">


<Zap
size={15}
className="
fill-cyan-400
text-cyan-500
"
/>



<span className="
text-xs font-semibold
text-slate-700
">

Insight Energy

</span>


</div>




<span className="
text-xs font-bold
text-cyan-600
">

{energy} Energy

</span>



</div>







{/* ONLY SHOW ADS WHEN ENERGY IS NOT ENOUGH */}

{!canUnlock && (


<div className="mt-4">


<p className="
text-xs font-bold
text-slate-800
">

Watch 2 reward ads to unlock 3 more insights

</p>




<div className="
mt-2 flex gap-2
">


{[1,2].map((item)=>(


<div
key={item}
className={`
h-2 flex-1 rounded-full
${
item <= adsCompleted
? "bg-cyan-500"
: "bg-slate-200"
}
`}
/>


))}


</div>




<p className="
mt-2 text-[11px]
text-slate-400
">

{adsCompleted}/2 ads completed

</p>


</div>


)}









{/* ACTION BUTTON */}


<div className="mt-4">


{canUnlock ? (



<button
type="button"
onClick={handleUnlock}
className="
flex w-full items-center
justify-center gap-2
rounded-xl bg-emerald-600
px-4 py-3 text-xs
font-bold text-white
hover:bg-emerald-700
"
>


<Sparkles size={14}/>


Unlock 3 More Insights · 10 Energy


</button>



) : (



<button
type="button"
onClick={handleWatchAd}
className="
flex w-full items-center
justify-center gap-2
rounded-xl bg-slate-950
px-4 py-3 text-xs
font-bold text-white
"
>


<Play
size={14}
className="fill-white"
/>



Watch Reward Ad




<span className="
rounded-full bg-white/10
px-2 py-0.5 text-[10px]
text-cyan-300
">

+5 Energy

</span>



</button>



)}



</div>








{!canUnlock && (


<p className="
mt-3 text-center
text-[10px]
text-slate-400
">


{adsRemaining > 0

?

`${adsRemaining} more ad${adsRemaining > 1 ? "s" : ""} needed`

:

"You have enough Energy"

}



</p>


)}




</div>


</div>

);

}