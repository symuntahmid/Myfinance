"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  CheckCheck,
  Sparkles,
} from "lucide-react";


import {
  getReminderNotifications,
  ReminderNotification,
} from "@/app/services/transactionScheduler";


import {
  markAllNotificationsRead,
} from "@/app/services/browserNotification";



export default function NotificationBell() {


  const [
    notifications,
    setNotifications
  ] =
  useState<ReminderNotification[]>([]);



  const [
    open,
    setOpen
  ] =
  useState(false);



  const containerRef =
    useRef<HTMLDivElement>(null);





  function refreshNotifications(){

    setNotifications(
      getReminderNotifications()
    );

  }





  useEffect(()=>{


    refreshNotifications();



    window.addEventListener(
      "transactionsUpdated",
      refreshNotifications
    );



    return()=>{

      window.removeEventListener(
        "transactionsUpdated",
        refreshNotifications
      );

    };


  },[]);








  useEffect(()=>{


    function handleClickOutside(
      e:MouseEvent
    ){

      if(
        containerRef.current &&
        !containerRef.current.contains(
          e.target as Node
        )
      ){

        setOpen(false);

      }

    }



    document.addEventListener(
      "mousedown",
      handleClickOutside
    );



    return()=>{

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };


  },[]);







  const unread =
    notifications.length;






  return (

<div
ref={containerRef}
className="
relative
"
>



<button

onClick={()=>{


const next =
!open;


setOpen(next);



if(next){

refreshNotifications();



const latest =
getReminderNotifications();



if(latest.length){

markAllNotificationsRead(
latest.map(
(n)=>n.id
)
);


setNotifications([]);

}

}


}}


className="
relative
flex
h-11
w-11
items-center
justify-center
rounded-2xl
border
border-[var(--border)]
bg-[var(--card)]
text-[var(--foreground)]
shadow-sm
transition
hover:-translate-y-0.5
hover:shadow-lg
"

>


<Bell
size={22}
className="
text-[var(--primary)]
"
/>



{unread > 0 && (

<span
className="
absolute
-right-1
-top-1
flex
h-5
w-5
items-center
justify-center
rounded-full
bg-red-500
text-[10px]
font-black
text-white
ring-2
ring-[var(--card)]
"
>

{unread}

</span>

)}



</button>







{open && (

<div

className="
absolute
right-0
z-50
mt-4
w-96
overflow-hidden
rounded-[28px]
border
border-[var(--border)]
bg-[var(--card)]
shadow-2xl
backdrop-blur-xl
"

>


{/* Header */}


<div

className="
flex
items-center
justify-between
border-b
border-[var(--border)]
px-6
py-5
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
h-10
w-10
items-center
justify-center
rounded-2xl
bg-[var(--primary)]/10
"

>

<Sparkles
size={20}
className="
text-[var(--primary)]
"
/>

</div>



<div>

<h3
className="
font-bold
text-[var(--foreground)]
"
>
Notifications
</h3>


<p
className="
text-xs
text-[var(--muted)]
"
>
Smart CFO updates
</p>


</div>


</div>





{notifications.length > 0 && (

<button

onClick={()=>{

markAllNotificationsRead(
notifications.map(
(n)=>n.id
)
);

setNotifications([]);

}}

className="
flex
items-center
gap-1
rounded-xl
px-3
py-2
text-xs
font-bold
text-[var(--primary)]
transition
hover:bg-[var(--background)]
"

>


<CheckCheck size={14}/>

Clear


</button>

)}



</div>







{notifications.length === 0 ? (


<div

className="
px-6
py-12
text-center
"

>


<div

className="
mx-auto
flex
h-14
w-14
items-center
justify-center
rounded-full
bg-emerald-500/10
"

>

✓

</div>



<p

className="
mt-4
font-bold
text-[var(--foreground)]
"

>

You're all caught up 🎉

</p>



<p

className="
mt-2
text-sm
text-[var(--muted)]
"

>

No reminders today.

</p>


</div>



) : (



<div

className="
max-h-96
overflow-y-auto
"

>


{notifications.map(
(item)=>(


<div

key={item.id}

className="
border-b
border-[var(--border)]
px-6
py-5
transition
hover:bg-[var(--background)]
"

>


<p

className="
font-bold
text-[var(--foreground)]
"

>

{item.title}

</p>



<p

className="
mt-1
text-sm
leading-5
text-[var(--muted)]
"

>

{item.message}

</p>



<p

className="
mt-3
text-xs
text-[var(--muted)]
"

>

{item.date}

</p>


</div>


)

)}


</div>



)}



</div>


)}



</div>

  );

}