'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Logo } from './logo'

const navLinks = [
  { label: 'المميزات',        href: '#features' },
  { label: 'كيف يعمل؟',      href: '#workflow' },
  { label: 'الأسعار',         href: '/pricing'  },
  { label: 'الأسئلة الشائعة', href: '#faq'      },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 min-h-[72px] flex items-center justify-between gap-8">

        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex md:flex-row items-center gap-1">
          {navLinks.map(({ label, href }) =>
            href.startsWith('#') ? (
              <a
                key={href}
                href={href}
                className="text-muted-foreground text-[13.5px] px-3 py-1.5 rounded-md hover:text-primary hover:bg-muted transition-colors duration-150 no-underline"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground text-[13.5px] px-3 py-1.5 rounded-md hover:text-primary hover:bg-muted transition-colors duration-150 no-underline"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-muted-foreground text-[13.5px] font-semibold hover:text-primary transition-colors no-underline"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-b from-[#3157d5] to-primary text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(6,60,188,0.25)] hover:opacity-90 hover:-translate-y-px transition-all no-underline"
          >
            ابدأ مع مَدار <ArrowLeft size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 text-foreground cursor-pointer bg-transparent border-0"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full right-3 left-3 bg-card border border-border rounded-xl shadow-[0_16px_40px_rgba(6,60,188,0.10)] p-3 z-50">
          {navLinks.map(({ label, href }) =>
            href.startsWith('#') ? (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-muted-foreground text-[14px] hover:bg-muted hover:text-primary no-underline"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-muted-foreground text-[14px] hover:bg-muted hover:text-primary no-underline"
              >
                {label}
              </Link>
            )
          )}
          <div className="mt-2 pt-2 border-t border-border flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 rounded-lg border border-border text-muted-foreground text-[13px] font-semibold no-underline hover:bg-muted"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center py-2.5 rounded-lg bg-primary text-white text-[13px] font-bold no-underline hover:opacity-90"
            >
              ابدأ مع مَدار
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
