'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PageKey } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppView = PageKey | 'landing'

export interface Session {
  id: string
  time: string
  subject: string
  grade: string
  groupName: string
  room?: string
  topic?: string
  totalStudents: number
  status: 'live' | 'completed' | 'upcoming'
  isAttendanceSaved: boolean
  presentCount: number
  absentCount: number
  lateCount: number
}

export interface Activity {
  id: string
  type: 'attendance' | 'payment' | 'group' | 'quiz'
  title: string
  description: string
  timeAgo: string
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export interface Teacher {
  name: string
  subject: string
  email: string
  totalStudents: number
  totalGroups: number
}

interface AppContextValue {
  // Navigation
  currentView: AppView
  setCurrentView: (view: AppView) => void

  // Teacher info
  teacher: Teacher

  // Sessions
  todaySessions: Session[]
  startAttendanceForSession: (id: string) => void

  // Financial
  expectedMonthlyRevenue: number
  collectedMonthlyRevenue: number
  remainingMonthlyRevenue: number
  collectionPercentage: number
  unpaidStudentsCount: number

  // Activities
  activities: Activity[]

  // Notifications
  notifications: Notification[]
  unreadNotificationCount: number
  markNotificationsAsRead: () => void

  // UI state
  isQuickAddOpen: boolean
  setIsQuickAddOpen: (open: boolean) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void

  // Plan
  plan: 'basic' | 'pro'
  togglePlan: () => void
}

// ─── Default / seed data ──────────────────────────────────────────────────────

const DEFAULT_TEACHER: Teacher = {
  name: 'أحمد محمد',
  subject: 'رياضيات',
  email: 'ahmed@teacher.os',
  totalStudents: 124,
  totalGroups: 8,
}

const DEFAULT_SESSIONS: Session[] = [
  {
    id: 'sess-1',
    time: '٤:٠٠ م',
    subject: 'رياضيات',
    grade: 'الصف الثالث الثانوي',
    groupName: 'مجموعة الثلاثاء أ',
    room: 'قاعة ١',
    topic: 'التفاضل والتكامل — المشتقات',
    totalStudents: 28,
    status: 'live',
    isAttendanceSaved: false,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  },
  {
    id: 'sess-2',
    time: '٦:٠٠ م',
    subject: 'رياضيات',
    grade: 'الصف الثاني الثانوي',
    groupName: 'مجموعة الثلاثاء ب',
    room: 'قاعة ٢',
    topic: 'الجبر — المعادلات التربيعية',
    totalStudents: 22,
    status: 'upcoming',
    isAttendanceSaved: false,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  },
  {
    id: 'sess-3',
    time: '٢:٠٠ م',
    subject: 'رياضيات',
    grade: 'الصف الأول الثانوي',
    groupName: 'مجموعة الثلاثاء ج',
    totalStudents: 30,
    status: 'completed',
    isAttendanceSaved: true,
    presentCount: 26,
    absentCount: 3,
    lateCount: 1,
  },
  {
    id: 'sess-4',
    time: '٨:٠٠ م',
    subject: 'فيزياء',
    grade: 'الصف الثالث الثانوي',
    groupName: 'مجموعة المساء',
    room: 'قاعة ٣',
    totalStudents: 18,
    status: 'upcoming',
    isAttendanceSaved: false,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  },
]

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'attendance',
    title: 'تم تسجيل حضور مجموعة الثلاثاء ج',
    description: 'الصف الأول الثانوي — ٢٦ حاضر، ٣ غائب، ١ متأخر',
    timeAgo: 'منذ ٤٥ دقيقة',
  },
  {
    id: 'act-2',
    type: 'payment',
    title: 'تم استلام دفعة من أحمد محمود',
    description: '٥٠٠ ج.م — مجموعة الثلاثاء أ',
    timeAgo: 'منذ ساعة',
  },
  {
    id: 'act-3',
    type: 'payment',
    title: 'تم استلام دفعة من مريم حسن',
    description: '٥٠٠ ج.م — مجموعة الثلاثاء ب',
    timeAgo: 'منذ ساعتين',
  },
  {
    id: 'act-4',
    type: 'group',
    title: 'تم إضافة طالب جديد',
    description: 'يوسف عمر — مجموعة المساء',
    timeAgo: 'منذ ٣ ساعات',
  },
  {
    id: 'act-5',
    type: 'quiz',
    title: 'نتائج اختبار الجبر',
    description: 'متوسط الدرجات: ٧٨٪ — مجموعة الثلاثاء ب',
    timeAgo: 'أمس',
  },
  {
    id: 'act-6',
    type: 'attendance',
    title: 'تم تسجيل حضور مجموعة الإثنين أ',
    description: 'الصف الثاني الثانوي — ٢٠ حاضر، ٢ غائب',
    timeAgo: 'أمس',
  },
]

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: '٧ طلاب لم يدفعوا بعد',
    message: 'تذكير: موعد سداد شهر سبتمبر ينتهي هذا الأسبوع.',
    time: 'منذ ١٠ دقائق',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'حصة جديدة بدأت',
    message: 'مجموعة الثلاثاء أ — رياضيات ٤:٠٠ م جارية الآن.',
    time: 'منذ ٣٠ دقيقة',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'تم إضافة طالب جديد',
    message: 'يوسف عمر انضم لمجموعة المساء بنجاح.',
    time: 'منذ ٣ ساعات',
    read: true,
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [sessions, setSessions] = useState<Session[]>(DEFAULT_SESSIONS)
  const [plan, setPlan] = useState<'basic' | 'pro'>('basic')
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS)

  const expectedMonthlyRevenue = 56000
  const collectedMonthlyRevenue = 48500
  const remainingMonthlyRevenue = expectedMonthlyRevenue - collectedMonthlyRevenue
  const collectionPercentage = Math.round((collectedMonthlyRevenue / expectedMonthlyRevenue) * 100)
  const unpaidStudentsCount = 7

  const unreadNotificationCount = notifications.filter(n => !n.read).length

  const markNotificationsAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const startAttendanceForSession = (id: string) => {
    setCurrentView('attendance')
  }

  const togglePlan = () =>
    setPlan(prev => (prev === 'basic' ? 'pro' : 'basic'))

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        teacher: DEFAULT_TEACHER,
        todaySessions: sessions,
        startAttendanceForSession,
        expectedMonthlyRevenue,
        collectedMonthlyRevenue,
        remainingMonthlyRevenue,
        collectionPercentage,
        unpaidStudentsCount,
        activities: DEFAULT_ACTIVITIES,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isSearchOpen,
        setIsSearchOpen,
        plan,
        togglePlan,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
