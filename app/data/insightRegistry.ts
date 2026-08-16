import type { AIInsight } from "./aiInsights";

export type InsightCandidate = {
  insight: AIInsight;

  // Used to prevent similar insights appearing together.
  family?: string;

  // Optional group/category.
  category?: string;

  // Higher number = more important.
  priority: number;

  // Prevent too many insights of the same type.
  typeLimit?: number;
};

export type InsightSelectionOptions = {
  maxInsights?: number;
  maxPerType?: number;
  maxPerCategory?: number;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =====================================================
   SIMILARITY
===================================================== */

function calculateSimilarity(
  a: string,
  b: string
) {
  const wordsA = new Set(
    normalizeText(a).split(" ")
  );

  const wordsB = new Set(
    normalizeText(b).split(" ")
  );

  if (
    wordsA.size === 0 ||
    wordsB.size === 0
  ) {
    return 0;
  }

  let intersection = 0;

  wordsA.forEach((word) => {
    if (wordsB.has(word)) {
      intersection++;
    }
  });

  const union =
    new Set([
      ...wordsA,
      ...wordsB,
    ]).size;

  return union > 0
    ? intersection / union
    : 0;
}

/* =====================================================
   DUPLICATE DETECTION
===================================================== */

function isTooSimilar(
  candidate: AIInsight,
  selected: AIInsight[]
) {
  return selected.some((existing) => {
    const titleSimilarity =
      calculateSimilarity(
        candidate.title,
        existing.title
      );

    const messageSimilarity =
      calculateSimilarity(
        candidate.message,
        existing.message
      );

    return (
      titleSimilarity >= 0.65 ||
      messageSimilarity >= 0.65
    );
  });
}

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

  const sorted = [...candidates].sort(
    (a, b) =>
      b.priority - a.priority
  );

  const selected: AIInsight[] = [];

  const typeCounts =
    new Map<string, number>();

  const categoryCounts =
    new Map<string, number>();

  const familyCounts =
    new Map<string, number>();

  for (const candidate of sorted) {
    if (
      selected.length >= maxInsights
    ) {
      break;
    }

    const insight =
      candidate.insight;

    /* ---------------------------------------------
       TYPE LIMIT
    --------------------------------------------- */

    const typeCount =
      typeCounts.get(insight.type) || 0;

    const typeLimit =
      candidate.typeLimit ??
      maxPerType;

    if (typeCount >= typeLimit) {
      continue;
    }

    /* ---------------------------------------------
       CATEGORY LIMIT
    --------------------------------------------- */

    const category =
      candidate.category ||
      insight.category;

    if (category) {
      const categoryCount =
        categoryCounts.get(category) ||
        0;

      if (
        categoryCount >=
        maxPerCategory
      ) {
        continue;
      }
    }

    /* ---------------------------------------------
       FAMILY LIMIT
    --------------------------------------------- */

    if (candidate.family) {
      const familyCount =
        familyCounts.get(
          candidate.family
        ) || 0;

      if (familyCount >= 1) {
        continue;
      }
    }

    /* ---------------------------------------------
       TEXT SIMILARITY
    --------------------------------------------- */

    if (
      isTooSimilar(
        insight,
        selected
      )
    ) {
      continue;
    }

    /* ---------------------------------------------
       SELECT
    --------------------------------------------- */

    selected.push(insight);

    typeCounts.set(
      insight.type,
      typeCount + 1
    );

    if (category) {
      categoryCounts.set(
        category,
        (categoryCounts.get(category) ||
          0) + 1
      );
    }

    if (candidate.family) {
      familyCounts.set(
        candidate.family,
        (familyCounts.get(
          candidate.family
        ) || 0) + 1
      );
    }
  }

  return selected;
}