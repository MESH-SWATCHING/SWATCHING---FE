export const MOOD_OPTIONS = [
  { label: "\uBE48\uD2F0\uC9C0", value: "Vintage" },
  { label: "\uBBF8\uB2C8\uBA40", value: "Minimal" },
  { label: "\uC2A4\uD2B8\uB9BF", value: "Street" },
  { label: "\uACE0\uD504\uCF54\uC5B4", value: "Gorpcore" },
  { label: "\uD14C\uD06C\uC6E8\uC5B4", value: "Techwear" },
  { label: "\uD074\uB798\uC2DD", value: "Classic" },
  { label: "\uD398\uBBF8\uB2CC", value: "Feminine" },
  { label: "\uC6CC\uD06C\uC6E8\uC5B4", value: "Workwear" },
  { label: "\uC544\uBA54\uCE74\uC9C0", value: "Amekaji" },
  { label: "\uC561\uC138\uC11C\uB9AC", value: "Accessories" },
] as const;

export const MOODS = MOOD_OPTIONS.map((option) => option.label);

export type Mood = (typeof MOODS)[number];
export type MoodValue = (typeof MOOD_OPTIONS)[number]["value"];

export const MOOD_TO_EN: Record<Mood, MoodValue> = Object.fromEntries(
  MOOD_OPTIONS.map(({ label, value }) => [label, value]),
) as Record<Mood, MoodValue>;

export const EN_TO_MOOD: Record<string, Mood> = Object.fromEntries(
  MOOD_OPTIONS.map(({ label, value }) => [value, label]),
) as Record<string, Mood>;

export const moodLabel = (keyword: string) => EN_TO_MOOD[keyword] ?? keyword;
