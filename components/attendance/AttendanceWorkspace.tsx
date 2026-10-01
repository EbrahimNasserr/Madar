'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { useGetSessionQuery }            from '@/src/lib/api/sessionsApi'
import {
  useGetAttendanceSheetQuery,
  useSaveAttendanceSheetMutation,
  type AttendanceStatus,
} from '@/src/lib/api/attendanceApi'
import {
  useGetSessionPaymentsQuery,
  type Payment,
} from '@/src/lib/api/paymentsApi'
import { formatArabicDate }              from '@/src/lib/date/formatDate'
import { SESSION_STATUS_LABELS, SESSION_STATUS_STYLES } from '@/src/constants/sessionStatus'
import { AttendanceRow }                 from './AttendanceRow'
import { AttendanceSummary }             from './AttendanceSummary'
import { SessionPaymentsSection }        from '@/components/payments/SessionPaymentsSection'

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
  const [saveSheet, { isLoading: isSaving, isSuccess: isSavedOnce }] =
    useSaveAttendanceSheetMutation()

  // Derive group info from the session (backend may populate groupId as object)
  const session      = sessionData?.data.session
  const group        = session && typeof session.groupId === 'object' ? session.groupId : null
  const isPerSession = group?.billingModel === 'per_session'

  // Session payments — only fetched for per-session groups
  const { data: paymentsData } = useGetSessionPaymentsQuery(id, { skip: !isPerSession })
  const sessionPayments        = paymentsData?.data.payments ?? []

  // O(1) lookup: studentId → Payment
  const paymentByStudent = useMemo(() => {
    const map = new Map<string, Payment>()
    sessionPayments.forEach((p) => {
      const sid = typeof p.studentId === 'string' ? p.studentId : p.studentId._id
      map.set(sid, p)
    })
    return map
  }, [sessionPayments])

  // ── Draft attendance ────────────────────────────────────────────────────────
  const [attendance,      setAttendance]      = useState<DraftAttendance[]>([])
  const [attendanceSaved, setAttendanceSaved] = useState(false)

  // Seed draft + detect already-saved attendance
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

    // If any student already has attendance, the sheet was saved before
    setAttendanceSaved(students.some((item) => item.attendance !== null))
  }, [sheetData])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const changeStatus = (studentId: string, status: AttendanceStatus) =>
    setAttendance((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item)),
    )

  const handleSave = async () => {
    try {
      await saveSheet({
        sessionId:  id,
        attendance: attendance.map((item) => ({
          studentId: item.studentId,
          status:    item.status,
          note:      item.note || null,
        })),
      }).unwrap()
      setAttendanceSaved(true)
    } catch (err) {
      console.error(err)
    }
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

  const students = sheetData?.data.students ?? []
  const groupId  = session
    ? (typeof session.groupId === 'string' ? session.groupId : session.groupId._id)
    : ''

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-4" dir="rtl">

      {/* ── Back + session info ── */}
      <div className="space-y-4">
        {session && (
          <Link
            href={`/groups/${groupId}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            العودة للمجموعة
          </Link>
        )}

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
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SESSION_STATUS_STYLES[session.status]}`}>
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
              <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ حفظ الحضور...</>
            ) : (attendanceSaved || isSavedOnce) ? (
              <><CheckCircle className="h-4 w-4" /> تحديث الحضور</>
            ) : (
              `حفظ حضور ${attendance.length} طالب`
            )}
          </button>
        </div>
      </div>

      {/* ── Session payments (per-session groups only, after attendance saved) ── */}
      {isPerSession && attendanceSaved && group && (
        <SessionPaymentsSection
          sessionId={id}
          students={students}
          attendance={attendance}
          paymentByStudent={paymentByStudent}
          pricePerSession={group.pricePerSession ?? 0}
        />
      )}

    </div>
  )
}
