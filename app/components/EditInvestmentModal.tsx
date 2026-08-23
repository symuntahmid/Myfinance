"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  Investment,
  InvestmentType,
  updateInvestment,
} from "@/app/data/investments";


type Props = {
  open: boolean;
  investment: Investment | null;
  onClose: () => void;
};


const types: InvestmentType[] = [
  "Stocks",
  "Crypto",
  "Gold",
  "Real Estate",
  "Mutual Fund",
  "ETF",
  "Bonds",
  "Savings",
  "Fixed Deposit (FDR)",
  "Business",
  "Retirement",
  "Other",
];


export default function EditInvestmentModal({
  open,
  investment,
  onClose,
}: Props) {


  const [name, setName] = useState("");
  const [type, setType] =
    useState<InvestmentType>("Stocks");

  const [investedAmount, setInvestedAmount] =
    useState("");

  const [currentValue, setCurrentValue] =
    useState("");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [notes, setNotes] =
    useState("");



  useEffect(() => {

    if (!investment) return;


    setName(investment.name);
    setType(investment.type);

    setInvestedAmount(
      String(investment.investedAmount)
    );

    setCurrentValue(
      String(investment.currentValue)
    );

    setPurchaseDate(
      investment.purchaseDate
    );

    setNotes(
      investment.notes ?? ""
    );


  }, [investment]);




  function resetForm(){

    setName("");
    setType("Stocks");
    setInvestedAmount("");
    setCurrentValue("");
    setPurchaseDate("");
    setNotes("");

  }




  function closeModal(){

    resetForm();
    onClose();

  }




  function handleSave(){


    if(!investment)
      return;


    updateInvestment({

      id: investment.id,

      name: name.trim(),

      type,

      investedAmount:
        Number(investedAmount) || 0,

      currentValue:
        Number(currentValue) || 0,

      purchaseDate,

      notes: notes.trim(),

    });


    closeModal();

  }




  if(!open || !investment)
    return null;




  return (

<>

<div
className="
fixed inset-0 z-50
bg-black/40
backdrop-blur-sm
"
onClick={closeModal}
/>



<div
className="
fixed inset-0 z-50
flex items-center justify-center
p-6
"
>


<div

onClick={(e)=>e.stopPropagation()}

className="
w-full
max-w-xl
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
shadow-2xl
overflow-hidden
"

>


{/* Header */}

<div className="
flex items-center justify-between
border-b border-[var(--border)]
px-8 py-6
">


<h2 className="
text-3xl
font-bold
text-[var(--foreground)]
">

Edit Investment

</h2>


<button
onClick={closeModal}
className="
rounded-full
p-2
hover:bg-slate-100
"
>

<X />

</button>


</div>





{/* Form */}

<div className="
space-y-5
p-8
">


<input

value={name}

onChange={(e)=>
setName(e.target.value)
}

placeholder="Investment Name"

className="
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
focus:border-cyan-500
"

/>



<select

value={type}

onChange={(e)=>
setType(
e.target.value as InvestmentType
)
}

className="
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
"

>

{
types.map((item)=>(

<option key={item}>
{item}
</option>

))
}

</select>




<input

type="number"

value={investedAmount}

onChange={(e)=>
setInvestedAmount(e.target.value)
}

placeholder="Invested Amount"

className="
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
"

/>




<input

type="number"

value={currentValue}

onChange={(e)=>
setCurrentValue(e.target.value)
}

placeholder="Current Value"

className="
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
"

/>




<input

type="date"

value={purchaseDate}

onChange={(e)=>
setPurchaseDate(e.target.value)
}

className="
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
"

/>




<textarea

value={notes}

onChange={(e)=>
setNotes(e.target.value)
}

placeholder="Notes"

className="
h-28
w-full
rounded-xl
border border-[var(--border)]
bg-transparent
p-4
outline-none
"

/>





<div className="
flex
gap-4
pt-4
">


<button

onClick={closeModal}

className="
flex-1
rounded-2xl
border border-[var(--border)]
py-4
font-semibold
"

>

Cancel

</button>




<button

onClick={handleSave}

className="
flex-1
rounded-2xl
bg-cyan-600
py-4
font-semibold
text-white
transition
hover:bg-cyan-700
"

>

Save Changes

</button>



</div>



</div>


</div>


</div>


</>

  );

}