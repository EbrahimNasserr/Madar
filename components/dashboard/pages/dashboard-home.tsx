'use client'

import {
  Clock,
  Users,
  CalendarDays,
  Wallet,
  UserCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  Radio,
  Layers,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '../app-context'

export function DashboardHome() {
  const router = useRouter()
  const {
    teacher,
    todaySessions,
    startAttendanceForSession,
    expectedMonthlyRevenue,
    collectedMonthlyRevenue,
    remainingMonthlyRevenue,
    collectionPercentage,
    unpaidStudentsCount,
    activities,
    setIsQuickAddOpen,
  } = useApp()

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* 1. GREETING & HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            مساء الخير، {teacher.name} 👋
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            إليك ملخص سريع لأداء اليوم والحصص القادمة • الأربعاء، 2 سبتمبر 2026
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => router.push('/attendance')}
            className="px-4 py-2 bg-white border border-gray-200 text-[#111827] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            تسجيل سريع
          </button>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-4 py-2 bg-[#3157D5] hover:bg-[#243FA3] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طالب / دفعة</span>
          </button>
        </div>
      </div>

      {/* 2. QUICK STATS METRIC CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667085] mb-2">
            <span>إجمالي الطلاب</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF0FF] flex items-center justify-center text-[#3157D5]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827]">{teacher.totalStudents}</div>
          <div className="text-xs text-[#12B76A] mt-1 font-medium">
            ● {teacher.totalGroups} مجموعات نشطة
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667085] mb-2">
            <span>حصص اليوم</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3F0FF] flex items-center justify-center text-[#6D5EF5]">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827]">{todaySessions.length} حصص</div>
          <div className="text-xs text-[#3157D5] mt-1 font-medium">
            ● {todaySessions.filter(s => s.status === 'live').length} جارية الآن
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667085] mb-2">
            <span>نسبة الحضور</span>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF3] flex items-center justify-center text-[#12B76A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827]">94%</div>
          <div className="text-xs text-[#12B76A] mt-1 font-medium">
            +2.5% عن الشهر الماضي
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667085] mb-2">
            <span>التحصيل المالي</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFAEB] flex items-center justify-center text-[#F79009]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827]">
            {collectedMonthlyRevenue.toLocaleString()}{' '}
            <span className="text-xs font-normal text-[#667085]">ج.م</span>
          </div>
          <div className="text-xs text-[#667085] mt-1 font-medium">
            من أصل {expectedMonthlyRevenue.toLocaleString()} ج.م
          </div>
        </div>
      </section>

      {/* 3. TODAY'S SESSIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3157D5] animate-pulse" />
            <h2 className="text-xl font-bold text-[#111827]">حصص اليوم</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EAF0FF] text-[#3157D5]">
              {todaySessions.length} حصص
            </span>
          </div>
          <button
            onClick={() => router.push('/sessions')}
            className="text-xs font-bold text-[#3157D5] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض كل جدول الحصص</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {todaySessions.map((sess) => {
            const isLive      = sess.status === 'live'
            const isCompleted = sess.status === 'completed'
            const isUpcoming  = sess.status === 'upcoming'

            return (
              <div
                key={sess.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isLive
                    ? 'border-[#3157D5] ring-2 ring-[#3157D5]/20 shadow-md'
                    : isCompleted
                    ? 'border-[#E5E7EB] bg-gray-50/50'
                    : 'border-[#E5E7EB] hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Status & time row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-[#EAF0FF] text-[#3157D5] text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {sess.time}
                      </span>

                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF3] text-[#12B76A] text-[11px] font-bold">
                          <Radio className="w-3 h-3 animate-pulse" />
                          جارية الآن
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-[#12B76A]" />
                          مكتملة
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFAEB] text-[#F79009] text-[11px] font-bold">
                          قادمة
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#667085] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#3157D5]" />
                      {sess.totalStudents} طالب
                    </span>
                  </div>

                  {/* Group & subject */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#111827]">
                      {sess.subject} — {sess.grade}
                    </h3>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {sess.groupName}{sess.room ? ` • ${sess.room}` : ''}
                    </p>
                    {sess.topic && (
                      <p className="text-xs text-[#3157D5] font-medium mt-1 bg-[#F7F8FC] p-2 rounded-lg border border-gray-100">
                        📌 موضوع الحصة: {sess.topic}
                      </p>
                    )}
                  </div>

                  {/* Attendance metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-[#F7F8FC] p-3 rounded-2xl border border-gray-200 mb-5">
                    <div className="text-center">
                      <div className="text-xs text-[#667085]">حاضر</div>
                      <div className="text-base font-bold text-[#12B76A]">
                        {sess.isAttendanceSaved ? sess.presentCount : '—'}
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="text-xs text-[#667085]">غائب</div>
                      <div className="text-base font-bold text-[#F04438]">
                        {sess.isAttendanceSaved ? sess.absentCount : '—'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#667085]">متأخر</div>
                      <div className="text-base font-bold text-[#F79009]">
                        {sess.isAttendanceSaved ? sess.lateCount : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => startAttendanceForSession(sess.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-white hover:bg-gray-50 text-[#111827] border border-gray-200'
                      : 'bg-[#3157D5] hover:bg-[#243FA3] text-white shadow-sm'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {sess.isAttendanceSaved ? 'تعديل أو مراجعة الحضور' : 'تسجيل الحضور والغياب'}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. ATTENDANCE & PAYMENT ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Attendance trend */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-[#111827]">مؤشر الحضور الشهري</h3>
              <p className="text-xs text-[#667085]">متوسط الحضور عبر جميع المجموعات</p>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-[#12B76A]">92%</span>
              <span className="text-xs text-[#667085] block">نسبة الحضور</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'الأسبوع 1 (1 - 7 أغسطس)',    pct: 95, late: 0, absent: 5 },
              { label: 'الأسبوع 2 (8 - 14 أغسطس)',   pct: 91, late: 4, absent: 5 },
              { label: 'الأسبوع 3 (15 - 21 أغسطس)',  pct: 89, late: 3, absent: 8 },
              { label: 'الأسبوع 4 (22 - 28 أغسطس)',  pct: 93, late: 0, absent: 7 },
            ].map(({ label, pct, late, absent }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-[#667085] mb-1">
                  <span>{label}</span>
                  <span className="font-bold text-[#111827]">{pct}% حضور</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-[#12B76A] h-full" style={{ width: `${pct}%` }} />
                  {late > 0 && <div className="bg-[#F79009] h-full" style={{ width: `${late}%` }} />}
                  <div className="bg-[#F04438] h-full" style={{ width: `${absent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-[#667085]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12B76A]" /> حاضر (92%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F04438]" /> غائب (6%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F79009]" /> متأخر (2%)
            </span>
          </div>
        </div>

        {/* Payment overview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#111827]">موقف التحصيل المالي</h3>
                <p className="text-xs text-[#667085]">سبتمبر 2026</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#ECFDF3] text-[#12B76A] text-xs font-bold">
                {collectionPercentage}% تم التحصيل
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-[#F7F8FC] p-3 rounded-xl border border-gray-200">
                <div className="text-[11px] text-[#667085]">المتوقع</div>
                <div className="text-base font-bold text-[#111827]">{expectedMonthlyRevenue.toLocaleString()} ج.م</div>
              </div>
              <div className="bg-[#ECFDF3] p-3 rounded-xl border border-[#A6F4C5]">
                <div className="text-[11px] text-[#12B76A]">المحصل</div>
                <div className="text-base font-bold text-[#12B76A]">{collectedMonthlyRevenue.toLocaleString()} ج.م</div>
              </div>
              <div className="bg-[#FEF3F2] p-3 rounded-xl border border-[#FECDCA]">
                <div className="text-[11px] text-[#F04438]">متبقي</div>
                <div className="text-base font-bold text-[#F04438]">{remainingMonthlyRevenue.toLocaleString()} ج.م</div>
              </div>
            </div>

            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#12B76A] rounded-full transition-all duration-500"
                style={{ width: `${collectionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 bg-[#FFFDF5] rounded-xl border border-[#FDE8BE] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F79009] shrink-0" />
              <span className="font-bold text-[#111827]">
                {unpaidStudentsCount} طلاب عليهم مستحقات مالية معلقة
              </span>
            </div>
            <button
              onClick={() => router.push('/payments')}
              className="font-bold text-[#3157D5] hover:underline cursor-pointer"
            >
              عرض المصروفات ←
            </button>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent activity */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#111827]">آخر النشاطات</h3>
            <span className="text-xs text-[#667085]">تحديث حي وتلقائي</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs hover:bg-gray-100/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                    {act.type === 'attendance' && <UserCheck className="w-4 h-4 text-[#12B76A]" />}
                    {act.type === 'payment'    && <Wallet    className="w-4 h-4 text-[#F79009]" />}
                    {act.type === 'group'      && <Layers    className="w-4 h-4 text-[#3157D5]" />}
                    {act.type === 'quiz'       && <Award     className="w-4 h-4 text-[#6D5EF5]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827]">{act.title}</h4>
                    <p className="text-[#667085] mt-0.5">{act.description}</p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 font-medium shrink-0 mr-2">
                  {act.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + Pro card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#111827] border-b border-gray-100 pb-3">
              إجراءات سريعة
            </h3>
            <div className="space-y-2">
              {[
                { label: '+ إضافة طالب جديد',       action: () => setIsQuickAddOpen(true) },
                { label: '+ إنشاء مجموعة جديدة',     action: () => setIsQuickAddOpen(true) },
                { label: '⚡ تسجيل حضور سريع',       action: () => router.push('/attendance') },
                { label: '💵 تسجيل دفعة مالية',      action: () => router.push('/payments') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full p-2.5 bg-gray-50 hover:bg-[#EAF0FF] hover:text-[#3157D5] rounded-lg border border-gray-200 text-right text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{label}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Pro promo card */}
          <div className="bg-gradient-to-br from-[#3157D5] to-[#6D5EF5] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-3">
              مَـدار PRO
            </span>
            <h4 className="text-lg font-bold mb-1">وفّر ساعات من شغلك كل أسبوع</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              إرسال تقارير واتساب تلقائية لأولياء الأمور، وإدارة الكويزات الذكية وترتيب الأوائل.
            </p>
            <button
              onClick={() => router.push('/quizzes')}
              className="w-full bg-white text-[#3157D5] hover:bg-white/90 text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              استكشف مزايا Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
