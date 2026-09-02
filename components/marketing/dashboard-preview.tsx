'use client'

import { motion } from 'framer-motion'
import { CreditCard, Users, Check, Sparkles } from 'lucide-react'

const students = [
  ['أحمد محمد', 'present'],
  ['محمد علي',  'present'],
  ['عمر خالد',  'absent'],
] as const

export function DashboardPreview() {
  return (
    <motion.div
      className="relative p-3.5 rounded-xl bg-gradient-to-br from-[#dde1ff] via-[#e9edff] to-[#f1f3ff] shadow-[0_32px_80px_rgba(6,60,188,0.14),0_8px_24px_rgba(0,0,0,0.04)] -rotate-1"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Window */}
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-[0_10px_30px_rgba(6,60,188,0.06)]">

        {/* Titlebar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-low">
          <span className="flex gap-1.5">
            <i className="block w-2.5 h-2.5 rounded-full bg-[#ff6057]" />
            <i className="block w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <i className="block w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </span>
          <span className="text-[11px] text-muted-foreground">Madar — لوحة التحكم</span>
          <span />
        </div>

        {/* Body */}
        <div className="grid grid-cols-[1.4fr_0.6fr] gap-3 p-4">

          {/* Main column */}
          <div>
            <p className="text-[10px] text-muted-foreground m-0">الثلاثاء، ١١ أغسطس ٢٠٢٦</p>
            <h3 className="text-lg font-bold text-foreground mt-1 mb-3">حصص اليوم</h3>

            {/* Session card */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-surface-low border border-border">
              <span className="text-[11px] font-extrabold text-primary shrink-0">٦:٠٠ م</span>
              <div className="flex-1 min-w-0">
                <strong className="block text-[12px] text-foreground">رياضيات</strong>
                <small className="block text-[10px] text-muted-foreground mt-0.5">الصف الثالث الثانوي · ٢٨ طالب</small>
              </div>
              <span className="px-2 py-1 rounded-sm text-[9px] font-bold bg-primary/10 text-primary">قادمة</span>
            </div>

            {/* Attendance card */}
            <div className="mt-2.5 p-3 border border-border rounded-md">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-2">
                <span>حضور المجموعة</span>
                <b className="text-primary font-bold text-[10px]">٢٨ طالب</b>
              </div>
              <div className="flex gap-2.5 py-2 border-t border-b border-border mb-2">
                {[['#2ab57a','حاضر','٢٤'],['#e05252','غائب','٣'],['#e09a34','متأخر','١']].map(([color, label, count]) => (
                  <span key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <i className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    {label} <b className="text-foreground">{count}</b>
                  </span>
                ))}
              </div>
              {students.map(([name, status]) => (
                <div key={name} className="flex items-center gap-1.5 pt-1.5 text-[10px] text-muted-foreground">
                  <span className="grid place-items-center w-5 h-5 bg-primary/10 text-primary rounded-sm text-[9px] font-extrabold shrink-0">
                    {name[0]}
                  </span>
                  <span className="flex-1">{name}</span>
                  <b className={status === 'absent' ? 'text-destructive' : 'text-[#2ab57a]'}>
                    {status === 'absent' ? '×' : '✓'}
                  </b>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-2.5">
            {/* Revenue card */}
            <div className="flex flex-col gap-1.5 p-3 border border-border rounded-md bg-card">
              <span className="grid place-items-center w-[26px] h-[26px] bg-primary/10 text-primary rounded-md">
                <CreditCard size={13} />
              </span>
              <small className="text-[10px] text-muted-foreground">المحصّل هذا الشهر</small>
              <strong className="text-[19px] font-extrabold text-foreground leading-none">
                ٦٨,٥٠٠ <em className="text-[10px] font-normal text-muted-foreground not-italic">ج.م</em>
              </strong>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <span className="block h-full w-[85%] bg-primary rounded-full" />
              </div>
              <small className="text-[10px] text-[#2ab57a]">٨٥.٦٪ من المتوقع</small>
            </div>
            {/* Students card — secondary/violet accent */}
            <div className="flex flex-col gap-1.5 p-3 border border-secondary/20 rounded-md bg-secondary/5">
              <span className="grid place-items-center w-[26px] h-[26px] bg-secondary/10 text-secondary rounded-md">
                <Users size={13} />
              </span>
              <small className="text-[10px] text-muted-foreground">إجمالي الطلاب</small>
              <strong className="text-[19px] font-extrabold text-foreground leading-none">١٢٤</strong>
              <small className="text-[10px] text-[#2ab57a]">+٨ هذا الشهر</small>
            </div>
          </div>
        </div>
      </div>

      {/* Floating toast */}
      <motion.div
        className="absolute -right-3.5 bottom-4 flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-md shadow-[0_10px_28px_rgba(6,60,188,0.10)] text-[10.5px] font-semibold text-primary whitespace-nowrap"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      >
        <Check size={13} strokeWidth={2.5} className="text-[#2ab57a]" />
        تم حفظ الحضور
      </motion.div>

      {/* Floating badge — secondary/violet */}
      <motion.div
        className="absolute -left-2.5 top-7 flex items-center gap-1.5 px-2.5 py-2 bg-card border border-secondary/20 rounded-md shadow-[0_10px_28px_rgba(83,65,218,0.12)] text-[10px] font-semibold text-secondary whitespace-nowrap"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
      >
        <Sparkles size={12} />
        ١٢ طالب انتظار
      </motion.div>
    </motion.div>
  )
}
