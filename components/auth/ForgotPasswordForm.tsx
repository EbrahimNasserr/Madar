"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import { useForgotPasswordMutation } from "@/src/lib/api/authApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import Logo from "@/public/logo_sidebar.png";

// ─── States ───────────────────────────────────────────────────────────────────
type ViewState = "form" | "success";

export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [view, setView] = useState<ViewState>("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("من فضلك أدخل بريدك الإلكتروني.");
      return;
    }

    try {
      await forgotPassword({ email: trimmed }).unwrap();
      setView("success");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <main className="auth-page" dir="rtl">
      {/* ── Left panel ── */}
      <div className="auth-aside">
        <Link href="/" className="marketing-logo">
          <Image src={Logo} alt="مدار" width={80} height={80} loading="lazy" />
        </Link>
        <div>
          <p className="marketing-eyebrow">مدار</p>
          <h1>استعد حسابك بسهولة.</h1>
          <p>
            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
            خلال دقائق.
          </p>
        </div>
        <small>© 2026 Madar</small>
      </div>

      {/* ── Right card ── */}
      <section className="auth-card">
        {/* Mobile logo */}
        <Link href="/" className="mobile-auth-logo">
          <span className="logo-mark" aria-hidden="true">م</span>
          مدار
        </Link>

        {view === "form" ? (
          <>
            <p className="marketing-eyebrow">نسيت كلمة المرور؟</p>
            <h2>إعادة تعيين كلمة المرور</h2>
            <p className="auth-description">
              أدخل بريدك الإلكتروني المسجّل وسنرسل لك رابط إعادة التعيين.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label>
                البريد الإلكتروني
                <input
                  type="email"
                  name="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  style={{
                    color: "var(--color-error, #ef4444)",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="marketing-button full"
                disabled={isLoading}
              >
                {isLoading ? "جارٍ الإرسال..." : "أرسل رابط الاستعادة"}
                {!isLoading && <ArrowLeft size={16} aria-hidden="true" />}
              </button>
            </form>

            <p className="auth-switch">
              تذكّرت كلمة المرور؟{" "}
              <Link href="/login">تسجيل الدخول</Link>
            </p>
          </>
        ) : (
          /* ── Success state ── */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
              padding: "16px 0",
            }}
          >
            <CheckCircle
              size={52}
              style={{ color: "var(--primary, #063cbc)" }}
              aria-hidden="true"
            />
            <p className="marketing-eyebrow">تم الإرسال</p>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>تحقق من بريدك</h2>
            <p
              className="auth-description"
              style={{ maxWidth: "320px", margin: "0 auto" }}
            >
              أرسلنا رابط إعادة تعيين كلمة المرور إلى{" "}
              <strong dir="ltr">{email}</strong>. تحقق من صندوق الوارد وربما
              مجلد البريد غير المرغوب فيه.
            </p>

            <button
              type="button"
              className="marketing-button full"
              onClick={() => {
                setView("form");
                setError(null);
              }}
              style={{ marginTop: "8px" }}
            >
              <ArrowRight size={16} aria-hidden="true" />
              تغيير البريد الإلكتروني
            </button>

            <p className="auth-switch" style={{ marginTop: "8px" }}>
              <Link href="/login">العودة لتسجيل الدخول</Link>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
