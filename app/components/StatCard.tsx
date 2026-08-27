type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};


export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {


  const getTheme = () => {

    if(title === "Net Worth") {

      return {
        icon:
          "bg-cyan-500/10 text-cyan-500",
        glow:
          "from-cyan-500/10",
        label:
          "Financial foundation",
      };

    }


    if(title === "Monthly Income") {

      return {
        icon:
          "bg-emerald-500/10 text-emerald-500",
        glow:
          "from-emerald-500/10",
        label:
          "Money coming in",
      };

    }


    if(title === "Expenses") {

      return {
        icon:
          "bg-rose-500/10 text-rose-500",
        glow:
          "from-rose-500/10",
        label:
          "Money awareness",
      };

    }


    if(title === "Investments") {

      return {
        icon:
          "bg-violet-500/10 text-violet-500",
        glow:
          "from-violet-500/10",
        label:
          "Future wealth",
      };

    }


    return {
      icon:
        "bg-[var(--primary)]/10 text-[var(--primary)]",
      glow:
        "from-[var(--primary)]/10",
      label:
        "Financial progress",
    };

  };



  const theme = getTheme();



  return (

<div
className="
group
relative
overflow-hidden
rounded-[28px]
border
border-[var(--border)]
bg-[var(--card)]
p-5
shadow-sm
transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
"
>


{/* Background Glow */}

<div
className={`
pointer-events-none
absolute
-right-10
-top-10
h-32
w-32
rounded-full
bg-gradient-to-br
${theme.glow}
to-transparent
blur-3xl
`}
/>




<div
className="
relative
flex
items-start
justify-between
gap-4
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
{title}
</p>



<h2
className="
mt-3
font-display
text-4xl
font-medium
tracking-[-0.055em]
leading-none
text-[var(--foreground)]
sm:text-5xl
"
>
{value}
</h2>



<p
className="
mt-3
font-body
text-xs
font-normal
tracking-[-0.015em]
text-[var(--muted)]
"
>
{theme.label}
</p>


</div>




<div
className={`
flex
h-12
w-12
shrink-0
items-center
justify-center
rounded-2xl
${theme.icon}
transition-transform
duration-300
group-hover:scale-110
`}
>

{icon}

</div>



</div>



</div>


  );

}