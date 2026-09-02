'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { PageKey } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppView = PageKey | 'landing'

export interface Group {
  id: string
  name: string
  grade: string
  subject: string
  type: 'government' | 'private'
  centerName: string
  pricePerSession: number
  sessionsPerMonth: number
  scheduleDays: string[]
  time: string
  capacity: number
}

export interface Student {
  id: string
  name: string
  phone: string
  parentPhone: string
  groupId: string
  groupName: string
  grade: string
  paymentStatus: 'paid' | 'unpaid' | 'partial'
  totalPaid: number
  outstandingBalance: number
  notes: string
}

export interface Session {
  id: string
  groupId: string
  groupName: string
  subject: string
  grade: string
  date: string
  time: string
  room?: string
  topic?: string
  totalStudents: number
  status: 'live' | 'completed' | 'upcoming'
  isAttendanceSaved: boolean
  presentCount: number
  absentCount: number
  lateCount: number
}

export interface Payment {
  id: string
  studentId: string
  studentName: string
  groupId: string
  groupName: string
  amount: number
  method: 'cash' | 'vodafone_cash' | 'instapay'
  date: string
  notes: string
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

// Input shapes for mutations (no id / date / derived fields)
export type AddStudentInput = Omit<Student, 'id'>
export type AddGroupInput   = Omit<Group, 'id'>
export type AddSessionInput = Omit<Session, 'id'>
export type RecordPaymentInput = Omit<Payment, 'id' | 'date'>

interface AppContextValue {
  // Teacher info
  teacher: Teacher

  // Core data
  groups: Group[]
  students: Student[]
  payments: Payment[]

  // Sessions
  todaySessions: Session[]
  startAttendanceForSession: (id: string) => void

  // Mutations
  addStudent: (input: AddStudentInput) => void
  addGroup: (input: AddGroupInput) => void
  addSession: (input: AddSessionInput) => void
  recordPayment: (input: RecordPaymentInput) => void

