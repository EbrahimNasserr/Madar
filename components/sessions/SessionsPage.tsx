'use client'

import Link from 'next/link'
import { CalendarDays, ChevronLeft, Loader2 } from 'lucide-react'
import { useGetGroupsQuery } from '@/src/lib/api/groupsApi'
import { useGetGroupSessionsQuery } from '@/src/lib/api/sessionsApi'
import type { Group, Session } from '@/src/lib/api/groupsApi'
import { formatArabicDate } from '@/src/lib/date/formatDate'
import {
  SESSION_STATUS_LABELS,
  SESSION_STATUS_STYLES,
} from '@/src/constants/sessionStatus'

// ─── Single group section ─────────────────────────────────────────────────────

function GroupSessionsSection({ group }: { group: Group }) {
  const { data, isLoading, isError } = useGetGroupSessionsQuery(group._id)
  const sessions = data?.data.sessions ?? []

  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Group header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <Link
            href={`/groups/${group._id}`}
            className="group inline-flex items-center gap-1 font-bold text-slate-900 hover:text-[#3157D5] transition"
          >
            {group.name}
            <ChevronLeft className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">
            {group.subject}
            {group.grade ? ` • ${group.grade}` : ''}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {isLoading ? '...' : `${sessions.length} حصة`}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className="flex items-center gap-2 p-5 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            جارٍ التحميل...
          </div>
        ) : isError ? (
          <div className="p-5 text-sm text-red-500">تعذر تحميل الحصص.</div>
        ) : sessions.length === 0 ? (
          <div className="p-5 text-sm text-slate-400">لا توجد حصص لهذه المجموعة بعد.</div>
        ) : (
          sessions.map((session) => (
            <SessionItem key={session._id} session={session} />
          ))
        )}
      </div>
    </section>
  )
}

// ─── Single session row ───────────────────────────────────────────────────────

function SessionItem({ session }: { session: Session }) {
  const groupId =
    typeof session.groupId === 'string' ? session.groupId : session.groupId._id

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900">
            {formatArabicDate(session.sessionDate)}
          </p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SESSION_STATUS_STYLES[session.status]}`}
          >
            {SESSION_STATUS_LABELS[session.status]}
          </span>
        </div>
        <p dir="ltr" className="mt-1 text-sm text-slate-400">
          {session.startTime} → {session.endTime}
        </p>
        {session.notes && (
          <p className="mt-1 truncate text-xs text-slate-400">{session.notes}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {session.status !== 'cancelled' && (
          <Link
            href={`/sessions/${session._id}/attendance`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            تسجيل الحضور
          </Link>
        )}
        <Link
          href={`/groups/${groupId}`}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          المجموعة
        </Link>
      </div>
    </div>
  )
}

// ─── Page root ────────────────────────────────────────────────────────────────

export function SessionsPage() {
  const { data, isLoading, isError, refetch } = useGetGroupsQuery()
  const groups = data?.data.groups ?? []
  const activeGroups = groups.filter((g) => g.status === 'active')

  return (
    <div className="space-y-6 p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-[#3157D5] tracking-wide uppercase mb-1">
          إدارة الحصص
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          الحصص
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          عرض الحصص مرتبة حسب كل مجموعة.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-900">تعذر تحميل المجموعات</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && activeGroups.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-900">لا توجد مجموعات نشطة</p>
          <p className="mt-1 text-sm text-slate-500">
            أنشئ مجموعة أولاً ثم أضف حصصها من صفحة تفاصيل المجموعة.
          </p>
          <Link
            href="/groups"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] transition"
          >
            إدارة المجموعات
          </Link>
        </div>
      )}

      {/* Group sections */}
      {!isLoading &&
        !isError &&
        activeGroups.map((group) => (
          <GroupSessionsSection key={group._id} group={group} />
        ))}
    </div>
  )
}
