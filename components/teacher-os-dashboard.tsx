'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CalendarDays, WalletCards, Menu, X, UserCheck, Layers, Award, LineChart, Settings, Home } from 'lucide-react'

import { AppProvider, useApp, type AppView } from '@/components/dashboard/app-context'
import { Sidebar }        from '@/components/dashboard/sidebar'
import { Topbar }         from '@/components/dashboard/topbar'
import { QuickAddModal }  from '@/components/dashboard/quick-add-modal'
import { StudentsPage }   from '@/components/dashboard/pages/students-page'
import { GroupsPage }     from '@/components/dashboard/pages/groups-page'
import { PaymentsPage }   from '@/components/dashboard/pages/payments-page'
import { SessionsPage }   from '@/components/sessions/SessionsPage'
import { QuizzesPage, ProGate } from '@/components/dashboard/pages/quizzes-page'
import { SimplePage }     from '@/components/dashboard/pages/simple-page'
import type { PageKey }   from '@/components/dashboard/types'

const IS_PRO = false

// Known top-level page segments that the shell renders internally
const KNOWN_PAGES = ['dashboard', 'attendance', 'students', 'groups', 'payments', 'quizzes', 'sessions', 'reports', 'settings'] as const

// ─── Inner shell (needs context) ─────────────────────────────────────────────

function DashboardShell({ children }: { children?: React.ReactNode }) {
  const { plan } = useApp()
  const router   = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Derive the active page from the URL segment (e.g. /students → 'students', /dashboard → 'dashboard')
  // Derive page key from the first path segment.
  // If there are sub-segments (nested routes like /groups/[id] or /sessions/[id]/attendance),
  // we treat it as a child route and render the passed children prop instead.
  const segments   = pathname.split('/').filter(Boolean)
  const segment    = segments[0] ?? 'dashboard'
  const pageKey    = (segment === '' ? 'dashboard' : segment) as PageKey
  const isNested   = segments.length > 1   // e.g. /groups/abc or /sessions/abc/attendance

  const go = (view: AppView) => {
    router.push(view === 'landing' ? '/' : view === 'dashboard' ? '/dashboard' : `/${view}`)
  }

  const mobileNavItems = [
    { id: 'dashboard'  as AppView, label: 'الرئيسية',    icon: LayoutDashboard },
    { id: 'students'   as AppView, label: 'الطلاب',       icon: Users           },
    { id: 'sessions'   as AppView, label: 'الحصص',        icon: CalendarDays    },
    { id: 'payments'   as AppView, label: 'المصروفات',    icon: WalletCards     },
  ]

  return (
    <div className="flex min-h-screen bg-[#F7F8FC] text-[#111827]" dir="rtl">

      {/* Sidebar — owns mobile overlay internally */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 pb-20 lg:pb-8">
        <Topbar onMenuToggle={() => setMobileOpen(o => !o)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Known top-level pages — only when not a nested route */}
          {!isNested && pageKey === 'students'   && <StudentsPage />}
          {!isNested && pageKey === 'groups'     && <GroupsPage />}
          {!isNested && pageKey === 'payments'   && <PaymentsPage />}
          {!isNested && pageKey === 'sessions'   && <SessionsPage />}
          {!isNested && pageKey === 'quizzes'    && (IS_PRO || plan === 'pro' ? <QuizzesPage /> : <ProGate />)}
          {!isNested && (['reports', 'settings'] as PageKey[]).includes(pageKey) && (
            <SimplePage page={pageKey} />
          )}
          {/* dashboard + nested/dynamic routes — render passed children */}
          {(pageKey === 'dashboard' || isNested || !KNOWN_PAGES.includes(pageKey as typeof KNOWN_PAGES[number])) && children}
        </main>
      </div>

      {/* Global modals */}
      <QuickAddModal />

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 flex bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 items-center justify-around shadow-lg z-40">
        {mobileNavItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
              pageKey === id ? 'text-[#3157D5]' : 'text-[#667085]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{label}</span>
          </button>
        ))}

        {/* More drawer trigger */}
        <MobileMoreButton />
      </nav>

      {/* Save toast */}
    </div>
  )
}

// ─── Mobile "More" drawer ─────────────────────────────────────────────────────

function MobileMoreButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const go = (view: AppView) => {
    router.push(view === 'landing' ? '/' : view === 'dashboard' ? '/dashboard' : `/${view}`)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold text-[#667085]"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>المزيد</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center lg:hidden">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-base text-[#111827]">جميع أقسام مَـدار</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { view: 'attendance' as AppView, icon: UserCheck, label: 'الحضور والغياب',  sub: 'حضور الكل والسرعة',   bg: 'bg-[#F7F8FC]', border: 'border-gray-200',         iconColor: 'text-[#3157D5]' },
                { view: 'groups'     as AppView, icon: Layers,    label: 'المجموعات',        sub: 'السناتر والجداول',    bg: 'bg-[#F7F8FC]', border: 'border-gray-200',         iconColor: 'text-[#6D5EF5]' },
                { view: 'quizzes'    as AppView, icon: Award,     label: 'الاختبارات',       sub: 'الدرجات والترتيب',   bg: 'bg-[#F3F0FF]', border: 'border-[#6D5EF5]/30',    iconColor: 'text-[#6D5EF5]', isPro: true },
                { view: 'reports'    as AppView, icon: LineChart, label: 'التقارير',         sub: 'المؤشرات والإحصاءات', bg: 'bg-[#F7F8FC]', border: 'border-gray-200',         iconColor: 'text-[#12B76A]' },
              ].map(({ view, icon: Icon, label, sub, bg, border, iconColor, isPro }) => (
                <button
                  key={view}
                  onClick={() => go(view)}
                  className={`p-3.5 rounded-2xl ${bg} border ${border} text-right flex flex-col gap-1`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#111827]">{label}</span>
                    {isPro && (
                      <span className="text-[9px] font-black bg-[#6D5EF5] text-white px-1 rounded">PRO</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500">{sub}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => go('settings')}
                className="w-full py-2.5 bg-gray-100 rounded-xl text-xs font-bold text-[#111827] flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>الإعدادات والملف الشخصي</span>
              </button>
              <button
                onClick={() => { router.push('/'); setOpen(false) }}
                className="w-full py-2.5 bg-[#EAF0FF] text-[#3157D5] rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>العودة لصفحة الموقع</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Root export (wraps with provider) ───────────────────────────────────────

export default function MadarDashboard({ children }: { children?: React.ReactNode }) {
  return (
    <AppProvider>
      <DashboardShell>{children}</DashboardShell>
    </AppProvider>
  )
}
