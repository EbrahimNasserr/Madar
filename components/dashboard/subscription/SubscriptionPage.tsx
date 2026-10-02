'use client'

import Link from 'next/link'
import {
  Check,
  Lock,
  Sparkles,
  Crown,
  CalendarClock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import PageSkeleton from '@/components/ui/PageSkeleton'
import { useGetSubscriptionQuery } from '@/src/lib/api/subscriptionApi'
import { FEATURES } from '@/src/constants/features'
import { formatDate } from '@/src/lib/formatters/date'

const FEATURE_ROWS: {
  key: keyof typeof FEATURES
  label: string
  hint: string
  proOnly?: boolean
}[] = [
  { key: 'DASHBOARD',          label: 'لوحة التحكم',     hint: 'ملخص يومك والتنبيهات' },
  { key: 'STUDENTS',           label: 'الطلاب',           hint: 'سجل الطلاب وبياناتهم' },
  { key: 'GROUPS',             label: 'المجموعات',        hint: 'جداول الحصص والرسوم' },
  { key: 'SESSIONS',           label: 'الحصص',            hint: 'تنظيم ومواعيد الحصص' },
  { key: 'ATTENDANCE',         label: 'الحضور',           hint: 'تسجيل الحضور والغياب' },
  { key: 'PAYMENTS',           label: 'المصروفات',        hint: 'متابعة المدفوعات' },
  { key: 'QUIZZES',            label: 'الاختبارات',       hint: 'إنشاء وتصحيح الاختبارات', proOnly: true },
  { key: 'GRADES',             label: 'الدرجات',          hint: 'درجات الطلاب والترتيب', proOnly: true },
  { key: 'ADVANCED_ANALYTICS', label: 'تحليلات متقدمة',   hint: 'مؤشرات أداء تفصيلية', proOnly: true },
]

function statusBadge(status: string) {
  const normalized = status.toLowerCase()
  const styles: Record<string, { label: string; className: string }> = {
    active:   { label: 'نشط',        className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
    trialing: { label: 'فترة تجربة', className: 'bg-[#F3F0FF] text-[#6D5EF5] ring-[#6D5EF5]/25' },
    past_due: { label: 'متأخر',      className: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
    canceled: { label: 'ملغى',       className: 'bg-slate-100 text-slate-600 ring-slate-500/15' },
    inactive: { label: 'غير نشط',    className: 'bg-slate-100 text-slate-600 ring-slate-500/15' },
  }
  return styles[normalized] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  }
}

export function SubscriptionPage() {
  const { data, isLoading, isError, refetch, isFetching } = useGetSubscriptionQuery()

  if (isLoading) {
    return <PageSkeleton cards={3} />
  }

  if (isError || !data?.data.subscription) {
    return (
      <section className="space-y-6 animate-[appear_0.28s_ease-out]" dir="rtl">
        <PageHeader
          eyebrow="الاشتراك"
          title="خطتك الحالية"
          description="تعذّر تحميل بيانات الاشتراك. تحقق من الاتصال وحاول مرة أخرى."
        />
        <div className="rounded-2xl border border-red-100 bg-red-50/80 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-slate-900">لم نتمكن من جلب اشتراكك</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243FA3] disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            إعادة المحاولة
          </button>
        </div>
      </section>
    )
  }

  const subscription = data.data.subscription
  const isPro = subscription.plan === 'pro'
  const { label: statusLabel, className: statusClass } = statusBadge(subscription.status)
  const activeSet = new Set(subscription.features)
  const activeCount = FEATURE_ROWS.filter(({ key }) =>
    activeSet.has(FEATURES[key]),
  ).length

  const { pro } = subscription

  return (
    <section className="space-y-6 animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="الاشتراك"
        title="خطتك الحالية"
        description="تابع خطتك، حالة الاشتراك، والميزات المتاحة لحسابك في مَدار."
        actions={
          !isPro ? (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243FA3]"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              الترقية إلى Pro
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border border-[#6D5EF5]/30 bg-[#F3F0FF] px-4 py-2.5 text-sm font-bold text-[#6D5EF5]">
              <Crown className="h-4 w-4" aria-hidden />
              Pro نشط
            </span>
          )
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">الخطة</p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {isPro ? 'مَدار Pro' : 'مَدار Basic'}
          </p>
          <span
            className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
              isPro
                ? 'bg-[#F3F0FF] text-[#6D5EF5] ring-[#6D5EF5]/25'
                : 'bg-[#EAF0FF] text-[#3157D5] ring-[#3157D5]/20'
            }`}
          >
            {subscription.plan}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">حالة الاشتراك</p>
          <p className="mt-2 text-xl font-bold text-slate-950">{statusLabel}</p>
          <span
            className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusClass}`}
          >
            {subscription.status}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">الميزات المفعّلة</p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {activeCount}
            <span className="text-base font-medium text-slate-400"> / {FEATURE_ROWS.length}</span>
          </p>
          <p className="mt-3 text-xs text-slate-500">حسب ما يرجعه حسابك من الخادم</p>
        </div>
      </div>

      {/* Pro billing / trial notices */}
      {(pro.trialEndsAt || pro.expiresAt || pro.cancelAtPeriodEnd) && (
        <div className="space-y-3">
          {pro.trialEndsAt && (
            <div className="flex gap-3 rounded-2xl border border-[#6D5EF5]/20 bg-[#F3F0FF]/60 p-4 text-sm text-[#4c3d9e]">
              <CalendarClock className="h-5 w-5 shrink-0 text-[#6D5EF5]" aria-hidden />
              <p>
                <span className="font-semibold">تجربة Pro:</span>{' '}
                تنتهي في {formatDate(pro.trialEndsAt)}.
              </p>
            </div>
          )}
          {pro.expiresAt && !pro.trialEndsAt && (
            <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <CalendarClock className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
              <p>
                <span className="font-semibold">تجديد الاشتراك:</span>{' '}
                {formatDate(pro.expiresAt)}.
              </p>
            </div>
          )}
          {pro.cancelAtPeriodEnd && (
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              <p>الاشتراك سيُلغى في نهاية الفترة الحالية ولن يُجدَّد تلقائيًا.</p>
            </div>
          )}
        </div>
      )}

      {/* Plan hero */}
      <div
        className={`overflow-hidden rounded-2xl border bg-white ${
          isPro ? 'border-[#6D5EF5]/25' : 'border-slate-200'
        }`}
      >
        <div
          className={`px-6 py-5 sm:px-8 ${
            isPro
              ? 'bg-gradient-to-l from-[#F3F0FF] to-white'
              : 'bg-gradient-to-l from-[#EAF0FF]/80 to-white'
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {isPro ? 'كل أدوات مَدار بين يديك' : 'أساسيات قوية لإدارة دروسك'}
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                {isPro
                  ? 'الاختبارات، الدرجات، والتحليلات المتقدمة مفعّلة على حسابك.'
                  : 'الطلاب، المجموعات، الحصص، الحضور، والمصروفات — ترقّ إلى Pro للاختبارات والتحليلات.'}
              </p>
            </div>
            {!isPro && (
              <Link
                href="/pricing"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#3157D5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243FA3]"
              >
                مقارنة الخطط والأسعار
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">الميزات حسب خطتك</h3>
            <p className="mt-1 text-sm text-slate-500">
              ما تراه هنا يطابق صلاحيات حسابك الفعلية في التطبيق.
            </p>
          </div>
          {!isPro && (
            <p className="text-xs font-medium text-[#667085]">
              {FEATURE_ROWS.filter((f) => f.proOnly).length} ميزات إضافية في Pro
            </p>
          )}
        </div>

        <ul className="divide-y divide-slate-100">
          {FEATURE_ROWS.map(({ key, label, hint, proOnly }) => {
            const active = activeSet.has(FEATURES[key])
            return (
              <li
                key={key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    aria-hidden
                  >
                    {active ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        active ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
                  </div>
                </div>
                {active ? (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    متاح
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#FEE4E2] px-2.5 py-1 text-[10px] font-bold text-[#F04438]">
                    {proOnly ? 'PRO' : 'غير متاح'}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
