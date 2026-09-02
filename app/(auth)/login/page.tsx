import type { Metadata } from 'next'
import MadarAuth from '@/components/teacher-os-auth'

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'سجّل دخولك لحسابك على مدار وتابع طلابك ومجموعاتك من أي مكان.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/login' },
  openGraph: {
    title: 'تسجيل الدخول | مدار',
    description: 'سجّل دخولك لحسابك على مدار.',
    url: 'https://madar-edu.vercel.app/login',
    type: 'website',
  },
}

export default function LoginPage() { return <MadarAuth /> }
