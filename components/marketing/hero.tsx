'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { DashboardPreview } from './dashboard-preview'
import { ThreeOrbit } from './three-orbit'

/** Orbit icon — inline so it renders in the pill badge without an extra import */
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

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Three.js orbiting spheres — brand visual */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <ThreeOrbit />
      </div>

      {/* Madar Indigo radial mesh overlay — keeps text legible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 0% 50%, rgba(var(--background-rgb,255,255,255),0.82) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center gap-14">

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          {/* Orbit badge — brand positioning */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[12px] font-bold border border-primary/20 mb-5">
            <OrbitIcon />
            نظام تشغيل المعلم الحديث
          </div>

          {/* Headline — brand tagline as h1 */}
          <h1 className="m-0 text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.07] tracking-[-2px] text-foreground">
            كُل شَغَلَك
            <br />
            <span className="text-primary">كَمُدَرِّس.</span>
          </h1>

          {/* Tagline sub-headline */}
          <p className="mt-3 text-[clamp(18px,2vw,22px)] font-semibold text-muted-foreground leading-[1.4]">
            في مَكَان وَاحِد.
          </p>

          {/* Brand description */}
          <p className="mt-4 text-[17px] leading-[1.85] text-muted-foreground max-w-[460px]">
            مَدار يجمع مجموعاتك، حضورك، مصروفاتك، ودرجات طلابك في مدار واحد — بدون ورق، بدون تشتت.
          </p>

          {/* CTA actions */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-gradient-to-b from-[#3157d5] to-primary text-white text-[14.5px] font-bold shadow-[0_6px_20px_rgba(6,60,188,0.28)] hover:opacity-90 hover:-translate-y-px transition-all no-underline"
            >
              ابدأ مجانًا <ArrowLeft size={16} strokeWidth={2.5} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-border text-foreground text-[14.5px] font-bold hover:bg-muted hover:border-primary/30 hover:text-primary hover:-translate-y-px transition-all no-underline"
            >
              اكتشف مَدار
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-5 mt-5 text-[12px] text-muted-foreground">
            {['بدون بطاقة ائتمان', 'مصمم للموبايل', 'إعداد في دقيقتين'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} strokeWidth={2.5} className="text-primary" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <DashboardPreview />
      </div>
    </section>
  )
}
