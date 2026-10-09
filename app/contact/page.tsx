import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "تواصل معنا | مَدار",
  description:
    "تواصل مع فريق مَدار لأي استفسار أو دعم فني أو طلب مساعدة.",
};

const PHONE = "01031089878";
const PHONE_INTL = "+201031089878";
const EMAIL = "madar.classapp@gmail.com";
const WHATSAPP_URL = `https://wa.me/20${PHONE.slice(1)}`;

export default function ContactPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F8FAFC] text-slate-900"
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            العودة إلى مَدار
          </Link>

          <p className="mb-2 text-sm font-semibold text-indigo-600">مَدار</p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            تواصل معنا
          </h1>

          <p className="mt-4 leading-8 text-slate-600">
            نحن هنا لمساعدتك. سواء كان لديك سؤال عن المنصة، تحتاج دعمًا
            فنيًا، أو ترغب في تقديم ملاحظة — اختر الطريقة الأنسب لك للتواصل.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Phone */}
          <a
            href={`tel:${PHONE_INTL}`}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Phone className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">الهاتف</h2>
                <p className="text-sm text-slate-500">اتصل بنا مباشرة</p>
              </div>
            </div>
            <p dir="ltr" className="text-right text-lg font-semibold tracking-wide text-slate-800">
              {PHONE}
            </p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Mail className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">البريد الإلكتروني</h2>
                <p className="text-sm text-slate-500">راسلنا في أي وقت</p>
              </div>
            </div>
            <p dir="ltr" className="text-right text-sm font-semibold tracking-wide text-slate-800">
              {EMAIL}
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md sm:col-span-2"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                <MessageCircle className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">واتساب</h2>
                <p className="text-sm text-slate-500">محادثة سريعة ومباشرة</p>
              </div>
            </div>
            <p dir="ltr" className="text-right text-lg font-semibold tracking-wide text-slate-800">
              {PHONE}
            </p>
          </a>
        </div>

        {/* Info note */}
        <div className="mt-8 rounded-2xl bg-indigo-50 p-6 text-center">
          <p className="text-sm leading-7 text-slate-600">
            نسعى للرد على جميع الرسائل في أقرب وقت ممكن خلال ساعات العمل.
            شكرًا لتواصلك مع مَدار.
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href="/terms"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            الشروط والأحكام
          </Link>

          <Link
            href="/privacy"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            سياسة الخصوصية
          </Link>

          <Link
            href="/"
            className="font-medium text-slate-500 hover:text-slate-700"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
