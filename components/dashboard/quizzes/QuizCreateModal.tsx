"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

import { useGetGroupsQuery } from "@/src/lib/api/groupsApi";
import { useCreateQuizMutation } from "@/src/lib/api/quizzesApi";

type Props = { onClose: () => void };

export default function QuizCreateModal({ onClose }: Props) {
  const { data: groupsData } = useGetGroupsQuery();
  const [createQuiz, { isLoading }] = useCreateQuizMutation();

  const groups = groupsData?.data.groups ?? [];

  const [form, setForm] = useState({
    groupId:     "",
    title:       "",
    description: "",
    quizDate:    "",
    totalMarks:  20,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.groupId || !form.title || !form.quizDate) return;

    try {
      await createQuiz({
        groupId:     form.groupId,
        title:       form.title,
        description: form.description || undefined,
        quizDate:    form.quizDate,
        totalMarks:  Number(form.totalMarks),
      }).unwrap();
      onClose();
    } catch {
      // errors surfaced by RTK Query
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">اختبار جديد</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">المجموعة</label>
            <select
              required
              value={form.groupId}
              onChange={(e) => set("groupId", e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">اختر المجموعة...</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">عنوان الاختبار</label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="مثال: اختبار الفصل الأول"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date + Total marks (side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">تاريخ الاختبار</label>
              <input
                required
                type="date"
                value={form.quizDate}
                onChange={(e) => set("quizDate", e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">الدرجة الكاملة</label>
              <input
                required
                type="number"
                min={1}
                value={form.totalMarks}
                onChange={(e) => set("totalMarks", Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description (optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              ملاحظات{" "}
              <span className="font-normal text-slate-400">(اختياري)</span>
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="أي تفاصيل إضافية عن الاختبار..."
              className="resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ...</>
              ) : (
                "إنشاء الاختبار"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
