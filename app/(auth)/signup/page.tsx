import type { Metadata } from 'next'
import MadarAuth from '@/components/teacher-os-auth'

export const metadata: Metadata = {
  title: 'إنشاء حساب',
  description: 'انضم لمدار مجانًا وابدأ تنظيم حصصك وطلابك ومدفوعاتك من اليوم.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/signup' },
  openGraph: {
    title: 'إنشاء حساب | مدار',
    description: 'انضم لمدار مجانًا وابدأ تنظيم حصصك وطلابك ومدفوعاتك من اليوم.',
    url: 'https://madar-edu.vercel.app/signup',
    type: 'website',
  },
}

export default function SignupPage() { return <MadarAuth signup /> }
