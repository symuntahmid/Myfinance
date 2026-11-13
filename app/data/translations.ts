export type TranslationKey =
  | "wealthHub"
  | "dashboard"
  | "profile"
  | "myMoney"
  | "investments"
  | "reports"
  | "settings"
  | "settingsDescription"
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

  // Financial Trend
  | "financialTrendDescription"
  | "notEnoughDataYet"
  | "addDataToSeeFinancialTrend"

  // Portfolio Growth
  | "portfolioGrowth"
  | "trackPortfolioGrowth"
  | "noPortfolioHistory"
  | "portfolioValue"

  // AI Portfolio Insights
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
  | "reasonablyDiversifiedPortfolio"

  // Reports
  | "monthlyReport"
  | "monthlyReportDescription"
  | "monthlyOverview"
  | "monthlyOverviewDescription"
  | "moneyReceivedThisMonth"
  | "moneySpentThisMonth"
  | "investedThisMonth"
  | "moneyAllocatedToInvestments"
  | "netCashFlow"
  | "cashRemainingAfterActivity"
  | "cashFlow"
  | "cashFlowDescription"
  | "savingsRateDescription"
  | "investmentPerformance"
  | "investmentPerformanceDescription"
  | "totalInvested"
  | "profitLoss"
  | "expenseBreakdown"
  | "expenseBreakdownDescription"
  | "percentOfExpenses"
  | "latestFinancialActivity"
  | "noFinancialActivity"
  | "netWorthDescription"
  | "reportWaitingForData"
  | "addDataToBuildReport"

  // Financial Health
  | "financialHealth"
  | "critical"
  | "fair"
  | "financialHealthDescription"

  // Streak freeze
  | "streakFreezes"
  | "streakFreezeHint"
  | "streakFreezeUsed"

  // Bills and net worth
  | "heroAdd"
  | "heroMove"
  | "heroThisMonth"
  | "heroSinceLast"
  | "noBillsShort"
  | "accountsCount"
  | "moneyMapTitle"
  | "pfSavedMonth"
  | "pfSavingRate"
  | "pfBadges"
  | "pfNoBadges"
  | "pfNextBadge"
  | "pfThisWeek"
  | "pfMaxLevel"
  | "pfXpTotal"
  | "statNet"
  | "statIncome"
  | "statExpense"
  | "statInvest"
  | "heroStreak"
  | "heroFreezes"
  | "heroTasks"
  | "greetingMorning"
  | "greetingAfternoon"
  | "greetingEvening"
  | "greetingNight"
  | "smsAutoTitle"
  | "smsAutoSubtitle"
  | "billsTitle"
  | "billsSubtitle"
  | "addBillTitle"
  | "billNamePlaceholder"
  | "billAmountLabel"
  | "billDayLabel"
  | "billPayFrom"
  | "billCategoryLabel"
  | "billMarkPaid"
  | "billUndo"
  | "billPaid"
  | "billOverdue"
  | "billDueToday"
  | "billDueIn"
  | "billMonthlyTotal"
  | "billsEmpty"
  | "billsCardNone"
  | "billsCardNext"
  | "billDeleteConfirm"
  | "netWorthTitle"
  | "netWorthSubtitle"
  | "netWorthOwn"
  | "netWorthOwe"
  | "netWorthAccounts"
  | "netWorthGoals"
  | "netWorthInvestments"
  | "netWorthChange"
  | "addDebt"
  | "debtNamePlaceholder"
  | "debtAmountLabel"
  | "debtsEmpty"
  | "netWorthCardTitle"
  | "billDueReminder"

  // Monthly plan
  | "planNewCategory"
  | "planCategoryPlaceholder"
  | "planCategoryExists"
  | "planDeleteCategory"
  | "planCardTitle"
  | "planCardEmpty"
  | "planOpen"
  | "planOverspentCount"
  | "planTitle"
  | "planSubtitle"
  | "planReadyToAssign"
  | "planAllAssigned"
  | "planOverAssigned"
  | "planAssigned"
  | "planSpent"
  | "planAvailable"
  | "planCopyLast"
  | "planSetBalances"
  | "planHint"
  | "planOverspent"
  | "planLink"

  // Accounts
  | "accountsTitle"
  | "accountsSubtitle"
  | "totalBalance"
  | "addAccount"
  | "accountNameLabel"
  | "accountNamePlaceholder"
  | "currentBalanceLabel"
  | "transferMoney"
  | "transferFromLabel"
  | "transferToLabel"
  | "transferAmountLabel"
  | "transferFeeLabel"
  | "transferDifferent"
  | "transferNotEnough"
  | "fixBalance"
  | "saveLabel"
  | "cancelLabel"
  | "accountsHint"
  | "deleteAccountConfirm"
  | "accountsLink"
  | "cashMoveToCash"
  | "cashMoveHint"

  // Custom reminders
  | "myRemindersTitle"
  | "reminderTitlePlaceholder"
  | "reminderDateLabel"
  | "repeatLabel"
  | "repeatOnce"
  | "repeatMonthly"
  | "repeatYearly"
  | "addReminderButton"
  | "noCustomReminders"
  | "reminderDueToday"
  | "reminderDueTomorrow"
  | "reminderDueInDays"
  | "deleteLabel"

  // Today coach
  | "coachTitle"
  | "coachOpenQuickAdd"
  | "coachOpenGoals"
  | "coachOpenReports"
  | "salaryDayLabel"
  | "rentDayLabel"
  | "dayOfMonthHint"
  | "dayNotSet"
  | "reminderSalaryToday"
  | "reminderSalaryTomorrow"
  | "reminderRentToday"
  | "reminderRentSoon"
  | "reminderEidFitr"
  | "reminderEidAdha"
  | "reminderRamadan"
  | "nudgeFirstEntry"
  | "nudgeLogToday"
  | "nudgeSpendingUp"
  | "nudgeSpendingDown"
  | "nudgeTopCategory"
  | "nudgeLowSavings"
  | "nudgeGoodSavings"
  | "nudgeTip1"
  | "nudgeTip2"
  | "nudgeTip3"
  | "nudgeTip4"
  | "nudgeTip5"

  // Goals page
  | "goalsTitle"
  | "goalsSubtitle"
  | "addGoal"
  | "activeGoals"
  | "goalsCompleted"
  | "savedLabel"
  | "goalCompletion"
  | "noGoalsYet"
  | "createFirstGoal"
  | "createGoal"
  | "goalOptions"
  | "editGoal"
  | "deleteGoal"
  | "deleteGoalConfirm"
  | "goalReached"
  | "goalLabel"
  | "addMoney"
  | "withdrawMoney"
  | "withdrawShort"
  | "addMoneyDescription"
  | "withdrawDescription"
  | "selectedGoal"
  | "enterAmount"
  | "amountOfTarget"
  | "availableShort"
  | "enterValidAmount"
  | "notEnoughCash"
  | "notEnoughInGoal"
  | "createGoalDescription"
  | "goalName"
  | "goalNamePlaceholder"
  | "emojiLabel"
  | "targetAmount"
  | "targetDate"
  | "saveChanges"
  | "enterGoalName"
  | "enterValidTarget"

  // Settings
  | "account"
  | "financialIdentity"
  | "regionalPreferences"
  | "country"
  | "language"
  | "currency"
  | "preferences"
  | "reminders"
  | "enabled"
  | "disabled"
  | "darkMode"
  | "yourData"
  | "exportData"
  | "downloadBackup"
  | "importData"
  | "restoreBackup"
  | "passcodeLock"
  | "notEnabled"
  | "deleteAccountData"
  | "permanentlyRemoveData"
  | "support"
  | "rateMyFinance"
  | "tellUsWhatYouThink"
  | "sendFeedback"
  | "helpUsImprove"
  | "termsPrivacy"
  | "privacyPolicy"
  | "termsOfUse"
  | "logOut"
  | "signOutOfMyFinance"
  | "savePreferences"
  | "keepFinancialHabits"
  | "financialReminders"
  | "protectAccountWithPasscode"
  | "setupPasscode"
  | "useFourToSixDigitPasscode"
  | "createPasscode"
  | "enterFourToSixDigits"
  | "continue"
  | "confirmPasscode"
  | "enterPasscodeAgain"
  | "passcodesDoNotMatch"
  | "enablePasscodeLock"
  | "passcodeLockEnabled"
  | "accountProtected"
  | "disablePasscodeLock"
  | "tellUsHowToImprove"
  | "writeFeedback"
  | "thankYouForFeedback"
  | "deleteAccountDataQuestion"
  | "deleteAccountWarning"
  | "cancel"
  | "deleteData"
  | "youHaveBeenLoggedOut";
