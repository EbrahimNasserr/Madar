"use client";

import { useGetStudentQuizPerformanceQuery } from "@/src/lib/api/quizzesApi";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/src/lib/formatters/date";
import { formatPercentage } from "@/src/lib/formatters/percentage";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeNum(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

type TrendDir = "improving" | "stable" | "declining" | null;

function TrendBadge({ trend }: { trend: TrendDir }) {
  if (!trend) return null;

  const labels: Record<NonNullable<TrendDir>, string> = {
    improving: "الأداء يتحسن",
    stable:    "الأداء مستقر",
    declining: "يحتاج متابعة",
  };
  const styles: Record<NonNullable<TrendDir>, string> = {
    improving: "bg-emerald-50 text-emerald-700",
    stable:    "bg-blue-50 text-blue-700",
    declining: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${styles[trend]}`}>
      {labels[trend]}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { studentId: string };

export default function StudentQuizPerformance({ studentId }: Props) {
  const { data, isLoading, isError } = useGetStudentQuizPerformanceQuery(studentId);

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (isError || !data?.data) {
    return <ErrorState description="تعذر تحميل أداء الطالب." />;
  }

  // Real API shape: data.data.summary + data.data.trend (the history array)
  const { summary, trend: history } = data.data;

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">أداء الاختبارات</h2>
          <p className="mt-1 text-sm text-slate-500">
            متابعة مستوى الطالب عبر الاختبارات.
          </p>
        </div>
        <TrendBadge trend={summary.trendDirection} />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="متوسط الأداء"
          value={`${safeNum(summary.averagePercentage).toFixed(0)}%`}
        />
        <StatCard
          label="أفضل نتيجة"
          value={`${safeNum(summary.bestPercentage).toFixed(0)}%`}
        />
        <StatCard
          label="آخر نتيجة"
          value={`${safeNum(summary.latestPercentage).toFixed(0)}%`}
        />
        <StatCard label="الغياب" value={summary.absentCount} />
      </div>

      {/* History table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-bold text-slate-950">سجل الاختبارات</h3>
        </div>

        {!history || history.length === 0 ? (
          <EmptyState title="لا توجد نتائج اختبارات حتى الآن." />
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div
                key={item.quizId}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Quiz info */}
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{item.quizTitle}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.group.name}
                    {" · "}
                    {formatDate(item.quizDate)}
                  </p>
                </div>

                {/* Result */}
                {item.status === "absent" ? (
                  <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
                    غائب
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {item.score} درجة
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-bold",
                        safeNum(item.percentage) >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : safeNum(item.percentage) >= 60
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700",
                      ].join(" ")}
                    >
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
