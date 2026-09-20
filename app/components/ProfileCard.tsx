"use client";

import Image from "next/image";

import {
  t,
} from "@/app/data/i18n";


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
    useState<ReturnType<typeof getPlayer>|null>(
      null
    );



  const [level,setLevel] =
    useState<ReturnType<typeof getLevel>|null>(
      null
    );



  const [profile,setProfile] =
    useState(
      getProfile()
    );



  /*
    Force component refresh
    when language changes
  */

  const [,refreshLanguage] =
    useState(0);





  useEffect(()=>{


    setMounted(true);



    const refresh = () => {


      setPlayer(
        getPlayer()
      );


      setLevel(
        getLevel()
      );


      setProfile(
        getProfile()
      );


    };



    const handleLanguageUpdate = () => {


      refreshLanguage(
        value => value + 1
      );


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



    window.addEventListener(
      "languageUpdated",
      handleLanguageUpdate
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



      window.removeEventListener(
        "languageUpdated",
        handleLanguageUpdate
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
bg-[var(--primary)]/10
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
from-[var(--primary)]
to-[var(--secondary)]
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
font-display
truncate
text-3xl
font-medium
tracking-[-0.05em]
leading-tight
text-[var(--foreground)]
"
>
{name}
</h2>


<CheckCircle2
size={17}
className="
fill-[var(--primary)]
text-white
"
/>


</div>



{
profile.username &&
<p
className="
mt-1
font-body
text-sm
tracking-[-0.015em]
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
font-body
text-xs
font-medium
uppercase
tracking-[0.14em]
text-[var(--muted)]
"
>
{t("financialLevel")}
</p>


<p
className="
mt-1
font-display
text-2xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
Level {level.level}
</p>


</div>




<span
className="
rounded-full
bg-[var(--primary)]/10
px-3
py-1.5
font-body
text-xs
font-medium
tracking-tight
text-[var(--primary)]
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
from-[var(--primary)]
to-[var(--secondary)]
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
font-body
text-xs
tracking-[-0.015em]
text-[var(--muted)]
"
>

<span>
{t("buildingFinancialConfidence")}
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
border-[var(--primary)]/20
bg-[var(--primary)]/5
p-4
"
>


<Sparkles
size={18}
className="
mt-0.5
text-[var(--primary)]
"
/>


<p
className="
font-body
text-sm
leading-6
tracking-[-0.015em]
text-[var(--foreground)]
"
>

{t("moneySystemMessage")}

</p>


</div>


}



</div>


</section>


);


}