"use client";

import { useGetBillingHistoryQuery } from "@/src/lib/api/billingApi";
import { formatMoney } from "@/src/lib/formatters/money";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
        مدفوع
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
        فشل
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
        مُسترجع
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
        ملغى
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
      قيد الانتظار
    </span>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function BillingHistory() {
  const { data, isLoading } = useGetBillingHistoryQuery();
  const transactions = data?.data.transactions ?? [];

  if (isLoading) {
    return (
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white" dir="rtl">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-950">سجل الفواتير</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          لا توجد عمليات دفع حتى الآن.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-right text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500">
                <th className="px-5 py-3 font-semibold">الباقة</th>
                <th className="px-5 py-3 font-semibold">المبلغ</th>
                <th className="px-5 py-3 font-semibold">الحالة</th>
                <th className="px-5 py-3 font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="transition hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Madar {tx.plan === "pro" ? "Pro" : "Basic"}
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-slate-900">
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
