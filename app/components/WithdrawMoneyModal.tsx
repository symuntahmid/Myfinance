"use client";

import {
  useState,
  useEffect,
} from "react";

import { X } from "lucide-react";

import {
  Goal,
  withdrawMoneyFromGoal,
} from "@/app/data/goals";

import {
  addTransaction,
} from "@/app/data/transactions";

import {
  formatCurrency,
} from "@/app/utils/currency";


type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};


export default function WithdrawMoneyModal({
  open,
  goal,
  onClose,
}: Props) {


  const [amount,setAmount] =
    useState("");

    

const [, forceCurrencyUpdate] = useState(0);

  if(!open || !goal)
    return null;



  const currentGoal = goal;



  function handleWithdraw(){


    const value =
      Number(amount);



    if(!value || value <= 0){

      alert(
        "Please enter a valid amount."
      );

      return;

    }



    if(value > currentGoal.savedAmount){

      alert(
        "Not enough money in this goal."
      );

      return;

    }



    withdrawMoneyFromGoal(
      currentGoal.id,
      value
    );



    addTransaction({

      id:Date.now(),

      type:"Transfer",

      source:currentGoal.title,

      destination:"Available Cash",

      amount:value,

      date:new Date().toISOString(),

      note:
        `Withdraw from goal: ${currentGoal.title}`,

    });



    setAmount("");

    onClose();

  }





  return (

    <>


      <div
        className="
        fixed
        inset-0
        z-50
        bg-black/50
        backdrop-blur-sm
        "
        onClick={onClose}
      />




      <div
        className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-6
        "
      >


        <div

          onClick={(e)=>
            e.stopPropagation()
          }

          className="
          w-full
          max-w-lg
          rounded-[32px]
          bg-[var(--card)]
          border
          border-[var(--border)]
          shadow-2xl
          "

        >



          <div
            className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--border)]
            px-8
            py-6
            "
          >


            <div>


              <h2
                className="
                text-3xl
                font-bold
                text-[var(--foreground)]
                "
              >
                Withdraw Money
              </h2>



              <p
                className="
                mt-1
                text-[var(--muted)]
                "
              >
                Move money back to Available Cash.
              </p>


            </div>




            <button

              onClick={onClose}

              className="
              rounded-full
              p-2
              hover:bg-[var(--background)]
              "

            >

              <X size={22}/>

            </button>



          </div>






          <div className="p-8">



            <div
              className="
              rounded-2xl
              bg-[var(--background)]
              p-5
              "
            >


              <p
                className="
                text-sm
                text-[var(--muted)]
                "
              >
                Selected Goal
              </p>



              <h3
                className="
                mt-2
                text-2xl
                font-bold
                text-[var(--foreground)]
                "
              >
                {currentGoal.emoji} {currentGoal.title}
              </h3>



              <p
                className="
                mt-2
                text-[var(--muted)]
                "
              >
                Available:{" "}
                {formatCurrency(
                  currentGoal.savedAmount
                )}
              </p>


            </div>






            <input

              type="number"

              value={amount}

              onChange={(e)=>
                setAmount(e.target.value)
              }

              placeholder="Enter amount"

              className="
              mt-6
              w-full
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-4
              text-[var(--foreground)]
              outline-none
              focus:border-cyan-500
              "

            />







            <div
              className="
              mt-8
              flex
              gap-4
              "
            >


              <button

                onClick={onClose}

                className="
                flex-1
                rounded-2xl
                border
                border-[var(--border)]
                py-4
                font-semibold
                text-[var(--foreground)]
                hover:bg-[var(--background)]
                "

              >
                Cancel

              </button>




              <button

                onClick={handleWithdraw}

                className="
                flex-1
                rounded-2xl
                bg-red-600
                py-4
                font-semibold
                text-white
                hover:bg-red-700
                "

              >
                Withdraw

              </button>



            </div>



          </div>



        </div>


      </div>


    </>

  );

}