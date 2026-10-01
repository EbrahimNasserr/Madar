'use client'

// ─────────────────────────────────────────────────────────────────────────────
// AppContext — lightweight UI-level state for the dashboard shell.
//
// Owns: plan toggle, quick-add modal, search modal, notifications.
// Does NOT own: students, groups, sessions, payments — those live in RTK Query.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { PageKey } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppView = PageKey | 'landing'

// Kept for quick-add-modal until it's replaced with real API forms
export interface Group {
  id:               string
  name:             string
  grade:            string
  subject:          string
  type:             'government' | 'private'
  centerName:       string
  pricePerSession:  number
  sessionsPerMonth: number
  scheduleDays:     string[]
  time:             string
  capacity:         number
}

export interface Student {
  id:                 string
  name:               string
  phone:              string
  parentPhone:        string
  groupId:            string
  groupName:          string
  grade:              string
  paymentStatus:      'paid' | 'unpaid' | 'partial'
  totalPaid:          number
  outstandingBalance: number
  notes:              string
}

export interface Session {
  id:                string
  groupId:           string
  groupName:         string
  subject:           string
  grade:             string
  date:              string
  time:              string
  room?:             string
  topic?:            string
  totalStudents:     number
  status:            'live' | 'completed' | 'upcoming'
  isAttendanceSaved: boolean
  presentCount:      number
  absentCount:       number
  lateCount:         number
}

export interface Payment {
  id:          string
  studentId:   string
  studentName: string
  groupId:     string
  groupName:   string
  amount:      number
  method:      'cash' | 'vodafone_cash' | 'instapay'
  date:        string
  notes:       string
}

export interface Notification {
  id:      string
  title:   string
  message: string
  time:    string
  read:    boolean
}

export interface Teacher {
  name:          string
  subject:       string
  email:         string
  totalStudents: number
  totalGroups:   number
}

// Input shapes for quick-add-modal mutations
export type AddStudentInput    = Omit<Student, 'id'>
export type AddGroupInput      = Omit<Group, 'id'>
export type AddSessionInput    = Omit<Session, 'id'>
export type RecordPaymentInput = Omit<Payment, 'id' | 'date'>

export interface Activity {
  id:          string
  type:        'attendance' | 'payment' | 'group' | 'quiz'
  title:       string
  description: string
  timeAgo:     string
}

interface AppContextValue {
  teacher: Teacher

  // Quick-add modal still uses these in-memory lists until proper API forms land
  groups:       Group[]
  students:     Student[]
  payments:     Payment[]
  addStudent:   (input: AddStudentInput) => void
  addGroup:     (input: AddGroupInput) => void
  addSession:   (input: AddSessionInput) => void
  recordPayment:(input: RecordPaymentInput) => void

  // Dashboard home stubs (will be replaced by real API queries)
  todaySessions:             Session[]
  startAttendanceForSession: (id: string) => void
  expectedMonthlyRevenue:    number
  collectedMonthlyRevenue:   number
  remainingMonthlyRevenue:   number
  collectionPercentage:      number
  unpaidStudentsCount:       number
  activities:                Activity[]

  // Plan
  plan:       'basic' | 'pro'
  togglePlan: () => void

  // Notifications
  notifications:           Notification[]
  unreadNotificationCount: number
  markNotificationsAsRead: () => void

  // UI toggles
  isQuickAddOpen:   boolean
  setIsQuickAddOpen:(open: boolean) => void
  isSearchOpen:     boolean
  setIsSearchOpen:  (open: boolean) => void
}

// ─── Static seed data (minimal — no fake students/sessions/payments) ──────────

