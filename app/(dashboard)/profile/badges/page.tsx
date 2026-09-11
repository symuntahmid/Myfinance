"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import {
  getBadgeProgress,
} from "@/app/data/badgeProgress";


export default function BadgesPage() {

  const categories = [
    "Points",
    "Saving",
    "Investment",
    "Psychology",
    "Premium",
  ];


  const badgeProgress =
  getBadgeProgress();

  const badges =
  badgeProgress.map(
    (item) => item.badge
  );

  return (

    <div className="mx-auto max-w-4xl pb-10">


{/* HEADER */}

<div
className="
mb-8
flex
items-start
gap-3
"
>

<Link
href="/profile"
className="
flex
h-10
w-10
shrink-0
items-center
justify-center
rounded-xl
border
border-[var(--border)]
bg-[var(--card)]
text-[var(--muted)]
shadow-sm
transition
hover:bg-[var(--background)]
hover:text-[var(--foreground)]
"
>
<ArrowLeft size={18}/>
</Link>


<div>

<h1
className="
font-display
text-4xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
Badges
</h1>


<p
className="
mt-1
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>
Your financial achievements, habits, and milestones.
</p>


</div>


</div>


{/* SUMMARY */}

<div
className="
mb-8
grid
gap-4
sm:grid-cols-3
"
>


<div
className="
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
p-5
shadow-sm
"
>

<p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-[var(--muted)]
"
>
Total Badges
</p>


<p
className="
mt-2
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
{badges.length}
</p>


</div>





<div
className="
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
p-5
shadow-sm
"
>

<p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-[var(--muted)]
"
>
Unlocked
</p>


<p
className="
mt-2
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-emerald-500
"
>
{
  badgeProgress.filter(
    (item) => item.unlocked
  ).length
}
</p>


</div>






<div
className="
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
p-5
shadow-sm
"
>

<p
className="
font-body
text-xs
font-medium
uppercase
tracking-[0.12em]
text-[var(--muted)]
"
>
Premium
</p>


<p
className="
mt-2
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-violet-500
"
>

{
badges.filter(
badge=>badge.premium
).length
}

</p>


</div>


</div>



{/* CATEGORY BUTTONS */}

<div
className="
mb-8
flex
gap-2
overflow-x-auto
pb-1
"
>

{
categories.map(category=>(

<button
key={category}
type="button"
className="
shrink-0
rounded-full
border
border-[var(--border)]
bg-[var(--card)]
px-4
py-2
font-body
text-xs
font-medium
tracking-tight
text-[var(--muted)]
transition
hover:border-cyan-300
hover:bg-cyan-500/10
hover:text-cyan-500
"
>
{category}
</button>

))
}

</div>


  {/* BADGES */}

<div
className="
grid
gap-5
sm:grid-cols-2
lg:grid-cols-3
"
>

{
badgeProgress.map((item)=>{

const badge = item.badge;
const isUnlocked = item.unlocked;


return (

<div
key={badge.id}
className={`
relative
overflow-hidden
rounded-3xl
border
p-5
shadow-sm
transition

${
badge.premium

?

`
border-violet-300
bg-gradient-to-br
from-violet-500/10
via-fuchsia-500/5
to-transparent
`

:

`
border-[var(--border)]
bg-[var(--card)]
`

}

`}
>


{
badge.premium && (

<div
className="
absolute
right-4
top-4
flex
items-center
gap-1
rounded-full
bg-violet-500/10
px-2.5
py-1
font-body
text-[10px]
font-semibold
text-violet-500
"
>

<Sparkles size={11}/>

PREMIUM

</div>

)
}





{/* ICON */}

<div
className={`
flex
h-16
w-16
items-center
justify-center
rounded-2xl
text-3xl

${
badge.premium

?

"bg-violet-500/10"

:

"bg-[var(--background)]"

}

`}
>

{badge.icon}

</div>





<h2
className="
mt-5
font-display
text-lg
font-medium
tracking-[-0.02em]
text-[var(--foreground)]
"
>
{badge.name}
</h2>




<p
className="
mt-1
font-body
text-xs
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>
{badge.description}
</p>





{/* REQUIREMENT */}

<div
className="
mt-5
rounded-2xl
bg-[var(--background)]
p-3
"
>


<p
className="
font-body
text-[10px]
font-semibold
uppercase
tracking-wider
text-[var(--muted)]
"
>
Requirement
</p>


<p
className="
mt-1
font-body
text-xs
font-medium
text-[var(--foreground)]
"
>
{badge.requirement}
</p>


</div>





{/* STATUS */}

<div
className="
mt-4
flex
items-center
gap-2
"
>


{
badge.premium

?

<>

<Lock
size={15}
className="text-violet-500"
/>


<span
className="
font-body
text-xs
font-medium
text-violet-500
"
>
Premium badge
</span>

</>


:

<>

<CheckCircle2
size={15}
className="text-[var(--muted)]"
/>


<span
className="
font-body
text-xs
font-medium
text-[var(--muted)]
"
>
Locked
</span>

</>

}



</div>



</div>

)

})
}


</div>


    </div>

  );

}