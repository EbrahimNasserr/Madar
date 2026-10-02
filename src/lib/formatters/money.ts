/**
 * Format a number as Egyptian Pounds.
 * e.g. 1500 → "١٬٥٠٠ ج.م."
 */
export function formatMoney(
  value: number | null | undefined,
  currency = "EGP",
): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
