import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'الاختبارات',
  description: 'أنشئ اختبارات سريعة وتابع نتائج طلابك وقيّم أداءهم بسهولة.',
  robots: { index: false, follow: false },
}

export default function QuizzesPage() { return <MadarDashboard /> }
