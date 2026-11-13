import { t } from "@/app/data/i18n";

type StatCardProps = {
  title: string;
  kind: "net" | "income" | "expense" | "invest";
  value: string;
  icon: React.ReactNode;
};


export default function StatCard({
  title,
  kind,
  value,
  icon,
}: StatCardProps) {


  const getTheme = () => {

    if(kind === "net") {

      return {
        icon:
          "bg-[var(--primary)]/10 text-[var(--primary)]",
        glow:
          "from-[var(--primary)]/10",
        label:
          t("statNet"),
      };

    }


    if(kind === "income") {

      return {
        icon:
          "bg-emerald-500/10 text-emerald-500",
        glow:
          "from-emerald-500/10",
        label:
          t("statIncome"),
      };

    }


    if(kind === "expense") {

      return {
        icon:
          "bg-[var(--sun)]/10 text-[var(--sun)]",
        glow:
          "from-[var(--sun)]/10",
        label:
          t("statExpense"),
      };

    }


    if(kind === "invest") {

      return {
        icon:
          "bg-[var(--gold)]/15 text-[var(--gold)]",
        glow:
          "from-[var(--gold)]/15",
        label:
          t("statInvest"),
      };

    }


    return {
      icon:
        "bg-[var(--primary)]/10 text-[var(--primary)]",
      glow:
        "from-[var(--primary)]/10",
      label:
        t("statNet"),
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
text-[var(--muted)]
"
>
{title}
</p>



<h2
className="
mt-3
font-display
text-[28px]
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