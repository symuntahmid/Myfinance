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
  | "amount"
  | "yourSmartCFO"
  | "personalAIFinancialCoach"
  | "nextAction"
  | "aiOpportunitiesDiscovered"
  | "unlockCompleteSmartCFO"
  | "hiddenMoneyPatterns"
  | "unlockAIInsights"
  | "allSmartCFOInsightsUnlocked"
  | "globalBenchmark"
  | "spendingPositionWorldwide"
  | "compareGlobalSpendingPatterns"
  | "globalSpendingComparison"
  | "shopping"
  | "food"
  | "monthlySpending"
  | "overallSpendingHealth"
  | "betterThanPercent"
  | "good"
  | "healthierThanBenchmarkUsers"
  | "savingMoreThanLastMonth"
  | "keepBuildingStrongHabits"
  | "currentBalance"
  | "thisMonth"
  | "availableCash"
  | "incomeMinusExpenses"
  | "analytics"
  | "exploreMoneyAnalytics"
  | "moneyAnalyticsDescription"
  | "recentActivity"
  | "addFirstTransaction"
  | "aiFinancialInsights"
  | "todaysSummary"
  | "largestExpense"
  | "mainIncome"
  | "savingRate"
  | "highestSpending"
  | "noExpense"
  | "noIncome"
  | "financialTrend"
  | "portfolioGrowth"
  | "trackPortfolioGrowth"
  | "noPortfolioHistory"
  | "portfolioValue"
  | "aiPortfolioInsights"
  | "personalizedPortfolioRecommendations"
  | "portfolioHealth"
  | "currentPortfolioHealth"
  | "excellent"
  | "noData"
  | "needsAttention"
  | "average"
  | "portfolioRepresents"
  | "aiRecommendation"
  | "highlyConcentratedPortfolio"
  | "reasonablyDiversifiedPortfolio";


type LanguageTranslation = Record<TranslationKey, string>;

export const translations: Record<
  "en" | "bn",
  LanguageTranslation
> = {
  /* =====================================================
     ENGLISH
  ===================================================== */

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

    yourSmartCFO:
      "Your Smart CFO",

    personalAIFinancialCoach:
      "Your personal AI financial coach",

    nextAction:
      "Next Action",

    aiOpportunitiesDiscovered:
      "{count} AI opportunities discovered",

    unlockCompleteSmartCFO:
      "Unlock your complete Smart CFO analysis",

    hiddenMoneyPatterns:
      "Discover hidden money patterns.",

    unlockAIInsights:
      "Unlock AI Insights",

    allSmartCFOInsightsUnlocked:
      "All Smart CFO insights unlocked",

    globalBenchmark:
      "Global Benchmark",

    spendingPositionWorldwide:
      "Your spending position worldwide",

    compareGlobalSpendingPatterns:
      "Compare your habits with global spending patterns.",

    globalSpendingComparison:
      "Global spending comparison",

    shopping:
      "Shopping",

    food:
      "Food",

    monthlySpending:
      "Monthly spending",

    overallSpendingHealth:
      "Overall spending health",

    betterThanPercent:
      "Better than {percent}%",

    good:
      "GOOD",

    healthierThanBenchmarkUsers:
      "Your spending habits are healthier than most benchmark users.",

    savingMoreThanLastMonth:
      "You're saving 18% more than last month.",

    keepBuildingStrongHabits:
      "Keep it up. You're building strong financial habits.",

    currentBalance:
      "Current Balance",

    thisMonth:
      "This Month",

    availableCash:
      "Available Cash",

    incomeMinusExpenses:
      "Income − Expenses",

    analytics:
      "Analytics",

    exploreMoneyAnalytics:
      "Explore Money Analytics",

    moneyAnalyticsDescription:
      "View detailed expense breakdown, income sources, category trends, financial health and AI insights.",

    recentActivity:
      "Recent Activity",

    addFirstTransaction:
      "Add your first income, expense or investment.",

    aiFinancialInsights:
  "AI Financial Insights",

todaysSummary:
  "Today's Summary",

largestExpense:
  "Largest Expense",

mainIncome:
  "Main Income",

savingRate:
  "Saving Rate",

highestSpending:
  "Highest Spending",

noExpense:
  "No expense",

noIncome:
  "No income",

financialTrend:
  "Financial Trend",
portfolioGrowth:
  "Portfolio Growth",

trackPortfolioGrowth:
  "Track the growth of your investment portfolio.",

noPortfolioHistory:
  "No portfolio history yet.",

portfolioValue:
  "Portfolio Value",

aiPortfolioInsights:
  "AI Portfolio Insights",

personalizedPortfolioRecommendations:
  "Personalized recommendations based on your portfolio.",

portfolioHealth:
  "Portfolio Health",

currentPortfolioHealth:
  "Your current portfolio health is",

excellent:
  "Excellent",

noData:
  "No Data",

needsAttention:
  "Needs Attention",

average:
  "Average",

portfolioRepresents:
  "represents",

aiRecommendation:
  "AI Recommendation",

highlyConcentratedPortfolio:
  "Your portfolio is highly concentrated in one asset. Consider diversifying into ETFs, Gold, or Bonds to reduce risk.",

reasonablyDiversifiedPortfolio:
  "Your portfolio is reasonably diversified. Continue investing consistently and review allocations monthly.",

  },

  /* =====================================================
     BANGLA
  ===================================================== */

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

    yourSmartCFO:
      "আপনার স্মার্ট CFO",

    personalAIFinancialCoach:
      "আপনার ব্যক্তিগত AI অর্থ কোচ",

    nextAction:
      "পরবর্তী পদক্ষেপ",

    aiOpportunitiesDiscovered:
      "{count}টি AI সুযোগ পাওয়া গেছে",

    unlockCompleteSmartCFO:
      "সম্পূর্ণ Smart CFO বিশ্লেষণ দেখুন",

    hiddenMoneyPatterns:
      "টাকার লুকানো ধরণগুলো খুঁজে দেখুন।",

    unlockAIInsights:
      "AI ইনসাইট আনলক করুন",

    allSmartCFOInsightsUnlocked:
      "সব Smart CFO ইনসাইট আনলক হয়েছে",

    globalBenchmark:
      "বিশ্বের তুলনা",

    spendingPositionWorldwide:
      "বিশ্বে আপনার খরচের অবস্থান",

    compareGlobalSpendingPatterns:
      "বিশ্বের খরচের ধরণের সাথে আপনার অভ্যাস তুলনা করুন।",

    globalSpendingComparison:
      "বিশ্বব্যাপী খরচের তুলনা",

    shopping:
      "কেনাকাটা",

    food:
      "খাবার",

    monthlySpending:
      "মাসিক খরচ",

    overallSpendingHealth:
      "সামগ্রিক খরচের অবস্থা",

    betterThanPercent:
      "{percent}% মানুষের চেয়ে ভালো",

    good:
      "ভালো",

    healthierThanBenchmarkUsers:
      "আপনার খরচের অভ্যাস বেশিরভাগ ব্যবহারকারীর তুলনায় ভালো।",

    savingMoreThanLastMonth:
      "গত মাসের তুলনায় আপনি ১৮% বেশি সঞ্চয় করছেন।",

    keepBuildingStrongHabits:
      "এভাবেই চালিয়ে যান। আপনি ভালো আর্থিক অভ্যাস গড়ে তুলছেন।",

    currentBalance:
      "বর্তমান ব্যালেন্স",

    thisMonth:
      "এই মাসে",

    availableCash:
      "হাতে থাকা টাকা",

    incomeMinusExpenses:
      "আয় − খরচ",

    analytics:
      "অ্যানালিটিক্স",

    exploreMoneyAnalytics:
      "মানি অ্যানালিটিক্স দেখুন",

    moneyAnalyticsDescription:
      "বিস্তারিত খরচের হিসাব, আয়ের উৎস, ক্যাটাগরির প্রবণতা, আর্থিক অবস্থা এবং AI ইনসাইট দেখুন।",

    recentActivity:
      "সাম্প্রতিক কার্যক্রম",

    addFirstTransaction:
      "আপনার প্রথম আয়, খরচ বা বিনিয়োগ যোগ করুন।",

    aiFinancialInsights:
  "AI আর্থিক বিশ্লেষণ",

