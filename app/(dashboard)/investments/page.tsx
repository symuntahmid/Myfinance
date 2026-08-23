"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import PortfolioGrowthChart from "@/app/components/PortfolioGrowthChart";
import PortfolioAllocationChart from "@/app/components/PortfolioAllocationChart";
import AIInvestmentInsights from "@/app/components/AIInvestmentInsights";

import AddInvestmentModal from "@/app/components/AddInvestmentModal";
import EditInvestmentModal from "@/app/components/EditInvestmentModal";

import {
  getInvestments,
  getPortfolioSummary,
  clearInvestments,
  deleteInvestment,
  Investment,
} from "@/app/data/investments";



export default function InvestmentsPage() {


  const [openModal,setOpenModal] =
    useState(false);


  const [editingInvestment,setEditingInvestment] =
    useState<Investment | null>(null);


  const [investments,setInvestments] =
    useState<Investment[]>([]);


  const [summary,setSummary] =
    useState(getPortfolioSummary());



  function refreshPortfolio(){

    setInvestments(
      getInvestments()
    );

    setSummary(
      getPortfolioSummary()
    );

  }




  useEffect(()=>{

    refreshPortfolio();


    window.addEventListener(
      "investmentsUpdated",
      refreshPortfolio
    );


    return()=>{

      window.removeEventListener(
        "investmentsUpdated",
        refreshPortfolio
      );

    };


  },[]);






  function handleDelete(id:string){


    const confirmed =
      window.confirm(
        "Delete this investment?"
      );


    if(!confirmed)
      return;


    deleteInvestment(id);


    refreshPortfolio();


    window.dispatchEvent(
      new Event("investmentsUpdated")
    );

  }







  function handleDeleteAll(){


    const confirmed =
      window.confirm(
        "Delete all investments?\n\nThis action cannot be undone."
      );


    if(!confirmed)
      return;


    clearInvestments();


    refreshPortfolio();


    window.dispatchEvent(
      new Event("investmentsUpdated")
    );

  }







  return (

<>


{/* Header */}

<div className="
mb-10
flex
flex-wrap
items-center
justify-between
gap-4
">


<div>

<h1 className="
text-4xl
font-bold
text-[var(--foreground)]
">

My Investments

</h1>


<p className="
mt-2
text-[var(--muted)]
">

Manage all your investments in one place.

</p>


</div>




<div className="flex gap-3">


<button

onClick={()=>
setOpenModal(true)
}

className="
flex
items-center
gap-2
rounded-2xl
bg-[var(--primary)]
px-5
py-3
font-semibold
text-white
hover:opacity-90
"

>

<Plus size={18}/>

Add Investment

</button>





{investments.length > 0 && (

<button

onClick={handleDeleteAll}

className="
rounded-2xl
bg-red-600
px-5
py-3
font-semibold
text-white
hover:bg-red-700
"

>

Delete All

</button>

)}


</div>


</div>









{/* Summary Cards */}

<div className="
grid
gap-6
md:grid-cols-4
">



<div className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">

<p className="
text-sm
text-[var(--muted)]
">

Total Invested

</p>

<h2 className="
mt-2
text-3xl
font-bold
">

${summary.invested.toLocaleString()}

</h2>

</div>





<div className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">

<p className="
text-sm
text-[var(--muted)]
">

Current Value

</p>

<h2 className="
mt-2
text-3xl
font-bold
">

${summary.current.toLocaleString()}

</h2>

</div>





<div className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">

<p className="
text-sm
text-[var(--muted)]
">

Total Profit

</p>


<h2 className={`mt-2 text-3xl font-bold ${
summary.profit >= 0
?
"text-green-600"
:
"text-red-600"
}`}>

{summary.profit >= 0 ? "+" : ""}

${summary.profit.toLocaleString()}

</h2>


</div>





<div className="
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-6
shadow-sm
">


<p className="
text-sm
text-[var(--muted)]
">

Portfolio Return

</p>


<h2 className="
mt-2
text-3xl
font-bold
text-cyan-600
">

{summary.returnPercentage.toFixed(2)}%

</h2>


</div>



</div>









{/* Investment Table */}


<div className="
mt-8
rounded-3xl
border border-[var(--border)]
bg-[var(--card)]
p-8
shadow-sm
">


{
investments.length === 0

?

<div className="
py-20
text-center
">


<h3 className="
text-2xl
font-bold
">

No Investments Yet

</h3>


<p className="
mt-3
text-[var(--muted)]
">

Start tracking your portfolio by adding your first investment.

</p>


<button

onClick={()=>
setOpenModal(true)
}

className="
mt-8
rounded-2xl
bg-[var(--primary)]
px-6
py-3
font-semibold
text-white
"

>

Add First Investment

</button>


</div>


:


<table className="w-full">


<thead>

<tr className="
border-b
border-[var(--border)]
">


<th className="py-4 text-left">
Investment
</th>

<th className="py-4 text-left">
Type
</th>

<th className="py-4 text-right">
Invested
</th>

<th className="py-4 text-right">
Current
</th>

<th className="py-4 text-right">
Profit
</th>

<th className="py-4 text-right">
Return
</th>

<th className="py-4 text-right">
Actions
</th>


</tr>

</thead>





<tbody>


{
investments.map((investment)=>{


const profit =
investment.currentValue -
investment.investedAmount;



const percentage =
investment.investedAmount === 0
?
0
:
(profit /
investment.investedAmount) *
100;



return (

<tr

key={investment.id}

className="
border-b
border-[var(--border)]
last:border-0
"

>


<td className="
py-5
font-semibold
">

{investment.name}

</td>



<td>

{investment.type}

</td>




<td className="text-right">

${investment.investedAmount.toLocaleString()}

</td>




<td className="text-right">

${investment.currentValue.toLocaleString()}

</td>




<td className={`text-right font-semibold ${
profit >= 0
?
"text-green-600"
:
"text-red-600"
}`}>

{profit >= 0 ? "+" : ""}

${profit.toLocaleString()}

</td>





<td className={`text-right font-semibold ${
percentage >= 0
?
"text-green-600"
:
"text-red-600"
}`}>

{percentage.toFixed(2)}%

</td>





<td>

<div className="
flex
justify-end
gap-2
">


<button

onClick={()=>
setEditingInvestment(investment)
}

className="
rounded-xl
border
p-2
hover:bg-slate-100
"

>

<Pencil size={16}/>

</button>




<button

onClick={()=>
handleDelete(investment.id)
}

className="
rounded-xl
border
border-red-200
p-2
text-red-600
hover:bg-red-50
"

>

<Trash2 size={16}/>

</button>



</div>

</td>


</tr>

);


})

}



</tbody>


</table>


}


</div>







{/* Charts */}

<div className="mt-8">
<PortfolioGrowthChart/>
</div>


<div className="mt-8">
<PortfolioAllocationChart/>
</div>


<div className="mt-8">
<AIInvestmentInsights/>
</div>






{/* Modals */}

<AddInvestmentModal

open={openModal}

onClose={()=>
setOpenModal(false)
}

/>



<EditInvestmentModal

open={editingInvestment !== null}

investment={editingInvestment}

onClose={()=>{
setEditingInvestment(null);
refreshPortfolio();
}}

/>



</>

  );

}