const SEED_ACTIVITIES: Activity[] = [
  { id: 'act-1', type: 'attendance', title: 'تم تسجيل حضور مجموعة الثلاثاء ج',   description: 'الصف الأول الثانوي — ٢٦ حاضر، ٣ غائب، ١ متأخر', timeAgo: 'منذ ٤٥ دقيقة' },
  { id: 'act-2', type: 'payment',    title: 'تم استلام دفعة من أحمد محمود',       description: '٥٠٠ ج.م — مجموعة الثلاثاء أ',                   timeAgo: 'منذ ساعة'      },
  { id: 'act-3', type: 'payment',    title: 'تم استلام دفعة من مريم حسن',         description: '٥٠٠ ج.م — مجموعة الثلاثاء ب',                   timeAgo: 'منذ ساعتين'   },
  { id: 'act-4', type: 'group',      title: 'تم إضافة طالب جديد',                 description: 'يوسف عمر — مجموعة المساء',                       timeAgo: 'منذ ٣ ساعات'  },
  { id: 'act-5', type: 'quiz',       title: 'نتائج اختبار الجبر',                 description: 'متوسط الدرجات: ٧٨٪ — مجموعة الثلاثاء ب',         timeAgo: 'أمس'           },
]

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id:      'notif-1',
    title:   '٧ طلاب لم يدفعوا بعد',
    message: 'تذكير: موعد سداد شهر سبتمبر ينتهي هذا الأسبوع.',
    time:    'منذ ١٠ دقائق',
    read:    false,
  },
  {
    id:      'notif-2',
    title:   'حصة جديدة بدأت',
    message: 'مجموعة الثلاثاء أ — رياضيات ٤:٠٠ م جارية الآن.',
    time:    'منذ ٣٠ دقيقة',
    read:    false,
  },
  {
    id:      'notif-3',
    title:   'تم إضافة طالب جديد',
    message: 'يوسف عمر انضم لمجموعة المساء بنجاح.',
    time:    'منذ ٣ ساعات',
    read:    true,
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

let _idCounter = 1000
function uid(prefix: string) { return `${prefix}-${++_idCounter}` }

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // In-memory lists — only used by quick-add-modal until API-backed forms replace it
  const [groups,   setGroups]   = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  const [plan,          setPlan]          = useState<'basic' | 'pro'>('basic')
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS)
  const [activities]                      = useState<Activity[]>(SEED_ACTIVITIES)
  const [isQuickAddOpen,setIsQuickAddOpen]= useState(false)
  const [isSearchOpen,  setIsSearchOpen]  = useState(false)

  const togglePlan = () => setPlan(p => p === 'basic' ? 'pro' : 'basic')

  const unreadNotificationCount = notifications.filter(n => !n.read).length
  const markNotificationsAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  // ── Dashboard home stubs ───────────────────────────────────────────────────
  // These will be replaced by real RTK Query hooks in dashboard-home.tsx
  const todaySessions:             Session[] = []
  const startAttendanceForSession            = (_id: string) => { router.push('/sessions') }
  const expectedMonthlyRevenue               = 0
  const collectedMonthlyRevenue              = 0
  const remainingMonthlyRevenue              = 0
  const collectionPercentage                 = 0
  const unpaidStudentsCount                  = 0

  // ── Quick-add stubs ────────────────────────────────────────────────────────
  const addStudent = (input: AddStudentInput) =>
    setStudents(prev => [{ id: uid('st'), ...input }, ...prev])

  const addGroup = (input: AddGroupInput) =>
    setGroups(prev => [{ id: uid('grp'), ...input }, ...prev])

  const addSession = (_input: AddSessionInput) => {
    // Sessions are managed by sessionsApi — this stub satisfies the modal type
  }

  const recordPayment = (input: RecordPaymentInput) => {
    const newPayment: Payment = {
      id:   uid('pay'),
      date: new Date().toISOString().split('T')[0],
      ...input,
    }
    setPayments(prev => [newPayment, ...prev])
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== input.studentId) return s
        const newBalance = Math.max(0, s.outstandingBalance - input.amount)
        return {
          ...s,
          totalPaid:          s.totalPaid + input.amount,
          outstandingBalance: newBalance,
          paymentStatus:      newBalance === 0 ? 'paid' : 'partial',
        }
      }),
    )
  }

  // Teacher info is static until the auth/profile API is wired up
  const teacher: Teacher = {
    name:          'أحمد محمد',
    subject:       'رياضيات',
    email:         'ahmed@teacher.os',
    totalStudents: students.length,
    totalGroups:   groups.length,
  }

  return (
    <AppContext.Provider
      value={{
        teacher,
        groups, students, payments,
        addStudent, addGroup, addSession, recordPayment,
        todaySessions, startAttendanceForSession,
        expectedMonthlyRevenue, collectedMonthlyRevenue,
        remainingMonthlyRevenue, collectionPercentage, unpaidStudentsCount,
        activities,
        plan, togglePlan,
        notifications, unreadNotificationCount, markNotificationsAsRead,
        isQuickAddOpen, setIsQuickAddOpen,
        isSearchOpen,   setIsSearchOpen,
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
