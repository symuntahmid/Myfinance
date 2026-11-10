/* ==========================================
   GOAL TEMPLATES (Bangladesh)

   One-tap starting points for the Create Goal form.
   A template fills in the name and emoji and shows a
   short tip. The user still chooses the amount and date,
   because those depend on their own life.
========================================== */

export type GoalTemplateId =
  | "eid"
  | "qurbani"
  | "dps"
  | "wedding"
  | "education"
  | "rent"
  | "emergency"
  | "loan"
  | "family"
  | "hajj";

export type GoalTemplate = {
  id: GoalTemplateId;
  emoji: string;
  title: { en: string; bn: string };
  tip: { en: string; bn: string };
};

export const goalTemplates: GoalTemplate[] = [
  {
    id: "eid",
    emoji: "🌙",
    title: { en: "Eid Fund", bn: "ঈদ ফান্ড" },
    tip: {
      en: "Save a little every week so Eid shopping never feels like a shock.",
      bn: "প্রতি সপ্তাহে অল্প অল্প জমান, যাতে ঈদের কেনাকাটা চাপ না হয়।",
    },
  },
  {
    id: "qurbani",
    emoji: "🐄",
    title: { en: "Qurbani Fund", bn: "কোরবানি ফান্ড" },
    tip: {
      en: "Start early. Setting aside a fixed amount each month spreads the cost.",
      bn: "আগে থেকে শুরু করুন। প্রতি মাসে নির্দিষ্ট অঙ্ক রাখলে খরচ ভাগ হয়ে যায়।",
    },
  },
  {
    id: "dps",
    emoji: "🏦",
    title: { en: "DPS / Savings Scheme", bn: "ডিপিএস / সঞ্চয় স্কিম" },
    tip: {
      en: "Pick a monthly instalment you can keep paying for the whole term.",
      bn: "এমন মাসিক কিস্তি বেছে নিন যা পুরো মেয়াদ জুড়ে দিতে পারবেন।",
    },
  },
  {
    id: "wedding",
    emoji: "💍",
    title: { en: "Wedding Fund", bn: "বিয়ের খরচ" },
    tip: {
      en: "Add up the big costs first, then work out a monthly amount.",
      bn: "আগে বড় খরচগুলো যোগ করুন, তারপর মাসিক সঞ্চয়ের অঙ্ক ঠিক করুন।",
    },
  },
  {
    id: "education",
    emoji: "🎓",
    title: { en: "Tuition & Education", bn: "পড়াশোনার খরচ" },
    tip: {
      en: "Include fees, books and exam costs so nothing surprises you.",
      bn: "ফি, বই ও পরীক্ষার খরচ ধরুন, যাতে কিছুই হঠাৎ না আসে।",
    },
  },
  {
    id: "rent",
    emoji: "🏠",
    title: { en: "Rent Cushion", bn: "বাসা ভাড়ার রিজার্ভ" },
    tip: {
      en: "A cushion of about 3 months of rent helps if income is irregular.",
      bn: "আয় অনিয়মিত হলে প্রায় ৩ মাসের ভাড়ার রিজার্ভ কাজে আসে।",
    },
  },
  {
    id: "emergency",
    emoji: "🆘",
    title: { en: "Emergency Fund", bn: "জরুরি তহবিল" },
    tip: {
      en: "A common target is 3 to 6 months of your living costs.",
      bn: "সাধারণ লক্ষ্য হলো আপনার ৩ থেকে ৬ মাসের জীবনযাত্রার খরচ।",
    },
  },
  {
    id: "loan",
    emoji: "💸",
    title: { en: "Loan Payoff", bn: "ঋণ পরিশোধ" },
    tip: {
      en: "Set the target to what you still owe. Clearing high-interest loans first saves the most.",
      bn: "এখনও যা বাকি আছে সেটাই লক্ষ্য রাখুন। বেশি সুদের ঋণ আগে শোধ করলে সবচেয়ে বেশি সাশ্রয় হয়।",
    },
  },
  {
    id: "family",
    emoji: "🤝",
    title: { en: "Family Support", bn: "পরিবারের জন্য" },
    tip: {
      en: "Plan money for family in advance so it never throws off your month.",
      bn: "পরিবারের জন্য আগে থেকে টাকা আলাদা করুন, যাতে মাসের হিসাব এলোমেলো না হয়।",
    },
  },
  {
    id: "hajj",
    emoji: "🕋",
    title: { en: "Hajj / Umrah", bn: "হজ / ওমরাহ" },
    tip: {
      en: "A long goal. Small monthly deposits add up over the years.",
      bn: "এটি দীর্ঘমেয়াদি লক্ষ্য। ছোট ছোট মাসিক জমা বছর ধরে বড় হয়ে ওঠে।",
    },
  },
];

export const goalTemplateText = {
  en: {
    heading: "Start from a template",
    optional: "or fill in the form yourself",
  },
  bn: {
    heading: "টেমপ্লেট থেকে শুরু করুন",
    optional: "অথবা নিজে ফর্ম পূরণ করুন",
  },
} as const;
