// 觉体BodyAwake知识库适配层
// 数据来源：src/data/knowledge.json（女性体态科普 · 反焦虑 · 温和引导）

import raw from "./knowledge.json";

export type BodyPartId =
  | "neck"
  | "shoulder"
  | "back"
  | "waist"
  | "abdomen"
  | "hip"
  | "buttocks"
  | "thigh"
  | "calf";

export interface BodyPart {
  id: BodyPartId;
  name: string;
  femaleSpecificFeatures: string;
  commonIssues: string[];
  scienceExplanation: string;
  comfortingMessage: string;
  gentleTips: string[];
}

export interface GentleSolution {
  description: string;
  steps: string[];
  feelingPoint: string;
  compensationWarning: string;
}

export interface CommonIssue {
  id: string;
  name: string;
  tags: string[];
  empathy: string;
  scienceCause: string;
  mythBusting: string;
  gentleSolution: GentleSolution;
  affirmation: string;
}

export interface GentleStretch {
  id: string;
  name: string;
  targetArea: string[];
  duration: string;
  frequency: string;
  steps: string[];
  feelingPoint: string;
  compensationWarning: string;
  safetyNotes: string;
  suitableFor: string;
}

export interface HealthTip {
  id: string;
  category: string;
  myth: string;
  truth: string;
  affirmation: string;
  tags: string[];
}

export interface DailyHabit {
  id: string;
  name: string;
  category: string;
  description: string;
  tips: string[];
  commonMistakes: string[];
  redFlags?: string[];
}

interface Knowledge {
  version: string;
  lastUpdated: string;
  description: string;
  disclaimer: string;
  femaleBodyParts: BodyPart[];
  femaleCommonIssues: CommonIssue[];
  femaleGentleStretches: GentleStretch[];
  femaleHealthTips: HealthTip[];
  dailyHealthHabits: DailyHabit[];
}

export const knowledge = raw as Knowledge;

export const bodyParts: BodyPart[] = knowledge.femaleBodyParts;
export const commonIssues: CommonIssue[] = knowledge.femaleCommonIssues;
export const gentleStretches: GentleStretch[] = knowledge.femaleGentleStretches;
export const healthTips: HealthTip[] = knowledge.femaleHealthTips;
export const dailyHabits: DailyHabit[] = knowledge.dailyHealthHabits;
export const disclaimerText: string = knowledge.disclaimer;

// 查找辅助函数
export function findIssue(id: string): CommonIssue | undefined {
  return commonIssues.find((c) => c.id === id);
}
export function findStretch(id: string): GentleStretch | undefined {
  return gentleStretches.find((s) => s.id === id);
}
export function findBodyPart(id: string): BodyPart | undefined {
  return bodyParts.find((p) => p.id === id);
}

// 部位 → 该部位相关的常见问题（通过 tags 模糊匹配 name）
export function issuesForPart(partName: string): CommonIssue[] {
  return commonIssues.filter((c) => c.tags.some((t) => t === partName));
}
