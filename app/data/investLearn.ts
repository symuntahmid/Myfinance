/* ==========================================
   INVESTMENT TYPES, IN SIMPLE WORDS

   Risk is 1 (very low) to 5 (very high).
   No interest rates are shown on purpose:
   they change, so the screen says to check.
========================================== */

import type { InvestmentType } from "@/app/data/investments";

type Pair = { en: string; bn: string };

export type LearnCard = {
  id: string;
  emoji: string;
  name: Pair;
  risk: 1 | 2 | 3 | 4 | 5;
  horizon: Pair;
  goodFor: Pair;
  watch: Pair;
};

export const LEARN: LearnCard[] = [
  {
    id: "savings",
    emoji: "🏦",
    name: { en: "Savings account and DPS", bn: "সঞ্চয়ী হিসাব ও DPS" },
    risk: 1,
    horizon: { en: "Under 2 years", bn: "২ বছরের কম" },
    goodFor: {
      en: "Your emergency fund and near goals. Easy to reach.",
      bn: "জরুরি তহবিল ও কাছের লক্ষ্য। সহজে তোলা যায়।",
    },
    watch: {
      en: "Growth is low and can lag behind rising prices.",
      bn: "বৃদ্ধি কম, দাম বাড়ার সাথে পাল্লা দিতে পারে না।",
    },
  },
  {
    id: "fdr",
    emoji: "🔒",
    name: { en: "Fixed deposit (FDR)", bn: "ফিক্সড ডিপোজিট (FDR)" },
    risk: 1,
    horizon: { en: "1 to 3 years", bn: "১ থেকে ৩ বছর" },
    goodFor: {
      en: "Money you will not touch for a set time, with a known return.",
      bn: "নির্দিষ্ট সময় না ছোঁয়া টাকা, জানা রিটার্নসহ।",
    },
    watch: {
      en: "Breaking it early can cost you profit. Tax is taken from the profit.",
      bn: "আগে ভাঙলে মুনাফা কমে। মুনাফা থেকে কর কাটা হয়।",
    },
  },
  {
    id: "certificates",
    emoji: "📜",
    name: { en: "Government savings certificates", bn: "সরকারি সঞ্চয়পত্র" },
    risk: 1,
    horizon: { en: "3 to 5 years", bn: "৩ থেকে ৫ বছর" },
    goodFor: {
      en: "Steady, government-backed saving for the middle term.",
      bn: "মধ্যমেয়াদে স্থির, সরকার-সমর্থিত সঞ্চয়।",
    },
    watch: {
      en: "Rates, limits and tax rules are set by the government and change. Check the official source.",
      bn: "হার, সীমা ও করের নিয়ম সরকার ঠিক করে এবং বদলায়। সরকারি উৎসে যাচাই করুন।",
    },
  },
  {
    id: "bonds",
    emoji: "🧾",
    name: { en: "Government bonds and bills", bn: "সরকারি বন্ড ও বিল" },
    risk: 2,
    horizon: { en: "1 to 5 years", bn: "১ থেকে ৫ বছর" },
    goodFor: {
      en: "Lending to the government for a steady income.",
      bn: "সরকারকে ধার দিয়ে স্থির আয়।",
    },
    watch: {
      en: "Often needs a larger amount and some paperwork.",
      bn: "প্রায়ই বেশি টাকা ও কিছু কাগজপত্র লাগে।",
    },
  },
  {
    id: "funds",
    emoji: "🧺",
    name: { en: "Mutual funds", bn: "মিউচুয়াল ফান্ড" },
    risk: 3,
    horizon: { en: "5 years or more", bn: "৫ বছর বা বেশি" },
    goodFor: {
      en: "A professional spreads your money across many companies.",
      bn: "বিশেষজ্ঞ আপনার টাকা অনেক কোম্পানিতে ছড়িয়ে দেন।",
    },
    watch: {
      en: "Value goes up and down. Fees matter. Pick known managers.",
      bn: "মূল্য ওঠানামা করে। ফি গুরুত্বপূর্ণ। পরিচিত ম্যানেজার বাছুন।",
    },
  },
  {
    id: "stocks",
    emoji: "📈",
    name: { en: "Stocks (DSE)", bn: "শেয়ার (DSE)" },
    risk: 4,
    horizon: { en: "7 years or more", bn: "৭ বছর বা বেশি" },
    goodFor: {
      en: "Long-term growth when you can leave it alone.",
      bn: "দীর্ঘমেয়াদে বৃদ্ধি, যদি হাত না দিয়ে রাখতে পারেন।",
    },
    watch: {
      en: "Prices can fall a lot. Never invest money you need soon or borrowed money.",
      bn: "দাম অনেক পড়তে পারে। শীঘ্র লাগবে বা ধারের টাকা কখনো লাগাবেন না।",
    },
  },
  {
    id: "gold",
    emoji: "🪙",
    name: { en: "Gold", bn: "স্বর্ণ" },
    risk: 3,
    horizon: { en: "5 years or more", bn: "৫ বছর বা বেশি" },
    goodFor: {
      en: "A small share that holds value when prices rise.",
      bn: "ছোট অংশ, দাম বাড়লে মূল্য ধরে রাখে।",
    },
    watch: {
      en: "It pays no income. Making charges and storage cut your gain.",
      bn: "কোনো আয় দেয় না। মজুরি ও সংরক্ষণে লাভ কমে।",
    },
  },
  {
    id: "property",
    emoji: "🏠",
    name: { en: "Land and property", bn: "জমি ও সম্পত্তি" },
    risk: 4,
    horizon: { en: "10 years or more", bn: "১০ বছর বা বেশি" },
    goodFor: {
      en: "A home to live in or rent out over many years.",
      bn: "অনেক বছরের জন্য থাকার বা ভাড়া দেওয়ার বাড়ি।",
    },
    watch: {
      en: "Hard to sell fast, big costs, and legal checks are a must.",
      bn: "দ্রুত বিক্রি কঠিন, খরচ বেশি, আর আইনি যাচাই জরুরি।",
    },
  },
  {
    id: "pension",
    emoji: "👴",
    name: { en: "Pension and provident fund", bn: "পেনশন ও প্রভিডেন্ট ফান্ড" },
    risk: 2,
    horizon: { en: "15 years or more", bn: "১৫ বছর বা বেশি" },
    goodFor: {
      en: "Retirement. Money is set apart so you do not spend it.",
      bn: "অবসর। টাকা আলাদা থাকে, তাই খরচ হয় না।",
    },
    watch: {
      en: "Money is locked until retirement. Check the scheme's rules.",
      bn: "অবসর পর্যন্ত টাকা আটকে থাকে। স্কিমের নিয়ম যাচাই করুন।",
    },
  },
  {
    id: "crypto",
    emoji: "⚠️",
    name: { en: "Crypto", bn: "ক্রিপ্টো" },
    risk: 5,
    horizon: { en: "Only money you can lose", bn: "শুধু যে টাকা হারানো সইবে" },
    goodFor: {
      en: "Very few people. If at all, a tiny share.",
      bn: "খুব কম মানুষের জন্য। নিলেও খুব ছোট অংশ।",
    },
    watch: {
      en: "Prices swing wildly, scams are common, and Bangladesh rules are strict. Check the law first.",
      bn: "দাম অস্বাভাবিক ওঠানামা করে, প্রতারণা বেশি, আর বাংলাদেশে নিয়ম কড়া। আগে আইন যাচাই করুন।",
    },
  },
];

