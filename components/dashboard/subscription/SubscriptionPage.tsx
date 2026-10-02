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
  X,
  ArrowLeft,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import PageSkeleton from '@/components/ui/PageSkeleton'
import { useGetSubscriptionQuery } from '@/src/lib/api/subscriptionApi'
import { FEATURES } from '@/src/constants/features'
import { formatArabicDateShort } from '@/src/lib/date/formatDate'

// ─── Feature rows ─────────────────────────────────────────────────────────────

const FEATURE_ROWS: {
  key: keyof typeof FEATURES
  label: string
  hint: string
  proOnly?: boolean
}[] = [
  { key: 'DASHBOARD',          label: 'لوحة التحكم',   hint: 'ملخص يومك والتنبيهات' },
  { key: 'STUDENTS',           label: 'الطلاب',         hint: 'سجل الطلاب وبياناتهم' },
  { key: 'GROUPS',             label: 'المجموعات',      hint: 'جداول الحصص والرسوم' },
  { key: 'SESSIONS',           label: 'الحصص',          hint: 'تنظيم ومواعيد الحصص' },
  { key: 'ATTENDANCE',         label: 'الحضور',         hint: 'تسجيل الحضور والغياب' },
  { key: 'PAYMENTS',           label: 'المصروفات',      hint: 'متابعة المدفوعات' },
  { key: 'QUIZZES',            label: 'الاختبارات',     hint: 'إنشاء وتصحيح الاختبارات', proOnly: true },
  { key: 'GRADES',             label: 'الدرجات',        hint: 'درجات الطلاب والترتيب', proOnly: true },
  { key: 'ADVANCED_ANALYTICS', label: 'تحليلات متقدمة', hint: 'مؤشرات أداء تفصيلية', proOnly: true },
]

const BASIC_FEATURES = [
  'إدارة الطلاب والبيانات',
  'المجموعات والجداول',
  'الحصص والمواعيد',
  'تسجيل الحضور والغياب',
  'متابعة المصروفات والمدفوعات',
  'التقارير الأساسية',
]

