import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور | مدار",
  description: "اختر كلمة مرور جديدة لحسابك على مدار.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
