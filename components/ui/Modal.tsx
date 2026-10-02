'use client'

import * as React from 'react'
import { X, AlertCircle } from 'lucide-react'
import { cn } from '@/src/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg'

export type ModalProps = {
  /** Accessible label for screen readers */
  title: string
  /** Whether the title is rendered as a visible heading (default: true) */
  showTitle?: boolean
  onClose: () => void
  size?: ModalSize
  /** Snap to bottom on mobile, centred on sm+ (default: true) */
  mobileSnap?: boolean
  children: React.ReactNode
  className?: string
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function Modal({
  title,
  showTitle = true,
  onClose,
  size = 'md',
  mobileSnap = true,
  children,
  className,
}: ModalProps) {
  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll while open
  React.useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]',
        'flex justify-center',
        mobileSnap ? 'items-end sm:items-center' : 'items-center',
        'p-4',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          'w-full rounded-2xl bg-white shadow-2xl overflow-hidden',
          'animate-in fade-in-0 slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95',
          'duration-200',
          sizeMap[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showTitle && <ModalHeader title={title} onClose={onClose} />}
        {children}
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function ModalHeader({
  title,
  onClose,
  className,
}: {
  title: string
  onClose: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-slate-100',
        className,
      )}
    >
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <button
        onClick={onClose}
        aria-label="إغلاق"
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export function ModalBody({
  children,
  className,
  scrollable = true,
}: {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
}) {
  return (
    <div
      className={cn(
        'px-6 py-5 space-y-4',
        scrollable && 'max-h-[70vh] overflow-y-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4',
        'border-t border-slate-100 bg-slate-50/60',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Error banner ─────────────────────────────────────────────────────────────

export function ModalError({
  message,
  className,
}: {
  message: string | null | undefined
  className?: string
}) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-xl',
        'bg-red-50 border border-red-100 px-4 py-3',
        'text-sm text-red-700',
        className,
      )}
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
