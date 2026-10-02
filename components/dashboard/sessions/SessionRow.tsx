'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
import ConfirmDialog from '@/components/ui/ConfirmDialog'

type SessionRowProps = {
  session: Session
  groupId: string
}

export function SessionRow({ session, groupId }: SessionRowProps) {
  const [updateSession, { isLoading: isUpdating }]   = useUpdateSessionMutation()
  const [cancelSession, { isLoading: isCancelling }] = useCancelSessionMutation()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleComplete = async () => {
    try {
      await updateSession({
        id: session._id,
        groupId,
        body: { status: 'completed' },
      }).unwrap()
      toast.success('تم إكمال الحصة بنجاح')
    } catch {
      toast.error('تعذر تحديث الحصة، حاول مرة أخرى.')
    }
  }

  const handleCancel = async () => {
    try {
      await cancelSession({ id: session._id, groupId }).unwrap()
      toast.success('تم إلغاء الحصة')
      setConfirmOpen(false)
    } catch {
      toast.error('تعذر إلغاء الحصة، حاول مرة أخرى.')
    }
  }

  return (
    <>
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
              onClick={() => setConfirmOpen(true)}
              disabled={isCancelling}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="إلغاء الحصة"
        description="هل تريد إلغاء هذه الحصة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="إلغاء الحصة"
        cancelLabel="تراجع"
        destructive
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
