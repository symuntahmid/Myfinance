"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import QuickAddSheet from "@/app/components/QuickAddSheet";

const subscribe = () => () => {};

// The message in the link, read in the browser only.
function readMessage(): string {
  const params = new URLSearchParams(window.location.search);

  return params.get("sms") ?? params.get("text") ?? "";
}

// Opened by the automatic SMS link:  /quick?sms=<the message>
// It reads the message in Quick Add so the user only taps Save.
export default function QuickLinkPage() {
  const router = useRouter();

  const sms = useSyncExternalStore(subscribe, readMessage, () => "");

  const empty = sms.trim() === "";

  useEffect(() => {
    // The server render is always empty, so only leave once the
    // browser has really checked.
    if (empty && typeof window !== "undefined" && !readMessage().trim()) {
      router.replace("/dashboard");
    }
  }, [empty, router]);

  if (empty) return null;

  return (
    <QuickAddSheet
      open
      initialSms={sms}
      onClose={() => router.replace("/dashboard")}
    />
  );
}
