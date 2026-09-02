'use client'

import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, Plus, Users, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const groups = [
  { subject: 'رياضيات', grade: 'الصف الثالث الثانوي', count: '٢٨', sessions: '٨',  price: '١٠٠', type: 'حكومي', colorClass: 'bg-primary' },
  { subject: 'رياضيات', grade: 'الصف الثاني الثانوي',  count: '٢٢', sessions: '٤',  price: '١٥٠', type: 'تجريبي', colorClass: 'bg-blue-500' },
  { subject: 'فيزياء',  grade: 'الصف الثالث الثانوي', count: '١٨', sessions: '٨',  price: '١٢٠', type: 'خاص',    colorClass: 'bg-purple-500' },
]

export function GroupsPage() {
  return (
    <section className="animate-[appear_0.28s_ease-out]">
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">تنظيم حصصك</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">المجموعات</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">اضبط عدد الحصص والأسعار لكل مجموعة</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 cursor-pointer shrink-0">
          <Plus size={17} /> إنشاء مجموعة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map(({ subject, grade, count, sessions, price, type, colorClass }) => (
          <motion.div
            key={grade + type}
            whileHover={{ y: -3 }}
            className="bg-card border border-border rounded-2xl shadow-sm p-[18px]"
          >
            {/* Mark */}
            <div className={cn('grid place-items-center w-[42px] h-[42px] rounded-[12px] text-white text-[18px] font-extrabold mb-4', colorClass)}>
              {subject[0]}
            </div>
            {/* Head */}
            <div className="flex justify-between items-start gap-2.5 mb-1">
              <div>
                <h2 className="text-[15px] font-bold m-0">{subject}</h2>
                <p className="text-[12px] text-muted-foreground mt-1 m-0">{grade}</p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-[7px] text-[10px] font-bold text-muted-foreground bg-muted">{type}</span>
            </div>
            {/* Meta */}
            <div className="flex flex-col gap-2.5 border-t border-border mt-4 pt-4">
              {[
                { icon: Users,       label: `${count} طالب`       },
                { icon: CalendarDays,label: `${sessions} حصص / شهر`},
                { icon: Wallet,      label: `${price} ج.م / حصة`  },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Icon size={15} className="text-primary shrink-0" />{label}
                </span>
              ))}
            </div>
            <button className="flex items-center justify-center gap-1.5 w-full mt-4 px-2.5 py-2 text-[10px] font-bold text-foreground bg-card border border-border rounded-[9px] hover:bg-muted cursor-pointer">
              فتح المجموعة <ChevronLeft size={15} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
