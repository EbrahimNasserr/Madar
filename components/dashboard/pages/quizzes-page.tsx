import { BookOpen, ChevronLeft, Plus, Sparkles, Check } from 'lucide-react'

const quizzes = [
  { title: 'Algebra Quiz 1',    group: 'رياضيات — الصف الثالث', avg: '١٧.٤ / ٢٠', status: 'منشور'  },
  { title: 'المعادلات التربيعية', group: 'رياضيات — الصف الثاني', avg: '١٥.٨ / ٢٠', status: 'مسودة' },
]

export function ProGate({ title = 'الاختبارات والدرجات متاحة في Pro' }: { title?: string }) {
  return (
    <div className="max-w-[520px] mx-auto mt-14 px-7 py-[38px] text-center bg-card border border-primary/25 rounded-[20px] shadow-[0_12px_45px_rgba(15,138,135,0.08)]">
      <div className="grid place-items-center w-[52px] h-[52px] mx-auto mb-4 text-primary bg-primary/10 rounded-2xl">
        <Sparkles size={22} />
      </div>
      <h2 className="text-[20px] font-extrabold m-0">{title}</h2>
      <p className="text-[12px] text-muted-foreground leading-[1.7] max-w-[350px] mx-auto my-[10px_0_18px]">
        أنشئ اختبارات، سجل الدرجات، وتابع أداء طلابك من مكان واحد.
      </p>
      <div className="flex flex-col gap-2 text-right max-w-[250px] mx-auto mb-6 text-[11px] text-muted-foreground">
        {['إنشاء اختبارات ودرجات', 'تحليلات أداء متقدمة', 'مشاركة النتائج مستقبلاً'].map(f => (
          <span key={f} className="flex items-center gap-1.5">
            <Check size={15} className="text-primary shrink-0" /> {f}
          </span>
        ))}
      </div>
      <button className="flex items-center justify-center gap-2 mx-auto px-4 py-2.5 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 cursor-pointer">
        <Sparkles size={16} /> الترقية إلى Pro
      </button>
    </div>
  )
}

export function QuizzesPage() {
  return (
    <section className="animate-[appear_0.28s_ease-out]">
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">Pro workspace</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">الاختبارات</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">أنشئ اختبارات وتابع تقدم طلابك</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 cursor-pointer shrink-0">
          <Plus size={17} /> إنشاء اختبار
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {quizzes.map(({ title, group, avg, status }) => (
          <div key={title} className="bg-card border border-border rounded-2xl shadow-sm p-[18px]">
            <div className="flex justify-between items-start gap-2.5">
              <div className="grid place-items-center w-[42px] h-[42px] rounded-[12px] bg-primary text-primary-foreground">
                <BookOpen size={19} />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-[7px] text-[10px] font-bold text-purple-600 bg-purple-50">PRO</span>
            </div>
            <h2 className="text-[15px] font-bold mt-4 mb-1 m-0">{title}</h2>
            <p className="text-[12px] text-muted-foreground m-0">{group}</p>
            <div className="flex justify-between items-center border-t border-border mt-4 pt-4 text-[11px] text-muted-foreground">
              <span>المتوسط</span>
              <strong className="text-[22px] font-extrabold text-foreground">{avg}</strong>
            </div>
            <div className="flex items-center justify-between mt-4 text-[10px] text-muted-foreground">
              <span>{status}</span>
              <button className="flex items-center gap-1 border-0 bg-transparent text-primary font-bold cursor-pointer hover:underline">
                عرض النتائج <ChevronLeft size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
