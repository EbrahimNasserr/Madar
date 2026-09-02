import { FileText } from 'lucide-react'
import { studentNames } from '../data'
import { StatCard } from '../stat-card'
import { Check, X, Wallet } from 'lucide-react'

export function PaymentsPage() {
  return (
    <section className="animate-[appear_0.28s_ease-out]">
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">متابعة التحصيل</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">المدفوعات</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">كل دفعة مرتبطة بحصة ومجموعة</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary bg-primary/8 border border-primary/16 rounded-[9px] hover:bg-primary/14 cursor-pointer shrink-0">
          <FileText size={16} /> تصدير التقرير
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        <StatCard label="المتوقع"   value="٨٠,٠٠٠" detail="هذا الشهر"   icon={Wallet} tone="blue"  />
        <StatCard label="المحصّل"   value="٦٨,٥٠٠" detail="٨٥.٦٪"       icon={Check}  tone="teal"  />
        <StatCard label="المتبقي"   value="١١,٥٠٠" detail="من ١٦ طالباً" icon={X}      tone="amber" />
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div
          className="grid items-center gap-3 px-4 py-3.5 bg-muted text-[10px] font-bold text-muted-foreground"
          style={{ gridTemplateColumns: '1.5fr 1.2fr 1.2fr .8fr .9fr .8fr' }}
        >
          <span>الطالب</span><span>المجموعة</span><span>إجمالي الشهر</span><span>المدفوع</span><span>المتبقي</span><span>الحالة</span>
        </div>
        {studentNames.slice(0, 6).map((name, i) => (
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
            <span>٨٠٠ ج.م</span>
            <span>{i % 3 === 1 ? '٧٠٠' : '٨٠٠'} ج.م</span>
            <span className={i % 3 === 1 ? 'text-red-600 font-semibold' : ''}>{i % 3 === 1 ? '١٠٠ ج.م' : '—'}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-[7px] text-[10px] font-bold w-fit ${i % 3 === 1 ? 'text-red-600 bg-red-50' : 'text-green-700 bg-green-50'}`}>
              {i % 3 === 1 ? 'غير مدفوع' : 'مدفوع'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
