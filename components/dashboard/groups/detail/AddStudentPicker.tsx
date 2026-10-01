'use client'

import { useState, useMemo } from 'react'
import { Loader2, Search } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { useAddStudentToGroupMutation } from '@/src/lib/api/groupsApi'
import { getApiErrorMessage } from '../shared/constants'

type AddStudentPickerProps = {
  groupId:           string
  availableStudents: Student[]
}

export function AddStudentPicker({ groupId, availableStudents }: AddStudentPickerProps) {
  const [addStudent, { isLoading }] = useAddStudentToGroupMutation()

  const [search,     setSearch]     = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [error,      setError]      = useState<string | null>(null)

  // Filter by search term
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return availableStudents
    return availableStudents.filter((s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.phone?.includes(q),
    )
  }, [availableStudents, search])

  const handleAdd = async () => {
    if (!selectedId) return
    setError(null)
    try {
      await addStudent({ groupId, studentId: selectedId }).unwrap()
      setSelectedId('')
      setSearch('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-3">
      {/* Search box */}
      <div className="relative">
        <Search className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث عن طالب بالاسم أو الهاتف..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setSelectedId('') // reset selection when typing
          }}
          className="w-full rounded-xl border border-slate-200 bg-white pe-10 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
        />
      </div>

      {/* Picker row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
        >
          <option value="">
            {filtered.length === 0
              ? 'لا يوجد طلاب متاحون'
              : 'اختر طالبًا...'}
          </option>
          {filtered.map((student) => (
            <option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
              {student.phone ? ` — ${student.phone}` : ''}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          disabled={!selectedId || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          إضافة للمجموعة
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
