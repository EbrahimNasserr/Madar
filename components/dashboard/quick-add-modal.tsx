'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useApp } from './app-context'

type Tab = 'student' | 'group'

// Shared field styles
const fieldInput =
  'w-full px-3 py-2 bg-[#F7F8FC] border border-gray-200 rounded-xl text-xs font-bold text-[#111827] focus:outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition-colors'
const fieldLabel = 'block font-bold text-[#111827] mb-1 text-xs'

export function QuickAddModal() {
  const { isQuickAddOpen, setIsQuickAddOpen, groups, addStudent, addGroup } = useApp()

  const [tab, setTab] = useState<Tab>('student')

  // Student form
  const [stName,        setStName]        = useState('')
  const [stPhone,       setStPhone]       = useState('')
  const [stParentPhone, setStParentPhone] = useState('')
  const [stGroup,       setStGroup]       = useState(groups[0]?.id ?? '')

  // Group form
  const [grpName,   setGrpName]   = useState('')
  const [grpGrade,  setGrpGrade]  = useState('الصف الثالث الثانوي')
  const [grpPrice,  setGrpPrice]  = useState(500)

  if (!isQuickAddOpen) return null

  const close = () => setIsQuickAddOpen(false)

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    const g = groups.find((grp) => grp.id === stGroup) ?? groups[0]
    if (!g) return
    addStudent({
      name:               stName,
      phone:              stPhone,
      parentPhone:        stParentPhone,
      groupId:            g.id,
      groupName:          g.name,
      grade:              g.grade,
      totalPaid:          g.pricePerSession,
      outstandingBalance: 0,
    })
    setStName('')
    setStPhone('')
    setStParentPhone('')
    close()
  }

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    addGroup({
      name:             grpName,
      grade:            grpGrade,
      subject:          'رياضيات',
      pricePerSession:  grpPrice,
      sessionsPerMonth: 8,
      scheduleDays:     [],
      time:             '',
    })
    setGrpName('')
    close()
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'student', label: 'طالب'   },
    { id: 'group',   label: 'مجموعة' },
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
            aria-label="إغلاق"
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F7F8FC] rounded-2xl border border-gray-200 text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 text-center rounded-xl font-bold transition-all ${
                tab === t.id
                  ? 'bg-[#3157D5] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Student form */}
        {tab === 'student' && (
          <form onSubmit={handleAddStudent} className="space-y-3.5">
            <div>
              <label className={fieldLabel}>اسم الطالب</label>
              <input
                type="text"
                required
                placeholder="مثال: يوسف محمود حسن"
                value={stName}
                onChange={(e) => setStName(e.target.value)}
                className={fieldInput}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>هاتف الطالب</label>
                <input
                  type="tel"
                  placeholder="01012345678"
                  value={stPhone}
                  onChange={(e) => setStPhone(e.target.value)}
                  className={fieldInput}
                />
              </div>
              <div>
                <label className={fieldLabel}>هاتف ولي الأمر</label>
                <input
                  type="tel"
                  placeholder="01223456789"
                  value={stParentPhone}
                  onChange={(e) => setStParentPhone(e.target.value)}
                  className={fieldInput}
                />
              </div>
            </div>

            <div>
              <label className={fieldLabel}>المجموعة</label>
              <select
                value={stGroup}
                onChange={(e) => setStGroup(e.target.value)}
                className={fieldInput}
              >
                {groups.length === 0 && (
                  <option value="">لا توجد مجموعات — أنشئ مجموعة أولاً</option>
                )}
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={groups.length === 0}
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
            >
              إضافة الطالب ✓
            </button>
          </form>
        )}

        {/* Group form */}
        {tab === 'group' && (
          <form onSubmit={handleAddGroup} className="space-y-3.5">
            <div>
              <label className={fieldLabel}>اسم المجموعة</label>
              <input
                type="text"
                required
                placeholder="مثال: مجموعة C — الصف الثالث"
                value={grpName}
                onChange={(e) => setGrpName(e.target.value)}
                className={fieldInput}
              />
            </div>

            <div>
              <label className={fieldLabel}>المرحلة الدراسية</label>
              <select
                value={grpGrade}
                onChange={(e) => setGrpGrade(e.target.value)}
                className={fieldInput}
              >
                {[
                  'الصف الأول الثانوي',
                  'الصف الثاني الثانوي',
                  'الصف الثالث الثانوي',
                  'الصف السادس الابتدائي',
                  'الصف الثالث الإعدادي',
                ].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={fieldLabel}>سعر الحصة (ج.م)</label>
              <input
                type="number"
                min={0}
                value={grpPrice}
                onChange={(e) => setGrpPrice(Number(e.target.value))}
                className={fieldInput}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors"
            >
              إنشاء المجموعة ✓
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
