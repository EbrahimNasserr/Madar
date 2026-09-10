import { Search, X } from 'lucide-react'

type StudentsToolbarProps = {
  search:    string
  status:    '' | 'active' | 'inactive'
  onSearch:  (value: string) => void
  onStatus:  (value: '' | 'active' | 'inactive') => void
}

export function StudentsToolbar({
  search,
  status,
  onSearch,
  onStatus,
}: StudentsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div
        className={[
          'flex items-center gap-2.5 flex-1 max-w-md rounded-xl border px-4 py-2.5 text-sm transition',
          'bg-white border-slate-200 focus-within:border-[#3157D5] focus-within:ring-4 focus-within:ring-[#3157D5]/10',
        ].join(' ')}
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          aria-label="بحث عن طالب"
        />
        {search && (
          <button onClick={() => onSearch('')} aria-label="مسح البحث">
            <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as '' | 'active' | 'inactive')}
        aria-label="تصفية بالحالة"
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition appearance-none cursor-pointer"
      >
        <option value="">كل الحالات</option>
        <option value="active">نشط</option>
        <option value="inactive">غير نشط</option>
      </select>
    </div>
  )
}
