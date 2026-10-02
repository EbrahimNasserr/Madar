import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

// ─── Skeleton block ───────────────────────────────────────────────────────────
// Base building block — a shimmering rounded rectangle.

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-slate-100', className)}
      {...props}
    />
  )
}

// ─── Table row skeleton ───────────────────────────────────────────────────────
// Mimics one data row: avatar + two text lines + badge.

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr aria-hidden="true">
      {/* Avatar + name cell */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      </td>
      {/* Extra cells */}
      {Array.from({ length: cols - 2 }).map((_, i) => (
        <td key={i} className="px-5 py-4 hidden sm:table-cell">
          <Skeleton className="h-3 w-20" />
        </td>
      ))}
      {/* Status badge cell */}
      <td className="px-5 py-4">
        <Skeleton className="h-6 w-14 rounded-full" />
      </td>
    </tr>
  )
}

// ─── Table skeleton ───────────────────────────────────────────────────────────
// Renders `rows` skeleton rows inside a tbody.

export function TableSkeleton({
  rows = 6,
  cols = 4,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <tbody className="divide-y divide-slate-100" aria-busy="true" aria-label="جارٍ التحميل">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </tbody>
  )
}

// ─── Card skeleton ────────────────────────────────────────────────────────────
// Generic card placeholder — title + a few lines of content.

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-2xl border border-slate-200 bg-white p-6 space-y-4', className)}
    >
      <Skeleton className="h-4 w-40" />
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
// Small inline spinner — use inside buttons or next to text.

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn('animate-spin', className ?? 'w-4 h-4')}
    />
  )
}

// ─── Full-page loading state ──────────────────────────────────────────────────
// Centred spinner with optional label — for page-level transitions.

export function PageLoader({ label = 'جارٍ التحميل...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400"
    >
      <Spinner className="w-7 h-7" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

// ─── Inline fetching bar ──────────────────────────────────────────────────────
// Thin bar that appears at the bottom of a card during background refetches.

export function FetchingBar({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      aria-live="polite"
      aria-label="جارٍ تحديث البيانات"
      className="flex items-center gap-2 px-5 py-2 border-t border-slate-100 text-xs text-slate-400"
    >
      <Spinner className="w-3 h-3" />
      جارٍ تحديث البيانات...
    </div>
  )
}
