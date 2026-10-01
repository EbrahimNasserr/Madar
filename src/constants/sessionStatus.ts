import type { SessionStatus } from '@/src/lib/api/sessionsApi'

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: 'مجدولة',
  completed: 'مكتملة',
  cancelled: 'ملغاة',
}

export const SESSION_STATUS_STYLES: Record<SessionStatus, string> = {
  scheduled: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}
