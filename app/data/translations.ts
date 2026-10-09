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
  | "betterMoneyDecision"
  | "level"
  | "netWorth"
  | "monthlyIncome"
  | "expenses"
  | "myFutureGoals"
  | "startYourJourney"
  | "milestonesInProgress"
  | "savedOf"
  | "createFirstSavingsGoal"
  | "yourProgress"
  | "goalCompleted"
  | "keepGoingFuture"
  | "monthlyBudget"
  | "used"
  | "budget"
  | "spent"
  | "remaining"
  | "financialInsights"
  | "personalizedObservations"
  | "addFirstIncome"
  | "excellentSavings"
  | "healthySavings"
  | "consistentSavings"
  | "reduceExpenses"
  | "investmentsMajorWealth"
  | "expensesHigherIncome"
  | "netWorthTrend"
  | "growingSteadily"
  | "cashFlowOverview"
  | "incomeVsExpenses"
  | "compareMonthlyMoneyFlow"
  | "income"
  | "expense"
  | "investment"
  | "investmentAllocation"
  | "portfolioDiversification"
  | "assetsCategories"
  | "largestHolding"
  | "noInvestmentsYet"
  | "recentTransactions"
  | "viewAll"
  | "noTransactionsYet"
  | "latestTransactionsMessage"
  | "type"
  | "source"
  | "category"
  | "amount";
   
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

level:
  "Level",


  netWorth:
  "Net Worth",

monthlyIncome:
  "Monthly Income",

expenses:
  "Expenses",


    myFutureGoals:
      "My Future Goals",

    startYourJourney:
      "Start your journey",

    milestonesInProgress:
      "{count} milestone{plural} in progress",

    savedOf:
      "{saved} saved of {target}",

    createFirstSavingsGoal:
      "Create your first savings goal and build your future.",

    yourProgress:
      "Your progress",

    goalCompleted:
      "🎉 Goal completed! Amazing work.",

    keepGoingFuture:
      "🚀 Keep going, your future is getting closer.",  


   monthlyBudget:
  "Monthly Budget",

used:
  "Used",

budget:
  "Budget",

spent:
  "Spent",

remaining:
  "Remaining",

financialInsights:
  "Financial Insights",

personalizedObservations:
  "Personalized observations based on your finances.",

addFirstIncome:
  "Add your first income to begin tracking.",

excellentSavings:
  "Excellent! You're saving over 50% of your income.",

healthySavings:
  "Great job! Your savings rate is healthy.",

consistentSavings:
  "You're saving consistently. Keep building momentum.",

reduceExpenses:
  "Try reducing unnecessary expenses to improve savings.",

investmentsMajorWealth:
  "Your investments are becoming a major part of your wealth.",

expensesHigherIncome:
  "Warning: Expenses are higher than your income.",


    netWorthTrend:
      "Net Worth Trend",

    growingSteadily:
      "Growing steadily",


      cashFlowOverview:
      "Cash Flow Overview",

    incomeVsExpenses:
      "Income vs Expenses",

    compareMonthlyMoneyFlow:
      "Compare your monthly money flow",

    income:
      "Income",

    expense:
      "Expense",

    investment:
      "Investment",

      investmentAllocation:
      "Investment Allocation",

    portfolioDiversification:
      "Portfolio Diversification",

    assetsCategories:
      "{assets} Assets • {categories} Categories",

    largestHolding:
      "Largest Holding",

    noInvestmentsYet:
      "No investments yet",

      recentTransactions:
      "Recent Transactions",

    viewAll:
      "View All",

    noTransactionsYet:
      "No transactions yet",

    latestTransactionsMessage:
      "Your latest transactions will appear here.",

    type:
      "Type",

    source:
      "Source",

    category:
      "Category",

    amount:
      "Amount",

    
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

level:
  "লেভেল",

netWorth:
  "মোট সম্পদ",

monthlyIncome:
  "মাসিক আয়",

expenses:
  "খরচ",


    myFutureGoals:
      "আমার ভবিষ্যৎ লক্ষ্য",

    startYourJourney:
      "আপনার যাত্রা শুরু করুন",

    milestonesInProgress:
      "{count}টি লক্ষ্য চলছে",

    savedOf:
      "{target}-এর মধ্যে {saved} সঞ্চয় হয়েছে",

    createFirstSavingsGoal:
      "প্রথম সঞ্চয়ের লক্ষ্য তৈরি করুন এবং ভবিষ্যৎ গড়ুন।",

    yourProgress:
      "আপনার অগ্রগতি",

    goalCompleted:
      "🎉 লক্ষ্য পূরণ হয়েছে! দারুণ কাজ!",

    keepGoingFuture:
      "🚀 চালিয়ে যান, আপনার ভবিষ্যৎ আরও কাছে আসছে।",

    monthlyBudget:
  "মাসিক বাজেট",

used:
  "ব্যবহৃত",

budget:
  "বাজেট",

spent:
  "খরচ",

remaining:
  "বাকি",

financialInsights:
  "আর্থিক বিশ্লেষণ",

personalizedObservations:
  "আপনার আর্থিক তথ্যের ভিত্তিতে কিছু পরামর্শ।",

addFirstIncome:
  "ট্র্যাকিং শুরু করতে প্রথম আয় যোগ করুন।",

excellentSavings:
  "দারুণ! আপনি আয়ের ৫০%-এর বেশি সঞ্চয় করছেন।",

healthySavings:
  "চমৎকার! আপনার সঞ্চয়ের হার ভালো।",

consistentSavings:
  "আপনি নিয়মিত সঞ্চয় করছেন। চালিয়ে যান।",

reduceExpenses:
  "সঞ্চয় বাড়াতে অপ্রয়োজনীয় খরচ কমানোর চেষ্টা করুন।",

investmentsMajorWealth:
  "আপনার বিনিয়োগ এখন সম্পদের বড় অংশ হয়ে উঠছে।",

expensesHigherIncome:
  "সতর্কতা: আপনার খরচ আয়ের চেয়ে বেশি।",
  

    netWorthTrend:
      "সম্পদের অগ্রগতি",

    growingSteadily:
      "ধীরে ধীরে বাড়ছে",  

      cashFlowOverview:
      "টাকার হিসাব",

    incomeVsExpenses:
      "আয় বনাম খরচ",

    compareMonthlyMoneyFlow:
      "মাসের আয়-খরচ দেখুন",

    income:
      "আয়",

    expense:
      "খরচ",

    investment:
      "বিনিয়োগ",

      investmentAllocation:
      "বিনিয়োগের ভাগ",

    portfolioDiversification:
      "বিনিয়োগের বৈচিত্র্য",

    assetsCategories:
      "{assets}টি সম্পদ • {categories}টি ধরন",

    largestHolding:
      "সবচেয়ে বড় বিনিয়োগ",

    noInvestmentsYet:
      "এখনও কোনো বিনিয়োগ নেই",

    recentTransactions:
      "সাম্প্রতিক লেনদেন",

    viewAll:
      "সব দেখুন",

    noTransactionsYet:
      "এখনও কোনো লেনদেন নেই",

    latestTransactionsMessage:
      "আপনার সাম্প্রতিক লেনদেন এখানে দেখা যাবে।",

    type:
      "ধরন",

    source:
      "উৎস",

    category:
      "ক্যাটাগরি",

    amount:
      "পরিমাণ",
  },

};