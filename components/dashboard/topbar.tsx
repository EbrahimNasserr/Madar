'use client'

import { useState } from 'react'
import {
  Search,
  Bell,
  Plus,
  Clock,
  Sparkles,
  Home,
  Menu,
} from 'lucide-react'
import { useApp } from './app-context'

interface TopbarProps {
  onMenuToggle: () => void
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const {
    plan,
    togglePlan,
    unreadNotificationCount,
    notifications,
    markNotificationsAsRead,
    setIsQuickAddOpen,
    setIsSearchOpen,
  } = useApp()

  const [isNotifOpen, setIsNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">

      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#F7F8FC] hover:bg-gray-100 border border-[#E5E7EB] rounded-xl text-xs text-[#667085] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span>بحث عن طالب، مجموعة، أو حصة...</span>
          </div>
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-mono">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Date badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F8FC] border border-gray-200 text-xs font-semibold text-[#667085]">
          <Clock className="w-3.5 h-3.5 text-[#3157D5]" />
          <span>الأربعاء، 2 سبتمبر 2026</span>
        </div>

        {/* Plan toggle pill */}
        <button
          onClick={togglePlan}
          className={[
            'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            plan === 'pro'
              ? 'bg-[#F3F0FF] text-[#6D5EF5] border border-[#6D5EF5]/30'
              : 'bg-[#EAF0FF] text-[#3157D5] border border-[#3157D5]/20',
          ].join(' ')}
          title="انقر للتبديل بين تجربة Basic و Pro"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>خطة {plan === 'pro' ? 'Pro 🚀' : 'Basic'}</span>
        </button>

        {/* Quick add */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#3157D5] hover:bg-[#243FA3] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(o => !o)
              if (!isNotifOpen) markNotificationsAsRead()
            }}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative cursor-pointer"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F04438]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <span className="text-xs font-bold text-[#111827]">الإشعارات والتنبيهات</span>
                <span className="text-[10px] text-[#3157D5] font-semibold">كل التنبيهات مقروءة</span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#F7F8FC] border border-gray-100 text-xs">
                    <div className="font-bold text-[#111827] flex items-center justify-between mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[#667085] text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Landing link (mobile) */}
        {/* <button
          onClick={() => setCurrentView('landing' as any)}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <Home className="w-4 h-4" />
        </button> */}

        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
