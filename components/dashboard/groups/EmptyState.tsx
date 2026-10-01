import { Plus, Layers } from 'lucide-react'

type EmptyStateProps = {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#EAF0FF] flex items-center justify-center">
        <Layers className="w-7 h-7 text-[#3157D5]" />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">لا توجد مجموعات بعد</h3>
        <p className="mt-1 text-sm text-slate-500">
          ابدأ بإنشاء أول مجموعة لتنظيم حصصك وطلابك.
        </p>
      </div>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3157D5] text-white text-sm font-semibold hover:bg-[#243FA3] transition"
      >
        <Plus className="w-4 h-4" />
        إنشاء أول مجموعة
      </button>
    </div>
  )
}
