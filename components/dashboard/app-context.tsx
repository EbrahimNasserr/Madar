'use client'

// ─────────────────────────────────────────────────────────────────────────────
// AppContext — lightweight UI-level state for the dashboard shell.
//
// Owns:
//   - quick-add modal open state (and the in-memory demo data it operates on)
//   - notifications (seed data; will be replaced with a real API)
//   - global search modal open state
//
// Does NOT own: students, groups, sessions, payments, attendance — those all
// live in RTK Query.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PageKey } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppView = PageKey | 'landing'

// ── Quick-add modal local types ───────────────────────────────────────────────
// These exist only to support the in-memory quick-add demo modal.
// Once the modal is replaced with real API-backed forms these can be removed.

export interface QuickAddGroup {
  id:               string
  name:             string
  grade:            string
  subject:          string
  pricePerSession:  number
  sessionsPerMonth: number
  scheduleDays:     string[]
  time:             string
}

export interface QuickAddStudent {
  id:           string
  name:         string
  phone:        string
  parentPhone:  string
  groupId:      string
  groupName:    string
  grade:        string
  totalPaid:    number
  outstandingBalance: number
}

export interface Notification {
  id:      string
  title:   string
  message: string
  time:    string
  read:    boolean
}

export type AddStudentInput    = Omit<QuickAddStudent, 'id'>
export type AddGroupInput      = Omit<QuickAddGroup, 'id'>

// ─── Context value ────────────────────────────────────────────────────────────

interface AppContextValue {
  // Quick-add demo data
  groups:     QuickAddGroup[]
  students:   QuickAddStudent[]
  addStudent: (input: AddStudentInput) => void
  addGroup:   (input: AddGroupInput) => void

  // Notifications
  notifications:           Notification[]
  unreadNotificationCount: number
  markNotificationsAsRead: () => void

  // UI toggles
  isQuickAddOpen:    boolean
  setIsQuickAddOpen: (open: boolean) => void
  isSearchOpen:      boolean
  setIsSearchOpen:   (open: boolean) => void
}

// ─── Seed data ────────────────────────────────────────────────────────────────

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
  const [groups,   setGroups]   = useState<QuickAddGroup[]>([])
  const [students, setStudents] = useState<QuickAddStudent[]>([])

  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isSearchOpen,   setIsSearchOpen]   = useState(false)

  const unreadNotificationCount = notifications.filter((n) => !n.read).length
  const markNotificationsAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const addStudent = (input: AddStudentInput) =>
    setStudents((prev) => [{ id: uid('st'), ...input }, ...prev])

  const addGroup = (input: AddGroupInput) =>
    setGroups((prev) => [{ id: uid('grp'), ...input }, ...prev])

  return (
    <AppContext.Provider
      value={{
        groups, students,
        addStudent, addGroup,
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
