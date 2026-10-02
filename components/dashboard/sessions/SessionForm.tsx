'use client'

import { FormEvent, useMemo, useState } from 'react'
import type { CreateSessionInput, Session } from '@/src/lib/api/sessionsApi'
import type { Group } from '@/src/lib/api/groupsApi'
import { getDayLabel } from '@/src/constants/weekDays'

type SessionFormProps = {
  group:         Group
  session?:      Session
  isSubmitting?: boolean
  onSubmit:      (data: CreateSessionInput) => Promise<void>
  onCancel?:     () => void
}

export function SessionForm({
  group,
  session,
  isSubmitting,
  onSubmit,
  onCancel,
}: SessionFormProps) {
  const [sessionDate, setSessionDate] = useState(
    session?.sessionDate ? session.sessionDate.slice(0, 10) : '',
  )
  const [startTime, setStartTime] = useState(session?.startTime ?? '')
  const [endTime,   setEndTime]   = useState(session?.endTime   ?? '')
  const [notes,     setNotes]     = useState(session?.notes     ?? '')

  // ── Which day of the week is the selected date? ────────────────────────────
  const selectedDayOfWeek = useMemo(() => {
    if (!sessionDate) return null
    return new Date(`${sessionDate}T00:00:00`).getDay()
  }, [sessionDate])

  // ── Does the group have a slot on that day? ────────────────────────────────
  const matchingSchedules = useMemo(() => {
    if (selectedDayOfWeek === null) return []
    return group.schedule.filter((s) => s.dayOfWeek === selectedDayOfWeek)
  }, [selectedDayOfWeek, group.schedule])

  // ── Autofill times when date changes ──────────────────────────────────────
  const handleDateChange = (value: string) => {
    setSessionDate(value)
    const day      = new Date(`${value}T00:00:00`).getDay()
    const schedule = group.schedule.find((s) => s.dayOfWeek === day)
    if (schedule) {
      setStartTime(schedule.startTime)
      setEndTime(schedule.endTime)
    } else {
      setStartTime('')
      setEndTime('')
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!sessionDate || matchingSchedules.length === 0) return
    await onSubmit({
      groupId:     group._id,
      sessionDate,
      startTime,
      endTime,
      ...(notes.trim() && { notes: notes.trim() }),
    })
  }

  // ── Hint: show which days are in the schedule ──────────────────────────────
  const scheduledDays = group.schedule
    .map((s) => getDayLabel(s.dayOfWeek))
    .join('، ')

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          تاريخ الحصة
          <span className="text-red-500 mr-0.5" aria-hidden="true"> *</span>
        </label>
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => handleDateChange(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
        />
        <p className="text-xs text-slate-400">
          أيام المجموعة: {scheduledDays}
        </p>
      </div>

      {/* Warning: selected day not in schedule */}
      {sessionDate && matchingSchedules.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          اليوم المختار غير موجود في جدول المجموعة. يمكنك المتابعة بتحديد الوقت يدويًا.
        </div>
      )}

      {/* Time range */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            من
            <span className="text-red-500 mr-0.5" aria-hidden="true"> *</span>
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            إلى
            <span className="text-red-500 mr-0.5" aria-hidden="true"> *</span>
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">ملاحظات</label>
        <textarea
          value={notes as string}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="أي ملاحظات على الحصة..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            إلغاء
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !sessionDate || !startTime || !endTime}
          className="rounded-xl bg-[#3157D5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
        >
          {isSubmitting
            ? 'جارٍ الحفظ...'
            : session
              ? 'حفظ التعديلات'
              : 'إنشاء الحصة'}
        </button>
      </div>
    </form>
  )
}
