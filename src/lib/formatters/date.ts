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
