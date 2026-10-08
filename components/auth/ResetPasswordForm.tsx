"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useResetPasswordMutation } from "@/src/lib/api/authApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import Logo from "@/public/logo_sidebar.png";

// ─── States ───────────────────────────────────────────────────────────────────
type ViewState = "form" | "success" | "expired";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [view, setView] = useState<ViewState>(token ? "form" : "expired");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("من فضلك أدخل كلمة المرور الجديدة.");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      setView("success");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      // Treat token-related errors as the "expired" state
      if (
        msg.includes("منتهي") ||
        msg.includes("غير صالح") ||
        msg.includes("الصلاحية")
      ) {
        setView("expired");
      } else {
        setError(msg);
      }
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
          <h1>اختر كلمة مرور قوية.</h1>
          <p>اجعل حسابك آمنًا باختيار كلمة مرور لا تقل عن ثمانية أحرف.</p>
        </div>
        <small>© 2026 Madar</small>
      </div>

      {/* ── Right card ── */}
      <section className="auth-card">
        <Link href="/" className="mobile-auth-logo">
          <span className="logo-mark" aria-hidden="true">م</span>
          مدار
        </Link>

        {/* ── Form view ── */}
        {view === "form" && (
          <>
            <p className="marketing-eyebrow">كلمة مرور جديدة</p>
            <h2>إعادة تعيين كلمة المرور</h2>
            <p className="auth-description">
              اختر كلمة مرور قوية لا تقل عن 8 أحرف.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* New password */}
              <label>
                كلمة المرور الجديدة
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    aria-required="true"
                    style={{ paddingLeft: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted-foreground, #444654)",
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {/* Confirm password */}
              <label>
                تأكيد كلمة المرور
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    aria-required="true"
                    style={{ paddingLeft: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted-foreground, #444654)",
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                {isLoading ? "جارٍ التعيين..." : "تعيين كلمة المرور"}
                {!isLoading && <ArrowLeft size={16} aria-hidden="true" />}
              </button>
            </form>

            <p className="auth-switch">
              <Link href="/login">العودة لتسجيل الدخول</Link>
            </p>
          </>
        )}

        {/* ── Success view ── */}
        {view === "success" && (
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
            <p className="marketing-eyebrow">تم بنجاح</p>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>
              تم تعيين كلمة المرور
            </h2>
            <p
              className="auth-description"
              style={{ maxWidth: "320px", margin: "0 auto" }}
            >
              كلمة مرورك الجديدة جاهزة. يمكنك الآن تسجيل الدخول.
            </p>
            <Link
              href="/login"
              className="marketing-button full"
              style={{ marginTop: "8px" }}
            >
              تسجيل الدخول
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* ── Expired / invalid token view ── */}
        {view === "expired" && (
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
            <AlertTriangle
              size={52}
              style={{ color: "var(--color-warning, #f59e0b)" }}
              aria-hidden="true"
            />
            <p className="marketing-eyebrow">الرابط منتهي</p>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>
              الرابط غير صالح
            </h2>
            <p
              className="auth-description"
              style={{ maxWidth: "320px", margin: "0 auto" }}
            >
              انتهت صلاحية رابط إعادة التعيين أو أنه غير صالح. اطلب رابطًا
              جديدًا.
            </p>
            <Link
              href="/forgot-password"
              className="marketing-button full"
              style={{ marginTop: "8px" }}
            >
              طلب رابط جديد
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <p className="auth-switch">
              <Link href="/login">العودة لتسجيل الدخول</Link>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
