"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

import {
  useGetQuizQuery,
  useGetQuizSheetQuery,
  useSaveQuizResultsMutation,
  type QuizResultStatus,
} from "@/src/lib/api/quizzesApi";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftResult = {
  studentId: string;
  score: number;
  status: QuizResultStatus; // "graded" | "absent"
  note: string;
};

// ─── Student row ──────────────────────────────────────────────────────────────

type RowProps = {
  studentId: string;
  name: string;
  totalMarks: number;
  draft: DraftResult;
  onChange: (patch: Partial<DraftResult>) => void;
};

function GradingRow({ studentId, name, totalMarks, draft, onChange }: RowProps) {
  const isAbsent = draft.status === "absent";

  return (
    <div
      className={[
        "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
        isAbsent ? "bg-slate-50/60" : "bg-white",
      ].join(" ")}
    >
      {/* Avatar + name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          aria-hidden="true"
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isAbsent
              ? "bg-slate-200 text-slate-400"
              : "bg-indigo-100 text-indigo-700",
          ].join(" ")}
        >
          {name.charAt(0)}
        </div>
        <span
          className={[
            "truncate text-sm font-semibold",
            isAbsent ? "text-slate-400 line-through" : "text-slate-900",
          ].join(" ")}
        >
          {name}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Score input */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={totalMarks}
            disabled={isAbsent}
            value={isAbsent ? "" : draft.score}
            onChange={(e) =>
              onChange({ score: Math.min(totalMarks, Math.max(0, Number(e.target.value))) })
            }
            className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label={`درجة ${name}`}
          />
          <span className="text-sm text-slate-400">/ {totalMarks}</span>
        </div>

        {/* Absent toggle */}
        <button
          type="button"
          onClick={() =>
            onChange({ status: isAbsent ? "graded" : "absent" })
          }
          className={[
            "rounded-lg px-3 py-2 text-xs font-semibold transition",
            isAbsent
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200",
          ].join(" ")}
        >
          {isAbsent ? "غائب ✓" : "غائب"}
        </button>
      </div>
    </div>
  );
}

// ─── Summary bar ─────────────────────────────────────────────────────────────

function GradingSummary({
  drafts,
  totalMarks,
}: {
  drafts: DraftResult[];
  totalMarks: number;
}) {
  const graded = drafts.filter((d) => d.status === "graded");
  const absent = drafts.filter((d) => d.status === "absent");
  const avg =
    graded.length > 0
      ? Math.round(
          (graded.reduce((sum, d) => sum + d.score, 0) / graded.length / totalMarks) * 100
        )
      : null;

  return (
    <div className="flex flex-wrap gap-3">
      <Pill label="الحاضرون" value={graded.length} color="bg-emerald-50 text-emerald-700" />
      <Pill label="الغائبون" value={absent.length} color="bg-red-50 text-red-600" />
      {avg !== null && (
        <Pill label="متوسط الدرجات" value={`${avg}%`} color="bg-indigo-50 text-indigo-700" />
      )}
    </div>
  );
}

function Pill({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}>
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

// ─── Workspace ────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ id: string }> };

export function QuizGradingWorkspace({ params }: Props) {
  const { id } = use(params);

  const { data: quizData,  isLoading: quizLoading  } = useGetQuizQuery(id);
  const { data: sheetData, isLoading: sheetLoading } = useGetQuizSheetQuery(id);
  const [saveResults, { isLoading: isSaving, isSuccess: isSavedOnce }] =
    useSaveQuizResultsMutation();

  const quiz = quizData?.data.quiz;
  const group = quiz && typeof quiz.groupId === "object" ? quiz.groupId : null;

  // ── Draft results ────────────────────────────────────────────────────────────
  const [drafts, setDrafts] = useState<DraftResult[]>([]);
  const [savedOnce, setSavedOnce] = useState(false);

  // Seed from server sheet on first load
  useEffect(() => {
    const students = sheetData?.data.students;
    if (!students) return;

    setDrafts(
      students.map((item) => ({
        studentId: item.student._id,
        score:     item.result?.score ?? 0,
        status:    item.result?.status ?? "graded",
        note:      item.result?.note ?? "",
      }))
    );

    // Mark as already saved if any result exists on the server
    if (students.some((item) => item.result !== null)) {
      setSavedOnce(true);
    }
  }, [sheetData]);

  const updateDraft = (studentId: string, patch: Partial<DraftResult>) =>
    setDrafts((prev) =>
      prev.map((d) => (d.studentId === studentId ? { ...d, ...patch } : d))
    );

  const handleSave = async () => {
    if (!quiz) return;
    try {
      await saveResults({
        quizId: id,
        results: drafts.map((d) => ({
          studentId: d.studentId,
          score:     d.status === "absent" ? 0 : d.score,
          status:    d.status,
          ...(d.note ? { note: d.note } : {}),
        })),
      }).unwrap();
      setSavedOnce(true);
      toast
       .success("تم حفظ الدرجات بنجاح!");
    } catch {
      // error state handled by RTK Query
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (quizLoading || sheetLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">جارٍ تحميل الاختبار...</span>
      </div>
    );
  }

  const students = sheetData?.data.students ?? [];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-4" dir="rtl">

      {/* ── Back link ── */}
      <Link
        href="/quizzes"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        العودة للاختبارات
      </Link>

      {/* ── Quiz info card ── */}
      {quiz && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                تصحيح الاختبار
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">{quiz.title}</h1>
              {group && (
                <p className="mt-0.5 text-sm text-slate-500">{group.name}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                {quiz.totalMarks} درجة
              </span>
              <span className="text-xs text-slate-400">
                {new Date(quiz.quizDate).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Summary pills ── */}
      {drafts.length > 0 && quiz && (
        <GradingSummary drafts={drafts} totalMarks={quiz.totalMarks} />
      )}

      {/* ── Student rows ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {students.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            لا يوجد طلاب مسجلون في هذه المجموعة.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((item) => {
              const draft = drafts.find((d) => d.studentId === item.student._id);
              if (!draft || !quiz) return null;
              return (
                <GradingRow
                  key={item.student._id}
                  studentId={item.student._id}
                  name={`${item.student.firstName} ${item.student.lastName}`}
                  totalMarks={quiz.totalMarks}
                  draft={draft}
                  onChange={(patch) => updateDraft(item.student._id, patch)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Sticky save bar ── */}
      {drafts.length > 0 && (
        <div className="sticky bottom-4 z-10">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || drafts.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3157D5] py-3.5 text-sm font-bold text-white transition hover:bg-[#243FA3] disabled:opacity-50"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ حفظ الدرجات...</>
              ) : savedOnce || isSavedOnce ? (
                <><CheckCircle className="h-4 w-4" /> تحديث الدرجات</>
              ) : (
                `حفظ درجات ${drafts.filter((d) => d.status === "graded").length} طالب`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
