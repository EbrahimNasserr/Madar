export function safePercentage(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function formatPercentage(
  value: number | null | undefined,
  digits = 0
): string {
  return `${safePercentage(value).toFixed(digits)}%`;
}
