import type { AIInsight } from "@/app/data/types/AIInsight";

/* =====================================================
   TYPES
===================================================== */

export type InsightCandidate = {
  insight: AIInsight;

  // Prevent similar insights from appearing together.
  family?: string;

  // Optional spending/category grouping.
  category?: string;

  // Higher number = more important.
  priority: number;

  // Optional custom limit for this candidate's type.
  typeLimit?: number;
};

export type InsightSelectionOptions = {
  maxInsights?: number;
  maxPerType?: number;
  maxPerCategory?: number;
};

/* =====================================================
   INSIGHT SELECTION
===================================================== */

export function selectInsights(
  candidates: InsightCandidate[],
  options: InsightSelectionOptions = {}
): AIInsight[] {
  const {
    maxInsights = 5,
    maxPerType = 2,
    maxPerCategory = 2,
  } = options;

  /* ---------------------------------------------------
     SAFETY
  --------------------------------------------------- */

  if (
    maxInsights <= 0 ||
    candidates.length === 0
  ) {
    return [];
  }

  /* ---------------------------------------------------
     SORT BY PRIORITY
  --------------------------------------------------- */

  const sortedCandidates = [...candidates].sort(
    (a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      // Stable fallback so equal-priority
      // insights don't jump around randomly.
      return a.insight.id.localeCompare(
        b.insight.id
      );
    }
  );

  /* ---------------------------------------------------
     SELECTED INSIGHTS
  --------------------------------------------------- */

  const selected: AIInsight[] = [];

  /* ---------------------------------------------------
     TRACKING
  --------------------------------------------------- */

  const typeCounts =
    new Map<string, number>();

  const categoryCounts =
    new Map<string, number>();

  const usedFamilies =
    new Set<string>();

  /* ---------------------------------------------------
     RUN THROUGH CANDIDATES
  --------------------------------------------------- */

  for (const candidate of sortedCandidates) {
    /* -----------------------------------------------
       MAX TOTAL INSIGHTS
    ------------------------------------------------ */

    if (
      selected.length >= maxInsights
    ) {
      break;
    }

    const insight =
      candidate.insight;

    /* -----------------------------------------------
       TYPE LIMIT
    ------------------------------------------------ */

    const type =
      insight.type;

    const currentTypeCount =
      typeCounts.get(type) ?? 0;

    const typeLimit =
      candidate.typeLimit ??
      maxPerType;

    if (
      currentTypeCount >=
      typeLimit
    ) {
      continue;
    }

    /* -----------------------------------------------
       FAMILY PROTECTION
    ------------------------------------------------ */

    if (
      candidate.family &&
      usedFamilies.has(
        candidate.family
      )
    ) {
      continue;
    }

    /* -----------------------------------------------
       CATEGORY LIMIT
    ------------------------------------------------ */

    const category =
      candidate.category ??
      insight.category;

    if (category) {
      const currentCategoryCount =
        categoryCounts.get(
          category
        ) ?? 0;

      if (
        currentCategoryCount >=
        maxPerCategory
      ) {
        continue;
      }
    }

    /* -----------------------------------------------
       ACCEPT
    ------------------------------------------------ */

    selected.push(insight);

    /* -----------------------------------------------
       UPDATE TYPE COUNT
    ------------------------------------------------ */

    typeCounts.set(
      type,
      currentTypeCount + 1
    );

    /* -----------------------------------------------
       UPDATE CATEGORY COUNT
    ------------------------------------------------ */

    if (category) {
      const currentCategoryCount =
        categoryCounts.get(
          category
        ) ?? 0;

      categoryCounts.set(
        category,
        currentCategoryCount + 1
      );
    }

    /* -----------------------------------------------
       UPDATE FAMILY
    ------------------------------------------------ */

    if (candidate.family) {
      usedFamilies.add(
        candidate.family
      );
    }
  }

  return selected;
}