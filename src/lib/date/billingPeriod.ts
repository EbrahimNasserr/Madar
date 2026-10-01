// ─── Billing period helpers ───────────────────────────────────────────────────
// Format: "YYYY-MM"  e.g. "2026-10"

export const getCurrentBillingPeriod = (): string => {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/** Format "2026-10" → "أكتوبر 2026" */
export const formatBillingPeriod = (period: string): string => {
  const [year, month] = period.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long' }).format(date)
}
