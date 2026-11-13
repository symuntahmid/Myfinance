import { redirect } from "next/navigation";

// The app starts on the Dashboard.
export default function Home() {
  redirect("/dashboard");
}