const PRO_FEATURES = [
  'كل مميزات Basic',
  'إنشاء الاختبارات والكويزات',
  'رصد الدرجات وترتيب الأوائل',
  'تحليل نسب النجاح عبر الزمن',
  'تقارير متقدمة لأولياء الأمور',
  'دعم فني مخصص وأولوية في التحديثات',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function urgencyClass(days: number) {
  if (days <= 1)  return 'border-red-300 bg-red-50 text-red-900'
  if (days <= 3)  return 'border-amber-300 bg-amber-50 text-amber-900'
  return 'border-[#6D5EF5]/25 bg-[#F3F0FF]/70 text-[#3d2f9e]'
}

// ─── Trial Plan Card ──────────────────────────────────────────────────────────

function PlanCard({
  tier,
  price,
  features,
  href,
  highlighted,
}: {
  tier: 'basic' | 'pro'
  price: number
  features: string[]
  href: string
  highlighted?: boolean
}) {
  const isBasic = tier === 'basic'

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
        highlighted
          ? 'border-[#3157D5] shadow-lg shadow-[#3157D5]/10'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-l from-[#3157D5] to-[#6D5EF5] px-3 py-0.5 text-[11px] font-black text-white shadow">
          الأكثر قيمة
        </span>
      )}

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isBasic ? 'الخطة الأساسية' : 'باقة المحترفين'}
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">
            {price.toLocaleString('ar-EG')}{' '}
            <span className="text-sm font-semibold text-slate-500">ج.م / شهر</span>
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${
            isBasic
              ? 'bg-slate-100 text-slate-600'
              : 'bg-[#EAF0FF] text-[#3157D5]'
          }`}
        >
          {isBasic ? 'Basic' : 'Pro'}
        </span>
      </div>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                isBasic ? 'bg-emerald-100 text-emerald-600' : 'bg-[#EAF0FF] text-[#3157D5]'
              }`}
            >
              <Check className="h-2.5 w-2.5" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={href}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
          highlighted
            ? 'bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/20 hover:bg-[#243FA3]'
            : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
        }`}
      >
        {isBasic ? 'اشترك في Basic' : (
          <>
            <span>اشترك في Pro</span>
            <ArrowLeft className="h-4 w-4" />
          </>
        )}
      </Link>
    </div>
  )
}

// ─── Trial Mode View ──────────────────────────────────────────────────────────

function TrialView({ trialEndsAt }: { trialEndsAt: string }) {
  const days = daysUntil(trialEndsAt)

  return (
    <section className="space-y-8 animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="الاشتراك"
        title="تجربتك المجانية"
        description="أنت حاليًا تستطيع استخدام كل مميزات Pro. اختر الباقة التي تريد الاستمرار بها."
      />

      {/* Trial status card */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${urgencyClass(days)}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-6 w-6 shrink-0 text-[#6D5EF5]" aria-hidden />
            <div>
              <p className="text-base font-bold">Madar Pro Trial</p>
              <p className="mt-0.5 text-sm">
                {days <= 1
                  ? 'تنتهي تجربتك اليوم — اشترك الآن للاستمرار بدون توقف.'
                  : days <= 3
                  ? `تنتهي تجربتك خلال ${days} أيام — اختر باقتك للاستمرار.`
                  : `تنتهي في ${formatArabicDateShort(trialEndsAt)}`}
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-white/60 px-4 py-2 text-center shadow-sm backdrop-blur-sm">
            <p className="text-2xl font-black">{days}</p>
            <p className="text-xs font-semibold">يوم متبقي</p>
          </div>
        </div>
      </div>

      {/* Plan picker */}
      <div>
        <p className="mb-4 text-sm font-semibold text-slate-600">
          اختر الباقة التي تريد الاستمرار بها:
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <PlanCard
            tier="basic"
            price={199}
            features={BASIC_FEATURES}
            href="/checkout?plan=basic"
          />
          <PlanCard
            tier="pro"
            price={349}
            features={PRO_FEATURES}
            href="/checkout?plan=pro"
            highlighted
          />
        </div>
      </div>
    </section>
  )
}

// ─── Expired Trial View ───────────────────────────────────────────────────────

function ExpiredView() {
  return (
    <section className="space-y-8 animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="الاشتراك"
        title="انتهت تجربتك المجانية"
        description="بياناتك محفوظة ولن يتم حذفها. اختر باقة للاستمرار في استخدام مَدار."
      />

      {/* Safety notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
        <p>
          <span className="font-bold">بياناتك محفوظة.</span>{' '}
          كل طلابك ومجموعاتك وسجلاتك موجودة وجاهزة بمجرد ما تختار باقتك.
        </p>
      </div>

      {/* Plan picker */}
      <div className="grid gap-5 sm:grid-cols-2">
        <PlanCard
          tier="basic"
          price={199}
          features={BASIC_FEATURES}
          href="/checkout?plan=basic"
        />
        <PlanCard
          tier="pro"
          price={349}
          features={PRO_FEATURES}
          href="/checkout?plan=pro"
          highlighted
        />
      </div>
    </section>
  )
}

// ─── Active Subscription View ─────────────────────────────────────────────────

function ActiveView() {
  const { data, isLoading, isError, refetch, isFetching } = useGetSubscriptionQuery()

  if (isLoading) return <PageSkeleton cards={3} />

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
  const activeSet = new Set(subscription.features)

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

      {/* Billing notices */}
      {subscription.cancelAtPeriodEnd && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <p>الاشتراك سيُلغى في نهاية الفترة الحالية ولن يُجدَّد تلقائيًا.</p>
        </div>
      )}
      {subscription.currentPeriod.endsAt && (
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <CalendarClock className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
          <p>
            <span className="font-semibold">تجديد الاشتراك:</span>{' '}
            {formatArabicDateShort(subscription.currentPeriod.endsAt)}.
          </p>
        </div>
      )}

      {/* Features table */}
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
                      active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}
                    aria-hidden
                  >
                    {active ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-400'}`}>
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

// ─── Root export ──────────────────────────────────────────────────────────────

export function SubscriptionPage() {
  const { data, isLoading } = useGetSubscriptionQuery()

  if (isLoading) return <PageSkeleton cards={3} />

  const subscription = data?.data.subscription
  const status = subscription?.status?.toLowerCase()
  const trialEndsAt = subscription?.trial?.endsAt

  // Active trial
  if (status === 'trial' && subscription?.trial?.active && trialEndsAt) {
    const days = daysUntil(trialEndsAt)
    if (days > 0) return <TrialView trialEndsAt={trialEndsAt} />
    return <ExpiredView />
  }

  // Expired trial
  if (
    (status === 'inactive' || status === 'canceled') &&
    subscription?.plan === 'basic' &&
    trialEndsAt
  ) {
    return <ExpiredView />
  }

  // Normal active subscription
  return <ActiveView />
}
