import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'الحضور',
  description: 'سجّل حضور وغياب طلابك في ثوانٍ وتابع إحصائياتهم على مدار الوقت.',
  robots: { index: false, follow: false },
}

export default function AttendancePage() { return <MadarDashboard /> }
