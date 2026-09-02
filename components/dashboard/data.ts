import {
  Home, Users, LayoutGrid, CalendarDays,
  ClipboardCheck, Wallet, BookOpen, FileText, Settings,
} from 'lucide-react'
import type { PageKey } from './types'

export const navItems: {
  key:   PageKey
  label: string
  icon:  typeof Home
  pro?:  boolean
}[] = [
  { key: 'dashboard',  label: 'الرئيسية',    icon: Home          },
  { key: 'students',   label: 'الطلاب',       icon: Users         },
  { key: 'groups',     label: 'المجموعات',    icon: LayoutGrid    },
  { key: 'sessions',   label: 'الحصص',        icon: CalendarDays  },
  { key: 'attendance', label: 'الحضور',       icon: ClipboardCheck},
  { key: 'payments',   label: 'المدفوعات',    icon: Wallet        },
  { key: 'quizzes',    label: 'الاختبارات',   icon: BookOpen, pro: true },
  { key: 'reports',    label: 'التقارير',     icon: FileText      },
  { key: 'settings',   label: 'الإعدادات',   icon: Settings      },
]

export const studentNames = [
  'أحمد محمود', 'محمد علي', 'يوسف حسن', 'عمر خالد',
  'علي أحمد',   'مريم محمد', 'سلمى أحمد', 'مصطفى نبيل',
]

export const chartData = [
  { day: 'السبت',    value: 88 },
  { day: 'الأحد',    value: 94 },
  { day: 'الإثنين', value: 91 },
  { day: 'الثلاثاء', value: 96 },
  { day: 'الأربعاء', value: 92 },
  { day: 'الخميس',   value: 95 },
]
