'use client'

import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarDays,
  UserCheck,
  WalletCards,
  Award,
  LineChart,
  Settings,
  Plus,
  Home,
  X,
  Menu,
} from 'lucide-react'
import { useApp, type AppView } from './app-context'

const navItems: { id: AppView; label: string; icon: React.ElementType; badge?: 'students' | 'groups'; isPro?: boolean }[] = [
  { id: 'dashboard',  label: 'لوحة التحكم',     icon: LayoutDashboard },
  { id: 'students',   label: 'الطلاب',           icon: Users,        badge: 'students' },
  { id: 'groups',     label: 'المجموعات',        icon: Layers,       badge: 'groups'   },
  { id: 'sessions',   label: 'الحصص',            icon: CalendarDays  },
  { id: 'attendance', label: 'الحضور والغياب',   icon: UserCheck     },
  { id: 'payments',   label: 'المصروفات',        icon: WalletCards   },
  { id: 'quizzes',    label: 'الاختبارات',       icon: Award,        isPro: true       },
  { id: 'reports',    label: 'التقارير',         icon: LineChart      },
  { id: 'settings',   label: 'الإعدادات',        icon: Settings      },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { currentView, setCurrentView, teacher, plan, togglePlan, setIsQuickAddOpen } = useApp()

  const go = (view: AppView) => {
    setCurrentView(view)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'flex flex-col gap-0 w-64 xl:w-72 bg-white border-l border-[#E5E7EB]',
          'px-3.5 pt-5 pb-4 shrink-0',
          'fixed top-0 right-0 h-full z-40 transition-transform duration-200',
          'lg:static lg:translate-x-0 lg:h-screen',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-100 mb-4">
          <button
            onClick={() => go('landing' as AppView)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#3157D5] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-[#243FA3] transition-colors">
              م
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none text-[#111827]">مَـدار</h1>
              <p className="text-[10px] text-[#667085] tracking-widest uppercase mt-0.5 font-semibold">MADAR</p>
            </div>
          </button>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop home shortcut */}
          <button
            onClick={() => go('landing' as AppView)}
            className="hidden lg:flex p-2 rounded-lg text-[#667085] hover:text-[#3157D5] hover:bg-gray-50 transition-colors"
            title="الصفحة الرئيسية"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Quick add */}
        <div className="mb-4">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full py-2.5 px-3 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سريعة</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon     = item.icon
            const isActive = currentView === item.id
            const badge    = item.badge === 'students'
              ? teacher.totalStudents
              : item.badge === 'groups'
              ? teacher.totalGroups
              : undefined

            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={[
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#EAF0FF] text-[#3157D5] font-semibold'
                    : 'text-[#667085] hover:text-[#111827] hover:bg-gray-50 font-medium',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3157D5]' : 'opacity-60'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.isPro && (
                    <span className="bg-[#FEE4E2] text-[#F04438] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                  {badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-600">
                      {badge}
                    </span>
                  )}
                </div>
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
            <button
              onClick={togglePlan}
              className="w-full bg-[#3157D5] text-white text-xs py-2 rounded-lg font-bold shadow-sm hover:bg-[#243FA3] transition-all cursor-pointer"
            >
              {plan === 'basic' ? 'الترقية لـ Pro' : 'التحويل إلى Basic'}
            </button>
          </div>

          {/* Profile row */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#3157D5] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {teacher.name.slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#111827] truncate">{teacher.name}</div>
                <div className="text-[10px] text-[#667085] truncate">{teacher.subject}</div>
              </div>
            </div>
            <button
              onClick={() => go('settings')}
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
