'use client'

import { use, useEffect, useState } from 'react'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { useGetSessionQuery }            from '@/src/lib/api/sessionsApi'
import {
  useGetAttendanceSheetQuery,
  useSaveAttendanceSheetMutation,
  type AttendanceStatus,
} from '@/src/lib/api/attendanceApi'
import { formatArabicDate }   from '@/src/lib/date/formatDate'
import { SESSION_STATUS_LABELS, SESSION_STATUS_STYLES } from '@/src/constants/sessionStatus'
import { AttendanceRow }      from './AttendanceRow'
import { AttendanceSummary }  from './AttendanceSummary'

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftAttendance = {
  studentId: string
  status:    AttendanceStatus
  note:      string
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ id: string }>
}

export function AttendanceWorkspace({ params }: Props) {
  const { id } = use(params)

  // ── Server state ────────────────────────────────────────────────────────────
  const { data: sessionData, isLoading: sessionLoading } = useGetSessionQuery(id)
  const { data: sheetData,   isLoading: sheetLoading }   = useGetAttendanceSheetQuery(id)
  const [saveSheet, { isLoading: isSaving, isSuccess: isSaved }] =
    useSaveAttendanceSheetMutation()

  // ── Draft attendance (local, not persisted until save) ─────────────────────
  const [attendance, setAttendance] = useState<DraftAttendance[]>([])

  // Seed draft from server — default everyone to "present"
  useEffect(() => {
    const students = sheetData?.data.students
    if (!students) return
    setAttendance(
      students.map((item) => ({
        studentId: item.student._id,
        status:    item.attendance?.status ?? 'present',
        note:      item.attendance?.note   ?? '',
      })),
    )
  }, [sheetData])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const changeStatus = (studentId: string, status: AttendanceStatus) =>
    setAttendance((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item)),
    )

  const handleSave = async () => {
    await saveSheet({
      sessionId:  id,
      attendance: attendance.map((item) => ({
        studentId: item.studentId,
        status:    item.status,
        note:      item.note || null,
      })),
    }).unwrap()
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (sessionLoading || sheetLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">جارٍ تحميل الحصة...</span>
      </div>
    )
  }

  const session  = sessionData?.data.session
  const students = sheetData?.data.students ?? []

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8" dir="rtl">

      {/* ── Back + session info ── */}
      <div className="space-y-4">
        {/* Back link */}
        {session && (
          <Link
            href={`/groups/${typeof session.groupId === 'string' ? session.groupId : session.groupId._id}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            العودة للمجموعة
          </Link>
        )}

        {/* Session card */}
        {session && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  تسجيل الحضور
                </p>
                <h1 className="mt-1 text-xl font-bold text-slate-900">
                  {formatArabicDate(session.sessionDate)}
                </h1>
                <p dir="ltr" className="mt-1 text-sm text-slate-500">
                  {session.startTime} → {session.endTime}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${SESSION_STATUS_STYLES[session.status]}`}
              >
                {SESSION_STATUS_LABELS[session.status]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Summary pills ── */}
      {attendance.length > 0 && <AttendanceSummary attendance={attendance} />}

      {/* ── Student rows ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {students.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            لا يوجد طلاب مسجلون في هذه المجموعة.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((item) => {
              const draft = attendance.find((a) => a.studentId === item.student._id)
              if (!draft) return null
              return (
                <AttendanceRow
                  key={item.student._id}
                  student={item.student}
                  status={draft.status}
                  onStatus={(status) => changeStatus(item.student._id, status)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* ── Sticky save bar ── */}
      <div className="sticky bottom-4 z-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || attendance.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3157D5] py-3.5 text-sm font-bold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جارٍ حفظ الحضور...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                تم الحفظ
              </>
            ) : (
              `حفظ حضور ${attendance.length} طالب`
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
