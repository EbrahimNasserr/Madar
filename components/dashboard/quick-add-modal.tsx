'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useApp } from './app-context'

type Tab = 'student' | 'group' | 'session' | 'payment'

// ─── Shared input styles ──────────────────────────────────────────────────────
const input =
  'w-full px-3 py-2 bg-[#F7F8FC] border border-gray-200 rounded-xl text-xs font-bold text-[#111827] focus:outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition-colors'
const label = 'block font-bold text-[#111827] mb-1 text-xs'

// ─── Component ────────────────────────────────────────────────────────────────
export function QuickAddModal() {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    groups,
    students,
    addStudent,
    addGroup,
    addSession,
    recordPayment,
  } = useApp()

  const [tab, setTab] = useState<Tab>('student')

  // Student form
  const [stName,        setStName]        = useState('')
  const [stPhone,       setStPhone]       = useState('')
  const [stParentPhone, setStParentPhone] = useState('')
  const [stGroup,       setStGroup]       = useState(groups[0]?.id ?? '')

  // Group form
  const [grpName,     setGrpName]     = useState('')
  const [grpCenter,   setGrpCenter]   = useState('سنتر النور')
  const [grpGrade,    setGrpGrade]    = useState('الصف الثالث الثانوي')
  const [grpPrice,    setGrpPrice]    = useState(500)
  const [grpCapacity, setGrpCapacity] = useState(30)

  // Session form
  const [sessGroup, setSessGroup] = useState(groups[0]?.id ?? '')
  const [sessDate,  setSessDate]  = useState('2026-09-02')
  const [sessTime,  setSessTime]  = useState('٦:٠٠ م')
  const [sessTopic, setSessTopic] = useState('')

  // Payment form
  const [payStudent, setPayStudent] = useState(students[0]?.id ?? '')
  const [payAmount,  setPayAmount]  = useState(500)
  const [payMethod,  setPayMethod]  = useState<'cash' | 'vodafone_cash' | 'instapay'>('cash')

  if (!isQuickAddOpen) return null

  const close = () => setIsQuickAddOpen(false)

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    const g = groups.find(grp => grp.id === stGroup) ?? groups[0]
    addStudent({
      name: stName,
      phone: stPhone,
      parentPhone: stParentPhone,
      groupId: g.id,
      groupName: g.name,
      grade: g.grade,
      paymentStatus: 'paid',
      totalPaid: g.pricePerSession,
      outstandingBalance: 0,
      notes: 'طالب جديد مضاف عبر الإضافة السريعة',
    })
    setStName(''); setStPhone(''); setStParentPhone('')
    close()
  }

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    addGroup({
      name: grpName,
      grade: grpGrade,
      subject: 'رياضيات',
      type: 'government',
      centerName: grpCenter,
      pricePerSession: grpPrice,
      sessionsPerMonth: 8,
      scheduleDays: ['الثلاثاء', 'الجمعة'],
      time: '٦:٠٠ م',
      capacity: grpCapacity,
    })
    setGrpName('')
    close()
  }

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault()
    const g = groups.find(grp => grp.id === sessGroup) ?? groups[0]
    const groupStudents = students.filter(s => s.groupId === g.id)
    addSession({
      groupId: g.id,
      groupName: g.name,
      subject: g.subject,
      grade: g.grade,
      date: sessDate,
      time: sessTime,
      room: 'قاعة 1',
      topic: sessTopic || 'مراجعة عامة وحل تمارين',
      totalStudents: groupStudents.length,
      status: 'upcoming',
      isAttendanceSaved: false,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
    })
    setSessTopic('')
    close()
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    const s = students.find(st => st.id === payStudent)
    if (!s) return
    recordPayment({
      studentId: s.id,
      studentName: s.name,
      groupId: s.groupId,
      groupName: s.groupName,
      amount: payAmount,
      method: payMethod,
      notes: 'سداد سريع',
    })
    close()
  }

  // ── Tab config ───────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string }[] = [
    { id: 'student', label: 'طالب'   },
    { id: 'group',   label: 'مجموعة' },
    { id: 'session', label: 'حصة'    },
    { id: 'payment', label: 'دفعة'   },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF0FF] flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#3157D5]" />
            </div>
            <h3 className="font-bold text-lg text-[#111827]">إضافة سريعة</h3>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F7F8FC] rounded-2xl border border-gray-200 text-xs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 text-center rounded-xl font-bold transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-[#3157D5] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Student form ─────────────────────────────────────────────────── */}
        {tab === 'student' && (
          <form onSubmit={handleAddStudent} className="space-y-3.5">
            <div>
              <label className={label}>اسم الطالب</label>
              <input
                type="text"
                required
                placeholder="مثال: يوسف محمود حسن"
                value={stName}
                onChange={e => setStName(e.target.value)}
                className={input}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>هاتف الطالب</label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={stPhone}
                  onChange={e => setStPhone(e.target.value)}
                  className={`${input} font-mono`}
                />
              </div>
              <div>
                <label className={label}>هاتف ولي الأمر</label>
                <input
                  type="tel"
                  required
                  placeholder="01223456789"
                  value={stParentPhone}
                  onChange={e => setStParentPhone(e.target.value)}
                  className={`${input} font-mono`}
                />
              </div>
            </div>

            <div>
              <label className={label}>المجموعة</label>
              <select
                value={stGroup}
                onChange={e => setStGroup(e.target.value)}
                className={input}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.centerName})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              إضافة الطالب فوراً ✓
            </button>
          </form>
        )}

        {/* ── Group form ───────────────────────────────────────────────────── */}
        {tab === 'group' && (
          <form onSubmit={handleAddGroup} className="space-y-3.5">
            <div>
              <label className={label}>اسم المجموعة</label>
              <input
                type="text"
                required
                placeholder="مثال: مجموعة C — الصف الثالث"
                value={grpName}
                onChange={e => setGrpName(e.target.value)}
                className={input}
              />
            </div>

            <div>
              <label className={label}>المرحلة الدراسية</label>
              <select
                value={grpGrade}
                onChange={e => setGrpGrade(e.target.value)}
                className={input}
              >
                {['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
                  'الصف السادس الابتدائي', 'الصف الثالث الإعدادي'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>اسم السنتر</label>
                <input
                  type="text"
                  value={grpCenter}
                  onChange={e => setGrpCenter(e.target.value)}
                  className={input}
                />
              </div>
              <div>
                <label className={label}>سعر الحصة (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  value={grpPrice}
                  onChange={e => setGrpPrice(Number(e.target.value))}
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className={label}>الطاقة الاستيعابية</label>
              <input
                type="number"
                min={1}
                value={grpCapacity}
                onChange={e => setGrpCapacity(Number(e.target.value))}
                className={input}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              إنشاء المجموعة ✓
            </button>
          </form>
        )}

        {/* ── Session form ─────────────────────────────────────────────────── */}
        {tab === 'session' && (
          <form onSubmit={handleAddSession} className="space-y-3.5">
            <div>
              <label className={label}>المجموعة</label>
              <select
                value={sessGroup}
                onChange={e => setSessGroup(e.target.value)}
                className={input}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.centerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>التاريخ</label>
                <input
                  type="date"
                  value={sessDate}
                  onChange={e => setSessDate(e.target.value)}
                  className={input}
                />
              </div>
              <div>
                <label className={label}>الموعد</label>
                <input
                  type="text"
                  placeholder="٦:٠٠ م"
                  value={sessTime}
                  onChange={e => setSessTime(e.target.value)}
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className={label}>موضوع الحصة (اختياري)</label>
              <input
                type="text"
                placeholder="مثال: شرح درس التكامل بالتعويض"
                value={sessTopic}
                onChange={e => setSessTopic(e.target.value)}
                className={input}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              جدولة الحصة ✓
            </button>
          </form>
        )}

        {/* ── Payment form ─────────────────────────────────────────────────── */}
        {tab === 'payment' && (
          <form onSubmit={handleRecordPayment} className="space-y-3.5">
            <div>
              <label className={label}>الطالب</label>
              <select
                value={payStudent}
                onChange={e => setPayStudent(e.target.value)}
                className={input}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.groupName})
                  </option>
                ))}
              </select>

              {/* Outstanding balance hint */}
              {(() => {
                const s = students.find(st => st.id === payStudent)
                if (!s || s.outstandingBalance === 0) return null
                return (
                  <p className="mt-1.5 text-[11px] text-[#F79009] font-semibold">
                    متأخرات: {s.outstandingBalance.toLocaleString()} ج.م
                  </p>
                )
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>المبلغ (ج.م)</label>
                <input
                  type="number"
                  min={1}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className={input}
                />
              </div>
              <div>
                <label className={label}>طريقة الدفع</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as typeof payMethod)}
                  className={input}
                >
                  <option value="cash">نقداً (كاش)</option>
                  <option value="vodafone_cash">فودافون كاش</option>
                  <option value="instapay">InstaPay</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              تسجيل استلام الدفعة ✓
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
