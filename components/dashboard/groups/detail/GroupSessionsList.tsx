import { Plus } from 'lucide-react'
import type { Session } from '@/src/lib/api/sessionsApi'
import { SessionRow } from '@/components/dashboard/sessions/SessionRow'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'

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
          <div className="p-4">
            <ErrorState description="تعذر تحميل الحصص." />
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="لا توجد حصص بعد"
              description="أنشئ أول حصة للمجموعة من الزر أعلاه."
            />
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
