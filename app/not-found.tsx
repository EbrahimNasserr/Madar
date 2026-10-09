import { Logo } from "@/components/marketing/logo";
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Brand */}
         
        <div className="mb-5">
          <Logo/>
        </div>

        {/* 404 */}
        <p className="text-7xl font-bold tracking-tight text-slate-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          الصفحة غير موجودة
        </h1>

        <p className="mt-3 leading-7 text-muted-foreground">
          قد تكون الصفحة قد حُذفت أو تغيّر رابطها أو لم تكن موجودة من الأساس.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            العودة إلى الرئيسية
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </main>
  );
}
