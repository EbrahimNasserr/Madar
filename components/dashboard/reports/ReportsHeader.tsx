'use client'

import { ChevronDown } from 'lucide-react'

type ReportsHeaderProps = {
  period:    string
  onChange:  (period: string) => void
}

export function ReportsHeader({ period, onChange }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-600">التقارير</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          لمحة الأداء
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          ملخص شامل للأداء المالي والحضور والنشاط خلال الفترة المحددة.
        </p>
      </div>

      {/* Month picker */}
      <div className="relative w-fit">
        <input
          type="month"
          value={period}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-xl border border-slate-200 bg-white pe-9 ps-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition cursor-pointer"
        />
        <ChevronDown className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-slate-400" />
      </div>
    </div>
  )
}
