"use client";

import Image from "next/image";

import {
  CheckCircle2,
  Rocket,
  User,
  Sparkles,
} from "lucide-react";

import {
  getPlayer,
  getLevel,
} from "@/app/data/player";

import {
  getProfile,
} from "@/app/data/profile";

import {
  useEffect,
  useState,
} from "react";


type Props = {
  compact?: boolean;
};



export default function ProfileCard({
  compact = false,
}: Props) {


  const [mounted,setMounted] =
    useState(false);


  const [avatarError,setAvatarError] =
    useState(false);



  const [player,setPlayer] =
    useState<ReturnType<typeof getPlayer>|null>(null);


  const [level,setLevel] =
    useState<ReturnType<typeof getLevel>|null>(null);



  const [profile,setProfile] =
    useState(getProfile());




  useEffect(()=>{


    setMounted(true);



    const refresh=()=>{

      setPlayer(getPlayer());

      setLevel(getLevel());

      setProfile(getProfile());

    };


    refresh();



    window.addEventListener(
      "player-updated",
      refresh
    );


    window.addEventListener(
      "profileUpdated",
      refresh
    );



    return()=>{

      window.removeEventListener(
        "player-updated",
        refresh
      );


      window.removeEventListener(
        "profileUpdated",
        refresh
      );

    };


  },[]);




  if(
    !mounted ||
    !player ||
    !level
  ){

    return(
      <section
      className="
      h-72
      rounded-[28px]
      bg-[var(--card)]
      animate-pulse
      "
      />
    );

  }




  const progress =
    Math.min(
      Math.max(level.percent,0),
      100
    );



  const name =
    profile.displayName ||
    `${profile.firstName} ${profile.lastName}`.trim() ||
    player.name;



return(


<section
className="
relative
overflow-hidden
rounded-[32px]
border
border-[var(--border)]
bg-[var(--card)]
p-6
shadow-[var(--shadow-soft)]
"
>



{/* subtle AI glow */}

<div
className="
absolute
-right-20
-top-20
h-48
w-48
rounded-full
bg-cyan-400/10
blur-3xl
"
/>



<div className="relative">



{/* identity */}


<div
className="
flex
items-center
gap-5
"
>


<div
className="
relative
h-16
w-16
shrink-0
overflow-hidden
rounded-full
border-2
border-[var(--border)]
bg-gradient-to-br
from-cyan-400
to-teal-400
"
>


{
!avatarError ?


<Image

src="/images/quokka/quokka-profile.png"

alt="Profile"

fill

sizes="64px"

className="object-cover"

onError={()=>
setAvatarError(true)
}

/>


:


<div
className="
flex
h-full
items-center
justify-center
text-white
"
>

<User size={24}/>

</div>


}



</div>





<div
className="
min-w-0
"
>


<div
className="
flex
items-center
gap-2
"
>


<h2
className="
font-premium
truncate
text-2xl
text-[var(--foreground)]
"
>

{name}

</h2>


<CheckCircle2
size={17}
className="
fill-cyan-500
text-white
"
/>


</div>



{
profile.username &&
<p
className="
mt-1
text-sm
text-[var(--muted)]
"
>
@{profile.username}
</p>
}




</div>


</div>







{/* Level */}


<div
className="
mt-7
rounded-3xl
bg-[var(--background)]
p-5
"
>


<div
className="
flex
items-center
justify-between
"
>


<div>

<p
className="
text-xs
uppercase
tracking-wider
text-[var(--muted)]
"
>
Financial Level
</p>


<p
className="
mt-1
text-xl
font-semibold
text-[var(--foreground)]
"
>

Level {level.level}

</p>


</div>




<span
className="
rounded-full
bg-cyan-500/10
px-3
py-1.5
text-xs
font-semibold
text-cyan-600
dark:text-cyan-400
"
>

{level.currentXP}
/
{level.nextLevelXP}
XP

</span>



</div>






<div
className="
mt-5
h-2
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
to-teal-400
transition-all
duration-700
"

style={{
width:`${progress}%`
}}

/>

</div>




<div
className="
mt-3
flex
justify-between
text-xs
text-[var(--muted)]
"
>

<span>
Building financial confidence
</span>


<span>
{Math.round(progress)}%
</span>


</div>


</div>








{/* Motivation */}


{
!compact &&

<div
className="
mt-5
flex
items-start
gap-3
rounded-2xl
border
border-cyan-500/20
bg-cyan-500/5
p-4
"
>


<Sparkles
size={18}
className="
mt-0.5
text-cyan-500
"
/>


<p
className="
text-sm
leading-6
text-[var(--foreground)]
"
>

You are building a stronger money system.
Small actions create long-term wealth.

</p>


</div>


}



</div>


</section>


);


}