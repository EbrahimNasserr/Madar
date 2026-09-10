import type { Student } from '@/src/lib/api/studentsApi'

export function StatusBadge({ status }: { status: Student['status'] }) {
  return status === 'active' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      نشط
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      غير نشط
    </span>
  )
}
