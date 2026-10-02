"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useRegisterMutation } from "@/src/lib/api/authApi";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setCredentials } from "@/src/features/auth/authSlice";
import { tokenStorage } from "@/src/lib/auth/tokenStorage";
import { getApiErrorMessage } from "@/src/lib/api/error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError("من فضلك أكمل البيانات المطلوبة.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (form.password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    try {
      const response = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      }).unwrap();

      const { user, accessToken, refreshToken } = response.data;

      tokenStorage.setTokens(accessToken, refreshToken);

      dispatch(setCredentials({ user, accessToken, refreshToken }));

      toast.success("تم إنشاء حسابك بنجاح");

      router.replace("/onboarding");
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-indigo-600">مَدار</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">أنشئ حسابك</h1>
          <p className="mt-2 text-sm text-slate-500">
            ابدأ إدارة طلابك وحصصك ومدفوعاتك من مكان واحد.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Name row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="الاسم الأول"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              autoComplete="given-name"
              required
            />
            <Input
              label="الاسم الأخير"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="البريد الإلكتروني"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
            required
          />

          <Input
            label="رقم الهاتف"
            type="tel"
            dir="ltr"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            autoComplete="tel"
          />

          <Input
            label="كلمة المرور"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            autoComplete="new-password"
            required
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            autoComplete="new-password"
            required
          />

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                جارٍ الإنشاء...
              </>
            ) : (
              "إنشاء الحساب"
            )}
          </Button>

          <p className="text-center text-sm text-slate-500">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
