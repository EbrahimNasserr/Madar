import { ArrowLeft } from 'lucide-react'

const problems = [
  {
    icon: '☷',
    label: 'ورقة الحضور',
    pain: 'كل حصة جدول جديد وعلامات بالقلم.',
    sample: 'أحمد ✓\nمحمد ؟\nعمر ×',
  },
  {
    icon: '₤',
    label: 'المصروفات',
    pain: 'مين دفع؟ ومين عليه فلوس؟ كشكول ورسائل بلا نهاية.',
    sample: 'كشكول · رسائل · حسابات',
  },
  {
    icon: '∿',
    label: 'درجات الكويز',
    pain: 'درجات على ورق أو رسائل متفرقة في واتساب.',
    sample: '17/20 · 15/20 · ؟',
  },
]

export function ProblemSection() {
  return (
    <section className="py-16 bg-surface-low" id="problem">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-[560px] mb-5 lg:mb-16">
          <p className="inline-flex items-center gap-1.5 text-primary text-[12px] font-extrabold uppercase tracking-[0.4px] mb-3.5">
            الطريقة القديمة
          </p>
          <h2 className="m-0 text-[clamp(34px,4.5vw,54px)] font-extrabold leading-[1.1] tracking-[-1.8px] text-foreground">
            لسه بتدير حصصك<br /><span className="text-primary">بالطريقة دي؟</span>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.8] text-muted-foreground max-w-[480px]">
            كل دقيقة بتقضيها في الورق والرسائل هي دقيقة أقل مع طلابك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map(({ icon, label, pain, sample }) => (
            <div
              key={label}
              className="p-6 bg-card border border-border rounded-lg shadow-[var(--shadow-card)]"
            >
              <div className="grid place-items-center w-10 h-10 bg-primary/10 text-primary rounded-md text-xl mb-4">
                {icon}
              </div>
              <h3 className="m-0 mb-2 text-[17px] font-bold text-foreground">{label}</h3>
              <p className="m-0 text-[13px] leading-[1.7] text-muted-foreground">{pain}</p>
              <div className="mt-5 pt-3.5 border-t border-dashed border-outline-variant text-muted-foreground/60 text-[11px] leading-[1.9] whitespace-pre-line">
                {sample}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3.5 mt-12 text-primary text-[15px] font-extrabold">
          <span className="flex-none w-9 h-px bg-primary/30" />
          <span>Madar يجمع كل ده في مكان واحد</span>
          <ArrowLeft size={16} />
        </div>
      </div>
    </section>
  )
}
