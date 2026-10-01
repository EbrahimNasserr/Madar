import { Clock } from 'lucide-react'
import type { GroupSchedule as GroupScheduleType } from '@/src/lib/api/groupsApi'
import { getDayLabel } from '@/src/constants/weekDays'

type GroupScheduleProps = {
  schedule: GroupScheduleType[]
}

export function GroupSchedule({ schedule }: GroupScheduleProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900">مواعيد المجموعة</h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schedule.map((slot, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <p className="font-medium text-slate-900">{getDayLabel(slot.dayOfWeek)}</p>
            <p dir="ltr" className="mt-1 text-sm text-slate-500">
              {slot.startTime} → {slot.endTime}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
