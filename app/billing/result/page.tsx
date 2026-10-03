"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, RefreshCw, Clock } from "lucide-react";
import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import { Button } from "@/components/ui/button";

export default function BillingResultPage() {
  const { data, refetch, isFetching } = useGetSubscriptionQuery();

  // Refetch on mount to get latest subscription state from backend
  useEffect(() => {
    refetch();
  }, [refetch]);

  const subscription = data?.data.subscription;
  const active = subscription?.status === "active";

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {isFetching ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <RefreshCw className="h-6 w-6 animate-spin text-slate-500" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-slate-950">
              جاري تأكيد الدفع
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              بنراجع حالة الاشتراك مع مزود الدفع.
            </p>
          </>
        ) : active ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-slate-950">
              تم تفعيل اشتراكك
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              تقدر دلوقتي تكمل استخدام مَدار.
            </p>
            <Link href="/dashboard" className="mt-6 block">
              <Button className="w-full">الذهاب للوحة التحكم</Button>
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-slate-950">
              الدفع قيد التأكيد
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              لو دفعت بالفعل، ممكن يستغرق وصول تأكيد العملية لحظات قليلة.
            </p>
            <Button
              className="mt-6 w-full"
              variant="secondary"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className="h-4 w-4" />
              تحديث حالة الدفع
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
