'use client'

import {
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { BookOpen } from 'lucide-react'
import { formatPercentage } from '@/src/lib/formatters/percentage'
import type { ReportOverview } from '@/src/lib/api/reportsApi'
import { CHART_COLORS as C } from './constants'
import { TooltipShell, ReportSection, ChartCard } from './ReportShared'

// ─── Attendance gauge ─────────────────────────────────────────────────────────

function AttendanceGauge({ rate }: { rate: number }) {
  const pct   = Math.min(100, Math.max(0, rate))
  const color = pct >= 75 ? C.green : pct >= 50 ? C.amber : C.red

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={160}>
        <RadialBarChart
          cx="50%"
          cy="55%"
          innerRadius="65%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={[{ name: 'الحضور', value: pct, fill: color }]}
          barSize={16}
        >
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#F1F5F9' }} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="-mt-6 text-center">
        <p className="text-3xl font-bold tabular-nums" style={{ color }}>
          {formatPercentage(rate)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">نسبة الحضور</p>
      </div>
    </div>
  )
}

// ─── Attendance pie tooltip ───────────────────────────────────────────────────

type AttTooltipProps = {
  active?:  boolean
  payload?: { name: string; value: number }[]
}

function AttendanceTooltip({ active, payload }: AttTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <TooltipShell>
      <p className="font-semibold text-slate-700">{payload[0].name}</p>
      <p className="text-slate-600">{payload[0].value} سجل</p>
    </TooltipShell>
  )
}

// ─── Attendance pie chart ─────────────────────────────────────────────────────

type PieProps = { present: number; late: number; absent: number }

function AttendancePieChart({ present, late, absent }: PieProps) {
  const total = present + late + absent
  const slices = [
    { name: 'حاضر',  value: present, fill: C.present },
    { name: 'متأخر', value: late,    fill: C.late    },
    { name: 'غائب',  value: absent,  fill: C.absent  },
  ].filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-slate-400">
        لا توجد بيانات حضور لهذه الفترة.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {slices.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<AttendanceTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Inline legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {slices.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
            {d.name}
            <span className="font-semibold text-slate-900">{d.value}</span>
            <span className="text-slate-400">
              ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type Props = { attendance: ReportOverview['attendance'] }

export function AttendanceSection({ attendance }: Props) {
  const { present, late, absent, total, attendanceRate } = attendance

  const statPills = [
    { label: 'حاضر',  value: present, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'متأخر', value: late,    color: 'text-amber-600',   bg: 'bg-amber-50'   },
    { label: 'غائب',  value: absent,  color: 'text-red-600',     bg: 'bg-red-50'     },
  ]

  return (
    <ReportSection
      title="الحضور"
      subtitle="توزيع سجلات الحضور خلال هذه الفترة"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Rate gauge */}
        <ChartCard title="نسبة الحضور" subtitle="من إجمالي السجلات">
          <AttendanceGauge rate={attendanceRate} />

          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-sm">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">الإجمالي:</span>
            <span className="font-bold text-slate-900">{total} سجل</span>
          </div>
        </ChartCard>

        {/* Pie breakdown — 2 cols */}
        <ChartCard
          title="توزيع الحضور"
          subtitle="حاضر · متأخر · غائب"
          className="lg:col-span-2"
        >
          <AttendancePieChart present={present} late={late} absent={absent} />

          <div className="mt-5 grid grid-cols-3 gap-2">
            {statPills.map((item) => (
              <div key={item.label} className={`rounded-xl ${item.bg} p-3 text-center`}>
                <p className="text-[10px] text-slate-500">{item.label}</p>
                <p className={`mt-0.5 text-lg font-bold tabular-nums ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </ReportSection>
  )
}
