"use client";

import { useState } from "react";
import { X, Target } from "lucide-react";

import { addGoal } from "@/app/data/goals";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  goalTemplates,
  goalTemplateText,
  type GoalTemplateId,
} from "@/app/data/goalTemplates";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddGoalModal({
  open,
  onClose,
}: Props) {

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const { language, t } = useLanguage();

  const [templateId, setTemplateId] =
    useState<GoalTemplateId | null>(null);


  if (!open) return null;



  function handleCreateGoal() {

    if (!title.trim()) return;

    if (!targetAmount) return;


    addGoal({

      id: Date.now().toString(),

      title: title.trim(),

      emoji,

      targetAmount: Number(targetAmount),

      savedAmount: 0,

      targetDate,

      createdAt: new Date().toISOString(),

    });



    setTitle("");

    setEmoji("🎯");

    setTargetAmount("");

    setTargetDate("");

    setTemplateId(null);


    onClose();

  }



  return (

<>
<div
className="
fixed
inset-0
z-50
bg-black/40
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

onClick={(e)=>e.stopPropagation()}

className="
w-full
max-w-xl
max-h-[90vh]
overflow-y-auto
rounded-[32px]
bg-[var(--card)]
border
border-[var(--border)]
shadow-2xl
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
px-8
py-6
"
>


<div
className="
flex
items-center
gap-4
"
>


<div
className="
rounded-2xl
bg-cyan-500/10
p-3
"
>

<Target className="text-cyan-500"/>

</div>



<div>

<h2
className="
text-3xl
font-bold
text-[var(--foreground)]
"
>
{t("createGoal")}
</h2>


<p
className="
mt-1
text-[var(--muted)]
"
>
{t("createGoalDescription")}
</p>


</div>


</div>




<button

onClick={onClose}

className="
rounded-full
p-2
text-[var(--muted)]
hover:bg-[var(--background)]
"

>

<X size={22}/>

</button>



</div>





{/* Body */}


<div
className="
space-y-6
p-8
"
>

<div>

<p
className="
mb-2
text-sm
font-semibold
text-[var(--foreground)]
"
>
{goalTemplateText[language].heading}
<span className="ml-2 font-normal text-[var(--muted)]">
· {goalTemplateText[language].optional}
</span>
</p>

<div className="flex flex-wrap gap-2">

{goalTemplates.map((template) => (

<button
key={template.id}
type="button"
onClick={() => {
setTitle(template.title[language]);
setEmoji(template.emoji);
setTemplateId(template.id);
}}
className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
templateId === template.id
? "border-cyan-500 bg-cyan-500 text-white"
: "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-cyan-400"
}`}
>
{template.emoji} {template.title[language]}
</button>

))}

</div>

{templateId && (
<p className="mt-3 rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm text-[var(--foreground)]">
💡 {goalTemplates.find((t) => t.id === templateId)?.tip[language]}
</p>
)}

</div>




<div>

<label
className="
mb-2
block
text-sm
font-semibold
text-[var(--foreground)]
"
>
{t("goalName")}
</label>


<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

placeholder={t("goalNamePlaceholder")}

className="
w-full
rounded-2xl
border
border-[var(--border)]
bg-[var(--background)]
px-4
py-3
text-[var(--foreground)]
outline-none
transition
focus:border-cyan-500
focus:ring-4
focus:ring-cyan-500/20
"

/>

</div>




<div>

<label
className="
mb-2
block
text-sm
font-semibold
text-[var(--foreground)]
"
>
{t("emojiLabel")}
</label>


<input

value={emoji}

onChange={(e)=>setEmoji(e.target.value)}

placeholder="🎯"

className="
w-full
rounded-2xl
border
border-[var(--border)]
bg-[var(--background)]
px-4
py-3
text-[var(--foreground)]
outline-none
transition
focus:border-cyan-500
focus:ring-4
focus:ring-cyan-500/20
"

/>

</div>





<div>

<label
className="
mb-2
block
text-sm
font-semibold
text-[var(--foreground)]
"
>
{t("targetAmount")}
</label>


<input

type="number"

value={targetAmount}

onChange={(e)=>setTargetAmount(e.target.value)}

placeholder="10000"

className="
w-full
rounded-2xl
border
border-[var(--border)]
bg-[var(--background)]
px-4
py-3
text-[var(--foreground)]
outline-none
transition
focus:border-cyan-500
focus:ring-4
focus:ring-cyan-500/20
"

/>

</div>





<div>

<label
className="
mb-2
block
text-sm
font-semibold
text-[var(--foreground)]
"
>
{t("targetDate")}
</label>


<input

type="date"

value={targetDate}

onChange={(e)=>setTargetDate(e.target.value)}

className="
w-full
rounded-2xl
border
border-[var(--border)]
bg-[var(--background)]
px-4
py-3
text-[var(--foreground)]
outline-none
transition
focus:border-cyan-500
focus:ring-4
focus:ring-cyan-500/20
"

/>

</div>



</div>





{/* Footer */}


<div
className="
flex
gap-4
px-8
pb-8
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
transition
hover:bg-[var(--background)]
"

>

{t("cancel")}

</button>




<button

onClick={handleCreateGoal}

className="
flex-1
rounded-2xl
bg-gradient-to-r
from-cyan-500
to-blue-600
py-4
font-semibold
text-white
transition
hover:scale-[1.02]
"

>

{t("createGoal")}

</button>



</div>




</div>


</div>

</>

  );

}