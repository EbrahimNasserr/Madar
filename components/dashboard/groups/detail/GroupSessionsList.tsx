import { Plus } from 'lucide-react'
import type { Session } from '@/src/lib/api/sessionsApi'
import { SessionRow } from '@/components/dashboard/sessions/SessionRow'

type GroupSessionsListProps = {
  groupId:    string
  sessions:   Session[]
  isLoading:  boolean
  isError:    boolean
  onAdd:      () => void
}

export function GroupSessionsList({
  groupId,
  sessions,
  isLoading,
  isError,
  onAdd,
}: GroupSessionsListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الحصص</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {isLoading ? '...' : `${sessions.length} حصة`} في المجموعة
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] transition"
        >
          <Plus className="h-4 w-4" />
          إنشاء حصة
        </button>
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">جارٍ تحميل الحصص...</div>
        ) : isError ? (
          <div className="p-6 text-sm text-red-600">تعذر تحميل الحصص.</div>
        ) : sessions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-900">لا توجد حصص بعد</p>
            <p className="mt-1 text-sm text-slate-500">
              أنشئ أول حصة للمجموعة من الزر أعلاه.
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionRow
              key={session._id}
              session={session}
              groupId={groupId}
            />
          ))
        )}
      </div>
    </section>
  )
}
