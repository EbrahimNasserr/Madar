import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور | مدار",
  description: "أدخل بريدك الإلكتروني لاستقبال رابط إعادة تعيين كلمة المرور.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
