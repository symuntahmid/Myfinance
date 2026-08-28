"use client";
import { formatCurrency } from "@/app/utils/currency";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

import {
  getTransactions,
  Transaction,
} from "@/app/data/transactions";


type Range = "7D" | "30D" | "6M" | "1Y";


type ChartItem = {
  label: string;
  key: string;
  income: number;
  expense: number;
  savings: number;
};



function CustomTooltip({
  active,
  payload,
  label,
}: any) {

  if (!active || !payload?.length)
    return null;


  return (
    <div className="
      rounded-3xl
      border border-[var(--border)]
      bg-[var(--card)]
      p-4
sm:p-5
      shadow-xl
    ">

<p
className="
mb-3
font-display
text-lg
font-medium
tracking-[-0.02em]
text-[var(--foreground)]
"
>
{label}
</p>


<p
className="
font-body
text-sm
font-medium
tracking-tight
text-green-600
"
>
  Income:{" "}
  {formatCurrency(
    Number(payload[0]?.value || 0)
  )}
</p>


<p
className="
font-body
text-sm
font-medium
tracking-tight
text-red-500
"
>
  Expense:{" "}
  {formatCurrency(
    Number(payload[1]?.value || 0)
  )}
</p>


<p
className="
font-body
text-sm
font-medium
tracking-tight
text-cyan-600
"
>
  Savings:{" "}
  {formatCurrency(
    Number(payload[2]?.value || 0)
  )}
</p>


    </div>
  );

}





export default function MoneyTrendChart() {


  const [range,setRange] =
    useState<Range>("6M");


  const [transactions,setTransactions] =
    useState<Transaction[]>([]);

const [, forceCurrencyUpdate] = useState(0);


  useEffect(()=>{

  const currencyListener = () => {
    forceCurrencyUpdate(
      value => value + 1
    );
  };


  window.addEventListener(
    "currencyUpdated",
    currencyListener
  );


  const refresh = () => {

    const data =
      getTransactions();


    setTransactions(
      Array.isArray(data)
      ? data.filter(Boolean)
      : []
    );

  };


  refresh();


  window.addEventListener(
    "transactionsUpdated",
    refresh
  );


  window.addEventListener(
    "investmentsUpdated",
    refresh
  );


  return()=>{


    window.removeEventListener(
      "transactionsUpdated",
      refresh
    );


    window.removeEventListener(
      "investmentsUpdated",
      refresh
    );


    window.removeEventListener(
      "currencyUpdated",
      currencyListener
    );


  };


},[]);


  const data =
    useMemo(()=>{


      const now =
        new Date();


      // 7D and 30D daily view

      if(
        range==="7D" ||
        range==="30D"
      ){


        const totalDays =
          range==="30D"
          ? 30
          : 7;

        const days:ChartItem[] = [];



        for(
          let i=totalDays-1;
          i>=0;
          i--
        ){


          const date =
            new Date(now);


          date.setDate(
            now.getDate()-i
          );



          days.push({

            label:
              range==="30D"
              ?
              date.toLocaleDateString(
                "en-US",
                {
                  day:"numeric",
                  month:"short",
                }
              )
              :
              date.toLocaleDateString(
                "en-US",
                {
                  weekday:"short",
                }
              ),


            key:
              date.toDateString(),


            income:0,

            expense:0,

            savings:0,

          });


        }

        transactions.forEach((t)=>{


          const date =
            new Date(t.date)
            .toDateString();



          const item =
            days.find(
              d=>d.key===date
            );



          if(!item)
            return;



          if(t.type==="Income")
            item.income += t.amount;



          if(t.type==="Expense")
            item.expense += t.amount;



        });




        return days.map(d=>({

          ...d,

          savings:
            d.income-d.expense,

        }));


      }





      // 6M and 1Y monthly view


      const months:ChartItem[]=[];



      const totalMonths =
        range==="1Y"
        ? 12
        : 6;




      for(
        let i=totalMonths-1;
        i>=0;
        i--
      ){


        const date =
          new Date(
            now.getFullYear(),
            now.getMonth()-i,
            1
          );



        months.push({

          label:
            date.toLocaleDateString(
              "en-US",
              {
                month:"short",
              }
            ),


          key:
            `${date.getFullYear()}-${date.getMonth()}`,



          income:0,

          expense:0,

          savings:0,

        });


      }
      transactions.forEach((t)=>{


        const date =
          new Date(t.date);



        const item =
          months.find(
            m =>
            m.key ===
            `${date.getFullYear()}-${date.getMonth()}`
          );



        if(!item)
          return;



        if(t.type==="Income")
          item.income += t.amount;



        if(t.type==="Expense")
          item.expense += t.amount;



      });




      return months.map(m=>({

        ...m,

        savings:
          m.income-m.expense,

      }));



    },[
      transactions,
      range
    ]);

  return (

<div
className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-4
sm:p-5
sm:p-8
shadow-xl
"
>



<div className="
mb-6
flex
flex-wrap
items-center
justify-between
gap-4
">


<h2
className="
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
Financial Trend
</h2>




<div
className="
flex
flex-wrap
gap-1
rounded-full
bg-[var(--background)]
p-1
"
>


{
(["7D","30D","6M","1Y"] as Range[])
.map(item=>(


<button
key={item}
onClick={()=>setRange(item)}
className={`
rounded-full
px-3
py-2
font-body
text-xs
font-medium
uppercase
tracking-[0.08em]
transition
${
range===item
?
"bg-[var(--primary)] text-white"
:
"text-[var(--muted)] hover:bg-[var(--card)]"
}
`}
>

{item}

</button>


))
}


</div>


</div>


<div
className="
h-[300px]
sm:h-[380px]
"
>


<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart
data={data}
margin={{
top:20,
right:20,
left:0,
bottom:10,
}}
>


<XAxis
dataKey="label"
tickLine={false}
axisLine={false}
tick={{
fill:"var(--muted)",
fontSize:13,
fontWeight:500,
}}
/>




<Tooltip
content={<CustomTooltip />}
cursor={{
stroke:"#cbd5e1",
strokeWidth:2,
strokeDasharray:"5 5",
}}
/>



<Line
  type="monotone"
  dataKey="income"
  stroke="#22c55e"
  strokeWidth={4}
  dot={false}
  animationDuration={1000}
  style={{
    filter:
      "drop-shadow(0 0 6px rgba(34,197,94,0.45))",
  }}
/>


<Line
  type="monotone"
  dataKey="expense"
  stroke="#ef4444"
  strokeWidth={4}
  dot={false}
  animationDuration={1000}
  style={{
    filter:
      "drop-shadow(0 0 6px rgba(239,68,68,0.45))",
  }}
/>


<Line
  type="monotone"
  dataKey="savings"
  stroke="#06b6d4"
  strokeWidth={4}
  dot={false}
  animationDuration={1000}
  style={{
    filter:
      "drop-shadow(0 0 7px rgba(6,182,212,0.55))",
  }}
/>




</LineChart>


</ResponsiveContainer>


</div>



</div>


  );

}