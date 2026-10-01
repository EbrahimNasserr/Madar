'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import type { Session } from '@/src/lib/api/sessionsApi'
import {
  useUpdateSessionMutation,
  useCancelSessionMutation,
} from '@/src/lib/api/sessionsApi'
import { formatArabicDate } from '@/src/lib/date/formatDate'
import {
  SESSION_STATUS_LABELS,
  SESSION_STATUS_STYLES,
} from '@/src/constants/sessionStatus'

type SessionRowProps = {
  session: Session
  groupId: string
}

export function SessionRow({ session, groupId }: SessionRowProps) {
  const [updateSession, { isLoading: isUpdating }]   = useUpdateSessionMutation()
  const [cancelSession, { isLoading: isCancelling }] = useCancelSessionMutation()
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async () => {
    setError(null)
    try {
      await updateSession({
        id: session._id,
        groupId,
        body: { status: 'completed' },
      }).unwrap()
    } catch {
      setError('تعذر تحديث الحصة، حاول مرة أخرى.')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('هل تريد إلغاء الحصة؟')) return
    setError(null)
    try {
      await cancelSession({ id: session._id, groupId }).unwrap()
    } catch {
      setError('تعذر إلغاء الحصة، حاول مرة أخرى.')
    }
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Info */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900">
            {formatArabicDate(session.sessionDate)}
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${SESSION_STATUS_STYLES[session.status]}`}
          >
            {SESSION_STATUS_LABELS[session.status]}
          </span>
        </div>

        <p dir="ltr" className="mt-1.5 text-sm text-slate-500">
          {session.startTime} → {session.endTime}
        </p>

        {session.notes && (
          <p className="mt-1.5 text-sm text-slate-400">{session.notes}</p>
        )}

        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {session.status !== 'cancelled' && (
          <Link
            href={`/sessions/${session._id}/attendance`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            تسجيل الحضور
          </Link>
        )}

        {session.status === 'scheduled' && (
          <button
            onClick={handleComplete}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition"
          >
            {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            إكمال الحصة
          </button>
        )}

        {session.status !== 'cancelled' && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
          >
            {isCancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            إلغاء
          </button>
        )}
      </div>
    </div>
  )
}
