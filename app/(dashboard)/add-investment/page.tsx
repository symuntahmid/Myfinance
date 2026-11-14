import { redirect } from "next/navigation";

// The old form is gone: Quick Add is the one way to add.
export default function Page() {
  redirect("/investments");
}