/* Names, icons, one-line help and a name example for each type
   you can record in the portfolio. */
export const TYPE_INFO: Record<
  InvestmentType,
  { emoji: string; en: string; bn: string; hint: Pair; example: string }
> = {
  Savings: {
    emoji: "🏦",
    en: "Savings account",
    bn: "সঞ্চয়ী হিসাব",
    hint: { en: "Money kept in a bank account that earns a little.", bn: "ব্যাংকে রাখা টাকা, যা অল্প আয় দেয়।" },
    example: "Bank savings",
  },
  DPS: {
    emoji: "🗓️",
    en: "DPS",
    bn: "DPS",
    hint: { en: "A fixed amount you deposit every month for a set time.", bn: "নির্দিষ্ট সময়ের জন্য প্রতি মাসে নির্দিষ্ট টাকা জমা।" },
    example: "Brac Bank DPS",
  },
  "Fixed Deposit (FDR)": {
    emoji: "🔒",
    en: "FDR",
    bn: "FDR",
    hint: { en: "A lump sum locked in a bank for a set time.", bn: "একসাথে টাকা নির্দিষ্ট সময়ের জন্য ব্যাংকে আটকে রাখা।" },
    example: "City Bank FDR",
  },
  "Savings Certificate": {
    emoji: "📜",
    en: "Savings certificate",
    bn: "সঞ্চয়পত্র",
    hint: { en: "Government savings certificate (Sanchayapatra).", bn: "সরকারি সঞ্চয়পত্র।" },
    example: "5-year certificate",
  },
  Bonds: {
    emoji: "🧾",
    en: "Bonds",
    bn: "বন্ড",
    hint: { en: "Money lent to the government or a company for steady income.", bn: "সরকার বা কোম্পানিকে ধার দিয়ে স্থির আয়।" },
    example: "Treasury bond",
  },
  "Mutual Fund": {
    emoji: "🧺",
    en: "Mutual fund",
    bn: "মিউচুয়াল ফান্ড",
    hint: { en: "A fund that spreads your money across many companies.", bn: "অনেক কোম্পানিতে টাকা ছড়িয়ে দেওয়া ফান্ড।" },
    example: "Fund name",
  },
  Stocks: {
    emoji: "📈",
    en: "Stocks",
    bn: "শেয়ার",
    hint: { en: "Shares of a company you hold, for example on the DSE.", bn: "কোনো কোম্পানির শেয়ার, যেমন DSE-তে।" },
    example: "Square Pharma",
  },
  ETF: {
    emoji: "📊",
    en: "ETF",
    bn: "ETF",
    hint: { en: "A fund that trades like a share.", bn: "শেয়ারের মতো কেনাবেচা হওয়া ফান্ড।" },
    example: "ETF name",
  },
  Gold: {
    emoji: "🪙",
    en: "Gold",
    bn: "স্বর্ণ",
    hint: { en: "Gold you hold as an investment. Enter grams or vori as units.", bn: "বিনিয়োগ হিসেবে রাখা স্বর্ণ। একক হিসেবে গ্রাম বা ভরি দিন।" },
    example: "Gold 2 vori",
  },
  "Real Estate": {
    emoji: "🏠",
    en: "Property",
    bn: "সম্পত্তি",
    hint: { en: "Land, a flat or a shop kept as an investment.", bn: "বিনিয়োগ হিসেবে রাখা জমি, ফ্ল্যাট বা দোকান।" },
    example: "Plot in Savar",
  },
  Business: {
    emoji: "🏪",
    en: "Business",
    bn: "ব্যবসা",
    hint: { en: "Money you put into a business.", bn: "ব্যবসায় লাগানো টাকা।" },
    example: "Shop share",
  },
  Retirement: {
    emoji: "👴",
    en: "Pension or provident fund",
    bn: "পেনশন বা প্রভিডেন্ট ফান্ড",
    hint: { en: "Money set apart for retirement.", bn: "অবসরের জন্য আলাদা করা টাকা।" },
    example: "Pension scheme",
  },
  Crypto: {
    emoji: "⚠️",
    en: "Crypto",
    bn: "ক্রিপ্টো",
    hint: { en: "Very high risk. Check the rules in Bangladesh first.", bn: "খুব ঝুঁকিপূর্ণ। আগে বাংলাদেশের নিয়ম যাচাই করুন।" },
    example: "Coin name",
  },
  Other: {
    emoji: "💼",
    en: "Other",
    bn: "অন্যান্য",
    hint: { en: "Anything that does not fit the others.", bn: "অন্য কিছুতে না মিললে।" },
    example: "Name",
  },
};

/* How the type picker is grouped, safest first. */
export const TYPE_GROUPS: { key: "invGroupSafe" | "invGroupGrow" | "invGroupSpecial"; types: InvestmentType[] }[] = [
  { key: "invGroupSafe", types: ["Savings", "DPS", "Fixed Deposit (FDR)", "Savings Certificate", "Bonds"] },
  { key: "invGroupGrow", types: ["Mutual Fund", "Stocks", "ETF", "Gold", "Real Estate", "Business"] },
  { key: "invGroupSpecial", types: ["Retirement", "Crypto", "Other"] },
];
