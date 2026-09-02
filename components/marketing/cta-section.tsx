import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

/** Orbit icon repeated in the CTA eyebrow */
function OrbitIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="13" ry="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="16" cy="16" rx="13" ry="6.5" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" transform="rotate(60 16 16)" opacity=".5" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <circle cx="28.5" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

export function CtaSection() {
  return (
    <section className="py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#3157d5] to-primary px-20 py-20 text-center text-white max-lg:px-10 max-lg:py-14">
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-[-60px]"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
          />

          {/* Orbit eyebrow */}
          <p className="relative inline-flex items-center justify-center gap-2 text-white/70 text-[12px] font-extrabold uppercase tracking-[0.4px] mb-2">
            <OrbitIcon />
            ادخل مَدارك
          </p>

          {/* Headline — brand tagline */}
          <h2 className="relative m-0 text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.1] tracking-[-1.8px] text-white mt-1">
            كُل شَغَلَك كَمُدَرِّس<br />
            <span className="text-white/80">في مَكَان وَاحِد.</span>
          </h2>

          <p className="relative mt-5 text-[16px] leading-[1.8] text-white/75 max-w-[480px] mx-auto">
            مَدار مش مجرد تطبيق — هو المركز اللي بتدور حواليه حصصك، طلابك، وأرباحك.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-3.5 mt-9">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white text-primary text-[14.5px] font-bold shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-[#f1f3ff] hover:-translate-y-px transition-all no-underline"
            >
              ابدأ مع مَدار <ArrowLeft size={16} strokeWidth={2.5} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white/12 text-white border border-white/25 text-[14.5px] font-bold hover:bg-white/22 hover:-translate-y-px transition-all no-underline"
            >
              شوف الخطط
            </Link>
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-6 mt-6 text-[12.5px] text-white/60">
            {['بدون بطاقة ائتمان', 'مصمم للموبايل', 'إعداد في دقيقتين'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
