/**
 * Format a 24-hour time string ("17:00") as 12-hour Arabic ("5:00 م").
 * Returns "—" for null / undefined / invalid input.
 */
export function formatTime(time: string | null | undefined): string {
  if (!time) return "—";

  const parts = time.split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return "—";

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Format a date as "١٢ أكتوبر ٢٠٢٦" (Arabic-EG, long month).
 * Returns "—" for null / undefined / invalid dates.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("ar-EG", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(date);
}

/**
 * Format a date with the weekday: "الأربعاء، ١٢ أكتوبر ٢٠٢٦".
 * Useful for session / quiz headings.
 */
export function formatFullDate(value: string | Date): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  }).format(date);
}
