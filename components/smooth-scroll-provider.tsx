'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { setLenisInstance, scrollToSection } from '@/src/lib/lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    setLenisInstance(lenis)

    // Drive Lenis with requestAnimationFrame
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])

  // When navigating cross-page with a hash (e.g. /pricing → /#features),
  // smooth-scroll to the target after the new content renders.
  useEffect(() => {
    if (!window.location.hash) return
    const timer = setTimeout(() => {
      scrollToSection(window.location.hash)
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return children
}
