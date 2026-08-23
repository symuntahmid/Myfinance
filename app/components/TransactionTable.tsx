"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import EditTransactionModal from "./EditTransactionModal";

import {
  getTransactions,
  saveTransactions,
  Transaction,
} from "../data/transactions";

import { formatCurrency } from "@/app/utils/currency";


export default function TransactionTable() {


  const [transactions,setTransactions] =
    useState<Transaction[]>([]);


  const [search,setSearch] =
    useState("");


  const [filter,setFilter] =
    useState<
      "All" | "Income" | "Expense" | "Investment"
    >("All");



  const [isEditOpen,setIsEditOpen] =
    useState(false);


  const [selectedTransaction,setSelectedTransaction] =
    useState<Transaction | null>(null);



  const [currencyRefresh,setCurrencyRefresh] =
    useState(0);



  useEffect(()=>{


    function refreshTransactions(){

      setTransactions(
        getTransactions()
      );

    }



    refreshTransactions();



    window.addEventListener(
      "transactionsUpdated",
      refreshTransactions
    );


    window.addEventListener(
      "currencyUpdated",
      ()=>{
        setCurrencyRefresh(
          value=>value+1
        );
      }
    );



    return()=>{


      window.removeEventListener(
        "transactionsUpdated",
        refreshTransactions
      );


    };


  },[]);




  function deleteTransaction(id:number){


    const updatedTransactions =
      getTransactions().filter(
        (transaction)=>
          transaction.id !== id
      );


    saveTransactions(
      updatedTransactions
    );


    setTransactions(
      updatedTransactions
    );


    window.dispatchEvent(
      new Event(
        "transactionsUpdated"
      )
    );

  }





  return (

    <>


<div className="
mt-10
rounded-2xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">



<div className="
mb-5
flex
items-center
justify-between
">


<h2 className="
text-2xl
font-bold
text-[var(--foreground)]
">
Recent Transactions
</h2>




<div className="
flex
items-center
gap-3
">


<button
onClick={()=>setFilter("All")}
className={`rounded-full px-4 py-2 font-medium transition ${
filter==="All"
?
"bg-[var(--primary)] text-white"
:
"bg-[var(--background)] text-[var(--foreground)]"
}`}
>
All
</button>


<button
onClick={()=>setFilter("Income")}
className={`rounded-full px-4 py-2 font-medium transition ${
filter==="Income"
?
"bg-green-500 text-white"
:
"bg-green-100 text-green-700"
}`}
>
Income
</button>


<button
onClick={()=>setFilter("Expense")}
className={`rounded-full px-4 py-2 font-medium transition ${
filter==="Expense"
?
"bg-red-500 text-white"
:
"bg-red-100 text-red-700"
}`}
>
Expense
</button>


<button
onClick={()=>setFilter("Investment")}
className={`rounded-full px-4 py-2 font-medium transition ${
filter==="Investment"
?
"bg-blue-500 text-white"
:
"bg-blue-100 text-blue-700"
}`}
>
Investment
</button>




<input
type="text"
placeholder="Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
w-56
rounded-xl
border border-[var(--border)]
bg-[var(--background)]
p-2
text-[var(--foreground)]
outline-none
focus:border-[var(--primary)]
"
/>



</div>


</div>





<table className="w-full">


<thead>

<tr className="
border-b border-[var(--border)]
">


<th className="
py-3
text-left
text-[var(--muted)]
">
Type
</th>


<th className="
py-3
text-left
text-[var(--muted)]
">
Source
</th>


<th className="
py-3
text-left
text-[var(--muted)]
">
Category
</th>


<th className="
py-3
text-left
text-[var(--muted)]
">
Amount
</th>


<th className="
py-3
text-center
text-[var(--muted)]
">
Actions
</th>


</tr>

</thead>





<tbody>


{
transactions
.filter((transaction)=>{


const query =
search.toLowerCase();


const matchesSearch =
transaction.source
.toLowerCase()
.includes(query)
||
(transaction.category ?? "")
.toLowerCase()
.includes(query);



const matchesFilter =
filter==="All"
||
transaction.type===filter;



return (
matchesSearch &&
matchesFilter
);


})


.map((transaction)=>(


<tr
key={transaction.id}
className="
border-b
border-[var(--border)]
last:border-0
"
>


<td className="py-3">


<span
className={`rounded-full px-3 py-1 text-sm font-semibold ${
transaction.type==="Income"
?
"bg-green-100 text-green-700"
:
transaction.type==="Expense"
?
"bg-red-100 text-red-700"
:
"bg-blue-100 text-blue-700"
}`}
>

{transaction.type}

</span>


</td>





<td className="
py-3
text-[var(--foreground)]
">
{transaction.source}
</td>





<td className="
py-3
text-[var(--muted)]
">
{transaction.category || "-"}
</td>





<td className="
py-3
font-semibold
text-[var(--foreground)]
">

{formatCurrency(transaction.amount)}

</td>





<td className="py-3">


<div className="
flex
justify-center
gap-2
">


<button
onClick={()=>{

setSelectedTransaction(transaction);

setIsEditOpen(true);

}}
className="
rounded-lg
bg-blue-500
p-2
text-white
transition
hover:bg-blue-600
"
>

<Pencil size={16}/>

</button>



<button
onClick={()=>{

if(
confirm(
"Are you sure you want to delete this transaction?"
)
){

deleteTransaction(
transaction.id
);

}

}}
className="
rounded-lg
bg-red-500
p-2
text-white
transition
hover:bg-red-600
"
>

<Trash2 size={16}/>

</button>



</div>


</td>


</tr>


))


}


</tbody>


</table>


</div>





<EditTransactionModal

open={isEditOpen}

transaction={selectedTransaction}

onClose={()=>{

setIsEditOpen(false);

setSelectedTransaction(null);


setTransactions(
getTransactions()
);


window.dispatchEvent(
new Event(
"transactionsUpdated"
)
);


}}

/>


</>


  );

}