'use client'

import { Plus, ChevronDown } from 'lucide-react'

type ExpensesHeaderProps = {
  period:   string
  onPeriodChange: (period: string) => void
  onAdd:    () => void
}

export function ExpensesHeader({ period, onPeriodChange, onAdd }: ExpensesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-600">المصروفات</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          إدارة المصروفات
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          سجل مصروفات شغلك واعرف إجمالي تكلفة التشغيل.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Month picker */}
        <div className="relative">
          <input
            type="month"
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white pe-9 ps-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition cursor-pointer"
          />
          <ChevronDown className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-slate-400" />
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          مصروف جديد
        </button>
      </div>
    </div>
  )
}