type LanguageTranslation = Record<TranslationKey, string>;

export const translations: Record<
  "en" | "bn",
  LanguageTranslation
> = {
  /* =====================================================
     ENGLISH
  ===================================================== */

en: {
  wealthHub: "Your Personal Wealth Hub",
  dashboard: "Dashboard",
  profile: "Profile",
  myMoney: "My Money",
  investments: "My Investments",
  reports: "Reports",
  settings: "Settings",
  settingsDescription:
    "Manage your account and MyFinance preferences.",

  myProfile: "My Profile",
  profileDescription:
    "Your financial identity, progress, and money habits.",
  editProfile: "Edit Profile",
  developerMode: "Developer Mode",
  financialLevel: "Financial Level",
  buildingFinancialConfidence:
    "Building financial confidence",
  moneySystemMessage:
    "You are building a stronger money system. Small actions create long-term wealth.",

  more: "More",
  moneyStreak: "Money Streak",
  keepGoing: "Keep Going",
  dailyJourneyMessage:
    "Complete your Daily Journey every day to build your streak.",
  days: "Days",
  dayStreak: "Day Streak",
  dailyJourney: "Daily Journey",
  today: "Today",

  investmentPortfolio: "Investment Portfolio",
  assets: "Assets",
  invested: "Invested",
  currentValue: "Current Value",
  profit: "Profit",
  return: "Return",

  welcomeBack: "Welcome back",
  dailyJourneyComplete:
    "Congratulations! You completed today's Daily Journey. Come back tomorrow for a new challenge.",
  dailyJourneyChallenge:
    "Complete today's Daily Journey and earn +45 XP.",
  xpUntilLevel:
    "Only {xp} XP until Level {level}!",
  buildBetterMoneyHabits:
    "Build Better Money Habits",
  progress: "Progress",
  done: "Done",
  complete: "Complete",
  xpEarnedMessage:
    "XP earned. Your money habits are improving.",

  trackExpense: "Track one expense",
  reviewSpending: "Review your spending",
  betterMoneyDecision:
    "Make one better money decision",

  level: "Level",
  netWorth: "Net Worth",
  monthlyIncome: "Monthly Income",
  expenses: "Expenses",

  myFutureGoals: "My Future Goals",
  startYourJourney: "Start your journey",
  milestonesInProgress:
    "{count} milestone{plural} in progress",
  savedOf: "{saved} saved of {target}",
  createFirstSavingsGoal:
    "Create your first savings goal and build your future.",
  yourProgress: "Your progress",
  goalCompleted:
    "🎉 Goal completed! Amazing work.",
  keepGoingFuture:
    "🚀 Keep going, your future is getting closer.",

  monthlyBudget: "Monthly Budget",
  used: "Used",
  budget: "Budget",
  spent: "Spent",
  remaining: "Remaining",

  financialInsights: "Financial Insights",
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

  netWorthTrend: "Net Worth Trend",
  growingSteadily: "Growing steadily",
  cashFlowOverview: "Cash Flow Overview",
  incomeVsExpenses: "Income vs Expenses",
  compareMonthlyMoneyFlow:
    "Compare your monthly money flow",

  income: "Income",
  expense: "Expense",
  investment: "Investment",
  investmentAllocation: "Investment Allocation",
  portfolioDiversification:
    "Portfolio Diversification",
  assetsCategories:
    "{assets} Assets • {categories} Categories",
  largestHolding: "Largest Holding",
  noInvestmentsYet: "No investments yet",

  recentTransactions: "Recent Transactions",
  viewAll: "View All",
  noTransactionsYet: "No transactions yet",
  latestTransactionsMessage:
    "Your latest transactions will appear here.",

  type: "Type",
  source: "Source",
  category: "Category",
  amount: "Amount",

  yourSmartCFO: "Your Smart CFO",
  personalAIFinancialCoach:
    "Your personal AI financial coach",
  nextAction: "Next Action",

  globalBenchmark: "Global Benchmark",
  spendingPositionWorldwide:
    "Your spending position worldwide",
  compareGlobalSpendingPatterns:
    "Compare your habits with global spending patterns.",
  globalSpendingComparison:
    "Global spending comparison",

  shopping: "Shopping",
  food: "Food",
  monthlySpending: "Monthly spending",
  overallSpendingHealth:
    "Overall spending health",
  betterThanPercent:
    "Better than {percent}%",
  good: "GOOD",
  healthierThanBenchmarkUsers:
    "Your spending habits are healthier than most benchmark users.",
  savingMoreThanLastMonth:
    "You're saving 18% more than last month.",
  keepBuildingStrongHabits:
    "Keep it up. You're building strong financial habits.",

  currentBalance: "Current Balance",
  thisMonth: "This Month",
  availableCash: "Available Cash",
  incomeMinusExpenses:
    "Income − Expenses",

  analytics: "Analytics",
  exploreMoneyAnalytics:
    "Explore Money Analytics",
  moneyAnalyticsDescription:
    "View detailed expense breakdown, income sources, category trends, financial health and AI insights.",

  recentActivity: "Recent Activity",
  addFirstTransaction:
    "Add your first income, expense or investment.",

  aiFinancialInsights:
    "AI Financial Insights",
  todaysSummary: "Today's Summary",
  largestExpense: "Largest Expense",
  mainIncome: "Main Income",
  savingRate: "Saving Rate",
  highestSpending: "Highest Spending",
  noExpense: "No expense",
  noIncome: "No income",

  financialTrend: "Financial Trend",
  financialTrendDescription:
    "Your financial activity over the last six months.",
  notEnoughDataYet: "Not enough data yet",
  addDataToSeeFinancialTrend:
    "Add income, expenses, or investments to see your financial trend.",

  // Portfolio Growth
  portfolioGrowth: "Portfolio Growth",
  trackPortfolioGrowth:
    "Track the growth of your investment portfolio.",
  noPortfolioHistory:
    "No portfolio history yet.",
  portfolioValue: "Portfolio Value",

  // AI Portfolio Insights
  aiPortfolioInsights:
    "AI Portfolio Insights",
  personalizedPortfolioRecommendations:
    "Personalized recommendations based on your portfolio.",
  portfolioHealth: "Portfolio Health",
  currentPortfolioHealth:
    "Your current portfolio health is",
  excellent: "Excellent",
  noData: "No Data",
  needsAttention: "Needs Attention",
  average: "Average",
  portfolioRepresents: "represents",
  aiRecommendation: "AI Recommendation",
  highlyConcentratedPortfolio:
    "Your portfolio is highly concentrated in one asset. Consider diversifying into ETFs, Gold, or Bonds to reduce risk.",
  reasonablyDiversifiedPortfolio:
    "Your portfolio is reasonably diversified. Continue investing consistently and review allocations monthly.",

  // Reports
  monthlyReport: "Monthly Report",
  monthlyReportDescription:
    "A clear picture of your financial performance this month.",
  monthlyOverview: "Monthly Overview",
  monthlyOverviewDescription:
    "How your money moved this month.",
  moneyReceivedThisMonth:
    "Money received this month",
  moneySpentThisMonth:
    "Money spent this month",
  investedThisMonth:
    "Invested This Month",
  moneyAllocatedToInvestments:
    "Money allocated to investments",
  netCashFlow: "Net Cash Flow",
  cashRemainingAfterActivity:
    "Cash remaining after this month's activity",
  cashFlow: "Cash Flow",
  cashFlowDescription:
    "Your income, spending, investments, and transfers.",
  savingsRateDescription:
    "Percentage of income remaining after this month's activity.",
  investmentPerformance:
    "Investment Performance",
  investmentPerformanceDescription:
    "Current value and performance of your portfolio.",
  totalInvested: "Total Invested",
  profitLoss: "Profit / Loss",
  expenseBreakdown: "Expense Breakdown",
  expenseBreakdownDescription:
    "Where your money went this month.",
  percentOfExpenses: "% of expenses",
  latestFinancialActivity:
    "Latest financial activity this month.",
  noFinancialActivity:
    "No financial activity recorded this month.",
  netWorthDescription:
    "Available cash + investment portfolio value.",
  reportWaitingForData:
    "Your report is waiting for real data.",
  addDataToBuildReport:
    "Add income, expenses, or investments to start building your financial report.",

  // Financial Health
  financialHealth: "Financial Health",
  critical: "Critical",
  fair: "Fair",
  financialHealthDescription:
    "Based on your actual income, expenses, savings, investments and financial activity this month.",

  // Streak freeze
  streakFreezes: "Streak freezes",
  streakFreezeHint:
    "A freeze saves your streak if you miss a day. Earn one every 7 days.",
  streakFreezeUsed:
    "A freeze saved your {streak}-day streak!",

  planCardTitle:
    "This month's plan",
  planCardEmpty:
    "Give your money a job. Start your monthly plan.",
  planOpen:
    "Open plan",
  planOverspentCount:
    "{count} category overspent",
  planNewCategory:
    "New category",
  planCategoryPlaceholder:
    "e.g. Eid shopping, Mom's medicine",
  planCategoryExists:
    "This category already exists.",
  planDeleteCategory:
    "Remove this category? Your past spending stays.",
  smsAutoTitle:
    "Automatic SMS setup",
  smsAutoSubtitle:
    "Open MyFinance from a bKash or Nagad SMS",
  heroStreak:
    "day streak",
  heroFreezes:
    "freezes",
  heroTasks:
    "tasks done today",
  greetingMorning:
    "Good morning",
  greetingAfternoon:
    "Good afternoon",
  greetingEvening:
    "Good evening",
  greetingNight:
    "Good night",
  statNet:
    "Financial foundation",
  statIncome:
    "Money coming in",
  statExpense:
    "Money going out",
  statInvest:
    "Future wealth",
  heroAdd:
    "Add",
  heroMove:
    "Move",
  heroThisMonth:
    "This month",
  heroSinceLast:
    "{amount} since last month",
  noBillsShort:
    "No bills added",
  accountsCount:
    "{count} accounts",
  moneyMapTitle:
    "Your money",
  pfSavedMonth:
    "Saved this month",
  pfSavingRate:
    "Saving rate",
  pfBadges:
    "Badges",
  pfNoBadges:
    "Keep tracking and learning to unlock your first badge.",
  pfNextBadge:
    "Next badge",
  pfThisWeek:
    "This week",
  pfMaxLevel:
    "Top level reached",
  pfXpTotal:
    "{xp} XP",
  // Bills and net worth
  billsTitle:
    "Bills",
  billsSubtitle:
    "Bills that repeat every month",
  addBillTitle:
    "Add a bill",
  billNamePlaceholder:
    "e.g. House rent, Internet",
  billAmountLabel:
    "Amount",
  billDayLabel:
    "Due day (1-31)",
  billPayFrom:
    "Pay from",
  billCategoryLabel:
    "Category",
  billMarkPaid:
    "Mark paid",
  billUndo:
    "Undo",
  billPaid:
    "Paid ✓",
  billOverdue:
    "Overdue",
  billDueToday:
    "Due today",
  billDueIn:
    "Due in {days} day(s)",
  billMonthlyTotal:
    "Total bills each month",
  billsEmpty:
    "No bills yet. Add rent, internet, school fee...",
  billsCardNone:
    "Add your monthly bills",
  billsCardNext:
    "Next: {name}",
  billDeleteConfirm:
    "Delete this bill? Past payments stay.",
  netWorthTitle:
    "Net worth",
  netWorthSubtitle:
    "What you own minus what you owe",
  netWorthOwn:
    "What you own",
  netWorthOwe:
    "What you owe",
  netWorthAccounts:
    "Money in accounts",
  netWorthGoals:
    "Saved in goals",
  netWorthInvestments:
    "Investments",
  netWorthChange:
    "{amount} since last month",
  addDebt:
    "Add a debt",
  debtNamePlaceholder:
    "e.g. Bank loan, Borrowed from friend",
  debtAmountLabel:
    "Still owed",
  debtsEmpty:
    "No debts. Add a loan if you have one.",
  netWorthCardTitle:
    "Net worth",
  billDueReminder:
    "Bill: {name} ({amount})",

  // Monthly plan
  planTitle:
    "Monthly plan",
  planSubtitle:
    "Give every taka a job",
  planReadyToAssign:
    "Ready to assign",
  planAllAssigned:
    "Every taka has a job ✓",
  planOverAssigned:
    "You gave jobs to more money than you have. Lower some amounts.",
  planAssigned:
    "Assigned",
  planSpent:
    "Spent",
  planAvailable:
    "Left",
  planCopyLast:
    "Copy last month's plan",
  planSetBalances:
    "First set your real balances in Accounts. Your money there is what you can plan.",
  planHint:
    "Tap an amount in Assigned and type how much of your money each category gets this month. What you don't spend stays in the category for next month.",
  planOverspent:
    "Overspent",
  planLink:
    "Plan",

  // Accounts
  accountsTitle:
    "Accounts",
  accountsSubtitle:
    "Where your money sits",
  totalBalance:
    "Total balance",
  addAccount:
    "Add account",
  accountNameLabel:
    "Account name",
  accountNamePlaceholder:
    "e.g. bKash, Nagad, DBBL",
  currentBalanceLabel:
    "Balance today",
  transferMoney:
    "Move money",
  transferFromLabel:
    "From",
  transferToLabel:
    "To",
  transferAmountLabel:
    "Amount",
  transferFeeLabel:
    "Fee (optional)",
  transferDifferent:
    "Choose two different accounts.",
  transferNotEnough:
    "Enter an amount.",
  fixBalance:
    "Fix balance",
  saveLabel:
    "Save",
  cancelLabel:
    "Cancel",
  accountsHint:
    "Set each account to the real balance you have today. Moving money between accounts is not spending. Only the fee counts.",
  deleteAccountConfirm:
    "Delete this account? Your transactions stay.",
  accountsLink:
    "Accounts",
  cashMoveToCash:
    "Move to Cash",
  cashMoveHint:
    "Cash out is a transfer. Your cash goes up, bKash goes down. Only the fee is spending.",

  // Custom reminders
  myRemindersTitle:
    "Your reminders",
  reminderTitlePlaceholder:
    "e.g. Electricity bill",
  reminderDateLabel:
    "Date",
  repeatLabel:
    "Repeat",
  repeatOnce:
    "Once",
  repeatMonthly:
    "Every month",
  repeatYearly:
    "Every year",
  addReminderButton:
    "Add reminder",
  noCustomReminders:
    "No reminders yet. Add your first one above.",
  reminderDueToday:
    "Today: {title}",
  reminderDueTomorrow:
    "Tomorrow: {title}",
  reminderDueInDays:
    "In {days} days: {title}",
  deleteLabel:
    "Delete",

  // Today coach
  coachTitle:
    "Today's coach",
  coachOpenQuickAdd:
    "Add now",
  coachOpenGoals:
    "Open goals",
  coachOpenReports:
    "See details",
  salaryDayLabel:
    "Salary day",
  rentDayLabel:
    "Rent day",
  dayOfMonthHint:
    "Day of the month (1-31)",
  dayNotSet:
    "Not set",
  reminderSalaryToday:
    "Salary day! Move part of it into a goal first, before spending.",
  reminderSalaryTomorrow:
    "Salary is expected tomorrow. Decide now how much you will save.",
  reminderRentToday:
    "Rent is due today.",
  reminderRentSoon:
    "Rent is due in {days} day(s). Keep the money aside.",
  reminderEidFitr:
    "Eid is close. A small amount in your Eid goal today will help.",
  reminderEidAdha:
    "Eid-ul-Adha is close. Plan your Qurbani costs now.",
  reminderRamadan:
    "Ramadan: plan iftar and Sehri costs for the week.",
  nudgeFirstEntry:
    "Start with your first entry. It takes 10 seconds.",
  nudgeLogToday:
    "Nothing logged today. Add what you spent so your streak stays strong.",
  nudgeSpendingUp:
    "You spent {percent}% more this week than last week.",
  nudgeSpendingDown:
    "Well done! You spent {percent}% less than last week.",
  nudgeTopCategory:
    "{category} is {percent}% of your spending this week.",
  nudgeLowSavings:
    "You are saving very little this month. Try putting a small amount into a goal.",
  nudgeGoodSavings:
    "You are saving over 20% of your income this month. Keep going!",
  nudgeTip1:
    "Write down every expense today, even small ones.",
  nudgeTip2:
    "Save first, spend what is left.",
  nudgeTip3:
    "Wait one day before any non-essential purchase.",
  nudgeTip4:
    "Check your goals. Even a small deposit counts.",
  nudgeTip5:
    "Look at your biggest category this month. Can you trim it a little?",

  // Goals page
  goalsTitle:
    "Financial Goals",
  goalsSubtitle:
    "Every bit you save today brings you one step closer to the life you truly want.",
  addGoal:
    "Add Goal",
  activeGoals:
    "Active Goals",
  goalsCompleted:
    "Completed",
  savedLabel:
    "Saved",
  goalCompletion:
    "Goal Completion",
  noGoalsYet:
    "No goals yet",
  createFirstGoal:
    "Create your first financial goal.",
  createGoal:
    "Create Goal",
  goalOptions:
    "Goal options",
  editGoal:
    "Edit Goal",
  deleteGoal:
    "Delete Goal",
  deleteGoalConfirm:
    "Delete this goal?",
  goalReached:
    "Goal Completed",
  goalLabel:
    "Goal",
  addMoney:
    "Add Money",
  withdrawMoney:
    "Withdraw Money",
  withdrawShort:
    "Withdraw",
  addMoneyDescription:
    "Transfer money into this goal.",
  withdrawDescription:
    "Move money back to Available Cash.",
  selectedGoal:
    "Selected Goal",
  enterAmount:
    "Enter amount",
  amountOfTarget:
    "{saved} of {target}",
  availableShort:
    "Available",
  enterValidAmount:
    "Please enter a valid amount.",
  notEnoughCash:
    "Not enough available cash.",
  notEnoughInGoal:
    "Not enough money in this goal.",
  createGoalDescription:
    "Start saving toward something meaningful.",
  goalName:
    "Goal Name",
  goalNamePlaceholder:
    "Japan Trip",
  emojiLabel:
    "Emoji",
  targetAmount:
    "Target Amount",
  targetDate:
    "Target Date",
  saveChanges:
    "Save Changes",
  enterGoalName:
    "Please enter a goal name.",
  enterValidTarget:
    "Please enter a valid target amount.",

  // Settings

  account: "Account",
  financialIdentity:
    "Your financial identity",

  regionalPreferences:
    "Regional Preferences",
  country: "Country",
  language: "Language",
  currency: "Currency",

  preferences: "Preferences",
  reminders: "Reminders",
  enabled: "Enabled",
  disabled: "Disabled",
  darkMode: "Dark Mode",

  yourData: "Your Data",
  exportData: "Export Data",
  downloadBackup:
    "Download a backup of your MyFinance data",
  importData: "Import Data",
  restoreBackup:
    "Restore a previous backup",
  passcodeLock: "Passcode Lock",
  notEnabled: "Not enabled",
  deleteAccountData:
    "Delete Account Data",
  permanentlyRemoveData:
    "Permanently remove your MyFinance data",

  support: "Support",
  rateMyFinance: "Rate MyFinance",
  tellUsWhatYouThink:
    "Tell us what you think",
  sendFeedback: "Send Feedback",
  helpUsImprove:
    "Help us improve MyFinance",

  termsPrivacy: "Terms & Privacy",
  privacyPolicy: "Privacy Policy",
  termsOfUse: "Terms of Use",

  logOut: "Log Out",
  signOutOfMyFinance:
    "Sign out of MyFinance",

  savePreferences:
    "Save Preferences",
  keepFinancialHabits:
    "Keep building strong financial habits",
  financialReminders:
    "Financial reminders",
  protectAccountWithPasscode:
    "Protect your account with a passcode",
  setupPasscode:
    "Set up a passcode",
  useFourToSixDigitPasscode:
    "Use a 4–6 digit passcode to protect your account",

  createPasscode: "Create Passcode",
  enterFourToSixDigits:
    "Enter a 4–6 digit passcode",
  continue: "Continue",
  confirmPasscode:
    "Confirm Passcode",
  enterPasscodeAgain:
    "Enter your passcode again",
  passcodesDoNotMatch:
    "Passcodes do not match",

  enablePasscodeLock:
    "Enable Passcode Lock",
  passcodeLockEnabled:
    "Passcode Lock Enabled",
  accountProtected:
    "Your account is protected",
  disablePasscodeLock:
    "Disable Passcode Lock",

  tellUsHowToImprove:
    "Tell us how we can improve MyFinance",
  writeFeedback:
    "Write your feedback",
  thankYouForFeedback:
    "Thank you for your feedback!",

  deleteAccountDataQuestion:
    "Delete all account data?",
  deleteAccountWarning:
    "This will permanently delete your MyFinance data and cannot be undone.",
  cancel: "Cancel",
  deleteData: "Delete Data",

  youHaveBeenLoggedOut:
  "You have been logged out.",
  
},

  /* =====================================================
     BANGLA
  ===================================================== */

bn: {
  wealthHub: "আপনার ব্যক্তিগত সম্পদ কেন্দ্র",
  dashboard: "ড্যাশবোর্ড",
  profile: "প্রোফাইল",
  myMoney: "আমার টাকা",
  investments: "আমার বিনিয়োগ",
  reports: "রিপোর্ট",
  settings: "সেটিংস",
  settingsDescription:
    "আপনার অ্যাকাউন্ট এবং MyFinance-এর পছন্দসমূহ পরিচালনা করুন।",

  myProfile: "আমার প্রোফাইল",
  profileDescription:
    "আপনার আর্থিক পরিচয়, অগ্রগতি এবং অর্থ ব্যবস্থাপনার অভ্যাস।",
  editProfile: "প্রোফাইল সম্পাদনা করুন",
  developerMode: "ডেভেলপার মোড",
  financialLevel: "আর্থিক স্তর",
  buildingFinancialConfidence:
    "আর্থিক আত্মবিশ্বাস তৈরি হচ্ছে",
  moneySystemMessage:
    "আপনি একটি শক্তিশালী অর্থ ব্যবস্থাপনা ব্যবস্থা তৈরি করছেন। ছোট ছোট পদক্ষেপ দীর্ঘমেয়াদে সম্পদ তৈরি করে।",

  more: "আরও",
  moneyStreak: "অর্থ ব্যবস্থাপনার ধারাবাহিকতা",
  keepGoing: "চালিয়ে যান",
  dailyJourneyMessage:
    "আপনার ধারাবাহিকতা বজায় রাখতে প্রতিদিনের ডেইলি জার্নি সম্পন্ন করুন।",
  days: "দিন",
  dayStreak: "দিনের ধারাবাহিকতা",
  dailyJourney: "ডেইলি জার্নি",
  today: "আজ",

  investmentPortfolio: "বিনিয়োগ পোর্টফোলিও",
  assets: "সম্পদ",
  invested: "বিনিয়োগ করা হয়েছে",
  currentValue: "বর্তমান মূল্য",
  profit: "লাভ",
  return: "রিটার্ন",

  welcomeBack: "আবারও স্বাগতম",
  dailyJourneyComplete:
    "অভিনন্দন! আপনি আজকের ডেইলি জার্নি সম্পন্ন করেছেন। নতুন চ্যালেঞ্জের জন্য আগামীকাল আবার আসুন।",
  dailyJourneyChallenge:
    "আজকের ডেইলি জার্নি সম্পন্ন করুন এবং +45 XP অর্জন করুন।",
  xpUntilLevel:
    "লেভেল {level} পেতে আর মাত্র {xp} XP!",
  buildBetterMoneyHabits:
    "আরও ভালো অর্থ ব্যবস্থাপনার অভ্যাস তৈরি করুন",
  progress: "অগ্রগতি",
  done: "সম্পন্ন",
  complete: "সম্পূর্ণ করুন",
  xpEarnedMessage:
    "XP অর্জিত হয়েছে। আপনার অর্থ ব্যবস্থাপনার অভ্যাস উন্নত হচ্ছে।",

  trackExpense: "একটি খরচ হিসাব করুন",
  reviewSpending: "আপনার খরচ পর্যালোচনা করুন",
  betterMoneyDecision:
    "আরও ভালো একটি আর্থিক সিদ্ধান্ত নিন",

  level: "লেভেল",
  netWorth: "নিট সম্পদ",
  monthlyIncome: "মাসিক আয়",
  expenses: "খরচ",

  myFutureGoals: "আমার ভবিষ্যৎ লক্ষ্য",
  startYourJourney: "আপনার যাত্রা শুরু করুন",
  milestonesInProgress:
    "{count}টি মাইলস্টোন চলমান",
  savedOf: "{target}-এর মধ্যে {saved} সঞ্চয় হয়েছে",
  createFirstSavingsGoal:
    "আপনার প্রথম সঞ্চয় লক্ষ্য তৈরি করুন এবং ভবিষ্যৎ গড়ে তুলুন।",
  yourProgress: "আপনার অগ্রগতি",
  goalCompleted:
    "🎉 লক্ষ্য সম্পন্ন! অসাধারণ কাজ।",
  keepGoingFuture:
    "🚀 চালিয়ে যান, আপনার ভবিষ্যৎ আরও কাছে চলে আসছে।",

  monthlyBudget: "মাসিক বাজেট",
  used: "ব্যবহৃত",
  budget: "বাজেট",
  spent: "খরচ হয়েছে",
  remaining: "অবশিষ্ট",

  financialInsights: "আর্থিক ইনসাইট",
  personalizedObservations:
    "আপনার আর্থিক তথ্যের ভিত্তিতে ব্যক্তিগত পর্যবেক্ষণ।",
  addFirstIncome:
    "হিসাব শুরু করতে আপনার প্রথম আয় যোগ করুন।",
  excellentSavings:
    "চমৎকার! আপনি আপনার আয়ের ৫০%-এর বেশি সঞ্চয় করছেন।",
  healthySavings:
    "দারুণ! আপনার সঞ্চয়ের হার ভালো।",
  consistentSavings:
    "আপনি নিয়মিত সঞ্চয় করছেন। এই ধারাবাহিকতা বজায় রাখুন।",
  reduceExpenses:
    "সঞ্চয় বাড়াতে অপ্রয়োজনীয় খরচ কমানোর চেষ্টা করুন।",
  investmentsMajorWealth:
    "আপনার বিনিয়োগ আপনার মোট সম্পদের একটি গুরুত্বপূর্ণ অংশ হয়ে উঠছে।",
  expensesHigherIncome:
    "সতর্কতা: আপনার খরচ আপনার আয়ের চেয়ে বেশি।",

  netWorthTrend: "নিট সম্পদের প্রবণতা",
  growingSteadily: "ধীরে ধীরে বাড়ছে",
  cashFlowOverview: "ক্যাশ ফ্লো সারসংক্ষেপ",
  incomeVsExpenses: "আয় বনাম খরচ",
  compareMonthlyMoneyFlow:
    "আপনার মাসিক অর্থ প্রবাহ তুলনা করুন",

  income: "আয়",
  expense: "খরচ",
  investment: "বিনিয়োগ",
  investmentAllocation: "বিনিয়োগের বণ্টন",
  portfolioDiversification: "পোর্টফোলিও বৈচিত্র্য",
  assetsCategories:
    "{assets}টি সম্পদ • {categories}টি ক্যাটাগরি",
  largestHolding: "সবচেয়ে বড় বিনিয়োগ",
  noInvestmentsYet: "এখনও কোনো বিনিয়োগ নেই",

  recentTransactions: "সাম্প্রতিক লেনদেন",
  viewAll: "সব দেখুন",
  noTransactionsYet: "এখনও কোনো লেনদেন নেই",
  latestTransactionsMessage:
    "আপনার সর্বশেষ লেনদেন এখানে দেখা যাবে।",

  type: "ধরন",
  source: "উৎস",
  category: "ক্যাটাগরি",
  amount: "পরিমাণ",

  yourSmartCFO: "আপনার স্মার্ট CFO",
  personalAIFinancialCoach:
    "আপনার ব্যক্তিগত AI আর্থিক কোচ",
  nextAction: "পরবর্তী পদক্ষেপ",

  globalBenchmark: "বৈশ্বিক তুলনা",
  spendingPositionWorldwide:
    "বিশ্বব্যাপী আপনার খরচের অবস্থান",
  compareGlobalSpendingPatterns:
    "বিশ্বব্যাপী খরচের ধরণের সঙ্গে আপনার অভ্যাস তুলনা করুন।",
  globalSpendingComparison:
    "বৈশ্বিক খরচের তুলনা",

  shopping: "শপিং",
  food: "খাবার",
  monthlySpending: "মাসিক খরচ",
  overallSpendingHealth: "সামগ্রিক খরচের স্বাস্থ্য",
  betterThanPercent: "{percent}%-এর চেয়ে ভালো",
  good: "ভালো",
  healthierThanBenchmarkUsers:
    "আপনার খরচের অভ্যাস বেশিরভাগ তুলনামূলক ব্যবহারকারীর চেয়ে ভালো।",
  savingMoreThanLastMonth:
    "আপনি গত মাসের তুলনায় ১৮% বেশি সঞ্চয় করছেন।",
  keepBuildingStrongHabits:
    "চালিয়ে যান। আপনি শক্তিশালী আর্থিক অভ্যাস তৈরি করছেন।",

  currentBalance: "বর্তমান ব্যালেন্স",
  thisMonth: "এই মাস",
  availableCash: "উপলব্ধ নগদ",
  incomeMinusExpenses: "আয় − খরচ",

  analytics: "অ্যানালিটিক্স",
  exploreMoneyAnalytics: "মানি অ্যানালিটিক্স দেখুন",
  moneyAnalyticsDescription:
    "বিস্তারিত খরচের বিভাজন, আয়ের উৎস, ক্যাটাগরির প্রবণতা, আর্থিক স্বাস্থ্য এবং AI ইনসাইট দেখুন।",

  recentActivity: "সাম্প্রতিক কার্যক্রম",
  addFirstTransaction:
    "আপনার প্রথম আয়, খরচ বা বিনিয়োগ যোগ করুন।",

  aiFinancialInsights: "AI আর্থিক ইনসাইট",
  todaysSummary: "আজকের সারসংক্ষেপ",
  largestExpense: "সবচেয়ে বড় খরচ",
  mainIncome: "প্রধান আয়",
  savingRate: "সঞ্চয়ের হার",
  highestSpending: "সর্বোচ্চ খরচ",
  noExpense: "কোনো খরচ নেই",
  noIncome: "কোনো আয় নেই",

  financialTrend: "আর্থিক প্রবণতা",
  financialTrendDescription:
    "গত ছয় মাসের আপনার আর্থিক কার্যক্রম।",
  notEnoughDataYet: "এখনও পর্যাপ্ত তথ্য নেই",
  addDataToSeeFinancialTrend:
    "আপনার আর্থিক প্রবণতা দেখতে আয়, খরচ বা বিনিয়োগ যোগ করুন।",

  portfolioGrowth: "পোর্টফোলিও বৃদ্ধি",
  trackPortfolioGrowth:
    "আপনার বিনিয়োগ পোর্টফোলিওর বৃদ্ধি পর্যবেক্ষণ করুন।",
  noPortfolioHistory:
    "এখনও কোনো পোর্টফোলিও ইতিহাস নেই।",
  portfolioValue: "পোর্টফোলিও মূল্য",

  aiPortfolioInsights: "AI পোর্টফোলিও ইনসাইট",
  personalizedPortfolioRecommendations:
    "আপনার পোর্টফোলিওর ভিত্তিতে ব্যক্তিগতকৃত সুপারিশ।",
  portfolioHealth: "পোর্টফোলিও স্বাস্থ্য",
  currentPortfolioHealth:
    "আপনার বর্তমান পোর্টফোলিও স্বাস্থ্য হলো",
  excellent: "চমৎকার",
  noData: "কোনো তথ্য নেই",
  needsAttention: "মনোযোগ প্রয়োজন",
  average: "গড়",
  portfolioRepresents: "প্রতিনিধিত্ব করে",
  aiRecommendation: "AI সুপারিশ",
  highlyConcentratedPortfolio:
    "আপনার পোর্টফোলিও একটি সম্পদে অতিরিক্ত কেন্দ্রীভূত। ঝুঁকি কমাতে ETF, গোল্ড বা বন্ডে বৈচিত্র্য আনার কথা বিবেচনা করুন।",
  reasonablyDiversifiedPortfolio:
    "আপনার পোর্টফোলিও যথেষ্ট বৈচিত্র্যময়। নিয়মিত বিনিয়োগ চালিয়ে যান এবং প্রতি মাসে আপনার সম্পদ বণ্টন পর্যালোচনা করুন।",

  monthlyReport: "মাসিক রিপোর্ট",
  monthlyReportDescription:
    "এই মাসে আপনার আর্থিক কার্যক্রমের একটি পরিষ্কার চিত্র।",
  monthlyOverview: "মাসিক সারসংক্ষেপ",
  monthlyOverviewDescription:
    "এই মাসে আপনার অর্থ কীভাবে প্রবাহিত হয়েছে।",

  moneyReceivedThisMonth:
    "এই মাসে প্রাপ্ত অর্থ",
  moneySpentThisMonth:
    "এই মাসে খরচ করা অর্থ",
  investedThisMonth:
    "এই মাসে বিনিয়োগ",
  moneyAllocatedToInvestments:
    "বিনিয়োগে বরাদ্দ করা অর্থ",
  netCashFlow: "নিট ক্যাশ ফ্লো",
  cashRemainingAfterActivity:
    "এই মাসের কার্যক্রমের পর অবশিষ্ট নগদ",
  cashFlow: "ক্যাশ ফ্লো",
  cashFlowDescription:
    "আপনার আয়, খরচ, বিনিয়োগ এবং স্থানান্তর।",
  savingsRateDescription:
    "এই মাসের কার্যক্রমের পর অবশিষ্ট আয়ের শতাংশ।",

  investmentPerformance: "বিনিয়োগের পারফরম্যান্স",
  investmentPerformanceDescription:
    "আপনার পোর্টফোলিওর বর্তমান মূল্য এবং পারফরম্যান্স।",
  totalInvested: "মোট বিনিয়োগ",
  profitLoss: "লাভ / ক্ষতি",

  expenseBreakdown: "খরচের বিভাজন",
  expenseBreakdownDescription:
    "এই মাসে আপনার অর্থ কোথায় খরচ হয়েছে।",
  percentOfExpenses: "খরচের শতাংশ",

  latestFinancialActivity:
    "এই মাসের সর্বশেষ আর্থিক কার্যক্রম।",
  noFinancialActivity:
    "এই মাসে কোনো আর্থিক কার্যক্রম রেকর্ড করা হয়নি।",
  netWorthDescription:
    "উপলব্ধ নগদ + বিনিয়োগ পোর্টফোলিওর মূল্য।",
  reportWaitingForData:
    "আপনার রিপোর্ট বাস্তব তথ্যের জন্য অপেক্ষা করছে।",
  addDataToBuildReport:
    "আপনার আর্থিক রিপোর্ট তৈরি করতে আয়, খরচ বা বিনিয়োগ যোগ করুন।",

  financialHealth: "আর্থিক স্বাস্থ্য",
  critical: "সংকটপূর্ণ",
  fair: "মোটামুটি",
  financialHealthDescription:
    "এই মাসের আপনার প্রকৃত আয়, খরচ, সঞ্চয়, বিনিয়োগ এবং আর্থিক কার্যক্রমের ভিত্তিতে।",

  // Streak freeze
  streakFreezes: "স্ট্রিক ফ্রিজ",
  streakFreezeHint:
    "একদিন মিস করলে ফ্রিজ আপনার স্ট্রিক বাঁচায়। প্রতি ৭ দিনে একটি পাবেন।",
  streakFreezeUsed:
    "একটি ফ্রিজ আপনার {streak} দিনের স্ট্রিক বাঁচিয়েছে!",

  planCardTitle:
    "এ মাসের পরিকল্পনা",
  planCardEmpty:
    "আপনার টাকাকে কাজ দিন। মাসিক পরিকল্পনা শুরু করুন।",
  planOpen:
    "পরিকল্পনা খুলুন",
  planOverspentCount:
    "{count}টি খাতে বেশি খরচ",
  planNewCategory:
    "নতুন খাত",
  planCategoryPlaceholder:
    "যেমন: ঈদের কেনাকাটা, মায়ের ওষুধ",
  planCategoryExists:
    "এই খাত আগেই আছে।",
  planDeleteCategory:
    "এই খাত সরাবেন? আপনার আগের খরচ থেকে যাবে।",
  smsAutoTitle:
    "স্বয়ংক্রিয় এসএমএস সেটআপ",
  smsAutoSubtitle:
    "বিকাশ বা নগদের এসএমএস থেকে সরাসরি অ্যাপ খুলুন",
  heroStreak:
    "দিনের ধারা",
  heroFreezes:
    "ফ্রিজ",
  heroTasks:
    "আজকের কাজ সম্পন্ন",
  greetingMorning:
    "শুভ সকাল",
  greetingAfternoon:
    "শুভ অপরাহ্ণ",
  greetingEvening:
    "শুভ সন্ধ্যা",
  greetingNight:
    "শুভ রাত্রি",
  statNet:
    "আর্থিক ভিত্তি",
  statIncome:
    "আয়ের টাকা",
  statExpense:
    "খরচের টাকা",
  statInvest:
    "ভবিষ্যতের সম্পদ",
  heroAdd:
    "যোগ করুন",
  heroMove:
    "সরান",
  heroThisMonth:
    "এ মাসে",
  heroSinceLast:
    "গত মাসের চেয়ে {amount}",
  noBillsShort:
    "কোনো বিল নেই",
  accountsCount:
    "{count}টি অ্যাকাউন্ট",
  moneyMapTitle:
    "আপনার টাকা",
  pfSavedMonth:
    "এই মাসে সঞ্চয়",
  pfSavingRate:
    "সঞ্চয়ের হার",
  pfBadges:
    "ব্যাজ",
  pfNoBadges:
    "খরচ ট্র্যাক করুন ও শিখুন, প্রথম ব্যাজ পাবেন।",
  pfNextBadge:
    "পরের ব্যাজ",
  pfThisWeek:
    "এই সপ্তাহ",
  pfMaxLevel:
    "সর্বোচ্চ স্তরে পৌঁছেছেন",
  pfXpTotal:
    "{xp} XP",
  // Bills and net worth
  billsTitle:
    "বিল",
  billsSubtitle:
    "প্রতি মাসে যে বিলগুলো আসে",
  addBillTitle:
    "বিল যোগ করুন",
  billNamePlaceholder:
    "যেমন: বাসা ভাড়া, ইন্টারনেট",
  billAmountLabel:
    "টাকার পরিমাণ",
  billDayLabel:
    "কত তারিখে (১-৩১)",
  billPayFrom:
    "যেখান থেকে দেবেন",
  billCategoryLabel:
    "খাত",
  billMarkPaid:
    "পরিশোধ হয়েছে",
  billUndo:
    "ফেরত নিন",
  billPaid:
    "পরিশোধিত ✓",
  billOverdue:
    "মেয়াদ পেরিয়েছে",
  billDueToday:
    "আজ দেওয়ার দিন",
  billDueIn:
    "{days} দিন পরে",
  billMonthlyTotal:
    "প্রতি মাসের মোট বিল",
  billsEmpty:
    "এখনও কোনো বিল নেই। বাসা ভাড়া, ইন্টারনেট, স্কুল ফি যোগ করুন...",
  billsCardNone:
    "মাসিক বিল যোগ করুন",
  billsCardNext:
    "পরের বিল: {name}",
  billDeleteConfirm:
    "এই বিল মুছবেন? আগের পরিশোধ থেকে যাবে।",
  netWorthTitle:
    "মোট সম্পদ",
  netWorthSubtitle:
    "যা আছে থেকে যা দেনা তা বাদ",
  netWorthOwn:
    "আপনার যা আছে",
  netWorthOwe:
    "আপনার যা দেনা",
  netWorthAccounts:
    "অ্যাকাউন্টের টাকা",
  netWorthGoals:
    "লক্ষ্যে জমানো",
  netWorthInvestments:
    "বিনিয়োগ",
  netWorthChange:
    "গত মাসের চেয়ে {amount}",
  addDebt:
    "দেনা যোগ করুন",
  debtNamePlaceholder:
    "যেমন: ব্যাংক ঋণ, বন্ধুর কাছ থেকে ধার",
  debtAmountLabel:
    "এখনও বাকি",
  debtsEmpty:
    "কোনো দেনা নেই। ঋণ থাকলে যোগ করুন।",
  netWorthCardTitle:
    "মোট সম্পদ",
  billDueReminder:
    "বিল: {name} ({amount})",

  // Monthly plan
  planTitle:
    "মাসিক পরিকল্পনা",
  planSubtitle:
    "প্রতিটি টাকাকে একটি কাজ দিন",
  planReadyToAssign:
    "বণ্টনের জন্য প্রস্তুত",
  planAllAssigned:
    "প্রতিটি টাকার কাজ ঠিক করা আছে ✓",
  planOverAssigned:
    "আপনার কাছে যা আছে তার চেয়ে বেশি টাকা বণ্টন করেছেন। কিছু অঙ্ক কমান।",
  planAssigned:
    "বণ্টন",
  planSpent:
    "খরচ",
  planAvailable:
    "বাকি",
  planCopyLast:
    "গত মাসের পরিকল্পনা কপি করুন",
  planSetBalances:
    "আগে অ্যাকাউন্টে আপনার আসল ব্যালেন্স বসান। সেখানকার টাকাই আপনি পরিকল্পনা করতে পারবেন।",
  planHint:
    "বণ্টন কলামের অঙ্কে ট্যাপ করে লিখুন এ মাসে প্রতিটি খাতে কত টাকা থাকবে। যা খরচ হবে না তা পরের মাসে ওই খাতেই থাকবে।",
  planOverspent:
    "বেশি খরচ",
  planLink:
    "পরিকল্পনা",

  // Accounts
  accountsTitle:
    "অ্যাকাউন্ট",
  accountsSubtitle:
    "আপনার টাকা কোথায় আছে",
  totalBalance:
    "মোট ব্যালেন্স",
  addAccount:
    "অ্যাকাউন্ট যোগ করুন",
  accountNameLabel:
    "অ্যাকাউন্টের নাম",
  accountNamePlaceholder:
    "যেমন: বিকাশ, নগদ, ডাচ-বাংলা",
  currentBalanceLabel:
    "আজকের ব্যালেন্স",
  transferMoney:
    "টাকা সরান",
  transferFromLabel:
    "কোথা থেকে",
  transferToLabel:
    "কোথায়",
  transferAmountLabel:
    "টাকার পরিমাণ",
  transferFeeLabel:
    "ফি (ঐচ্ছিক)",
  transferDifferent:
    "দুটি আলাদা অ্যাকাউন্ট বেছে নিন।",
  transferNotEnough:
    "টাকার পরিমাণ লিখুন।",
  fixBalance:
    "ব্যালেন্স ঠিক করুন",
  saveLabel:
    "সংরক্ষণ",
  cancelLabel:
    "বাতিল",
  accountsHint:
    "প্রতিটি অ্যাকাউন্টে আজ আসলে যত টাকা আছে সেটি বসান। এক অ্যাকাউন্ট থেকে আরেকটিতে টাকা সরানো খরচ নয়। শুধু ফি খরচ হিসেবে ধরা হয়।",
  deleteAccountConfirm:
    "এই অ্যাকাউন্ট মুছবেন? আপনার লেনদেন থেকে যাবে।",
  accountsLink:
    "অ্যাকাউন্ট",
  cashMoveToCash:
    "ক্যাশে সরান",
  cashMoveHint:
    "ক্যাশ আউট মানে টাকা সরানো। আপনার নগদ বাড়ে, বিকাশ কমে। শুধু ফি খরচ।",

  // Custom reminders
  myRemindersTitle:
    "আপনার রিমাইন্ডার",
  reminderTitlePlaceholder:
    "যেমন: বিদ্যুৎ বিল",
  reminderDateLabel:
    "তারিখ",
  repeatLabel:
    "পুনরাবৃত্তি",
  repeatOnce:
    "একবার",
  repeatMonthly:
    "প্রতি মাসে",
  repeatYearly:
    "প্রতি বছর",
  addReminderButton:
    "রিমাইন্ডার যোগ করুন",
  noCustomReminders:
    "এখনও কোনো রিমাইন্ডার নেই। উপরে প্রথমটি যোগ করুন।",
  reminderDueToday:
    "আজ: {title}",
  reminderDueTomorrow:
    "কাল: {title}",
  reminderDueInDays:
    "{days} দিন পরে: {title}",
  deleteLabel:
    "মুছুন",

  // Today coach
  coachTitle:
    "আজকের কোচ",
  coachOpenQuickAdd:
    "এখনই যোগ করুন",
  coachOpenGoals:
    "লক্ষ্য দেখুন",
  coachOpenReports:
    "বিস্তারিত দেখুন",
  salaryDayLabel:
    "বেতনের দিন",
  rentDayLabel:
    "বাসা ভাড়ার দিন",
  dayOfMonthHint:
    "মাসের তারিখ (১-৩১)",
  dayNotSet:
    "ঠিক করা নেই",
  reminderSalaryToday:
    "আজ বেতনের দিন! খরচের আগে কিছু অংশ লক্ষ্যে সরিয়ে রাখুন।",
  reminderSalaryTomorrow:
    "কাল বেতন আসার কথা। এখনই ঠিক করুন কত জমাবেন।",
  reminderRentToday:
    "আজ বাসা ভাড়া দেওয়ার দিন।",
  reminderRentSoon:
    "{days} দিনের মধ্যে বাসা ভাড়া। টাকা আলাদা করে রাখুন।",
  reminderEidFitr:
    "ঈদ কাছে। আজ ঈদ ফান্ডে অল্প কিছু জমালে কাজে দেবে।",
  reminderEidAdha:
    "কোরবানির ঈদ কাছে। এখনই কোরবানির খরচের পরিকল্পনা করুন।",
  reminderRamadan:
    "রমজান: এই সপ্তাহের ইফতার ও সেহরির খরচের হিসাব করুন।",
  nudgeFirstEntry:
    "আপনার প্রথম এন্ট্রি দিয়ে শুরু করুন। মাত্র ১০ সেকেন্ড লাগে।",
  nudgeLogToday:
    "আজ কিছু লেখা হয়নি। কী খরচ করেছেন যোগ করুন, স্ট্রিক ঠিক থাকবে।",
  nudgeSpendingUp:
    "গত সপ্তাহের চেয়ে এ সপ্তাহে {percent}% বেশি খরচ করেছেন।",
  nudgeSpendingDown:
    "চমৎকার! গত সপ্তাহের চেয়ে {percent}% কম খরচ করেছেন।",
  nudgeTopCategory:
    "এ সপ্তাহের খরচের {percent}% গেছে {category}-এ।",
  nudgeLowSavings:
    "এ মাসে খুব কম জমাচ্ছেন। একটি লক্ষ্যে অল্প কিছু জমানোর চেষ্টা করুন।",
  nudgeGoodSavings:
    "এ মাসে আয়ের ২০% এর বেশি জমাচ্ছেন। চালিয়ে যান!",
  nudgeTip1:
    "আজ প্রতিটি খরচ লিখে রাখুন, ছোটগুলোও।",
  nudgeTip2:
    "আগে জমান, তারপর বাকিটা খরচ করুন।",
  nudgeTip3:
    "অপ্রয়োজনীয় কেনাকাটার আগে একদিন অপেক্ষা করুন।",
  nudgeTip4:
    "লক্ষ্যগুলো দেখুন। অল্প জমাও গুরুত্বপূর্ণ।",
  nudgeTip5:
    "এ মাসের সবচেয়ে বড় খরচের খাত দেখুন। একটু কমানো যায় কি?",

  // Goals page
  goalsTitle:
    "আর্থিক লক্ষ্য",
  goalsSubtitle:
    "আজ আপনি যা সঞ্চয় করছেন, তা আপনাকে কাঙ্ক্ষিত জীবনের এক ধাপ কাছে নিয়ে যাচ্ছে।",
  addGoal:
    "লক্ষ্য যোগ করুন",
  activeGoals:
    "চলমান লক্ষ্য",
  goalsCompleted:
    "সম্পন্ন",
  savedLabel:
    "সঞ্চিত",
  goalCompletion:
    "লক্ষ্য পূরণ",
  noGoalsYet:
    "এখনও কোনো লক্ষ্য নেই",
  createFirstGoal:
    "আপনার প্রথম আর্থিক লক্ষ্য তৈরি করুন।",
  createGoal:
    "লক্ষ্য তৈরি করুন",
  goalOptions:
    "লক্ষ্যের অপশন",
  editGoal:
    "লক্ষ্য সম্পাদনা করুন",
  deleteGoal:
    "লক্ষ্য মুছুন",
  deleteGoalConfirm:
    "এই লক্ষ্যটি মুছে ফেলবেন?",
  goalReached:
    "লক্ষ্য পূরণ হয়েছে",
  goalLabel:
    "লক্ষ্য",
  addMoney:
    "টাকা যোগ করুন",
  withdrawMoney:
    "টাকা তুলুন",
  withdrawShort:
    "তুলুন",
  addMoneyDescription:
    "এই লক্ষ্যে টাকা জমা করুন।",
  withdrawDescription:
    "টাকা আবার উপলব্ধ নগদে ফিরিয়ে আনুন।",
  selectedGoal:
    "নির্বাচিত লক্ষ্য",
  enterAmount:
    "পরিমাণ লিখুন",
  amountOfTarget:
    "{target}-এর মধ্যে {saved}",
  availableShort:
    "উপলব্ধ",
  enterValidAmount:
    "সঠিক পরিমাণ লিখুন।",
  notEnoughCash:
    "পর্যাপ্ত উপলব্ধ নগদ নেই।",
  notEnoughInGoal:
    "এই লক্ষ্যে পর্যাপ্ত টাকা নেই।",
  createGoalDescription:
    "অর্থপূর্ণ কিছুর জন্য সঞ্চয় শুরু করুন।",
  goalName:
    "লক্ষ্যের নাম",
  goalNamePlaceholder:
    "যেমন: ঈদের কেনাকাটা",
  emojiLabel:
    "ইমোজি",
  targetAmount:
    "লক্ষ্যমাত্রা",
  targetDate:
    "লক্ষ্যের তারিখ",
  saveChanges:
    "পরিবর্তন সংরক্ষণ করুন",
  enterGoalName:
    "লক্ষ্যের নাম লিখুন।",
  enterValidTarget:
    "সঠিক লক্ষ্যমাত্রা লিখুন।",

  // Settings

  account: "অ্যাকাউন্ট",
  financialIdentity: "আপনার আর্থিক পরিচয়",

  regionalPreferences: "আঞ্চলিক পছন্দসমূহ",
  country: "দেশ",
  language: "ভাষা",
  currency: "মুদ্রা",

  preferences: "পছন্দসমূহ",
  reminders: "রিমাইন্ডার",
  enabled: "চালু",
  disabled: "বন্ধ",
  darkMode: "ডার্ক মোড",

  yourData: "আপনার ডেটা",
  exportData: "ডেটা এক্সপোর্ট করুন",
  downloadBackup:
    "আপনার MyFinance ডেটার ব্যাকআপ ডাউনলোড করুন",
  importData: "ডেটা ইমপোর্ট করুন",
  restoreBackup:
    "আগের ব্যাকআপ পুনরুদ্ধার করুন",
  passcodeLock: "পাসকোড লক",
  notEnabled: "চালু করা হয়নি",
  deleteAccountData:
    "অ্যাকাউন্টের ডেটা মুছুন",
  permanentlyRemoveData:
    "আপনার MyFinance ডেটা স্থায়ীভাবে মুছে ফেলুন",

  support: "সহায়তা",
  rateMyFinance: "MyFinance-কে রেটিং দিন",
  tellUsWhatYouThink:
    "আপনার মতামত জানান",
  sendFeedback: "ফিডব্যাক পাঠান",
  helpUsImprove:
    "MyFinance আরও উন্নত করতে আমাদের সাহায্য করুন",

  termsPrivacy: "শর্তাবলি ও গোপনীয়তা",
  privacyPolicy: "গোপনীয়তা নীতি",
  termsOfUse: "ব্যবহারের শর্তাবলি",

  logOut: "লগ আউট",
  signOutOfMyFinance:
    "MyFinance থেকে সাইন আউট করুন",

  savePreferences:
    "পছন্দসমূহ সংরক্ষণ করুন",
  keepFinancialHabits:
    "ভালো আর্থিক অভ্যাস গড়ে তুলতে থাকুন",
  financialReminders:
    "আর্থিক রিমাইন্ডার",
  protectAccountWithPasscode:
    "পাসকোড দিয়ে আপনার অ্যাকাউন্ট সুরক্ষিত করুন",
  setupPasscode:
    "পাসকোড সেট আপ করুন",
  useFourToSixDigitPasscode:
    "আপনার অ্যাকাউন্ট সুরক্ষিত করতে ৪–৬ সংখ্যার পাসকোড ব্যবহার করুন",

  createPasscode: "পাসকোড তৈরি করুন",
  enterFourToSixDigits:
    "৪–৬ সংখ্যার পাসকোড লিখুন",
  continue: "চালিয়ে যান",
  confirmPasscode:
    "পাসকোড নিশ্চিত করুন",
  enterPasscodeAgain:
    "আবার আপনার পাসকোড লিখুন",
  passcodesDoNotMatch:
    "পাসকোড মিলছে না",

  enablePasscodeLock:
    "পাসকোড লক চালু করুন",
  passcodeLockEnabled:
    "পাসকোড লক চালু হয়েছে",
  accountProtected:
    "আপনার অ্যাকাউন্ট সুরক্ষিত",
  disablePasscodeLock:
    "পাসকোড লক বন্ধ করুন",

  tellUsHowToImprove:
    "কীভাবে MyFinance আরও উন্নত করা যায় তা জানান",
  writeFeedback:
    "আপনার ফিডব্যাক লিখুন",
  thankYouForFeedback:
    "আপনার ফিডব্যাকের জন্য ধন্যবাদ!",

  deleteAccountDataQuestion:
    "সব অ্যাকাউন্টের ডেটা মুছে ফেলবেন?",
  deleteAccountWarning:
    "এই কাজটি আপনার MyFinance-এর ডেটা স্থায়ীভাবে মুছে ফেলবে এবং এটি আর ফিরিয়ে আনা যাবে না।",
  cancel: "বাতিল",
  deleteData: "ডেটা মুছে ফেলুন",

youHaveBeenLoggedOut:
  "আপনাকে লগ আউট করা হয়েছে।",
},
};