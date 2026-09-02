'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { studentNames } from '../data'
import type { AttendanceStatus, PaymentStatus, StudentRow } from '../types'

const ATTENDANCE_CYCLE: Record<AttendanceStatus, AttendanceStatus> = {
  'حاضر': 'غائب', 'غائب': 'متأخر', 'متأخر': 'معذور', 'معذور': 'حاضر',
}
const PAYMENT_CYCLE: Record<PaymentStatus, PaymentStatus> = {
  'مدفوع': 'غير مدفوع', 'غير مدفوع': 'معلّق', 'معلّق': 'مدفوع',
}

const attendanceColor: Record<AttendanceStatus, string> = {
  'حاضر': 'text-green-700 bg-green-50',
  'غائب': 'text-red-600   bg-red-50',
  'متأخر': 'text-amber-600 bg-amber-50',
  'معذور': 'text-blue-600  bg-blue-50',
}
const paymentColor: Record<PaymentStatus, string> = {
  'مدفوع':      'text-green-700 bg-green-50',
  'غير مدفوع': 'text-red-600   bg-red-50',
  'معلّق':      'text-amber-600 bg-amber-50',
}

function makeRows(): StudentRow[] {
  return studentNames.map((name, i) => ({
    name,
    attendance: (i === 2 ? 'غائب' : i === 5 ? 'متأخر' : 'حاضر') as AttendanceStatus,
    payment:    (i === 1 || i === 6 ? 'غير مدفوع' : 'مدفوع') as PaymentStatus,
  }))
}

interface AttendancePageProps {
  onSaved: () => void
}

export function AttendancePage({ onSaved }: AttendancePageProps) {
  const [rows, setRows] = useState<StudentRow[]>(makeRows)

  const counts = useMemo(() => ({
    present: rows.filter(r => r.attendance === 'حاضر').length,
    absent:  rows.filter(r => r.attendance === 'غائب').length,
    late:    rows.filter(r => r.attendance === 'متأخر').length,
  }), [rows])

  const cycleAttendance = (i: number) =>
    setRows(prev => prev.map((r, idx) => idx !== i ? r : { ...r, attendance: ATTENDANCE_CYCLE[r.attendance] }))

  const cyclePayment = (i: number) =>
    setRows(prev => prev.map((r, idx) => idx !== i ? r : { ...r, payment: PAYMENT_CYCLE[r.payment] }))

  const markAllPresent = () => {
    setRows(prev => prev.map(r => ({ ...r, attendance: 'حاضر' })))
    onSaved()
  }

  return (
    <section className="animate-[appear_0.28s_ease-out]">
      {/* Header */}
      <div className="flex items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-[11px] font-bold text-primary tracking-wide m-0">الثلاثاء، ١١ أغسطس</p>
          <h1 className="mt-2 text-[clamp(23px,3vw,29px)] font-extrabold tracking-tight m-0">رياضيات — الصف الثالث الثانوي</h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 m-0">الحصة المسائية · ٦:٠٠ م · {rows.length} طالب</p>
        </div>
        <button
          onClick={markAllPresent}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 hover:-translate-y-px transition-all cursor-pointer shrink-0"
        >
          <Check size={17} /> حضور الكل
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2.5 mb-4 flex-wrap">
        {[
          { color: 'bg-green-500', label: 'حاضر',  val: counts.present },
          { color: 'bg-red-500',   label: 'غائب',   val: counts.absent  },
          { color: 'bg-amber-500', label: 'متأخر', val: counts.late    },
        ].map(({ color, label, val }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-[9px] text-[11px]">
            <span className={cn('w-2 h-2 rounded-full', color)} />
            {label} <b className="text-[14px] font-extrabold">{val}</b>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.name}
            className="grid items-center gap-4 px-4 py-3 border-b border-border last:border-0"
            style={{ gridTemplateColumns: '1.5fr .8fr .8fr 30px' }}
          >
            {/* Student */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary text-[13px] font-bold">
                {row.name[0]}
              </div>
              <div className="min-w-0">
                <strong className="block text-[13px] font-semibold truncate">{row.name}</strong>
                <small className="block text-[10px] text-muted-foreground mt-0.5">مجموعة A</small>
              </div>
            </div>

            {/* Attendance btn */}
            <button
              onClick={() => cycleAttendance(i)}
              className={cn('px-2.5 py-2 rounded-[7px] text-[10px] font-bold border-0 cursor-pointer', attendanceColor[row.attendance])}
            >
              {row.attendance}
            </button>

            {/* Payment btn */}
            <button
              onClick={() => cyclePayment(i)}
              className={cn('px-2.5 py-2 rounded-[7px] text-[10px] font-bold border-0 cursor-pointer', paymentColor[row.payment])}
            >
              {row.payment}
            </button>

            <button className="grid place-items-center border-0 bg-transparent text-muted-foreground cursor-pointer hover:text-foreground">
              <ChevronLeft size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between gap-4 mt-4 px-4 py-3 bg-primary/5 border border-primary/15 rounded-xl text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck size={17} className="text-primary" />
          يتم حفظ التغييرات تلقائياً عند الضغط على زر الحفظ
        </span>
        <button
          onClick={onSaved}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-primary-foreground bg-primary rounded-[9px] shadow-sm hover:brightness-95 cursor-pointer"
        >
          حفظ الحضور
        </button>
      </div>
    </section>
  )
}
