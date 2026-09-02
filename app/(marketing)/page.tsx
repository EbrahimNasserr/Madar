import type { Metadata } from 'next'
import MadarMarketing from '@/components/teacher-os-marketing'

export const metadata: Metadata = {
  title: 'مدار — كل شغلك كمدرس في مكان واحد',
  description:
    'مدار هو نظام تشغيل المعلم الحديث. نظّم مجموعاتك، سجّل الحضور، تابع المصروفات، وراقب أداء طلابك — كل ده في مكان واحد بدون تعقيد.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'مدار — كل شغلك كمدرس في مكان واحد',
    description:
      'نظام تشغيل المعلم الحديث — حضور، مجموعات، مدفوعات، وأداء الطلاب في مكان واحد.',
    url: 'https://madar-edu.vercel.app',
    type: 'website',
  },
}

export default function Page() { return <MadarMarketing /> }
