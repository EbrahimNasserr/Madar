import { Plus } from 'lucide-react'

type StudentsHeaderProps = {
  total:    number | undefined
  onAdd:    () => void
}

export function StudentsHeader({ total, onAdd }: StudentsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-bold text-[#3157D5] tracking-wide uppercase mb-1">
          إدارة الطلاب
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          الطلاب
          {total !== undefined && (
            <span className="mr-2 text-sm font-semibold text-slate-400">
              ({total})
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          إدارة طلابك ومتابعة بياناتهم من مكان واحد.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#3157D5] text-white text-sm font-semibold hover:bg-[#243FA3] transition shadow-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة طالب
      </button>
    </div>
  )
}
