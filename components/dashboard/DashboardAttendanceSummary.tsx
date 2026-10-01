import type { DashboardOverview } from '@/src/lib/api/dashboardApi'

type AttendanceSummaryProps = {
  attendance: DashboardOverview['todayAttendance']
}

function AttendanceBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex flex-col items-center rounded-xl p-3 ${color}`}>
      <span className="text-2xl font-extrabold tabular-nums leading-none">{value}</span>
      <span className="mt-1 text-xs font-medium">{label}</span>
    </div>
  )
}

export function DashboardAttendanceSummary({ attendance }: AttendanceSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-slate-900">حضور اليوم</h2>
        <p className="mt-0.5 text-xs text-slate-400">ملخص الحضور المسجل اليوم</p>
      </div>

      {/* Rate ring */}
      <div className="flex flex-col items-center gap-1 py-2">
        <p className="text-5xl font-extrabold text-[#3157D5] tabular-nums">
          {attendance.attendanceRate.toFixed(0)}
          <span className="text-2xl">%</span>
        </p>
        <p className="text-xs text-slate-400">نسبة الحضور</p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <AttendanceBox label="حاضر"  value={attendance.present} color="bg-emerald-50 text-emerald-700" />
        <AttendanceBox label="متأخر" value={attendance.late}    color="bg-amber-50 text-amber-700"    />
        <AttendanceBox label="غائب"  value={attendance.absent}  color="bg-red-50 text-red-600"        />
      </div>
    </div>
  )
}
