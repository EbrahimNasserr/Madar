'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { useApp } from './app-context'
import { useGetGroupsQuery } from '@/src/lib/api/groupsApi'
import { useCreateStudentMutation } from '@/src/lib/api/studentsApi'
import {
  useCreateGroupMutation,
  useAddStudentToGroupMutation,
} from '@/src/lib/api/groupsApi'

type Tab = 'student' | 'group'

// Shared field styles
const fieldInput =
  'w-full px-3 py-2 bg-[#F7F8FC] border border-gray-200 rounded-xl text-xs font-bold text-[#111827] focus:outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition-colors'
const fieldLabel = 'block font-bold text-[#111827] mb-1 text-xs'

const GRADES = [
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
  'الصف السادس الابتدائي',
  'الصف الثالث الإعدادي',
]

export function QuickAddModal() {
  const { isQuickAddOpen, setIsQuickAddOpen } = useApp()

  // ── Real API hooks ─────────────────────────────────────────────────────────
  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery()
  const groups = groupsData?.data?.groups ?? []

  const [createStudent, { isLoading: creatingStudent }] = useCreateStudentMutation()
  const [addStudentToGroup] = useAddStudentToGroupMutation()
  const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation()

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('student')

  // ── Student form ───────────────────────────────────────────────────────────
  const [stFirstName,   setStFirstName]   = useState('')
  const [stLastName,    setStLastName]    = useState('')
  const [stPhone,       setStPhone]       = useState('')
  const [stParentPhone, setStParentPhone] = useState('')
  const [stGroup,       setStGroup]       = useState('')

  // ── Group form ─────────────────────────────────────────────────────────────
  const [grpName,    setGrpName]    = useState('')
  const [grpGrade,   setGrpGrade]   = useState(GRADES[0])
  const [grpSubject, setGrpSubject] = useState('رياضيات')
  const [grpPrice,   setGrpPrice]   = useState(500)

  // ── Error state ────────────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null)

  if (!isQuickAddOpen) return null

  const close = () => {
    setError(null)
    setIsQuickAddOpen(false)
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const groupId = stGroup || groups[0]?._id
    if (!groupId) {
      setError('اختر مجموعة أولاً أو أنشئ مجموعة جديدة.')
      return
    }

    try {
      // Step 1 — create the student record
      const result = await createStudent({
        firstName:   stFirstName.trim(),
        lastName:    stLastName.trim(),
        phone:       stPhone.trim() || undefined,
        parentPhone: stParentPhone.trim() || undefined,
      }).unwrap()

      // Step 2 — enroll the new student in the selected group
      await addStudentToGroup({
        groupId,
        studentId: result.data.student._id,
      }).unwrap()

      // Reset & close
      setStFirstName('')
      setStLastName('')
      setStPhone('')
      setStParentPhone('')
      setStGroup('')
      close()
    } catch {
      setError('حدث خطأ أثناء إضافة الطالب. حاول مرة أخرى.')
    }
  }

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await createGroup({
        name:            grpName.trim(),
        subject:         grpSubject.trim(),
        grade:           grpGrade,
        billingModel:    'per_session',
        pricePerSession: grpPrice,
        schedule:        [],
      }).unwrap()

      setGrpName('')
      setGrpPrice(500)
      close()
    } catch {
      setError('حدث خطأ أثناء إنشاء المجموعة. حاول مرة أخرى.')
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'student', label: 'طالب'   },
    { id: 'group',   label: 'مجموعة' },
  ]

  const isBusy = creatingStudent || creatingGroup

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
              onClick={() => { setTab(t.id); setError(null) }}
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

        {/* Inline error */}
        {error && (
          <p className="text-xs text-[#F04438] bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* ── Student form ── */}
        {tab === 'student' && (
          <form onSubmit={handleAddStudent} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>الاسم الأول</label>
                <input
                  type="text"
                  required
                  placeholder="يوسف"
                  value={stFirstName}
                  onChange={(e) => setStFirstName(e.target.value)}
                  className={fieldInput}
                />
              </div>
              <div>
                <label className={fieldLabel}>اسم العائلة</label>
                <input
                  type="text"
                  required
                  placeholder="محمود"
                  value={stLastName}
                  onChange={(e) => setStLastName(e.target.value)}
                  className={fieldInput}
                />
              </div>
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
              {groupsLoading ? (
                <div className={`${fieldInput} flex items-center gap-2 text-[#667085]`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ تحميل المجموعات...</span>
                </div>
              ) : (
                <select
                  value={stGroup || groups[0]?._id || ''}
                  onChange={(e) => setStGroup(e.target.value)}
                  className={fieldInput}
                >
                  {groups.length === 0 && (
                    <option value="">لا توجد مجموعات — أنشئ مجموعة أولاً</option>
                  )}
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}{g.grade ? ` — ${g.grade}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={groups.length === 0 || isBusy}
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creatingStudent ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ الإضافة...</span>
                </>
              ) : (
                'إضافة الطالب ✓'
              )}
            </button>
          </form>
        )}

        {/* ── Group form ── */}
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
              <label className={fieldLabel}>المادة</label>
              <input
                type="text"
                required
                placeholder="مثال: رياضيات"
                value={grpSubject}
                onChange={(e) => setGrpSubject(e.target.value)}
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
                {GRADES.map((g) => (
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
              disabled={isBusy}
              className="w-full py-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creatingGroup ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ الإنشاء...</span>
                </>
              ) : (
                'إنشاء المجموعة ✓'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