  // Financial (derived)
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

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_GROUPS: Group[] = [
  {
    id: 'grp-1',
    name: 'مجموعة الثلاثاء أ',
    grade: 'الصف الثالث الثانوي',
    subject: 'رياضيات',
    type: 'government',
    centerName: 'سنتر النور',
    pricePerSession: 500,
    sessionsPerMonth: 8,
    scheduleDays: ['الثلاثاء', 'الجمعة'],
    time: '٤:٠٠ م',
    capacity: 30,
  },
  {
    id: 'grp-2',
    name: 'مجموعة الثلاثاء ب',
    grade: 'الصف الثاني الثانوي',
    subject: 'رياضيات',
    type: 'government',
    centerName: 'سنتر النور',
    pricePerSession: 500,
    sessionsPerMonth: 8,
    scheduleDays: ['الثلاثاء', 'الجمعة'],
    time: '٦:٠٠ م',
    capacity: 30,
  },
  {
    id: 'grp-3',
    name: 'مجموعة الثلاثاء ج',
    grade: 'الصف الأول الثانوي',
    subject: 'رياضيات',
    type: 'government',
    centerName: 'سنتر الأمل',
    pricePerSession: 450,
    sessionsPerMonth: 8,
    scheduleDays: ['الثلاثاء'],
    time: '٢:٠٠ م',
    capacity: 35,
  },
  {
    id: 'grp-4',
    name: 'مجموعة المساء',
    grade: 'الصف الثالث الثانوي',
    subject: 'فيزياء',
    type: 'private',
    centerName: 'سنتر العلوم',
    pricePerSession: 600,
    sessionsPerMonth: 8,
    scheduleDays: ['الثلاثاء', 'السبت'],
    time: '٨:٠٠ م',
    capacity: 20,
  },
]

const SEED_STUDENTS: Student[] = [
  { id: 'st-1',  name: 'أحمد محمود',   phone: '01012345678', parentPhone: '01098765432', groupId: 'grp-1', groupName: 'مجموعة الثلاثاء أ', grade: 'الصف الثالث الثانوي', paymentStatus: 'paid',    totalPaid: 500,  outstandingBalance: 0,   notes: '' },
  { id: 'st-2',  name: 'محمد علي',     phone: '01112345678', parentPhone: '01187654321', groupId: 'grp-1', groupName: 'مجموعة الثلاثاء أ', grade: 'الصف الثالث الثانوي', paymentStatus: 'unpaid',  totalPaid: 0,    outstandingBalance: 500, notes: '' },
  { id: 'st-3',  name: 'يوسف حسن',    phone: '01212345678', parentPhone: '01287654321', groupId: 'grp-1', groupName: 'مجموعة الثلاثاء أ', grade: 'الصف الثالث الثانوي', paymentStatus: 'paid',    totalPaid: 500,  outstandingBalance: 0,   notes: '' },
  { id: 'st-4',  name: 'عمر خالد',    phone: '01512345678', parentPhone: '01587654321', groupId: 'grp-2', groupName: 'مجموعة الثلاثاء ب', grade: 'الصف الثاني الثانوي', paymentStatus: 'paid',    totalPaid: 500,  outstandingBalance: 0,   notes: '' },
  { id: 'st-5',  name: 'علي أحمد',    phone: '01612345678', parentPhone: '01687654321', groupId: 'grp-2', groupName: 'مجموعة الثلاثاء ب', grade: 'الصف الثاني الثانوي', paymentStatus: 'unpaid',  totalPaid: 0,    outstandingBalance: 500, notes: '' },
  { id: 'st-6',  name: 'مريم محمد',   phone: '01712345678', parentPhone: '01787654321', groupId: 'grp-2', groupName: 'مجموعة الثلاثاء ب', grade: 'الصف الثاني الثانوي', paymentStatus: 'paid',    totalPaid: 500,  outstandingBalance: 0,   notes: '' },
  { id: 'st-7',  name: 'سلمى أحمد',  phone: '01812345678', parentPhone: '01887654321', groupId: 'grp-3', groupName: 'مجموعة الثلاثاء ج', grade: 'الصف الأول الثانوي',  paymentStatus: 'partial', totalPaid: 200,  outstandingBalance: 250, notes: '' },
  { id: 'st-8',  name: 'مصطفى نبيل', phone: '01912345678', parentPhone: '01987654321', groupId: 'grp-3', groupName: 'مجموعة الثلاثاء ج', grade: 'الصف الأول الثانوي',  paymentStatus: 'paid',    totalPaid: 450,  outstandingBalance: 0,   notes: '' },
  { id: 'st-9',  name: 'ياسمين كمال', phone: '01022345678', parentPhone: '01098865432', groupId: 'grp-4', groupName: 'مجموعة المساء',     grade: 'الصف الثالث الثانوي', paymentStatus: 'unpaid',  totalPaid: 0,    outstandingBalance: 600, notes: '' },
  { id: 'st-10', name: 'كريم سامي',   phone: '01122345678', parentPhone: '01187765432', groupId: 'grp-4', groupName: 'مجموعة المساء',     grade: 'الصف الثالث الثانوي', paymentStatus: 'paid',    totalPaid: 600,  outstandingBalance: 0,   notes: '' },
]

const SEED_SESSIONS: Session[] = [
  {
    id: 'sess-1',
    groupId: 'grp-1',
    groupName: 'مجموعة الثلاثاء أ',
    subject: 'رياضيات',
    grade: 'الصف الثالث الثانوي',
    date: '2026-09-02',
    time: '٤:٠٠ م',
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
    groupId: 'grp-2',
    groupName: 'مجموعة الثلاثاء ب',
    subject: 'رياضيات',
    grade: 'الصف الثاني الثانوي',
    date: '2026-09-02',
    time: '٦:٠٠ م',
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
    groupId: 'grp-3',
    groupName: 'مجموعة الثلاثاء ج',
    subject: 'رياضيات',
    grade: 'الصف الأول الثانوي',
    date: '2026-09-02',
    time: '٢:٠٠ م',
    totalStudents: 30,
    status: 'completed',
    isAttendanceSaved: true,
    presentCount: 26,
    absentCount: 3,
    lateCount: 1,
  },
  {
    id: 'sess-4',
    groupId: 'grp-4',
    groupName: 'مجموعة المساء',
    subject: 'فيزياء',
    grade: 'الصف الثالث الثانوي',
    date: '2026-09-02',
    time: '٨:٠٠ م',
    room: 'قاعة ٣',
    totalStudents: 18,
    status: 'upcoming',
    isAttendanceSaved: false,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  },
]

const SEED_ACTIVITIES: Activity[] = [
  { id: 'act-1', type: 'attendance', title: 'تم تسجيل حضور مجموعة الثلاثاء ج',   description: 'الصف الأول الثانوي — ٢٦ حاضر، ٣ غائب، ١ متأخر', timeAgo: 'منذ ٤٥ دقيقة' },
  { id: 'act-2', type: 'payment',    title: 'تم استلام دفعة من أحمد محمود',       description: '٥٠٠ ج.م — مجموعة الثلاثاء أ',                   timeAgo: 'منذ ساعة'      },
  { id: 'act-3', type: 'payment',    title: 'تم استلام دفعة من مريم حسن',         description: '٥٠٠ ج.م — مجموعة الثلاثاء ب',                   timeAgo: 'منذ ساعتين'   },
  { id: 'act-4', type: 'group',      title: 'تم إضافة طالب جديد',                 description: 'يوسف عمر — مجموعة المساء',                       timeAgo: 'منذ ٣ ساعات'  },
  { id: 'act-5', type: 'quiz',       title: 'نتائج اختبار الجبر',                 description: 'متوسط الدرجات: ٧٨٪ — مجموعة الثلاثاء ب',         timeAgo: 'أمس'           },
  { id: 'act-6', type: 'attendance', title: 'تم تسجيل حضور مجموعة الإثنين أ',    description: 'الصف الثاني الثانوي — ٢٠ حاضر، ٢ غائب',          timeAgo: 'أمس'           },
]

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', title: '٧ طلاب لم يدفعوا بعد',  message: 'تذكير: موعد سداد شهر سبتمبر ينتهي هذا الأسبوع.',   time: 'منذ ١٠ دقائق',  read: false },
  { id: 'notif-2', title: 'حصة جديدة بدأت',          message: 'مجموعة الثلاثاء أ — رياضيات ٤:٠٠ م جارية الآن.',  time: 'منذ ٣٠ دقيقة', read: false },
  { id: 'notif-3', title: 'تم إضافة طالب جديد',      message: 'يوسف عمر انضم لمجموعة المساء بنجاح.',              time: 'منذ ٣ ساعات',   read: true  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

let _idCounter = 1000
function uid(prefix: string) {
  return `${prefix}-${++_idCounter}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [groups,      setGroups]         = useState<Group[]>(SEED_GROUPS)
  const [students,    setStudents]       = useState<Student[]>(SEED_STUDENTS)
  const [sessions,    setSessions]       = useState<Session[]>(SEED_SESSIONS)
  const [payments,    setPayments]       = useState<Payment[]>([])
  const [activities,  setActivities]     = useState<Activity[]>(SEED_ACTIVITIES)
  const [plan,        setPlan]           = useState<'basic' | 'pro'>('basic')
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isSearchOpen,   setIsSearchOpen]   = useState(false)
  const [notifications,  setNotifications]  = useState<Notification[]>(SEED_NOTIFICATIONS)

  // ── Derived financials ──────────────────────────────────────────────────────
  const expectedMonthlyRevenue  = 56000
  const collectedMonthlyRevenue = payments.reduce((s, p) => s + p.amount, 48500)   // seed base
  const remainingMonthlyRevenue = expectedMonthlyRevenue - collectedMonthlyRevenue
  const collectionPercentage    = Math.min(100, Math.round((collectedMonthlyRevenue / expectedMonthlyRevenue) * 100))
  const unpaidStudentsCount     = students.filter(s => s.paymentStatus !== 'paid').length

  const unreadNotificationCount = notifications.filter(n => !n.read).length

  const markNotificationsAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const startAttendanceForSession = (_id: string) => router.push('/attendance')

  const togglePlan = () => setPlan(prev => (prev === 'basic' ? 'pro' : 'basic'))

  // ── Mutations ────────────────────────────────────────────────────────────────
  const addStudent = (input: AddStudentInput) => {
    const newStudent: Student = { id: uid('st'), ...input }
    setStudents(prev => [newStudent, ...prev])
    setActivities(prev => [{
      id: uid('act'),
      type: 'group',
      title: `تم إضافة طالب جديد`,
      description: `${input.name} — ${input.groupName}`,
      timeAgo: 'الآن',
    }, ...prev])
  }

  const addGroup = (input: AddGroupInput) => {
    const newGroup: Group = { id: uid('grp'), ...input }
    setGroups(prev => [newGroup, ...prev])
    setActivities(prev => [{
      id: uid('act'),
      type: 'group',
      title: 'تم إنشاء مجموعة جديدة',
      description: `${input.name} — ${input.centerName}`,
      timeAgo: 'الآن',
    }, ...prev])
  }

  const addSession = (input: AddSessionInput) => {
    const newSession: Session = { id: uid('sess'), ...input }
    setSessions(prev => [newSession, ...prev])
  }

  const recordPayment = (input: RecordPaymentInput) => {
    const newPayment: Payment = {
      id: uid('pay'),
      date: new Date().toISOString().split('T')[0],
      ...input,
    }
    setPayments(prev => [newPayment, ...prev])
    // Update student balance
    setStudents(prev => prev.map(s => {
      if (s.id !== input.studentId) return s
      const newBalance = Math.max(0, s.outstandingBalance - input.amount)
      return {
        ...s,
        totalPaid: s.totalPaid + input.amount,
        outstandingBalance: newBalance,
        paymentStatus: newBalance === 0 ? 'paid' : 'partial',
      }
    }))
    setActivities(prev => [{
      id: uid('act'),
      type: 'payment',
      title: 'تم تسجيل دفعة مالية',
      description: `${input.studentName} — ${input.amount.toLocaleString()} ج.م`,
      timeAgo: 'الآن',
    }, ...prev])
  }

  // ── Today's sessions (filter by today's date) ────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0]
  // For demo purposes we show all seed sessions regardless of date so the dashboard isn't empty
  const todaySessions = sessions.filter(
    s => s.date === todayStr || SEED_SESSIONS.some(ss => ss.id === s.id)
  )

  return (
    <AppContext.Provider
      value={{
        teacher: {
          name:          'أحمد محمد',
          subject:       'رياضيات',
          email:         'ahmed@teacher.os',
          totalStudents: students.length,
          totalGroups:   groups.length,
        },
        groups,
        students,
        payments,
        todaySessions,
        startAttendanceForSession,
        addStudent,
        addGroup,
        addSession,
        recordPayment,
        expectedMonthlyRevenue,
        collectedMonthlyRevenue,
        remainingMonthlyRevenue,
        collectionPercentage,
        unpaidStudentsCount,
        activities,
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
