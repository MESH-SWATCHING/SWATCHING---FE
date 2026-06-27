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

export const MOOD_TO_EN: Record<Mood, string> = {
  빈티지: "Vintage",
  미니멀: "Minimal",
  스트릿: "Street",
  고프코어: "Gorpcore",
  테크웨어: "Techwear",
  클래식: "Classic",
  페미닌: "Feminine",
  워크웨어: "Workwear",
  아메카지: "Amekaji",
  악세사리: "Accessory",
};

export const EN_TO_MOOD: Record<string, Mood> = Object.fromEntries(
  Object.entries(MOOD_TO_EN).map(([k, v]) => [v, k as Mood]),
) as Record<string, Mood>;
