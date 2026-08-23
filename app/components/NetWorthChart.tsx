"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  getSummary,
} from "../data/transactions";



function CustomTooltip({
  active,
  payload,
  label,
}: any) {


  if(
    !active ||
    !payload ||
    !payload.length
  ){

    return null;

  }



  return (

    <div
      className="
      rounded-2xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      px-5
      py-4
      shadow-xl
      "
    >


      <p className="
      text-sm
      text-[var(--muted)]
      ">
        {label}
      </p>



      <p className="
      mt-2
      text-xl
      font-bold
      text-[var(--foreground)]
      ">
        ${payload[0].value.toLocaleString()}
      </p>



      <p className="
      mt-1
      text-sm
      font-semibold
      text-green-600
      ">
        ▲ Net Worth
      </p>


    </div>

  );

}





export default function NetWorthChart() {


  const [summary,setSummary] =
    useState(
      getSummary()
    );



  useEffect(()=>{


    function refreshSummary(){

      setSummary(
        getSummary()
      );

    }



    refreshSummary();



    window.addEventListener(
      "transactionsUpdated",
      refreshSummary
    );


    window.addEventListener(
      "investmentsUpdated",
      refreshSummary
    );



    return ()=>{


      window.removeEventListener(
        "transactionsUpdated",
        refreshSummary
      );


      window.removeEventListener(
        "investmentsUpdated",
        refreshSummary
      );


    };


  },[]);





  const netWorth =
    summary.netWorth;



  const data = [

    {
      month:"Jan",
      value:netWorth * 0.45
    },

    {
      month:"Feb",
      value:netWorth * 0.55
    },

    {
      month:"Mar",
      value:netWorth * 0.63
    },

    {
      month:"Apr",
      value:netWorth * 0.72
    },

    {
      month:"May",
      value:netWorth * 0.82
    },

    {
      month:"Jun",
      value:netWorth * 0.93
    },

    {
      month:"Jul",
      value:netWorth
    },

  ];





  return (

    <div
      className="
      mt-8
      rounded-3xl
      border
      border-[var(--border)]
      bg-[var(--card)]
      p-8
      shadow-sm
      "
    >



      <div className="
      mb-8
      flex
      items-center
      justify-between
      ">


        <div>


          <p className="
          text-sm
          font-semibold
          uppercase
          tracking-wide
          text-[var(--muted)]
          ">
            Net Worth Trend
          </p>



          <h2 className="
          mt-2
          text-4xl
          font-bold
          text-[var(--foreground)]
          ">
            ${summary.netWorth.toLocaleString()}
          </h2>



          <p className="
          mt-2
          font-semibold
          text-green-600
          ">
            ▲ Growing steadily
          </p>


        </div>


      </div>





      <div className="h-80">


        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>


            <defs>

              <linearGradient
                id="netWorth"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#14b8a6"
                  stopOpacity={0.35}
                />


                <stop
                  offset="95%"
                  stopColor="#14b8a6"
                  stopOpacity={0}
                />


              </linearGradient>


            </defs>





            <CartesianGrid

              strokeDasharray="3 3"

              vertical={false}

              stroke="currentColor"

              opacity={0.15}

            />





            <XAxis

              dataKey="month"

              tickLine={false}

              axisLine={false}

              tick={{
                fill:"var(--muted)"
              }}

            />





            <YAxis

              tickLine={false}

              axisLine={false}

              tick={{
                fill:"var(--muted)"
              }}

            />





            <Tooltip

              content={
                <CustomTooltip />
              }

              cursor={{
                stroke:"#14b8a6",
                strokeDasharray:"4 4",
              }}

            />





            <Area

              type="monotone"

              dataKey="value"

              stroke="#14b8a6"

              strokeWidth={4}

              fill="url(#netWorth)"

              dot={{
                r:5,
                strokeWidth:2,
                fill:"#14b8a6",
              }}

            />



          </AreaChart>


        </ResponsiveContainer>


      </div>


    </div>

  );

}