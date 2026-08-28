"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getPortfolioHistory } from "@/app/data/portfolioHistory";
import { formatCurrency } from "@/app/utils/currency";


export default function PortfolioGrowthChart() {


  const [, forceCurrencyUpdate] =
    useState(0);



  useEffect(() => {


    const currencyListener = () => {

      forceCurrencyUpdate(
        value => value + 1
      );

    };


    window.addEventListener(
      "currencyUpdated",
      currencyListener
    );


    return () => {

      window.removeEventListener(
        "currencyUpdated",
        currencyListener
      );

    };


  }, []);





  const history = useMemo(() => {

    try {

      const data =
        getPortfolioHistory();


      return Array.isArray(data)
        ? data
        : [];


    } catch {

      return [];

    }

  }, []);





  const data = useMemo(() => {


    return history.map((item) => ({


      day:
        new Date(item.date)
          .toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          ),


      value:
        Number(item.value) || 0,


    }));


  }, [history]);






  if (data.length === 0) {

    return (

      <div className="
        rounded-3xl
        border border-[var(--border)]
        bg-[var(--card)]
        p-8
        shadow-sm
      ">


<h2
className="
mb-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
  Portfolio Growth
</h2>


<p
className="
mb-6
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>
  Track the growth of your investment portfolio.
</p>


<div
className="
flex
h-64
items-center
justify-center
font-body
text-sm
tracking-tight
text-[var(--muted)]
"
>
          No portfolio history yet.
        </div>


      </div>

    );

  }







  return (

    <div className="
      rounded-3xl
      border border-[var(--border)]
      bg-[var(--card)]
      p-8
      shadow-sm
    ">


<h2
className="
mb-3
font-display
text-3xl
font-medium
tracking-[-0.04em]
text-[var(--foreground)]
"
>
  Portfolio Growth
</h2>


<p
className="
mb-6
font-body
text-sm
leading-relaxed
tracking-tight
text-[var(--muted)]
"
>
  Track the growth of your investment portfolio.
</p>





      <div className="h-80">


        <ResponsiveContainer
          width="100%"
          height="100%"
        >


          <LineChart

            data={data}

            margin={{
              top:20,
              right:20,
              left:10,
              bottom:10,
            }}

          >



            <defs>

              <linearGradient

                id="portfolioGradient"

                x1="0"

                y1="0"

                x2="0"

                y2="1"

              >

                <stop
                  offset="5%"
                  stopColor="#06b6d4"
                  stopOpacity={0.35}
                />


                <stop
                  offset="95%"
                  stopColor="#06b6d4"
                  stopOpacity={0}
                />


              </linearGradient>


            </defs>





            <CartesianGrid

              stroke="var(--border)"

              strokeDasharray="4 4"

              vertical={false}

            />





            <XAxis

              dataKey="day"

              tick={{
                fill:"var(--muted)",
                fontSize:12,
              }}

              tickLine={false}

              axisLine={false}

            />





            <YAxis

              tick={{
                fill:"var(--muted)",
                fontSize:12,
              }}

              tickFormatter={(value) =>
                formatCurrency(
                  Number(value)
                )
              }

              tickLine={false}

              axisLine={false}

              width={80}

            />







            <Tooltip


              contentStyle={{

                borderRadius:"16px",

                border:
                  "1px solid var(--border)",

                backgroundColor:
                  "var(--card)",

                color:
                  "var(--foreground)",

                boxShadow:
                  "0 12px 35px rgba(0,0,0,.15)",

              }}


              formatter={(value) => [

                formatCurrency(
                  Number(value)
                ),

                "Portfolio Value"

              ]}


            />







            <Area

              type="natural"

              dataKey="value"

              stroke="none"

              fill="url(#portfolioGradient)"

            />







            <Line

              type="natural"

              dataKey="value"

              stroke="#06b6d4"

              strokeWidth={4}

              dot={false}

              style={{

                filter:
                  "drop-shadow(0 0 7px rgba(6,182,212,0.55))",

              }}


              activeDot={{

                r:8,

                fill:"#06b6d4",

                stroke:"#ffffff",

                strokeWidth:3,

              }}


              isAnimationActive

              animationDuration={1500}

              animationEasing="ease-out"

            />





          </LineChart>


        </ResponsiveContainer>


      </div>



    </div>

  );

}