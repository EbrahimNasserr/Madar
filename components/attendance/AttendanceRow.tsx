import type { AttendanceStatus } from '@/src/lib/api/attendanceApi'
import type { Student } from '@/src/lib/api/studentsApi'

// ─── Status button ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; active: string; inactive: string }
> = {
  present: {
    label:    'حاضر',
    active:   'bg-emerald-500 text-white shadow-sm',
    inactive: 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600',
  },
  late: {
    label:    'متأخر',
    active:   'bg-amber-400 text-white shadow-sm',
    inactive: 'bg-white text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-600',
  },
  absent: {
    label:    'غائب',
    active:   'bg-red-500 text-white shadow-sm',
    inactive: 'bg-white text-slate-500 border border-slate-200 hover:border-red-300 hover:text-red-600',
  },
}

function StatusButton({
  status,
  current,
  onClick,
}: {
  status:  AttendanceStatus
  current: AttendanceStatus
  onClick: () => void
}) {
  const cfg    = STATUS_CONFIG[status]
  const active = current === status
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-[4rem] rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        active ? cfg.active : cfg.inactive
      }`}
    >
      {cfg.label}
    </button>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

type AttendanceRowProps = {
  student:       Student
  status:        AttendanceStatus
  onStatus:      (status: AttendanceStatus) => void
}

export function AttendanceRow({ student, status, onStatus }: AttendanceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
      {/* Student info */}
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 leading-tight">
          {student.firstName} {student.lastName}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {student.phone || '—'}
        </p>
      </div>

      {/* Status buttons */}
      <div className="flex shrink-0 gap-2">
        {(['present', 'late', 'absent'] as AttendanceStatus[]).map((s) => (
          <StatusButton
            key={s}
            status={s}
            current={status}
            onClick={() => onStatus(s)}
          />
        ))}
      </div>
    </div>
  )
}
