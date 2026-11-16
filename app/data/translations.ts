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
  | "lgFreedomTitle"
  | "lgFreedomHint"
  | "lgMonthlyCost"
  | "lgSetCost"
  | "lgYouHave"
  | "lgPercentDone"
  | "lgGoalsTitle"
  | "lgAddGoal"
  | "lgGoalName"
  | "lgAmount"
  | "lgYear"
  | "lgSave"
  | "lgEmpty"
  | "lgTotal"
  | "lgEdit"
  | "lgSaveCost"
  | "lgChangePhoto"
  | "lgDelete"
  | "lgByYear"
  | "cfTitle"
  | "cfSubtitle"
  | "fpTitle"
  | "fpSubtitle"
  | "fpStepOf"
  | "fpYouAreHere"
  | "fpDoneLabel"
  | "fpAllDone"
  | "fpGo"
  | "fpTrackTitle"
  | "fpTrackHint"
  | "fpPlanTitle"
  | "fpPlanHint"
  | "fpStarterTitle"
  | "fpSafetyTitle"
  | "fpRunwayHint"
  | "fpDebtTitle"
  | "fpDebtHint"
  | "fpDebtFree"
  | "fpInvestTitle"
  | "fpInvestHint"
  | "fpFreedomTitle"
  | "fpFreedomHint"
  | "fpFreedomSet"
  | "brTitle"
  | "brSubtitle"
  | "brNeeds"
  | "brWants"
  | "brSavings"
  | "brTarget"
  | "brNoIncome"
  | "brSuggest"
  | "brOnTrack"
  | "brSortTitle"
  | "brTagNeed"
  | "brTagWant"
  | "cfThisMonth"
  | "cfLastMonth"
  | "cf3Months"
  | "cfYear"
  | "cfIncome"
  | "cfSpent"
  | "cfInvested"
  | "cfSaved"
  | "cfShortfall"
  | "cfOther"
  | "cfIn"
  | "cfOut"
  | "cfEmpty"
  | "cfTapHint"
  | "cfShare"
  | "cfCount"
  | "cfKept"
  | "cfOverspent"
  | "insTitle"
  | "insSubtitle"
  | "insMore"
  | "insPortfolio"
  | "insInvested"
  | "insCurrent"
  | "insProfit"
  | "insReturn"
  | "moreGroupMoney"
  | "moreGroupInsights"
  | "moreGroupYou"
  | "inVerdictGreat"
  | "inVerdictOk"
  | "inVerdictLow"
  | "inVerdictNone"
  | "inKeptSoFar"
  | "inGoalLine"
  | "inStoryTitle"
  | "inLess"
  | "inMore"
  | "inTop"
  | "inGap"
  | "inGood"
  | "inNoSpend"
  | "inBiggest"
  | "inActionGoals"
  | "inActionAdd"
  | "inActionFlow"
  | "inPaceTitle"
  | "inPaceSub"
  | "inPaceMonth"
  | "inPaceSpent"
  | "inPaceProjection"
  | "inPaceLast"
  | "inDailyTitle"
  | "inDailyLine"
  | "inDailyNone"
  | "inChangedTitle"
  | "inSixTitle"
  | "inBest"
  | "inFreedomTitle"
  | "inFreedomLine"
  | "inFreedomSet"
  | "inDeepDive"
  | "fxTitle"
  | "fxEraLabel"
  | "fxEra1"
  | "fxEra2"
  | "fxEra3"
  | "fxEra4"
  | "fxEra0"
  | "fxHide"
  | "fxShow"
  | "fxCards"
  | "fxShare"
  | "fxCopied"
  | "fxKeptBig"
  | "fxKeptCap"
  | "fxRateBig"
  | "fxRateHigh"
  | "fxRateMid"
  | "fxStreakBig"
  | "fxStreakCap"
  | "fxNoSpendBig"
  | "fxNoSpendCap"
  | "fxLessBig"
  | "fxLessCap"
  | "fxFreeBig"
  | "fxFreeCap"
  | "fxWorthBig"
  | "fxWorthCap"
  | "fxLevelBig"
  | "fxTrophyBig"
  | "fxTrophyCap"
  | "fxStartBig"
  | "fxStartCap"
  | "fxShelfTitle"
  | "fxDaysTitle"
  | "fxDaysCount"
  | "fxFreedomTitle"
  | "fxSaved"
  | "fxSave"
  | "pgTitle"
  | "pgSub"
  | "pgHeadKept"
  | "pgHeadLost"
  | "pgHeadNone"
  | "pgOverMonths"
  | "pgWealthTitle"
  | "pgWealthSub"
  | "pgRateTitle"
  | "pgLast3"
  | "pgPoints"
  | "pgTarget"
  | "pgRunwayTitle"
  | "pgRunwayValue"
  | "pgRunwayLine"
  | "pgRunwayGood"
  | "pgRunwayBuild"
  | "pgFreeTitle"
  | "pgFreeCover"
  | "pgFreeNote"
  | "pgNoInvest"
  | "pgNoCash"
  | "pgSubtitle"
  | "pgNetWorth"
  | "pgChange6"
  | "pgEstimated"
  | "pgNeedData"
  | "pgRunway"
  | "pgRunwayVal"
  | "pgRunwaySub"
  | "pgSavingsRate"
  | "pgSavingsSub"
  | "pgSpending"
  | "pgSpendingSub"
  | "pgFreedomTitle"
  | "pgFreedomDate"
  | "pgFreedomNote"
  | "pgFreedomReached"
  | "pgFreedomNeed"
  | "pgFreedomFar"
  | "pgChecksTitle"
  | "pgCheck1"
  | "pgCheck2"
  | "pgCheck3"
  | "pgCheck4"
  | "pgShareTitle"
  | "pgUp"
  | "pgDown"
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
  | "gtShort"
  | "gtMedium"
  | "gtLong"
  | "gtShortRange"
  | "gtMediumRange"
  | "gtLongRange"
  | "gtPick"
  | "gtEmptyShort"
  | "gtEmptyMedium"
  | "gtEmptyLong"
  | "gtAddHere"
  | "gtTotalSaved"
  | "gtMonthsLeft"
  | "gtDueNow"
  | "gtPastDue"
  | "gtNoDate"
  | "gtPerMonth"
  | "gtGoalsCount"
  | "gtLifeLink"
  | "hpEntryTitle"
  | "hpEntrySub"
  | "hpStory1"
  | "hpStory2"
  | "hpStory3"
  | "hpNext"
  | "hpAsk"
  | "hpOwn"
  | "hpRentAns"
  | "hpFamily"
  | "hpOwnReply"
  | "hpBack"
  | "hpPlanTitle"
  | "hpPlanSub"
  | "hpBurnTitle"
  | "hpBurnHint"
  | "hpRentLabel"
  | "hpHike"
  | "hpNYears"
  | "hpPaid"
  | "hpCouldBe"
  | "hpTargetTitle"
  | "hpTargetHint"
  | "hpPrice"
  | "hpBuyIn"
  | "hpPropInfl"
  | "hpDown"
  | "hpReg"
  | "hpFuturePrice"
  | "hpCashNeeded"
  | "hpSaveTitle"
  | "hpReturn"
  | "hpMonthly"
  | "hpIfBank"
  | "hpBucketShort"
  | "hpBucketLong"
  | "hpSafeTitle"
  | "hpSafeHint"
  | "hpIncome"
  | "hpLoanRate"
  | "hpTenor"
  | "hpMaxEmi"
  | "hpMaxLoan"
  | "hpMaxPrice"
  | "hpSafeYes"
  | "hpSafeNo"
  | "hpNeedIncome"
  | "hpMakeGoal"
  | "hpGoalMade"
  | "hpSeeGoals"
  | "hpGoalTitle"
  | "hpDisclaimer"
  | "hpRedo"
  | "dpEntryTitle"
  | "dpEntrySub"
  | "dpStory1"
  | "dpStory2"
  | "dpStory3"
  | "dpAsk"
  | "dpNo"
  | "dpYes"
  | "dpNoReply"
  | "dpPlanTitle"
  | "dpPlanSub"
  | "dpListTitle"
  | "dpListHint"
  | "dpOwed"
  | "dpRate"
  | "dpMin"
  | "dpName"
  | "dpAdd"
  | "dpRemove"
  | "dpPlanSection"
  | "dpExtra"
  | "dpAvalanche"
  | "dpAvalancheHint"
  | "dpSnowball"
  | "dpSnowballHint"
  | "dpFreeBy"
  | "dpInterestTotal"
  | "dpSaves"
  | "dpOrder"
  | "dpClearedIn"
  | "dpNever"
  | "dpNeedPay"
  | "dpRedo"
  | "dpDisclaimer"
  | "dpTabDebts"
  | "dpTabStrategy"
  | "dpTabPlan"
  | "dpTabTrack"
  | "dpDueDay"
  | "dpThisMonth"
  | "dpRemind"
  | "dpRemindOn"
  | "dpRemindNeedDay"
  | "dpPaidSoFar"
  | "dpLogPayment"
  | "dpPayAmount"
  | "dpDueIn"
  | "dpDueToday"
  | "dpNoDue"
  | "dpCleared"
  | "dpTotalProgress"
  | "dpHistory"
  | "dpNoDebts"
  | "txTitle"
  | "txCount"
  | "txSearch"
  | "txAll"
  | "txInvested"
  | "txTransfers"
  | "txTransferOne"
  | "txSpent"
  | "txNet"
  | "txToday"
  | "txYesterday"
  | "txEdit"
  | "txDelete"
  | "txDeleteConfirm"
  | "txEmpty"
  | "txNoMatch"
  | "txAllTime"
  | "txPrevMonth"
  | "txNextMonth"
  | "rpTitle"
  | "rpKept"
  | "rpOver"
  | "rpNoIncome"
  | "rpEarned"
  | "rpSpentLabel"
  | "rpInvestedLabel"
  | "rpVsLast"
  | "rpWhere"
  | "rpOther"
  | "rpByDay"
  | "rpBiggestDay"
  | "rpFacts"
  | "rpBiggest"
  | "rpAvgDay"
  | "rpNoSpend"
  | "rpTrend"
  | "rpDownload"
  | "rpEmpty"
  | "rpKeptOf"
  | "stLevel"
  | "stViewProfile"
  | "stDanger"
  | "stOn"
  | "stOff"
  | "stSecurity"
  | "ivTitle"
  | "ivSub"
  | "ivTabPortfolio"
  | "ivTabGrow"
  | "ivTabRetire"
  | "ivTabLearn"
  | "ivValue"
  | "ivInvestedLbl"
  | "ivGain"
  | "ivAdd"
  | "ivNoneTitle"
  | "ivNoneText"
  | "ivHoldings"
  | "ivMix"
  | "ivSpread"
  | "ivGrowTitle"
  | "ivStart"
  | "ivMonthly"
  | "ivRate"
  | "ivYears"
  | "ivInflation"
  | "ivFinal"
  | "ivPutIn"
  | "ivEarned"
  | "ivReal"
  | "ivDouble"
  | "ivEarlyTitle"
  | "ivEarlyText"
  | "ivExample"
  | "ivChart"
  | "ivRetTitle"
  | "ivAge"
  | "ivRetireAge"
  | "ivLifeTo"
  | "ivCostNow"
  | "ivSaved"
  | "ivSavingNow"
  | "ivRetReturn"
  | "ivPostReturn"
  | "ivNeedAtRet"
  | "ivNest"
  | "ivProjected"
  | "ivOnTrack"
  | "ivShort"
  | "ivReady"
  | "ivYearsLeft"
  | "ivRetNote"
  | "ivBadAges"
  | "ivRules"
  | "ivRule1"
  | "ivRule2"
  | "ivRule3"
  | "ivRule4"
  | "ivByTime"
  | "ivUnder1"
  | "ivMid"
  | "ivOver5"
  | "ivUnder1Do"
  | "ivMidDo"
  | "ivOver5Do"
  | "ivRisk"
  | "ivHorizon"
  | "ivGoodFor"
  | "ivWatch"
  | "ivCheckRates"
  | "invAddTitle"
  | "invEditTitle"
  | "invWhat"
  | "invGroupSafe"
  | "invGroupGrow"
  | "invGroupSpecial"
  | "invName"
  | "invHow"
  | "invModeTotal"
  | "invModeMonthly"
  | "invModeUnits"
  | "invPutIn"
  | "invWorth"
  | "invWorthHint"
  | "invMonthlyAmt"
  | "invMonthsPaid"
  | "invUnitsLabel"
  | "invBuyPrice"
  | "invNowPrice"
  | "invNowPriceHint"
  | "invSummaryIn"
  | "invSummaryWorth"
  | "invSummaryGain"
  | "invStartDate"
  | "invNewPurchase"
  | "invYesNew"
  | "invNoOwned"
  | "invPaidFrom"
  | "invCashWillDrop"
  | "invCashSame"
  | "invLinkedNote"
  | "invNote"
  | "invSave"
  | "invSaveChanges"
  | "invCancel"
  | "invRemoveTitle"
  | "invRemoveMistake"
  | "invRemoveMistakeSub"
  | "invRemoveSold"
  | "invRemoveSoldSub"
  | "invRemoveOnly"
  | "invRemoveOnlySub"
  | "invSoldFor"
  | "invConfirmSold"
  | "coachMenu"
  | "tmMenu"
  | "occMenu"
  | "somMenu"
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
  lgFreedomTitle:
    "Financial freedom number",
  lgFreedomHint:
    "Monthly living cost × 12 × 25. With this much saved, your money can pay for your life.",
  lgMonthlyCost:
    "Monthly living cost",
  lgSetCost:
    "Enter your monthly cost to see your number.",
  lgYouHave:
    "You have {amount}",
  lgPercentDone:
    "{percent}% there",
  lgGoalsTitle:
    "Life goals",
  lgAddGoal:
    "Add goal",
  lgGoalName:
    "Goal name, like Buy a home",
  lgAmount:
    "Amount needed",
  lgYear:
    "Target year (optional)",
  lgSave:
    "Save goal",
  lgEmpty:
    "Add the big things you want in life, like a home, Hajj, or your child's education.",
  lgTotal:
    "Total for all goals: {amount}",
  lgEdit:
    "Edit",
  lgSaveCost:
    "Save",
  lgChangePhoto:
    "Change photo",
  lgDelete:
    "Delete",
  lgByYear:
    "By {year}",
  cfTitle:
    "Cash flow",
  cfSubtitle:
    "See where your money comes from and where it goes.",
  fpTitle:
    "Freedom Path",
  fpSubtitle:
    "7 steps from tracking to freedom",
  fpStepOf:
    "Step {n} of {total}",
  fpYouAreHere:
    "You are here",
  fpDoneLabel:
    "Done",
  fpAllDone:
    "All steps done. Work is now a choice.",
  fpGo:
    "Go",
  fpTrackTitle:
    "Track your money",
  fpTrackHint:
    "{n} of {total} entries in the last 30 days",
  fpPlanTitle:
    "Give every taka a job",
  fpPlanHint:
    "Plan this month's money",
  fpStarterTitle:
    "Starter safety: 1 month",
  fpSafetyTitle:
    "Safety net: 3 months",
  fpRunwayHint:
    "{n} months of spending saved",
  fpDebtTitle:
    "Clear what you owe",
  fpDebtHint:
    "{amount} still owed",
  fpDebtFree:
    "No debts. Nice.",
  fpInvestTitle:
    "Start investing",
  fpInvestHint:
    "Put some money to work",
  fpFreedomTitle:
    "Reach your freedom number",
  fpFreedomHint:
    "{n}% of {amount}",
  fpFreedomSet:
    "Set your monthly cost in Profile to see this",
  brTitle:
    "50/30/20 check",
  brSubtitle:
    "Needs, wants and savings against your income",
  brNeeds:
    "Needs",
  brWants:
    "Wants",
  brSavings:
    "Savings",
  brTarget:
    "Aim for {n}%",
  brNoIncome:
    "Add your income this month to see your split.",
  brSuggest:
    "Spend about {amount} less on {category} to get closer to 20% savings.",
  brOnTrack:
    "You are on track. Keep it up.",
  brSortTitle:
    "Move a category",
  brTagNeed:
    "Need",
  brTagWant:
    "Want",
  cfThisMonth:
    "This month",
  cfLastMonth:
    "Last month",
  cf3Months:
    "3 months",
  cfYear:
    "This year",
  cfIncome:
    "Income",
  cfSpent:
    "Spent",
  cfInvested:
    "Invested",
  cfSaved:
    "Saved",
  cfShortfall:
    "From savings",
  cfOther:
    "Other",
  cfIn:
    "Money in",
  cfOut:
    "Where it went",
  cfEmpty:
    "No income or spending in this period yet. Add a few transactions to see your flow.",
  cfTapHint:
    "Tap a block to see details.",
  cfShare:
    "{percent}% of money in",
  cfCount:
    "{count} entries",
  cfKept:
    "You kept {percent}% of what came in.",
  cfOverspent:
    "You used {amount} more than you earned.",
  insTitle:
    "Insights",
  insSubtitle:
    "Charts and tips about your money.",
  insMore:
    "See all insights",
  insPortfolio:
    "Investment portfolio",
  insInvested:
    "Invested",
  insCurrent:
    "Current value",
  insProfit:
    "Profit",
  insReturn:
    "Return",
  moreGroupMoney:
    "Manage money",
  moreGroupInsights:
    "See your money",
  moreGroupYou:
    "You",
  inVerdictGreat:
    "You're doing great this month",
  inVerdictOk:
    "You're keeping some. Let's grow it.",
  inVerdictLow:
    "Money is tight this month",
  inVerdictNone:
    "Add a few entries to see your story",
  inKeptSoFar:
    "kept so far this month",
  inGoalLine:
    "Goal: keep {percent}% of what comes in",
  inStoryTitle:
    "Your month, in plain words",
  inLess:
    "You spent {amount} less than last month. Well done.",
  inMore:
    "You spent {amount} more than last month.",
  inTop:
    "{category} is your biggest spend: {amount}, {percent}% of spending.",
  inGap:
    "Keep {amount} more this month to reach your {percent}% goal.",
  inGood:
    "You're keeping {percent}%, above the {goal}% goal.",
  inNoSpend:
    "{count} days this month with no spending.",
  inBiggest:
    "Biggest single spend: {name}, {amount}.",
  inActionGoals:
    "Set a goal",
  inActionAdd:
    "Add entry",
  inActionFlow:
    "See cash flow",
  inPaceTitle:
    "Spending pace",
  inPaceSub:
    "{spent} spent, day {day} of {total}",
  inPaceMonth:
    "Month so far",
  inPaceSpent:
    "Spent",
  inPaceProjection:
    "At this pace you'll spend about {amount} by month end.",
  inPaceLast:
    "Last month you spent {amount}.",
  inDailyTitle:
    "Safe to spend each day",
  inDailyLine:
    "for the next {days} days, and you'll still keep the rest.",
  inDailyNone:
    "Everything that came in this month is already used.",
  inChangedTitle:
    "What changed since last month",
  inSixTitle:
    "Money kept, last 6 months",
  inBest:
    "Best month: {month}, {amount} kept",
  inFreedomTitle:
    "Financial freedom",
  inFreedomLine:
    "{percent}% of your freedom number",
  inFreedomSet:
    "Set your freedom number to track this.",
  inDeepDive:
    "Deep-dive charts",
  fxTitle:
    "Flex zone",
  fxEraLabel:
    "Your money era",
  fxEra1:
    "Untouchable",
  fxEra2:
    "Locked in",
  fxEra3:
    "Warming up",
  fxEra4:
    "Rebuilding",
  fxEra0:
    "Starts here",
  fxHide:
    "Hide amounts",
  fxShow:
    "Show amounts",
  fxCards:
    "Flex cards",
  fxShare:
    "Share",
  fxCopied:
    "Copied",
  fxKeptBig:
    "Kept {amount}",
  fxKeptCap:
    "Main character money.",
  fxRateBig:
    "{percent}% saved",
  fxRateHigh:
    "Savings rate: elite.",
  fxRateMid:
    "Climbing. Watch me.",
  fxStreakBig:
    "{days}-day streak",
  fxStreakCap:
    "Locked in.",
  fxNoSpendBig:
    "{count} no-spend days",
  fxNoSpendCap:
    "Discipline era.",
  fxLessBig:
    "{amount} less spent",
  fxLessCap:
    "Wallet says thanks.",
  fxFreeBig:
    "{percent}% free",
  fxFreeCap:
    "Building the exit.",
  fxWorthBig:
    "Worth {amount}",
  fxWorthCap:
    "Level up.",
  fxLevelBig:
    "Level {level}",
  fxTrophyBig:
    "{count} trophies",
  fxTrophyCap:
    "Collecting them.",
  fxStartBig:
    "Start your flex",
  fxStartCap:
    "Add one entry.",
  fxShelfTitle:
    "Trophy shelf",
  fxDaysTitle:
    "Spend-free days",
  fxDaysCount:
    "{count} so far",
  fxFreedomTitle:
    "Freedom meter",
  fxSaved:
    "Saved",
  fxSave:
    "Save image",
  pgTitle:
    "Progress",
  pgSub:
    "Four numbers that show if you're really getting ahead.",
  pgHeadKept:
    "You've kept {amount} in the last {months} months.",
  pgHeadLost:
    "You spent {amount} more than you earned in the last {months} months.",
  pgHeadNone:
    "Add income and spending to see your progress.",
  pgOverMonths:
    "over {months} months",
  pgWealthTitle:
    "Money kept",
  pgWealthSub:
    "Running total of income minus spending.",
  pgRateTitle:
    "Savings rate",
  pgLast3:
    "last 3 months",
  pgPoints:
    "{points} points vs the 3 months before",
  pgTarget:
    "Target {percent}%",
  pgRunwayTitle:
    "Safety runway",
  pgRunwayValue:
    "{months} months",
  pgRunwayLine:
    "Your cash covers this many months of spending.",
  pgRunwayGood:
    "Solid. A common target is 3 to 6 months.",
  pgRunwayBuild:
    "Aim for 3 months first.",
  pgFreeTitle:
    "Independence",
  pgFreeCover:
    "of your monthly spending is covered by investments.",
  pgFreeNote:
    "Based on withdrawing 4% a year.",
  pgNoInvest:
    "Invest to start covering your spending.",
  pgNoCash:
    "Add your accounts to see this.",
  pgSubtitle:
    "Your money, over time.",
  pgNetWorth:
    "Net worth",
  pgChange6:
    "{amount} in 6 months",
  pgEstimated:
    "Estimated from your entries.",
  pgNeedData:
    "Add a few months of entries to see your trend.",
  pgRunway:
    "Runway",
  pgRunwayVal:
    "{months} months",
  pgRunwaySub:
    "of expenses covered",
  pgSavingsRate:
    "Savings rate",
  pgSavingsSub:
    "3-month average",
  pgSpending:
    "Spending",
  pgSpendingSub:
    "vs previous 3 months",
  pgFreedomTitle:
    "Freedom date",
  pgFreedomDate:
    "{date}",
  pgFreedomNote:
    "At your pace over the last 3 months, before investment growth.",
  pgFreedomReached:
    "You've reached your freedom number.",
  pgFreedomNeed:
    "Save more each month to see a date.",
  pgFreedomFar:
    "More than 50 years away at this pace.",
  pgChecksTitle:
    "Fundamentals",
  pgCheck1:
    "Spend less than you earn",
  pgCheck2:
    "Save 20% or more",
  pgCheck3:
    "3 or more months of runway",
  pgCheck4:
    "No overdue bills",
  pgShareTitle:
    "Share your progress",
  pgUp:
    "Up",
  pgDown:
    "Down",
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
  gtShort:
    "Short term",
  gtMedium:
    "Medium term",
  gtLong:
    "Long term",
  gtShortRange:
    "Under 1 year",
  gtMediumRange:
    "1 to 5 years",
  gtLongRange:
    "More than 5 years",
  gtPick:
    "When do you want this?",
  gtEmptyShort:
    "No short-term goals yet. Try an emergency fund or a phone.",
  gtEmptyMedium:
    "No medium-term goals yet. Try a bike, a wedding or a course.",
  gtEmptyLong:
    "No long-term goals yet. Try a home, Hajj or your children's study.",
  gtAddHere:
    "Add a goal",
  gtTotalSaved:
    "{saved} saved of {target}",
  gtMonthsLeft:
    "{n} mo left",
  gtDueNow:
    "Due this month",
  gtPastDue:
    "Past its date",
  gtNoDate:
    "No date set",
  gtPerMonth:
    "Save {amount} a month to finish on time",
  gtGoalsCount:
    "Goals: {n}",
  gtLifeLink:
    "Your freedom number lives in Profile",
  hpEntryTitle:
    "Rent to own",
  hpEntrySub:
    "A short story, then your plan",
  hpStory1:
    "Rahim pays {rent} rent every month.",
  hpStory2:
    "In 20 years that is {total} gone. And the key to his own door? Zero.",
  hpStory3:
    "Flat prices rise about 6% a year. Saving without a plan never catches up.",
  hpNext:
    "Next",
  hpAsk:
    "Do you have a home of your own?",
  hpOwn:
    "Yes, I own one",
  hpRentAns:
    "No, I pay rent",
  hpFamily:
    "No, I live with family",
  hpOwnReply:
    "Great. Come back when you plan your next place.",
  hpBack:
    "Back to My Money",
  hpPlanTitle:
    "Home Roadmap",
  hpPlanSub:
    "From renter to down-payment ready",
  hpBurnTitle:
    "Rent burn",
  hpBurnHint:
    "What rent costs you, and what the same money could have grown into.",
  hpRentLabel:
    "Monthly rent",
  hpHike:
    "Yearly rent rise (%)",
  hpNYears:
    "{n} years",
  hpPaid:
    "Rent paid",
  hpCouldBe:
    "Could have grown to",
  hpTargetTitle:
    "Your real target",
  hpTargetHint:
    "Prices rise, so we plan for the price on closing day.",
  hpPrice:
    "Home price today",
  hpBuyIn:
    "Buy in (years)",
  hpPropInfl:
    "Property price rise (%)",
  hpDown:
    "Down payment (%)",
  hpReg:
    "Registration and tax (%)",
  hpFuturePrice:
    "Home price then",
  hpCashNeeded:
    "Cash needed on the day",
  hpSaveTitle:
    "Monthly savings",
  hpReturn:
    "Expected yearly return (%)",
  hpMonthly:
    "Save every month",
  hpIfBank:
    "In a 4% savings account you would need {amount} a month.",
  hpBucketShort:
    "Under 2 years: keep it safe in an FDR or DPS.",
  hpBucketLong:
    "2 years or more: mix DPS with dividend funds or gold, so returns can beat property prices.",
  hpSafeTitle:
    "Safe zone",
  hpSafeHint:
    "Keep the loan payment under 35% of income.",
  hpIncome:
    "Monthly income then",
  hpLoanRate:
    "Loan rate (%)",
  hpTenor:
    "Loan years",
  hpMaxEmi:
    "Safe monthly payment",
  hpMaxLoan:
    "Largest safe loan",
  hpMaxPrice:
    "Largest safe home price",
  hpSafeYes:
    "Your target is inside the safe zone.",
  hpSafeNo:
    "Your target is above the safe zone. Aim near {amount}, or raise income or the down payment.",
  hpNeedIncome:
    "Add your income to see this.",
  hpMakeGoal:
    "Add to my goals",
  hpGoalMade:
    "Added to your goals",
  hpSeeGoals:
    "See goals",
  hpGoalTitle:
    "Home down payment",
  hpDisclaimer:
    "Rough estimates. Real prices, rates and fees change.",
  hpRedo:
    "Start the story again",
  dpEntryTitle:
    "Debt free",
  dpEntrySub:
    "A short story, then your plan",
  dpStory1:
    "Karim borrows {amount} at {rate}% a year. He pays {pay} a month.",
  dpStory2:
    "After {months} months he has paid {total}. {interest} of it was only interest.",
  dpStory3:
    "Add just {extra} more each month and he is free {months} months sooner, saving {saved}.",
  dpAsk:
    "Do you owe anyone money?",
  dpNo:
    "No, I am debt free",
  dpYes:
    "Yes, I owe money",
  dpNoReply:
    "Great. Stay here. Borrow only when it builds something.",
  dpPlanTitle:
    "Debt Planner",
  dpPlanSub:
    "One debt at a time, until you are free",
  dpListTitle:
    "What you owe",
  dpListHint:
    "Add the interest and the smallest monthly payment for each.",
  dpOwed:
    "Owed",
  dpRate:
    "Interest a year (%)",
  dpMin:
    "Smallest payment a month",
  dpName:
    "Who or what",
  dpAdd:
    "Add this debt",
  dpRemove:
    "Remove",
  dpPlanSection:
    "Your pay-off plan",
  dpExtra:
    "Extra you can pay each month",
  dpAvalanche:
    "Highest interest first",
  dpAvalancheHint:
    "Costs you the least",
  dpSnowball:
    "Smallest debt first",
  dpSnowballHint:
    "Quick wins keep you going",
  dpFreeBy:
    "Debt free by",
  dpInterestTotal:
    "Interest you will pay",
  dpSaves:
    "Your extra saves {saved} and {months} months.",
  dpOrder:
    "Order to clear",
  dpClearedIn:
    "clear in {n} months",
  dpNever:
    "These payments never clear the debt. Raise a payment or add extra.",
  dpNeedPay:
    "Add a payment to see your plan.",
  dpRedo:
    "Start the story again",
  dpDisclaimer:
    "Rough estimates. Your lender's real terms may differ.",
  dpTabDebts:
    "Debts",
  dpTabStrategy:
    "Strategy",
  dpTabPlan:
    "Plan",
  dpTabTrack:
    "Track",
  dpDueDay:
    "Due day (1-31)",
  dpThisMonth:
    "Pay this month",
  dpRemind:
    "Remind me every month",
  dpRemindOn:
    "Reminders are on. You will see them under Bills.",
  dpRemindNeedDay:
    "Set a due day on at least one debt first.",
  dpPaidSoFar:
    "{paid} of {total} paid",
  dpLogPayment:
    "Log payment",
  dpPayAmount:
    "Amount paid",
  dpDueIn:
    "Due in {n} days",
  dpDueToday:
    "Due today",
  dpNoDue:
    "No due day set",
  dpCleared:
    "Cleared 🎉",
  dpTotalProgress:
    "Total paid off",
  dpHistory:
    "Recent payments",
  dpNoDebts:
    "Add a debt in the Debts tab first.",
  txTitle:
    "Transactions",
  txCount:
    "{n} entries",
  txSearch:
    "Search by name, note or amount",
  txAll:
    "All",
  txInvested:
    "Invested",
  txTransfers:
    "Transfers",
  txTransferOne:
    "Transfer",
  txSpent:
    "Spent",
  txNet:
    "Net",
  txToday:
    "Today",
  txYesterday:
    "Yesterday",
  txEdit:
    "Edit",
  txDelete:
    "Delete",
  txDeleteConfirm:
    "Delete this entry? This cannot be undone.",
  txEmpty:
    "No entries here yet.",
  txNoMatch:
    "Nothing matches your search.",
  txAllTime:
    "All time",
  txPrevMonth:
    "Previous month",
  txNextMonth:
    "Next month",
  rpTitle:
    "Reports",
  rpKept:
    "You kept {pct}% of what you earned.",
  rpOver:
    "You spent more than you earned.",
  rpNoIncome:
    "No income added for this month yet.",
  rpEarned:
    "Earned",
  rpSpentLabel:
    "Spent",
  rpInvestedLabel:
    "Invested",
  rpVsLast:
    "vs last month",
  rpWhere:
    "Where your money went",
  rpOther:
    "Other",
  rpByDay:
    "Spending by day",
  rpBiggestDay:
    "Biggest day: {day}, {amount}",
  rpFacts:
    "Quick facts",
  rpBiggest:
    "Biggest category",
  rpAvgDay:
    "Average a day",
  rpNoSpend:
    "No-spend days",
  rpTrend:
    "Money kept, last 6 months",
  rpDownload:
    "Download this month (CSV)",
  rpEmpty:
    "No entries in this month yet.",
  rpKeptOf:
    "Kept {kept} of {income}",
  stLevel:
    "Level {n}",
  stViewProfile:
    "View profile",
  stDanger:
    "Danger zone",
  stOn:
    "On",
  stOff:
    "Off",
  stSecurity:
    "Security and backup",
  ivTitle:
    "Invest",
  ivSub:
    "Grow your money with a plan",
  ivTabPortfolio:
    "Portfolio",
  ivTabGrow:
    "Grow",
  ivTabRetire:
    "Retire",
  ivTabLearn:
    "Learn",
  ivValue:
    "Portfolio value",
  ivInvestedLbl:
    "Invested",
  ivGain:
    "Gain",
  ivAdd:
    "Add investment",
  ivNoneTitle:
    "Start your portfolio",
  ivNoneText:
    "Add what you already own, or open Grow to see what regular saving can become.",
  ivHoldings:
    "Holdings",
  ivMix:
    "Your mix",
  ivSpread:
    "{pct}% of your portfolio is in {type}. Spreading across types lowers the risk.",
  ivGrowTitle:
    "Compound growth",
  ivStart:
    "Starting amount",
  ivMonthly:
    "Add every month",
  ivRate:
    "Yearly return (%)",
  ivYears:
    "Years",
  ivInflation:
    "Inflation (%)",
  ivFinal:
    "You could have",
  ivPutIn:
    "You put in",
  ivEarned:
    "Growth earned",
  ivReal:
    "In today's money: {amount}",
  ivDouble:
    "At {rate}% your money doubles about every {n} years.",
  ivEarlyTitle:
    "Start early wins",
  ivEarlyText:
    "Starting 5 years later leaves you with {amount} less at the end.",
  ivExample:
    "Example numbers. Use your own.",
  ivChart:
    "Growth by year",
  ivRetTitle:
    "Retirement planner",
  ivAge:
    "Your age",
  ivRetireAge:
    "Retire at",
  ivLifeTo:
    "Plan until age",
  ivCostNow:
    "Monthly cost today",
  ivSaved:
    "Saved for retirement",
  ivSavingNow:
    "Saving each month",
  ivRetReturn:
    "Return before retiring (%)",
  ivPostReturn:
    "Return after retiring (%)",
  ivNeedAtRet:
    "Monthly cost then",
  ivNest:
    "Nest egg you need",
  ivProjected:
    "Your savings by then",
  ivOnTrack:
    "You are on track.",
  ivShort:
    "You are short by {amount}. Save {monthly} more each month to close the gap.",
  ivReady:
    "{pct}% ready",
  ivYearsLeft:
    "{n} years to go",
  ivRetNote:
    "Rough estimate. Costs rise with inflation, and your money keeps earning after you retire.",
  ivBadAges:
    "Retirement age must be above your age, and the plan age above that.",
  ivRules:
    "Coach rules",
  ivRule1:
    "Build an emergency fund first: 3 months of spending.",
  ivRule2:
    "Pay high-interest debt before you invest.",
  ivRule3:
    "Spread your money across different types.",
  ivRule4:
    "Time beats timing. Start early and stay.",
  ivByTime:
    "Pick by timeline",
  ivUnder1:
    "Under 1 year",
  ivMid:
    "1 to 5 years",
  ivOver5:
    "5 years or more",
  ivUnder1Do:
    "Keep it safe and easy to reach: savings account or DPS.",
  ivMidDo:
    "Steady and low risk: FDR, savings certificates, bonds.",
  ivOver5Do:
    "Let it grow: add mutual funds or stocks, plus gold, in small steps.",
  ivRisk:
    "Risk",
  ivHorizon:
    "Best for",
  ivGoodFor:
    "Good for",
  ivWatch:
    "Watch out",
  ivCheckRates:
    "Rates and rules change. Check with your bank or the official source before you invest.",
  invAddTitle:
    "Add investment",
  invEditTitle:
    "Edit investment",
  invWhat:
    "What is it?",
  invGroupSafe:
    "Safe and steady",
  invGroupGrow:
    "Grow over time",
  invGroupSpecial:
    "Long-term and special",
  invName:
    "Name",
  invHow:
    "How do you want to enter it?",
  invModeTotal:
    "Total amount",
  invModeMonthly:
    "Every month",
  invModeUnits:
    "Units × price",
  invPutIn:
    "Money you put in",
  invWorth:
    "Worth today",
  invWorthHint:
    "Leave empty if it is the same",
  invMonthlyAmt:
    "Deposit each month",
  invMonthsPaid:
    "Months paid so far",
  invUnitsLabel:
    "How many (shares, units or grams)",
  invBuyPrice:
    "Buy price each",
  invNowPrice:
    "Price today each",
  invNowPriceHint:
    "Leave empty to use the buy price",
  invSummaryIn:
    "Put in",
  invSummaryWorth:
    "Worth today",
  invSummaryGain:
    "Gain",
  invStartDate:
    "Starting date",
  invNewPurchase:
    "Did you just buy this?",
  invYesNew:
    "Yes, just bought",
  invNoOwned:
    "No, I already own it",
  invPaidFrom:
    "Paid from",
  invCashWillDrop:
    "{amount} will be taken from your cash.",
  invCashSame:
    "Your cash will not change.",
  invLinkedNote:
    "The purchase entry will update to match.",
  invNote:
    "Note (optional)",
  invSave:
    "Save investment",
  invSaveChanges:
    "Save changes",
  invCancel:
    "Cancel",
  invRemoveTitle:
    "Remove {name}",
  invRemoveMistake:
    "I added it by mistake",
  invRemoveMistakeSub:
    "Removes it and gives the money back to your cash.",
  invRemoveSold:
    "I sold it",
  invRemoveSoldSub:
    "Removes it and adds the sale money to your cash.",
  invRemoveOnly:
    "Just remove it",
  invRemoveOnlySub:
    "Removes it. Your cash does not change.",
  invSoldFor:
    "Sold for",
  invConfirmSold:
    "Confirm sale",
  coachMenu:
    "Money Coach",
  tmMenu:
    "Time Machine",
  occMenu:
    "Eid and festivals",
  somMenu:
    "Somiti",
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
  lgFreedomTitle:
    "আর্থিক স্বাধীনতার অঙ্ক",
  lgFreedomHint:
    "মাসিক খরচ × ১২ × ২৫। এই পরিমাণ জমলে আপনার সঞ্চয়ই আপনার জীবনযাত্রার খরচ চালাবে।",
  lgMonthlyCost:
    "মাসিক জীবনযাত্রার খরচ",
  lgSetCost:
    "আপনার অঙ্ক দেখতে মাসিক খরচ লিখুন।",
  lgYouHave:
    "আপনার আছে {amount}",
  lgPercentDone:
    "{percent}% পূর্ণ",
  lgGoalsTitle:
    "জীবনের লক্ষ্য",
  lgAddGoal:
    "লক্ষ্য যোগ করুন",
  lgGoalName:
    "লক্ষ্যের নাম, যেমন বাড়ি কেনা",
  lgAmount:
    "প্রয়োজনীয় পরিমাণ",
  lgYear:
    "লক্ষ্য সাল (ঐচ্ছিক)",
  lgSave:
    "লক্ষ্য সংরক্ষণ করুন",
  lgEmpty:
    "জীবনের বড় স্বপ্নগুলো যোগ করুন, যেমন বাড়ি, হজ্জ বা সন্তানের পড়াশোনা।",
  lgTotal:
    "সব লক্ষ্যের মোট: {amount}",
  lgEdit:
    "সম্পাদনা",
  lgSaveCost:
    "সংরক্ষণ",
  lgChangePhoto:
    "ছবি পরিবর্তন",
  lgDelete:
    "মুছুন",
  lgByYear:
    "{year} সালের মধ্যে",
  cfTitle:
    "অর্থপ্রবাহ",
  cfSubtitle:
    "আপনার টাকা কোথা থেকে আসে আর কোথায় যায় দেখুন।",
  fpTitle:
    "ফ্রিডম পাথ",
  fpSubtitle:
    "ট্র্যাকিং থেকে স্বাধীনতার ৭ ধাপ",
  fpStepOf:
    "ধাপ {n}/{total}",
  fpYouAreHere:
    "আপনি এখানে",
  fpDoneLabel:
    "সম্পন্ন",
  fpAllDone:
    "সব ধাপ শেষ। কাজ এখন আপনার পছন্দ।",
  fpGo:
    "শুরু করুন",
  fpTrackTitle:
    "টাকার হিসাব রাখুন",
  fpTrackHint:
    "গত ৩০ দিনে {total}টির মধ্যে {n}টি এন্ট্রি",
  fpPlanTitle:
    "প্রতিটি টাকার কাজ ঠিক করুন",
  fpPlanHint:
    "এই মাসের টাকার পরিকল্পনা করুন",
  fpStarterTitle:
    "শুরুর নিরাপত্তা: ১ মাস",
  fpSafetyTitle:
    "নিরাপত্তা তহবিল: ৩ মাস",
  fpRunwayHint:
    "{n} মাসের খরচ জমা আছে",
  fpDebtTitle:
    "দেনা শোধ করুন",
  fpDebtHint:
    "{amount} এখনও বাকি",
  fpDebtFree:
    "কোনো দেনা নেই।",
  fpInvestTitle:
    "বিনিয়োগ শুরু করুন",
  fpInvestHint:
    "কিছু টাকা কাজে লাগান",
  fpFreedomTitle:
    "ফ্রিডম নাম্বারে পৌঁছান",
  fpFreedomHint:
    "{amount}-এর {n}%",
  fpFreedomSet:
    "এটি দেখতে প্রোফাইলে মাসিক খরচ দিন",
  brTitle:
    "৫০/৩০/২০ হিসাব",
  brSubtitle:
    "আয়ের তুলনায় প্রয়োজন, চাহিদা ও সঞ্চয়",
  brNeeds:
    "প্রয়োজন",
  brWants:
    "চাহিদা",
  brSavings:
    "সঞ্চয়",
  brTarget:
    "লক্ষ্য {n}%",
  brNoIncome:
    "ভাগ দেখতে এই মাসের আয় যোগ করুন।",
  brSuggest:
    "২০% সঞ্চয়ের কাছে যেতে {category}-এ প্রায় {amount} কম খরচ করুন।",
  brOnTrack:
    "আপনি ঠিক পথে আছেন। চালিয়ে যান।",
  brSortTitle:
    "ক্যাটেগরি সরান",
  brTagNeed:
    "প্রয়োজন",
  brTagWant:
    "চাহিদা",
  cfThisMonth:
    "এই মাস",
  cfLastMonth:
    "গত মাস",
  cf3Months:
    "৩ মাস",
  cfYear:
    "এই বছর",
  cfIncome:
    "আয়",
  cfSpent:
    "খরচ",
  cfInvested:
    "বিনিয়োগ",
  cfSaved:
    "সঞ্চয়",
  cfShortfall:
    "সঞ্চয় থেকে",
  cfOther:
    "অন্যান্য",
  cfIn:
    "যা এসেছে",
  cfOut:
    "যেভাবে গেছে",
  cfEmpty:
    "এই সময়ে এখনো কোনো আয় বা খরচ নেই। কিছু লেনদেন যোগ করলে প্রবাহ দেখতে পাবেন।",
  cfTapHint:
    "বিস্তারিত দেখতে ব্লকে ট্যাপ করুন।",
  cfShare:
    "মোট আয়ের {percent}%",
  cfCount:
    "{count}টি এন্ট্রি",
  cfKept:
    "আপনি যা পেয়েছেন তার {percent}% রেখেছেন।",
  cfOverspent:
    "আপনি আয়ের চেয়ে {amount} বেশি ব্যবহার করেছেন।",
  insTitle:
    "বিশ্লেষণ",
  insSubtitle:
    "আপনার টাকার চার্ট ও পরামর্শ।",
  insMore:
    "সব বিশ্লেষণ দেখুন",
  insPortfolio:
    "বিনিয়োগ পোর্টফোলিও",
  insInvested:
    "বিনিয়োগ",
  insCurrent:
    "বর্তমান মূল্য",
  insProfit:
    "লাভ",
  insReturn:
    "রিটার্ন",
  moreGroupMoney:
    "টাকা পরিচালনা",
  moreGroupInsights:
    "টাকা দেখুন",
  moreGroupYou:
    "আপনি",
  inVerdictGreat:
    "এই মাসে আপনি দারুণ করছেন",
  inVerdictOk:
    "কিছু টাকা রাখছেন। আরও বাড়ানো যাক।",
  inVerdictLow:
    "এই মাসে টাকার টান চলছে",
  inVerdictNone:
    "আপনার গল্প দেখতে কয়েকটি এন্ট্রি যোগ করুন",
  inKeptSoFar:
    "এই মাসে এ পর্যন্ত রেখেছেন",
  inGoalLine:
    "লক্ষ্য: আয়ের {percent}% রাখা",
  inStoryTitle:
    "আপনার মাস, সহজ কথায়",
  inLess:
    "গত মাসের চেয়ে {amount} কম খরচ করেছেন। চমৎকার।",
  inMore:
    "গত মাসের চেয়ে {amount} বেশি খরচ করেছেন।",
  inTop:
    "{category} আপনার সবচেয়ে বড় খরচ: {amount}, মোট খরচের {percent}%।",
  inGap:
    "আপনার {percent}% লক্ষ্যে পৌঁছাতে এ মাসে আরও {amount} রাখুন।",
  inGood:
    "আপনি {percent}% রাখছেন, যা {goal}% লক্ষ্যের চেয়ে বেশি।",
  inNoSpend:
    "এ মাসে {count} দিন কোনো খরচ হয়নি।",
  inBiggest:
    "সবচেয়ে বড় একক খরচ: {name}, {amount}।",
  inActionGoals:
    "লক্ষ্য ঠিক করুন",
  inActionAdd:
    "এন্ট্রি যোগ করুন",
  inActionFlow:
    "অর্থপ্রবাহ দেখুন",
  inPaceTitle:
    "খরচের গতি",
  inPaceSub:
    "{spent} খরচ, {total} দিনের {day} দিন",
  inPaceMonth:
    "মাস এ পর্যন্ত",
  inPaceSpent:
    "খরচ",
  inPaceProjection:
    "এই গতিতে মাস শেষে প্রায় {amount} খরচ হবে।",
  inPaceLast:
    "গত মাসে খরচ হয়েছিল {amount}।",
  inDailyTitle:
    "প্রতিদিন নিরাপদ খরচ",
  inDailyLine:
    "পরের {days} দিন, তাহলেও বাকিটা থাকবে।",
  inDailyNone:
    "এ মাসে যা এসেছে সবই ব্যবহার হয়ে গেছে।",
  inChangedTitle:
    "গত মাসের পর কী বদলেছে",
  inSixTitle:
    "গত ৬ মাসে রাখা টাকা",
  inBest:
    "সেরা মাস: {month}, রেখেছেন {amount}",
  inFreedomTitle:
    "আর্থিক স্বাধীনতা",
  inFreedomLine:
    "আপনার স্বাধীনতার অঙ্কের {percent}%",
  inFreedomSet:
    "এটি ট্র্যাক করতে আপনার স্বাধীনতার অঙ্ক ঠিক করুন।",
  inDeepDive:
    "বিস্তারিত চার্ট",
  fxTitle:
    "ফ্লেক্স জোন",
  fxEraLabel:
    "আপনার মানি এরা",
  fxEra1:
    "আনটাচেবল",
  fxEra2:
    "পুরো ফোকাসে",
  fxEra3:
    "গরম হচ্ছে",
  fxEra4:
    "নতুন করে শুরু",
  fxEra0:
    "শুরু এখান থেকেই",
  fxHide:
    "অঙ্ক লুকান",
  fxShow:
    "অঙ্ক দেখান",
  fxCards:
    "ফ্লেক্স কার্ড",
  fxShare:
    "শেয়ার",
  fxCopied:
    "কপি হয়েছে",
  fxKeptBig:
    "{amount} জমিয়েছি",
  fxKeptCap:
    "জমানোতে ফুল ফর্মে।",
  fxRateBig:
    "{percent}% সঞ্চয়",
  fxRateHigh:
    "সঞ্চয়ের হার: দুর্দান্ত।",
  fxRateMid:
    "উঠছি। দেখে নিন।",
  fxStreakBig:
    "{days} দিনের স্ট্রিক",
  fxStreakCap:
    "থামছি না।",
  fxNoSpendBig:
    "{count} দিন খরচ ০",
  fxNoSpendCap:
    "ডিসিপ্লিন মোড অন।",
  fxLessBig:
    "{amount} কম খরচ",
  fxLessCap:
    "ওয়ালেট বলছে ধন্যবাদ।",
  fxFreeBig:
    "{percent}% স্বাধীন",
  fxFreeCap:
    "মুক্তির পথে।",
  fxWorthBig:
    "মোট {amount}",
  fxWorthCap:
    "লেভেল আপ।",
  fxLevelBig:
    "লেভেল {level}",
  fxTrophyBig:
    "{count}টি ট্রফি",
  fxTrophyCap:
    "জমাচ্ছি একটা একটা করে।",
  fxStartBig:
    "ফ্লেক্স শুরু করুন",
  fxStartCap:
    "একটা এন্ট্রি যোগ করুন।",
  fxShelfTitle:
    "ট্রফি শেলফ",
  fxDaysTitle:
    "খরচহীন দিন",
  fxDaysCount:
    "এ পর্যন্ত {count}",
  fxFreedomTitle:
    "ফ্রিডম মিটার",
  fxSaved:
    "সেভ হয়েছে",
  fxSave:
    "ছবি সেভ করুন",
  pgTitle:
    "অগ্রগতি",
  pgSub:
    "চারটি সংখ্যা, যা দেখায় আপনি সত্যিই এগোচ্ছেন কি না।",
  pgHeadKept:
    "গত {months} মাসে আপনি {amount} রেখেছেন।",
  pgHeadLost:
    "গত {months} মাসে আয়ের চেয়ে {amount} বেশি খরচ হয়েছে।",
  pgHeadNone:
    "অগ্রগতি দেখতে আয় ও খরচ যোগ করুন।",
  pgOverMonths:
    "{months} মাসে",
  pgWealthTitle:
    "জমানো টাকা",
  pgWealthSub:
    "আয় থেকে খরচ বাদ দিয়ে চলমান মোট।",
  pgRateTitle:
    "সঞ্চয়ের হার",
  pgLast3:
    "গত ৩ মাস",
  pgPoints:
    "আগের ৩ মাসের চেয়ে {points} পয়েন্ট",
  pgTarget:
    "লক্ষ্য {percent}%",
  pgRunwayTitle:
    "নিরাপত্তা সময়",
  pgRunwayValue:
    "{months} মাস",
  pgRunwayLine:
    "আপনার নগদ এতগুলো মাসের খরচ চালাতে পারবে।",
  pgRunwayGood:
    "ভালো অবস্থা। সাধারণ লক্ষ্য ৩ থেকে ৬ মাস।",
  pgRunwayBuild:
    "আগে ৩ মাসের লক্ষ্য রাখুন।",
  pgFreeTitle:
    "আর্থিক স্বাধীনতা",
  pgFreeCover:
    "মাসিক খরচের এতটুকু বিনিয়োগ থেকে চলে যায়।",
  pgFreeNote:
    "বছরে ৪% তোলার হিসাবে।",
  pgNoInvest:
    "খরচ চালাতে বিনিয়োগ শুরু করুন।",
  pgNoCash:
    "এটি দেখতে আপনার অ্যাকাউন্ট যোগ করুন।",
  pgSubtitle:
    "সময়ের সাথে আপনার টাকা।",
  pgNetWorth:
    "মোট সম্পদ",
  pgChange6:
    "৬ মাসে {amount}",
  pgEstimated:
    "আপনার এন্ট্রি থেকে অনুমান।",
  pgNeedData:
    "ট্রেন্ড দেখতে কয়েক মাসের এন্ট্রি যোগ করুন।",
  pgRunway:
    "রানওয়ে",
  pgRunwayVal:
    "{months} মাস",
  pgRunwaySub:
    "খরচ চালানো যাবে",
  pgSavingsRate:
    "সঞ্চয়ের হার",
  pgSavingsSub:
    "৩ মাসের গড়",
  pgSpending:
    "খরচ",
  pgSpendingSub:
    "আগের ৩ মাসের তুলনায়",
  pgFreedomTitle:
    "স্বাধীনতার তারিখ",
  pgFreedomDate:
    "{date}",
  pgFreedomNote:
    "গত ৩ মাসের গতিতে, বিনিয়োগ-বৃদ্ধি ধরা ছাড়া।",
  pgFreedomReached:
    "আপনি স্বাধীনতার অঙ্কে পৌঁছে গেছেন।",
  pgFreedomNeed:
    "তারিখ দেখতে প্রতি মাসে আরও সঞ্চয় করুন।",
  pgFreedomFar:
    "এই গতিতে ৫০ বছরের বেশি লাগবে।",
  pgChecksTitle:
    "মৌলিক বিষয়",
  pgCheck1:
    "আয়ের চেয়ে কম খরচ",
  pgCheck2:
    "২০% বা বেশি সঞ্চয়",
  pgCheck3:
    "৩ বা তার বেশি মাসের রানওয়ে",
  pgCheck4:
    "কোনো বকেয়া বিল নেই",
  pgShareTitle:
    "আপনার অগ্রগতি শেয়ার করুন",
  pgUp:
    "বেড়েছে",
  pgDown:
    "কমেছে",
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
  gtShort:
    "স্বল্পমেয়াদি",
  gtMedium:
    "মধ্যমেয়াদি",
  gtLong:
    "দীর্ঘমেয়াদি",
  gtShortRange:
    "১ বছরের কম",
  gtMediumRange:
    "১ থেকে ৫ বছর",
  gtLongRange:
    "৫ বছরের বেশি",
  gtPick:
    "কবে এটি চান?",
  gtEmptyShort:
    "স্বল্পমেয়াদি লক্ষ্য নেই। জরুরি তহবিল বা ফোন দিয়ে শুরু করুন।",
  gtEmptyMedium:
    "মধ্যমেয়াদি লক্ষ্য নেই। বাইক, বিয়ে বা কোর্স দিয়ে শুরু করুন।",
  gtEmptyLong:
    "দীর্ঘমেয়াদি লক্ষ্য নেই। বাড়ি, হজ বা সন্তানের পড়াশোনা দিয়ে শুরু করুন।",
  gtAddHere:
    "লক্ষ্য যোগ করুন",
  gtTotalSaved:
    "{target}-এর মধ্যে {saved} জমেছে",
  gtMonthsLeft:
    "আর {n} মাস",
  gtDueNow:
    "এই মাসেই শেষ",
  gtPastDue:
    "সময় পার হয়েছে",
  gtNoDate:
    "তারিখ দেওয়া নেই",
  gtPerMonth:
    "সময়মতো শেষ করতে মাসে {amount} জমান",
  gtGoalsCount:
    "{n}টি লক্ষ্য",
  gtLifeLink:
    "আপনার ফ্রিডম নাম্বার প্রোফাইলে আছে",
  hpEntryTitle:
    "ভাড়া থেকে নিজের বাড়ি",
  hpEntrySub:
    "ছোট একটি গল্প, তারপর আপনার পরিকল্পনা",
  hpStory1:
    "রহিম প্রতি মাসে {rent} ভাড়া দেন।",
  hpStory2:
    "২০ বছরে {total} চলে যায়। আর নিজের দরজার চাবি? শূন্য।",
  hpStory3:
    "ফ্ল্যাটের দাম বছরে প্রায় ৬% বাড়ে। পরিকল্পনা ছাড়া সঞ্চয় কখনো নাগাল পায় না।",
  hpNext:
    "পরের",
  hpAsk:
    "আপনার কি নিজের বাড়ি আছে?",
  hpOwn:
    "হ্যাঁ, আছে",
  hpRentAns:
    "না, আমি ভাড়া দিই",
  hpFamily:
    "না, পরিবারের সাথে থাকি",
  hpOwnReply:
    "দারুণ। পরের বাড়ির পরিকল্পনা করলে আবার আসুন।",
  hpBack:
    "আমার টাকায় ফিরুন",
  hpPlanTitle:
    "হোম রোডম্যাপ",
  hpPlanSub:
    "ভাড়াটিয়া থেকে ডাউন পেমেন্টের জন্য প্রস্তুত",
  hpBurnTitle:
    "ভাড়ায় পুড়ছে যা",
  hpBurnHint:
    "ভাড়ায় কত যায়, আর সেই টাকা জমালে কত হতো।",
  hpRentLabel:
    "মাসিক ভাড়া",
  hpHike:
    "বছরে ভাড়া বাড়ে (%)",
  hpNYears:
    "{n} বছর",
  hpPaid:
    "ভাড়া দিয়েছেন",
  hpCouldBe:
    "জমালে হতো",
  hpTargetTitle:
    "আপনার আসল লক্ষ্য",
  hpTargetHint:
    "দাম বাড়ে, তাই কেনার দিনের দামের হিসাবে পরিকল্পনা।",
  hpPrice:
    "আজকের বাড়ির দাম",
  hpBuyIn:
    "কত বছরে কিনবেন",
  hpPropInfl:
    "সম্পত্তির দাম বাড়ে (%)",
  hpDown:
    "ডাউন পেমেন্ট (%)",
  hpReg:
    "রেজিস্ট্রেশন ও কর (%)",
  hpFuturePrice:
    "তখনকার দাম",
  hpCashNeeded:
    "সেদিন যত নগদ লাগবে",
  hpSaveTitle:
    "মাসিক সঞ্চয়",
  hpReturn:
    "প্রত্যাশিত বার্ষিক রিটার্ন (%)",
  hpMonthly:
    "প্রতি মাসে জমান",
  hpIfBank:
    "৪% সঞ্চয়ী হিসাবে মাসে {amount} লাগত।",
  hpBucketShort:
    "২ বছরের কম: FDR বা DPS-এ নিরাপদ রাখুন।",
  hpBucketLong:
    "২ বছর বা বেশি: DPS-এর সাথে ডিভিডেন্ড ফান্ড বা স্বর্ণ মেশান, যাতে রিটার্ন সম্পত্তির দামের সাথে পাল্লা দেয়।",
  hpSafeTitle:
    "নিরাপদ সীমা",
  hpSafeHint:
    "কিস্তি আয়ের ৩৫%-এর নিচে রাখুন।",
  hpIncome:
    "তখনকার মাসিক আয়",
  hpLoanRate:
    "ঋণের সুদ (%)",
  hpTenor:
    "ঋণের বছর",
  hpMaxEmi:
    "নিরাপদ মাসিক কিস্তি",
  hpMaxLoan:
    "সর্বোচ্চ নিরাপদ ঋণ",
  hpMaxPrice:
    "সর্বোচ্চ নিরাপদ বাড়ির দাম",
  hpSafeYes:
    "আপনার লক্ষ্য নিরাপদ সীমার ভেতরে।",
  hpSafeNo:
    "আপনার লক্ষ্য নিরাপদ সীমার ওপরে। {amount}-এর কাছাকাছি রাখুন, অথবা আয় বা ডাউন পেমেন্ট বাড়ান।",
  hpNeedIncome:
    "এটি দেখতে আয় লিখুন।",
  hpMakeGoal:
    "লক্ষ্যে যোগ করুন",
  hpGoalMade:
    "লক্ষ্যে যোগ হয়েছে",
  hpSeeGoals:
    "লক্ষ্য দেখুন",
  hpGoalTitle:
    "বাড়ির ডাউন পেমেন্ট",
  hpDisclaimer:
    "মোটামুটি হিসাব। আসল দাম, সুদ ও ফি বদলায়।",
  hpRedo:
    "গল্পটি আবার দেখুন",
  dpEntryTitle:
    "দেনামুক্ত",
  dpEntrySub:
    "ছোট একটি গল্প, তারপর আপনার পরিকল্পনা",
  dpStory1:
    "করিম বছরে {rate}% সুদে {amount} ধার নেন। তিনি মাসে {pay} দেন।",
  dpStory2:
    "{months} মাস পর তিনি {total} দিয়েছেন। এর {interest} শুধুই সুদ।",
  dpStory3:
    "প্রতি মাসে মাত্র {extra} বেশি দিলে তিনি {months} মাস আগে মুক্ত, আর {saved} বাঁচান।",
  dpAsk:
    "আপনি কি কারও কাছে টাকা ধারেন?",
  dpNo:
    "না, আমি দেনামুক্ত",
  dpYes:
    "হ্যাঁ, ধার আছে",
  dpNoReply:
    "দারুণ। এভাবেই থাকুন। শুধু তখনই ধার নিন যখন তা কিছু গড়ে।",
  dpPlanTitle:
    "ঋণ পরিকল্পনা",
  dpPlanSub:
    "একবারে একটি ঋণ, মুক্ত না হওয়া পর্যন্ত",
  dpListTitle:
    "যা ধার আছে",
  dpListHint:
    "প্রতিটির সুদ ও সর্বনিম্ন মাসিক কিস্তি লিখুন।",
  dpOwed:
    "বাকি",
  dpRate:
    "বার্ষিক সুদ (%)",
  dpMin:
    "সর্বনিম্ন মাসিক কিস্তি",
  dpName:
    "কার কাছে / কী জন্য",
  dpAdd:
    "ঋণ যোগ করুন",
  dpRemove:
    "মুছুন",
  dpPlanSection:
    "আপনার শোধের পরিকল্পনা",
  dpExtra:
    "প্রতি মাসে অতিরিক্ত যা দিতে পারেন",
  dpAvalanche:
    "বেশি সুদ আগে",
  dpAvalancheHint:
    "সবচেয়ে কম খরচ",
  dpSnowball:
    "ছোট ঋণ আগে",
  dpSnowballHint:
    "দ্রুত জয় এগিয়ে রাখে",
  dpFreeBy:
    "দেনামুক্ত হবেন",
  dpInterestTotal:
    "সুদ দেবেন",
  dpSaves:
    "আপনার অতিরিক্ত টাকা {saved} ও {months} মাস বাঁচায়।",
  dpOrder:
    "শোধের ক্রম",
  dpClearedIn:
    "{n} মাসে শোধ",
  dpNever:
    "এই কিস্তিতে ঋণ কখনো শোধ হবে না। কিস্তি বা অতিরিক্ত টাকা বাড়ান।",
  dpNeedPay:
    "পরিকল্পনা দেখতে একটি কিস্তি লিখুন।",
  dpRedo:
    "গল্পটি আবার দেখুন",
  dpDisclaimer:
    "মোটামুটি হিসাব। ঋণদাতার আসল শর্ত আলাদা হতে পারে।",
  dpTabDebts:
    "ঋণ",
  dpTabStrategy:
    "কৌশল",
  dpTabPlan:
    "পরিকল্পনা",
  dpTabTrack:
    "ট্র্যাক",
  dpDueDay:
    "কত তারিখে (১-৩১)",
  dpThisMonth:
    "এই মাসে দিন",
  dpRemind:
    "প্রতি মাসে মনে করান",
  dpRemindOn:
    "রিমাইন্ডার চালু। বিলস-এ দেখতে পাবেন।",
  dpRemindNeedDay:
    "আগে অন্তত একটি ঋণে তারিখ দিন।",
  dpPaidSoFar:
    "{total}-এর {paid} শোধ",
  dpLogPayment:
    "কিস্তি লিখুন",
  dpPayAmount:
    "কত দিলেন",
  dpDueIn:
    "আর {n} দিনে",
  dpDueToday:
    "আজই দিতে হবে",
  dpNoDue:
    "তারিখ দেওয়া নেই",
  dpCleared:
    "শোধ হয়েছে 🎉",
  dpTotalProgress:
    "মোট শোধ হয়েছে",
  dpHistory:
    "সাম্প্রতিক কিস্তি",
  dpNoDebts:
    "আগে ঋণ ট্যাবে একটি ঋণ যোগ করুন।",
  txTitle:
    "লেনদেন",
  txCount:
    "{n}টি এন্ট্রি",
  txSearch:
    "নাম, নোট বা পরিমাণ দিয়ে খুঁজুন",
  txAll:
    "সব",
  txInvested:
    "বিনিয়োগ",
  txTransfers:
    "ট্রান্সফার",
  txTransferOne:
    "ট্রান্সফার",
  txSpent:
    "খরচ",
  txNet:
    "নিট",
  txToday:
    "আজ",
  txYesterday:
    "গতকাল",
  txEdit:
    "এডিট",
  txDelete:
    "মুছুন",
  txDeleteConfirm:
    "এই এন্ট্রি মুছবেন? এটি ফেরানো যাবে না।",
  txEmpty:
    "এখানে এখনও কোনো এন্ট্রি নেই।",
  txNoMatch:
    "আপনার খোঁজার সাথে কিছু মেলেনি।",
  txAllTime:
    "সব সময়",
  txPrevMonth:
    "আগের মাস",
  txNextMonth:
    "পরের মাস",
  rpTitle:
    "রিপোর্ট",
  rpKept:
    "আপনি যা আয় করেছেন তার {pct}% রেখেছেন।",
  rpOver:
    "আয়ের চেয়ে বেশি খরচ হয়েছে।",
  rpNoIncome:
    "এই মাসে এখনও আয় যোগ করা হয়নি।",
  rpEarned:
    "আয়",
  rpSpentLabel:
    "খরচ",
  rpInvestedLabel:
    "বিনিয়োগ",
  rpVsLast:
    "গত মাসের তুলনায়",
  rpWhere:
    "টাকা কোথায় গেল",
  rpOther:
    "অন্যান্য",
  rpByDay:
    "দিনভিত্তিক খরচ",
  rpBiggestDay:
    "সবচেয়ে বেশি: {day}, {amount}",
  rpFacts:
    "দ্রুত তথ্য",
  rpBiggest:
    "সবচেয়ে বড় খাত",
  rpAvgDay:
    "দিনে গড়ে",
  rpNoSpend:
    "খরচহীন দিন",
  rpTrend:
    "গত ৬ মাসে যা রেখেছেন",
  rpDownload:
    "এই মাসের ফাইল নামান (CSV)",
  rpEmpty:
    "এই মাসে এখনও কোনো এন্ট্রি নেই।",
  rpKeptOf:
    "{income}-এর মধ্যে {kept} রেখেছেন",
  stLevel:
    "লেভেল {n}",
  stViewProfile:
    "প্রোফাইল দেখুন",
  stDanger:
    "ঝুঁকিপূর্ণ এলাকা",
  stOn:
    "চালু",
  stOff:
    "বন্ধ",
  stSecurity:
    "নিরাপত্তা ও ব্যাকআপ",
  ivTitle:
    "বিনিয়োগ",
  ivSub:
    "পরিকল্পনা করে টাকা বাড়ান",
  ivTabPortfolio:
    "পোর্টফোলিও",
  ivTabGrow:
    "বাড়ান",
  ivTabRetire:
    "অবসর",
  ivTabLearn:
    "শিখুন",
  ivValue:
    "পোর্টফোলিওর মূল্য",
  ivInvestedLbl:
    "বিনিয়োগ",
  ivGain:
    "লাভ",
  ivAdd:
    "বিনিয়োগ যোগ করুন",
  ivNoneTitle:
    "পোর্টফোলিও শুরু করুন",
  ivNoneText:
    "যা আছে তা যোগ করুন, অথবা নিয়মিত জমালে কত হয় তা দেখতে বাড়ান ট্যাব খুলুন।",
  ivHoldings:
    "আপনার বিনিয়োগ",
  ivMix:
    "আপনার মিশ্রণ",
  ivSpread:
    "পোর্টফোলিওর {pct}% শুধু {type}-এ। একাধিক ধরনে ছড়ালে ঝুঁকি কমে।",
  ivGrowTitle:
    "চক্রবৃদ্ধি বৃদ্ধি",
  ivStart:
    "শুরুর টাকা",
  ivMonthly:
    "প্রতি মাসে যোগ",
  ivRate:
    "বার্ষিক রিটার্ন (%)",
  ivYears:
    "বছর",
  ivInflation:
    "মূল্যস্ফীতি (%)",
  ivFinal:
    "আপনার হতে পারে",
  ivPutIn:
    "আপনি দেবেন",
  ivEarned:
    "বৃদ্ধি থেকে আয়",
  ivReal:
    "আজকের টাকায়: {amount}",
  ivDouble:
    "{rate}% হারে টাকা প্রায় প্রতি {n} বছরে দ্বিগুণ হয়।",
  ivEarlyTitle:
    "আগে শুরু করলেই জয়",
  ivEarlyText:
    "৫ বছর দেরিতে শুরু করলে শেষে {amount} কম থাকে।",
  ivExample:
    "উদাহরণের সংখ্যা। নিজেরটি দিন।",
  ivChart:
    "বছরভিত্তিক বৃদ্ধি",
  ivRetTitle:
    "অবসর পরিকল্পনা",
  ivAge:
    "আপনার বয়স",
  ivRetireAge:
    "অবসর নেবেন",
  ivLifeTo:
    "পরিকল্পনা কত বয়স পর্যন্ত",
  ivCostNow:
    "আজকের মাসিক খরচ",
  ivSaved:
    "অবসরের জন্য জমা",
  ivSavingNow:
    "প্রতি মাসে জমান",
  ivRetReturn:
    "অবসরের আগে রিটার্ন (%)",
  ivPostReturn:
    "অবসরের পরে রিটার্ন (%)",
  ivNeedAtRet:
    "তখনকার মাসিক খরচ",
  ivNest:
    "যত তহবিল লাগবে",
  ivProjected:
    "তখন আপনার জমা",
  ivOnTrack:
    "আপনি ঠিক পথে আছেন।",
  ivShort:
    "{amount} কম পড়ছে। ঘাটতি মেটাতে প্রতি মাসে আরও {monthly} জমান।",
  ivReady:
    "{pct}% প্রস্তুত",
  ivYearsLeft:
    "আর {n} বছর",
  ivRetNote:
    "মোটামুটি হিসাব। মূল্যস্ফীতিতে খরচ বাড়ে, আর অবসরের পরেও টাকা আয় করে।",
  ivBadAges:
    "অবসরের বয়স বর্তমান বয়সের বেশি, আর পরিকল্পনার বয়স তার বেশি হতে হবে।",
  ivRules:
    "কোচের নিয়ম",
  ivRule1:
    "আগে জরুরি তহবিল: ৩ মাসের খরচ।",
  ivRule2:
    "বিনিয়োগের আগে বেশি সুদের ঋণ শোধ করুন।",
  ivRule3:
    "টাকা বিভিন্ন ধরনে ছড়িয়ে রাখুন।",
  ivRule4:
    "সময়ই সেরা। আগে শুরু করুন, লেগে থাকুন।",
  ivByTime:
    "সময় অনুযায়ী বাছুন",
  ivUnder1:
    "১ বছরের কম",
  ivMid:
    "১ থেকে ৫ বছর",
  ivOver5:
    "৫ বছর বা বেশি",
  ivUnder1Do:
    "নিরাপদ ও সহজে তোলার মতো রাখুন: সঞ্চয়ী হিসাব বা DPS।",
  ivMidDo:
    "স্থির ও কম ঝুঁকি: FDR, সঞ্চয়পত্র, বন্ড।",
  ivOver5Do:
    "বাড়তে দিন: অল্প অল্প করে মিউচুয়াল ফান্ড বা শেয়ার, সাথে স্বর্ণ।",
  ivRisk:
    "ঝুঁকি",
  ivHorizon:
    "উপযুক্ত সময়",
  ivGoodFor:
    "কাজে লাগে",
  ivWatch:
    "সতর্ক থাকুন",
  ivCheckRates:
    "সুদের হার ও নিয়ম বদলায়। বিনিয়োগের আগে ব্যাংক বা সরকারি উৎসে যাচাই করুন।",
  invAddTitle:
    "বিনিয়োগ যোগ করুন",
  invEditTitle:
    "বিনিয়োগ এডিট করুন",
  invWhat:
    "এটি কী?",
  invGroupSafe:
    "নিরাপদ ও স্থির",
  invGroupGrow:
    "সময়ের সাথে বাড়ে",
  invGroupSpecial:
    "দীর্ঘমেয়াদি ও বিশেষ",
  invName:
    "নাম",
  invHow:
    "কীভাবে লিখবেন?",
  invModeTotal:
    "মোট টাকা",
  invModeMonthly:
    "প্রতি মাসে",
  invModeUnits:
    "পরিমাণ × দাম",
  invPutIn:
    "আপনি যত টাকা দিয়েছেন",
  invWorth:
    "আজকের মূল্য",
  invWorthHint:
    "একই হলে খালি রাখুন",
  invMonthlyAmt:
    "প্রতি মাসের জমা",
  invMonthsPaid:
    "এ পর্যন্ত কত মাস দিয়েছেন",
  invUnitsLabel:
    "কত (শেয়ার, ইউনিট বা গ্রাম)",
  invBuyPrice:
    "কেনা দাম (প্রতিটি)",
  invNowPrice:
    "আজকের দাম (প্রতিটি)",
  invNowPriceHint:
    "খালি রাখলে কেনা দামই ধরা হবে",
  invSummaryIn:
    "দিয়েছেন",
  invSummaryWorth:
    "আজকের মূল্য",
  invSummaryGain:
    "লাভ",
  invStartDate:
    "শুরুর তারিখ",
  invNewPurchase:
    "এটি কি এখনই কিনেছেন?",
  invYesNew:
    "হ্যাঁ, এখনই কিনেছি",
  invNoOwned:
    "না, আগে থেকেই আছে",
  invPaidFrom:
    "কোথা থেকে দিয়েছেন",
  invCashWillDrop:
    "আপনার নগদ থেকে {amount} কাটা হবে।",
  invCashSame:
    "আপনার নগদ বদলাবে না।",
  invLinkedNote:
    "কেনার এন্ট্রিও মিলিয়ে বদলে যাবে।",
  invNote:
    "নোট (ঐচ্ছিক)",
  invSave:
    "বিনিয়োগ সেভ করুন",
  invSaveChanges:
    "পরিবর্তন সেভ করুন",
  invCancel:
    "বাতিল",
  invRemoveTitle:
    "{name} সরান",
  invRemoveMistake:
    "ভুলে যোগ করেছি",
  invRemoveMistakeSub:
    "এটি সরিয়ে টাকা নগদে ফেরত দেয়।",
  invRemoveSold:
    "আমি বিক্রি করেছি",
  invRemoveSoldSub:
    "এটি সরিয়ে বিক্রির টাকা নগদে যোগ করে।",
  invRemoveOnly:
    "শুধু সরান",
  invRemoveOnlySub:
    "এটি সরায়। নগদ বদলায় না।",
  invSoldFor:
    "কত টাকায় বিক্রি",
  invConfirmSold:
    "বিক্রি নিশ্চিত করুন",
  coachMenu:
    "মানি কোচ",
  tmMenu:
    "টাইম মেশিন",
  occMenu:
    "ঈদ ও উৎসব",
  somMenu:
    "সমিতি",
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