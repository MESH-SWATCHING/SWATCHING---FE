export const MOODS = [
  "빈티지",
  "미니멀",
  "스트릿",
  "고프코어",
  "테크웨어",
  "클래식",
  "페미닌",
  "워크웨어",
  "아메카지",
  "악세사리",
] as const;

export type Mood = (typeof MOODS)[number];