todaysSummary:
  "আজকের সারাংশ",

largestExpense:
  "সবচেয়ে বড় খরচ",

mainIncome:
  "প্রধান আয়ের উৎস",

savingRate:
  "সঞ্চয়ের হার",

highestSpending:
  "সর্বোচ্চ খরচ",

noExpense:
  "কোনো খরচ নেই",

noIncome:
  "কোনো আয় নেই",

  financialTrend:
  "আর্থিক প্রবণতা",

portfolioGrowth:
  "বিনিয়োগ পোর্টফোলিওর অগ্রগতি",

trackPortfolioGrowth:
  "আপনার বিনিয়োগ পোর্টফোলিওর বৃদ্ধি দেখুন।",

noPortfolioHistory:
  "এখনও কোনো পোর্টফোলিও ইতিহাস নেই।",

portfolioValue:
  "পোর্টফোলিওর মূল্য",

aiPortfolioInsights:
  "AI পোর্টফোলিও বিশ্লেষণ",

personalizedPortfolioRecommendations:
  "আপনার পোর্টফোলিওর ভিত্তিতে ব্যক্তিগত পরামর্শ।",

portfolioHealth:
  "পোর্টফোলিওর অবস্থা",

currentPortfolioHealth:
  "আপনার বর্তমান পোর্টফোলিওর অবস্থা হলো",

excellent:
  "চমৎকার",

noData:
  "তথ্য নেই",

needsAttention:
  "মনোযোগ প্রয়োজন",

average:
  "গড়",

portfolioRepresents:
  "আপনার পোর্টফোলিওর",

aiRecommendation:
  "AI পরামর্শ",

highlyConcentratedPortfolio:
  "আপনার পোর্টফোলিও একটি সম্পদের ওপর বেশি নির্ভরশীল। ঝুঁকি কমাতে ETF, গোল্ড বা বন্ডে বৈচিত্র্য আনার কথা বিবেচনা করুন।",

reasonablyDiversifiedPortfolio:
  "আপনার পোর্টফোলিও মোটামুটি বৈচিত্র্যপূর্ণ। নিয়মিত বিনিয়োগ চালিয়ে যান এবং প্রতি মাসে বিনিয়োগের ভাগ পর্যালোচনা করুন।",
  },
};