import type { AttendanceStatus } from '@/src/lib/api/attendanceApi'

type DraftAttendance = {
  studentId: string
  status:    AttendanceStatus
  note:      string
}

type AttendanceSummaryProps = {
  attendance: DraftAttendance[]
}

function Pill({
  count,
  label,
  color,
}: {
  count: number
  label: string
  color: string
}) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${color}`}>
      <span className="text-2xl font-extrabold leading-none tabular-nums">
        {count}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const present = attendance.filter((a) => a.status === 'present').length
  const late    = attendance.filter((a) => a.status === 'late').length
  const absent  = attendance.filter((a) => a.status === 'absent').length

  return (
    <div className="grid grid-cols-3 gap-3">
      <Pill count={present} label="حاضر"  color="bg-emerald-50 text-emerald-700" />
      <Pill count={late}    label="متأخر" color="bg-amber-50 text-amber-700"     />
      <Pill count={absent}  label="غائب"  color="bg-red-50 text-red-700"         />
    </div>
  )
}
