import { Clock } from 'lucide-react'
import type { GroupSchedule as GroupScheduleType } from '@/src/lib/api/groupsApi'
import { getDayLabel } from '@/src/constants/weekDays'

// Maps each day-of-week index to a subtle accent colour pair
const DAY_COLOURS: Record<number, { bg: string; dot: string; text: string }> = {
  0: { bg: 'bg-rose-50    border-rose-100',    dot: 'bg-rose-400',    text: 'text-rose-700'    },
  1: { bg: 'bg-orange-50  border-orange-100',  dot: 'bg-orange-400',  text: 'text-orange-700'  },
  2: { bg: 'bg-amber-50   border-amber-100',   dot: 'bg-amber-400',   text: 'text-amber-700'   },
  3: { bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  4: { bg: 'bg-sky-50     border-sky-100',     dot: 'bg-sky-500',     text: 'text-sky-700'     },
  5: { bg: 'bg-indigo-50  border-indigo-100',  dot: 'bg-indigo-500',  text: 'text-indigo-700'  },
  6: { bg: 'bg-purple-50  border-purple-100',  dot: 'bg-purple-500',  text: 'text-purple-700'  },
}

function slotColour(dayOfWeek: number) {
  return DAY_COLOURS[dayOfWeek] ?? DAY_COLOURS[0]
}

type GroupScheduleProps = {
  schedule: GroupScheduleType[]
}

export function GroupSchedule({ schedule }: GroupScheduleProps) {
  if (!schedule || schedule.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Clock className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">مواعيد المجموعة</h2>
          <p className="text-xs text-slate-400">{schedule.length} موعد أسبوعي</p>
        </div>
      </div>

      {/* Schedule cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schedule.map((slot, index) => {
          const c = slotColour(slot.dayOfWeek)
          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl border p-4 ${c.bg}`}
            >
              {/* Coloured dot */}
              <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${c.dot}`} />
              <div>
                <p className={`font-semibold text-sm ${c.text}`}>
                  {getDayLabel(slot.dayOfWeek)}
                </p>
                <p dir="ltr" className="mt-0.5 text-sm font-medium text-slate-600">
                  {slot.startTime} – {slot.endTime}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
