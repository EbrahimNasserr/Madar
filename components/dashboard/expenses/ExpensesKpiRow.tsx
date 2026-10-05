import { Wallet, Hash, TrendingDown } from 'lucide-react'
import { formatMoney } from '@/src/lib/formatters/money'

type Props = {
  totalExpenses: number
  count:         number
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent = 'slate',
}: {
  icon:    React.ElementType
  label:   string
  value:   string | number
  accent?: 'slate' | 'red' | 'amber'
}) {
  const accentMap = {
    slate: { icon: 'bg-slate-100 text-slate-600',  val: 'text-slate-900'  },
    red:   { icon: 'bg-red-100   text-red-600',    val: 'text-red-700'    },
    amber: { icon: 'bg-amber-100 text-amber-600',  val: 'text-amber-700'  },
  }
  const a = accentMap[accent]

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className={`mt-0.5 text-xl font-bold tabular-nums ${a.val}`}>{value}</p>
      </div>
    </div>
  )
}

export function ExpensesKpiRow({ totalExpenses, count }: Props) {
  const avg = count > 0 ? totalExpenses / count : 0

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard
        icon={TrendingDown}
        label="إجمالي المصروفات"
        value={formatMoney(totalExpenses)}
        accent="red"
      />
      <KpiCard
        icon={Hash}
        label="عدد العمليات"
        value={count}
        accent="slate"
      />
      <KpiCard
        icon={Wallet}
        label="متوسط المصروف"
        value={formatMoney(avg)}
        accent="amber"
      />
    </div>
  )
}
