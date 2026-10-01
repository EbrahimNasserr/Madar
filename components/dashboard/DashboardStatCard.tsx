import type { ReactNode } from 'react'

type DashboardStatCardProps = {
  title:        string
  value:        string | number
  description?: string
  icon?:        ReactNode
  highlight?:   'blue' | 'green' | 'red' | 'amber'
}

const HIGHLIGHT_STYLES = {
  blue:  'bg-[#EAF0FF] text-[#3157D5]',
  green: 'bg-emerald-50 text-emerald-600',
  red:   'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon,
  highlight,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3">
      {icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${highlight ? HIGHLIGHT_STYLES[highlight] : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('ar-EG') : value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
    </div>
  )
}
