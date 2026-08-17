export type AIInsightType =
  | "warning"
  | "opportunity"
  | "habit"
  | "achievement"
  | "emotional"
  | "funny"
  | "investment"
  | "goal"
  | "motivational";

export type AIInsight = {
  id: string;
  type: AIInsightType;

  title: string;
  message: string;

  action?: string;

  priority: number;

  category?: string;

  conditions?: string[];
};

export type InsightCandidate = {
  insight: AIInsight;
  priority: number;
  category?: string;
};