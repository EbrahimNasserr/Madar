// Lightweight presentational primitives shared across all report sections.
// No data-fetching here — pure UI.

// ─── Tooltip shell ────────────────────────────────────────────────────────────

export function TooltipShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg text-xs space-y-1"
      dir="rtl"
    >
      {children}
    </div>
  )
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

type KpiAccent = 'blue' | 'green' | 'red' | 'amber'

const ACCENT_MAP: Record<KpiAccent, { icon: string; val: string }> = {
  blue:  { icon: 'bg-indigo-100 text-indigo-600',  val: 'text-indigo-700'  },
  green: { icon: 'bg-emerald-100 text-emerald-600', val: 'text-emerald-700' },
  red:   { icon: 'bg-red-100 text-red-600',         val: 'text-red-700'     },
  amber: { icon: 'bg-amber-100 text-amber-600',     val: 'text-amber-700'   },
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'blue',
}: {
  icon:    React.ElementType
  label:   string
  value:   string | number
  sub?:    string
  accent?: KpiAccent
}) {
  const a = ACCENT_MAP[accent]
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className={`mt-0.5 text-xl font-bold tabular-nums truncate ${a.val}`}>{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export function ReportSection({
  title,
  subtitle,
  children,
}: {
  title:     string
  subtitle?: string
  children:  React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// ─── Chart card ───────────────────────────────────────────────────────────────

export function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title:      string
  subtitle?:  string
  children:   React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <p className="font-semibold text-slate-900">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}
