"use client";

import { use, useEffect, useMemo, useState } from "react";
import MadarDashboard from "@/components/teacher-os-dashboard";
import {
  useGetQuizSheetQuery,
  useSaveQuizResultsMutation,
} from "@/src/lib/api/quizzesApi";
import type { QuizResultStatus } from "@/src/lib/api/quizzesApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftResult = {
  studentId: string;
  score: string;
  status: QuizResultStatus;
  note: string;
};

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function QuizGradingContent({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetQuizSheetQuery(id);
  const [saveResults, { isLoading: isSaving }] = useSaveQuizResultsMutation();

  const [results, setResults] = useState<DraftResult[]>([]);

  const quiz = data?.data.quiz;
  const students = data?.data.students ?? [];

  // ── Seed draft from server sheet ──────────────────────────────────────────
  useEffect(() => {
    if (!data?.data.students) return;

    setResults(
      data.data.students.map((item) => ({
        studentId: item.student._id,
        score:     item.result ? String(item.result.score) : "",
        status:    item.result?.status ?? "graded",
        note:      item.result?.note   ?? "",
      }))
    );
  }, [data]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateScore = (studentId: string, score: string) =>
    setResults((current) =>
      current.map((r) =>
        r.studentId === studentId ? { ...r, score, status: "graded" } : r
      )
    );

  const setAbsent = (studentId: string) =>
    setResults((current) =>
      current.map((r) =>
        r.studentId === studentId ? { ...r, score: "0", status: "absent" } : r
      )
    );

  const setGraded = (studentId: string) =>
    setResults((current) =>
      current.map((r) =>
        r.studentId === studentId
          ? { ...r, status: "graded", score: r.score === "0" ? "" : r.score }
          : r
      )
    );

  // ── Live summary ──────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const graded = results.filter((r) => r.status === "graded" && r.score !== "");
    const absent = results.filter((r) => r.status === "absent").length;
    const average =
      graded.length === 0
        ? 0
        : graded.reduce((total, r) => total + Number(r.score), 0) / graded.length;
    return { graded: graded.length, absent, average };
  }, [results]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!quiz) return;

    // Validate ranges
    const invalid = results.filter(
      (r) =>
        r.status === "graded" &&
        r.score !== "" &&
        (Number(r.score) < 0 || Number(r.score) > quiz.totalMarks)
    );
    if (invalid.length > 0) return;

    const payload = results
      .filter((r) => r.status === "absent" || r.score !== "")
      .map((r) => ({
        studentId: r.studentId,
        status:    r.status,
        score:     r.status === "absent" ? 0 : Number(r.score),
        ...(r.note ? { note: r.note } : {}),
      }));

    await saveResults({ quizId: id, results: payload }).unwrap();
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        تعذر تحميل كشف الدرجات.
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">تسجيل الدرجات</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">{quiz.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            الدرجة النهائية: {quiz.totalMarks}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? "جارٍ حفظ الدرجات..." : "حفظ الدرجات"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="تم التصحيح" value={summary.graded} />
        <SummaryCard label="غائب" value={summary.absent} />
        <SummaryCard
          label="متوسط الدرجات"
          value={`${summary.average.toFixed(1)} / ${quiz.totalMarks}`}
        />
      </div>

      {/* Student rows */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-950">الطلاب</h2>
          <p className="mt-1 text-sm text-slate-500">
            أدخل الدرجة أو حدد الطالب كغائب.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map(({ student }) => {
            const result = results.find((r) => r.studentId === student._id);
            if (!result) return null;

            const percentage =
              result.status === "graded" && result.score !== ""
                ? Math.min(100, Math.max(0, (Number(result.score) / quiz.totalMarks) * 100))
                : 0;

            const scoreNum = Number(result.score);
            const isInvalid =
              result.status === "graded" &&
              result.score !== "" &&
              (scoreNum < 0 || scoreNum > quiz.totalMarks);

            return (
              <div
                key={student._id}
                className="grid gap-4 p-5 lg:grid-cols-[1fr_200px_180px] lg:items-center"
              >
                {/* Name */}
                <div>
                  <p className="font-semibold text-slate-900">
                    {student.firstName} {student.lastName}
                  </p>
                  {student.phone && (
                    <p className="mt-1 text-xs text-slate-400">{student.phone}</p>
                  )}
                </div>

                {/* Score input / absent badge */}
                <div>
                  {result.status === "absent" ? (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                      غائب
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={quiz.totalMarks}
                        step="0.5"
                        value={result.score}
                        onChange={(e) => updateScore(student._id, e.target.value)}
                        placeholder="الدرجة"
                        className={[
                          "w-full rounded-xl border px-4 py-3 pl-16 text-sm outline-none transition",
                          isInvalid
                            ? "border-red-400 bg-red-50 focus:border-red-500"
                            : "border-slate-200 focus:border-indigo-500",
                        ].join(" ")}
                        aria-label={`درجة ${student.firstName}`}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        / {quiz.totalMarks}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions + percentage */}
                <div className="flex items-center justify-end gap-2">
                  {result.status === "graded" ? (
                    <>
                      {result.score !== "" && !isInvalid && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {percentage.toFixed(0)}%
                        </span>
                      )}
                      {isInvalid && (
                        <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600">
                          خارج النطاق
                        </span>
                      )}
                      <button
                        onClick={() => setAbsent(student._id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        غائب
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setGraded(student._id)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      تسجيل درجة
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          disabled={isSaving}
          onClick={handleSave}
          className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? "جارٍ الحفظ..." : "حفظ كل الدرجات"}
        </button>
      </div>
    </div>
  );
}

// ─── Shell wrapper ────────────────────────────────────────────────────────────

export default function QuizGradingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <MadarDashboard>
      <QuizGradingContent id={id} />
    </MadarDashboard>
  );
}
