import { Check } from 'lucide-react'

const items = [
  'حضور وغياب بدون ورق',
  'متابعة المصروفات',
  'تنظيم الحصص',
  'تقارير واضحة',
  'اختبارات وأداء',
  'مصمم للموبايل',
]

export function LogoStrip() {
  return (
    <div className="overflow-hidden border-t border-b border-border bg-card py-[18px]">
      <div
        className="flex w-max gap-0 animate-[marquee_28s_linear_infinite]"
        style={{ animationTimingFunction: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-8 text-[13px] font-semibold text-muted-foreground whitespace-nowrap"
          >
            <Check size={13} strokeWidth={2.5} className="text-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
