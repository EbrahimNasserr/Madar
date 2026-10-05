'use client'

import { Plus, CalendarPlus, ClipboardList } from 'lucide-react'
import type { Session } from '@/src/lib/api/sessionsApi'
import { SessionRow } from '@/components/dashboard/sessions/SessionRow'
import ErrorState from '@/components/ui/ErrorState'

type GroupSessionsListProps = {
  groupId:   string
  sessions:  Session[]
  isLoading: boolean
  isError:   boolean
  onAdd:     () => void
}

// ── Skeleton rows while loading ───────────────────────────────────────────────
function SessionSkeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 px-6 py-5 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 rounded bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
          <div className="h-8 w-28 rounded-xl bg-slate-100" />
        </div>
      ))}
    </>
  )
}

// ── Guided empty state ────────────────────────────────────────────────────────
function EmptySessionsState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12 text-center">
      {/* Visual */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
        <CalendarPlus className="h-9 w-9 text-indigo-500" />
        <span className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          ١
        </span>
      </div>

      {/* Copy */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900">ابدأ بإنشاء أول حصة</h3>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-500">
          الحصص هي قلب المجموعة — من هنا تُسجّل الحضور وتتابع المدفوعات لكل لقاء.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
      >
        <Plus className="h-4 w-4" />
        إنشاء أول حصة
      </button>
    </div>
  )
}

export function GroupSessionsList({
  groupId,
  sessions,
  isLoading,
  isError,
  onAdd,
}: GroupSessionsListProps) {
  const hasData = !isLoading && !isError && sessions.length > 0

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <ClipboardList className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">الحصص</h2>
            {hasData && (
              <p className="text-xs text-slate-400">{sessions.length} حصة مسجّلة</p>
            )}
          </div>
        </div>

        {/* Only show the add button in the header when sessions already exist */}
        {hasData && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            إنشاء حصة
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <SessionSkeletons />
        ) : isError ? (
          <div className="p-6">
            <ErrorState description="تعذر تحميل الحصص، حاول تحديث الصفحة." />
          </div>
        ) : sessions.length === 0 ? (
          <EmptySessionsState onAdd={onAdd} />
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
