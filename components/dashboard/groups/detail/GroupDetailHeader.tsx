import type { Group } from '@/src/lib/api/groupsApi'
import { BILLING_MODEL_LABELS } from '../shared/constants'

// ─── Stat card ────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

type GroupDetailHeaderProps = {
  group:           Group
  enrolledCount:   number
}

export function GroupDetailHeader({ group, enrolledCount }: GroupDetailHeaderProps) {
  const priceValue =
    group.billingModel === 'monthly'
      ? `${group.monthlyPrice ?? 0} ج.م / شهر`
      : `${group.pricePerSession ?? 0} ج.م / حصة`

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      {/* Title row */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">{group.subject}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            {group.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {group.grade || 'بدون مرحلة محددة'}
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          نشطة
        </span>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="الطلاب"    value={`${enrolledCount} طالب`} />
        <Stat label="نظام الدفع" value={BILLING_MODEL_LABELS[group.billingModel]} />
        <Stat label="السعر"     value={priceValue} />
      </div>
    </section>
  )
}
