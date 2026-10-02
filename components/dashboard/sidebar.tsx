'use client'

import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarDays,
  WalletCards,
  Receipt,
  Award,
  LineChart,
  Settings,
  Plus,
  Home,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/src/lib/store/hooks'
import { useApp, type AppView } from './app-context'
import { useGetSubscriptionQuery } from '@/src/lib/api/subscriptionApi'
import type { Feature } from '@/src/lib/api/subscriptionApi'
import { FEATURES } from '@/src/constants/features'

const navItems: { id: AppView; label: string; icon: React.ElementType; feature?: Feature }[] = [
  { id: 'dashboard', label: 'لوحة التحكم',  icon: LayoutDashboard },
  { id: 'students',  label: 'الطلاب',        icon: Users           },
  { id: 'groups',    label: 'المجموعات',     icon: Layers          },
  { id: 'sessions',  label: 'الحصص',         icon: CalendarDays    },
  { id: 'payments',  label: 'المدفوعات',     icon: WalletCards     },
  { id: 'expenses',  label: 'المصروفات',     icon: Receipt         },
  { id: 'quizzes',   label: 'الاختبارات',    icon: Award,           feature: FEATURES.QUIZZES },
  { id: 'reports',   label: 'التقارير',      icon: LineChart       },
  { id: 'settings',  label: 'الإعدادات',     icon: Settings        },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose:    () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { setIsQuickAddOpen } = useApp()
  const user     = useAppSelector((state) => state.auth.user)
  const router   = useRouter()
  const pathname = usePathname()

  const { data: subscriptionData } = useGetSubscriptionQuery()
  const subscription = subscriptionData?.data.subscription
  const plan = subscription?.plan ?? 'basic'
  const activeFeatures = subscription?.features ?? []

  const currentView = (pathname.split('/').filter(Boolean)[0] ?? 'dashboard') as AppView

  const go = (view: AppView) => {
    router.push(view === 'landing' ? '/' : view === 'dashboard' ? '/dashboard' : `/${view}`)
    onClose()
  }

  const teacherInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : '؟'
  const teacherName    = user ? `${user.firstName} ${user.lastName}` : '...'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={[
          'flex flex-col w-64 xl:w-72 bg-white border-l border-[#E5E7EB]',
          'px-3.5 pt-5 pb-4 shrink-0',
          'sticky top-0 right-0 h-screen z-40 transition-transform duration-200',
          'lg:translate-x-0 lg:h-screen',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >

        {/* Quick add */}
        <div className="mb-4">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full py-2.5 px-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سريعة</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto" aria-label="القائمة الرئيسية">
          {navItems.map(({ id, label, icon: Icon, feature }) => {
            const isActive = currentView === id
            const locked = feature ? !activeFeatures.includes(feature) : false
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={[
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-[#EAF0FF] text-[#3157D5] font-semibold'
                    : 'text-[#667085] hover:text-[#111827] hover:bg-gray-50 font-medium',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3157D5]' : 'opacity-60'}`} />
                  <span>{label}</span>
                </div>
                {locked && (
                  <span className="bg-[#FEE4E2] text-[#F04438] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-3 pt-3 border-t border-gray-100 mt-2">
          {/* Plan switcher */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-[#667085] mb-2 flex items-center justify-between">
              <span>الاشتراك الحالي:</span>
              <span className="font-bold text-[#3157D5] uppercase">{plan}</span>
            </p>
            <Link
              href="/subscription"
              onClick={onClose}
              className="block w-full text-center bg-[#3157D5] text-white text-xs py-2 rounded-lg font-bold shadow-sm hover:bg-[#243FA3] transition-all"
            >
              {plan === 'basic' ? 'الترقية لـ Pro' : 'إدارة الاشتراك'}
            </Link>
          </div>

          {/* Profile row */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-[#3157D5] text-white font-bold text-xs flex items-center justify-center shrink-0"
              >
                {teacherInitials}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#111827] truncate">{teacherName}</div>
              </div>
            </div>
            <button
              onClick={() => go('settings')}
              aria-label="الإعدادات"
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
