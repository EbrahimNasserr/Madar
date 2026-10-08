'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, Check, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/public/logo_sidebar.png'
import { useLoginMutation } from '@/src/lib/api/authApi'
import { useAppDispatch } from '@/src/lib/store/hooks'
import { setCredentials } from '@/src/features/auth/authSlice'
import { tokenStorage } from '@/src/lib/auth/tokenStorage'

export default function MadarAuth({ signup = false }: { signup?: boolean }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const result = await login({ email, password }).unwrap()

      // Persist tokens to localStorage
      tokenStorage.setTokens(result.data.accessToken, result.data.refreshToken)

      // Hydrate Redux store
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        })
      )

      router.replace('/dashboard')
    } catch {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
    }
  }

  return (
    <main className="auth-page" dir="rtl">
      <div className="auth-aside">
        <Link href="/" className="marketing-logo">
          <Image src={Logo} alt="logo" width={80} height={80} loading="lazy" />
        </Link>
        <div>
          <p className="marketing-eyebrow">Madar</p>
          <h1>{signup ? 'ابدأ تنظيم حصصك.' : 'إدارة حصصك أسهل.'}</h1>
          <p>من أول المجموعة لحد متابعة أداء الطلاب، كل حاجة في مكان واحد.</p>
          <div className="auth-perk"><Check /> حضور بدون ورق</div>
          <div className="auth-perk"><Check /> مصروفات واضحة</div>
          <div className="auth-perk"><Check /> نظام معمول للمدرس</div>
        </div>
        <small>© 2026 Madar</small>
      </div>

      <section className="auth-card">
        <Link href="/" className="mobile-auth-logo">
          <span className="logo-mark"><GraduationCap size={18} /></span>
          Teacher<span>OS</span>
        </Link>

        <p className="marketing-eyebrow">{signup ? 'ابدأ مجانًا' : 'مرحبًا بعودتك'}</p>
        <h2>{signup ? 'ابدأ تنظيم حصصك' : 'مرحبًا بعودتك 👋'}</h2>
        <p className="auth-description">
          {signup
            ? 'أنشئ حسابك وابدأ في ترتيب يومك.'
            : 'سجل دخولك للوصول إلى لوحة التحكم.'}
        </p>

        <form onSubmit={submit}>
          {signup && (
            <div className="auth-row">
              <label>
                الاسم الأول
                <input name="firstName" required placeholder="أحمد" />
              </label>
              <label>
                اسم العائلة
                <input name="lastName" required placeholder="محمد" />
              </label>
            </div>
          )}
          {signup && (
            <label>
              رقم الهاتف
              <input name="phone" required type="tel" placeholder="01xxxxxxxxx" />
            </label>
          )}

          <label>
            البريد الإلكتروني
            <input name="email" required type="email" placeholder="ahmed@example.com" />
          </label>
          <div>
            <label style={{ marginBottom: "7px" }}>
              كلمة المرور
              <input name="password" required type="password" placeholder="••••••••" />
            </label>
            {!signup && (
              <div style={{ textAlign: "left", marginTop: "6px" }}>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: "12px",
                    color: "var(--primary, #063cbc)",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" style={{ color: 'var(--color-error, #ef4444)', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}

          <button className="marketing-button full" type="submit" disabled={isLoading}>
            {isLoading
              ? 'جارٍ التحقق...'
              : signup
              ? 'إنشاء حساب'
              : 'تسجيل الدخول'}{' '}
            <ArrowLeft size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {signup ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
          <Link href={signup ? '/login' : '/signup'}>
            {signup ? 'تسجيل الدخول' : 'ابدأ مجانًا'}
          </Link>
        </p>
      </section>
    </main>
  )
}
