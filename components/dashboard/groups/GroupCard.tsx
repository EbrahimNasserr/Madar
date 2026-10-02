import Link from 'next/link'
import { Pencil, PowerOff } from 'lucide-react'
import type { Group } from '@/src/lib/api/groupsApi'
import { getDayLabel } from '@/src/constants/weekDays'
import { BILLING_MODEL_LABELS, SCHOOL_TYPE_LABELS } from './shared/constants'

type GroupCardProps = {
  group: Group
  onEdit:       (group: Group) => void
  onDeactivate: (group: Group) => void
}

export function GroupCard({ group, onEdit, onDeactivate }: GroupCardProps) {
  const priceLabel =
    group.billingModel === 'monthly'
      ? `${group.monthlyPrice ?? 0} جنيه / شهر`
      : `${group.pricePerSession ?? 0} جنيه / حصة`

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* ── Head ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-950">{group.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {group.subject}
            {group.grade ? ` • ${group.grade}` : ''}
            {group.schoolType ? ` • ${SCHOOL_TYPE_LABELS[group.schoolType]}` : ''}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          {BILLING_MODEL_LABELS[group.billingModel]}
        </span>
      </div>

      {/* ── Price ── */}
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-xs text-slate-500">الرسوم</p>
        <p className="mt-1 text-lg font-bold text-slate-900">{priceLabel}</p>
        {group.billingModel === 'monthly' && group.sessionsPerMonth && (
          <p className="mt-0.5 text-xs text-slate-400">
            {group.sessionsPerMonth} حصة / شهر
          </p>
        )}
      </div>

      {/* ── Schedule ── */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          المواعيد
        </p>

        {group.schedule.map((slot, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{getDayLabel(slot.dayOfWeek)}</span>
            <span dir="ltr" className="text-slate-500">
              {slot.startTime} – {slot.endTime}
            </span>
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
        <Link
          href={`/groups/${group._id}`}
          className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          فتح المجموعة
        </Link>

        <button
          onClick={() => onEdit(group)}
          aria-label="تعديل المجموعة"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDeactivate(group)}
          aria-label="تعطيل المجموعة"
          className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition"
        >
          <PowerOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
