"use client";

import { useState, useSyncExternalStore } from "react";

import { useLanguage } from "@/app/context/LanguageContext";

const copy = {
  en: {
    title: "Automatic SMS setup",
    intro:
      "A website cannot read your messages by itself. But your phone can open MyFinance every time a bKash or Nagad SMS arrives, with the message already read. You only tap Save.",
    linkTitle: "Your link",
    copy: "Copy link",
    copied: "Copied ✓",
    linkNote:
      "The message goes at the end of this link. Your phone's automation app adds it for you. This link only works on your phone if MyFinance is on the internet (not just on your computer).",
    androidTitle: "Android (MacroDroid, free)",
    android: [
      "Install MacroDroid from Google Play.",
      "Create a new macro. Trigger: SMS Received. Choose Specific contact and add bKash, NAGAD, Rocket or Upay.",
      "Action: Launch Website / HTTP (open a link in the browser).",
      "Paste the link above. After the = sign, insert the SMS text using the { } magic-text button (the SMS message).",
      "Save the macro and allow the permissions it asks for.",
    ],
    iphoneTitle: "iPhone (Shortcuts app)",
    iphone: [
      "Open the Shortcuts app, then the Automation tab, then New Automation, then Message.",
      "Under Sender, choose bKash, NAGAD or the sender you use. Choose Run Immediately.",
      "Add the action URL Encode with the Shortcut Input (the message).",
      "Add the action Open URLs. Use your link above followed by the encoded text.",
      "Save it.",
    ],
    privacyTitle: "Privacy",
    privacy:
      "The message is read on your phone and saved only on your phone. Nothing is sent to a server.",
    testTitle: "Test it",
    test: "Open the link below to see Quick Add read a sample SMS.",
    testButton: "Try a sample",
  },
  bn: {
    title: "স্বয়ংক্রিয় এসএমএস সেটআপ",
    intro:
      "ওয়েবসাইট নিজে থেকে আপনার মেসেজ পড়তে পারে না। কিন্তু প্রতিবার বিকাশ বা নগদের এসএমএস এলে আপনার ফোন MyFinance খুলে দিতে পারে, মেসেজ আগে থেকেই পড়া অবস্থায়। আপনাকে শুধু সেভ ট্যাপ করতে হবে।",
    linkTitle: "আপনার লিংক",
    copy: "লিংক কপি করুন",
    copied: "কপি হয়েছে ✓",
    linkNote:
      "মেসেজটি এই লিংকের শেষে বসবে। আপনার ফোনের অটোমেশন অ্যাপ সেটি বসিয়ে দেবে। MyFinance ইন্টারনেটে থাকলেই এই লিংক ফোনে কাজ করবে (শুধু কম্পিউটারে চললে হবে না)।",
    androidTitle: "অ্যান্ড্রয়েড (MacroDroid, ফ্রি)",
    android: [
      "Google Play থেকে MacroDroid ইনস্টল করুন।",
      "নতুন ম্যাক্রো বানান। ট্রিগার: SMS Received। Specific contact বেছে bKash, NAGAD, Rocket বা Upay যোগ করুন।",
      "অ্যাকশন: Launch Website / HTTP (ব্রাউজারে লিংক খোলা)।",
      "উপরের লিংকটি বসান। = চিহ্নের পরে { } ম্যাজিক-টেক্সট বাটন দিয়ে এসএমএসের লেখা (SMS message) বসান।",
      "ম্যাক্রো সেভ করুন এবং যে অনুমতি চায় তা দিন।",
    ],
    iphoneTitle: "আইফোন (Shortcuts অ্যাপ)",
    iphone: [
      "Shortcuts অ্যাপ খুলুন, তারপর Automation ট্যাব, তারপর New Automation, তারপর Message।",
      "Sender-এ bKash, NAGAD বা আপনার ব্যবহৃত সেন্ডার বেছে নিন। Run Immediately বেছে নিন।",
      "Shortcut Input (মেসেজ) দিয়ে URL Encode অ্যাকশন যোগ করুন।",
      "Open URLs অ্যাকশন যোগ করুন। উপরের লিংকের পরে এনকোড করা লেখা বসান।",
      "সেভ করুন।",
    ],
    privacyTitle: "গোপনীয়তা",
    privacy:
      "মেসেজ আপনার ফোনেই পড়া হয় এবং শুধু আপনার ফোনেই সংরক্ষিত থাকে। কোনো সার্ভারে কিছু পাঠানো হয় না।",
    testTitle: "পরীক্ষা করুন",
    test: "নিচের বাটনে চাপ দিলে Quick Add একটি নমুনা এসএমএস পড়ে দেখাবে।",
    testButton: "নমুনা চেষ্টা করুন",
  },
} as const;

const SAMPLE =
  "Cash Out Tk 500.00 to 01712345678 successful. Fee Tk 9.25. Balance Tk 1200.00. TrxID TEST123AB at 12/11/2026 10:30";

export default function SmsSetupPage() {
  const { language } = useLanguage();
  const text = copy[language];

  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => ""
  );

  const [copied, setCopied] = useState(false);

  const link = `${origin}/quick?sms=`;

  const card =
    "rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5";

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-6 md:px-0">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        ⚡ {text.title}
      </h1>

      <p className="text-sm leading-6 text-[var(--muted)]">
        {text.intro}
      </p>

      <div className={card}>
        <p className="font-semibold text-[var(--foreground)]">
          {text.linkTitle}
        </p>

        <p className="mt-2 break-all rounded-2xl bg-black/5 p-3 text-sm text-[var(--foreground)]">
          {link}
        </p>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              // The link is on screen, so it can be copied by hand.
            }
          }}
          className="mt-3 rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          {copied ? text.copied : text.copy}
        </button>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          {text.linkNote}
        </p>
      </div>

      {(
        [
          [text.androidTitle, text.android],
          [text.iphoneTitle, text.iphone],
        ] as const
      ).map(([title, steps]) => (
        <div key={title} className={card}>
          <p className="font-semibold text-[var(--foreground)]">
            {title}
          </p>

          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--foreground)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ))}

      <div className={card}>
        <p className="font-semibold text-[var(--foreground)]">
          {text.testTitle}
        </p>

        <p className="mt-2 text-sm text-[var(--muted)]">
          {text.test}
        </p>

        <a
          href={`/quick?sms=${encodeURIComponent(SAMPLE)}`}
          className="mt-3 inline-block rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          {text.testButton}
        </a>
      </div>

      <div className={card}>
        <p className="font-semibold text-[var(--foreground)]">
          🔒 {text.privacyTitle}
        </p>

        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {text.privacy}
        </p>
      </div>
    </div>
  );
}
