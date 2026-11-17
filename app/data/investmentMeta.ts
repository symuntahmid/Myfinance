import type { InvestmentType } from "@/app/data/investments";

export const EMOJI: Record<InvestmentType, string> = {
  Stocks: "📈",
  Crypto: "🪙",
  Gold: "🥇",
  "Real Estate": "🏠",
  "Mutual Fund": "🧺",
  ETF: "🧩",
  Bonds: "📜",
  Savings: "🐖",
  "Fixed Deposit (FDR)": "🏦",
  DPS: "🗓️",
  "Savings Certificate": "🎫",
  Business: "🏪",
  Retirement: "🌴",
  Other: "💼",
};

export const NAME: Record<InvestmentType, { en: string; bn: string }> = {
  Stocks: { en: "Stocks", bn: "শেয়ার" },
  Crypto: { en: "Crypto", bn: "ক্রিপ্টো" },
  Gold: { en: "Gold", bn: "সোনা" },
  "Real Estate": { en: "Property", bn: "সম্পত্তি" },
  "Mutual Fund": { en: "Mutual fund", bn: "মিউচুয়াল ফান্ড" },
  ETF: { en: "ETF", bn: "ইটিএফ" },
  Bonds: { en: "Bonds", bn: "বন্ড" },
  Savings: { en: "Savings", bn: "সঞ্চয়" },
  "Fixed Deposit (FDR)": { en: "FDR", bn: "এফডিআর" },
  DPS: { en: "DPS", bn: "ডিপিএস" },
  "Savings Certificate": { en: "Sanchayapatra", bn: "সঞ্চয়পত্র" },
  Business: { en: "Business", bn: "ব্যবসা" },
  Retirement: { en: "Retirement", bn: "অবসর" },
  Other: { en: "Other", bn: "অন্যান্য" },
};

