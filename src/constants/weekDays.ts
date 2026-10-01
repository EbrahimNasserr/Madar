// ─── Week days (0 = Sunday … 6 = Saturday, aligned with backend) ─────────────

export const WEEK_DAYS = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الاثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
] as const;

export const getDayLabel = (dayOfWeek: number): string =>
  WEEK_DAYS.find((day) => day.value === dayOfWeek)?.label ?? "غير معروف";
