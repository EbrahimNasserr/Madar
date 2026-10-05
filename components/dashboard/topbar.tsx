'use client'

import { useMemo } from 'react'
import { Search, Plus, Clock, Sparkles, Menu } from 'lucide-react'
import NotificationBell from '@/components/layout/NotificationBell'
import { useApp } from './app-context'
import { useGetSubscriptionQuery } from '@/src/lib/api/subscriptionApi'

interface TopbarProps {
  onMenuToggle: () => void
}

/** Format today's date in Arabic — e.g. "الأربعاء، ٢ أكتوبر ٢٠٢٦" */
function useTodayArabic() {
  return useMemo(
    () =>
      new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
        year:    'numeric',
      }).format(new Date()),
    [],
  )
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const {
    setIsQuickAddOpen,
    setIsSearchOpen,
  } = useApp()

  const todayArabic = useTodayArabic()

  // ── Real subscription / plan ──────────────────────────────────────────────
  const { data: subData } = useGetSubscriptionQuery()
  const plan = subData?.data?.subscription.plan ?? 'basic'


  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">

      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#F7F8FC] hover:bg-gray-100 border border-[#E5E7EB] rounded-xl text-xs text-[#667085] cursor-pointer transition-colors"
          aria-label="فتح البحث"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span>بحث عن طالب، مجموعة، أو حصة...</span>
          </div>
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-mono">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Live date badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F8FC] border border-gray-200 text-xs font-semibold text-[#667085]">
          <Clock className="w-3.5 h-3.5 text-[#3157D5]" aria-hidden="true" />
          <span>{todayArabic}</span>
        </div>

        {/* Plan pill — driven by real subscription data */}
        <div
          className={[
            'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold',
            plan === 'pro'
              ? 'bg-[#F3F0FF] text-[#6D5EF5] border border-[#6D5EF5]/30'
              : 'bg-[#EAF0FF] text-[#3157D5] border border-[#3157D5]/20',
          ].join(' ')}
          title={`الخطة الحالية: ${plan === 'pro' ? 'Pro' : 'Basic'}`}
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>خطة {plan === 'pro' ? 'Pro 🚀' : 'Basic'}</span>
        </div>

        {/* Quick add */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#3157D5] hover:bg-[#243FA3] text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>إضافة</span>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          aria-label="فتح القائمة"
        >
          <Menu className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
