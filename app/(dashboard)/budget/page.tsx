import { redirect } from "next/navigation";

// The old Budget page was replaced by the Monthly plan.
export default function BudgetPage() {
  redirect("/plan");
}
