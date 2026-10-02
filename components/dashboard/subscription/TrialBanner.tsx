'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'
import { useGetSubscriptionQuery } from '@/src/lib/api/subscriptionApi'

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function TrialBanner() {
  const [dismissed, setDismissed] = useState(false)
  const { data } = useGetSubscriptionQuery()

  if (dismissed) return null

  const subscription = data?.data.subscription
  const status = subscription?.status?.toLowerCase()
  const trialEndsAt = subscription?.trial?.endsAt

  // Only show during active trial
  if (status !== 'trial' || !subscription?.trial?.active || !trialEndsAt) return null

  const days = daysUntil(trialEndsAt)
  if (days === 0) return null

  const isLastDay = days === 1
  const isUrgent  = days <= 3

  const bg = isLastDay
    ? 'bg-red-600'
    : isUrgent
    ? 'bg-amber-500'
    : 'bg-gradient-to-l from-[#3157D5] to-[#6D5EF5]'

  const message = isLastDay
    ? 'تنتهي تجربتك اليوم — اشترك الآن للاستمرار بدون انقطاع.'
    : isUrgent
    ? `تنتهي تجربتك خلال ${days} أيام — اختر باقتك للاستمرار بدون توقف.`
    : `🎉 أنت في الفترة التجريبية لـ Madar Pro — متبقي ${days} ${days === 1 ? 'يوم' : 'أيام'}`

  const ctaLabel = isLastDay ? 'اشترك الآن' : 'اختر باقتك'

  return (
    <div
      className={`${bg} text-white`}
      role="status"
      aria-live="polite"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Message */}
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          <p className="truncate">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/subscription"
            className="rounded-lg bg-white/20 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="إخفاء الإشعار"
            className="rounded-md p-0.5 opacity-70 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
