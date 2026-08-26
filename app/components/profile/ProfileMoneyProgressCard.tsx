"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  Trophy,
  Check,
} from "lucide-react";

import { getPlayer } from "@/app/data/player";


const HISTORY_KEY =
  "myfinance-streak-history";



function getStreakHistory(): string[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }


  try {

    return JSON.parse(
      localStorage.getItem(
        HISTORY_KEY
      ) || "[]"
    );

  } catch {

    return [];

  }

}




function getDateKey(
  date: Date
) {

  return [
    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(2, "0"),

    String(
      date.getDate()
    ).padStart(2, "0"),

  ].join("-");

}




function getWeekDays() {

  const today =
    new Date();


  const day =
    today.getDay();


  const monday =
    new Date(today);


  monday.setDate(
    today.getDate()
    -
    (day === 0 ? 6 : day - 1)
  );



  return Array.from(
    {
      length:7
    },
    (_,index)=>{

      const date =
        new Date(monday);


      date.setDate(
        monday.getDate()
        +
        index
      );


      return {
        name:
          date.toLocaleDateString(
            "en-US",
            {
              weekday:"short"
            }
          ),

        key:
          getDateKey(date),
      };

    }
  );

}





export default function ProfileMoneyProgressCard(){


  const [
    streak,
    setStreak
  ] =
  useState(0);



  const [
    history,
    setHistory
  ] =
  useState<string[]>([]);




  useEffect(()=>{


    const refresh = ()=>{

      const player =
        getPlayer();


      setStreak(
        player.streak
      );


      setHistory(
        getStreakHistory()
      );

    };



    refresh();



    window.addEventListener(
      "player-updated",
      refresh
    );


    window.addEventListener(
      "dailyJourneyUpdated",
      refresh
    );



    return()=>{

      window.removeEventListener(
        "player-updated",
        refresh
      );


      window.removeEventListener(
        "dailyJourneyUpdated",
        refresh
      );

    };


  },[]);




  const weekDays =
    getWeekDays();




  const milestones = [
    {
      days:3,
      title:"3 Day Streak"
    },
    {
      days:7,
      title:"7 Day Streak"
    },
    {
      days:30,
      title:"30 Day Streak"
    },
  ];




  return (

<section
className="
relative
overflow-hidden
rounded-[30px]
border
border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
"
>


<div
className="
absolute
-right-20
-top-20
h-56
w-56
rounded-full
bg-orange-500/10
blur-3xl
"
/>



<div className="relative">


<div
className="
flex
items-center
justify-between
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
rounded-2xl
bg-orange-500/10
p-3
"
>

<Flame
className="
text-orange-500
"
size={32}
/>

</div>




<div>

<p
className="
text-4xl
font-black
text-[var(--foreground)]
"
>
{streak}
</p>


<p
className="
font-semibold
text-[var(--muted)]
"
>
Money Streak
</p>


</div>


</div>





<div
className="
rounded-xl
bg-orange-500/10
px-4
py-2
text-sm
font-bold
text-orange-500
"
>

Keep Going 🔥

</div>


</div>





<p
className="
mt-4
text-sm
text-[var(--muted)]
"
>

Complete your Daily Journey every day to build your streak.

</p>







{/* Weekly Tracker */}

<div
className="
mt-8
flex
justify-between
"
>


{
weekDays.map((day)=>(


<div
key={day.key}
className="
flex
flex-col
items-center
gap-2
"
>


<div
className={`
flex
h-11
w-11
items-center
justify-center
rounded-full
border-2
transition

${
history.includes(day.key)

?

"border-orange-500 bg-orange-500 text-white"

:

"border-[var(--border)] bg-[var(--background)] text-[var(--muted)]"

}

`}
>


{
history.includes(day.key)
&&
<Check size={20}/>
}


</div>



<span
className="
text-xs
font-medium
text-[var(--muted)]
"
>

{day.name}

</span>



</div>


))
}


</div>








{/* Milestones */}

<div
className="
mt-8
grid
grid-cols-3
gap-3
"
>


{
milestones.map((item)=>(


<div
key={item.days}
className={`
rounded-2xl
border
p-3
text-center

${
streak >= item.days

?

"border-orange-400 bg-orange-500/10"

:

"border-[var(--border)] bg-[var(--background)]"

}

`}
>


<Trophy
size={20}
className="
mx-auto
text-yellow-500
"
/>



<p
className="
mt-2
text-sm
font-bold
text-[var(--foreground)]
"
>

{item.days}

</p>



<p
className="
text-xs
text-[var(--muted)]
"
>

Days

</p>



</div>


))
}


</div>



</div>


</section>

  );

}