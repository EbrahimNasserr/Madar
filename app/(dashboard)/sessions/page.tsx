import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'الحصص',
  description: 'خطّط وسجّل حصصك الدراسية وتابع ملاحظاتك لكل حصة.',
  robots: { index: false, follow: false },
}

export default function SessionsPage() { return <MadarDashboard /> }
