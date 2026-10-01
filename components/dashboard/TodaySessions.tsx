import Link from 'next/link'
import type { DashboardOverview } from '@/src/lib/api/dashboardApi'

type Session = DashboardOverview['sessions'][number]

const STATUS_LABELS = {
  scheduled: 'مجدولة',
  completed: 'مكتملة',
  cancelled: 'ملغاة',
}

const STATUS_STYLES = {
  scheduled: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-600',
}

type TodaySessionsProps = {
  sessions: Session[] | null | undefined
}

export function TodaySessions({ sessions: sessionsProp }: TodaySessionsProps) {
  const sessions = Array.isArray(sessionsProp) ? sessionsProp : []
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-900">حصص اليوم</h2>
          <p className="mt-0.5 text-xs text-slate-400">جدولك لليوم</p>
        </div>
        <Link
          href="/sessions"
          className="text-xs font-semibold text-[#3157D5] hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {/* Body */}
      {sessions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-medium text-slate-700">لا توجد حصص اليوم</p>
          <p className="mt-1 text-sm text-slate-400">يوم هادئ 👌</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sessions.map((session) => {
            const group = session.group

            return (
              <div
                key={session._id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {group?.name ?? 'مجموعة'}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[session.status]}`}>
                      {STATUS_LABELS[session.status]}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                    {group?.subject && <span>{group.subject}</span>}
                    <span dir="ltr">{session.startTime} → {session.endTime}</span>
                  </div>
                </div>

                {session.status !== 'cancelled' && (
                  <Link
                    href={`/sessions/${session._id}/attendance`}
                    className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    الحضور
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
