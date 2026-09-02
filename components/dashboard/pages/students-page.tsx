import { FileText, Plus, Search } from 'lucide-react'
import { studentNames } from '../data'

export function StudentsPage() {
  return (
    <section className="animate-[appear_0.28s_ease-out]">
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">إدارة الطلاب</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">الطلاب</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">١٢٤ طالباً في ٦ مجموعات</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary bg-primary/8 border border-primary/16 rounded-[9px] hover:bg-primary/14 cursor-pointer">
            <FileText size={16} /> استيراد
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 cursor-pointer">
            <Plus size={17} /> إضافة طالب
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2.5 mb-4">
        <div className="flex items-center gap-2 w-[260px] px-3 py-2.5 bg-card border border-border rounded-[9px] text-muted-foreground">
          <Search size={17} />
          <input className="border-0 outline-none bg-transparent w-full text-foreground text-[12px] placeholder:text-muted-foreground" placeholder="ابحث عن طالب..." />
        </div>
        <button className="px-3 py-2 text-[11px] font-semibold text-foreground bg-card border border-border rounded-[9px] hover:bg-muted cursor-pointer">كل المجموعات</button>
        <button className="px-3 py-2 text-[11px] font-semibold text-foreground bg-card border border-border rounded-[9px] hover:bg-muted cursor-pointer">كل الحالات</button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div
          className="grid items-center gap-3 px-4 py-3.5 bg-muted text-[10px] font-bold text-muted-foreground"
          style={{ gridTemplateColumns: '1.5fr 1.2fr 1.2fr .8fr .9fr .8fr' }}
        >
          <span>الطالب</span><span>المجموعة</span><span>الصف</span><span>الحضور</span><span>المستحق</span><span>الحالة</span>
        </div>
        {studentNames.map((name, i) => (
          <div
            key={name}
            className="grid items-center gap-3 px-4 py-3.5 border-t border-border text-[11px]"
            style={{ gridTemplateColumns: '1.5fr 1.2fr 1.2fr .8fr .9fr .8fr' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary text-[13px] font-bold">{name[0]}</div>
              <strong className="font-semibold truncate">{name}</strong>
            </div>
            <span>رياضيات — A</span>
            <span>الثالث الثانوي</span>
            <span className="text-green-600 font-semibold">{93 - i}%</span>
            <span className={i % 3 === 1 ? 'text-red-600 font-semibold' : ''}>{i % 3 === 1 ? '١٠٠ ج.م' : '—'}</span>
            <span className="inline-flex items-center px-2 py-1 rounded-[7px] text-[10px] font-bold text-green-700 bg-green-50 w-fit">نشط</span>
          </div>
        ))}
      </div>
    </section>
  )
}
