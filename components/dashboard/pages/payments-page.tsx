import Link from 'next/link'
import { Wallet, Layers } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

// The payments feature lives within each group's detail page.
// This page guides the teacher to the right place.
export function PaymentsPage() {
  return (
    <section className="space-y-6" dir="rtl">
      <PageHeader
        eyebrow="المدفوعات"
        title="المدفوعات"
        description="تتم متابعة المدفوعات من داخل صفحة كل مجموعة."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-[#EAF0FF] flex items-center justify-center">
          <Wallet className="w-6 h-6 text-[#3157D5]" />
        </div>
        <h2 className="font-bold text-slate-900">ادخل على مجموعة لمتابعة مدفوعاتها</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          كل مجموعة لها سجل مدفوعات خاص بها — شهري أو لكل حصة حسب نظام الدفع.
        </p>
        <Link
          href="/groups"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] transition"
        >
          <Layers className="w-4 h-4" />
          عرض المجموعات
        </Link>
      </div>
    </section>
  )
}
