export type TranslationKey =
  | "wealthHub"
  | "dashboard"
  | "profile"
  | "myMoney"
  | "investments"
  | "reports"
  | "settings"
  | "myProfile"
  | "profileDescription"
  | "editProfile"
  | "developerMode"
  | "financialLevel"
  | "buildingFinancialConfidence"
  | "moneySystemMessage"
  | "more"
  | "moneyStreak"
  | "keepGoing"
  | "dailyJourneyMessage"
  | "days"
  | "dayStreak"
  | "dailyJourney"
  | "today"
  | "investmentPortfolio"
  | "assets"
  | "invested"
  | "currentValue"
  | "profit"
  | "return"
  | "welcomeBack"
  | "dailyJourneyComplete"
  | "dailyJourneyChallenge"
  | "xpUntilLevel"
  | "buildBetterMoneyHabits"
  | "progress"
  | "done"
  | "complete"
  | "xpEarnedMessage"
  | "trackExpense"
  | "reviewSpending"
  | "betterMoneyDecision";

type LanguageTranslation =
  Record<TranslationKey, string>;


export const translations: Record<
  "en" | "bn",
  LanguageTranslation
> = {

  /* ==========================================
     ENGLISH
  ========================================== */

  en: {

    wealthHub:
      "Your Personal Wealth Hub",

    dashboard:
      "Dashboard",

    profile:
      "Profile",

    myMoney:
      "My Money",

    investments:
      "My Investments",

    reports:
      "Reports",

    settings:
      "Settings",

    myProfile:
      "My Profile",

    profileDescription:
      "Your financial identity, progress, and money habits.",

    editProfile:
      "Edit Profile",

    developerMode:
      "Developer Mode",

    financialLevel:
      "Financial Level",

    buildingFinancialConfidence:
      "Building financial confidence",

    moneySystemMessage:
      "You are building a stronger money system. Small actions create long-term wealth.",

    more:
      "More",

    moneyStreak:
      "Money Streak",

    keepGoing:
      "Keep Going",

    dailyJourneyMessage:
      "Complete your Daily Journey every day to build your streak.",

    days:
      "Days",

    dayStreak:
      "Day Streak",

    dailyJourney:
      "Daily Journey",

    today:
      "Today",

    investmentPortfolio:
      "Investment Portfolio",

    assets:
      "Assets",

    invested:
      "Invested",

    currentValue:
      "Current Value",

    profit:
      "Profit",

    return:
      "Return",

    welcomeBack:
      "Welcome back",

    dailyJourneyComplete:
      "Congratulations! You completed today's Daily Journey. Come back tomorrow for a new challenge.",

    dailyJourneyChallenge:
      "Complete today's Daily Journey and earn +45 XP.",

    xpUntilLevel:
      "Only {xp} XP until Level {level}!",

    buildBetterMoneyHabits:
      "Build Better Money Habits",

    progress:
      "Progress",

    done:
  "Done",

complete:
  "Complete",

xpEarnedMessage:
  "XP earned. Your money habits are improving.",

trackExpense:
  "Track one expense",

reviewSpending:
  "Review your spending",

betterMoneyDecision:
  "Make one better money decision",

  },


  /* ==========================================
     BANGLA
  ========================================== */

  bn: {

    wealthHub:
      "আপনার ব্যক্তিগত সম্পদ ব্যবস্থাপনা কেন্দ্র",

    dashboard:
      "ড্যাশবোর্ড",

    profile:
      "প্রোফাইল",

    myMoney:
      "আমার টাকা",

    investments:
      "আমার বিনিয়োগ",

    reports:
      "রিপোর্ট",

    settings:
      "সেটিংস",

    myProfile:
      "আমার প্রোফাইল",

    profileDescription:
      "আপনার আর্থিক পরিচয়, অগ্রগতি এবং অর্থ ব্যবস্থাপনার অভ্যাস।",

    editProfile:
      "প্রোফাইল সম্পাদনা করুন",

    developerMode:
      "ডেভেলপার মোড",

    financialLevel:
      "আর্থিক স্তর",

    buildingFinancialConfidence:
      "আর্থিক আত্মবিশ্বাস তৈরি হচ্ছে",

    moneySystemMessage:
      "আপনি একটি শক্তিশালী অর্থ ব্যবস্থা তৈরি করছেন। ছোট ছোট পদক্ষেপ দীর্ঘমেয়াদী সম্পদ তৈরি করে।",

    more:
      "আরও",

    moneyStreak:
      "টাকার অভ্যাসের ধারাবাহিকতা",

    keepGoing:
      "চালিয়ে যান",

    dailyJourneyMessage:
      "ধারাবাহিকতা গড়তে প্রতিদিনের যাত্রা সম্পন্ন করুন।",

    days:
      "দিন",

    dayStreak:
      "দিনের ধারাবাহিকতা",

    dailyJourney:
      "দৈনিক যাত্রা",

    today:
      "আজ",

    investmentPortfolio:
      "বিনিয়োগ পোর্টফোলিও",

    assets:
      "সম্পদ",

    invested:
      "বিনিয়োগকৃত",

    currentValue:
      "বর্তমান মূল্য",

    profit:
      "লাভ",

    return:
      "রিটার্ন",

    welcomeBack:
      "স্বাগতম",

    dailyJourneyComplete:
      "🎉 দারুণ! আজকের যাত্রা শেষ। আগামীকাল নতুন চ্যালেঞ্জ অপেক্ষায়!",

    dailyJourneyChallenge:
      "আজকের যাত্রা শেষ করুন এবং +৪৫ XP পান।",

    xpUntilLevel:
      "পরবর্তী Level {level}-এ যেতে আর মাত্র {xp} XP বাকি!",

    buildBetterMoneyHabits:
      "টাকার অভ্যাস হোক আরও ভালো",

    progress:
      "অগ্রগতি",

    done:
  "সম্পন্ন",

complete:
  "শেষ করুন",

xpEarnedMessage:
  "XP অর্জন করেছেন। আপনার টাকার অভ্যাস আরও ভালো হচ্ছে।",

trackExpense:
  "একটি খরচ লিখুন",

reviewSpending:
  "আপনার খরচ দেখুন",

betterMoneyDecision:
  "টাকা নিয়ে একটি ভালো সিদ্ধান্ত নিন",
  },

};