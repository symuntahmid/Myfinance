"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
} from "lucide-react";

import {
  getDailyTasks,
  getJourneyProgress,
} from "../data/dailyJourney";

import { unlockAchievement } from "../data/achievements";

export default function DailyJourneyCard() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const updateJourney = () => {
      const progress = getJourneyProgress();

      if (
        progress.total > 0 &&
        progress.completed >= progress.total
      ) {
        unlockAchievement(3);
      }

      forceUpdate((n) => n + 1);
    };

    updateJourney();

    window.addEventListener(
      "dailyJourneyUpdated",
      updateJourney
    );

    window.addEventListener(
      "player-updated",
      updateJourney
    );

    window.addEventListener(
      "transactionsUpdated",
      updateJourney
    );

    return () => {
      window.removeEventListener(
        "dailyJourneyUpdated",
        updateJourney
      );

      window.removeEventListener(
        "player-updated",
        updateJourney
      );

      window.removeEventListener(
        "transactionsUpdated",
        updateJourney
      );
    };
  }, []);

  const tasks = getDailyTasks();
  const progress = getJourneyProgress();

  return (
<section
className="
relative
overflow-hidden
rounded-[32px]
bg-gradient-to-br
from-orange-500
via-orange-400
to-amber-400
p-5
text-white
shadow-xl
shadow-orange-500/20
sm:p-7
"
>


{/* Glow */}

<div
className="
absolute
-right-16
-top-16
h-48
w-48
rounded-full
bg-white/20
blur-3xl
"
/>



<div className="relative">


{/* Header */}

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
bg-white/20
backdrop-blur
"
>

<Flame size={26}/>

</div>


<div>

<p
className="
text-xs
font-semibold
uppercase
tracking-wider
text-white/80
"
>
Daily Journey
</p>


<h2
className="
font-display
text-2xl
font-medium
leading-tight
tracking-tight
sm:text-3xl
"
>
Build Better Money Habits
</h2>


</div>


</div>






{/* Progress */}

<div className="mt-7">


<div
className="
mb-3
flex
justify-between
text-sm
font-semibold
"
>

<span>
Progress
</span>


<span>
{progress.completed}/{progress.total}
</span>


</div>



<div
className="
h-3
overflow-hidden
rounded-full
bg-white/30
"
>

<div

className="
h-full
rounded-full
bg-white
transition-all
duration-700
"

style={{
width:`${progress.percent}%`
}}

/>

</div>


</div>








{/* Tasks */}

<div
className="
mt-6
space-y-3
"
>


{tasks.map((task)=>(


<div

key={task.id}

className="
flex
items-center
justify-between
gap-3
rounded-2xl
bg-black/10
p-4
backdrop-blur-sm
transition
hover:bg-black/20
"

>


<div
className="
flex
min-w-0
items-center
gap-3
"
>


{
task.completed

?

<CheckCircle2
size={22}
className="text-emerald-300"
/>

:

<Circle
size={22}
className="text-white/60"
/>

}



<div>


<p
className="
text-sm
font-semibold
tracking-tight
sm:text-base
"
>
{task.title}
</p>



<p
className="
text-xs
text-white/80
"
>
+{task.reward} XP
</p>


</div>


</div>






{
task.completed

?

<span
className="
shrink-0
rounded-xl
bg-emerald-400/20
px-3
py-2
text-xs
font-bold
text-emerald-100
"
>
✓ Done
</span>


:

<span
className="
hidden
rounded-xl
bg-white/10
px-3
py-2
text-xs
text-white/70
sm:block
"
>
Complete
</span>


}


</div>


))}



</div>








{/* Completed */}

{
progress.completed === progress.total &&
progress.total > 0 && (


<div

className="
mt-6
rounded-2xl
bg-white/20
p-5
backdrop-blur
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
rounded-full
bg-white/20
p-3
"
>

<Trophy size={24}/>

</div>



<div>


<h3
className="
font-display
text-xl
font-medium
tracking-tight
"
>
Daily Journey Complete!
</h3>


<p
className="
text-sm
text-white/90
"
>
🎉 +45 XP earned. Your money habits are improving.
</p>


</div>



</div>


</div>


)


}


</div>


</section>
);
}