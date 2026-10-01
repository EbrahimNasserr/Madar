import type { Group } from '@/src/lib/api/groupsApi'
import { GroupCard }  from './GroupCard'
import { EmptyState } from './EmptyState'

type GroupsGridProps = {
  groups:       Group[]
  isLoading:    boolean
  isError:      boolean
  onAdd:        () => void
  onEdit:       (group: Group) => void
  onDeactivate: (group: Group) => void
  onRetry:      () => void
}

export function GroupsGrid({
  groups,
  isLoading,
  isError,
  onAdd,
  onEdit,
  onDeactivate,
  onRetry,
}: GroupsGridProps) {
  // ── Skeleton ──
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    )
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="font-semibold text-slate-900">تعذر تحميل المجموعات</h2>
        <p className="mt-1 text-sm text-slate-500">
          تحقق من اتصالك بالإنترنت ثم أعد المحاولة.
        </p>
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  // ── Empty ──
  if (groups.length === 0) {
    return <EmptyState onAdd={onAdd} />
  }

  // ── Cards ──
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      ))}
    </div>
  )
}
