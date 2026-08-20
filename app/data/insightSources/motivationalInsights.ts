import type {
  AIInsight,
  AIInsightType,
} from "../aiInsights";

/* =====================================================
   TYPES
===================================================== */

export type MotivationalInsightRule = {
  id: string;
  type: AIInsightType;
  priority: number;

  check: () => AIInsight | null;
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
   MOTIVATIONAL INSIGHTS
===================================================== */

export const motivationalInsightRules: MotivationalInsightRule[] = [

  /* =================================================
     POSITIVE CASH FLOW
  ================================================= */

  {
    id: "motivational-positive-cash-flow",
    type: "motivational",
    priority: 70,

    check: () => {
      /*
       * This rule is intentionally based on the
       * financial data passed into the rule later.
       *
       * For now, the main engine will provide the
       * current financial context.
       */

      return null;
    },
  },

  /* =================================================
     STRONG SAVING RATE
  ================================================= */

  {
    id: "motivational-strong-saving-rate",
    type: "motivational",
    priority: 80,

    check: () => {
      return null;
    },
  },

  /* =================================================
     TRACKING CONSISTENCY
  ================================================= */

  {
    id: "motivational-tracking-consistency",
    type: "motivational",
    priority: 45,

    check: () => {
      return null;
    },
  },

  /* =================================================
     FINANCIAL MOMENTUM
  ================================================= */

  {
    id: "motivational-financial-momentum",
    type: "motivational",
    priority: 50,

    check: () => {
      return null;
    },
  },

];