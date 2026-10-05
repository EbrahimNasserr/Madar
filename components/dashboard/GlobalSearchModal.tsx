'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, User, Users, CalendarDays, Loader2, SearchX } from 'lucide-react'
import { useApp } from './app-context'
import { useDebounce } from '@/src/lib/hooks/useDebounce'
import { useGlobalSearchQuery, type SearchResult, type SearchResultType } from '@/src/lib/api/searchApi'

// ─── Icon map per result type ─────────────────────────────────────────────────

const TYPE_META: Record<
  SearchResultType,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  student: { icon: User,         label: 'طالب',   color: 'text-[#3157D5]', bg: 'bg-[#EAF0FF]' },
  group:   { icon: Users,        label: 'مجموعة', color: 'text-[#6D5EF5]', bg: 'bg-[#F3F0FF]' },
  session: { icon: CalendarDays, label: 'حصة',    color: 'text-[#12B76A]', bg: 'bg-[#ECFDF3]' },
}

// ─── Keyboard-aware result item ───────────────────────────────────────────────

function ResultItem({
  result,
  isHighlighted,
  onSelect,
  onMouseEnter,
}: {
  result:        SearchResult
  isHighlighted: boolean
  onSelect:      (r: SearchResult) => void
  onMouseEnter:  () => void
}) {
  const meta = TYPE_META[result.type]
  const Icon = meta.icon

  return (
    <button
      role="option"
      aria-selected={isHighlighted}
      onClick={() => onSelect(result)}
      onMouseEnter={onMouseEnter}
      className={[
        'w-full flex items-center gap-3 px-4 py-3 text-right transition-colors',
        isHighlighted ? 'bg-[#F7F8FC]' : 'hover:bg-[#F7F8FC]',
      ].join(' ')}
    >
      {/* Type icon */}
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg}`}>
        <Icon className={`w-4 h-4 ${meta.color}`} aria-hidden="true" />
      </span>

      {/* Text */}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-[#111827] truncate">{result.title}</span>
        {result.subtitle && (
          <span className="block text-xs text-[#667085] truncate">{result.subtitle}</span>
        )}
      </span>

      {/* Type badge */}
      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
        {meta.label}
      </span>
    </button>
  )
}

// ─── Group results by type with a divider label ───────────────────────────────

function groupResults(results: SearchResult[]) {
  const order: SearchResultType[] = ['student', 'group', 'session']
  const groups: { type: SearchResultType; items: SearchResult[] }[] = []

  for (const type of order) {
    const items = results.filter((r) => r.type === type)
    if (items.length) groups.push({ type, items })
  }

  return groups
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useApp()
  const router = useRouter()

  const [search, setSearch]           = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef    = useRef<HTMLInputElement>(null)
  const listRef     = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isFetching } = useGlobalSearchQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length < 2,
  })

  const results: SearchResult[] = data?.data?.results ?? []

  // ── Reset state when modal opens ──────────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen) {
      setSearch('')
      setHighlighted(0)
      // Small delay lets the modal animate in before focusing
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  // ── Reset highlight when results change ───────────────────────────────────
  useEffect(() => { setHighlighted(0) }, [results.length])

  // ── Close + navigate ──────────────────────────────────────────────────────
  const close = useCallback(() => {
    setIsSearchOpen(false)
    setSearch('')
  }, [setIsSearchOpen])

  const selectResult = useCallback(
    (result: SearchResult) => {
      close()
      router.push(result.url)
    },
    [close, router],
  )

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { close(); return }

    if (!results.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[highlighted]) selectResult(results[highlighted])
    }
  }

  // Scroll highlighted item into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  if (!isSearchOpen) return null

  const grouped = groupResults(results)
  const showEmpty =
    debouncedSearch.trim().length >= 2 && !isFetching && results.length === 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="البحث العام"
        className="fixed inset-x-4 top-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[70vh] animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100" dir="rtl">
          {isFetching
            ? <Loader2 className="w-5 h-5 text-[#3157D5] shrink-0 animate-spin" aria-label="جارٍ البحث" />
            : <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
          }

          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="بحث عن طالب، مجموعة، أو حصة..."
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none min-w-0"
            aria-autocomplete="list"
            aria-controls="search-results"
            autoComplete="off"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center shrink-0 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-[11px] font-mono text-gray-500">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="نتائج البحث"
          className="overflow-y-auto flex-1"
          dir="rtl"
        >
          {/* Idle / too short */}
          {debouncedSearch.trim().length < 2 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-[#9CA3AF]">
              <Search className="w-8 h-8 opacity-30" aria-hidden="true" />
              <p className="text-sm">اكتب حرفين على الأقل للبحث</p>
            </div>
          )}

          {/* No results */}
          {showEmpty && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-[#9CA3AF]">
              <SearchX className="w-8 h-8 opacity-30" aria-hidden="true" />
              <p className="text-sm">لا توجد نتائج لـ «{debouncedSearch}»</p>
            </div>
          )}

          {/* Grouped results */}
          {grouped.map(({ type, items }, gi) => {
            const meta  = TYPE_META[type]
            // Calculate flat index offset for keyboard highlighting
            const offset = grouped
              .slice(0, gi)
              .reduce((acc, g) => acc + g.items.length, 0)

            return (
              <div key={type}>
                {/* Section header */}
                <div className="px-4 py-1.5 flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-50">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-gray-400">({items.length})</span>
                </div>

                {items.map((result, i) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    isHighlighted={highlighted === offset + i}
                    onSelect={selectResult}
                    onMouseEnter={() => setHighlighted(offset + i)}
                  />
                ))}
              </div>
            )
          })}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div
            className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400"
            dir="rtl"
          >
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-gray-200 bg-white font-mono">↑↓</kbd>
              للتنقل
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-gray-200 bg-white font-mono">↵</kbd>
              للفتح
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-gray-200 bg-white font-mono">Esc</kbd>
              للإغلاق
            </span>
          </div>
        )}
      </div>
    </>
  )
}
