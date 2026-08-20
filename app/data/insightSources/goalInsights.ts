import type { AIInsight } from "../aiInsights";
import type { InsightCandidate } from "../insightRegistry";

/* =====================================================
   GOAL TYPES
===================================================== */

export type GoalInsightContext = {
  goalCount: number;

  activeGoalCount: number;

  completedGoalCount: number;

  totalGoalTarget: number;

  totalGoalSaved: number;

  goalsNearCompletion: number;

  goalsBehind: number;

  fastestProgressGoal?: {
    name: string;
    progress: number;
  } | null;

  slowestProgressGoal?: {
    name: string;
    progress: number;
  } | null;
};

/* =====================================================
   HELPERS
===================================================== */

function money(value: number) {
  return `৳${Math.round(value).toLocaleString()}`;
}

function percent(value: number) {
  return `${Math.round(value)}%`;
}

/* =====================================================
   GOAL INSIGHTS
===================================================== */

export function getGoalInsights(
  goal: GoalInsightContext
): InsightCandidate[] {
  const insights: InsightCandidate[] = [];

  /* =================================================
     NO GOALS
  ================================================= */

  if (
    goal.goalCount === 0
  ) {
    insights.push({
      insight: {
        id: "goal-no-active-goals",

        type: "goal",

        title:
          "You don't have a financial goal yet",

        message:
          "Your money becomes easier to direct when you give it a specific destination.",

        action:
          "Create one simple goal and give it a target amount.",

        priority: 82,
      },

      priority: 82,

      category: "goals",

      family: "goal-setup",
    });
  }

  /* =================================================
     ACTIVE GOALS
  ================================================= */

  if (
    goal.activeGoalCount > 0
  ) {
    insights.push({
      insight: {
        id: "active-financial-goals",

        type: "goal",

        title:
          "You're giving your money a direction",

        message:
          `You currently have ${goal.activeGoalCount} active financial goal${
            goal.activeGoalCount === 1
              ? ""
              : "s"
          }. `,

        action:
          "Keep your goals visible and review your progress regularly.",

        priority: 58,
      },

      priority: 58,

      category: "goals",

      family: "goal-progress",
    });
  }

  /* =================================================
     GOALS NEAR COMPLETION
  ================================================= */

  if (
    goal.goalsNearCompletion > 0
  ) {
    insights.push({
      insight: {
        id: "goals-near-completion",

        type: "achievement",

        title:
          "You're getting close to a goal",

        message:
          `${goal.goalsNearCompletion} of your goal${
            goal.goalsNearCompletion === 1
              ? ""
              : "s"
          } is getting close to completion.`,

        action:
          "Protect the progress you've already made and avoid unnecessary withdrawals.",

        priority: 88,
      },

      priority: 88,

      category: "goals",

      family: "goal-near-completion",
    });
  }

  /* =================================================
     FASTEST GOAL
  ================================================= */

  if (
    goal.fastestProgressGoal &&
    goal.fastestProgressGoal.progress > 0
  ) {
    const fastest =
      goal.fastestProgressGoal;

    insights.push({
      insight: {
        id: "fastest-goal-progress",

        type: "motivational",

        title:
          `${fastest.name} is making strong progress`,

        message:
          `You've already completed about ${percent(
            fastest.progress
          )} of this goal.`,

        action:
          "Keep the same consistency. Small contributions can compound into meaningful progress.",

        priority: 72,
      },

      priority: 72,

      category: "goals",

      family: "goal-progress",
    });
  }

  /* =================================================
     GOALS BEHIND
  ================================================= */

  if (
    goal.goalsBehind > 0
  ) {
    insights.push({
      insight: {
        id: "goals-falling-behind",

        type: "warning",

        title:
          "One of your goals may need attention",

        message:
          `${goal.goalsBehind} goal${
            goal.goalsBehind === 1
              ? ""
              : "s"
          } is currently behind its expected progress.`,

        action:
          "Review the target, timeline, and amount you're currently setting aside.",

        priority: 91,
      },

      priority: 91,

      category: "goals",

      family: "goal-warning",
    });
  }

  /* =================================================
     SLOW GOAL
  ================================================= */

  if (
    goal.slowestProgressGoal &&
    goal.slowestProgressGoal.progress >= 0 &&
    goal.slowestProgressGoal.progress < 30
  ) {
    const slowest =
      goal.slowestProgressGoal;

    insights.push({
      insight: {
        id: "slow-goal-progress",

        type: "opportunity",

        title:
          `${slowest.name} needs a little momentum`,

        message:
          `You've made about ${percent(
            slowest.progress
          )} progress toward this goal so far.`,

        action:
          "Consider setting aside a small automatic amount instead of waiting for extra money at the end of the month.",

        priority: 78,
      },

      priority: 78,

      category: "goals",

      family: "goal-opportunity",
    });
  }

  /* =================================================
     COMPLETED GOALS
  ================================================= */

  if (
    goal.completedGoalCount > 0
  ) {
    insights.push({
      insight: {
        id: "completed-financial-goal",

        type: "achievement",

        title:
          "You completed a financial goal",

        message:
          `You've completed ${goal.completedGoalCount} financial goal${
            goal.completedGoalCount === 1
              ? ""
              : "s"
          }. That's real progress.`,

        action:
          "Celebrate the milestone, then consider what your next financial target should be.",

        priority: 96,
      },

      priority: 96,

      category: "goals",

      family: "goal-achievement",
    });
  }

  /* =================================================
     GOAL SAVINGS
  ================================================= */

  if (
    goal.totalGoalSaved > 0 &&
    goal.totalGoalTarget > 0
  ) {
    const overallProgress =
      (goal.totalGoalSaved /
        goal.totalGoalTarget) *
      100;

    if (
      overallProgress >= 50 &&
      overallProgress < 100
    ) {
      insights.push({
        insight: {
          id: "goal-halfway-progress",

          type: "motivational",

          title:
            "You're more than halfway there",

          message:
            `You've saved about ${money(
              goal.totalGoalSaved
            )} toward your combined goal target of ${money(
              goal.totalGoalTarget
            )}.`,

          action:
            "Keep protecting the money you've already assigned to your goals.",

          priority: 76,
        },

        priority: 76,

        category: "goals",

        family: "goal-progress",
      });
    }
  }

  return insights;
}