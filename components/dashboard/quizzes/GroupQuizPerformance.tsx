"use client";

import { useState } from "react";
import { useGetGroupQuizPerformanceQuery } from "@/src/lib/api/quizzesApi";
import type { GroupStudentPerformanceEntry } from "@/src/lib/api/quizzesApi";
import { getCurrentBillingPeriod } from "@/src/lib/date/billingPeriod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeNumber(value: number | null | undefined): number {
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

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PerformanceList({
  title,
  description,
  students,
}: {
  title: string;
  description: string;
  students: GroupStudentPerformanceEntry[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5">
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      {students.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          لا توجد بيانات كافية.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {students.map((entry) => (
            <div
              key={entry.student._id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {entry.rank}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {entry.student.firstName} {entry.student.lastName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {entry.gradedCount} اختبار
                    {entry.absentCount > 0 && ` · غياب ${entry.absentCount}`}
                  </p>
                </div>
              </div>

              {/* Percentage pill */}
              <span
                className={[
                  "rounded-full px-3 py-1.5 text-sm font-bold",
                  safeNumber(entry.averagePercentage) >= 80
                    ? "bg-emerald-50 text-emerald-700"
                    : safeNumber(entry.averagePercentage) >= 60
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700",
                ].join(" ")}
              >
                {safeNumber(entry.averagePercentage).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { groupId: string };

export default function GroupQuizPerformance({ groupId }: Props) {
  const [period, setPeriod] = useState(getCurrentBillingPeriod);

  const { data, isLoading, isError } = useGetGroupQuizPerformanceQuery({
    groupId,
    period,
  });

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        تعذر تحميل أداء المجموعة.
      </div>
    );
  }

  const perf = data.data;
  const { summary, quizzes, topPerformers, needsAttention } = perf;

  return (
    <section className="space-y-6">
      {/* Header + period picker */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            أداء المجموعة في الاختبارات
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            تحليل نتائج الطلاب خلال الفترة المحددة.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-500">
            الشهر
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="عدد الاختبارات"  value={summary.totalQuizzes} />
        <StatCard
          label="متوسط المجموعة"
          value={`${safeNumber(summary.averagePercentage).toFixed(0)}%`}
        />
        <StatCard
          label="أعلى نتيجة"
          value={`${safeNumber(summary.topPercentage).toFixed(0)}%`}
        />
        <StatCard label="نتائج مصححة"    value={summary.gradedResults} />
      </div>

      {/* Top performers + needs attention */}
      {(topPerformers.length > 0 || needsAttention.length > 0) && (
        <div className="grid gap-6 xl:grid-cols-2">
          <PerformanceList
            title="أعلى أداء"
            description="الطلاب أصحاب أفضل متوسط خلال الفترة."
            students={topPerformers}
          />
          <PerformanceList
            title="فرص للتحسن"
            description="طلاب قد يستفيدون من متابعة إضافية."
            students={needsAttention}
          />
        </div>
      )}

      {/* Quiz-by-quiz breakdown */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-bold text-slate-950">تفاصيل الاختبارات</h3>
        </div>

        {quizzes.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            لا توجد اختبارات خلال هذه الفترة.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quizzes.map((quiz) => (
              <div
                key={quiz.quizId}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {/* API field is "title" not "quizTitle" */}
                  <p className="font-medium text-slate-900">{quiz.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(quiz.quizDate).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" · "}
                    الدرجة الكاملة: {quiz.totalMarks}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <Metric
                    label="المتوسط"
                    value={`${safeNumber(quiz.averagePercentage).toFixed(0)}%`}
                  />
                  {/* API fields are "graded"/"absent" not "gradedCount"/"absentCount" */}
                  <Metric label="تم التصحيح" value={quiz.graded} />
                  <Metric label="غياب"        value={quiz.absent} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
