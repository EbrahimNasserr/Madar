"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  BookOpen,
  Users,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useAppSelector } from "@/src/lib/store/hooks";
import {
  useCreateGroupMutation,
  type CreateGroupInput,
} from "@/src/lib/api/groupsApi";
import {
  useCreateStudentMutation,
  type StudentFormData,
} from "@/src/lib/api/studentsApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import { GroupForm } from "@/components/dashboard/groups/GroupForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── localStorage key ─────────────────────────────────────────────────────────

export const ONBOARDING_KEY = "madar_onboarding_done";

// ─── Steps ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "group" | "student" | "done";

const STEPS: Step[] = ["welcome", "group", "student", "done"];

function ProgressBar({ step }: { step: Step }) {
  const active = STEPS.indexOf(step);
  const labels = ["مرحبًا", "المجموعة", "الطالب", "انتهى"];
  const icons = [Sparkles, BookOpen, Users, CheckCircle2];

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const Icon = icons[i];
        const done = i < active;
        const current = i === active;

        return (
          <div key={s} className="flex items-center">
            {/* Circle */}
            <div
              className={[
                "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                done
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : current
                  ? "border-indigo-600 bg-white text-indigo-600"
                  : "border-slate-200 bg-white text-slate-400",
              ].join(" ")}
            >
              {done ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Icon className="size-4" />
              )}
            </div>

            {/* Label */}
            <span
              className={[
                "hidden sm:block ms-2 text-xs font-medium",
                current ? "text-indigo-600" : done ? "text-slate-600" : "text-slate-400",
              ].join(" ")}
            >
              {labels[i]}
            </span>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mx-3 h-px w-10 sm:w-16 transition-all",
                  done ? "bg-indigo-600" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step: Welcome ────────────────────────────────────────────────────────────

function WelcomeStep({
  firstName,
  onNext,
}: {
  firstName: string;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-indigo-50">
        <Sparkles className="size-9 text-indigo-600" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-950">
          أهلًا{firstName ? `، ${firstName}` : ""} 👋
        </h1>
        <p className="mx-auto max-w-sm text-base text-slate-500 leading-relaxed">
          هنساعدك تعمل أول مجموعة وتضيف أول طالب — عشان تبدأ تشتغل على طول.
        </p>
        <p className="text-sm text-slate-400">بيأخد أقل من دقيقتين.</p>
      </div>

      <Button onClick={onNext} size="lg" className="gap-2">
        <span>يلا نبدأ</span>
        <ArrowLeft className="size-4" />
      </Button>
    </div>
  );
}

// ─── Step: Create Group ───────────────────────────────────────────────────────

function GroupStep({
  onNext,
  onSkip,
}: {
  onNext: (groupId: string) => void;
  onSkip: () => void;
}) {
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateGroupInput) => {
    setError(null);
    try {
      const res = await createGroup(data).unwrap();
      toast.success("تم إنشاء المجموعة");
      onNext(res.data.group._id);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-950">أنشئ أول مجموعة</h2>
        <p className="text-sm text-slate-500">
          المجموعة هي الوحدة الأساسية في مدار — بتجمع الطلاب والحصص والمدفوعات.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <GroupForm isSubmitting={isLoading} onSubmit={handleSubmit} />

      <button
        type="button"
        onClick={onSkip}
        className="mt-2 block w-full text-center text-sm text-slate-400 hover:text-slate-600 transition"
      >
        تخطي هذه الخطوة
      </button>
    </div>
  );
}

// ─── Step: Add Student ────────────────────────────────────────────────────────

function StudentStep({
  groupId,
  onNext,
  onSkip,
}: {
  groupId: string | null;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    grade: "",
  });

  const set = (field: keyof StudentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("الاسم الأول والأخير مطلوبان.");
      return;
    }

    const payload: StudentFormData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      ...(form.phone?.trim() && { phone: form.phone.trim() }),
      ...(form.parentName?.trim() && { parentName: form.parentName.trim() }),
      ...(form.parentPhone?.trim() && { parentPhone: form.parentPhone.trim() }),
      ...(form.grade?.trim() && { grade: form.grade.trim() }),
    };

    try {
      await createStudent(payload).unwrap();
      toast.success("تم إضافة الطالب");
      onNext();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-950">أضف أول طالب</h2>
        <p className="text-sm text-slate-500">
          {groupId
            ? "سيُضاف الطالب تلقائيًا إلى المجموعة اللي أنشأتها."
            : "أضف طالبًا لتبدأ متابعة أدائه ومدفوعاته."}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="الاسم الأول"
            required
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="أحمد"
          />
          <Input
            label="اسم العائلة"
            required
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="محمد"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="رقم الهاتف"
            type="tel"
            dir="ltr"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="01xxxxxxxxx"
          />
          <Input
            label="اسم ولي الأمر"
            value={form.parentName ?? ""}
            onChange={(e) => set("parentName", e.target.value)}
            placeholder="محمد أحمد"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="هاتف ولي الأمر"
            type="tel"
            dir="ltr"
            value={form.parentPhone ?? ""}
            onChange={(e) => set("parentPhone", e.target.value)}
            placeholder="01xxxxxxxxx"
          />
          <Input
            label="المرحلة الدراسية"
            value={form.grade ?? ""}
            onChange={(e) => set("grade", e.target.value)}
            placeholder="الثالث الثانوي"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            تخطي
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-[#3157D5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
          >
            {isLoading ? "جارٍ الإضافة..." : "إضافة الطالب"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Step: Done ───────────────────────────────────────────────────────────────

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 className="size-9 text-green-600" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-950">كل حاجة جاهزة!</h1>
        <p className="mx-auto max-w-sm text-base text-slate-500 leading-relaxed">
          حسابك شغال ومستعد. روح لـ Dashboard وابدأ شغلك.
        </p>
      </div>

      <Button onClick={onFinish} size="lg" className="gap-2">
        <span>اذهب إلى Dashboard</span>
        <ArrowLeft className="size-4" />
      </Button>
    </div>
  );
}

// ─── Root Wizard ──────────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [step, setStep] = useState<Step>("welcome");
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

  const finish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "1");
    }
    router.replace("/dashboard");
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-start px-4 py-12"
      dir="rtl"
    >
      {/* Logo / brand */}
      <p className="mb-10 text-sm font-bold text-indigo-600 tracking-wide">مَدار</p>

      {/* Progress */}
      {step !== "done" && (
        <div className="mb-10">
          <ProgressBar step={step} />
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {step === "welcome" && (
          <WelcomeStep
            firstName={user?.firstName ?? ""}
            onNext={() => setStep("group")}
          />
        )}

        {step === "group" && (
          <GroupStep
            onNext={(groupId) => {
              setCreatedGroupId(groupId);
              setStep("student");
            }}
            onSkip={() => setStep("student")}
          />
        )}

        {step === "student" && (
          <StudentStep
            groupId={createdGroupId}
            onNext={() => setStep("done")}
            onSkip={() => setStep("done")}
          />
        )}

        {step === "done" && <DoneStep onFinish={finish} />}
      </div>

      {/* Skip all */}
      {step !== "welcome" && step !== "done" && (
        <button
          type="button"
          onClick={finish}
          className="mt-6 text-xs text-slate-400 hover:text-slate-600 transition"
        >
          تخطي الإعداد والذهاب إلى Dashboard
        </button>
      )}
    </div>
  );
}
