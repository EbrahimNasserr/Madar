"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen } from "lucide-react";

import FeatureGuard from "@/components/auth/FeatureGuard";
import { FEATURES } from "@/src/constants/features";
import { useGetQuizzesQuery } from "@/src/lib/api/quizzesApi";
import type { Quiz } from "@/src/lib/api/quizzesApi";
import QuizCreateModal from "./QuizCreateModal";
import ProFeatureCard from "../subscription/ProFeatureCard";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Quiz["status"], string> = {
  draft:     "bg-slate-100 text-slate-500",
  published: "bg-emerald-50 text-emerald-700",
  archived:  "bg-amber-50  text-amber-700",
};

const STATUS_LABELS: Record<Quiz["status"], string> = {
  draft:     "مسودة",
  published: "منشور",
  archived:  "مؤرشف",
};

// ─── Quiz card ────────────────────────────────────────────────────────────────

function QuizCard({ quiz }: { quiz: Quiz }) {
  const group = typeof quiz.groupId === "object" ? quiz.groupId : null;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-bold text-slate-950">{quiz.title}</h2>
          {group && (
            <p className="mt-0.5 truncate text-sm text-slate-500">{group.name}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[quiz.status]}`}
        >
          {STATUS_LABELS[quiz.status]}
        </span>
      </div>

      {/* Meta row */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>
          {new Date(quiz.quizDate).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {quiz.totalMarks} درجة
        </span>
      </div>

      {/* Action */}
      <Link
        href={`/quizzes/${quiz._id}/grading`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <BookOpen className="h-4 w-4" />
        فتح الاختبار
      </Link>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
        📝
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950">لا توجد اختبارات بعد</h3>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        أنشئ أول اختبار لطلابك وابدأ في تسجيل الدرجات.
      </p>
      <button
        onClick={onNew}
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        + اختبار جديد
      </button>
    </div>
  );
}

// ─── Inner content (behind the feature guard) ─────────────────────────────────

function QuizzesContent() {
  const { data, isLoading } = useGetQuizzesQuery();
  const [createOpen, setCreateOpen] = useState(false);

  const quizzes = data?.data.quizzes ?? [];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">الاختبارات</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">اختبارات الطلاب</h1>
          <p className="mt-2 text-sm text-slate-500">
            أنشئ اختبارًا وسجّل الدرجات وتابع الأداء.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + اختبار جديد
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">جارٍ تحميل الاختبارات...</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && quizzes.length === 0 && (
        <EmptyState onNew={() => setCreateOpen(true)} />
      )}

      {/* Grid */}
      {!isLoading && quizzes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <QuizCreateModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}

// ─── Page export (wrapped in feature guard) ───────────────────────────────────

export default function QuizzesPage() {
  return (
    <FeatureGuard
      feature={FEATURES.QUIZZES}
      fallback={
        <ProFeatureCard
          title="الاختبارات متاحة في Pro"
          description="أنشئ الاختبارات وسجّل درجات الطلاب وتابع تطور مستواهم — متاح في خطة Pro."
        />
      }
    >
      <QuizzesContent />
    </FeatureGuard>
  );
}
