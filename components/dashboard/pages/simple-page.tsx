import { GraduationCap, Plus } from 'lucide-react'
import type { PageKey } from '../types'

const labels: Partial<Record<PageKey, string>> = {
  sessions: 'الحصص',
  reports:  'التقارير',
  settings: 'الإعدادات',
}

export function SimplePage({ page }: { page: PageKey }) {
  return (
    <section className="animate-[appear_0.28s_ease-out]">
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">Madar workspace</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">{labels[page]}</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">
            كل ما تحتاجه لإدارة يومك الدراسي بسهولة
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 hover:-translate-y-px transition-all cursor-pointer shrink-0">
          <Plus size={17} /> إضافة جديد
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm min-h-[300px] grid place-items-center">
        <div className="flex flex-col items-center gap-2.5 text-center p-8">
          <div className="grid place-items-center w-[52px] h-[52px] text-primary bg-primary/10 rounded-2xl">
            <GraduationCap size={25} />
          </div>
          <h2 className="text-[15px] font-bold m-0">هذه المساحة جاهزة لك</h2>
          <p className="text-[12px] text-muted-foreground leading-relaxed m-0">
            ابدأ بإضافة بياناتك لتجعل تنظيم حصصك أسهل.
          </p>
          <button className="mt-2 px-3 py-2 text-[11px] font-bold text-primary bg-primary/8 border border-primary/16 rounded-[9px] hover:bg-primary/14 transition-colors cursor-pointer">
            ابدأ الآن
          </button>
        </div>
      </div>
    </section>
  )
}
