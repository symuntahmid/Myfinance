import type {
  AIInsight,
} from "@/app/data/types/AIInsight";


/* =====================================================
   TYPES
===================================================== */

export type MotivationalInsightRule = {
  id: string;

  priority: number;

  check: () => AIInsight | null;
};


/* =====================================================
   MOTIVATIONAL INSIGHT RULES
===================================================== */

export const motivationalInsightRules: MotivationalInsightRule[] = [

  {
    id: "motivational-positive-cash-flow",

    priority: 70,

    check: () => {

      /*
       * Financial context will be connected later.
       */

      return null;
    },
  },


  {
    id: "motivational-strong-saving-rate",

    priority: 80,

    check: () => {

      return null;
    },
  },


  {
    id: "motivational-tracking-consistency",

    priority: 45,

    check: () => {

      return null;
    },
  },


  {
    id: "motivational-financial-momentum",

    priority: 50,

    check: () => {

      return null;
    },
  },

];