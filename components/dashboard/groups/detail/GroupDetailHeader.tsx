import { Users, CreditCard, BookOpen, GraduationCap, Banknote } from 'lucide-react'
import type { Group } from '@/src/lib/api/groupsApi'
import { BILLING_MODEL_LABELS } from '../shared/constants'

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 ${
        accent
          ? 'bg-indigo-50 border border-indigo-100'
          : 'bg-slate-50 border border-slate-100'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          accent ? 'bg-indigo-100' : 'bg-white border border-slate-200'
        }`}
      >
        <Icon className={`h-4 w-4 ${accent ? 'text-indigo-600' : 'text-slate-500'}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`mt-0.5 font-bold truncate ${accent ? 'text-indigo-900' : 'text-slate-900'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── Subject badge colour ─────────────────────────────────────────────────────

const SUBJECT_COLOURS: Record<string, string> = {
  رياضيات: 'bg-blue-100 text-blue-700',
  فيزياء:  'bg-purple-100 text-purple-700',
  كيمياء:  'bg-emerald-100 text-emerald-700',
  أحياء:   'bg-green-100 text-green-700',
  عربي:    'bg-amber-100 text-amber-700',
  إنجليزي: 'bg-sky-100 text-sky-700',
  تاريخ:   'bg-orange-100 text-orange-700',
  جغرافيا: 'bg-teal-100 text-teal-700',
}

function subjectColour(subject: string) {
  return SUBJECT_COLOURS[subject] ?? 'bg-indigo-100 text-indigo-700'
}

// ─── Header ───────────────────────────────────────────────────────────────────

type GroupDetailHeaderProps = {
  group:         Group
  enrolledCount: number
}

export function GroupDetailHeader({ group, enrolledCount }: GroupDetailHeaderProps) {
  const priceValue =
    group.billingModel === 'monthly'
      ? `${group.monthlyPrice ?? 0} ج.م / شهر`
      : `${group.pricePerSession ?? 0} ج.م / حصة`

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* ── Coloured top-band ── */}
      <div className="bg-gradient-to-l from-indigo-600 to-indigo-500 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Subject icon circle */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${subjectColour(group.subject)}`}>
                {group.subject}
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {group.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {group.grade && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white">
                <GraduationCap className="h-3.5 w-3.5" />
                {group.grade}
              </span>
            )}
            <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-sm font-semibold text-emerald-100 ring-1 ring-inset ring-emerald-300/30">
              ● نشطة
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-3 p-6 sm:grid-cols-3">
        <StatPill
          icon={Users}
          label="الطلاب المسجّلون"
          value={`${enrolledCount} طالب`}
          accent={enrolledCount > 0}
        />
        <StatPill
          icon={CreditCard}
          label="نظام الدفع"
          value={BILLING_MODEL_LABELS[group.billingModel]}
        />
        <StatPill
          icon={Banknote}
          label="السعر"
          value={priceValue}
        />
      </div>
    </section>
  )
}
